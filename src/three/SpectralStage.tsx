import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  attachStudioEnvironment,
  createCalibratedRenderer,
  isSoftwareWebGL,
  scheduleAfterDraw,
} from './webglGuard';

interface SpectralStageProps {
  /** 0 = raw cross-machine domain shift, 1 = physics-constrained AdaSN aligned */
  alignment: number;
  /** Target machine speed regime multiplier */
  regimeShift: number;
}

const SPECTRAL_VERTEX = `
  uniform float uTime;
  uniform float uAlignment;
  uniform float uRegimeShift;
  varying float vHeight;
  varying float vSourceRef;
  varying vec2 vUv;

  float ridge(float v, float center, float sharp) {
    float d = (v - center) * sharp;
    return exp(-d * d);
  }

  void main() {
    vUv = uv;
    vec2 p = uv * 2.0 - 1.0;

    // Ground-truth physical fault harmonics (source domain)
    float src =
      ridge(p.y, -0.42, 5.4) * (0.68 + 0.22 * sin(p.x * 5.0 - uTime * 2.0)) +
      ridge(p.y,  0.14, 6.2) * (0.92 + 0.25 * cos(p.x * 6.5 - uTime * 2.6)) +
      ridge(p.y,  0.58, 5.0) * (0.52 + 0.18 * sin(p.x * 3.8 + uTime * 1.4));

    // Unaligned target-machine shifted & noisy spectrogram
    float shift = uRegimeShift * (1.0 - uAlignment);
    float noise = (1.0 - uAlignment) * (0.28 * sin(p.x * 11.0 + p.y * 9.0 + uTime) + 0.16 * cos(p.y * 14.0 - uTime * 1.8));
    float tgt =
      ridge(p.y - shift * 0.34, -0.42, 4.2) * (0.56 + 0.24 * sin(p.x * 5.0 - uTime * 2.0)) +
      ridge(p.y - shift * 0.28,  0.14, 4.6) * (0.84 + 0.26 * cos(p.x * 6.5 - uTime * 2.6)) +
      ridge(p.y + shift * 0.22,  0.58, 4.0) * (0.48 + 0.20 * sin(p.x * 3.8 + uTime * 1.4)) +
      max(0.0, noise);

    float h = mix(tgt, src, uAlignment);
    vHeight = h;
    vSourceRef = src;

    vec3 pos = position;
    pos.z += h * 1.35;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const SPECTRAL_FRAGMENT = `
  varying float vHeight;
  varying float vSourceRef;
  varying vec2 vUv;
  uniform float uAlignment;

  void main() {
    float gridX = smoothstep(0.95, 1.0, abs(sin(vUv.x * 3.14159 * 24.0)));
    float gridY = smoothstep(0.95, 1.0, abs(sin(vUv.y * 3.14159 * 18.0)));
    float grid = max(gridX, gridY) * 0.18;

    vec3 floorCol = vec3(0.05, 0.08, 0.13);
    vec3 unalignedCol = vec3(0.96, 0.62, 0.04); // Amber signal shift
    vec3 alignedCol = vec3(0.83, 0.94, 0.63);   // Lime physics-aligned
    vec3 peakColor = mix(unalignedCol, alignedCol, uAlignment);

    float intensity = clamp(vHeight * 0.85, 0.0, 1.0);
    vec3 col = mix(floorCol, peakColor, pow(intensity, 1.15));
    col += vec3(0.36, 0.92, 0.83) * smoothstep(0.75, 1.25, vSourceRef) * uAlignment * 0.32;
    col += vec3(grid);

    gl_FragColor = vec4(col, 0.96);
  }
`;

export const SpectralStage: React.FC<SpectralStageProps> = ({ alignment, regimeShift }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const alignRef = useRef(alignment);
  const shiftRef = useRef(regimeShift);
  const triggerRenderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    alignRef.current = alignment;
    shiftRef.current = regimeShift;
    triggerRenderRef.current?.();
  }, [alignment, regimeShift]);

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
    scene.fog = new THREE.Fog('#090D15', 7, 20);
    const envTex = attachStudioEnvironment(scene, renderer);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(3.2, 2.75, 3.8);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !softGl;
    controls.enablePan = false;
    controls.target.set(0, 0.45, 0);
    controls.minDistance = 2.6;
    controls.maxDistance = 8.5;

    const planeGeo = new THREE.PlaneGeometry(4.4, 3.2, 64, 48);
    const shaderMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uAlignment: { value: alignRef.current },
        uRegimeShift: { value: shiftRef.current },
      },
      vertexShader: SPECTRAL_VERTEX,
      fragmentShader: SPECTRAL_FRAGMENT,
      side: THREE.DoubleSide,
    });

    const surface = new THREE.Mesh(planeGeo, shaderMat);
    surface.rotation.x = -Math.PI / 2;
    scene.add(surface);

    const wireMat = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const baseFrameGeo = new THREE.BoxGeometry(4.44, 0.06, 3.24);
    const baseFrameMat = new THREE.MeshStandardMaterial({
      color: '#1e293b',
      metalness: 0.7,
      roughness: 0.45,
    });
    const baseFrame = new THREE.Mesh(baseFrameGeo, baseFrameMat);
    baseFrame.position.y = -0.05;
    scene.add(baseFrame);

    let disposed = false;
    let rafId = 0;
    let timerId = 0;
    const startMs = performance.now();

    const tick = () => {
      if (disposed) return;
      shaderMat.uniforms.uTime.value = (performance.now() - startMs) / 1000;
      shaderMat.uniforms.uAlignment.value = alignRef.current;
      shaderMat.uniforms.uRegimeShift.value = shiftRef.current;

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

    triggerRenderRef.current = () => {
      shaderMat.uniforms.uAlignment.value = alignRef.current;
      shaderMat.uniforms.uRegimeShift.value = shiftRef.current;
    };

    const resizeObserver = new ResizeObserver(() => {
      const w = Math.max(container.clientWidth, 280);
      const h = Math.max(container.clientHeight, 240);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    tick();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timerId);
      resizeObserver.disconnect();
      controls.dispose();
      planeGeo.dispose();
      baseFrameGeo.dispose();
      shaderMat.dispose();
      wireMat.dispose();
      baseFrameMat.dispose();
      envTex.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="h-[320px] w-full sm:h-[370px]" />;
};
