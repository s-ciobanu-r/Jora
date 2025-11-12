// --- Telegram WebApp bootstrap ---
const tg = window.Telegram?.WebApp;
tg?.expand(); // request full height

// Apply Telegram theme (so it looks native)
(function applyTelegramTheme() {
  if (!tg) return;
  const p = tg.themeParams || {};
  const set = (varName, val) => val && document.documentElement.style.setProperty(varName, val);
  set("--bg", p.bg_color);
  set("--card", p.secondary_bg_color);
  set("--text", p.text_color);
  set("--muted", p.hint_color);
  // keep --primary as our brand unless you prefer p.button_color
})();

// --- Simple password gate (client-side) ---
// Change this to your real password or remove the gate entirely.
const PASSWORD_REQUIRED = false;      // <- set true to require a password
const PASSWORD_VALUE = "JORA2025";    // <- set your gate password
const PASSWORD_TTL_HOURS = 6;         // remember for 6h in localStorage

const gateEl = document.getElementById("gate");
const gateForm = document.getElementById("gateForm");
const gateInput = document.getElementById("gateInput");
const gateError = document.getElementById("gateError");

function gateValid() {
  try {
    const raw = localStorage.getItem("jora_gate");
    if (!raw) return false;
    const { ok, ts } = JSON.parse(raw);
    if (!ok) return false;
    const hours = (Date.now() - ts) / 1000 / 3600;
    return hours < PASSWORD_TTL_HOURS;
  } catch { return false; }
}

function gateStoreOK() {
  localStorage.setItem("jora_gate", JSON.stringify({ ok: true, ts: Date.now() }));
}

function showGateIfNeeded() {
  if (!PASSWORD_REQUIRED) return;           // gate disabled
  if (gateValid()) return;                  // already ok
  gateEl.classList.remove("hidden");        // show modal
  gateInput.focus();
}

gateForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const val = gateInput.value.trim();
  if (val === PASSWORD_VALUE) {
    gateStoreOK();
    gateError.classList.add("hidden");
    gateEl.classList.add("hidden");
    // (optional) notify backend that gate was unlocked
    // postToN8N({ type: "gate_ok" });
  } else {
    gateError.classList.remove("hidden");
  }
});

showGateIfNeeded();

// --- Display a tiny hint who’s logged in (from Telegram context) ---
const infoEl = document.getElementById("userInfo");
if (tg?.initDataUnsafe?.user) {
  const u = tg.initDataUnsafe.user;
  const label = [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || `ID ${u.id}`;
  infoEl.textContent = `Conectat ca ${label}`;
}

// --- Actions -> send back to bot via sendData & close webapp ---
function sendAction(action) {
  try {
    tg?.sendData?.(action);
  } catch (e) {
    console.error("sendData failed", e);
  } finally {
    // Optional: also call your n8n webhook (uncomment and set URL)
    // postToN8N({ type: "action", action });

    tg?.close?.(); // close mini app
  }
}

document.querySelectorAll(".btn[data-action]").forEach((btn) => {
  btn.addEventListener("click", () => sendAction(btn.dataset.action));
});

// --- Optional: POST to your n8n webhook for richer flows ---
// Set this to your webhook URL if you want server-side handling, logs, or auth.
const N8N_WEBHOOK = ""; // e.g. "https://n8n.yourdomain.com/webhook/jora-miniapp"
async function postToN8N(payload) {
  if (!N8N_WEBHOOK) return;
  const base = {
    telegram_id: tg?.initDataUnsafe?.user?.id ?? null,
    telegram_data: tg?.initData || null,
  };
  try {
    await fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...base, ...payload }),
      credentials: "omit",
      mode: "cors",
    });
  } catch (err) {
    console.warn("Webhook post failed:", err);
  }
}
