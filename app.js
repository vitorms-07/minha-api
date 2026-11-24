

// Importar o framework Express
const express = require('express');
// Criar a instância da aplicação
const app = express();
const PORT = 3000;
// MIDDLEWARE: permite ler JSON no body das requisições
// Sem isso, req.body sempre será undefined no POST/PUT
app.use(express.json());
// ============================================================
// SIMULAÇÃO DE BANCO DE DADOS (Array em Memória)
// ============================================================
let produtos = [
{
id: 1,
nome: 'Notebook',
preco: 3500.00,
estoque: 10,
categoria: 'Informatica'
},
{
id: 2,
nome: 'Mouse Gamer',
preco: 150.00,
estoque: 50,
categoria: 'Informatica'
},
{
id: 3,
nome: 'Teclado Mecânico',
preco: 450.00,
estoque: 30,
categoria: 'Informatica'
},
];
// Controla o próximo ID a ser atribuído
// Sempre incrementa para garantir IDs únicos
let proximoId = 4;

// ============================================================
// GET /produtos — Retorna TODOS os produtos
// ============================================================
app.get('/produtos', (req, res) => {
// Status 200 = OK (sucesso)
res.status(200).json(produtos);
});
// ============================================================
// GET /produtos/:id — Retorna UM produto pelo ID
// :id é um parâmetro dinâmico na URL
// ============================================================
app.get('/produtos/:id', (req, res) => {
// req.params.id vem como STRING — converter para número!

JavaScript
const id = parseInt(req.params.id);
// find() percorre o array e retorna o primeiro que satisfaz
const produto = produtos.find(p => p.id === id);
if (produto) {
res.status(200).json(produto);
} else {
// Status 404 = Not Found
res.status(404).json({
mensagem: `Produto ${id} não encontrado`
});
}
});



// ============================================================
// POST /produtos — Cria um novo produto
// Os dados chegam no corpo (body) da requisição em JSON
// ============================================================
app.post('/produtos', (req, res) => {
// Desestruturar os dados do body
const { nome, preco, estoque, categoria } = req.body;
// VALIDAÇÃO: todos os campos são obrigatórios
if (!nome || !preco || !estoque || !categoria) {
// Status 400 = Bad Request
return res.status(400).json({
mensagem: 'Campos obrigatórios: nome, preco, estoque, categoria'
});
}
// Validação de valores negativos
if (parseFloat(preco) <= 0) {
return res.status(400).json({
mensagem: 'Preço deve ser maior que zero'
});
}
// Montar o objeto do novo produto
const novoProduto = {
id: proximoId++, // Atribuir e incrementar o ID
nome, // Shorthand ES6 (nome: nome)
preco: parseFloat(preco), // Garantir tipo número
estoque: parseInt(estoque), // Garantir tipo inteiro
categoria,
};
produtos.push(novoProduto); // Adicionar ao 'banco'
// Status 201 = Created (recurso criado com sucesso)
res.status(201).json(novoProduto);
});



// ============================================================
// PUT /produtos/:id — Atualiza TODOS os dados de um produto
// Diferença de PATCH: o PUT substitui o objeto inteiro
// ============================================================
app.put('/produtos/:id', (req, res) => {
const id = parseInt(req.params.id);
const { nome, preco, estoque, categoria } = req.body;
if (!nome || !preco || !estoque || !categoria) {
return res.status(400).json({
mensagem: 'Todos os campos são obrigatórios'
});
}
// findIndex() retorna a posição no array (-1 se não achar)


const index = produtos.findIndex(p => p.id === id);
if (index !== -1) {
// Substituir o objeto mantendo o ID original
produtos[index] = {
id,
nome,
preco: parseFloat(preco),
estoque: parseInt(estoque),
categoria
};
res.status(200).json(produtos[index]);
} else {
res.status(404).json({
mensagem: `Produto ${id} não encontrado`
});
}
});



// ============================================================
// DELETE /produtos/:id — Remove um produto
// ============================================================
app.delete('/produtos/:id', (req, res) => {
const id = parseInt(req.params.id);
const index = produtos.findIndex(p => p.id === id);
if (index !== -1) {
// splice(posicao, quantidade) — remove 1 item na posição
produtos.splice(index, 1);
res.status(200).json({
mensagem: `Produto ${id} removido com sucesso`
});
} else {
res.status(404).json({
    mensagem: `Produto ${id} não encontrado`
});
}
});
// ============================================================
// INICIAR O SERVIDOR
// ============================================================
app.listen(PORT, () => {
console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
console.log(`📋 Acesse http://localhost:${PORT}/produtos`);
});