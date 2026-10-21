(() => {
  const measurementId = 'G-FQR29TMFPL';
  const choiceKey = 'calculapiso-analytics-choice';
  let loaded = false;
  let memoryChoice = null;

  function savedChoice() {
    try { return localStorage.getItem(choiceKey) || memoryChoice; } catch { return memoryChoice; }
  }
  function saveChoice(choice) {
    memoryChoice = choice;
    try { localStorage.setItem(choiceKey, choice); } catch { /* Choice lasts for this page only. */ }
  }
  function consentState(analytics) {
    return {
      analytics_storage: analytics,
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    };
  }
  function loadAnalytics() {
    if (loaded) {
      window.gtag('consent', 'update', consentState('granted'));
      return;
    }
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', consentState('denied'));
    window.gtag('consent', 'update', consentState('granted'));
    window.gtag('js', new Date());
    window.gtag('config', measurementId);
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.append(script);
  }

  const banner = document.createElement('section');
  banner.className = 'analytics-choice';
  banner.setAttribute('aria-label', 'Escolha de análise de visitas');
  banner.innerHTML = '<div><strong>Podemos medir as visitas?</strong><p>Com sua permissão, usamos Google Analytics para entender quais páginas ajudam mais. Seus números da calculadora não são enviados. <a href="/privacidade">Saiba mais</a>.</p></div><div class="analytics-choice-actions"><button type="button" data-choice="denied">Recusar</button><button type="button" data-choice="granted">Aceitar análise</button></div>';
  document.body.append(banner);

  function showChoice() { banner.hidden = false; }
  function choose(choice) {
    saveChoice(choice);
    banner.hidden = true;
    if (choice === 'granted') loadAnalytics();
    else if (loaded) window.gtag('consent', 'update', consentState('denied'));
  }
  banner.addEventListener('click', event => {
    const button = event.target.closest('button[data-choice]');
    if (button) choose(button.dataset.choice);
  });
  const footer = document.querySelector('.footer-bottom') || document.querySelector('.site-footer');
  if (footer) {
    const settings = document.createElement('button');
    settings.type = 'button';
    settings.className = 'privacy-settings';
    settings.textContent = 'Preferências de análise';
    settings.addEventListener('click', showChoice);
    footer.append(settings);
  }
  const choice = savedChoice();
  banner.hidden = choice === 'granted' || choice === 'denied';
  if (choice === 'granted') loadAnalytics();

  window.trackCalculatorUse = tool => {
    if (savedChoice() === 'granted' && loaded) window.gtag('event', 'calculator_use', { tool_name: tool });
  };
})();
