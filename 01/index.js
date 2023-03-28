const express = require("express");
const { cadastrarAutor, obterAutor, cadastrarLivroParaAutor, listarLivros } = require("./controladores");
const app = express();
const porta = 3000

app.use(express.json());

app.post("/", cadastrarAutor);
app.get("/autor/:id", obterAutor);
app.post("/autor/:id/livro", cadastrarLivroParaAutor);
app.get("/livro", listarLivros);

app.listen(porta, () => console.log(`Servidor rodando na porta ${porta}`));
