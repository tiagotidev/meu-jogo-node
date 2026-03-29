const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const SAVE_FILE = './save.json';

// --- LÓGICA DE PERSISTÊNCIA (SAVE SYSTEM) ---
function carregarDados() {
    if (!fs.existsSync(SAVE_FILE)) {
        return { xp: 0, era: "Idade da Pedra", vida: 100 };
    }
    const data = fs.readFileSync(SAVE_FILE);
    return JSON.parse(data);
}

function salvarDados(dados) {
    fs.writeFileSync(SAVE_FILE, JSON.stringify(dados, null, 2));
}

// --- CONFIGURAÇÃO DE ARQUIVOS ESTÁTICOS ---
// Isso permite que o Node entregue o index.html e outros arquivos da pasta
app.use(express.static(__dirname));

// Rota principal: Quando alguém acessar o seu link do Render, ele abre o jogo
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- ROTAS DO JOGO ---

// 1. Status atual
app.get('/status', (req, res) => {
    res.json(carregarDados());
});

// 2. Lutar (Ganha XP, perde vida)
app.get('/lutar', (req, res) => {
    let dados = carregarDados();
    
    if (dados.vida > 0) {
        dados.xp += 50;
        dados.vida -= 15;

        // Lógica de Evolução de Era
        if (dados.xp >= 500) dados.era = "Idade do Bronze";
        if (dados.xp >= 1500) dados.era = "Idade Média";
        if (dados.xp >= 3000) dados.era = "Era Moderna";
        
        if (dados.vida < 0) dados.vida = 0;
        salvarDados(dados);
    }
    res.json(dados);
});

// 3. Descansar (Recupera vida)
app.get('/descansar', (req, res) => {
    let dados = carregarDados();
    if (dados.vida < 100) {
        dados.vida += 20;
        if (dados.vida > 100) dados.vida = 100;
        salvarDados(dados);
    }
    res.json(dados);
});

// 4. Resetar o Jogo
app.get('/reset', (req, res) => {
    const novoSave = { xp: 0, era: "Idade da Pedra", vida: 100 };
    salvarDados(novoSave);
    res.json(novoSave);
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
// IMPORTANTE: process.env.PORT é obrigatório para o Render funcionar!
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});