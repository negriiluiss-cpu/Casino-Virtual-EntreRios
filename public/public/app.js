document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginMsg = document.getElementById("loginMsg");
  const game = document.getElementById("game");
  const adminPanel = document.getElementById("adminPanel");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",   // 👈 sin esto no funciona en Render
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!data.ok) {
          loginMsg.innerText = data.msg || "Error al iniciar sesión";
          return;
        }

        document.getElementById("login").style.display = "none";
        game.style.display = "block";

        if (data.isAdmin) {
          adminPanel.style.display = "block";
        }
      } catch (err) {
        console.error(err);
        loginMsg.innerText = "Error de conexión con el servidor";
      }
    });
  }
});
