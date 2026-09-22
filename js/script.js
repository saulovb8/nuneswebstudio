/* ACORDEÃO — ENTENDA CADA SERVIÇO (abre um item por vez) */
const guideQuestions = document.querySelectorAll(".guide-question");

guideQuestions.forEach(question => {

  question.addEventListener("click", () => {

    const item = question.parentElement;
    const isActive = item.classList.contains("active");

    document.querySelectorAll(".guide-item").forEach(el => {
      el.classList.remove("active");
      el.querySelector(".guide-question").setAttribute("aria-expanded", "false");
      el.querySelector(".guide-question span[aria-hidden]").textContent = "+";
    });

    if (!isActive) {
      item.classList.add("active");
      question.setAttribute("aria-expanded", "true");
      question.querySelector("span[aria-hidden]").textContent = "−";
    }

  });

});

/* ACORDEÃO — FAQ (cada item abre/fecha de forma independente) */
document.querySelectorAll(".faq-question").forEach(button => {

  button.addEventListener("click", () => {

    const item = button.parentElement;
    const isActive = item.classList.toggle("active");

    button.setAttribute("aria-expanded", isActive ? "true" : "false");

  });

});

/* REVEAL AO ROLAR A PÁGINA — agora REVERSÍVEL: ao descer, a
   seção/elemento entra (classe "active"); ao subir e sair da
   tela, a classe é removida e a mesma animação CSS volta para
   trás. Sem unobserve(): o observer continua respondendo ao
   scroll indefinidamente, como pedido. */
const reveals = document.querySelectorAll(".reveal");

if (reveals.length && "IntersectionObserver" in window) {

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {
      entry.target.classList.toggle("active", entry.isIntersecting);
    });

  }, {
    threshold: 0.15
  });

  reveals.forEach(element => observer.observe(element));

}

/* MICROINTERAÇÃO PREMIUM — leve resposta dos cards à posição
   do mouse. Só roda em dispositivos com mouse fino e quando
   o usuário não pediu menos movimento; em touch/mobile ou
   com prefers-reduced-motion o efeito simplesmente não é
   ativado e os cards seguem no visual estático normal. */
const canHoverPrecisely = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* O tilt 3D dos cards (com luz, profundidade interna e resposta
   a clique) e o parallax 3D do Hero por mouse agora vivem em
   js/cinematic.js (BLOCO 9), com GSAP — substituem o que estava
   aqui antes, com o mesmo espírito (rotate/translate independentes
   de transform, mesmas guardas de dispositivo/reduced-motion). */

/* BLOCO 5 — leve parallax de scroll na atmosfera do Hero.
   Só a camada decorativa (.hero-atmosphere) se move; texto,
   foto e CTAs do Hero permanecem exatamente como estão.
   Listener passivo + throttle por requestAnimationFrame, e
   desativado por completo com prefers-reduced-motion. */
const heroSection = document.querySelector(".hero");

if (heroSection && !prefersReducedMotion) {

  let heroParallaxTicking = false;

  const updateHeroParallax = () => {
    const rect = heroSection.getBoundingClientRect();
    const progress = Math.min(Math.max(-rect.top / (rect.height || 1), 0), 1);

    heroSection.style.setProperty("--scroll-progress", progress.toFixed(3));
    heroParallaxTicking = false;
  };

  window.addEventListener("scroll", () => {
    if (!heroParallaxTicking) {
      requestAnimationFrame(updateHeroParallax);
      heroParallaxTicking = true;
    }
  }, { passive: true });

  updateHeroParallax();

}

/* BLOCO 6 — linha de progresso do Processo, "desenhada"
   conforme o usuário rola a seção. Mesmo padrão passivo +
   rAF-throttle do parallax do Hero acima; desativado por
   completo com prefers-reduced-motion (a versão estática
   correspondente fica só no CSS). */
const processTimeline = document.querySelector(".process-timeline");

if (processTimeline && !prefersReducedMotion) {

  let processTicking = false;

  const updateProcessProgress = () => {
    const rect = processTimeline.getBoundingClientRect();
    const viewportH = window.innerHeight || document.documentElement.clientHeight;

    const progress = Math.min(Math.max((viewportH - rect.top) / (rect.height + viewportH), 0), 1);

    processTimeline.style.setProperty("--process-progress", (progress * 100).toFixed(1));
    processTicking = false;
  };

  window.addEventListener("scroll", () => {
    if (!processTicking) {
      requestAnimationFrame(updateProcessProgress);
      processTicking = true;
    }
  }, { passive: true });

  updateProcessProgress();

}

/* NAVEGAÇÃO — estado "premium" do header ao rolar (vidro dourado
   sutil, ver .header.is-scrolled em style.css). Mesmo padrão
   passivo + rAF-throttle usado acima. */
const header = document.querySelector(".header");

if (header) {

  let headerTicking = false;

  const updateHeaderState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
    headerTicking = false;
  };

  window.addEventListener("scroll", () => {
    if (!headerTicking) {
      requestAnimationFrame(updateHeaderState);
      headerTicking = true;
    }
  }, { passive: true });

  updateHeaderState();

}

/* NAVEGAÇÃO — indicador dourado do item ativo, acompanhando a
   seção visível durante o scroll (para cima ou para baixo). O
   clique continua sendo um link comum (#id): o scroll suave até
   a seção vem do "scroll-behavior: smooth" em style.css. */
const navLinks = document.querySelectorAll(".nav a[href^='#']");

if (navLinks.length && "IntersectionObserver" in window) {

  const sectionByLink = new Map();

  navLinks.forEach(link => {
    const section = document.getElementById(link.getAttribute("href").slice(1));
    if (section) sectionByLink.set(section, link);
  });

  const setActiveLink = (activeLink) => {
    navLinks.forEach(link => link.classList.toggle("active", link === activeLink));
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const link = sectionByLink.get(entry.target);
      if (link) setActiveLink(link);
    });
  }, {
    // Considera "atual" a seção que ocupa a faixa central da tela,
    // não a que apenas encosta na borda — evita trocar o indicador
    // cedo demais ao entrar numa seção.
    rootMargin: "-45% 0px -50% 0px",
    threshold: 0
  });

  sectionByLink.forEach((link, section) => navObserver.observe(section));

}
