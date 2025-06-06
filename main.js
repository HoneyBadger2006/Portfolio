
/* MENU SHOW */ 
const showMenu = (toggleId, navId) =>{
  const toggle = document.getElementById(toggleId),
  nav = document.getElementById(navId)

  if(toggle && nav){
      toggle.addEventListener('click', ()=>{
          nav.classList.toggle('show')
      })
  }
}

showMenu('nav-toggle','nav-menu')

/*----- ANIMATE -----*/
// OVERLAY
gsap.to(".first", 1.5, {delay: .5, top: "-100%", ease: Expo.easeInOut});
gsap.to(".second", 1.5, {delay: .7, top: "-100%", ease: Expo.easeInOut});
gsap.to(".third", 1.5, {delay: .9, top: "-100%", ease: Expo.easeInOut});

// IMG
gsap.from('.home__img', {opacity: 0, duration: 2, delay: 2, x: 60})

// INFORMATION
gsap.from('.home__information', {opacity: 0, duration: 3, delay: 2.3, y: 25})
gsap.from('.anime-text', {opacity: 0, duration: 3, delay: 2.3, y: 25, ease:'expo.out', stagger: .3})

// NAV ITEM
gsap.from('.nav__logo', {opacity:0, duration: 3, delay: 3.2, y: 25, ease:'expo.out'});
gsap.from('.nav__item', {opacity: 0, duration: 3, delay: 3.2, y: 25, ease:'expo.out', stagger: .2})

// SOCIAL
gsap.from('.home__social-icon', {opacity: 0, duration: 3, delay: 4, y: 25, ease:'expo.out', stagger: .2})
// ABOUT SECTION
gsap.from('.about__img img', {opacity: 0, duration: 2, delay: 4.5, x: -60, ease: 'expo.out'});
gsap.from('.about__subtitle', {opacity: 0, duration: 2, delay: 5, y: 25, ease: 'expo.out'});
gsap.from('.about__text', {opacity: 0, duration: 2, delay: 5.3, y: 25, ease: 'expo.out', stagger: 0.2});
// SCROLL TRIGGER ANIMATIONS FOR SECTIONS
gsap.registerPlugin(ScrollTrigger);

// Animate About section
gsap.from("#about", {
    scrollTrigger: {
        trigger: "#about",
        start: "top 80%", // when about section enters 80% of viewport
    },
    opacity: 0,
    y: 50,
    duration: 1.5,
    ease: "power3.out"
});

// Animate Contact section
gsap.from("#contact", {
    scrollTrigger: {
        trigger: "#contact",
        start: "top 80%", // when contact section enters 80% of viewport
    },
    opacity: 0,
    y: 50,
    duration: 1.5,
    ease: "power3.out"
});