const SUPABASE_URL = "https://eskauqttcvfxrbnvljyu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_l0krKw0Ct33vQ0qKVznytw_YTFRiH_T";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

let leadsCache = [];

const STATUSES = ["new", "in_work", "waiting", "done"];

/* ---------------- LOAD ---------------- */
async function loadLeads() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  leadsCache = data;

  renderLeads(data);
  calculateStats(data);
}

/* ---------------- RENDER KANBAN ---------------- */
function renderLeads(leads) {
  STATUSES.forEach(status => {
    const col = document.querySelector(`#col-${status} .column-body`);
    if (col) col.innerHTML = "";
  });

  leads.forEach(lead => {
    const el = document.createElement("div");
    el.className = "lead-card";

    const hot = isHotLead(lead) ? "🔥 Горячий" : "";

    el.innerHTML = `
      <h3>${lead.name}</h3>
      <p>${lead.service}</p>
      <p>${lead.budget} ₽</p>
      <p>${hot}</p>

      <div class="actions">
        <button onclick="moveLead('${lead.id}', 'new')">🟡</button>
        <button onclick="moveLead('${lead.id}', 'in_work')">🔵</button>
        <button onclick="moveLead('${lead.id}', 'waiting')">🟣</button>
        <button onclick="moveLead('${lead.id}', 'done')">🟢</button>
      </div>
    `;

    const col = document.querySelector(`#col-${lead.status} .column-body`);
    if (col) col.appendChild(el);
  });
}

/* ---------------- MOVE LEAD ---------------- */
async function moveLead(id, status) {
  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error(error);
    return;
  }

  loadLeads();
}

/* ---------------- SEARCH ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("search");

  if (search) {
    search.addEventListener("input", (e) => {
      const value = e.target.value.toLowerCase();

      const filtered = leadsCache.filter(l =>
        (l.name || "").toLowerCase().includes(value) ||
        (l.service || "").toLowerCase().includes(value)
      );

      renderLeads(filtered);
    });
  }
});

/* ---------------- STATS ---------------- */
function calculateStats(data) {
  const stats = {
    new: 0,
    in_work: 0,
    waiting: 0,
    done: 0,
    totalMoney: 0
  };

  data.forEach(l => {
    stats[l.status] = (stats[l.status] || 0) + 1;
    stats.totalMoney += Number(l.budget || 0);
  });

  const el = (id, val) => {
    const node = document.getElementById(id);
    if (node) node.textContent = val;
  };

  el("totalMoney", stats.totalMoney + " ₽");
  el("countNew", stats.new);
  el("countDone", stats.done);
}

/* ---------------- HOT LEAD ---------------- */
function isHotLead(lead) {
  return Number(lead.budget) > 5000 || lead.service === "бот";
}

/* ---------------- INIT ---------------- */
loadLeads();
setInterval(loadLeads, 15000);