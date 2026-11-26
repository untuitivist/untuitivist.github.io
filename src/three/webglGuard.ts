import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

let cachedIsSoftwareGl: boolean | null = null;

/**
 * Detects software WebGL (SwiftShader, llvmpipe, WARP) from the WebGL renderer string.
 * Used strictly for rendering cost (pixel ratio, AA, shadows, frame pacing),
 * never to alter scene geometry, layout, or UI logic.
 */
export function isSoftwareWebGL(): boolean {
  if (cachedIsSoftwareGl !== null) return cachedIsSoftwareGl;
  if (typeof document === 'undefined') return false;
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) {
      cachedIsSoftwareGl = true;
      return true;
    }
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    cachedIsSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    return cachedIsSoftwareGl;
  } catch {
    cachedIsSoftwareGl = true;
    return true;
  }
}

/**
 * Creates a calibrated Three.js WebGLRenderer with ACES Filmic tone mapping
 * and software-WebGL cost guards.
 */
export function createCalibratedRenderer(
  width: number,
  height: number,
  softGl: boolean,
): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    antialias: !softGl,
    powerPreference: 'high-performance',
    alpha: false,
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.setPixelRatio(softGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = !softGl;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  return renderer;
}

/**
 * Generates a zero-dependency procedural RoomEnvironment PBR reflection map.
 */
export function attachStudioEnvironment(
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  pmrem.dispose();
  return envTex;
}

/**
 * Waits for a software WebGL draw command buffer to flush before scheduling the next frame,
 * preventing CPU starvation in headless or non-GPU browsers.
 */
export function scheduleAfterDraw(
  renderer: THREE.WebGLRenderer,
  cb: () => void,
  registerTimer: (id: number) => void,
): void {
  const gl = renderer.getContext() as WebGL2RenderingContext;
  if (typeof gl.fenceSync !== 'function') {
    registerTimer(window.setTimeout(cb, 90));
    return;
  }
  const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
  gl.flush();
  const poll = () => {
    const status = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
    if (status === gl.UNSIGNALED) {
      registerTimer(window.setTimeout(poll, 6));
    } else {
      if (sync) gl.deleteSync(sync);
      registerTimer(window.setTimeout(cb, 85));
    }
  };
  registerTimer(window.setTimeout(poll, 6));
}
