
var elementos = document.querySelectorAll('div.component__feedback-content');


elementos.forEach(function(elemento) {
    console.log(elemento);
});


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
