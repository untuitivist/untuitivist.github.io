const langToggle = document.querySelector("[data-lang-toggle]");
const langCurrent = document.querySelector("[data-lang-current]");
const langNext = document.querySelector("[data-lang-next]");
const metaDescription = document.querySelector("[data-card-meta-description]");

const copy = {
  en: {
    pageTitle: "Profile Card / Wiz Lee",
    metaDescription:
      "Public profile card for Wiz Lee / Junyi Li, focused on research systems, embodied AI, and agent-native automation.",
    shellLabel: "Public profile card",
    profileAlt: "Profile image for Wiz Lee",
    eyebrow: "WIZ / Within Intelligence Zone",
    name: "Wiz Lee <span>/ Junyi Li</span>",
    position: "Chief AI Researcher at Frodobots.",
    summary:
      "I build workflows that expose the internal structure of signals, bodies, environments, markets, and research tools, so they can be inspected, executed, and improved.",
    focusLabel: "Research focus",
    focusMicro: "Micro Truth: physical signals and fault diagnosis",
    focusMacro: "Macro Truth: embodied data, robotics, and tracking",
    focusSocial: "Social Truth: markets, factors, and collective decisions",
    focusAgent: "Agent-native Workflow: CLIs, APIs, and reproducible loops",
    linksLabel: "Profile links",
    homeLink: "Homepage",
    githubLink: "GitHub",
    scholarLink: "Scholar",
  },
  zh: {
    pageTitle: "名片 / WIZ",
    metaDescription:
      "WIZ / 李俊毅的公开名片，关注研究系统、具身智能、量化工具与 agent-native 自动化。",
    shellLabel: "公开名片",
    profileAlt: "WIZ 的个人头像",
    eyebrow: "WIZ / 无直观 / untuitivist",
    name: "WIZ <span>/ 李俊毅</span>",
    position: "Frodobots 首席 AI Researcher。",
    summary:
      "我构建能够暴露真实系统内部结构的工作流：信号、身体、环境、市场与研究工具都应可检查、可执行、可迭代。",
    focusLabel: "研究主线",
    focusMicro: "微观真实：物理信号与故障诊断",
    focusMacro: "宏观真实：具身数据、机器人与跟踪",
    focusSocial: "社会真实：市场、因子与集体决策",
    focusAgent: "Agent-native Workflow：CLI、API 与可复现闭环",
    linksLabel: "个人链接",
    homeLink: "主页",
    githubLink: "GitHub",
    scholarLink: "谷歌学术",
  },
};

const getInitialLanguage = () => {
  const params = new URLSearchParams(window.location.search);
  const queryLanguage = params.get("lang");
  if (queryLanguage === "zh" || queryLanguage === "en") return queryLanguage;

  const savedLanguage = localStorage.getItem("wiz-language");
  if (savedLanguage === "zh" || savedLanguage === "en") return savedLanguage;

  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
};

const applyLanguage = (language) => {
  const table = copy[language] || copy.en;

  document.documentElement.lang = language === "zh" ? "zh-Hans" : "en";
  document.title = table.pageTitle;
  metaDescription?.setAttribute("content", table.metaDescription);

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    if (key && table[key]) node.textContent = table[key];
  });

  document.querySelectorAll("[data-i18n-html]").forEach((node) => {
    const key = node.getAttribute("data-i18n-html");
    if (key && table[key]) node.innerHTML = table[key];
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    const key = node.getAttribute("data-i18n-aria");
    if (key && table[key]) node.setAttribute("aria-label", table[key]);
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((node) => {
    const key = node.getAttribute("data-i18n-alt");
    if (key && table[key]) node.setAttribute("alt", table[key]);
  });

  if (langCurrent && langNext) {
    langCurrent.textContent = language === "zh" ? "中" : "EN";
    langNext.textContent = language === "zh" ? "EN" : "中";
  }

  localStorage.setItem("wiz-language", language);
};

let currentLanguage = getInitialLanguage();
applyLanguage(currentLanguage);

langToggle?.addEventListener("click", () => {
  currentLanguage = currentLanguage === "zh" ? "en" : "zh";
  applyLanguage(currentLanguage);
});
