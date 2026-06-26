const header = document.querySelector("[data-header]");
const langToggle = document.querySelector("[data-lang-toggle]");
const langCurrent = document.querySelector("[data-lang-current]");
const langNext = document.querySelector("[data-lang-next]");

const copy = {
  en: {
    pageTitle: "WIZ / Within Intelligence Zone",
    metaDescription:
      "WIZ / Within Intelligence Zone: Micro Truth, Macro Truth, and Social Truth, grounded by Agent-native Workflow.",
    brandMark: "WIZ",
    brand: "Wuzhiguan / untuitivist",
    navTheme: "Theme",
    navWork: "Work",
    navTools: "Tools",
    navContact: "Contact",
    heroTitle: "Intelligence from Within",
    brandNote:
      "Concepts need intuition; intuition needs concepts. Knowledge becomes possible when the two are joined.",
    viewWork: "View selected work",
    googleScholar: "Google Scholar",
    mapMicroScope: "physical signal",
    mapMicro: "Micro",
    mapMicroIntro: "Truth inside physical signals and local sensor structures.",
    mapMacroScope: "embodied environment",
    mapMacro: "Macro",
    mapMacroIntro: "Truth inside embodied scenes, bodies, robots, and motion.",
    mapSocialScope: "collective decision",
    mapSocial: "Social",
    mapSocialIntro: "Truth inside markets, incentives, and collective decisions.",
    mapAgentScope: "agent-native workflow",
    mapAgent: "Agent",
    mapAgentIntro: "The executable actor that searches, runs, inspects, and iterates the three truth loops.",
    themeEyebrow: "Core theme",
    themeTitle:
      "Built on agent-native workflow, intelligence is generated from within real systems: finding Micro Truth in physical signals, modeling Macro Truth in embodied environments, and discovering Social Truth in collective decision systems.",
    zoneSignalTitle: "Micro",
    zoneSignalText:
      "Micro Truth focuses on local physical signals: the hidden structures inside sensors, machines, and small-scale physical processes.",
    zoneEmbodiedTitle: "Macro",
    zoneEmbodiedText:
      "Macro Truth focuses on embodied and spatial systems: bodies, robots, scenes, trajectories, and their interaction with the physical world.",
    zoneWorkflowTitle: "Social",
    zoneWorkflowText:
      "Social Truth focuses on collective decision systems: markets, incentives, signals, and factor structures emerging from human and institutional behavior.",
    foundationTitle: "Agent-native Workflow",
    foundationText:
      "The operating layer beneath all three truth domains: tools, APIs, scripts, and interfaces that let agents search, run, inspect, and iterate research workflows.",
    workEyebrow: "Selected work",
    workTitle: "Projects to surface first.",
    pcastMeta1: "Research Highlight",
    pcastMeta2: "Micro Truth",
    pcastText:
      "A cross-device, small-sample fault diagnosis direction centered on style transfer, generation, and physically constrained representation learning for bearing signals.",
    pcastPoint1: "Real signal domains with limited target-machine samples.",
    pcastPoint2: "Latent or generated domains for augmentation and adaptation.",
    pcastPoint3: "Back-to-real evaluation through diagnosis accuracy and transfer robustness.",
    pcastGithub: "GitHub",
    pcastIeee: "IEEE",
    evtolMeta1: "Macro Truth",
    evtolMeta2: "Robotics",
    evtolText:
      "A safety-oriented world-model prototype around robotics simulation, state feedback, and scenario evaluation in Isaac Sim / Isaac Lab workflows.",
    trackingMeta1: "Macro Truth",
    trackingMeta2: "Tracking",
    trackingTitle: "Ego-body and Hand Tracking Pipelines",
    trackingText:
      "Engineering pipelines for body, hand, face-blurring, and multimodal data handling, with emphasis on practical data flow, visualization, and privacy boundaries.",
    alphaMeta1: "Social Truth",
    alphaMeta2: "Quant research",
    alphaText:
      "An exploratory automated alpha-mining system. Public presentation should focus on workflow design, factor representations, and reproducible evaluation surfaces.",
    toolsEyebrow: "Agent-native Workflow",
    toolsTitle: "The foundation that makes truth-seeking repeatable.",
    wqbText:
      "A command interface for structured WorldQuant BRAIN research workflows, designed for agent usage, JSON output, endpoint inspection, and long-running job handling.",
    arxivText:
      "A focused arXiv retrieval toolkit for reproducible literature search, metadata extraction, and agent-friendly research intake.",
    repo: "Repository",
    statement:
      "Micro Truth, Macro Truth, and Social Truth are the domains. Agent-native Workflow is the foundation that makes their discovery loops executable, inspectable, and repeatable.",
    footerBrand: "WIZ - Wuzhiguan / untuitivist",
    footerText: "Micro Truth, Macro Truth, and Social Truth, grounded by Agent-native Workflow.",
  },
  zh: {
    pageTitle: "WIZ / \u65e0\u76f4\u89c2 / Intelligence from Within",
    metaDescription:
      "WIZ / \u65e0\u76f4\u89c2\uff1a\u5fae\u89c2\u771f\u5b9e\u3001\u5b8f\u89c2\u771f\u5b9e\u4e0e\u793e\u4f1a\u771f\u5b9e\uff0c\u4ee5 Agent \u539f\u751f\u5de5\u4f5c\u6d41\u4e3a\u5e95\u5ea7\u3002",
    brandMark: "WIZ",
    brand: "\u65e0\u76f4\u89c2 / untuitivist",
    navTheme: "\u4e3b\u7ebf",
    navWork: "\u6210\u679c",
    navTools: "\u5de5\u5177",
    navContact: "\u8054\u7cfb",
    heroTitle: "Intelligence from Within",
    brandNote:
      "\u6982\u5ff5\u65e0\u76f4\u89c2\u5219\u7a7a\uff0c\u76f4\u89c2\u65e0\u6982\u5ff5\u5219\u76f2\uff1b\u4e24\u8005\u7ed3\u5408\uff0c\u77e5\u8bc6\u65b9\u5f97\u53ef\u80fd\u3002",
    viewWork: "\u67e5\u770b\u4ee3\u8868\u5de5\u4f5c",
    googleScholar: "\u8c37\u6b4c\u5b66\u672f",
    mapMicroScope: "\u7269\u7406\u4fe1\u53f7",
    mapMicro: "\u5fae\u89c2",
    mapMicroIntro: "\u4ece\u7269\u7406\u4fe1\u53f7\u548c\u5c40\u90e8\u4f20\u611f\u7ed3\u6784\u4e2d\u63d0\u53d6\u771f\u5b9e\u3002",
    mapMacroScope: "\u5177\u8eab\u73af\u5883",
    mapMacro: "\u5b8f\u89c2",
    mapMacroIntro: "\u5728\u573a\u666f\u3001\u8eab\u4f53\u3001\u673a\u5668\u4eba\u4e0e\u52a8\u4f5c\u4e2d\u5efa\u6a21\u771f\u5b9e\u3002",
    mapSocialScope: "\u96c6\u4f53\u51b3\u7b56",
    mapSocial: "\u793e\u4f1a",
    mapSocialIntro: "\u5728\u5e02\u573a\u3001\u6fc0\u52b1\u548c\u96c6\u4f53\u51b3\u7b56\u4e2d\u53d1\u73b0\u771f\u5b9e\u3002",
    mapAgentScope: "Agent \u539f\u751f\u5de5\u4f5c\u6d41",
    mapAgent: "Agent",
    mapAgentIntro: "\u53ef\u6267\u884c\u884c\u52a8\u8005\uff1a\u8d1f\u8d23\u641c\u7d22\u3001\u8fd0\u884c\u3001\u68c0\u67e5\u5e76\u8fed\u4ee3\u4e09\u5c42\u771f\u5b9e\u95ed\u73af\u3002",
    themeEyebrow: "\u6838\u5fc3\u4e3b\u7ebf",
    themeTitle:
      "\u4ee5 Agent \u539f\u751f\u5de5\u4f5c\u6d41\u4e3a\u5e95\u5ea7\uff0c\u4ece\u771f\u5b9e\u7cfb\u7edf\u5185\u90e8\u751f\u6210\u667a\u80fd\uff1a\u5728\u7269\u7406\u4fe1\u53f7\u4e2d\u5bfb\u627e\u5fae\u89c2\u771f\u5b9e\uff0c\u5728\u5177\u8eab\u73af\u5883\u4e2d\u5efa\u6a21\u5b8f\u89c2\u771f\u5b9e\uff0c\u5728\u96c6\u4f53\u51b3\u7b56\u7cfb\u7edf\u4e2d\u53d1\u73b0\u793e\u4f1a\u771f\u5b9e\u3002",
    zoneSignalTitle: "\u5fae\u89c2",
    zoneSignalText:
      "\u5fae\u89c2\u771f\u5b9e\u5173\u6ce8\u5c40\u90e8\u7269\u7406\u4fe1\u53f7\u4e2d\u7684\u771f\u5b9e\u7ed3\u6784\uff0c\u4f8b\u5982\u4f20\u611f\u5668\u3001\u673a\u68b0\u8bbe\u5907\u548c\u5c0f\u5c3a\u5ea6\u7269\u7406\u8fc7\u7a0b\u5185\u90e8\u7684\u6a21\u5f0f\u3001\u7ea6\u675f\u4e0e\u53d8\u5316\u3002",
    zoneEmbodiedTitle: "\u5b8f\u89c2",
    zoneEmbodiedText:
      "\u5b8f\u89c2\u771f\u5b9e\u5173\u6ce8\u5177\u8eab\u4e0e\u7a7a\u95f4\u7cfb\u7edf\u4e2d\u7684\u771f\u5b9e\u7ed3\u6784\uff0c\u4f8b\u5982\u8eab\u4f53\u3001\u673a\u5668\u4eba\u3001\u573a\u666f\u3001\u8f68\u8ff9\uff0c\u4ee5\u53ca\u5b83\u4eec\u4e0e\u7269\u7406\u4e16\u754c\u7684\u4ea4\u4e92\u3002",
    zoneWorkflowTitle: "\u793e\u4f1a",
    zoneWorkflowText:
      "\u793e\u4f1a\u771f\u5b9e\u5173\u6ce8\u96c6\u4f53\u51b3\u7b56\u7cfb\u7edf\u4e2d\u7684\u771f\u5b9e\u7ed3\u6784\uff0c\u4f8b\u5982\u5e02\u573a\u3001\u6fc0\u52b1\u3001\u4fe1\u606f\u6d41\uff0c\u4ee5\u53ca\u7531\u4eba\u548c\u673a\u6784\u884c\u4e3a\u5171\u540c\u751f\u6210\u7684\u56e0\u5b50\u6a21\u5f0f\u3002",
    foundationTitle: "Agent \u539f\u751f\u5de5\u4f5c\u6d41",
    foundationText:
      "Agent \u539f\u751f\u5de5\u4f5c\u6d41\u662f\u4e09\u7c7b\u771f\u5b9e\u4e16\u754c\u7814\u7a76\u7684\u64cd\u4f5c\u5e95\u5ea7\uff1a\u901a\u8fc7\u5de5\u5177\u3001API\u3001\u811a\u672c\u548c\u754c\u9762\uff0c\u8ba9 agent \u80fd\u591f\u641c\u7d22\u3001\u8fd0\u884c\u3001\u68c0\u67e5\u5e76\u8fed\u4ee3\u7814\u7a76\u6d41\u7a0b\u3002",
    workEyebrow: "\u4ee3\u8868\u5de5\u4f5c",
    workTitle: "\u4e09\u5c42\u771f\u5b9e\u4e2d\u7684\u4ee3\u8868\u9879\u76ee\u3002",
    pcastMeta1: "\u7814\u7a76\u4eae\u70b9",
    pcastMeta2: "\u5fae\u89c2\u771f\u5b9e",
    pcastText:
      "\u56f4\u7ed5\u8f74\u627f\u4fe1\u53f7\u7684\u8de8\u8bbe\u5907\u5c0f\u6837\u672c\u6545\u969c\u8bca\u65ad\u65b9\u5411\uff0c\u5173\u6ce8\u98ce\u683c\u8fc1\u79fb\u3001\u751f\u6210\u589e\u5f3a\u4e0e\u7269\u7406\u7ea6\u675f\u8868\u793a\u5b66\u4e60\u3002",
    pcastPoint1: "\u771f\u5b9e\u4fe1\u53f7\u57df\u4e2d\u76ee\u6807\u8bbe\u5907\u6837\u672c\u6709\u9650\u3002",
    pcastPoint2: "\u901a\u8fc7\u6f5c\u5728\u57df\u6216\u751f\u6210\u57df\u8fdb\u884c\u589e\u5f3a\u4e0e\u9002\u914d\u3002",
    pcastPoint3: "\u56de\u5230\u771f\u5b9e\u8bca\u65ad\u4efb\u52a1\u4e2d\u8bc4\u4f30\u51c6\u786e\u7387\u4e0e\u8fc1\u79fb\u9c81\u68d2\u6027\u3002",
    pcastGithub: "GitHub",
    pcastIeee: "IEEE",
    evtolMeta1: "\u5b8f\u89c2\u771f\u5b9e",
    evtolMeta2: "\u673a\u5668\u4eba",
    evtolText:
      "\u56f4\u7ed5 Isaac Sim / Isaac Lab \u5de5\u4f5c\u6d41\u6784\u5efa\u7684\u5b89\u5168\u4e16\u754c\u6a21\u578b\u539f\u578b\uff0c\u5173\u6ce8\u4eff\u771f\u3001\u72b6\u6001\u53cd\u9988\u4e0e\u573a\u666f\u8bc4\u4f30\u3002",
    trackingMeta1: "\u5b8f\u89c2\u771f\u5b9e",
    trackingMeta2: "\u8ddf\u8e2a",
    trackingTitle: "Ego-body \u4e0e\u624b\u90e8\u8ddf\u8e2a\u6d41\u6c34\u7ebf",
    trackingText:
      "\u9762\u5411\u8eab\u4f53\u3001\u624b\u90e8\u3001\u9690\u79c1\u8131\u654f\u4e0e\u591a\u6a21\u6001\u6570\u636e\u5904\u7406\u7684\u5de5\u7a0b\u6d41\u6c34\u7ebf\uff0c\u5f3a\u8c03\u6570\u636e\u6d41\u3001\u53ef\u89c6\u5316\u4e0e\u516c\u5f00\u8fb9\u754c\u3002",
    alphaMeta1: "\u793e\u4f1a\u771f\u5b9e",
    alphaMeta2: "\u91cf\u5316\u7814\u7a76",
    alphaText:
      "\u81ea\u52a8\u5316 alpha \u6316\u6398\u63a2\u7d22\u7cfb\u7edf\u3002\u516c\u5f00\u5c55\u793a\u65f6\u91cd\u70b9\u653e\u5728\u5de5\u4f5c\u6d41\u8bbe\u8ba1\u3001\u56e0\u5b50\u8868\u793a\u548c\u53ef\u590d\u73b0\u5b9e\u9a8c\u754c\u9762\u3002",
    toolsEyebrow: "Agent \u539f\u751f\u5de5\u4f5c\u6d41",
    toolsTitle: "\u8ba9\u771f\u5b9e\u63a2\u7d22\u53ef\u91cd\u590d\u7684\u5e95\u5ea7\u5de5\u5177\u3002",
    wqbText:
      "\u9762\u5411 WorldQuant BRAIN \u7814\u7a76\u6d41\u7a0b\u7684\u7ed3\u6784\u5316\u547d\u4ee4\u754c\u9762\uff0c\u652f\u6301\u667a\u80fd\u4f53\u4f7f\u7528\u3001JSON \u8f93\u51fa\u3001\u7aef\u70b9\u68c0\u67e5\u548c\u957f\u4efb\u52a1\u5904\u7406\u3002",
    arxivText:
      "\u9762\u5411\u53ef\u590d\u73b0\u6587\u732e\u68c0\u7d22\u7684 arXiv \u5de5\u5177\uff0c\u652f\u6301\u5143\u6570\u636e\u63d0\u53d6\u548c\u667a\u80fd\u4f53\u53cb\u597d\u7684\u7814\u7a76\u8f93\u5165\u3002",
    repo: "\u4ed3\u5e93",
    statement:
      "\u5fae\u89c2\u771f\u5b9e\u3001\u5b8f\u89c2\u771f\u5b9e\u548c\u793e\u4f1a\u771f\u5b9e\u662f\u7814\u7a76\u5bf9\u8c61\uff1bAgent \u539f\u751f\u5de5\u4f5c\u6d41\u662f\u5e95\u5ea7\uff0c\u4f7f\u8fd9\u4e9b\u53d1\u73b0\u8fc7\u7a0b\u53ef\u6267\u884c\u3001\u53ef\u68c0\u67e5\u3001\u53ef\u590d\u73b0\u3002",
    footerBrand: "WIZ\uff08\u82f1\u6587\u540d\uff09 - \u65e0\u76f4\u89c2 / untuitivist\uff08\u6635\u79f0\uff09",
    footerText:
      "\u5fae\u89c2\u771f\u5b9e | \u5b8f\u89c2\u771f\u5b9e | \u793e\u4f1a\u771f\u5b9e\uff0c\u4ee5 Agent \u539f\u751f\u5de5\u4f5c\u6d41\u4e3a\u5e95\u5ea7\u3002",
  },
};

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

const getInitialLanguage = () => {
  const saved = localStorage.getItem("wiz-language");
  if (saved === "en" || saved === "zh") return saved;
  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
};

let currentLanguage = getInitialLanguage();

const applyLanguage = (language) => {
  const table = copy[language];
  document.documentElement.lang = language === "zh" ? "zh-Hans" : "en";
  document.title = table.pageTitle;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", table.metaDescription);

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    if (key && table[key]) node.textContent = table[key];
  });

  if (langCurrent && langNext) {
    langCurrent.textContent = language === "zh" ? "\u4e2d" : "EN";
    langNext.textContent = language === "zh" ? "EN" : "\u4e2d";
  }

  localStorage.setItem("wiz-language", language);
  currentLanguage = language;
};

const setupCosmosField = () => {
  const canvas = document.querySelector("[data-cosmos-field]");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const random = (seed) => {
    let value = seed;
    return () => {
      value = (value * 1664525 + 1013904223) % 4294967296;
      return value / 4294967296;
    };
  };
  const createSessionSeed = () => {
    const cryptoValues = new Uint32Array(1);
    window.crypto?.getRandomValues?.(cryptoValues);
    return cryptoValues[0] || Math.floor(Math.random() * 4294967296);
  };

  const sessionSeed = createSessionSeed();
  canvas.dataset.cosmosSeed = String(sessionSeed);
  let stars = [];
  let nebulas = [];
  let animationFrame = 0;

  const buildField = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const sizeSeed = Math.floor(rect.width * 31 + rect.height * 17);
    const nextRandom = random((sessionSeed + sizeSeed) >>> 0);
    const area = rect.width * rect.height;
    const starCount = Math.min(900, Math.max(260, Math.floor(area / 2100)));

    nebulas = Array.from({ length: 5 }, (_, index) => ({
      x: rect.width * (0.46 + nextRandom() * 0.42),
      y: rect.height * (0.18 + nextRandom() * 0.72),
      rx: rect.width * (0.12 + nextRandom() * 0.18),
      ry: rect.height * (0.08 + nextRandom() * 0.2),
      hue: [38, 160, 210, 24, 190][index],
      alpha: 0.025 + nextRandom() * 0.04,
    }));

    stars = Array.from({ length: starCount }, () => {
      const clusterPull = nextRandom();
      const clusterX = rect.width * (0.56 + nextRandom() * 0.34);
      const clusterY = rect.height * (0.24 + nextRandom() * 0.58);
      const x = clusterPull > 0.72 ? clusterX + (nextRandom() - 0.5) * rect.width * 0.22 : nextRandom() * rect.width;
      const y = clusterPull > 0.72 ? clusterY + (nextRandom() - 0.5) * rect.height * 0.22 : nextRandom() * rect.height;
      const depth = nextRandom();
      const warm = nextRandom() > 0.76;
      const cool = !warm && nextRandom() > 0.72;

      return {
        x: Math.max(0, Math.min(rect.width, x)),
        y: Math.max(0, Math.min(rect.height, y)),
        radius: 0.35 + Math.pow(nextRandom(), 3) * 1.75,
        alpha: 0.18 + Math.pow(nextRandom(), 2) * 0.72,
        depth,
        phase: nextRandom() * Math.PI * 2,
        color: warm ? "255, 214, 164" : cool ? "170, 205, 255" : "242, 247, 255",
      };
    });

    canvas.dataset.cosmosSignature = stars
      .slice(0, 8)
      .map((star) => `${Math.round(star.x)}:${Math.round(star.y)}:${star.radius.toFixed(2)}`)
      .join("|");
  };

  const drawField = (time = 0) => {
    const rect = canvas.getBoundingClientRect();
    context.clearRect(0, 0, rect.width, rect.height);
    context.fillStyle = "#030908";
    context.fillRect(0, 0, rect.width, rect.height);

    nebulas.forEach((nebula) => {
      const gradient = context.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, Math.max(nebula.rx, nebula.ry));
      gradient.addColorStop(0, `hsla(${nebula.hue}, 68%, 58%, ${nebula.alpha})`);
      gradient.addColorStop(0.42, `hsla(${nebula.hue}, 58%, 42%, ${nebula.alpha * 0.34})`);
      gradient.addColorStop(1, "rgba(3, 9, 8, 0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.ellipse(nebula.x, nebula.y, nebula.rx, nebula.ry, -0.28, 0, Math.PI * 2);
      context.fill();
    });

    stars.forEach((star) => {
      const twinkle = prefersReducedMotion ? 1 : 0.82 + Math.sin(time / (1400 + star.depth * 2200) + star.phase) * 0.18;
      const alpha = star.alpha * twinkle;
      context.fillStyle = `rgba(${star.color}, ${alpha})`;
      context.beginPath();
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fill();

      if (star.radius > 1.35) {
        context.fillStyle = `rgba(${star.color}, ${alpha * 0.16})`;
        context.beginPath();
        context.arc(star.x, star.y, star.radius * 3.2, 0, Math.PI * 2);
        context.fill();
      }
    });

    if (!prefersReducedMotion) animationFrame = requestAnimationFrame(drawField);
  };

  const refresh = () => {
    cancelAnimationFrame(animationFrame);
    buildField();
    drawField();
  };

  refresh();
  window.addEventListener("resize", refresh);
};

const setupBigDipperEasterEgg = () => {
  const layer = document.querySelector("[data-dipper-layer]");
  if (!layer) return;

  const dipperStorageKey = "wiz-big-dipper-misses";
  const polarisStorageKey = "wiz-big-dipper-polaris-misses";
  const safeStorage = {
    get(key) {
      try {
        return Number.parseInt(localStorage.getItem(key) || "0", 10) || 0;
      } catch {
        return 0;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, String(value));
      } catch {
        /* localStorage can be unavailable in strict privacy modes. */
      }
    },
  };

  const isLocalPreview = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  const dipperMisses = safeStorage.get(dipperStorageKey);
  const polarisMisses = safeStorage.get(polarisStorageKey);
  const shouldForcePair = isLocalPreview || polarisMisses >= 48;
  const shouldAppear = shouldForcePair || dipperMisses >= 6 || Math.random() < 1 / 7;
  if (!shouldAppear) {
    const nextDipperMisses = Math.min(dipperMisses + 1, 6);
    const nextPolarisMisses = Math.min(polarisMisses + 1, 48);
    safeStorage.set(dipperStorageKey, nextDipperMisses);
    safeStorage.set(polarisStorageKey, nextPolarisMisses);
    layer.dataset.dipperShown = "false";
    layer.dataset.polarisShown = "false";
    layer.dataset.dipperMisses = String(nextDipperMisses);
    layer.dataset.polarisMisses = String(nextPolarisMisses);
    return;
  }

  const shouldShowPolaris = shouldForcePair || Math.random() < 1 / 7;
  const nextPolarisMisses = shouldShowPolaris ? 0 : Math.min(polarisMisses + 1, 48);
  safeStorage.set(dipperStorageKey, 0);
  safeStorage.set(polarisStorageKey, nextPolarisMisses);
  layer.dataset.dipperShown = "true";
  layer.dataset.polarisShown = String(shouldShowPolaris);
  layer.dataset.dipperMisses = "0";
  layer.dataset.polarisMisses = String(nextPolarisMisses);

  const compact = window.matchMedia("(max-width: 720px)").matches;
  const randomBetween = (min, max) => min + Math.random() * (max - min);
  const x = randomBetween(compact ? 18 : 10, compact ? 82 : 88);
  const y = randomBetween(compact ? 18 : 12, compact ? 82 : 76);
  const scale = randomBetween(compact ? 0.62 : 0.72, compact ? 0.9 : 1.18);
  const rotate = randomBetween(-28, 24);

  const points = [
    { x: 27.5, y: 16.6, major: true },
    { x: 19, y: 41.8, major: false },
    { x: 52.5, y: 61.4, major: true },
    { x: 68.3, y: 46.1, major: true },
    { x: 94.4, y: 49.9, major: false },
    { x: 115.8, y: 51.2, major: true },
    { x: 141, y: 73.4, major: true },
  ];
  const polaris = { x: 69, y: -141.4 };
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [3, 4],
    [4, 5],
    [5, 6],
  ];
  const flashDelay = 220;
  const flashDuration = 720;
  const lineDuration = 720;
  const lineBaseDelay = flashDelay + flashDuration + 160;
  const lineStagger = lineDuration;
  const polarisDelay = lineBaseDelay + edges.length * lineStagger + 280;
  const connectDelays = points.map(() => Number.POSITIVE_INFINITY);
  const svgNamespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNamespace, "svg");
  svg.classList.add("big-dipper");
  svg.setAttribute("viewBox", "-10 -156 180 250");
  svg.setAttribute("role", "img");
  svg.style.setProperty("--dipper-x", `${x}%`);
  svg.style.setProperty("--dipper-y", `${y}%`);
  svg.style.setProperty("--dipper-scale", scale.toFixed(3));
  svg.style.setProperty("--dipper-rotate", `${rotate.toFixed(1)}deg`);

  edges.forEach(([fromIndex, toIndex], index) => {
    const from = points[fromIndex];
    const to = points[toIndex];
    const line = document.createElementNS(svgNamespace, "line");
    const length = Math.hypot(to.x - from.x, to.y - from.y);
    const delay = lineBaseDelay + index * lineStagger;
    connectDelays[fromIndex] = Math.min(connectDelays[fromIndex], delay);
    connectDelays[toIndex] = Math.min(connectDelays[toIndex], delay + lineDuration);
    line.classList.add("dipper-line");
    line.setAttribute("x1", String(from.x));
    line.setAttribute("y1", String(from.y));
    line.setAttribute("x2", String(to.x));
    line.setAttribute("y2", String(to.y));
    line.style.setProperty("--delay", `${delay}ms`);
    line.style.setProperty("--line-length", length.toFixed(2));
    svg.append(line);
  });

  points.forEach((point, index) => {
    const star = document.createElementNS(svgNamespace, "circle");
    star.classList.add("dipper-star");
    if (point.major) star.classList.add("major");
    star.setAttribute("cx", String(point.x));
    star.setAttribute("cy", String(point.y));
    star.setAttribute("r", point.major ? "2.2" : "1.75");
    star.style.setProperty("--flash-delay", `${flashDelay}ms`);
    star.style.setProperty("--connect-delay", `${Number.isFinite(connectDelays[index]) ? connectDelays[index] : lineBaseDelay}ms`);
    svg.append(star);
  });

  if (shouldShowPolaris) {
    const star = document.createElementNS(svgNamespace, "circle");
    star.classList.add("polaris-star");
    star.setAttribute("cx", String(polaris.x));
    star.setAttribute("cy", String(polaris.y));
    star.setAttribute("r", "2.6");
    star.style.setProperty("--polaris-delay", `${polarisDelay}ms`);
    svg.append(star);
  }

  layer.replaceChildren(svg);
};

const setupSolarSystem = () => {
  const map = document.querySelector(".system-map");
  if (!map) return;

  const twoPi = Math.PI * 2;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const randomBetween = (min, max) => min + Math.random() * (max - min);
  const randomSigned = (range) => randomBetween(-range, range);
  const baseAxisAngle = randomBetween(0, 360);
  const firstAxisGap = randomBetween(100, 140);
  const secondAxisGap = randomBetween(Math.max(100, 220 - firstAxisGap), Math.min(140, 260 - firstAxisGap));
  const axisAngles = [baseAxisAngle, baseAxisAngle + firstAxisGap, baseAxisAngle + firstAxisGap + secondAxisGap];
  const axisRatios = [0.25, 0.5, 0.75].map((ratio) => clamp(ratio + randomSigned(0.05), ratio - 0.05, ratio + 0.05));

  const orbitConfigs = [
    {
      key: "micro",
      selector: ".micro-orbit",
      axisRatio: axisRatios[0],
      aspectRatio: randomBetween(0.82, 0.9),
      tilt: axisAngles[0],
      period: 17000,
      phase: randomBetween(0, twoPi),
      radius: 18,
    },
    {
      key: "macro",
      selector: ".macro-orbit",
      axisRatio: axisRatios[1],
      aspectRatio: randomBetween(0.82, 0.9),
      tilt: axisAngles[1],
      period: 43000,
      phase: randomBetween(0, twoPi),
      radius: 24,
    },
    {
      key: "social",
      selector: ".social-orbit",
      axisRatio: axisRatios[2],
      aspectRatio: randomBetween(0.82, 0.9),
      tilt: axisAngles[2],
      period: 88000,
      phase: randomBetween(0, twoPi),
      radius: 31,
    },
  ];

  const orbitPadding = 18;
  const designBoundsSafety = 1.02;
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const minPlanetRadii = {
    micro: 6,
    macro: 6.5,
    social: 7.5,
  };
  const iconRadiusThresholds = {
    micro: 10,
    macro: 13,
    social: 15,
  };
  const minSunRadius = 17;
  const sunIconRadiusThreshold = 28;
  const collisionLayer = map.querySelector("[data-collision-layer]");
  const collisionCooldownMs = 9000;
  const planetColors = {
    micro: "116, 215, 176",
    macro: "85, 158, 218",
    social: "238, 133, 80",
  };
  const collisionRestitution = 0.38;
  const collisionImpulseScale = 12;
  const collisionDisplacementDamping = 0.91;
  const collisionVelocityDamping = 0.88;
  const collisionReturnStrength = 0.0042;
  const maxCollisionKick = 2.8;
  let activePlanet = null;
  let orbitState = [];
  let lastFrame = performance.now();
  let lastCollisionAt = 0;
  let lastCollisionPair = "";

  const solveKepler = (meanAnomaly, eccentricity) => {
    let eccentricAnomaly = meanAnomaly;
    for (let index = 0; index < 5; index += 1) {
      eccentricAnomaly -=
        (eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly) /
        (1 - eccentricity * Math.cos(eccentricAnomaly));
    }
    return eccentricAnomaly;
  };

  const rotatePoint = (x, y, angle) => ({
    x: x * Math.cos(angle) - y * Math.sin(angle),
    y: x * Math.sin(angle) + y * Math.cos(angle),
  });

  const limitVector = (vector, maxLength) => {
    const length = Math.hypot(vector.x, vector.y);
    if (length <= maxLength || length === 0) return vector;
    return {
      x: (vector.x / length) * maxLength,
      y: (vector.y / length) * maxLength,
    };
  };

  const getPlanetMass = (state) => Math.max(1, Math.PI * Math.pow(state.renderedRadius || state.radius || 1, 2));

  const applyInelasticCollision = (first, second) => {
    const dx = second.position.x - first.position.x;
    const dy = second.position.y - first.position.y;
    const distance = Math.hypot(dx, dy) || 1;
    const normal = { x: dx / distance, y: dy / distance };
    const tangent = { x: -normal.y, y: normal.x };
    const massFirst = getPlanetMass(first);
    const massSecond = getPlanetMass(second);
    const velocityFirst = first.motionVelocity || first.velocity || { x: 0, y: 0 };
    const velocitySecond = second.motionVelocity || second.velocity || { x: 0, y: 0 };
    const firstNormal = velocityFirst.x * normal.x + velocityFirst.y * normal.y;
    const secondNormal = velocitySecond.x * normal.x + velocitySecond.y * normal.y;
    const firstTangent = velocityFirst.x * tangent.x + velocityFirst.y * tangent.y;
    const secondTangent = velocitySecond.x * tangent.x + velocitySecond.y * tangent.y;
    const nextFirstNormal =
      ((massFirst - collisionRestitution * massSecond) * firstNormal +
        (1 + collisionRestitution) * massSecond * secondNormal) /
      (massFirst + massSecond);
    const nextSecondNormal =
      ((massSecond - collisionRestitution * massFirst) * secondNormal +
        (1 + collisionRestitution) * massFirst * firstNormal) /
      (massFirst + massSecond);
    const firstKick = limitVector({
      x: (normal.x * nextFirstNormal + tangent.x * firstTangent - velocityFirst.x) * collisionImpulseScale,
      y: (normal.y * nextFirstNormal + tangent.y * firstTangent - velocityFirst.y) * collisionImpulseScale,
    }, maxCollisionKick);
    const secondKick = limitVector({
      x: (normal.x * nextSecondNormal + tangent.x * secondTangent - velocitySecond.x) * collisionImpulseScale,
      y: (normal.y * nextSecondNormal + tangent.y * secondTangent - velocitySecond.y) * collisionImpulseScale,
    }, maxCollisionKick);
    const overlap = Math.max(0, first.renderedRadius + second.renderedRadius - distance);
    const separation = overlap * 0.54 + 3;

    first.impactVelocity.x += firstKick.x;
    first.impactVelocity.y += firstKick.y;
    second.impactVelocity.x += secondKick.x;
    second.impactVelocity.y += secondKick.y;
    first.impactOffset.x -= normal.x * separation * (massSecond / (massFirst + massSecond));
    first.impactOffset.y -= normal.y * separation * (massSecond / (massFirst + massSecond));
    second.impactOffset.x += normal.x * separation * (massFirst / (massFirst + massSecond));
    second.impactOffset.y += normal.y * separation * (massFirst / (massFirst + massSecond));
  };

  const hideCards = () => {
    map.querySelectorAll(".planet-card").forEach((card) => card.classList.remove("is-visible"));
    map.querySelectorAll(".orbit-track").forEach((track) => track.classList.remove("is-paused"));
    activePlanet = null;
  };

  const makeDebris = (x, y, dx, dy, size, life, spin, color) => {
    if (!collisionLayer) return;
    const fragment = document.createElement("span");
    fragment.className = "debris-fragment";
    fragment.style.setProperty("--x", `${x}px`);
    fragment.style.setProperty("--y", `${y}px`);
    fragment.style.setProperty("--dx", `${dx}px`);
    fragment.style.setProperty("--dy", `${dy}px`);
    fragment.style.setProperty("--size", `${size}px`);
    fragment.style.setProperty("--life", `${life}ms`);
    fragment.style.setProperty("--spin", `${spin}deg`);
    fragment.style.setProperty("--end-scale", (0.36 + Math.random() * 0.9).toFixed(2));
    fragment.style.setProperty("--debris-rgb", color);
    fragment.addEventListener("animationend", () => fragment.remove(), { once: true });
    collisionLayer.appendChild(fragment);
  };

  const triggerCollision = (first, second, now) => {
    if (!collisionLayer) return;

    const pair = [first.key, second.key].sort().join("-");
    if (now - lastCollisionAt < collisionCooldownMs && pair === lastCollisionPair) return;

    lastCollisionAt = now;
    lastCollisionPair = pair;
    applyInelasticCollision(first, second);

    const impact = {
      x: (first.position.x + second.position.x) / 2,
      y: (first.position.y + second.position.y) / 2,
    };
    const relativeVelocity = {
      x: (first.velocity?.x || 0) - (second.velocity?.x || 0),
      y: (first.velocity?.y || 0) - (second.velocity?.y || 0),
    };
    const relativeSpeed = Math.hypot(relativeVelocity.x, relativeVelocity.y) || 0.12;
    const tangent = {
      x: relativeVelocity.x / relativeSpeed,
      y: relativeVelocity.y / relativeSpeed,
    };
    const normal = {
      x: -(second.position.y - first.position.y),
      y: second.position.x - first.position.x,
    };
    const normalLength = Math.hypot(normal.x, normal.y) || 1;
    normal.x /= normalLength;
    normal.y /= normalLength;

    const flash = document.createElement("span");
    flash.className = "collision-flash";
    flash.style.setProperty("--x", `${impact.x}px`);
    flash.style.setProperty("--y", `${impact.y}px`);
    flash.style.setProperty("--size", `${Math.max(first.radius, second.radius) * 5 * (first.galaxyScale || 1)}px`);
    flash.style.setProperty("--life", "840ms");
    flash.style.setProperty("--flash-rgb", planetColors[second.key] || planetColors[first.key]);
    flash.addEventListener("animationend", () => flash.remove(), { once: true });
    collisionLayer.appendChild(flash);

    [first.planet, second.planet].forEach((planet) => {
      planet.classList.remove("is-colliding");
      void planet.offsetWidth;
      planet.classList.add("is-colliding");
      window.setTimeout(() => planet.classList.remove("is-colliding"), 760);
    });

    const fragments = 24;
    for (let index = 0; index < fragments; index += 1) {
      const side = index % 2 === 0 ? 1 : -1;
      const spread = (Math.random() - 0.5) * 1.4;
      const speed = 36 + Math.random() * 118 + Math.min(relativeSpeed * 220, 96);
      const direction = {
        x: tangent.x * side + normal.x * spread,
        y: tangent.y * side + normal.y * spread,
      };
      const length = Math.hypot(direction.x, direction.y) || 1;
      const color = Math.random() > 0.5 ? planetColors[first.key] : planetColors[second.key];
      makeDebris(
        impact.x + (Math.random() - 0.5) * 10,
        impact.y + (Math.random() - 0.5) * 10,
        (direction.x / length) * speed,
        (direction.y / length) * speed,
        2 + Math.random() * 5,
        2400 + Math.random() * 2200,
        (Math.random() > 0.5 ? 1 : -1) * (120 + Math.random() * 540),
        color
      );
    }
  };

  const showCard = (planet) => {
    const key = planet.getAttribute("data-planet");
    const card = key ? map.querySelector(`[data-planet-card="${key}"]`) : null;
    const state = orbitState.find((entry) => entry.key === key);
    const track = state?.track;
    if (!card) return;

    hideCards();
    activePlanet = planet;
    track?.classList.add("is-paused");
    card.classList.add("is-visible");
    positionCard(planet, card);
  };

  const positionCard = (planet, card) => {
    const mapRect = map.getBoundingClientRect();
    const planetRect = planet.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const gap = 14;
    let left = planetRect.right - mapRect.left + gap;
    const maxLeft = mapRect.width - cardRect.width - 12;

    if (left > maxLeft) left = planetRect.left - mapRect.left - cardRect.width - gap;
    left = clamp(left, 12, Math.max(12, maxLeft));

    const top = clamp(
      planetRect.top - mapRect.top + planetRect.height / 2,
      cardRect.height / 2 + 12,
      mapRect.height - cardRect.height / 2 - 12
    );

    card.style.setProperty("--card-left", `${left}px`);
    card.style.setProperty("--card-top", `${top}px`);
  };

  const layoutOrbits = () => {
    map.style.setProperty("--galaxy-scale", "1");
    const mapRect = map.getBoundingClientRect();
    const maxSemiMajor = Math.max(Math.min(mapRect.width, mapRect.height) * 0.68, 720);

    const designOrbits = orbitConfigs.map((config) => {
      const eccentricity = Math.sqrt(1 - config.aspectRatio * config.aspectRatio);
      const semiMajor = maxSemiMajor * config.axisRatio;
      const semiMinor = semiMajor * config.aspectRatio;
      const tilt = toRadians(config.tilt);
      const focusOffset = semiMajor * eccentricity;
      const centerOffset = rotatePoint(-focusOffset, 0, tilt);
      const yExtent = Math.sqrt(
        Math.pow(semiMajor * Math.sin(tilt), 2) + Math.pow(semiMinor * Math.cos(tilt), 2)
      );
      const xExtent = Math.sqrt(
        Math.pow(semiMajor * Math.cos(tilt), 2) + Math.pow(semiMinor * Math.sin(tilt), 2)
      );
      return {
        ...config,
        eccentricity,
        semiMajor,
        semiMinor,
        centerOffset,
        xExtent,
        yExtent,
        minX: centerOffset.x - xExtent - config.radius - orbitPadding,
        maxX: centerOffset.x + xExtent + config.radius + orbitPadding,
        minY: centerOffset.y - yExtent - config.radius - orbitPadding,
        maxY: centerOffset.y + yExtent + config.radius + orbitPadding,
      };
    });

    const requiredSize = designOrbits.reduce((size, orbit) => {
      return {
        width: Math.max(size.width, Math.max(Math.abs(orbit.minX), Math.abs(orbit.maxX)) * 2 * designBoundsSafety),
        height: Math.max(size.height, Math.max(Math.abs(orbit.minY), Math.abs(orbit.maxY)) * 2 * designBoundsSafety),
      };
    }, { width: 0, height: 0 });

    const galaxyScale = Math.min(1, mapRect.width / requiredSize.width, mapRect.height / requiredSize.height);
    map.style.setProperty("--galaxy-scale", galaxyScale.toFixed(4));
    map.style.setProperty("--orbit-axis-upper", `${maxSemiMajor * galaxyScale}px`);
    const sunDiameter = Math.max(110 * galaxyScale, minSunRadius * 2);
    map.style.setProperty("--sun-size", `${sunDiameter}px`);
    map.style.setProperty("--sun-icon-size", `${Math.max(42 * galaxyScale, 26)}px`);
    map.querySelector(".truth-sun")?.classList.toggle("is-icon-hidden", sunDiameter / 2 < sunIconRadiusThreshold);

    const measuredMapRect = map.getBoundingClientRect();
    const focus = {
      x: measuredMapRect.width / 2,
      y: measuredMapRect.height / 2,
    };

    map.style.setProperty("--sun-x", `${focus.x}px`);
    map.style.setProperty("--sun-y", `${focus.y}px`);

    orbitState = orbitConfigs
      .map((config) => {
        const track = map.querySelector(config.selector);
        const planet = map.querySelector(`[data-planet="${config.key}"]`);
        const packageNode = map.querySelector(`[data-planet-package="${config.key}"]`);
        const card = map.querySelector(`[data-planet-card="${config.key}"]`);
        if (!track || !planet || !packageNode || !card) return null;

        const designOrbit = designOrbits.find((orbit) => orbit.key === config.key);
        if (!designOrbit) return null;

        const semiMajor = designOrbit.semiMajor * galaxyScale;
        const semiMinor = designOrbit.semiMinor * galaxyScale;
        const tilt = toRadians(config.tilt);
        const center = {
          x: focus.x + designOrbit.centerOffset.x * galaxyScale,
          y: focus.y + designOrbit.centerOffset.y * galaxyScale,
        };

        const renderedRadius = Math.max(config.radius * galaxyScale, minPlanetRadii[config.key] || 12);
        const renderedDiameter = renderedRadius * 2;

        track.style.setProperty("--orbit-width", `${semiMajor * 2}px`);
        track.style.setProperty("--orbit-height", `${semiMinor * 2}px`);
        track.style.setProperty("--orbit-left", `${center.x}px`);
        track.style.setProperty("--orbit-top", `${center.y}px`);
        track.style.setProperty("--tilt", `${config.tilt}deg`);
        planet.style.setProperty("--planet-size", `${renderedDiameter}px`);
        planet.style.setProperty("--planet-icon-size", `${Math.max(renderedDiameter * 0.42, 13)}px`);
        planet.classList.toggle("is-icon-hidden", renderedRadius < (iconRadiusThresholds[config.key] || 12));

        return {
          ...config,
          track,
          planet,
          packageNode,
          card,
          focus,
          renderedRadius,
          semiMajor,
          semiMinor,
          tilt,
          eccentricity: designOrbit.eccentricity,
          meanAnomaly: config.phase,
          galaxyScale,
          position: { x: center.x, y: center.y },
          previousPosition: { x: center.x, y: center.y },
          velocity: { x: 0, y: 0 },
          orbitalVelocity: { x: 0, y: 0 },
          motionVelocity: { x: 0, y: 0 },
          impactOffset: { x: 0, y: 0 },
          impactVelocity: { x: 0, y: 0 },
          paused: false,
        };
      })
      .filter(Boolean);
  };

  const positionPlanet = (state, delta = 0) => {
    const previous = state.position || { x: state.focus.x, y: state.focus.y };
    const eccentricAnomaly = solveKepler(state.meanAnomaly, state.eccentricity);
    const x = state.semiMajor * (Math.cos(eccentricAnomaly) - state.eccentricity);
    const y = state.semiMinor * Math.sin(eccentricAnomaly);
    const point = rotatePoint(x, y, state.tilt);
    const orbitPosition = {
      x: state.focus.x + point.x,
      y: state.focus.y + point.y,
    };
    const step = Math.min(delta || 16.67, 48);

    state.impactVelocity.x -= state.impactOffset.x * collisionReturnStrength * step;
    state.impactVelocity.y -= state.impactOffset.y * collisionReturnStrength * step;
    state.impactOffset.x += state.impactVelocity.x * step * 0.06;
    state.impactOffset.y += state.impactVelocity.y * step * 0.06;
    state.impactVelocity.x *= Math.pow(collisionVelocityDamping, step / 16.67);
    state.impactVelocity.y *= Math.pow(collisionVelocityDamping, step / 16.67);
    state.impactOffset.x *= Math.pow(collisionDisplacementDamping, step / 16.67);
    state.impactOffset.y *= Math.pow(collisionDisplacementDamping, step / 16.67);

    const position = {
      x: orbitPosition.x + state.impactOffset.x,
      y: orbitPosition.y + state.impactOffset.y,
    };

    state.previousPosition = previous;
    state.position = position;
    state.orbitalVelocity = {
      x: orbitPosition.x - (state.previousOrbitPosition?.x || orbitPosition.x),
      y: orbitPosition.y - (state.previousOrbitPosition?.y || orbitPosition.y),
    };
    state.velocity = {
      x: state.orbitalVelocity.x + state.impactVelocity.x,
      y: state.orbitalVelocity.y + state.impactVelocity.y,
    };
    state.motionVelocity = state.velocity;
    state.previousOrbitPosition = orbitPosition;

    state.packageNode.style.setProperty("--planet-x", `${position.x}px`);
    state.packageNode.style.setProperty("--planet-y", `${position.y}px`);
  };

  const checkCollisions = (now) => {
    if (!collisionLayer || orbitState.length < 2) return;
    for (let firstIndex = 0; firstIndex < orbitState.length - 1; firstIndex += 1) {
      for (let secondIndex = firstIndex + 1; secondIndex < orbitState.length; secondIndex += 1) {
        const first = orbitState[firstIndex];
        const second = orbitState[secondIndex];
        const distance = Math.hypot(first.position.x - second.position.x, first.position.y - second.position.y);
        const threshold = (first.renderedRadius + second.renderedRadius) * 0.88;
        if (distance <= threshold) {
          triggerCollision(first, second, now);
          return;
        }
      }
    }
  };

  const tick = (now) => {
    const delta = now - lastFrame;
    lastFrame = now;

    orbitState.forEach((state) => {
      state.paused = state.track.classList.contains("is-paused");
      if (!state.paused) {
        state.meanAnomaly = (state.meanAnomaly + (delta / state.period) * twoPi) % twoPi;
      }
      positionPlanet(state, delta);
    });
    checkCollisions(now);

    if (activePlanet) {
      const key = activePlanet.getAttribute("data-planet");
      const card = key ? map.querySelector(`[data-planet-card="${key}"]`) : null;
      if (card?.classList.contains("is-visible")) positionCard(activePlanet, card);
    }

    requestAnimationFrame(tick);
  };

  map.querySelectorAll(".map-planet, .truth-sun").forEach((planet) => {
    planet.addEventListener("pointerenter", () => showCard(planet));
    planet.addEventListener("focus", () => showCard(planet));
    planet.addEventListener("click", () => showCard(planet));
    planet.addEventListener("pointerleave", hideCards);
    planet.addEventListener("blur", hideCards);
  });

  layoutOrbits();
  orbitState.forEach(positionPlanet);
  requestAnimationFrame((now) => {
    lastFrame = now;
    requestAnimationFrame(tick);
  });
  window.addEventListener("resize", layoutOrbits);
};

setHeaderState();
applyLanguage(currentLanguage);
setupCosmosField();
setupBigDipperEasterEgg();
setupSolarSystem();
window.addEventListener("scroll", setHeaderState, { passive: true });
langToggle?.addEventListener("click", () => {
  applyLanguage(currentLanguage === "zh" ? "en" : "zh");
});
