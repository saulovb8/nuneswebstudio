/* =========================================================
   BLOCO 9 — SISTEMA CINEMATOGRÁFICO 3D (GSAP + ScrollTrigger)

   Este arquivo é 100% aditivo e progressivo:
   - Se o GSAP/ScrollTrigger não carregarem (CDN indisponível),
     nada aqui executa e o site permanece exatamente como está
     sem este arquivo — o sistema de reveal em CSS (js/script.js)
     já é reversível e acessível por conta própria.
   - Se "prefers-reduced-motion: reduce" estiver ativo, este
     arquivo inteiro não executa: paralaxe, tilt 3D por mouse,
     scrub de scroll e blur-reveal são todos desligados, e o site
     usa só o reveal simples (fade/translate) já preparado para
     isso em style.css.
   - Reutiliza `canHoverPrecisely`, `prefersReducedMotion` e
     `heroSection`, já declarados em js/script.js (carregado antes
     deste arquivo, mesmo escopo global de scripts clássicos).

   Nada de conteúdo (textos, preços, links, foto) é alterado por
   este arquivo — apenas elementos decorativos (aria-hidden) são
   criados, e títulos existentes são envolvidos em spans para a
   animação "split-line", sem mudar uma palavra do texto.
========================================================= */

(function () {

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (typeof prefersReducedMotion !== "undefined" && prefersReducedMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  var hoverCapable = typeof canHoverPrecisely !== "undefined" ? canHoverPrecisely : false;
  var isMobile = window.matchMedia("(max-width: 700px)").matches;

  /* ---------------------------------------------------------
     9.1 — SPLIT-LINE REVEAL
     Quebra o título pelas mesmas quebras de linha (<br>) que o
     autor já definiu no HTML — nenhuma palavra muda, só a forma
     como cada linha entra na tela. Cada linha vira um par de
     spans (máscara + conteúdo) para o efeito "brota de trás de
     uma linha invisível".
  --------------------------------------------------------- */

  function splitHeadingLines(heading) {
    if (!heading || heading.dataset.splitDone) {
      return heading ? heading.querySelectorAll(".split-line-inner") : [];
    }

    var lines = heading.innerHTML
      .split(/<br\s*\/?>/i)
      .map(function (part) { return part.trim(); })
      .filter(Boolean);

    heading.innerHTML = lines
      .map(function (line) {
        return '<span class="split-line"><span class="split-line-inner">' + line + "</span></span>";
      })
      .join("");

    heading.dataset.splitDone = "true";
    return heading.querySelectorAll(".split-line-inner");
  }

  // Título do Hero: já está na tela ao carregar — entra sozinho, sem scroll.
  var heroH1 = document.querySelector(".hero-text h1");
  if (heroH1) {
    var heroLines = splitHeadingLines(heroH1);
    gsap.set(heroLines, { yPercent: 115, opacity: 0, filter: "blur(10px)" });
    gsap.to(heroLines, {
      yPercent: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.05,
      ease: "power4.out",
      stagger: 0.12,
      delay: 0.25
    });
  }

  // Títulos de cada seção: entram (e voltam) conforme o scroll.
  var sectionHeadings = document.querySelectorAll(
    ".about-title h2, .services-title h2, .process-title h2, .cases-title h2, .pricing-title h2, .guide-title h2, .faq-title h2, .cta-title h2"
  );

  sectionHeadings.forEach(function (heading) {
    var lines = splitHeadingLines(heading);
    gsap.set(lines, { yPercent: 115, opacity: 0, filter: "blur(8px)" });
    gsap.to(lines, {
      yPercent: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.85,
      ease: "power4.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: heading,
        start: "top 88%",
        end: "top 45%",
        toggleActions: "play reverse play reverse"
      }
    });
  });

  /* ---------------------------------------------------------
     9.2 — SCROLL-LINKED OPACITY + BLUR REVEAL
     Aplicado de forma seletiva (não em tudo): parágrafos do
     "Sobre mim" e o texto de apoio do "Processo" — a seção que
     precisava de reforço. Ligado diretamente à posição do
     scroll (scrub), não a um gatilho único: sobe e desce com o
     usuário.
  --------------------------------------------------------- */

  function scrubTextReveal(selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      gsap.fromTo(
        el,
        { opacity: 0.25, filter: "blur(7px)", y: 28 },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            end: "top 48%",
            scrub: 0.6
          }
        }
      );
    });
  }

  scrubTextReveal(".about-text p");
  scrubTextReveal(".process-title p");
  scrubTextReveal(".pricing-title p");
  scrubTextReveal(".cta-title p");

  /* ---------------------------------------------------------
     9.3 — PARALLAX DE FUNDO COM VELOCIDADES DIFERENTES
     Elementos decorativos de cada seção (linhas, cantos, glows)
     se deslocam em velocidades distintas conforme o scroll —
     sensação real de profundidade, não só opacidade.
  --------------------------------------------------------- */

  if (!isMobile) {
    var parallaxTargets = [
      { selector: ".deco-line-1", speed: 60 },
      { selector: ".deco-line-2", speed: -50 },
      { selector: ".tech-glow-services", speed: 40 },
      { selector: ".tech-glow-cases", speed: -35 },
      { selector: ".tech-glow-pricing", speed: 45 },
      { selector: ".deco-corner-tr", speed: -25 },
      { selector: ".deco-corner-bl", speed: 25 },
      { selector: ".closing-glow", speed: 30 },
      { selector: ".closing-line-1", speed: -20 },
      { selector: ".closing-line-2", speed: 20 },
      { selector: ".cta-glow", speed: 30 },
      { selector: ".cta-line-1", speed: -20 },
      { selector: ".cta-line-2", speed: 20 }
    ];

    parallaxTargets.forEach(function (target) {
      document.querySelectorAll(target.selector).forEach(function (el) {
        var section = el.closest("section");
        if (!section) return;

        gsap.to(el, {
          y: target.speed,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8
          }
        });
      });
    });
  }

  /* ---------------------------------------------------------
     9.4 — LINHA VIAJANTE ENTRE SEÇÕES
     Uma linha fina e discreta, fixa na lateral da tela, que
     "desenha" conforme o usuário rola a página inteira — reforça
     a sensação de continuidade entre Hero → Serviços → Processo
     → Diferenciais → Preços → CTA → Rodapé.
  --------------------------------------------------------- */

  var travelLine = document.getElementById("cinematic-travel-line");
  if (travelLine && !isMobile) {
    var path = travelLine.querySelector("line");
    var length = 1000;
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3
      }
    });
  }

  /* ---------------------------------------------------------
     9.5 — HERO: paralaxe 3D por mouse, com lerp (interpolação)
     Move foto, texto, título e camadas decorativas do Hero em
     profundidades diferentes, suavizado por interpolação (lerp)
     via requestAnimationFrame — não por saltos instantâneos.
     Usa as mesmas variáveis --hx/--hy já consumidas em style.css
     (BLOCO 8) via `translate`/`rotate` independentes de
     `transform`, para nunca disputar com as animações de entrada
     do Hero (que usam `transform`).
  --------------------------------------------------------- */

  if (heroSection && hoverCapable) {

    var targetX = 0, targetY = 0, currentX = 0, currentY = 0, raf = null;

    var lerp = function (a, b, n) { return a + (b - a) * n; };

    var tick = function () {
      currentX = lerp(currentX, targetX, 0.09);
      currentY = lerp(currentY, targetY, 0.09);

      heroSection.style.setProperty("--hx", currentX.toFixed(3));
      heroSection.style.setProperty("--hy", currentY.toFixed(3));

      if (Math.abs(currentX - targetX) > 0.001 || Math.abs(currentY - targetY) > 0.001) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    };

    var requestTick = function () {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    heroSection.addEventListener("mousemove", function (event) {
      var rect = heroSection.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      requestTick();
    }, { passive: true });

    heroSection.addEventListener("mouseleave", function () {
      targetX = 0;
      targetY = 0;
      requestTick();
    });
  }

  /* ---------------------------------------------------------
     9.6 — SISTEMA 3D REUTILIZÁVEL PARA CARDS (.tilt-3d)
     Qualquer card presente ou futuro só precisa da classe
     "tilt-3d" para ganhar: inclinação 3D suavizada (GSAP
     quickTo — interpolação, não salto), profundidade (translateZ
     via GSAP "z"), luz que acompanha o cursor (reaproveita as
     variáveis --mx/--my/--spot-o já usadas em style.css) e
     resposta de "pressão" ao clicar. Ao sair do card, o GSAP
     devolve a elevação/tilt a zero suavemente; o hover/estilo
     estático em CSS (borda, sombra) continua funcionando normal.
  --------------------------------------------------------- */

  if (hoverCapable) {

    var tiltCards = document.querySelectorAll(".tilt-3d");

    tiltCards.forEach(function (card) {
      var maxTilt = parseFloat(card.dataset.tilt) || 8;
      var depth = parseFloat(card.dataset.depth) || 26;
      var hovering = false;
      var pressed = false;
      var rect = null;

      gsap.set(card, { transformPerspective: 800 });

      var setRX = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" });
      var setRY = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" });
      var setY = gsap.quickTo(card, "y", { duration: 0.5, ease: "power3.out" });
      var setZ = gsap.quickTo(card, "z", { duration: 0.5, ease: "power3.out" });

      card.addEventListener("mouseenter", function () {
        hovering = true;
        rect = card.getBoundingClientRect();
        card.style.setProperty("--spot-o", "1");
      });

      card.addEventListener("mousemove", function (event) {
        if (!hovering) return;
        if (!rect) rect = card.getBoundingClientRect();

        var px = (event.clientX - rect.left) / rect.width - 0.5;
        var py = (event.clientY - rect.top) / rect.height - 0.5;

        setRY(px * maxTilt * 2);
        setRX(py * -maxTilt * 2);
        setY(-10);
        if (!pressed) setZ(depth);

        card.style.setProperty("--mx", ((px + 0.5) * 100).toFixed(1) + "%");
        card.style.setProperty("--my", ((py + 0.5) * 100).toFixed(1) + "%");
      });

      card.addEventListener("mouseleave", function () {
        hovering = false;
        pressed = false;
        rect = null;
        setRX(0);
        setRY(0);
        setY(0);
        setZ(0);
        gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });
        card.style.setProperty("--spot-o", "0");
      });

      /* Pressão ao clicar: o card "afunda" no mousedown e volta
         com uma pequena elevação de mola no mouseup. */
      card.addEventListener("mousedown", function () {
        pressed = true;
        gsap.to(card, {
          scale: 0.97,
          z: depth * 0.25,
          duration: 0.15,
          ease: "power2.out",
          overwrite: "auto"
        });
      });

      var release = function () {
        if (!pressed) return;
        pressed = false;
        gsap.to(card, {
          scale: 1.015,
          z: depth * 1.15,
          duration: 0.18,
          ease: "back.out(2.5)",
          overwrite: "auto",
          onComplete: function () {
            gsap.to(card, {
              scale: 1,
              z: hovering ? depth : 0,
              duration: 0.35,
              ease: "power2.out"
            });
          }
        });
      };

      card.addEventListener("mouseup", release);
    });
  }

  /* ---------------------------------------------------------
     9.7 — Recalcula as posições do ScrollTrigger depois que
     fontes/imagens terminam de carregar (evita gatilhos com
     medidas desatualizadas).
  --------------------------------------------------------- */

  window.addEventListener("load", function () {
    ScrollTrigger.refresh();
  });

})();
