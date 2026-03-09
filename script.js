(() => {
  const TOTAL = 6;

  const state = {
    seals: {
      foot:false,
      english:false,
      venus:false,
      oksana:false,
      carlisle:false,
      kentucky:false
    },
    musicOn: false
  };

  const el = {
    caseId: document.getElementById('caseId'),
    sealCount: document.getElementById('sealCount'),
    pct: document.getElementById('pct'),
    bar: document.getElementById('bar'),
    mainStamp: document.getElementById('mainStamp'),
    finalBtn: document.getElementById('finalBtn'),
    finalStamp: document.getElementById('finalStamp'),

    toasts: document.getElementById('toasts'),

    englishReveal: document.getElementById('englishReveal'),
    carlisleReveal: document.getElementById('carlisleReveal'),

    oksanaOverlay: document.getElementById('oksanaOverlay'),
    finalOverlay: document.getElementById('finalOverlay'),

    openInBrowserOverlay: document.getElementById('openInBrowserOverlay'),
    closeOpenInBrowserOverlay: document.getElementById('closeOpenInBrowserOverlay'),

    bgMusic: document.getElementById('bgMusic'),
    musicToggleBtn: document.getElementById('musicToggleBtn')
  };

  function randId(){
    const A="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const B="0123456789";
    let out="KT-";
    out += A[Math.floor(Math.random()*A.length)];
    out += A[Math.floor(Math.random()*A.length)];
    out += "-";
    for(let i=0;i<4;i++) out += B[Math.floor(Math.random()*B.length)];
    return out;
  }

  function toast(title, msg, tag=""){
    const t = document.createElement('div');
    t.className = 'toast';
    const badge = tag ? ` <span class="mono" style="color:var(--muted)">[${tag}]</span>` : "";
    t.innerHTML = `
      <b>${title}${badge}</b>
      <div style="color:var(--muted)">${msg}</div>
      <div class="row">
        <div class="mono" style="color:var(--muted)">${new Date().toLocaleTimeString().slice(0,5)}</div>
        <button class="x">OK</button>
      </div>
    `;
    t.querySelector('button.x').onclick = () => t.remove();
    el.toasts.appendChild(t);
    setTimeout(() => { if(t.isConnected) t.remove(); }, 7000);
  }

  function launchConfetti(bursts = 1, piecesPerBurst = 120){
    const colors = ['#ff4fd8','#3cf4ff','#ffd34d','#8b5cff','#ffffff'];
    for(let b = 0; b < bursts; b++){
      setTimeout(() => {
        for(let i=0;i<piecesPerBurst;i++){
          const p = document.createElement('div');
          p.className = 'confetti-piece';
          const x = Math.random() * 100;
          const delay = Math.random() * 0.5;
          p.style.setProperty('--x', x + 'vw');
          p.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
          p.style.animationDelay = delay + 's';
          document.body.appendChild(p);
          setTimeout(() => { if(p.isConnected) p.remove(); }, 4000 + delay*1000);
        }
      }, b * 500);
    }
  }

  function setSeal(key){
    if(state.seals[key]) return;

    state.seals[key] = true;

    const stampEl = document.getElementById(`seal-${key}`);
    if(stampEl) stampEl.style.display = "inline-flex";

    updateProgress();
    launchConfetti(1, 70);
  }

  function updateProgress(){
    const got = Object.values(state.seals).filter(Boolean).length;
    el.sealCount.textContent = String(got);

    const pct = Math.round((got / TOTAL) * 100);
    el.pct.textContent = pct + "%";
    el.bar.style.width = pct + "%";

    if(got >= 1){
      el.mainStamp.className = "stamp warn";
      el.mainStamp.textContent = "В ПРОЦЕССЕ";
    }
    if(got === TOTAL){
      el.mainStamp.className = "stamp";
      el.mainStamp.textContent = "УТВЕРЖДЕНО";
      el.finalBtn.disabled = false;
      el.finalStamp.className = "stamp";
      el.finalStamp.textContent = "ДОСТУП ОТКРЫТ";
      toast("Система", "Все печати собраны. Итоговый сертификат доступен внизу.", "ГОТОВО");
      launchConfetti(3, 150);
    } else {
      el.finalBtn.disabled = true;
      el.finalStamp.className = "stamp warn";
      el.finalStamp.textContent = "ЗАКРЫТО";
    }
  }

  function openOksana(){
    el.oksanaOverlay.classList.add('show');
    setSeal('oksana');
  }
  function closeOksana(){
    el.oksanaOverlay.classList.remove('show');
  }

  function openFinal(){
    if(el.finalBtn.disabled){
      toast("Сертификат недоступен", "Собери 6/6 печатей, чтобы получить итоговый документ.", "ВНИМАНИЕ");
      return;
    }
    el.finalOverlay.classList.add('show');
    launchConfetti(3, 160);
    if (el.bgMusic && !state.musicOn) {
      toggleMusic(true);
    }
  }
  function closeFinal(){
    el.finalOverlay.classList.remove('show');
  }

  function toggleMusic(forceOn){
    if(!el.bgMusic) return;

    const shouldTurnOn = typeof forceOn === 'boolean' ? forceOn : !state.musicOn;

    if(shouldTurnOn){
      el.bgMusic.volume = 0.85;
      el.bgMusic.play().then(() => {
        state.musicOn = true;
        if(el.musicToggleBtn){
          el.musicToggleBtn.textContent = "Поставить космо-музыку на паузу";
        }
        toast("Музыка", "Космо-саундтрек запущен.", "AUDIO");
      }).catch(() => {
        toast("Музыка", "Нажми ещё раз, браузер не дал автозапуск.", "AUDIO");
      });
    } else {
      el.bgMusic.pause();
      state.musicOn = false;
      if(el.musicToggleBtn){
        el.musicToggleBtn.textContent = "Включить космо-музыку";
      }
      toast("Музыка", "Космо-саундтрек поставлен на паузу.", "AUDIO");
    }
  }

  function handle(action){
    switch(action){
      case "footComp":
        toast("Компенсация", "Компенсация начислена: разрешение периодически подъебывать выдано.", "ПЯТКА");
        setSeal('foot');
        break;

      case "english":
        el.englishReveal.style.display = "block";
        toast("Лингвистический отдел", "Протокол выполнен. Перевод доставлен.", "EN");
        setSeal('english');
        break;

      case "venusSeal":
        toast("Межпланетарный масштаб", "Явление зафиксировано. Печать поставлена.", "ВЕНЕРА");
        setSeal('venus');
        break;

      case "kentuckySeal":
        toast("Кентукки-услуга", "Печать поставлена. КЕНТУККИ оказано.", "КЕНТУККИ");
        setSeal('kentucky');
        break;

      case "carlisle":
        el.carlisleReveal.style.display = "block";
        toast("Отдел Каллена", "Проверка завершена: 100%.", "КАРЛАЙЛ");
        setSeal('carlisle');
        break;

      case "dontpress":
        toast("ВНИМАНИЕ", "Запуск протокола…", "НЕ НАЖИМАТЬ");
        openOksana();
        break;

      case "closeOksana":
        closeOksana();
        break;

      case "final":
        openFinal();
        break;

      case "closeFinal":
        closeFinal();
        break;

      case "hug":
        toast("Обнимашка", "Обнимашка отправлена. Доставка: при первой встрече.", "💛");
        launchConfetti(2, 120);
        break;

      case "musicToggle":
        toggleMusic();
        break;

      default:
        toast("Система", "Неизвестная команда. Но Котя всё равно лучшая.", "INFO");
    }
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if(!btn) return;
    handle(btn.getAttribute('data-action'));
  });

  document.addEventListener('keydown', (e) => {
    if(e.key === "Escape"){
      closeOksana();
      closeFinal();
    }
  });

  function isInAppBrowser() {
    const ua = navigator.userAgent || "";
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const hints = ["FBAN","FBAV","Instagram","Line","Twitter","TikTok","Telegram","Snapchat","WhatsApp"];
    const hasHint = hints.some(h => ua.includes(h));
    const isLikelyIOSWebView = isIOS && !ua.includes("Safari");
    const isAndroidWebView = isAndroid && ua.includes("wv");
    return hasHint || isLikelyIOSWebView || isAndroidWebView;
  }

  el.caseId.textContent = randId();
  toast("ЕГПУ", "Портал загружен. Собери 6 печатей — кнопка сертификата внизу сайта.", "СТАРТ");
  updateProgress();
  launchConfetti(1, 120);

  if (el.openInBrowserOverlay && isInAppBrowser()) {
    el.openInBrowserOverlay.style.display = "flex";
  }
  if (el.closeOpenInBrowserOverlay && el.openInBrowserOverlay) {
    el.closeOpenInBrowserOverlay.addEventListener("click", () => {
      el.openInBrowserOverlay.style.display = "none";
    });
  }
})();

