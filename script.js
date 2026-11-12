// ===== 1. Preparação =====
const canvas = document.getElementById("mapa");
const ctx = canvas.getContext("2d");

const TAMANHO = 20; // tamanho de cada quadradinho, em pixels
const COLUNAS = Math.floor(canvas.width / TAMANHO);
const LINHAS = Math.floor(canvas.height / TAMANHO);

// ===== 2. Tipos de tile =====
// A posição na lista é o número que fica guardado no mapa
const TILES = [
  {nome: "Apagar", cor: null },
  {nome: "Chão",   cor: "#8a8a9e" },
  {nome: "Parede", cor: "#4a4a6a" },
  {nome: "Porta",  cor: "#c8853a" },
  {nome: "Mesa",   cor: "#6b4a2e" },
];

let tileAtual = 1; // começa com o Chão selecionado

// ===== 3. O mapa na memória =====
// 0 = célula vazia, 1 = célula pintada
const mapa = [];
for (let linha = 0; linha < LINHAS; linha++) {
  mapa.push(new Array(COLUNAS).fill(0));
}

// ===== 4. Desenhar =====
function desenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let linha = 0; linha < LINHAS; linha++) {
    for (let coluna = 0; coluna < COLUNAS; coluna++) {
      const x = coluna * TAMANHO;
      const y = linha * TAMANHO;
      const tile = TILES[mapa[linha][coluna]];

      if (tile.cor !== null) {
        ctx.fillStyle = tile.cor;
        ctx.fillRect(x, y, TAMANHO, TAMANHO);
      }

      ctx.strokeStyle = "#1a1a2e";
      ctx.strokeRect(x, y, TAMANHO, TAMANHO);
    }
  }
}

// ===== 5, Paleta de Botões =====
const paleta = document.getElementById("paleta");

TILES.forEach(function (tile, indice) {
  const botao = document.createElement("button");
  botao.textContent = tile.nome;

   if (tile.cor !== null) {
     botao.style.borderLeft = "16px solid " + tile.cor;
   }
  if (indice === tileAtual) {
    botao.classList.add("ativo");
  }

  botao.addEventListener("click", function () {
    tileAtual = indice;
    document.querySelectorAll("#paleta button").forEach(function (b) {
      b.classList.remove("ativo");
    });
    botao.classList.add("ativo");
  });

  paleta.appendChild(botao);
});

// ===== 6. Pintar com o mouse (clicar e arrastar) =====
let pintando = false;

function pintarCelula(evento) {
  const caixa = canvas.getBoundingClientRect();
  const x = evento.clientX - caixa.left - canvas.clientLeft;
  const y = evento.clientY - caixa.top - canvas.clientTop;

  const coluna = Math.floor(x / TAMANHO);
  const linha = Math.floor(y / TAMANHO);

  if (linha < 0 || linha >= LINHAS || coluna < 0 || coluna >= COLUNAS) {
    return;
  }
  if (mapa[linha][coluna] === tileAtual) {
    return; // ja está assim, não precisa redesenhar
  }

  mapa[linha][coluna] = tileAtual;
  desenhar();
}

canvas.addEventListener("mousedown", function (evento) {
  evento.preventDefault();
  pintando = true;
  pintarCelula(evento);
});

canvas.addEventListener("mousemove", function (evento) {
  if (pintando) {
    pintarCelula(evento);
  }
});

window.addEventListener("mouseup", function () {
  pintando = false;
});

// ==== 7. Salvar, carregar e limpar =====
const CHAVE = "mapa-rpg-pixel";

document.getElementById("btn-salvar").addEventListener("click", function () {
  localStorage.setItem(CHAVE, JSON.stringify(mapa));
  alert("Mapa salvo!");
});

document.getElementById("btn-carregar").addEventListener("click", function () {
  const salvo = localStorage.getItem(CHAVE);
  if (salvo === null) {
    alert("Nenhum mapa foi salvo ainda.");
    return;
  }

  const dados = JSON.parse(salvo);
  if (dados.length !== LINHAS || dados[0].length !== COLUNAS) {
    alert("O mapa salvo tem um tamanho diferente do atual.");
    return;
  }

  for (let linha = 0; linha < LINHAS; linha++) {
    for (let coluna = 0; coluna < COLUNAS; coluna++) {
      mapa[linha][coluna] = dados[linha][coluna];
    }
  }
  desenhar();
});

document.getElementById("btn-limpar").addEventListener("click", function () {
  if (confirm("Limpar o mapa inteiro?")) {
    for (let linha = 0; linha < LINHAS; linha++) {
      mapa[linha].fill(0);
    }
    desenhar();
  }
});

desenhar();
