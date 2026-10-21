import { projects } from "./projects.js";
import { setupCosmos, setCosmosPaused, isCosmosPaused } from "./cosmos.js";

const originalMarkup = new WeakMap();
const originalAttributes = new WeakMap();
const dialog = document.querySelector("[data-project-dialog]");
const dialogContent = document.querySelector("[data-dialog-content]");
const filters = [...document.querySelectorAll("[data-filter]")];
const cards = [...document.querySelectorAll("[data-category]")];
let currentFilter = "all";
let currentProject = null;
let opener = null;

function getInitialLanguage() {
  const query = new URLSearchParams(location.search).get("lang");
  if (query === "zh" || query === "en") return query;
  return "en";
}
let language = getInitialLanguage();
const choose = (value) => value?.[language] || value?.en || "";

function translatePage() {
  document.documentElement.lang = language === "zh" ? "zh-Hans" : "en";
  document.title = language === "zh"
    ? "Wiz Lee — 智能，由内而生"
    : "Wiz Lee — Intelligence from Within";
  const description = language === "zh"
    ? "Wiz Lee 的研究与工程作品集，关注物理信号、具身智能、量化研究和 Agent 原生工具。"
    : "Wiz Lee / WIZ — AI research and engineering across physical signals, embodied intelligence, quantitative research, and agent-native tools.";
  document.querySelector('meta[name="description"]').content = description;
  document.querySelector('meta[property="og:description"]').content = description;
  document.querySelector('meta[property="og:title"]').content = document.title;

  document.querySelectorAll("[data-zh]").forEach((node) => {
    if (!originalMarkup.has(node)) originalMarkup.set(node, [...node.childNodes].map((child) => child.cloneNode(true)));
    if (language === "zh") {
      node.textContent = node.dataset.zh;
    } else {
      node.replaceChildren(...originalMarkup.get(node).map((child) => child.cloneNode(true)));
    }
  });
  document.querySelectorAll("[data-zh-label], [data-zh-alt]").forEach((node) => {
    const attribute = node.hasAttribute("data-zh-label") ? "aria-label" : "alt";
    const translated = node.dataset.zhLabel || node.dataset.zhAlt;
    if (!originalAttributes.has(node)) originalAttributes.set(node, node.getAttribute(attribute));
    node.setAttribute(attribute, language === "zh" ? translated : originalAttributes.get(node));
  });
  document.querySelector("[data-lang-current]").textContent = language === "zh" ? "中" : "EN";
  document.querySelector("[data-lang-next]").textContent = language === "zh" ? "EN" : "中";
  updateCount();
  updateMotionButton();
}

function updateCount() {
  const count = cards.filter((card) => !card.hidden).length;
  document.querySelector("[data-work-count]").textContent =
    String(count).padStart(2, "0") + (language === "zh" ? " 个项目" : " PROJECTS");
}

function applyFilter(filter, updateUrl = true) {
  currentFilter = filters.some((button) => button.dataset.filter === filter) ? filter : "all";
  filters.forEach((button) => {
    const selected = button.dataset.filter === currentFilter;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  cards.forEach((card) => { card.hidden = currentFilter !== "all" && card.dataset.category !== currentFilter; });
  updateCount();
  if (updateUrl) {
    const url = new URL(location.href);
    if (currentFilter === "all") url.searchParams.delete("filter");
    else url.searchParams.set("filter", currentFilter);
    history.replaceState(history.state, "", url);
  }
}
filters.forEach((button) => button.addEventListener("click", () => applyFilter(button.dataset.filter)));
document.querySelectorAll("[data-filter-link]").forEach((link) => {
  link.addEventListener("click", () => applyFilter(link.dataset.filterLink));
});

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function renderProject(id) {
  const project = projects[id];
  const body = element("div", "dialog-body");
  body.append(element("p", "dialog-eyebrow", choose(project.category)));
  const title = element("h2", "", choose(project.title));
  title.id = "dialog-title";
  body.append(title, element("p", "dialog-summary", choose(project.summary)));
  if (project.video || project.image) {
    const figure = element("figure", project.mediaLayout === "poster" ? "dialog-media dialog-media-poster" : "dialog-media");
    if (project.video) {
      const video = document.createElement("video");
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      if (project.poster) video.poster = project.poster;
      video.setAttribute("aria-label", choose(project.alt));
      const source = document.createElement("source");
      source.src = project.video;
      source.type = "video/mp4";
      video.append(source);
      const fallback = element("a", "", language === "zh" ? "打开演示视频" : "Open demo video");
      fallback.href = project.video;
      video.append(fallback);
      figure.append(video);
    } else {
      const img = document.createElement("img");
      img.src = project.image;
      img.alt = choose(project.alt);
      img.decoding = "async";
      figure.append(img);
    }
    figure.append(element("figcaption", "", choose(project.caption)));
    body.append(figure);
  }
  const columns = element("div", "dialog-columns");
  [["work", language === "zh" ? "内容与贡献" : "Work & contribution"],
   ["result", language === "zh" ? "成果" : "Results"]].forEach(([key, heading]) => {
    const section = document.createElement("section");
    section.append(element("h3", "", heading), element("p", "", choose(project[key])));
    columns.append(section);
  });
  body.append(columns);
  const links = element("div", "dialog-links");
  project.links.forEach((link) => {
    const anchor = element("a", "", choose(link.label) + " ↗");
    anchor.href = link.href;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    links.append(anchor);
  });
  body.append(links);
  if (project.note) body.append(element("p", "dialog-note", choose(project.note)));
  dialogContent.replaceChildren(body);
}

function showProject(id, pushHistory = false) {
  if (!Object.hasOwn(projects, id)) return;
  if (!dialog.open) opener = document.activeElement;
  if (currentProject !== id || !dialog.open) renderProject(id);
  currentProject = id;
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  document.documentElement.classList.add("dialog-open");
  if (pushHistory) {
    const url = new URL(location.href);
    url.searchParams.set("project", id);
    history.pushState({ ...history.state, wizProjectDialog: true }, "", url);
  }
}

function dismissDialog() {
  dialog.querySelector("video")?.pause();
  if (dialog.open) dialog.close();
  document.documentElement.classList.remove("dialog-open");
  currentProject = null;
  if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
  opener = null;
}

function closeProject() {
  if (history.state?.wizProjectDialog) {
    history.back();
  } else {
    const url = new URL(location.href);
    url.searchParams.delete("project");
    history.replaceState(history.state, "", url);
    dismissDialog();
  }
}

document.querySelectorAll("[data-project]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0 || !dialog.showModal) return;
    event.preventDefault();
    showProject(link.dataset.project, true);
  });
});
document.querySelector("[data-dialog-close]").addEventListener("click", closeProject);
dialog.addEventListener("cancel", (event) => { event.preventDefault(); closeProject(); });
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeProject();
});

function restoreRoute() {
  const params = new URLSearchParams(location.search);
  language = getInitialLanguage();
  translatePage();
  applyFilter(params.get("filter"), false);
  const projectId = params.get("project");
  if (projectId && Object.hasOwn(projects, projectId)) showProject(projectId);
  else dismissDialog();
}
window.addEventListener("popstate", restoreRoute);

document.querySelector("[data-lang-toggle]").addEventListener("click", () => {
  language = language === "zh" ? "en" : "zh";
  const url = new URL(location.href);
  url.searchParams.set("lang", language);
  history.replaceState(history.state, "", url);
  translatePage();
  if (currentProject) renderProject(currentProject);
});

function updateMotionButton() {
  const paused = isCosmosPaused();
  const button = document.querySelector("[data-motion-toggle]");
  button.setAttribute("aria-pressed", String(paused));
  button.setAttribute("aria-label", language === "zh"
    ? (paused ? "播放星空动画" : "暂停星空动画")
    : (paused ? "Resume starfield animation" : "Pause starfield animation"));
  document.querySelector("[data-motion-label]").textContent = language === "zh"
    ? (paused ? "播放动画" : "暂停动画")
    : (paused ? "Resume motion" : "Pause motion");
  document.querySelector("[data-motion-icon]").textContent = paused ? "▷" : "Ⅱ";
}
document.querySelector("[data-motion-toggle]").addEventListener("click", () => setCosmosPaused(!isCosmosPaused()));
window.addEventListener("wiz:motion-change", updateMotionButton);

// Retain the original WIZ profile-card shortcut.
let brandClicks = 0;
let brandReset = 0;
document.querySelector("[data-card-trigger]").addEventListener("click", (event) => {
  if (!event.target.closest(".brand-mark")) return;
  brandClicks += 1;
  clearTimeout(brandReset);
  if (brandClicks >= 3) {
    event.preventDefault();
    location.href = "card/?lang=" + language;
  }
  brandReset = setTimeout(() => { brandClicks = 0; }, 900);
});

document.querySelector("[data-year]").textContent = String(new Date().getFullYear());
restoreRoute();
setupCosmos();
