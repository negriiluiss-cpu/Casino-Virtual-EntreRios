async function login() {
  const r = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: u.value, password: p.value })
  });
  const d = await r.json();
  if (!d.ok) return err.textContent = "Login incorrecto";
  login.hidden = true;
  app.hidden = false;
  user.textContent = u.value;
  chips.textContent = d.chips;
  if (d.isAdmin) admin.hidden = false;
}

async function spin() {
  const r = await fetch("/spin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bet: Number(bet.value) })
  });
  const d = await r.json();
  result.textContent = d.win ? "🎉 Ganaste!" : "😢 Perdiste";
  chips.textContent = d.chips;
}

async function createUser() {
  await fetch("/admin/create-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: newu.value, password: newp.value })
  });
  alert("Usuario creado");
}

async function setChips() {
  await fetch("/admin/set-chips", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: chipuser.value, chips: Number(chipamt.value) })
  });
  alert("Fichas asignadas");
}
