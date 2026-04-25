// =========================================
//  SHOPNOW — Lógica do Site
// =========================================

let cartCount = 0;
let usuarioLogado = false;

// ── NAVEGAÇÃO ENTRE PÁGINAS ──
function goTo(pageId) {
  document.querySelectorAll('.page').forEach(function(page) {
    page.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');
  window.scrollTo(0, 0);
}

// ── NOTIFICAÇÃO (TOAST) ──
function showToast(mensagem) {
  var toast = document.getElementById('toast');
  toast.textContent = mensagem;
  toast.classList.add('show');
  setTimeout(function() {
    toast.classList.remove('show');
  }, 2800);
}

// ── LOGIN ──
function fazerLogin() {
  var email = document.getElementById('login-email').value.trim();
  var senha  = document.getElementById('login-pass').value;

  if (!email || !senha) { showToast('⚠️ Preencha todos os campos!'); return; }
  if (!email.includes('@')) { showToast('⚠️ E-mail inválido!'); return; }

  showToast('✅ Login realizado com sucesso!');
  usuarioLogado = true;
  setTimeout(function() { goTo('page-home'); }, 700);
}

// ── CADASTRO ──
function fazerCadastro() {
  var nome   = document.getElementById('reg-nome').value.trim();
  var email  = document.getElementById('reg-email').value.trim();
  var senha  = document.getElementById('reg-pass').value;
  var senha2 = document.getElementById('reg-pass2').value;

  if (!nome || !email || !senha || !senha2) { showToast('⚠️ Preencha todos os campos!'); return; }
  if (!email.includes('@')) { showToast('⚠️ E-mail inválido!'); return; }
  if (senha.length < 6) { showToast('⚠️ Senha muito curta! Mínimo 6 caracteres.'); return; }
  if (senha !== senha2) { showToast('⚠️ As senhas não coincidem!'); return; }

  showToast('🎉 Conta criada! Faça login.');
  setTimeout(function() { goTo('page-login'); }, 1200);
}

// ── SAIR ──
function sair() {
  showToast('👋 Até logo!');
  setTimeout(function() { goTo('page-login'); }, 800);
}

// ── CARRINHO ──
function addCart(id, nome, preco, btn) {
  // Lógica do Carrinho (Objetos)
  const itemExistente = carrinho.find(item => item.id === id);
  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ id, nome, preco, quantidade: 1 });
  }

  salvarEAtualizar();

  // Feedback Visual no Botão (O que você já tinha)
  var textoOriginal = btn.textContent;
  btn.textContent = '✓ Adicionado';
  btn.style.background = '#2a7a2a';
  btn.style.color = '#fff';

  setTimeout(function() {
    btn.textContent = textoOriginal;
    btn.style.background = '';
    btn.style.color = '';
  }, 1500);

  showToast(`🛒 ${nome} adicionado!`);
}

// ── FUNÇÃO DE CHECKOUT ──
function irParaPagamento() {
  if (!usuarioLogado) {
    showToast('⚠️ Faça login para finalizar a compra!');
    goTo('page-login');
    return;
  }

  renderizarResumo(); // <--- Corrigido de 'redenrizar' para 'renderizar'
  goTo('page-checkout'); // <--- Certifique-se que o ID no HTML é page-checkout
}

//1. Inicializa o carrinho (Tenta carregar do navegador ou cria um vazio)
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

//2. Função para adicionar um produto ao carrinho
function adicionarAoCarrinho(id, nome, preço) {
  // Verifica se o item ja esta no carrinho
  const itemExistente = carrinho.find(item => item.id === id);

  if (itemExistente) {
    itemExistente.quantidade += 1; // Incrementa a quantidade
  } else {
    carrinho.push({ id, nome, preço, quantidade: 1 }); // Adiciona novo item
  }

  salvarEAtualizar();
}

//3. SALVAR NO LOCAL STORAGE E ATUALIZAR O CONTADOR VISUAL
function salvarEAtualizar() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));

  // Atualiza o número no badge do carrinho (🛒 0)
  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  const badge = document.getElementById('cart-count');
  if (badge) badge.innerText = totalItens;

  salvarEAtualizar(); // Atualiza o resumo do pedido se estivermos na página de checkout
}

// 4. Função para renderizar na tela de resumo
function renderizarResumo() {
  const container = document.querySelector('.resumo-pedido-lista'); // Certifique-se que essa classe existe na sua div de checkout
  const totalElemento = document.querySelector('.valor-total');
  
  if (!container || !totalElemento) return;

  if (carrinho.length === 0) {
    container.innerHTML = "<p style='color:gray'>Seu carrinho está vazio.</p>";
    totalElemento.innerText = "Total: R$ 0,00";
    return;
  }

  container.innerHTML = carrinho.map(item => `
    <div class="item-carrinho" style="display:flex; justify-content:between; border-bottom:1px solid #333; padding:10px 0;">
      <div class="info">
        <p><strong>${item.nome}</strong></p>
        <p>Qtd: ${item.quantidade}</p>
      </div>
      <div class="preco">R$ ${(item.preco * item.quantidade).toFixed(2)}</div>
    </div>
  `).join('');

  const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  totalElemento.innerText = `Total: R$ ${total.toFixed(2)}`;
}
