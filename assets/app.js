const header = document.querySelector("[data-header]");
const langToggle = document.querySelector("[data-lang-toggle]");
const langCurrent = document.querySelector("[data-lang-current]");
const langNext = document.querySelector("[data-lang-next]");

const copy = {
  en: {
    pageTitle: "WIZ / Within Intelligence Zone",
    metaDescription:
      "WIZ / Within Intelligence Zone: AI systems built from internal representations, constraints, and feedback.",
    brandMark: "WIZ",
    brand: "Within Intelligence Zone",
    navTheme: "Theme",
    navWork: "Work",
    navTools: "Tools",
    navContact: "Contact",
    heroEyebrow: "WIZ / Within Intelligence Zone",
    heroTitle: "Intelligence from Within",
    heroLead:
      "AI systems built from the internal representations, constraints, and feedback loops of real-world signals, embodied systems, and research workflows.",
    brandNote:
      "Concepts need intuition; intuition needs concepts. Knowledge becomes possible when the two are joined.",
    viewWork: "View selected work",
    mapReal1: "Real",
    mapSignals: "Signals",
    mapLatent: "Latent",
    mapModels: "Models",
    mapReal2: "Real",
    mapAction: "Action",
    mapRepresentations: "representations",
    mapConstraints: "constraints",
    mapFeedback: "feedback",
    themeEyebrow: "Core theme",
    themeTitle: "From real systems to inspectable intelligence loops.",
    zoneSignalTitle: "Signal Zone",
    zoneSignalText:
      "Cross-machine fault diagnosis and sample generation for sparse, shifted, and physically grounded one-dimensional sensor data.",
    zoneEmbodiedTitle: "Embodied Zone",
    zoneEmbodiedText:
      "Body, hand, and robot-state pipelines that connect perception, simulation, safety analysis, and deployable world representations.",
    zoneWorkflowTitle: "Workflow Zone",
    zoneWorkflowText:
      "Agent-native tools that turn literature search, alpha mining, experiments, and asynchronous workflows into inspectable command surfaces.",
    workEyebrow: "Selected work",
    workTitle: "Projects to surface first.",
    pcastMeta1: "Research Highlight",
    pcastMeta2: "Fault diagnosis",
    pcastText:
      "A cross-device, small-sample fault diagnosis direction centered on style transfer, generation, and physically constrained representation learning for bearing signals.",
    pcastPoint1: "Real signal domains with limited target-machine samples.",
    pcastPoint2: "Latent or generated domains for augmentation and adaptation.",
    pcastPoint3: "Back-to-real evaluation through diagnosis accuracy and transfer robustness.",
    pcastGithub: "GitHub",
    pcastIeee: "IEEE",
    evtolMeta1: "Embodied AI",
    evtolMeta2: "Robotics",
    evtolText:
      "A safety-oriented world-model prototype around robotics simulation, state feedback, and scenario evaluation in Isaac Sim / Isaac Lab workflows.",
    trackingMeta1: "Embodied Data",
    trackingMeta2: "Tracking",
    trackingTitle: "Ego-body and Hand Tracking Pipelines",
    trackingText:
      "Engineering pipelines for body, hand, face-blurring, and multimodal data handling, with emphasis on practical data flow, visualization, and privacy boundaries.",
    alphaMeta1: "Quant Research",
    alphaMeta2: "Agent prototype",
    alphaText:
      "An exploratory automated alpha-mining system. Public presentation should focus on workflow design, factor representations, and reproducible evaluation surfaces.",
    toolsEyebrow: "Research infrastructure",
    toolsTitle: "Tools that make the loop repeatable.",
    wqbText:
      "A command interface for structured WorldQuant BRAIN research workflows, designed for agent usage, JSON output, endpoint inspection, and long-running job handling.",
    arxivText:
      "A focused arXiv retrieval toolkit for reproducible literature search, metadata extraction, and agent-friendly research intake.",
    repo: "Repository",
    statement:
      "Intelligence is not added as a black-box layer. It is built by exposing and modeling the internal structure of signals, systems, and workflows.",
    footerBrand: "WIZ / untuitivist",
    footerText:
      "Within Intelligence Zone for research systems, embodied AI, and agent-native automation.",
  },
  zh: {
    pageTitle: "无直观 / Intelligence from Within",
    metaDescription: "无直观：概念无直观则空，直观无概念则盲。两者结合，知识方得可能。",
    brandMark: "无",
    brand: "无直观",
    navTheme: "主线",
    navWork: "成果",
    navTools: "工具",
    navContact: "联系",
    heroEyebrow: "无直观 / WIZ",
    heroTitle: "Intelligence from Within",
    heroLead: "从真实信号、具身系统与研究工作流内部的表示、约束和反馈回路中构建 AI 系统。",
    brandNote: "概念无直观则空，直观无概念则盲；两者结合，知识方得可能。",
    viewWork: "查看代表工作",
    mapReal1: "真实",
    mapSignals: "信号",
    mapLatent: "潜在",
    mapModels: "模型",
    mapReal2: "真实",
    mapAction: "行动",
    mapRepresentations: "表示",
    mapConstraints: "约束",
    mapFeedback: "反馈",
    themeEyebrow: "核心主线",
    themeTitle: "从真实系统出发，构建可检查的智能闭环。",
    zoneSignalTitle: "Signal Zone",
    zoneSignalText: "面向稀缺、跨域、带物理结构的一维工业传感信号，研究跨设备故障诊断与样本生成。",
    zoneEmbodiedTitle: "Embodied Zone",
    zoneEmbodiedText: "连接身体、手部与机器人状态数据，服务于感知、仿真、安全分析和可部署世界表示。",
    zoneWorkflowTitle: "Workflow Zone",
    zoneWorkflowText: "把文献搜索、因子挖掘、实验运行和异步流程做成 agent 可调用、可检查的命令界面。",
    workEyebrow: "代表工作",
    workTitle: "优先展示的项目。",
    pcastMeta1: "研究亮点",
    pcastMeta2: "故障诊断",
    pcastText: "围绕轴承信号的跨设备小样本故障诊断方向，关注风格迁移、生成增强与物理约束表示学习。",
    pcastPoint1: "真实信号域中目标设备样本有限。",
    pcastPoint2: "通过潜在域或生成域进行增强与适配。",
    pcastPoint3: "回到真实诊断任务中评估准确率与迁移鲁棒性。",
    pcastGithub: "GitHub",
    pcastIeee: "IEEE",
    evtolMeta1: "具身智能",
    evtolMeta2: "机器人",
    evtolText: "围绕 Isaac Sim / Isaac Lab 工作流构建的安全世界模型原型，关注仿真、状态反馈与场景评估。",
    trackingMeta1: "具身数据",
    trackingMeta2: "跟踪",
    trackingTitle: "Ego-body 与手部跟踪流水线",
    trackingText: "面向身体、手部、隐私脱敏与多模态数据处理的工程流水线，强调数据流、可视化与公开边界。",
    alphaMeta1: "量化研究",
    alphaMeta2: "Agent 原型",
    alphaText: "自动化 alpha 挖掘探索系统。公开展示时重点放在工作流设计、因子表示和可复现实验界面。",
    toolsEyebrow: "研究基础设施",
    toolsTitle: "让智能闭环可重复的工具。",
    wqbText: "面向 WorldQuant BRAIN 研究流程的结构化命令界面，支持 agent 使用、JSON 输出、端点检查和长任务处理。",
    arxivText: "面向可复现文献检索的 arXiv 工具，支持元数据提取和 agent 友好的研究输入。",
    repo: "仓库",
    statement: "智能不是外加的黑箱层，而是通过揭示并建模信号、系统与工作流内部结构形成的。",
    footerBrand: "无直观 / WIZ",
    footerText: "概念、直观与系统反馈结合处的研究主页。",
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
    langCurrent.textContent = language === "zh" ? "中" : "EN";
    langNext.textContent = language === "zh" ? "EN" : "中";
  }

  localStorage.setItem("wiz-language", language);
  currentLanguage = language;
};

setHeaderState();
applyLanguage(currentLanguage);
window.addEventListener("scroll", setHeaderState, { passive: true });
langToggle?.addEventListener("click", () => {
  applyLanguage(currentLanguage === "zh" ? "en" : "zh");
});
