Drop your Unitree G1 simulation Rerun recording here as:
  public/recordings/llm-g1-sim.rrd

When present (recommended <= 15 MB for GitHub Pages static hosting), the
LLM Control G1 stage will automatically detect and stream ./recordings/llm-g1-sim.rrd
inside the live @rerun-io/web-viewer (v0.44, compatible with RRD SDK v0.23+).

For larger .rrd files (> 20 MB), host them on Hugging Face Datasets or
Cloudflare R2 with CORS enabled and paste the URL in content/portfolio.yml
under works[id="llm-control-g1"].media.defaultLocalRrd.
