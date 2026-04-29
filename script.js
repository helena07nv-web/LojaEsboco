// =========================================
//  SHOPNOW — Lógica do Site
// =========================================

let cartItems = []; // array de objetos { nome, preco, emoji, desc, qty }
let usuarioLogado = false;
let descontoAtual = 0;

// ── NAVEGAÇÃO ──
function goTo(pageId) {
  document.querySelectorAll('.page').forEach(function(page) {
    page.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');
  window.scrollTo(0, 0);
}

// ── TOAST ──
function showToast(mensagem) {
  var toast = document.getElementById('toast');
  toast.textContent = mensagem;
  toast.classList.add('show');
  setTimeout(function() { toast.classList.remove('show'); }, 2800);
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

// ── ADICIONAR AO CARRINHO ──
function addCart(btn) {
  var card = btn.closest('.product-card');
  var nome  = card.getAttribute('data-nome');
  var preco = parseFloat(card.getAttribute('data-preco'));
  var emoji = card.getAttribute('data-emoji');
  var desc  = card.getAttribute('data-desc');

  // Verifica se o item já está no carrinho
  var existente = cartItems.find(function(i) { return i.nome === nome; });
  if (existente) {
    existente.qty++;
  } else {
    cartItems.push({ nome: nome, preco: preco, emoji: emoji, desc: desc, qty: 1 });
  }

  atualizarBadge();

  // Feedback visual no botão
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

// ── ATUALIZAR BADGE ──
function atualizarBadge() {
  var total = cartItems.reduce(function(sum, i) { return sum + i.qty; }, 0);
  document.getElementById('cart-count').textContent = total;
  var badge2 = document.getElementById('cart-count-checkout');
  if (badge2) badge2.textContent = total;
}

// ── IR PARA O CARRINHO ──
function irParaCarrinho() {
  if (!usuarioLogado) {
    showToast('⚠️ Faça login antes de ver o carrinho!');
    goTo('page-login');
    return;
  }
  renderizarCarrinho();
  goTo('page-checkout');
}

// ── RENDERIZAR CARRINHO ──
function renderizarCarrinho() {
  var lista = document.getElementById('cart-items-list');
  var empty = document.getElementById('cart-empty');
  var couponArea = document.getElementById('cart-coupon-area');

  lista.innerHTML = '';

  if (cartItems.length === 0) {
    empty.style.display = 'flex';
    couponArea.style.display = 'none';
  } else {
    empty.style.display = 'none';
    couponArea.style.display = 'flex';

    cartItems.forEach(function(item, index) {
      var subtotal = item.preco * item.qty;
      var div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div class="cart-item-produto">
          <div class="cart-item-thumb">${item.emoji}</div>
          <div class="cart-item-info">
            <div class="cart-item-nome">${item.nome}</div>
            <div class="cart-item-desc">${item.desc}</div>
            <button class="cart-item-remover" onclick="removerItem(${index})">🗑️ Remover</button>
          </div>
        </div>
        <div class="cart-item-preco">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="alterarQty(${index}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="alterarQty(${index}, +1)">+</button>
        </div>
        <div class="cart-item-subtotal">R$ ${subtotal.toFixed(2).replace('.', ',')}</div>
      `;
      lista.appendChild(div);
    });
  }

  atualizarResumo();
}

// ── ALTERAR QUANTIDADE ──
function alterarQty(index, delta) {
  cartItems[index].qty += delta;
  if (cartItems[index].qty <= 0) {
    cartItems.splice(index, 1);
  }
  atualizarBadge();
  renderizarCarrinho();
}

// ── REMOVER ITEM ──
function removerItem(index) {
  cartItems.splice(index, 1);
  atualizarBadge();
  renderizarCarrinho();
  showToast('🗑️ Item removido do carrinho.');
}

// ── ATUALIZAR RESUMO ──
function atualizarResumo() {
  var subtotal = cartItems.reduce(function(sum, i) { return sum + i.preco * i.qty; }, 0);
  var totalQtd = cartItems.reduce(function(sum, i) { return sum + i.qty; }, 0);
  var frete = subtotal > 0 && subtotal < 99 ? 15 : 0;
  var total = subtotal - descontoAtual + frete;
  if (total < 0) total = 0;

  document.getElementById('summary-qtd-label').textContent = 'Subtotal (' + totalQtd + ' produto' + (totalQtd !== 1 ? 's' : '') + ')';
  document.getElementById('summary-subtotal').textContent = 'R$ ' + subtotal.toFixed(2).replace('.', ',');
  document.getElementById('summary-desconto').textContent = '– R$ ' + descontoAtual.toFixed(2).replace('.', ',');
  document.getElementById('summary-frete').textContent = frete === 0 ? 'Grátis' : 'R$ ' + frete.toFixed(2).replace('.', ',');
  document.getElementById('summary-total').textContent = 'R$ ' + total.toFixed(2).replace('.', ',');

  var parcela = total > 0 ? (total / 4).toFixed(2).replace('.', ',') : '0,00';
  document.getElementById('summary-parcelamento').textContent = total > 0
    ? 'em até 4x de R$ ' + parcela + ' sem juros'
    : '';
}

// ── CUPOM ──
function aplicarCupom() {
  var codigo = document.getElementById('coupon-input').value.trim().toUpperCase();
  var cupons = { 'FRETE22': 20, 'DEV10': 10, 'SHOPNOW15': 15 };

  if (cupons[codigo] !== undefined) {
    descontoAtual = cupons[codigo];
    showToast('✅ Cupom ' + codigo + ' aplicado! Desconto de R$ ' + descontoAtual);
    atualizarResumo();
  } else {
    showToast('❌ Cupom inválido ou expirado.');
  }
}

// ── FINALIZAR COMPRA ──
function finalizarCompra() {
  if (cartItems.length === 0) {
    showToast('⚠️ Seu carrinho está vazio!');
    return;
  }
  showToast('🎉 Pedido realizado com sucesso! Obrigado pela compra!');
  cartItems = [];
  descontoAtual = 0;
  atualizarBadge();
  setTimeout(function() { goTo('page-home'); }, 2000);
}
