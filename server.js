const express = require('express');
const cors = require('cors');
const fs = require('fs'); // Módulo nativo para lidar com arquivos
const app = express();
const path = require('path');

// Faz o Express entender que os arquivos estão na mesma pasta
app.use(express.static(__dirname)); 

// Rota principal que entrega o seu index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


// Adicione isso no seu server.js
app.get('/status', (req, res) => {
    res.json(playerStats); // Só devolve o XP e a Era atual
});