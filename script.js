// ===== 1. Preparação =====
const canvas = document.getElementById("mapa");
const ctx = canvas.getContext("2d");

const TAMANHO = 32; // tamanho de cada quadradinho, em pixels
const COLUNAS = canvas.width / TAMANHO;
const LINHAS = canvas.height / TAMANHO;

// ===== 2. O mapa na memória =====
// 0 = célula vazia, 1 = célula pintada
const mapa = [];
for (let linha = 0; linha < LINHAS; linha++) {
  mapa.push(new Array(COLUNAS).fill(0));
}

// ===== 3. Desenhar =====
function desenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let linha = 0; linha < LINHAS; linha++) {
    for (let coluna = 0; coluna < COLUNAS; coluna++) {
      const x = coluna * TAMANHO;
      const y = linha * TAMANHO;

      if (mapa[linha][coluna] === 1) {
        ctx.fillStyle = "#7a7aff";
        ctx.fillRect(x, y, TAMANHO, TAMANHO);
      }

      ctx.strokeStyle = "#2a2a4a";
      ctx.strokeRect(x, y, TAMANHO, TAMANHO);
    }
  }
}

// ===== 4. Reagir ao clique =====
canvas.addEventListener("click", function (evento) {
  const caixa = canvas.getBoundingClientRect();
  const x = evento.clientX - caixa.left - canvas.clientLeft;
  const y = evento.clientY - caixa.top - canvas.clientTop;

  const coluna = Math.floor(x / TAMANHO);
  const linha = Math.floor(y / TAMANHO);

  if (linha < 0 || linha >= LINHAS || coluna < 0 || coluna >= COLUNAS) {
    return; // clicou na borda, fora da grade
  }

  if (mapa[linha][coluna] === 0) {
    mapa[linha][coluna] = 1;
  } else {
    mapa[linha][coluna] = 0;
  }

  desenhar();
});

desenhar();
