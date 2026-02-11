import express from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const db = new Database("casino.db");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "entrerios-secret",
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, "public")));

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    isAdmin INTEGER DEFAULT 0,
    chips INTEGER DEFAULT 0
  )
`).run();

db.prepare("DELETE FROM users WHERE username = 'admin'").run();
const hash = bcrypt.hashSync("cambiar123", 10);
db.prepare("INSERT INTO users (username, password, isAdmin, chips) VALUES (?, ?, 1, 0)")
  .run("admin", hash);

}

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ ok: false, msg: "Credenciales incorrectas" });
  }
  req.session.user = { id: user.id, username: user.username, isAdmin: user.isAdmin };
  res.json({ ok: true, isAdmin: !!user.isAdmin, chips: user.chips });
});

app.post("/admin/create-user", (req, res) => {
  if (!req.session.user?.isAdmin) return res.sendStatus(403);
  const { username, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  db.prepare("INSERT INTO users (username, password, chips) VALUES (?, ?, 0)")
    .run(username, hash);
  res.json({ ok: true });
});

app.post("/admin/set-chips", (req, res) => {
  if (!req.session.user?.isAdmin) return res.sendStatus(403);
  const { username, chips } = req.body;
  db.prepare("UPDATE users SET chips = ? WHERE username = ?").run(chips, username);
  res.json({ ok: true });
});

app.post("/spin", (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  const { bet } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.session.user.id);

  if (user.chips < bet) {
    return res.status(400).json({ ok: false, msg: "No tenés fichas suficientes" });
  }

  const win = Math.random() < 0.3; // 30% de probabilidad de ganar
  const delta = win ? bet : -bet;

  db.prepare("UPDATE users SET chips = chips + ? WHERE id = ?")
    .run(delta, user.id);

  res.json({ ok: true, win, delta });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Casino Virtual EntreRios corriendo en puerto " + PORT);
});
