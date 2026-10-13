// ======== EDIT THIS ========
const CONFIG = {
  NTFY_TOPIC: "specially-for-you-nyomika-19",  // subscribe to this exact name in the ntfy app
  WHATSAPP: "918210448622",                      // country code 91 + your number, no + or spaces
  HER_NAME: "Nyommmi",
  DATE: "Friday, 16 Oct, 5:30 PM",
  VENUE: "College Ground"                                    // add the venue, e.g. "College Ground"
};
// ===========================

const $ = (s) => document.querySelector(s);
const page = document.body.dataset.page;
const level = +document.body.dataset.level || 0;

function notify(msg) {
  try { fetch("https://ntfy.sh/" + CONFIG.NTFY_TOPIC, { method: "POST", body: msg, mode: "no-cors", keepalive: true }); } catch (e) {}
}
function go(url) { setTimeout(() => (location.href = url), 180); }

document.querySelectorAll("[data-name]").forEach((el) => (el.textContent = CONFIG.HER_NAME ? CONFIG.HER_NAME + ", " : ""));

const key = "seen-" + page;
if (!sessionStorage.getItem(key)) { sessionStorage.setItem(key, 1); notify("👀 She opened page: " + page); }

const yes = $("#yes"), no = $("#no");

if (yes) yes.addEventListener("click", () => { notify("✅✅ SHE CLICKED YES on " + page + " 🎉"); go("yes.html"); });

if (no && page !== "chaos") {
  // pages get progressively more dramatic: Yes grows, No shrinks
  yes.style.transform = "scale(" + (1 + level * 0.25) + ")";
  no.style.transform = "scale(" + (1 - level * 0.15) + ")";
  no.addEventListener("click", () => { notify("❌ She clicked NO on " + page); go(no.dataset.next); });
}

// ---------- chaos page: No cannot be clicked ----------
if (page === "chaos") {
  document.body.classList.add("chaos");
  let tries = 0, grow = 1.4;
  const lines = ["Nice try 😏", "Too slow 😜", "The button ran away 🏃", "It's scared of you 😂", "Just press YES 🥹", "Resistance is futile 😎", "Your finger can't catch it 🙈"];
  function dodge(e) {
    if (e) e.preventDefault();
    tries++;
    no.classList.add("fly");
    no.style.left = Math.max(8, Math.random() * (innerWidth - no.offsetWidth - 16)) + "px";
    no.style.top = Math.max(20, Math.random() * (innerHeight - no.offsetHeight - 16)) + "px";
    $("#msg").textContent = lines[tries % lines.length];
    if ([1, 5, 15, 30].includes(tries)) notify("😂 She is chasing the NO button (" + tries + " tries)");
    if (tries > 5) { no.textContent = "🚫"; no.style.pointerEvents = "none"; }
  }
  ["pointerenter", "pointerdown", "touchstart", "click"].forEach((ev) => no.addEventListener(ev, dodge, { passive: false }));
  document.addEventListener("pointerdown", (e) => { if (e.target !== yes && e.target !== no) { tries++; if (tries % 3 === 0) dodge(); } });
  setInterval(() => { if (tries > 5) dodge(); }, 700);
  setInterval(() => {
    grow = Math.min(grow + 0.12, 9);
    yes.style.transform = "scale(" + grow + ")";
    if (grow > 3) document.querySelector(".screen").classList.add("shake");
    rain();
  }, 900);
}

function rain(set) {
  set = set || ["🪘", "💃", "✨", "🥺", "💖", "🌸", "🎉"];
  const s = document.createElement("span");
  s.className = "fl";
  s.textContent = set[Math.floor(Math.random() * set.length)];
  s.style.left = Math.random() * 95 + "vw";
  s.style.animationDuration = 3 + Math.random() * 3 + "s";
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 6500);
}

// ---------- yes page ----------
if (page === "yes") {
  $("#d1").textContent = CONFIG.DATE ? "Date: " + CONFIG.DATE : "Date: to be confirmed";
  $("#d2").textContent = CONFIG.VENUE ? "Venue: " + CONFIG.VENUE : "Venue: to be confirmed";
  $("#wa").href = "https://wa.me/" + CONFIG.WHATSAPP + "?text=" + encodeURIComponent("Yes! I'm in for Dandiya Night 🪘💃" + (CONFIG.HER_NAME ? " - " + CONFIG.HER_NAME : ""));
  $("#wa").addEventListener("click", () => notify("💬 She tapped the WhatsApp button!"));
  const cv = $("#cv"), ctx = cv.getContext("2d");
  let parts = [];
  const size = () => { cv.width = innerWidth; cv.height = innerHeight; };
  size(); addEventListener("resize", size);
  const cols = ["#f5b335", "#d1357f", "#ff6b35", "#fff4e0", "#7b2ff7", "#2ec4b6"];
  const burst = () => { for (let i = 0; i < 220; i++) parts.push({ x: innerWidth / 2, y: innerHeight / 3, vx: (Math.random() - 0.5) * 14, vy: Math.random() * -14 - 2, s: 4 + Math.random() * 6, c: cols[i % 6], r: 0, vr: (Math.random() - 0.5) * 0.4 }); };
  (function tick() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    parts.forEach((p) => { p.vy += 0.25; p.x += p.vx; p.y += p.vy; p.r += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 1.6); ctx.restore(); });
    parts = parts.filter((p) => p.y < cv.height + 30);
    requestAnimationFrame(tick);
  })();
  burst(); setTimeout(burst, 900); setTimeout(burst, 1800);
  setInterval(rain, 400);
}
