# wiz. — Within Intelligence Zone

Personal research and engineering observatory for **Wiz Lee (无直观 · `@untuitivist`)**.

Runs identically in local Vite development (`0.0.0.0:3000`) and as a static build on **GitHub Pages** (`base: './'` + automated `.github/workflows/deploy.yml`).

## Architecture

- **3D Orbital Observatory (`src/three/OrbitalObservatory.tsx`)**: Interactive Three.js spatial observatory featuring a custom GLSL Agent-Native Core and 3 tilted Truth Orbits (`Macro`, `Micro`, `Social`) linking 7 real systems.
- **Native Domain Stages (`src/components/SpatialWorkStage.tsx`)**: Zero generic project card matrix — each system opens a tailored interface:
  - **RoboMoCap**: Multi-modal capture rig & 29-DoF G1 retargeting showcase (`bitrobot-foundation.github.io/robomocap`)
  - **LLM Control G1**: Synchronized MuJoCo simulation perspective (`perspective.mp4`) + live lazy-mounted **`@rerun-io/web-viewer`** (`v0.44`, compatible with `.rrd` SDK `v0.23–v0.44`)
  - **G1 Motion Retargeting**: Pipeline chapter theatre with frame stepping and playback controls
  - **Six-Axis Robotic Arm**: Interactive 3D 6-DOF DH forward kinematics manipulator + physical prototype video
  - **PCASTNet**: Interactive 3D GLSL AdaSN cross-machine spectral alignment stage
  - **Manhole Hazard Detection**: Interactive YOLOv10 + RepLKBlock perception inspection curtain
  - **WorldQuant BRAIN · `wqb_cli`**: Interactive Agent CLI & MCP console simulator

## Adding Custom `.rrd` Recordings

Drop a `.rrd` recording (`<= 15 MB` for direct GitHub Pages hosting) at:

```text
public/recordings/llm-g1-sim.rrd
```

Larger recordings can be hosted on Hugging Face Datasets or Cloudflare R2 with CORS enabled and referenced in `content/portfolio.yml` under `works[id="llm-control-g1"].media.defaultLocalRrd`.

## Scripts

```bash
npm install
npm run dev      # Start dev server on http://localhost:3000
npm run lint     # TypeScript typecheck (tsc --noEmit)
npm run build    # Static production build to dist/ (GitHub Pages ready)
```
