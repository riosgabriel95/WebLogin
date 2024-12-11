const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
//const db = new sqlite3.Database(':memory:'); // Banco de dados em memória (pode ser um arquivo)
const db = new sqlite3.Database('./database.db'); // Banco armazenado em arquivo

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Criação da tabela de usuários (se não existir)
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT,
            password TEXT
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar a tabela:', err.message);
        } else {
            console.log('Tabela users verificada/criada com sucesso.');
        }
    })
});

// Rota de cadastro
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    db.run(
        `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
        [username, email, password],
        function (err) {
            if (err) {
                return res.status(400).json({ error: 'Usuário já existe ou erro no cadastro' });
            }
            res.json({ message: 'Cadastro realizado com sucesso!' });
        }
    );
});

// Rota de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(
        `SELECT * FROM users WHERE username = ? AND password = ?`,
        [username, password],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Erro no servidor' });
            }
            if (!row) {
                return res.status(401).json({ error: 'Usuário ou senha incorretos' });
            }
            res.json({ message: 'Login bem-sucedido!' });
        }
    );
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Listar Usuários
app.get('/users', (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar usuários' });
        }
        res.json(rows);
    });
});

// Excluir Usuário
app.delete('/users/:username', (req, res) => {
    const username = req.params.username;

    db.run(`DELETE FROM users WHERE username = ?`, [username], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Erro ao excluir usuário' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json({ message: 'Usuário excluído com sucesso' });
    });
});