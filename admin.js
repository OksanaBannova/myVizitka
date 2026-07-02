const SUPABASE_URL = "https://eskauqttcvfxrbnvljyu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_l0krKw0Ct33vQ0qKVznytw_YTFRiH_T";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

let leadsCache = [];

/* ------------------ ЗАГРУЗКА ------------------ */
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
  calculateRevenue(data);
}

/* ------------------ РЕНДЕР ------------------ */
function renderLeads(leads) {
  const leadsList = document.getElementById("leadsList");

  let html = "";

  leads.forEach(lead => {
    html += `
      <div class="lead-card" data-id="${lead.id}">
        <h3>${lead.name}</h3>
        <p>Услуга: ${lead.service}</p>
        <p>Бюджет: ${lead.budget} ₽</p>
        <p>Контакт: ${lead.contact}</p>
        <p>Статус: ${lead.status}</p>
        <p>Приоритет: ${getLeadScore(lead)}</p>

        <button onclick="setStatus('${lead.id}', 'new')">Новый</button>
        <button onclick="setStatus('${lead.id}', 'in_work')">В работе</button>
        <button onclick="setStatus('${lead.id}', 'done')">Готово</button>
      </div>
    `;
  });

  leadsList.innerHTML = html;
}

/* ------------------ СМЕНА СТАТУСА ------------------ */
async function setStatus(id, status) {
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

/* ------------------ АНАЛИТИКА ДОХОДА ------------------ */
function calculateRevenue(data) {
  let today = 0;
  let week = 0;
  let month = 0;

  const now = new Date();

  data.forEach(lead => {
    const date = new Date(lead.created_at);
    const diffDays = (now - date) / (1000 * 60 * 60 * 24);

    const budget = Number(lead.budget || 0);

    if (diffDays < 1) today += budget;
    if (diffDays < 7) week += budget;
    if (diffDays < 30) month += budget;
  });

  document.getElementById("todayRevenue").textContent = today + " ₽";
  document.getElementById("weekRevenue").textContent = week + " ₽";
  document.getElementById("monthRevenue").textContent = month + " ₽";
}

/* ------------------ ФИЛЬТР ------------------ */
function filterLeads(status) {
  if (status === "all") {
    renderLeads(leadsCache);
    return;
  }

  const filtered = leadsCache.filter(l => l.status === status);
  renderLeads(filtered);
}

/* ------------------ ПРИОРИТЕТ ЛИДА ------------------ */
function getLeadScore(lead) {
  let score = 0;

  if (Number(lead.budget) > 5000) score += 2;
  if (lead.service === "сайт") score += 2;
  if (lead.service === "бот") score += 3;
  if (lead.service === "нейрофото") score += 2;

  return score;
}

/* ------------------ АВТООБНОВЛЕНИЕ ------------------ */
setInterval(loadLeads, 15000);

/* ------------------ ПЕРВЫЙ ЗАПУСК ------------------ */
loadLeads();