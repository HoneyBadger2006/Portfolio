const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId);
  const nav = document.getElementById(navId);

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("show");
    });
  }
};

showMenu("nav-toggle", "nav-menu");

// GSAP overlay
gsap.to(".first", 1.5, { delay: 0.5, top: "-100%", ease: Expo.easeInOut });
gsap.to(".second", 1.5, { delay: 0.7, top: "-100%", ease: Expo.easeInOut });
gsap.to(".third", 1.5, { delay: 0.9, top: "-100%", ease: Expo.easeInOut });

gsap.from(".home__img", { opacity: 0, duration: 2, delay: 2, x: 60 });
gsap.from(".home__information", { opacity: 0, duration: 3, delay: 2.3, y: 25 });
gsap.from(".anime-text", { opacity: 0, duration: 3, delay: 2.3, y: 25, ease: "expo.out", stagger: 0.3 });

gsap.from(".nav__logo", { opacity: 0, duration: 3, delay: 3.2, y: 25, ease: "expo.out" });
gsap.from(".nav__item", { opacity: 0, duration: 3, delay: 3.2, y: 25, ease: "expo.out", stagger: 0.2 });

gsap.from(".home__social-icon", { opacity: 0, duration: 3, delay: 4, y: 25, ease: "expo.out", stagger: 0.2 });

gsap.registerPlugin(ScrollTrigger);

gsap.from(".about__img", { scrollTrigger: { trigger: "#about", start: "top 80%" }, opacity: 0, x: -50, duration: 1.3, ease: "expo.out" });
gsap.from(".about__subtitle", { scrollTrigger: { trigger: "#about", start: "top 80%" }, opacity: 0, y: 30, duration: 1.2, delay: 0.15, ease: "expo.out" });
gsap.from(".about__text", { scrollTrigger: { trigger: "#about", start: "top 80%" }, opacity: 0, y: 30, duration: 1.2, stagger: 0.15, delay: 0.25, ease: "expo.out" });
gsap.from("#projects", { scrollTrigger: { trigger: "#projects", start: "top 80%" }, opacity: 0, y: 50, duration: 1.2 });
gsap.from("#contact", { scrollTrigger: { trigger: "#contact", start: "top 80%" }, opacity: 0, y: 50, duration: 1.2 });