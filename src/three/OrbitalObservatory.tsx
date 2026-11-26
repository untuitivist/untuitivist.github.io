import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ArrowDownRight, ChevronDown, ChevronUp, Compass, RotateCcw } from 'lucide-react';
import type { DomainInfo, Locale, ProfileData, WorkItem } from '../types/portfolio';
import { computeOrbitalNodePosition, getDomainById, pickLocale } from '../utils/portfolio';
import {
  attachStudioEnvironment,
  createCalibratedRenderer,
  isSoftwareWebGL,
  scheduleAfterDraw,
} from './webglGuard';

interface OrbitalObservatoryProps {
  profile: ProfileData;
  domains: DomainInfo[];
  works: WorkItem[];
  activeWorkId: string;
  locale: Locale;
  onSelectWork: (workId: string) => void;
  onEnterStage: (workId: string) => void;
}

const CORE_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vLocalPos;
  uniform float uTime;

  void main() {
    vLocalPos = position;
    float pulse = sin(position.x * 4.2 + uTime * 1.4) * cos(position.y * 4.2 - uTime * 1.1) * 0.045;
    vec3 displaced = position + normal * pulse;
    vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
    vWorldPos = worldPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const CORE_FRAGMENT_SHADER = `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vLocalPos;
  uniform float uTime;
  uniform vec3 uPrimaryColor;
  uniform vec3 uAccentColor;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - max(0.0, dot(viewDir, normalize(vNormal))), 2.6);
    float bands = 0.5 + 0.5 * sin(vLocalPos.y * 10.0 - uTime * 2.1 + vLocalPos.x * 5.0);
    vec3 inner = mix(vec3(0.04, 0.09, 0.14), uAccentColor * 0.65, bands * 0.45);
    vec3 finalColor = mix(inner, uPrimaryColor, fresnel * 0.92) + uPrimaryColor * (fresnel * 0.35);
    gl_FragColor = vec4(finalColor, 0.95);
  }
`;

// Pre-allocated scratch helpers outside render loop (zero GC)
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _nodeWorldPos = new THREE.Vector3();
const _rayDir = new THREE.Vector3();
const _mouseNdc = new THREE.Vector2();
const _dummyObj = new THREE.Object3D();
const _tmpColor = new THREE.Color();

export const OrbitalObservatory: React.FC<OrbitalObservatoryProps> = ({
  profile,
  domains,
  works,
  activeWorkId,
  locale,
  onSelectWork,
  onEnterStage,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [dockOpen, setDockOpen] = useState(true);
  const [hoveredWorkId, setHoveredWorkId] = useState<string | null>(null);
  const [webglError, setWebglError] = useState(false);

  const activeWorkRef = useRef(activeWorkId);
  const hasMountedRef = useRef(false);
  const onSelectRef = useRef(onSelectWork);
  const resetViewRef = useRef<(() => void) | null>(null);
  const focusWorkRef = useRef<((workId: string) => void) | null>(null);

  useEffect(() => {
    activeWorkRef.current = activeWorkId;
    if (hasMountedRef.current) {
      focusWorkRef.current?.(activeWorkId);
    } else {
      hasMountedRef.current = true;
    }
  }, [activeWorkId]);

  useEffect(() => {
    onSelectRef.current = onSelectWork;
  }, [onSelectWork]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === 'h' &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        setDockOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const softGl = isSoftwareWebGL();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = createCalibratedRenderer(
        Math.max(container.clientWidth, 320),
        Math.max(container.clientHeight, 320),
        softGl,
      );
    } catch {
      setWebglError(true);
      return;
    }

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#06080D');
    scene.fog = new THREE.FogExp2('#06080D', 0.032);
    const envTex = attachStudioEnvironment(scene, renderer);

    const camera = new THREE.PerspectiveCamera(
      44,
      Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1),
      0.1,
      120,
    );
    camera.position.set(0.6, 5.3, 12.6);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !softGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 5.4;
    controls.maxDistance = 19.0;
    controls.maxPolarAngle = Math.PI * 0.72;
    controls.minPolarAngle = Math.PI * 0.14;
    controls.target.set(0, -0.25, 0);

    // Three-point warm/cool lighting rig
    const keyLight = new THREE.DirectionalLight('#fff2dc', 2.2);
    keyLight.position.set(8, 12, 9);
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight('#7dd3fc', '#0b1220', 0.95);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight('#d4f0a0', 1.1);
    rimLight.position.set(-10, -4, -9);
    scene.add(rimLight);

    // Track disposable resources
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    // 1. Instanced starfield
    const starCount = 260;
    const starGeo = new THREE.OctahedronGeometry(0.045, 0);
    const starMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    geometries.push(starGeo);
    materials.push(starMat);

    const stars = new THREE.InstancedMesh(starGeo, starMat, starCount);
    stars.frustumCulled = false;
    const paletteHex = ['#cbd5e1', '#d4f0a0', '#5eead4', '#f59e0b', '#818cf8'];
    for (let i = 0; i < starCount; i++) {
      const r = 13 + ((i * 37) % 24);
      const theta = ((i * 137.5) * Math.PI) / 180;
      const phi = Math.acos(1 - (2 * ((i + 0.5) / starCount)));
      _dummyObj.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi) * 0.72,
        r * Math.sin(phi) * Math.sin(theta),
      );
      const s = 0.55 + ((i * 19) % 10) * 0.11;
      _dummyObj.scale.setScalar(s);
      _dummyObj.updateMatrix();
      stars.setMatrixAt(i, _dummyObj.matrix);
      _tmpColor.set(paletteHex[i % paletteHex.length]);
      stars.setColorAt(i, _tmpColor);
    }
    stars.instanceMatrix.needsUpdate = true;
    if (stars.instanceColor) stars.instanceColor.needsUpdate = true;
    scene.add(stars);

    // Subtle ground reference plane ring
    const floorGridRingGeo = new THREE.RingGeometry(6.3, 6.34, 96);
    const floorGridRingMat = new THREE.MeshBasicMaterial({
      color: '#1e293b',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    geometries.push(floorGridRingGeo);
    materials.push(floorGridRingMat);
    const floorRing = new THREE.Mesh(floorGridRingGeo, floorGridRingMat);
    floorRing.rotation.x = -Math.PI / 2;
    floorRing.position.y = -2.45;
    scene.add(floorRing);

    // 2. Composite Agent-Native Core (multi-part group: GLSL core + 3 machined gyroscopic rings)
    const coreGroup = new THREE.Group();
    const coreSphereGeo = new THREE.IcosahedronGeometry(0.86, 4);
    const coreShaderMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPrimaryColor: { value: new THREE.Color('#D4F0A0') },
        uAccentColor: { value: new THREE.Color('#5EEAD4') },
      },
      vertexShader: CORE_VERTEX_SHADER,
      fragmentShader: CORE_FRAGMENT_SHADER,
      transparent: true,
    });
    geometries.push(coreSphereGeo);
    materials.push(coreShaderMat);
    const coreMesh = new THREE.Mesh(coreSphereGeo, coreShaderMat);
    coreGroup.add(coreMesh);

    const gyroMatA = new THREE.MeshStandardMaterial({
      color: '#cbd5e1',
      metalness: 0.92,
      roughness: 0.2,
    });
    const gyroMatB = new THREE.MeshStandardMaterial({
      color: '#d4f0a0',
      metalness: 0.72,
      roughness: 0.32,
      emissive: '#d4f0a0',
      emissiveIntensity: 0.25,
    });
    const gyroMatC = new THREE.MeshStandardMaterial({
      color: '#334155',
      metalness: 0.85,
      roughness: 0.45,
    });
    materials.push(gyroMatA, gyroMatB, gyroMatC);

    const gyroGeo1 = new THREE.TorusGeometry(1.18, 0.026, 16, 72);
    const gyroGeo2 = new THREE.TorusGeometry(1.38, 0.02, 16, 72);
    const gyroGeo3 = new THREE.TorusGeometry(1.56, 0.015, 16, 72);
    geometries.push(gyroGeo1, gyroGeo2, gyroGeo3);

    const gyro1 = new THREE.Mesh(gyroGeo1, gyroMatA);
    const gyro2 = new THREE.Mesh(gyroGeo2, gyroMatB);
    const gyro3 = new THREE.Mesh(gyroGeo3, gyroMatC);
    gyro2.rotation.x = Math.PI / 3;
    gyro3.rotation.y = Math.PI / 4;
    coreGroup.add(gyro1, gyro2, gyro3);
    scene.add(coreGroup);

    // 3. Domain Orbits & 7 Composite Work Waypoints
    domains.forEach((domain) => {
      const grp = new THREE.Group();
      grp.rotation.set(domain.orbitTilt[0], domain.orbitTilt[1], domain.orbitTilt[2]);

      const torusGeo = new THREE.TorusGeometry(domain.orbitRadius, 0.015, 12, 120);
      const torusMat = new THREE.MeshBasicMaterial({
        color: domain.color,
        transparent: true,
        opacity: 0.38,
      });
      geometries.push(torusGeo);
      materials.push(torusMat);
      const ring = new THREE.Mesh(torusGeo, torusMat);
      ring.rotation.x = Math.PI / 2;
      grp.add(ring);

      scene.add(grp);
    });

    interface NodeRecord {
      work: WorkItem;
      domain: DomainInfo;
      group: THREE.Group;
      crystal: THREE.Mesh;
      ring: THREE.Mesh;
      halo: THREE.Mesh;
      proxy: THREE.Mesh;
      basePos: THREE.Vector3;
    }

    const nodeRecords: NodeRecord[] = [];
    const interactables: THREE.Object3D[] = [];

    const crystalGeo = new THREE.OctahedronGeometry(0.24, 0);
    const nodeRingGeo = new THREE.TorusGeometry(0.38, 0.022, 12, 40);
    const nodeHaloGeo = new THREE.RingGeometry(0.46, 0.54, 32);
    const proxyGeo = new THREE.SphereGeometry(0.62, 12, 12);
    const proxyMat = new THREE.MeshBasicMaterial({ visible: false });
    geometries.push(crystalGeo, nodeRingGeo, nodeHaloGeo, proxyGeo);
    materials.push(proxyMat);

    works.forEach((work) => {
      const domain = getDomainById(domains, work.domain);
      const p = computeOrbitalNodePosition(domain.orbitRadius, domain.orbitTilt, work.orbitAngle);
      const basePos = new THREE.Vector3(p.x, p.y, p.z);

      const nodeGroup = new THREE.Group();
      nodeGroup.position.copy(basePos);

      const crystalMat = new THREE.MeshStandardMaterial({
        color: domain.color,
        metalness: 0.35,
        roughness: 0.22,
        emissive: domain.color,
        emissiveIntensity: 0.45,
      });
      const ringMat = new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        metalness: 0.9,
        roughness: 0.18,
      });
      const haloMat = new THREE.MeshBasicMaterial({
        color: domain.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
      });
      materials.push(crystalMat, ringMat, haloMat);

      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      const ring = new THREE.Mesh(nodeRingGeo, ringMat);
      ring.rotation.x = Math.PI / 2.4;
      const halo = new THREE.Mesh(nodeHaloGeo, haloMat);
      halo.rotation.x = Math.PI / 2;

      const proxy = new THREE.Mesh(proxyGeo, proxyMat);
      proxy.userData.workId = work.id;
      interactables.push(proxy);

      nodeGroup.add(crystal, ring, halo, proxy);
      scene.add(nodeGroup);

      nodeRecords.push({
        work,
        domain,
        group: nodeGroup,
        crystal,
        ring,
        halo,
        proxy,
        basePos,
      });
    });

    // Dynamic luminous tether connecting Core -> Active Work Node
    const initialRec = nodeRecords.find((n) => n.work.id === activeWorkRef.current) ?? nodeRecords[0];
    const tetherGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      initialRec ? initialRec.basePos.clone() : new THREE.Vector3(0, 0, 0),
    ]);
    const tetherMat = new THREE.LineBasicMaterial({
      color: initialRec ? initialRec.domain.color : '#D4F0A0',
      transparent: true,
      opacity: 0.72,
    });
    geometries.push(tetherGeo);
    materials.push(tetherMat);
    const tetherLine = new THREE.Line(tetherGeo, tetherMat);
    scene.add(tetherLine);

    // Camera transition state: start in panoramic overview so all 3 orbits + 7 nodes shine immediately
    let scriptedTransition = false;
    const setCameraTargetForWork = (workId: string) => {
      const rec = nodeRecords.find((n) => n.work.id === workId);
      if (!rec) return;
      _nodeWorldPos.copy(rec.basePos);
      _rayDir.copy(_nodeWorldPos).normalize();
      _targetCamPos.set(
        _nodeWorldPos.x * 1.35 + _rayDir.z * 2.8,
        Math.max(3.6, _nodeWorldPos.y + 3.8),
        _nodeWorldPos.z * 1.35 - _rayDir.x * 2.8 + 5.8,
      );
      _targetLookAt.copy(_nodeWorldPos).multiplyScalar(0.28);
      tetherMat.color.set(rec.domain.color);
      scriptedTransition = true;
    };

    const resetOverview = () => {
      _targetCamPos.set(0.6, 5.3, 12.6);
      _targetLookAt.set(0, -0.25, 0);
      scriptedTransition = true;
    };

    focusWorkRef.current = setCameraTargetForWork;
    resetViewRef.current = resetOverview;

    // Cancel scripted flight when user manually drags
    const onControlStart = () => {
      scriptedTransition = false;
    };
    controls.addEventListener('start', onControlStart);

    // Raycasting
    const raycaster = new THREE.Raycaster();
    let lastHoverTime = 0;
    let pointerDownPos = { x: 0, y: 0 };

    const updateMouseFromEvent = (ev: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      _mouseNdc.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      _mouseNdc.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerMove = (ev: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverTime < 45) return;
      lastHoverTime = now;
      updateMouseFromEvent(ev);
      raycaster.setFromCamera(_mouseNdc, camera);
      const hits = raycaster.intersectObjects(interactables, false);
      if (hits.length > 0) {
        const hitId = String(hits[0].object.userData.workId ?? '');
        renderer.domElement.style.cursor = 'pointer';
        setHoveredWorkId((prev) => (prev === hitId ? prev : hitId));
      } else {
        renderer.domElement.style.cursor = 'grab';
        setHoveredWorkId((prev) => (prev === null ? prev : null));
      }
    };

    const onPointerDown = (ev: PointerEvent) => {
      pointerDownPos = { x: ev.clientX, y: ev.clientY };
    };

    const onPointerUp = (ev: PointerEvent) => {
      const dist = Math.hypot(ev.clientX - pointerDownPos.x, ev.clientY - pointerDownPos.y);
      if (dist > 6) return;
      updateMouseFromEvent(ev);
      raycaster.setFromCamera(_mouseNdc, camera);
      const hits = raycaster.intersectObjects(interactables, false);
      if (hits.length > 0) {
        const hitId = String(hits[0].object.userData.workId ?? '');
        if (hitId) {
          onSelectRef.current(hitId);
        }
      }
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglError(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    if (!softGl) {
      renderer.compile(scene, camera);
    }

    const resizeObserver = new ResizeObserver(() => {
      const w = Math.max(container.clientWidth, 320);
      const h = Math.max(container.clientHeight, 320);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.render(scene, camera);
    });
    resizeObserver.observe(container);

    // Animation loop using performance.now() (zero THREE.Clock deprecation warnings)
    let disposed = false;
    let rafId = 0;
    let timerId = 0;
    const startMs = performance.now();
    let lastMs = startMs;

    const tick = () => {
      if (disposed) return;
      const nowMs = performance.now();
      const dt = Math.min((nowMs - lastMs) / 1000, 0.08);
      const elapsed = (nowMs - startMs) / 1000;
      lastMs = nowMs;

      coreShaderMat.uniforms.uTime.value = elapsed;
      gyro1.rotation.z = elapsed * 0.28;
      gyro1.rotation.x = Math.sin(elapsed * 0.22) * 0.35;
      gyro2.rotation.y = -elapsed * 0.36;
      gyro3.rotation.x = elapsed * 0.19;
      stars.rotation.y = elapsed * 0.018;

      const selectedId = activeWorkRef.current;
      for (let i = 0; i < nodeRecords.length; i++) {
        const rec = nodeRecords[i];
        const isActive = rec.work.id === selectedId;
        const bob = Math.sin(elapsed * 1.4 + i * 1.1) * 0.09;
        rec.group.position.set(rec.basePos.x, rec.basePos.y + bob, rec.basePos.z);

        const targetScale = isActive ? 1.32 : 0.96;
        const nextScale = THREE.MathUtils.damp(rec.group.scale.x, targetScale, 6, dt);
        rec.group.scale.setScalar(nextScale);
        rec.crystal.rotation.y = elapsed * (isActive ? 1.2 : 0.55) + i;
        rec.ring.rotation.z = -elapsed * 0.7;

        const cMat = rec.crystal.material as THREE.MeshStandardMaterial;
        cMat.emissiveIntensity = isActive ? 0.95 : 0.36;
        const hMat = rec.halo.material as THREE.MeshBasicMaterial;
        hMat.opacity = isActive ? 0.85 : 0.26;

        if (isActive) {
          const posAttr = tetherGeo.attributes.position as THREE.BufferAttribute;
          posAttr.setXYZ(1, rec.group.position.x, rec.group.position.y, rec.group.position.z);
          posAttr.needsUpdate = true;
        }
      }

      if (scriptedTransition) {
        const alpha = 1 - Math.exp(-3.4 * dt);
        camera.position.lerp(_targetCamPos, alpha);
        controls.target.lerp(_targetLookAt, alpha);
        if (
          camera.position.distanceTo(_targetCamPos) < 0.04 &&
          controls.target.distanceTo(_targetLookAt) < 0.04
        ) {
          scriptedTransition = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (softGl) {
        scheduleAfterDraw(renderer, tick, (id) => {
          timerId = id;
        });
      } else {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    controls.update();
    renderer.render(scene, camera);
    tick();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timerId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.dispose();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      envTex.dispose();
      renderer.dispose();
    };
  }, [domains, works]);

  const activeWork = works.find((w) => w.id === activeWorkId) ?? works[0];
  const activeDomain = getDomainById(domains, activeWork.domain);
  const hoveredWork = hoveredWorkId ? works.find((w) => w.id === hoveredWorkId) : null;

  return (
    <section
      id="observatory"
      className="relative w-full h-[calc(100vh-56px)] min-h-[600px] max-h-[960px] overflow-hidden border-b border-white/10 bg-[#06080D]"
    >
      {/* Dedicated isolated WebGL canvas container */}
      <div
        ref={mountRef}
        className="absolute inset-0 h-full w-full"
        aria-label="Interactive 3D Orbital Observatory"
      />

      {webglError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#06080D] p-8 text-center">
          <div className="max-w-md border border-white/15 bg-[#0C1018] p-6">
            <p className="font-display text-lg text-[#D4F0A0]">3D Viewport Standby</p>
            <p className="mt-2 text-sm text-slate-400">
              {locale === 'zh'
                ? '当前浏览器未启用 WebGL，你仍可通过下方轨道控制台切换并体验全部 7 个交互作品舞台。'
                : 'WebGL is unavailable in this browser. Use the orbital dock below to jump directly into all 7 interactive stages.'}
            </p>
          </div>
        </div>
      )}

      {/* Top-Left Minimal Identity Block (solid/rgba dark matte — zero backdrop-filter over WebGL) */}
      <div className="pointer-events-none absolute left-5 top-5 z-10 max-w-md sm:left-8 sm:top-7">
        <div className="pointer-events-auto border-l-2 border-[#D4F0A0] bg-[#06080D]/82 px-4 py-3.5">
          <div className="flex items-center gap-2.5 text-xs font-mono-tech uppercase tracking-[0.2em] text-[#D4F0A0]">
            <Compass className="h-3.5 w-3.5" />
            <span>{pickLocale(profile.brandExpansion, locale)}</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {pickLocale(profile.tagline, locale)}
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
            {pickLocale(profile.subtitle, locale)}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-mono-tech text-slate-400">
            <span className="text-white">{pickLocale(profile.name, locale)}</span>
            <span className="text-white/25">|</span>
            <span>@{profile.handle}</span>
          </div>
        </div>
      </div>

      {/* Top-Right Compact Focused Waypoint Indicator & Reset Camera */}
      <div className="pointer-events-none absolute right-5 top-5 z-10 hidden max-w-xs sm:block sm:right-8 sm:top-7">
        <div className="pointer-events-auto border border-white/12 bg-[#06080D]/86 p-4">
          <div className="flex items-center justify-between gap-4">
            <span
              className="font-mono-tech text-[11px] uppercase tracking-[0.16em]"
              style={{ color: activeDomain.color }}
            >
              {activeWork.code} · {pickLocale(activeDomain.title, locale)}
            </span>
            <button
              type="button"
              onClick={() => resetViewRef.current?.()}
              className="inline-flex items-center gap-1 text-[11px] font-mono-tech text-slate-400 transition-colors hover:text-[#D4F0A0]"
              title={locale === 'zh' ? '重置视角' : 'Reset Orbit View'}
            >
              <RotateCcw className="h-3 w-3" />
              <span>{locale === 'zh' ? '全景' : 'Reset'}</span>
            </button>
          </div>
          <p className="mt-1.5 font-display text-lg font-semibold text-white">
            {pickLocale(activeWork.title, locale)}
          </p>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-300">
            {pickLocale(activeWork.tagline, locale)}
          </p>
          <button
            type="button"
            onClick={() => onEnterStage(activeWork.id)}
            className="mt-3 inline-flex w-full items-center justify-between border border-[#D4F0A0]/40 bg-[#D4F0A0]/12 px-3 py-1.5 font-mono-tech text-xs font-medium text-[#D4F0A0] transition-colors hover:bg-[#D4F0A0] hover:text-[#06080D]"
          >
            <span>{locale === 'zh' ? '进入交互舞台' : 'Enter Interactive Stage'}</span>
            <ArrowDownRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Subtle hover readout near bottom-center when hovering a 3D node */}
      {hoveredWork && hoveredWork.id !== activeWork.id && (
        <div className="pointer-events-none absolute bottom-28 left-1/2 z-10 -translate-x-1/2 border border-white/15 bg-[#06080D]/90 px-3 py-1.5 font-mono-tech text-xs text-slate-200">
          {hoveredWork.code} — {pickLocale(hoveredWork.title, locale)}
        </div>
      )}

      {/* Unified Collapsible Bottom Control Dock (Zero Viewport Occlusion) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex flex-col items-center px-4">
        <button
          type="button"
          onClick={() => setDockOpen((prev) => !prev)}
          className="pointer-events-auto mb-1.5 inline-flex items-center gap-1.5 border border-white/15 bg-[#0A0E16]/95 px-3 py-1 font-mono-tech text-[11px] uppercase tracking-[0.14em] text-slate-300 transition-colors hover:border-[#D4F0A0]/50 hover:text-[#D4F0A0]"
        >
          {dockOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          <span>
            {dockOpen
              ? locale === 'zh'
                ? '收起轨道栏 (H)'
                : 'Hide Orbital Dock (H)'
              : locale === 'zh'
                ? '展开 7 节点轨道 (H)'
                : 'Show Orbital Dock (H)'}
          </span>
        </button>

        <div
          className={`pointer-events-auto w-full max-w-[min(1220px,96vw)] border border-white/12 bg-[#0A0E16]/94 transition-all duration-300 ${
            dockOpen
              ? 'translate-y-0 opacity-100'
              : 'pointer-events-none translate-y-6 opacity-0 h-0 overflow-hidden border-0'
          }`}
        >
          <div className="flex items-stretch gap-1.5 overflow-x-auto p-2 lg:grid lg:grid-cols-7">
            {works.map((work) => {
              const domain = getDomainById(domains, work.domain);
              const selected = work.id === activeWorkId;
              return (
                <button
                  key={work.id}
                  type="button"
                  onClick={() => onSelectWork(work.id)}
                  onDoubleClick={() => onEnterStage(work.id)}
                  className={`group flex min-w-[138px] shrink-0 flex-col items-start border px-2.5 py-1.5 text-left transition-colors lg:min-w-0 ${
                    selected
                      ? 'border-[#D4F0A0]/70 bg-[#D4F0A0]/12 text-white'
                      : 'border-white/8 bg-[#0E1420]/70 text-slate-300 hover:border-white/25 hover:text-white'
                  }`}
                >
                  <span
                    className="font-mono-tech text-[10px] tracking-[0.14em]"
                    style={{ color: selected ? '#D4F0A0' : domain.color }}
                  >
                    {work.code}
                  </span>
                  <span className="mt-0.5 line-clamp-1 w-full text-xs font-medium">
                    {pickLocale(work.title, locale)}
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => onEnterStage(activeWork.id)}
              className="ml-auto inline-flex shrink-0 items-center gap-1.5 border border-[#D4F0A0]/60 bg-[#D4F0A0] px-3 py-2 font-mono-tech text-xs font-semibold text-[#06080D] transition-opacity hover:opacity-90 sm:hidden"
            >
              <span>{locale === 'zh' ? '进入' : 'Inspect'}</span>
              <ArrowDownRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
