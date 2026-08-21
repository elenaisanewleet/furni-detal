/* Определитель детали: три входа — место, название, проблема. */
(function(){
  var grid=document.getElementById('pgrid');if(!grid)return;
  var detail=document.getElementById('detail'), count=document.getElementById('count'),
      q=document.getElementById('q'), places=document.getElementById('places'), syms=document.getElementById('syms');
  var placeSel='', symSel='', shown=[];

  function norm(s){return s.toLowerCase().replace(/ё/g,'е').trim()}
  function card(p){
    return '<button class="p" data-id="'+p.id+'" type="button"><span class="art">'+p.svg+'</span>'+
      '<span class="txt"><b>'+p.said+'</b><i>'+p.term+'</i></span>'+
      '<span class="open">Что это и что снять <span>→</span></span></button>';
  }
  function render(list){
    shown=list;
    grid.innerHTML=list.map(card).join('');
    count.textContent=list.length?('Показано: '+list.length+' из '+PARTS.length):'';
    if(!list.length)grid.innerHTML='<p class="empty">Ничего не нашлось по этим словам. Опишите деталь своими словами в заявке или пришлите фото — опознаем по снимку.</p>';
    detail.classList.remove('on');
  }
  function bySearch(v){
    var n=norm(v);if(!n)return PARTS.slice();
    return PARTS.filter(function(p){
      return norm(p.said).indexOf(n)>=0||norm(p.term).indexOf(n)>=0||
        p.aliases.some(function(a){return norm(a).indexOf(n)>=0})||
        p.symptoms.some(function(s){return norm(s).indexOf(n)>=0});
    });
  }
  function open(id){
    var p=PARTS.filter(function(x){return x.id===id})[0];if(!p)return;
    detail.innerHTML=
      '<div class="top"><div class="art2">'+p.svg+'</div><div class="head">'+
      '<h3>'+p.said+'</h3><p class="term">Называется: '+p.term+'</p><p class="what">'+p.what+'</p></div></div>'+
      '<div class="cols"><div class="col"><b>Что обычно случается</b><ul>'+
      p.symptoms.map(function(s){return '<li>'+s+'</li>'}).join('')+'</ul></div>'+
      '<div class="col"><b>Что сфотографировать</b><ul>'+
      p.shoot.map(function(s){return '<li>'+s+'</li>'}).join('')+'</ul></div></div>'+
      '<div class="acts2"><button class="btn" type="button" data-order="'+p.said+' ('+p.term+')">Заказать эту деталь</button>'+
      '<a class="btn line" href="'+p.service+'">Подробнее о работе</a>'+
      '<span style="color:var(--dim);font-size:15px">Фото по списку слева отвечает на большинство вопросов сразу</span></div>';
    detail.classList.add('on');
    [].forEach.call(grid.querySelectorAll('.p'),function(b){b.classList.toggle('on',b.dataset.id===id)});
    var y=detail.getBoundingClientRect().top+window.pageYOffset-90;
    window.scrollTo({top:y,behavior:'smooth'});
  }

  grid.addEventListener('click',function(e){var b=e.target.closest('.p');if(b)open(b.dataset.id)});
  detail.addEventListener('click',function(e){
    var b=e.target.closest('[data-order]');if(!b)return;
    if(window.setTopic)setTopic('Деталь: '+b.dataset.order);
    var f=document.getElementById('f-task');
    var z=document.getElementById('zayavka');
    if(z){window.scrollTo({top:z.getBoundingClientRect().top+window.pageYOffset-80,behavior:'smooth'});
      if(f){f.value=f.value||('Нужна деталь: '+b.dataset.order+'. ');f.focus({preventScroll:true})}}
  });

  if(q)q.addEventListener('input',function(){placeSel='';symSel='';
    [].forEach.call(document.querySelectorAll('.chip'),function(c){c.classList.remove('on')});
    render(bySearch(q.value))});

  if(places)places.addEventListener('click',function(e){
    var b=e.target.closest('.chip');if(!b)return;
    placeSel=placeSel===b.dataset.place?'':b.dataset.place;
    [].forEach.call(places.querySelectorAll('.chip'),function(c){c.classList.toggle('on',c.dataset.place===placeSel)});
    render(placeSel?PARTS.filter(function(p){return p.place.indexOf(placeSel)>=0}):PARTS.slice());
  });

  if(syms)syms.addEventListener('click',function(e){
    var b=e.target.closest('.chip');if(!b)return;
    symSel=symSel===b.dataset.sym?'':b.dataset.sym;
    [].forEach.call(syms.querySelectorAll('.chip'),function(c){c.classList.toggle('on',c.dataset.sym===symSel)});
    if(!symSel){render(PARTS.slice());return}
    var list=PARTS.filter(function(p){return p.symptoms.indexOf(symSel)>=0});
    render(list); if(list.length===1)setTimeout(function(){open(list[0].id)},260);
  });

  [].forEach.call(document.querySelectorAll('.tab'),function(t){
    t.addEventListener('click',function(){
      [].forEach.call(document.querySelectorAll('.tab'),function(x){x.classList.remove('on')});
      [].forEach.call(document.querySelectorAll('.panel'),function(x){x.classList.remove('on')});
      t.classList.add('on');document.getElementById(t.dataset.panel).classList.add('on');
    });
  });

  render(PARTS.slice());
})();
