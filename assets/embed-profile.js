(function () {
  const currentScript = document.currentScript;
  const scriptUrl = new URL(currentScript?.src || "https://untuitivist.github.io/assets/embed-profile.js");
  const origin = scriptUrl.origin;
  const defaultPath = "/card/";
  const targetSelector = currentScript?.dataset.target || "#untuitivist-profile";
  const height = currentScript?.dataset.height || "520";
  const title = currentScript?.dataset.title || "Profile card for Wiz Lee";
  const source = currentScript?.dataset.src || `${origin}${defaultPath}`;
  const target = document.querySelector(targetSelector);

  if (!target) return;

  const iframe = document.createElement("iframe");
  iframe.src = source;
  iframe.title = title;
  iframe.loading = "lazy";
  iframe.referrerPolicy = "no-referrer-when-downgrade";
  iframe.style.width = "100%";
  iframe.style.height = Number.isFinite(Number(height)) ? `${height}px` : height;
  iframe.style.border = "0";
  iframe.style.display = "block";
  iframe.style.borderRadius = currentScript?.dataset.radius || "8px";
  iframe.setAttribute("allowtransparency", "true");

  target.replaceChildren(iframe);
})();
