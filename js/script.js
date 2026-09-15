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

/* REVEAL AO ROLAR A PÁGINA (anima uma vez, sem repetir a cada scroll) */
const reveals = document.querySelectorAll(".reveal");

if (reveals.length && "IntersectionObserver" in window) {

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }

    });

  }, {
    threshold: 0.15
  });

  reveals.forEach(element => observer.observe(element));

}

/* MICROINTERAÇÃO PREMIUM — leve resposta dos cards de
   "Como trabalho" à posição do mouse (poucos graus de
   rotação). Só roda em dispositivos com mouse fino e quando
   o usuário não pediu menos movimento; em touch/mobile ou
   com prefers-reduced-motion o efeito simplesmente não é
   ativado e os cards seguem no visual estático normal. */
const canHoverPrecisely = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canHoverPrecisely && !prefersReducedMotion) {

  const MAX_TILT = 4; // graus — intencionalmente pequeno

  document.querySelectorAll(".case-card").forEach(card => {

    let rect = null;

    card.addEventListener("mouseenter", () => {
      rect = card.getBoundingClientRect();
      card.style.transition = "transform 0.15s ease";
    });

    card.addEventListener("mousemove", (event) => {
      if (!rect) rect = card.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * MAX_TILT * 2;
      const rotateX = (0.5 - y) * MAX_TILT * 2;

      card.style.transform =
        `perspective(700px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform 0.35s ease";
      card.style.transform = "";
      rect = null;
    });

  });

}
