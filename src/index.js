const express = require('express');
const cors = require('cors');
const db = require('../db/bancodedados'); // conexão com BD

const app = express();
app.use(cors()); 
app.use(express.json()); 

const PORT = 3000;

// =========================
// ROTA: Criar Produto (POST)
// =========================
app.post("/api/produtos", async (req, res) => {
    try {
        const { nome, preco, estoque, info } = req.body;

        // Validação dos campos
        if (!nome || !preco || !estoque || !info) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios." });
        }

        const sql = `INSERT INTO produtos (nome, preco, estoque, info) VALUES (?, ?, ?, ?)`;
        const [result] = await db.query(sql, [nome, preco, estoque, info]);

        res.status(201).json({
            message: "Produto salvo com sucesso",
            id: result.insertId,
            nome,
            preco,
            estoque,
            info
        });

    } catch (err) {
        console.error("Erro ao criar produto:", err.message);
        res.status(500).json({ error: "Erro interno ao criar produto." });
    }
});

// =========================
// ROTA: Listar Produtos (GET)
// =========================
app.get("/api/produtos", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, nome, preco, estoque, info FROM produtos");
        res.json(rows);
    } catch (error) {
        console.error("Erro ao buscar produtos:", error.message);
        res.status(500).json({ error: "Erro interno ao buscar produtos." });
    }
});

// =========================
// ROTA: Atualizar Produto (PUT)
// =========================
app.put("/api/produtos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, preco, estoque, info } = req.body;

        // Verifica se o produto existe
        const [rows] = await db.query("SELECT * FROM produtos WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Produto não encontrado." });
        }

        // Atualiza no banco
        await db.query(
            "UPDATE produtos SET nome = ?, preco = ?, estoque = ?, info = ? WHERE id = ?",
            [nome, preco, estoque, info, id]
        );

        res.json({
            message: "Produto atualizado com sucesso.",
            id: parseInt(id),
            nome,
            preco,
            estoque,
            info
        });
    } catch (err) {
        console.error("Erro ao atualizar produto:", err.message);
        res.status(500).json({ error: "Erro interno ao atualizar produto." });
    }
});

// =========================
// ROTA: Deletar Produto (DELETE)
// =========================
app.delete("/api/produtos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica se o produto existe
        const [rows] = await db.query("SELECT id FROM produtos WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Produto não encontrado." });
        }

        // Deleta do banco
        await db.query("DELETE FROM produtos WHERE id = ?", [id]);

        res.json({ message: `Produto de ID ${id} foi deletado com sucesso.` });

    } catch (error) {
        console.error("Erro ao deletar produto:", error.message);
        res.status(500).json({ error: "Erro interno ao deletar produto." });
    }
});

// DESAFIO: "bloqueio" evitar que cadastre o produto com o mesmo nome no POST e PUT



// =========================
// Iniciar o servidor
// =========================
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
