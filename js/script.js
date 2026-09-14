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
