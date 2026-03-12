const wrap = document.getElementById("asciiWrap");
const pre  = document.getElementById("ascii");

async function loadAscii() {
  const res = await fetch("/images/map.txt");
  if (!res.ok) throw new Error("HTTP " + res.status);
  pre.textContent = await res.text();
}

function measureCell() {
  // measure 1 character in the actual rendered font
  const probe = document.createElement("span");
  probe.textContent = "M";
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.font = getComputedStyle(pre).font; // match <pre>
  wrap.appendChild(probe);

  const r = probe.getBoundingClientRect();
  wrap.style.setProperty("--cw", r.width + "px");
  wrap.style.setProperty("--ch", r.height + "px");

  probe.remove();
}

function layoutHotspots() {
  wrap.querySelectorAll(".hot").forEach(el => {
    const x = Number(el.dataset.x);
    const y = Number(el.dataset.y);
    const w = Number(el.dataset.w);
    const h = Number(el.dataset.h);

    el.style.left   = `calc(var(--cw) * ${x})`;
    el.style.top    = `calc(var(--ch) * ${y})`;
    el.style.width  = `calc(var(--cw) * ${w})`;
    el.style.height = `calc(var(--ch) * ${h})`;
  });
}

async function init() {
  await loadAscii();
  measureCell();
  layoutHotspots();
}

init();
window.addEventListener("resize", () => { measureCell(); layoutHotspots(); });
document.fonts?.addEventListener?.("loadingdone", () => { measureCell(); layoutHotspots(); });