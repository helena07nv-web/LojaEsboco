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

  usuarioLogado = true;
  showToast('✅ Login realizado com sucesso!');
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
  usuarioLogado = false;
  showToast('👋 Até logo!');
  setTimeout(function() { goTo('page-login'); }, 800);
}

// ── PAGAMENTO ──
function irParaPagamento() {
  if (!usuarioLogado) {
    showToast('⚠️ Faça login antes de finalizar a compra!');
    goTo('page-login');
    return;
  }

  atualizarCheckout();
  goTo('page-checkout');
}

function atualizarCheckout() {
  var badge = document.getElementById('cart-count');
  var checkoutCount = document.getElementById('checkout-count');
  if (badge && checkoutCount) {
    checkoutCount.textContent = badge.textContent;
  }
}

// ── CARRINHO ──
function addCart(btn) {
  cartCount++;
  document.getElementById('cart-count').textContent = cartCount;

  var textoOriginal = btn.textContent;
  btn.textContent = '✓ Adicionado';
  btn.style.background = '#2a7a2a';
  btn.style.color = '#fff';

  setTimeout(function() {
    btn.textContent = textoOriginal;
    btn.style.background = '';
    btn.style.color = '';
  }, 1500);

  showToast('🛒 Produto adicionado ao carrinho!');
}