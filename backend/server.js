// server.js
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { initDB } from "./db.js";
import fetch from "node-fetch";

const app = express();
const PORT = 4000;
const SECRET = "conectatea-secret";

app.use(cors());
app.use(express.json());

let db;
initDB().then((database) => {
  db = database;
});

// Middleware para validar token
function auth(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ message: "Token ausente" });
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token inválido" });
  }
}

/* ---------------------- AUTH ---------------------- */
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Dados incompletos" });

  const hashed = await bcrypt.hash(password, 10);
  try {
    const result = await db.run(
      "INSERT INTO users (name, email, password) VALUES (?,?,?)",
      [name, email, hashed]
    );
    const user = { id: result.lastID, name, email };
    const token = jwt.sign(user, SECRET);
    res.json({ user, token });
  } catch {
    res.status(409).json({ message: "Email já cadastrado" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.get("SELECT * FROM users WHERE email=?", [email]);
  if (!user) return res.status(401).json({ message: "Credenciais inválidas" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Credenciais inválidas" });

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    SECRET
  );
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

/* ---------------------- RESOURCES ---------------------- */
app.get("/api/resources", async (req, res) => {
  const rows = await db.all("SELECT * FROM resources");
  res.json(rows);
});

/* ---------------------- COMMUNITY ---------------------- */
// Listar posts (com comentários)
app.get("/api/community/posts", async (req, res) => {
  const posts = await db.all("SELECT * FROM posts ORDER BY id DESC");
  const comments = await db.all("SELECT * FROM comments ORDER BY id ASC");

  const postsWithComments = posts.map((p) => ({
    ...p,
    comments: comments.filter((c) => c.post_id === p.id),
  }));

  res.json(postsWithComments);
});

// Criar post
app.post("/api/community/posts", auth, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: "Conteúdo vazio" });

  const result = await db.run(
    "INSERT INTO posts (author, content) VALUES (?,?)",
    [req.user.name, content]
  );
  res.json({
    id: result.lastID,
    author: req.user.name,
    content,
    likes: 0,
    created_at: new Date(),
    comments: [],
  });
});

// Curtir post
app.post("/api/community/posts/:id/like", auth, async (req, res) => {
  const id = req.params.id;
  await db.run("UPDATE posts SET likes = likes + 1 WHERE id=?", [id]);
  const updated = await db.get("SELECT * FROM posts WHERE id=?", [id]);
  res.json(updated);
});

// Comentar post
app.post("/api/community/posts/:id/comment", auth, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Comentário vazio" });

  const result = await db.run(
    "INSERT INTO comments (post_id, author, text) VALUES (?,?,?)",
    [req.params.id, req.user.name, text]
  );

  res.json({
    id: result.lastID,
    post_id: req.params.id,
    author: req.user.name,
    text,
    created_at: new Date(),
  });
});

/* ---------------------- DIARY ---------------------- */
app.get("/api/diary", auth, async (req, res) => {
  const rows = await db.all(
    "SELECT * FROM diary_entries WHERE user_id = ? ORDER BY created_at DESC",
    [req.user.id]
  );
  res.json(rows);
});

app.post("/api/diary", auth, async (req, res) => {
  const { date, note, tags } = req.body;
  if (!date || !note)
    return res.status(400).json({ message: "Campos obrigatórios" });

  const result = await db.run(
    "INSERT INTO diary_entries (user_id, date, note, tags) VALUES (?,?,?,?)",
    [req.user.id, date, note, tags]
  );

  res.json({
    id: result.lastID,
    user_id: req.user.id,
    date,
    note,
    tags,
    created_at: new Date(),
  });
});

app.delete("/api/diary/:id", auth, async (req, res) => {
  await db.run("DELETE FROM diary_entries WHERE id = ? AND user_id = ?", [
    req.params.id,
    req.user.id,
  ]);
  res.json({ success: true });
});

/* ---------------------- CHECKLISTS ---------------------- */
app.get("/api/checklists", auth, async (req, res) => {
  const rows = await db.all(
    "SELECT * FROM checklists WHERE user_id = ? ORDER BY created_at DESC",
    [req.user.id]
  );
  res.json(rows);
});

app.post("/api/checklists", auth, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Texto obrigatório" });

  const result = await db.run(
    "INSERT INTO checklists (user_id, text, done) VALUES (?,?,?)",
    [req.user.id, text, 0]
  );

  res.json({
    id: result.lastID,
    user_id: req.user.id,
    text,
    done: 0,
    created_at: new Date(),
  });
});

app.put("/api/checklists/:id", auth, async (req, res) => {
  const { done } = req.body;
  await db.run(
    "UPDATE checklists SET done=? WHERE id=? AND user_id=?",
    [done ? 1 : 0, req.params.id, req.user.id]
  );
  res.json({ success: true });
});

app.delete("/api/checklists/:id", auth, async (req, res) => {
  await db.run("DELETE FROM checklists WHERE id = ? AND user_id = ?", [
    req.params.id,
    req.user.id,
  ]);
  res.json({ success: true });
});

app.listen(PORT, () =>
  console.log(`✅ API rodando em http://localhost:${PORT}`)
);

// rota para buscar artigos sobre autismo no PubMed
app.get("/api/resources/online", async (req, res) => {
  try {
    const q = req.query.q || "autism";
    const response = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${q}&retmode=json&retmax=10`
    );
    const data = await response.json();

    const ids = data.esearchresult.idlist;
    if (!ids.length) return res.json([]);

    const details = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(
        ","
      )}&retmode=json`
    );
    const detailData = await details.json();

    const articles = Object.values(detailData.result)
      .filter((a) => a.uid)
      .map((a) => ({
        id: a.uid,
        title: a.title,
        type: "Artigo científico",
        url: `https://pubmed.ncbi.nlm.nih.gov/${a.uid}/`,
      }));

    res.json(articles);
  } catch (err) {
    console.error("Erro PubMed:", err);
    res.status(500).json({ message: "Erro ao buscar artigos" });
  }
});