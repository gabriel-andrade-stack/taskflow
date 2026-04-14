const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database.db");

// Criar tabela
db.run(`
CREATE TABLE IF NOT EXISTS tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    concluida INTEGER
)
`);

// Listar tarefas
app.get("/tarefas", (req, res) => {
    db.all("SELECT * FROM tarefas", [], (err, rows) => {
        res.json(rows);
    });
});

// Criar tarefa
app.post("/tarefas", (req, res) => {
    const { titulo } = req.body;
    db.run(
        "INSERT INTO tarefas (titulo, concluida) VALUES (?, ?)",
        [titulo, 0],
        function () {
            res.json({ id: this.lastID });
        }
    );
});

// Atualizar tarefa
app.put("/tarefas/:id", (req, res) => {
    const id = req.params.id;
    const { concluida } = req.body;

    db.run(
        "UPDATE tarefas SET concluida = ? WHERE id = ?",
        [concluida, id],
        () => res.sendStatus(200)
    );
});

// Deletar
app.delete("/tarefas/:id", (req, res) => {
    db.run("DELETE FROM tarefas WHERE id = ?", [req.params.id], () =>
        res.sendStatus(200)
    );
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));