let numCoins = 0;
numCoins = parseInt(sessionStorage.getItem("coin")) || 0;


const wrap = document.getElementById("asciiWrap");
const pre  = document.getElementById("ascii");

async function loadAscii() {
  if (pre == null) {
    return;
  }
  const path = pre.dataset.src;
  const res = await fetch(path);
  if (!res.ok) throw new Error("HTTP " + res.status);
  pre.textContent = await res.text();

  if (location.hash) {
    const el = document.querySelector(location.hash);
    if (el) el.scrollIntoView();
  }
}

function measureCell() {
  if (pre == null) {
    return;
  }
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
  if (pre == null) {
    return;
  }
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

window.addEventListener("resize", () => { measureCell(); layoutHotspots(); });
document.fonts?.addEventListener?.("loadingdone", () => { measureCell(); layoutHotspots(); });

// mouse animation
const button = document.getElementById("playButton");
const mouse = document.getElementById("mouse");

if (button != null) {
button.addEventListener("click", () => {
  mouse.classList.add("animate");
});
}

// alert sleepy
const sleepy = document.getElementById("sleepingGuy");
if (sleepy != null)
{
  sleepy.addEventListener("click", () => {alert("zzzzzz");});
}

const coin = document.getElementById("coin");
if (coin != null)
{
  coin.addEventListener("click", () => {
    alert("ooh shiny! +1 coin!");
    numCoins += 1;
    sessionStorage.setItem("coin", numCoins);
    console.log(numCoins)
  });
}

function updateInventory() {
  const coinText = document.getElementById("coin-count");
  if(numCoins != 0 && coinText)
  {
    coinText.innerHTML = "Coins: " + numCoins;
  }
}

async function init() {
  await loadAscii();
  measureCell();
  layoutHotspots();
  updateInventory();
}

init();

// To create a server, run: 
// python3 -m http.server 8000
// Then go to http://localhost:8000/