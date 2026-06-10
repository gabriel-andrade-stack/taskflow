const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database.db");

// CRIA TABELA
db.run(`
CREATE TABLE IF NOT EXISTS tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    prioridade TEXT DEFAULT 'Média',
    concluida INTEGER DEFAULT 0,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

// LISTAR
app.get("/tarefas", (req, res) => {
    db.all("SELECT * FROM tarefas ORDER BY id DESC", [], (err, rows) => {
        res.json(rows);
    });
});

// CRIAR
app.post("/tarefas", (req, res) => {
    const { titulo, prioridade } = req.body;

    db.run(
        "INSERT INTO tarefas (titulo, prioridade, concluida) VALUES (?, ?, 0)",
        [titulo, prioridade],
        function () {
            res.json({ id: this.lastID });
        }
    );
});

// CONCLUIR
app.put("/tarefas/:id", (req, res) => {
    db.run(
        "UPDATE tarefas SET concluida = ? WHERE id = ?",
        [req.body.concluida, req.params.id],
        () => res.sendStatus(200)
    );
});

// EDITAR
app.put("/tarefas/editar/:id", (req, res) => {
    const { titulo, prioridade } = req.body;

    db.run(
        "UPDATE tarefas SET titulo = ?, prioridade = ? WHERE id = ?",
        [titulo, prioridade, req.params.id],
        () => res.sendStatus(200)
    );
});

// DELETAR
app.delete("/tarefas/:id", (req, res) => {
    db.run("DELETE FROM tarefas WHERE id = ?", [req.params.id], () => {
        res.sendStatus(200);
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});