const box = document.querySelector(".premium-box");
const glow = document.querySelector(".border-glow");

if (box && glow) {

    let animation;

    box.addEventListener("mouseenter", () => {

        glow.style.opacity = "1";

        animation = glow.animate([
            { left: "0px", top: "0px" },
            { left: "calc(100% - 10px)", top: "0px" },
            { left: "calc(100% - 10px)", top: "calc(100% - 10px)" },
            { left: "0px", top: "calc(100% - 10px)" },
            { left: "0px", top: "0px" }
        ], {
            duration: 2800,
            iterations: Infinity,
            easing: "linear"
        });

    });

    box.addEventListener("mouseleave", () => {

        if (animation) {
            animation.cancel();
        }

        glow.style.opacity = "0";

    });

}