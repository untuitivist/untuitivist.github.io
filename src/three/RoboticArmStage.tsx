import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  ARM_DIMENSIONS,
  sampleArmTrajectory,
  type ArmJointAngles,
} from './kinematics';
import {
  attachStudioEnvironment,
  createCalibratedRenderer,
  isSoftwareWebGL,
  scheduleAfterDraw,
} from './webglGuard';

interface RoboticArmStageProps {
  angles: ArmJointAngles;
  autoMotion: boolean;
  onAutoAngles?: (next: ArmJointAngles) => void;
}

export const RoboticArmStage: React.FC<RoboticArmStageProps> = ({
  angles,
  autoMotion,
  onAutoAngles,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const anglesRef = useRef<ArmJointAngles>(angles);
  const autoRef = useRef<boolean>(autoMotion);
  const onAutoRef = useRef(onAutoAngles);
  const triggerRenderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    anglesRef.current = angles;
    triggerRenderRef.current?.();
  }, [angles]);

  useEffect(() => {
    autoRef.current = autoMotion;
    triggerRenderRef.current?.();
  }, [autoMotion]);

  useEffect(() => {
    onAutoRef.current = onAutoAngles;
  }, [onAutoAngles]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const softGl = isSoftwareWebGL();
    const width = Math.max(container.clientWidth, 300);
    const height = Math.max(container.clientHeight, 260);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = createCalibratedRenderer(width, height, softGl);
    } catch {
      return;
    }

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090D15');
    scene.fog = new THREE.Fog('#090D15', 8, 22);
    const envTex = attachStudioEnvironment(scene, renderer);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 60);
    camera.position.set(3.5, 2.9, 4.1);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !softGl;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 1.55, 0);
    controls.minDistance = 2.4;
    controls.maxDistance = 8.5;
    controls.maxPolarAngle = Math.PI * 0.49;

    const keyLight = new THREE.DirectionalLight('#fff4e0', 2.4);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight('#7dd3fc', '#111827', 1.1);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight('#5eead4', 1.2);
    rimLight.position.set(-5, 3, -5);
    scene.add(rimLight);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    // Ground plane & coordinate grid
    const floorGeo = new THREE.CircleGeometry(6.5, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#0c121e',
      roughness: 0.85,
      metalness: 0.12,
    });
    geometries.push(floorGeo);
    materials.push(floorMat);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const grid = new THREE.GridHelper(9, 18, '#334155', '#151e2e');
    grid.position.y = 0.015;
    scene.add(grid);

    // Contact shadow disc under pedestal
    const shadowGeo = new THREE.CircleGeometry(0.85, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: '#020408',
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    geometries.push(shadowGeo);
    materials.push(shadowMat);
    const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
    shadowDisc.rotation.x = -Math.PI / 2;
    shadowDisc.position.y = 0.02;
    scene.add(shadowDisc);

    // PBR Materials with distinct roughness/metalness contrast
    const darkAnodized = new THREE.MeshStandardMaterial({
      color: '#1e293b',
      metalness: 0.78,
      roughness: 0.48,
    });
    const machinedAlloy = new THREE.MeshStandardMaterial({
      color: '#cbd5e1',
      metalness: 0.92,
      roughness: 0.18,
    });
    const matteHousing = new THREE.MeshStandardMaterial({
      color: '#0f172a',
      metalness: 0.35,
      roughness: 0.72,
    });
    const accentCyan = new THREE.MeshStandardMaterial({
      color: '#5eead4',
      metalness: 0.4,
      roughness: 0.25,
      emissive: '#5eead4',
      emissiveIntensity: 0.55,
    });
    const accentLime = new THREE.MeshStandardMaterial({
      color: '#d4f0a0',
      metalness: 0.3,
      roughness: 0.2,
      emissive: '#d4f0a0',
      emissiveIntensity: 0.8,
    });
    materials.push(darkAnodized, machinedAlloy, matteHousing, accentCyan, accentLime);

    const { pedestalHeight, shoulderHeight, upperArmLength, forearmLength, wristLength } =
      ARM_DIMENSIONS;

    // Pedestal (grounded at y=0)
    const baseFlangeGeo = new THREE.CylinderGeometry(0.56, 0.64, 0.14, 32);
    const pedestalBodyGeo = new THREE.CylinderGeometry(0.4, 0.46, pedestalHeight - 0.14, 32);
    const collarGeo = new THREE.TorusGeometry(0.41, 0.025, 12, 32);
    geometries.push(baseFlangeGeo, pedestalBodyGeo, collarGeo);

    const baseFlange = new THREE.Mesh(baseFlangeGeo, matteHousing);
    baseFlange.position.y = 0.07;
    const pedestalBody = new THREE.Mesh(pedestalBodyGeo, darkAnodized);
    pedestalBody.position.y = 0.14 + (pedestalHeight - 0.14) / 2;
    const baseCollar = new THREE.Mesh(collarGeo, accentCyan);
    baseCollar.rotation.x = Math.PI / 2;
    baseCollar.position.y = pedestalHeight;
    scene.add(baseFlange, pedestalBody, baseCollar);

    // Joint 1: Waist Yaw
    const j1Group = new THREE.Group();
    j1Group.position.y = pedestalHeight;
    scene.add(j1Group);

    const turretGeo = new THREE.CylinderGeometry(0.34, 0.38, shoulderHeight * 0.7, 28);
    const clevisGeo = new THREE.BoxGeometry(0.32, shoulderHeight * 0.65, 0.46);
    geometries.push(turretGeo, clevisGeo);

    const turret = new THREE.Mesh(turretGeo, machinedAlloy);
    turret.position.y = shoulderHeight * 0.35;
    const clevis = new THREE.Mesh(clevisGeo, darkAnodized);
    clevis.position.y = shoulderHeight * 0.78;
    j1Group.add(turret, clevis);

    // Joint 2: Shoulder Pitch
    const j2Group = new THREE.Group();
    j2Group.position.y = shoulderHeight;
    j1Group.add(j2Group);

    const drumGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.52, 24);
    drumGeo.rotateX(Math.PI / 2);
    const upperBeamGeo = new THREE.BoxGeometry(0.22, upperArmLength, 0.26);
    const upperRibGeo = new THREE.BoxGeometry(0.08, upperArmLength * 0.84, 0.3);
    geometries.push(drumGeo, upperBeamGeo, upperRibGeo);

    const shoulderDrum = new THREE.Mesh(drumGeo, machinedAlloy);
    const upperBeam = new THREE.Mesh(upperBeamGeo, darkAnodized);
    upperBeam.position.y = upperArmLength / 2;
    const upperRib = new THREE.Mesh(upperRibGeo, accentCyan);
    upperRib.position.y = upperArmLength / 2;
    j2Group.add(shoulderDrum, upperBeam, upperRib);

    // Joint 3: Elbow Pitch
    const j3Group = new THREE.Group();
    j3Group.position.y = upperArmLength;
    j2Group.add(j3Group);

    const elbowDrumGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.42, 24);
    elbowDrumGeo.rotateX(Math.PI / 2);
    const forearmTubeGeo = new THREE.CylinderGeometry(0.11, 0.145, forearmLength, 24);
    geometries.push(elbowDrumGeo, forearmTubeGeo);

    const elbowDrum = new THREE.Mesh(elbowDrumGeo, machinedAlloy);
    j3Group.add(elbowDrum);

    // Joint 4: Forearm Roll
    const j4Group = new THREE.Group();
    j3Group.add(j4Group);

    const forearmTube = new THREE.Mesh(forearmTubeGeo, matteHousing);
    forearmTube.position.y = forearmLength / 2;
    const forearmBandGeo = new THREE.TorusGeometry(0.132, 0.016, 10, 28);
    geometries.push(forearmBandGeo);
    const forearmBand = new THREE.Mesh(forearmBandGeo, accentCyan);
    forearmBand.rotation.x = Math.PI / 2;
    forearmBand.position.y = forearmLength * 0.65;
    j4Group.add(forearmTube, forearmBand);

    // Joint 5: Wrist Pitch
    const j5Group = new THREE.Group();
    j5Group.position.y = forearmLength;
    j4Group.add(j5Group);

    const wristDrumGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.28, 20);
    wristDrumGeo.rotateX(Math.PI / 2);
    const wristStemGeo = new THREE.CylinderGeometry(0.085, 0.095, wristLength * 0.6, 20);
    geometries.push(wristDrumGeo, wristStemGeo);

    const wristDrum = new THREE.Mesh(wristDrumGeo, machinedAlloy);
    const wristStem = new THREE.Mesh(wristStemGeo, darkAnodized);
    wristStem.position.y = wristLength * 0.3;
    j5Group.add(wristDrum, wristStem);

    // Joint 6: Tool Flange & Parallel Gripper
    const j6Group = new THREE.Group();
    j6Group.position.y = wristLength * 0.65;
    j5Group.add(j6Group);

    const flangeGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.06, 20);
    const gripperBarGeo = new THREE.BoxGeometry(0.24, 0.05, 0.08);
    const fingerGeo = new THREE.BoxGeometry(0.032, 0.16, 0.045);
    const tcpGeo = new THREE.SphereGeometry(0.042, 16, 16);
    geometries.push(flangeGeo, gripperBarGeo, fingerGeo, tcpGeo);

    const flange = new THREE.Mesh(flangeGeo, machinedAlloy);
    const gripperBar = new THREE.Mesh(gripperBarGeo, matteHousing);
    gripperBar.position.y = 0.055;
    const leftFinger = new THREE.Mesh(fingerGeo, machinedAlloy);
    leftFinger.position.set(-0.085, 0.145, 0);
    const rightFinger = new THREE.Mesh(fingerGeo, machinedAlloy);
    rightFinger.position.set(0.085, 0.145, 0);
    const tcpBeacon = new THREE.Mesh(tcpGeo, accentLime);
    tcpBeacon.position.y = wristLength * 0.35;
    j6Group.add(flange, gripperBar, leftFinger, rightFinger, tcpBeacon);

    const applyAngles = (a: ArmJointAngles) => {
      j1Group.rotation.y = a.q1;
      j2Group.rotation.z = -a.q2;
      j3Group.rotation.z = -a.q3;
      j4Group.rotation.y = a.q4;
      j5Group.rotation.z = -a.q5;
      j6Group.rotation.y = a.q6;
    };

    applyAngles(anglesRef.current);

    let disposed = false;
    let rafId = 0;
    let timerId = 0;
    let lastEmit = 0;
    const startMs = performance.now();

    const tick = () => {
      if (disposed) return;
      const elapsed = (performance.now() - startMs) / 1000;

      if (autoRef.current) {
        const next = sampleArmTrajectory((elapsed * 0.11) % 1);
        anglesRef.current = next;
        applyAngles(next);
        const now = performance.now();
        if (onAutoRef.current && now - lastEmit > 140) {
          lastEmit = now;
          onAutoRef.current(next);
        }
      } else {
        applyAngles(anglesRef.current);
      }

      controls.update();
      renderer.render(scene, camera);

      if (softGl) {
        if (autoRef.current) {
          scheduleAfterDraw(renderer, tick, (id) => {
            timerId = id;
          });
        }
      } else {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    // On software WebGL, re-render on demand when sliders or OrbitControls move
    let softBusy = false;
    let softDirty = false;
    const requestSoftRender = () => {
      if (!softGl || disposed) return;
      if (autoRef.current) {
        window.clearTimeout(timerId);
        tick();
        return;
      }
      if (softBusy) {
        softDirty = true;
        return;
      }
      softBusy = true;
      rafId = window.requestAnimationFrame(() => {
        if (disposed) return;
        softDirty = false;
        applyAngles(anglesRef.current);
        controls.update();
        renderer.render(scene, camera);
        scheduleAfterDraw(
          renderer,
          () => {
            softBusy = false;
            if (softDirty) requestSoftRender();
          },
          (id) => {
            timerId = id;
          },
        );
      });
    };

    triggerRenderRef.current = () => {
      if (softGl) requestSoftRender();
    };

    const onControlChange = () => {
      if (softGl && !autoRef.current) requestSoftRender();
    };
    controls.addEventListener('change', onControlChange);

    const resizeObserver = new ResizeObserver(() => {
      const w = Math.max(container.clientWidth, 280);
      const h = Math.max(container.clientHeight, 240);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (softGl) requestSoftRender();
    });
    resizeObserver.observe(container);

    tick();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timerId);
      resizeObserver.disconnect();
      controls.removeEventListener('change', onControlChange);
      controls.dispose();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      envTex.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="h-[340px] w-full sm:h-[390px]" />;
};
