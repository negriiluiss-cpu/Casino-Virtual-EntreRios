let currentTheme = "Clásico";

const themes = [
  "Clásico", "Egipcio", "Piratas", "Espacio", "Selva", "Frutas", "Diamantes",
  "Dragones", "Mitología", "Faraones", "Vaqueros", "Vikingos", "Samuráis",
  "Zombies", "Fantasía", "Cartas", "Tesoros", "Robots", "Dioses", "Retro"
];

document.addEventListener("DOMContentLoaded", () => {
  const themeSelect = document.getElementById("theme");
  themes.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.innerText = t;
    themeSelect.appendChild(opt);
  });
});

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Ingresá usuario y contraseña");
    return;
  }

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (!data.ok) {
    alert("Usuario o contraseña incorrectos");
    return;
  }

  document.getElementById("login").style.display = "none";
  document.getElementById("game").style.display = "block";
  document.getElementById("chips").innerText = data.chips;

  const adminPanel = document.getElementById("admin");
  adminPanel.style.display = data.isAdmin ? "block" : "none";
}

async function spin() {
  const bet = parseInt(document.getElementById("bet").value, 10);
  if (!bet || bet <= 0) {
    alert("Ingresá una apuesta válida");
    return;
  }

  const res = await fetch("/spin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ bet })
  });

  const data = await res.json();

  if (!data.ok) {
    alert(data.msg || "Error al girar");
    return;
  }

  const result = data.win ? "🎉 GANASTE" : "😢 PERDISTE";
  document.getElementById("result").innerText = result + " (" + currentTheme + ")";
  
  const chipsEl = document.getElementById("chips");
  chipsEl.innerText = parseInt(chipsEl.innerText, 10) + data.delta;
}

async function createUser() {
  const username = document.getElementById("newUser").value.trim();
  const password = document.getElementById("newPass").value.trim();

  if (!username || !password) {
    alert("Usuario y contraseña requeridos");
    return;
  }

  const res = await fetch("/admin/create-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (!data.ok) {
    alert("Error al crear usuario");
    return;
  }

  alert("Usuario creado");
  document.getElementById("newUser").value = "";
  document.getElementById("newPass").value = "";
}

async function setChips() {
  const username = document.getElementById("chipUser").value.trim();
  const chips = parseInt(document.getElementById("chipAmount").value, 10);

  if (!username || isNaN(chips)) {
    alert("Datos inválidos");
    return;
  }

  const res = await fetch("/admin/set-chips", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, chips })
  });

  const data = await res.json();

  if (!data.ok) {
    alert("Error al cargar fichas");
    return;
  }

  alert("Fichas actualizadas");
}
