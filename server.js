const express = require('express');
const cors = require('cors');
const fs = require('fs'); // Módulo nativo para lidar com arquivos
const app = express();

app.use(cors());

// Nome do nosso "mini banco de dados"
const SAVE_FILE = 'save.json';

// Função para carregar os dados salvos
let playerStats = { xp: 0, era: "Idade da Pedra" };

if (fs.existsSync(SAVE_FILE)) {
    const data = fs.readFileSync(SAVE_FILE);
    playerStats = JSON.parse(data);
    console.log(">>> Progresso carregado com sucesso!");
}

app.get('/lutar', (req, res) => {
    playerStats.xp += 50;

    // Lógica de Evolução
    if (playerStats.xp >= 150) playerStats.era = "Era Futurista";
    else if (playerStats.xp >= 100) playerStats.era = "Idade Moderna";
    else if (playerStats.xp >= 50) playerStats.era = "Idade do Ferro";

    // SALVANDO NO ARQUIVO: Transformamos o objeto em texto e gravamos
    fs.writeFileSync(SAVE_FILE, JSON.stringify(playerStats));

    res.json(playerStats);
});

// Rota para resetar o jogo (Útil para testes!)
app.get('/reset', (req, res) => {
    playerStats = { xp: 0, era: "Idade da Pedra" };
    fs.writeFileSync(SAVE_FILE, JSON.stringify(playerStats));
    res.json(playerStats);
});

app.listen(3000, () => console.log("Servidor com Save System em: http://localhost:3000"));

// Adicione isso no seu server.js
app.get('/status', (req, res) => {
    res.json(playerStats); // Só devolve o XP e a Era atual
});