const header = document.querySelector("[data-header]");
const langToggle = document.querySelector("[data-lang-toggle]");
const langCurrent = document.querySelector("[data-lang-current]");
const langNext = document.querySelector("[data-lang-next]");

const copy = {
  en: {
    pageTitle: "WIZ / Within Intelligence Zone",
    metaDescription:
      "WIZ / Within Intelligence Zone: Micro Truth, Macro Truth, and Social Truth, grounded by Agentic Workflow.",
    brandMark: "WIZ",
    brand: "Wuzhiguan / untuitivist",
    navTheme: "Theme",
    navWork: "Work",
    navTools: "Tools",
    navContact: "Contact",
    heroEyebrow: "WIZ - nicknames: Wuzhiguan / untuitivist",
    heroTitle: "Intelligence from Within",
    heroLead:
      "WIZ studies intelligence from within real systems: Micro Truth in physical signals, Macro Truth in embodied environments, and Social Truth in collective decision systems.",
    brandNote:
      "Concepts need intuition; intuition needs concepts. Knowledge becomes possible when the two are joined.",
    viewWork: "View selected work",
    mapTruth: "Truth",
    mapMicroScope: "physical signal",
    mapMicro: "Micro",
    mapMicroIntro: "Truth inside physical signals and local sensor structures.",
    mapMacroScope: "embodied environment",
    mapMacro: "Macro",
    mapMacroIntro: "Truth inside embodied scenes, bodies, robots, and motion.",
    mapSocialScope: "collective decision",
    mapSocial: "Social",
    mapSocialIntro: "Truth inside markets, incentives, and collective decisions.",
    themeEyebrow: "Core theme",
    themeTitle: "Three layers of truth, grounded by agentic workflow.",
    zoneSignalTitle: "Micro",
    zoneSignalText:
      "Micro Truth focuses on local physical signals: the hidden structures inside sensors, machines, and small-scale physical processes.",
    zoneEmbodiedTitle: "Macro",
    zoneEmbodiedText:
      "Macro Truth focuses on embodied and spatial systems: bodies, robots, scenes, trajectories, and their interaction with the physical world.",
    zoneWorkflowTitle: "Social",
    zoneWorkflowText:
      "Social Truth focuses on collective decision systems: markets, incentives, signals, and factor structures emerging from human and institutional behavior.",
    foundationTitle: "Agentic Workflow",
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
    toolsEyebrow: "Agentic Workflow",
    toolsTitle: "The foundation that makes truth-seeking repeatable.",
    wqbText:
      "A command interface for structured WorldQuant BRAIN research workflows, designed for agent usage, JSON output, endpoint inspection, and long-running job handling.",
    arxivText:
      "A focused arXiv retrieval toolkit for reproducible literature search, metadata extraction, and agent-friendly research intake.",
    repo: "Repository",
    statement:
      "Micro Truth, Macro Truth, and Social Truth are the domains. Agentic Workflow is the foundation that makes their discovery loops executable, inspectable, and repeatable.",
    footerBrand: "WIZ - Wuzhiguan / untuitivist",
    footerText: "Micro Truth, Macro Truth, and Social Truth, grounded by Agentic Workflow.",
  },
  zh: {
    pageTitle: "WIZ / \u65e0\u76f4\u89c2 / Intelligence from Within",
    metaDescription:
      "WIZ / \u65e0\u76f4\u89c2\uff1a\u5fae\u89c2\u771f\u5b9e\u3001\u5b8f\u89c2\u771f\u5b9e\u4e0e\u793e\u4f1a\u771f\u5b9e\uff0c\u4ee5\u667a\u80fd\u4f53\u5de5\u4f5c\u6d41\u4e3a\u5e95\u5ea7\u3002",
    brandMark: "WIZ",
    brand: "\u65e0\u76f4\u89c2 / untuitivist",
    navTheme: "\u4e3b\u7ebf",
    navWork: "\u6210\u679c",
    navTools: "\u5de5\u5177",
    navContact: "\u8054\u7cfb",
    heroEyebrow: "WIZ\uff08\u82f1\u6587\u540d\uff09 - \u6635\u79f0\uff1a\u65e0\u76f4\u89c2 / untuitivist",
    heroTitle: "Intelligence from Within",
    heroLead:
      "\u4ece\u771f\u5b9e\u7cfb\u7edf\u5185\u90e8\u751f\u6210\u667a\u80fd\uff1a\u5728\u7269\u7406\u4fe1\u53f7\u4e2d\u5bfb\u627e\u5fae\u89c2\u771f\u5b9e\uff0c\u5728\u5177\u8eab\u73af\u5883\u4e2d\u5efa\u6a21\u5b8f\u89c2\u771f\u5b9e\uff0c\u5728\u96c6\u4f53\u51b3\u7b56\u7cfb\u7edf\u4e2d\u53d1\u73b0\u793e\u4f1a\u771f\u5b9e\u3002",
    brandNote:
      "\u6982\u5ff5\u65e0\u76f4\u89c2\u5219\u7a7a\uff0c\u76f4\u89c2\u65e0\u6982\u5ff5\u5219\u76f2\uff1b\u4e24\u8005\u7ed3\u5408\uff0c\u77e5\u8bc6\u65b9\u5f97\u53ef\u80fd\u3002",
    viewWork: "\u67e5\u770b\u4ee3\u8868\u5de5\u4f5c",
    mapTruth: "\u771f\u5b9e",
    mapMicroScope: "\u7269\u7406\u4fe1\u53f7",
    mapMicro: "\u5fae\u89c2",
    mapMicroIntro: "\u4ece\u7269\u7406\u4fe1\u53f7\u548c\u5c40\u90e8\u4f20\u611f\u7ed3\u6784\u4e2d\u63d0\u53d6\u771f\u5b9e\u3002",
    mapMacroScope: "\u5177\u8eab\u73af\u5883",
    mapMacro: "\u5b8f\u89c2",
    mapMacroIntro: "\u5728\u573a\u666f\u3001\u8eab\u4f53\u3001\u673a\u5668\u4eba\u4e0e\u52a8\u4f5c\u4e2d\u5efa\u6a21\u771f\u5b9e\u3002",
    mapSocialScope: "\u96c6\u4f53\u51b3\u7b56",
    mapSocial: "\u793e\u4f1a",
    mapSocialIntro: "\u5728\u5e02\u573a\u3001\u6fc0\u52b1\u548c\u96c6\u4f53\u51b3\u7b56\u4e2d\u53d1\u73b0\u771f\u5b9e\u3002",
    themeEyebrow: "\u6838\u5fc3\u4e3b\u7ebf",
    themeTitle: "\u4e09\u5c42\u771f\u5b9e\u4e16\u754c\uff0c\u4ee5\u667a\u80fd\u4f53\u5de5\u4f5c\u6d41\u4e3a\u5e95\u5ea7\u3002",
    zoneSignalTitle: "\u5fae\u89c2",
    zoneSignalText:
      "\u5fae\u89c2\u771f\u5b9e\u5173\u6ce8\u5c40\u90e8\u7269\u7406\u4fe1\u53f7\u4e2d\u7684\u771f\u5b9e\u7ed3\u6784\uff0c\u4f8b\u5982\u4f20\u611f\u5668\u3001\u673a\u68b0\u8bbe\u5907\u548c\u5c0f\u5c3a\u5ea6\u7269\u7406\u8fc7\u7a0b\u5185\u90e8\u7684\u6a21\u5f0f\u3001\u7ea6\u675f\u4e0e\u53d8\u5316\u3002",
    zoneEmbodiedTitle: "\u5b8f\u89c2",
    zoneEmbodiedText:
      "\u5b8f\u89c2\u771f\u5b9e\u5173\u6ce8\u5177\u8eab\u4e0e\u7a7a\u95f4\u7cfb\u7edf\u4e2d\u7684\u771f\u5b9e\u7ed3\u6784\uff0c\u4f8b\u5982\u8eab\u4f53\u3001\u673a\u5668\u4eba\u3001\u573a\u666f\u3001\u8f68\u8ff9\uff0c\u4ee5\u53ca\u5b83\u4eec\u4e0e\u7269\u7406\u4e16\u754c\u7684\u4ea4\u4e92\u3002",
    zoneWorkflowTitle: "\u793e\u4f1a",
    zoneWorkflowText:
      "\u793e\u4f1a\u771f\u5b9e\u5173\u6ce8\u96c6\u4f53\u51b3\u7b56\u7cfb\u7edf\u4e2d\u7684\u771f\u5b9e\u7ed3\u6784\uff0c\u4f8b\u5982\u5e02\u573a\u3001\u6fc0\u52b1\u3001\u4fe1\u606f\u6d41\uff0c\u4ee5\u53ca\u7531\u4eba\u548c\u673a\u6784\u884c\u4e3a\u5171\u540c\u751f\u6210\u7684\u56e0\u5b50\u6a21\u5f0f\u3002",
    foundationTitle: "\u667a\u80fd\u4f53\u5de5\u4f5c\u6d41",
    foundationText:
      "\u667a\u80fd\u4f53\u5de5\u4f5c\u6d41\u662f\u4e09\u7c7b\u771f\u5b9e\u4e16\u754c\u7814\u7a76\u7684\u64cd\u4f5c\u5e95\u5ea7\uff1a\u901a\u8fc7\u5de5\u5177\u3001API\u3001\u811a\u672c\u548c\u754c\u9762\uff0c\u8ba9\u667a\u80fd\u4f53\u80fd\u591f\u641c\u7d22\u3001\u8fd0\u884c\u3001\u68c0\u67e5\u5e76\u8fed\u4ee3\u7814\u7a76\u6d41\u7a0b\u3002",
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
    toolsEyebrow: "\u667a\u80fd\u4f53\u5de5\u4f5c\u6d41",
    toolsTitle: "\u8ba9\u771f\u5b9e\u63a2\u7d22\u53ef\u91cd\u590d\u7684\u5e95\u5ea7\u5de5\u5177\u3002",
    wqbText:
      "\u9762\u5411 WorldQuant BRAIN \u7814\u7a76\u6d41\u7a0b\u7684\u7ed3\u6784\u5316\u547d\u4ee4\u754c\u9762\uff0c\u652f\u6301\u667a\u80fd\u4f53\u4f7f\u7528\u3001JSON \u8f93\u51fa\u3001\u7aef\u70b9\u68c0\u67e5\u548c\u957f\u4efb\u52a1\u5904\u7406\u3002",
    arxivText:
      "\u9762\u5411\u53ef\u590d\u73b0\u6587\u732e\u68c0\u7d22\u7684 arXiv \u5de5\u5177\uff0c\u652f\u6301\u5143\u6570\u636e\u63d0\u53d6\u548c\u667a\u80fd\u4f53\u53cb\u597d\u7684\u7814\u7a76\u8f93\u5165\u3002",
    repo: "\u4ed3\u5e93",
    statement:
      "\u5fae\u89c2\u771f\u5b9e\u3001\u5b8f\u89c2\u771f\u5b9e\u548c\u793e\u4f1a\u771f\u5b9e\u662f\u7814\u7a76\u5bf9\u8c61\uff1b\u667a\u80fd\u4f53\u5de5\u4f5c\u6d41\u662f\u5e95\u5ea7\uff0c\u4f7f\u8fd9\u4e9b\u53d1\u73b0\u8fc7\u7a0b\u53ef\u6267\u884c\u3001\u53ef\u68c0\u67e5\u3001\u53ef\u590d\u73b0\u3002",
    footerBrand: "WIZ\uff08\u82f1\u6587\u540d\uff09 - \u65e0\u76f4\u89c2 / untuitivist\uff08\u6635\u79f0\uff09",
    footerText:
      "\u5fae\u89c2\u771f\u5b9e | \u5b8f\u89c2\u771f\u5b9e | \u793e\u4f1a\u771f\u5b9e\uff0c\u4ee5\u667a\u80fd\u4f53\u5de5\u4f5c\u6d41\u4e3a\u5e95\u5ea7\u3002",
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

  let stars = [];
  let nebulas = [];
  let animationFrame = 0;

  const buildField = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const nextRandom = random(Math.floor(rect.width * 31 + rect.height * 17 + 20260626));
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

const setupSolarSystem = () => {
  const map = document.querySelector(".system-map");
  if (!map) return;

  const orbitConfigs = [
    {
      key: "micro",
      selector: ".micro-orbit",
      orbitScale: 1,
      eccentricity: 0.18,
      tilt: -16,
      period: 17000,
      phase: 0.25,
      radius: 18,
    },
    {
      key: "macro",
      selector: ".macro-orbit",
      orbitScale: 1.85,
      eccentricity: 0.06,
      tilt: 24,
      period: 43000,
      phase: 2.35,
      radius: 24,
    },
    {
      key: "social",
      selector: ".social-orbit",
      orbitScale: 3.25,
      eccentricity: 0.1,
      tilt: -34,
      period: 88000,
      phase: 4.2,
      radius: 31,
    },
  ];

  const twoPi = Math.PI * 2;
  const basePlanetRadius = Math.max(...orbitConfigs.map((config) => config.radius));
  const baseSunRadius = 55;
  const baseInnerSemiMajor = 116;
  const orbitPadding = 18;
  const designBoundsSafety = 1.08;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  let activePlanet = null;
  let orbitState = [];
  let lastFrame = performance.now();

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

  const hideCards = () => {
    map.querySelectorAll(".planet-card").forEach((card) => card.classList.remove("is-visible"));
    map.querySelectorAll(".orbit-track").forEach((track) => track.classList.remove("is-paused"));
    activePlanet = null;
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
    map.style.minHeight = "";
    const mapRect = map.getBoundingClientRect();

    const designOrbits = orbitConfigs.map((config) => {
      const eccentricity = config.eccentricity;
      const innerLimit = (baseSunRadius + basePlanetRadius + 10) / (1 - eccentricity);
      const semiMajor = Math.max(innerLimit, baseInnerSemiMajor * config.orbitScale);
      const semiMinor = semiMajor * Math.sqrt(1 - eccentricity * eccentricity);
      const tilt = toRadians(config.tilt);
      const yExtent = Math.sqrt(
        Math.pow(semiMajor * Math.sin(tilt), 2) + Math.pow(semiMinor * Math.cos(tilt), 2)
      );
      const xExtent = Math.sqrt(
        Math.pow(semiMajor * Math.cos(tilt), 2) + Math.pow(semiMinor * Math.sin(tilt), 2)
      );
      return {
        ...config,
        semiMajor,
        semiMinor,
        xExtent,
        yExtent,
      };
    });

    const requiredSize = designOrbits.reduce((size, orbit) => {
      return {
        width: Math.max(size.width, (orbit.xExtent + basePlanetRadius + orbitPadding) * 2 * designBoundsSafety),
        height: Math.max(size.height, (orbit.yExtent + basePlanetRadius + orbitPadding) * 2 * designBoundsSafety),
      };
    }, { width: 0, height: 0 });

    const galaxyScale = Math.min(1, mapRect.width / requiredSize.width, mapRect.height / requiredSize.height);
    map.style.setProperty("--galaxy-scale", galaxyScale.toFixed(4));

    map.style.minHeight = `${Math.ceil(requiredSize.height * galaxyScale)}px`;

    const measuredMapRect = map.getBoundingClientRect();
    const focusOffsetX = measuredMapRect.width > 520 ? measuredMapRect.width * 0.12 : 0;
    const focus = {
      x: measuredMapRect.width / 2 + focusOffsetX,
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
        const focusOffset = semiMajor * config.eccentricity;
        const tilt = toRadians(config.tilt);
        const centerOffset = rotatePoint(-focusOffset, 0, tilt);
        const center = {
          x: focus.x + centerOffset.x,
          y: focus.y + centerOffset.y,
        };

        track.style.setProperty("--orbit-width", `${semiMajor * 2}px`);
        track.style.setProperty("--orbit-height", `${semiMinor * 2}px`);
        track.style.setProperty("--orbit-left", `${center.x}px`);
        track.style.setProperty("--orbit-top", `${center.y}px`);
        track.style.setProperty("--tilt", `${config.tilt}deg`);
        planet.style.setProperty("--planet-size", `${config.radius * 2}px`);

        return {
          ...config,
          track,
          planet,
          packageNode,
          card,
          focus,
          semiMajor,
          semiMinor,
          tilt,
          meanAnomaly: config.phase,
          paused: false,
        };
      })
      .filter(Boolean);
  };

  const positionPlanet = (state) => {
    const eccentricAnomaly = solveKepler(state.meanAnomaly, state.eccentricity);
    const x = state.semiMajor * (Math.cos(eccentricAnomaly) - state.eccentricity);
    const y = state.semiMinor * Math.sin(eccentricAnomaly);
    const point = rotatePoint(x, y, state.tilt);

    state.packageNode.style.setProperty("--planet-x", `${state.focus.x + point.x}px`);
    state.packageNode.style.setProperty("--planet-y", `${state.focus.y + point.y}px`);
  };

  const tick = (now) => {
    const delta = now - lastFrame;
    lastFrame = now;

    orbitState.forEach((state) => {
      state.paused = state.track.classList.contains("is-paused");
      if (!state.paused) {
        state.meanAnomaly = (state.meanAnomaly + (delta / state.period) * twoPi) % twoPi;
      }
      positionPlanet(state);
    });

    if (activePlanet) {
      const key = activePlanet.getAttribute("data-planet");
      const card = key ? map.querySelector(`[data-planet-card="${key}"]`) : null;
      if (card?.classList.contains("is-visible")) positionCard(activePlanet, card);
    }

    requestAnimationFrame(tick);
  };

  map.querySelectorAll(".map-planet").forEach((planet) => {
    planet.addEventListener("pointerenter", () => showCard(planet));
    planet.addEventListener("focus", () => showCard(planet));
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
setupSolarSystem();
window.addEventListener("scroll", setHeaderState, { passive: true });
langToggle?.addEventListener("click", () => {
  applyLanguage(currentLanguage === "zh" ? "en" : "zh");
});
