document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginMsg = document.getElementById("loginMsg");
  const game = document.getElementById("game");
  const adminPanel = document.getElementById("adminPanel");

  loginMsg.innerText = "App cargada. Probá iniciar sesión.";

  if (!loginForm) {
    alert("No se encontró el formulario de login. Revisar index.html");
    return;
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginMsg.innerText = "Enviando login...";

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      console.log("Respuesta login:", data);

      if (!data.ok) {
        loginMsg.innerText = "Login falló: " + (data.msg || "sin mensaje");
        return;
      }

      loginMsg.innerText = "Login OK. Cargando juego...";

      document.getElementById("login").style.display = "none";
      game.style.display = "block";

      if (data.isAdmin) {
        adminPanel.style.display = "block";
      }

    } catch (err) {
      console.error(err);
      loginMsg.innerText = "Error conectando al servidor";
    }
  });
});
