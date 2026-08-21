/* Мастерская Архангельское — общий скрипт */
var WA='https://wa.me/79851982945', TG='https://t.me/elenaisanewleet', TEL='+79851982945';
var BOT='https://t.me/detal_zakaz_bot'; /* бот для заявок; пока не заведён — заявки идут в личный Telegram */
var BOT_READY=false;   /* поставьте true, когда бот заработает */
var MAIL=''; /* впишите адрес почты — кнопка «Почта» появится сама, например MAIL='zakaz@example.ru' */

function fval(id){var e=document.getElementById(id);return e&&e.value.trim()?e.value.trim():'—'}
/* номер обращения: 73-XXXX, живёт в браузере, чтобы клиент и оператор говорили об одной заявке */
function orderNo(){
  var n=sessionStorage.getItem('zayavkaNo');
  if(!n){n='73-'+String(1000+Math.floor(Math.random()*9000));sessionStorage.setItem('zayavkaNo',n)}
  return n;
}
function letter(){
  var t=(document.getElementById('f-topic')||{}).value||'';
  return 'Заявка '+orderNo()+(t?' · '+t:'')+'\nИмя: '+fval('f-name')+'\nСвязь: '+fval('f-contact')+'\nЗадача: '+fval('f-task');
}
/* подтверждение с номером — показывается после отправки */
function showNo(where){
  var host=document.getElementById('zayavka');if(!host)return;
  var box=document.getElementById('okbox');
  if(!box){box=document.createElement('div');box.className='okbox';box.id='okbox';
    var pane=host.querySelector('.pane');pane.appendChild(box)}
  box.innerHTML='<span class="eyebrow">Номер вашей заявки</span><span class="okno">'+orderNo()+'</span>'+
    '<p>Заявка открыта в '+where+'. Отправьте сообщение — мы ответим на него. Если продолжите разговор позже, назовите этот номер: по нему найдём вашу задачу.</p>';
}
function sendTo(kind){
  var t=letter();
  if(kind==='wa'){window.open(WA+'?text='+encodeURIComponent(t),'_blank');showNo('WhatsApp')}
  if(kind==='tg'){
    try{navigator.clipboard.writeText(t)}catch(e){}
    window.open(BOT_READY?BOT:TG,'_blank');
    showNo('Telegram — текст заявки скопирован, вставьте его в чат');
  }
  if(kind==='tel'){location.href='tel:'+TEL;showNo('звонке')}
  if(kind==='mail'){location.href='mailto:'+MAIL+'?subject='+encodeURIComponent('Заявка '+orderNo())+'&body='+encodeURIComponent(t);showNo('почте')}
}
document.addEventListener('click',function(e){
  var b=e.target.closest?e.target.closest('[data-send]'):null;
  if(b){e.preventDefault();sendTo(b.getAttribute('data-send'))}
});

/* тема заявки из карточки станка / услуги */
function setTopic(v){var e=document.getElementById('f-topic');if(e)e.value=v;
  var ta=document.getElementById('f-task');if(ta&&!ta.value)ta.placeholder='Например: '+v.toLowerCase()+' — опишите деталь и количество';}

/* ---- голосовое сообщение ---- */
(function(){
  var btn=document.getElementById('rec');if(!btn)return;
  var time=document.getElementById('rtime'),play=document.getElementById('rplay'),
      dl=document.getElementById('rdl'),hint=document.getElementById('rhint');
  if(!navigator.mediaDevices||!window.MediaRecorder){
    btn.disabled=true;btn.style.opacity=.45;
    hint.textContent='Запись голоса не поддерживается этим браузером — надиктуйте сообщение прямо в WhatsApp или Telegram.';
    return;
  }
  var mr,chunks=[],t0,tick,stream;
  function fmt(s){return Math.floor(s/60)+':'+('0'+(s%60)).slice(-2)}
  btn.addEventListener('click',async function(){
    if(mr&&mr.state==='recording'){mr.stop();return}
    try{stream=await navigator.mediaDevices.getUserMedia({audio:true})}
    catch(err){hint.textContent='Микрофон недоступен: разрешите запись в настройках браузера или надиктуйте сообщение в мессенджере.';return}
    chunks=[];mr=new MediaRecorder(stream);
    mr.ondataavailable=function(e){if(e.data.size)chunks.push(e.data)};
    mr.onstop=function(){
      clearInterval(tick);stream.getTracks().forEach(function(t){t.stop()});
      var blob=new Blob(chunks,{type:mr.mimeType||'audio/webm'}),url=URL.createObjectURL(blob);
      play.src=url;play.hidden=false;dl.href=url;dl.hidden=false;
      dl.download='zayavka-'+new Date().toISOString().slice(0,10)+'.webm';
      btn.classList.remove('rec');btn.innerHTML='<span class="dot" style="background:currentColor"></span>Записать заново';
      hint.textContent='Готово. Сохраните файл и прикрепите его в WhatsApp или Telegram — так мы услышим задачу вашими словами.';
    };
    mr.start();t0=Date.now();btn.classList.add('rec');btn.innerHTML='<span class="dot"></span>Остановить запись';
    hint.textContent='Идёт запись. Скажите, что нужно: деталь, размеры, количество.';
    tick=setInterval(function(){
      var s=Math.round((Date.now()-t0)/1000);time.textContent=fmt(s);
      if(s>=180)mr.stop();
    },250);
  });
})();

/* ---- почта: кнопка только если адрес задан ---- */
(function(){
  var m=document.querySelectorAll('[data-send="mail"]');
  for(var i=0;i<m.length;i++) if(!MAIL) m[i].remove();
})();

/* ---- прорисовка схем станков ---- */
(function(){
  var cards=[].slice.call(document.querySelectorAll('.m'));if(!cards.length)return;
  function draw(card){
    if(card.dataset.drawn)return;card.dataset.drawn='1';
    [].slice.call(card.querySelectorAll('svg > *')).forEach(function(s,i){
      var L=0;try{L=s.getTotalLength()}catch(e){L=0}
      if(!L)return;
      s.style.strokeDasharray=L+'px';s.style.strokeDashoffset=L+'px';
      setTimeout(function(){
        s.style.transition='stroke-dashoffset .55s cubic-bezier(.4,0,.2,1), stroke .18s ease';
        s.style.strokeDashoffset='0px';
      },40+55*i);
    });
  }
  function sweep(){
    var vh=window.innerHeight||document.documentElement.clientHeight;
    cards.forEach(function(c,i){
      if(c.dataset.drawn)return;
      var r=c.getBoundingClientRect();
      if(r.top<vh*0.92&&r.bottom>0)setTimeout(function(){draw(c)},i%3*150);
    });
  }
  sweep();window.addEventListener('scroll',sweep,{passive:true});window.addEventListener('resize',sweep);
  /* приход по якорю: раскрыть и прорисовать нужный станок */
  function fromHash(){
    var id=location.hash.slice(1);if(!id)return;
    var t=document.getElementById(id);if(!t||!t.classList.contains('m'))return;
    cards.forEach(function(x){x.classList.remove('on')});
    t.classList.add('on');draw(t);
  }
  fromHash();window.addEventListener('hashchange',fromHash);
  setTimeout(function(){cards.forEach(function(c){
    [].slice.call(c.querySelectorAll('svg > *')).forEach(function(s){
      if(s.style.strokeDashoffset&&s.style.strokeDashoffset!=='0px'){s.style.strokeDasharray='';s.style.strokeDashoffset=''}
    });
  })},4000);
  cards.forEach(function(c){
    c.addEventListener('click',function(e){
      if(e.target.classList.contains('go')||e.target.parentNode.classList.contains('go')){
        var n=c.dataset.name;
        var f=document.getElementById('f-task');
        if(f){setTopic(n);document.getElementById('zayavka').scrollTop;
          var y=document.getElementById('zayavka').getBoundingClientRect().top+window.pageYOffset-80;
          window.scrollTo({top:y,behavior:'smooth'});f.focus({preventScroll:true});return}
        window.open(WA+'?text='+encodeURIComponent('Здравствуйте! Нужна работа: '+n),'_blank');return;
      }
      c.classList.toggle('on');
    });
  });
})();
