

#versao 2
(function(){
  function querySelectorAllDeep(selector){
    const results = [];
    function walk(node){
      if (!node) return;
      if (node.nodeType === Node.ELEMENT_NODE){
        try { if (node.matches(selector)) results.push(node); } catch(e){}
      }
      if (node.shadowRoot) Array.from(node.shadowRoot.children).forEach(walk);
      Array.from(node.children || []).forEach(walk);
    }
    walk(document);
    return results;
  }

  const elementos = querySelectorAllDeep('div.component__feedback-content');
  let conteudoTXT = '';
  
  elementos.forEach(function(elemento, index){
    const texto = elemento.textContent.trim();
    conteudoTXT += `=== ELEMENTO ${index + 1} ===\n`;
    conteudoTXT += `${texto}\n\n`;
  });

  const blob = new Blob([conteudoTXT], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'conteudos-feedback.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
})();





###Prova 
(async function(){
  function querySelectorAllDeep(selector){
    const results = new Set();
    function walk(node){
      if (!node) return;
      if (node.nodeType === Node.ELEMENT_NODE){
        try { if (node.matches(selector)) results.add(node); } catch(e){}
      }
      if (node.shadowRoot){
        try {
          node.shadowRoot.querySelectorAll(selector).forEach(n => results.add(n));
        } catch(e){}
        Array.from(node.shadowRoot.children || []).forEach(walk);
      }
      Array.from(node.children || []).forEach(walk);
    }
    walk(document);
    return Array.from(results);
  }

  function findAllBySelectors(selectors){
    const found = [];
    selectors.forEach(s => {
      querySelectorAllDeep(s).forEach(el => found.push(el));
    });
    return Array.from(new Set(found));
  }

  function isVisible(el){
    try{
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style && style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
    }catch(e){ return false; }
  }

  function dispatchClick(el){
    try{
      el.focus({preventScroll:true});
    }catch(e){}
    try{
      el.scrollIntoView({block:'center', inline:'center', behavior:'auto'});
    }catch(e){}
    try{
      el.click();
      return;
    }catch(e){}
    const evOpts = { bubbles: true, cancelable: true, view: window, composed: true };
    ['pointerdown','mousedown','pointerup','mouseup','click'].forEach(type => {
      try{ el.dispatchEvent(new MouseEvent(type, Object.assign({}, evOpts, {button:0}))); }catch(e){}
    });
  }

  const selectors = [
    'button[aria-label="Avançar"]',
    'button.narrative__controls.next',
    'button.accordion__item-btn',
    'button.btn-text.btn__action.btn__feedback',
    'button.btn-text.btn__action.js-btn-action:not([disabled])',
    'button.btn__action', // geral para botões de ação
    'div.btn__marking.item-state.is-correct', // elementos que marcam correto (se quiser ativá-los)
    'a[href] > img',
    'a[href]'
  ];

  const elements = findAllBySelectors(selectors)
    .filter((el, i, arr) => arr.indexOf(el) === i) // dedupe
    .sort((a,b) => {
      try{ return a.getBoundingClientRect().top - b.getBoundingClientRect().top; }catch(e){ return 0; }
    });

  for (const el of elements){
    if (el.dataset.__autoClicked) continue;
    if (!isVisible(el) && el.tagName.toLowerCase() !== 'a') continue;
    try{
      dispatchClick(el);
      el.dataset.__autoClicked = '1';
      await new Promise(r => setTimeout(r, 300)); // pequeno intervalo para permitir mudanças de estado
    }catch(e){}
  }

  const remaining = elements.filter(e => !e.dataset.__autoClicked).length;
  console.log('elements found:', elements.length, 'clicked:', elements.length - remaining, 'remaining:', remaining);
})();

#cliqueeprogresso 
(function(){
  // Função para clicar em todos os botões de avançar
  const botoesAvancar = document.querySelectorAll('button[aria-label="Avançar"], button.narrative__controls.next');
  botoesAvancar.forEach(botao => {
    botao.click();
  });

  // Função para clicar em todos os accordions selecionados
  const accordions = document.querySelectorAll('button.accordion__item-btn.isSelected');
  accordions.forEach(accordion => {
    accordion.click();
  });

  // Função para clicar em todos os botões de mostrar feedback
  const botoesFeedback = document.querySelectorAll('button.btn__feedback[aria-label="Mostrar feedback"]');
  botoesFeedback.forEach(botao => {
    botao.click();
  });

  // Criar arquivo com relatório das ações
  let relatorio = `AÇÕES EXECUTADAS:\n\n`;
  relatorio += `Botões "Avançar" clicados: ${botoesAvancar.length}\n`;
  relatorio += `Accordions expandidos: ${accordions.length}\n`;
  relatorio += `Feedbacks mostrados: ${botoesFeedback.length}\n`;

  const blob = new Blob([relatorio], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'acoes-trigger.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
})();

(function(){
  function querySelectorAllDeep(selector){
    const results = [];
    function walk(node){
      if (!node) return;
      if (node.nodeType === Node.ELEMENT_NODE){
        try { if (node.matches(selector)) results.push(node); } catch(e){}
      }
      if (node.shadowRoot) Array.from(node.shadowRoot.children).forEach(walk);
      Array.from(node.children || []).forEach(walk);
    }
    walk(document);
    return results;
  }

  function getDescendantsDeep(root, selector){
    const results = [];
    function walk(node){
      if (!node) return;
      if (node.nodeType === Node.ELEMENT_NODE){
        try { if (node.matches(selector)) results.push(node); } catch(e){}
      }
      if (node.shadowRoot) Array.from(node.shadowRoot.children).forEach(walk);
      Array.from(node.children || []).forEach(walk);
    }
    walk(root);
    return results;
  }

  function ancestorChain(node){
    const chain = [];
    let n = node;
    while(n){
      chain.push(n);
      if (n.parentNode) n = n.parentNode;
      else if (n.host) n = n.host;
      else break;
    }
    return chain;
  }

  function nearestFeedbackByRect(targetRect, feedbacks){
    if (!feedbacks.length) return null;
    let best = null;
    let bestDist = Infinity;
    const tx = targetRect.left + targetRect.width/2;
    const ty = targetRect.top + targetRect.height/2;
    feedbacks.forEach(f => {
      try{
        const r = f.getBoundingClientRect();
        const fx = r.left + r.width/2;
        const fy = r.top + r.height/2;
        const d = Math.hypot(fx - tx, fy - ty);
        if (d < bestDist){ bestDist = d; best = f; }
      }catch(e){}
    });
    return best;
  }

  const correctNodes = querySelectorAllDeep('.is-correct');
  const allFeedbacks = querySelectorAllDeep('div.component__feedback-content');

  correctNodes.forEach(node => {
    const chain = ancestorChain(node);
    const mcqAncestor = chain.find(n => n.tagName && n.tagName.toLowerCase() === 'mcq-view');
    let candidateFeedbacks = [];
    if (mcqAncestor){
      candidateFeedbacks = getDescendantsDeep(mcqAncestor, 'div.component__feedback-content');
    }
    if (!candidateFeedbacks.length){
      const rect = (() => { try { return node.getBoundingClientRect(); } catch(e){ return null; } })();
      if (rect){
        const nearest = nearestFeedbackByRect(rect, allFeedbacks);
        if (nearest) candidateFeedbacks = [nearest];
      }
    }
    if (!candidateFeedbacks.length) candidateFeedbacks = allFeedbacks.slice(0,1);
    candidateFeedbacks.forEach(feedback => {
      try{
        const text = (feedback.textContent || '').toLowerCase();
        if (!/\bis-correct\b/i.test(text)){
          const sep = feedback.lastChild && feedback.lastChild.nodeType === Node.TEXT_NODE ? ' ' : ' ';
          const span = document.createElement('span');
          span.className = 'added-is-correct';
          span.textContent = sep + 'is-correct';
          feedback.appendChild(span);
        }
      }catch(e){}
    });
  });
})();
