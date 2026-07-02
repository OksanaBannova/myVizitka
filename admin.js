const SUPABASE_URL = "https://eskauqttcvfxrbnvljyu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_l0krKw0Ct33vQ0qKVznytw_YTFRiH_T";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function loadLeads() {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const leadsList = document.getElementById("leadsList");
  leadsList.innerHTML = "";

  let today = 0;
  let week = 0;
  let month = 0;

  const now = new Date();

  data.forEach(lead => {
    const date = new Date(lead.created_at);
    const diffDays = (now - date) / (1000 * 60 * 60 * 24);

    if (diffDays < 1) today += Number(lead.budget);
    if (diffDays < 7) week += Number(lead.budget);
    if (diffDays < 30) month += Number(lead.budget);

    let html = "";

data.forEach(lead => {
  html += `
    <div class="lead-card">
      <h3>${lead.name}</h3>
      <p>Услуга: ${lead.service}</p>
      <p>Бюджет: ${lead.budget} ₽</p>
      <p>Контакт: ${lead.contact}</p>
      <p>Статус: ${lead.status}</p>
    </div>
  `;
});

leadsList.innerHTML = html;

  document.getElementById("todayRevenue").textContent = today + " ₽";
  document.getElementById("weekRevenue").textContent = week + " ₽";
  document.getElementById("monthRevenue").textContent = month + " ₽";
}

loadLeads();