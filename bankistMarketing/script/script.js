const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// cookie popup
const cookie = function () {
  const popup = `
  <div class="cookie-message">
      <p>We use cookied for improved functionality and analytics.</p>
      <button class="btn btn--close--cookie">Got it!</button>
  </div>`;
  document.querySelector("header").insertAdjacentHTML("afterend", popup);
  const cookieDiv = document.querySelector(".cookie-message");
  // console.log(getComputedStyle(cookieDiv).width);
  cookieDiv.style.height = Number.parseFloat(getComputedStyle(cookieDiv).height, 10) + 20 + "px";
  cookieDiv.style.backgroundColor = "#ddd";
  cookieDiv.style.fontWeight = "900";
  document.querySelector(".btn--close--cookie").addEventListener("click", function () {
    document.querySelector(".cookie-message").remove();
  });

  // oldSchool way
  // const div = document.createElement("div");
  // div.classList.add("cookie-message");
  // div.innerHTML = popup;
  // document.querySelector("header").after(div);
  // document.querySelector(".btn--close--cookie").addEventListener("click", function () {
  //   div.remove();
  // });
};
cookie();

const learnScroll = function () {
  document.querySelector(".btn--scroll-to").addEventListener("click", function (e) {
    // modern way
    const section1 = document.querySelector("#section--1");
    section1.scrollIntoView({
      behavior: "smooth",
    });

    // oldSchool way
    // const section1 = document.querySelector("#section--1").getBoundingClientRect();
    // window.scrollTo({
    //   left: section1.left + window.pageXOffset,
    //   top: section1.top + window.pageYOffset,
    //   behavior: "smooth",
    // });
  });
};
learnScroll();

// hovering animation on header
const hoverIn = function () {
  const nav = document.querySelector(".nav");
  const siblings = nav.querySelectorAll(".nav__link");
  const logo = nav.querySelector(".nav__logo");
  const editOpacity = function (e, opacity) {
    if (e.target.classList.contains("nav__link")) {
      siblings.forEach((each) => {
        if (each !== e.target) {
          each.style.opacity = opacity;
        }
        logo.style.opacity = opacity;
      });
    }
  };
  nav.addEventListener("mouseover", function (e) {
    editOpacity(e, 0.5);
  });
  nav.addEventListener("mouseout", function (e) {
    editOpacity(e, 1);
  });
};
hoverIn();

// tab components on operations
const tabComponents = function () {
  document.querySelector(".operations__tab-container").addEventListener("click", function (e) {
    const btn = e.target.closest("button");
    // modern way
    // if btn is null just return function and don't execute the rest of code
    if (!btn) return;
    this.querySelectorAll("button").forEach((each) => {
      each.classList.remove("operations__tab--active");
    });
    btn.classList.add("operations__tab--active");
    this.parentElement.querySelectorAll(".operations__content").forEach((each) => {
      each.classList.remove("operations__content--active");
    });
    this.parentElement.querySelector(`.operations__content--${btn.dataset.tab}`).classList.add("operations__content--active");

    // // traditional way
    // if (btn) {
    //   this.querySelectorAll("button").forEach((each) => {
    //     each.classList.remove("operations__tab--active");
    //   });
    //   btn.classList.add("operations__tab--active");
    //   this.parentElement.querySelectorAll(".operations__content").forEach((each) => {
    //     each.classList.remove("operations__content--active");
    //   });
    //   this.parentElement.querySelector(`.operations__content--${btn.dataset.tab}`).classList.add("operations__content--active");
    // }
  });
};
tabComponents();

// // Intersection observer API practice
// const sectionOneObserver = function () {
//   const sectionOne = document.querySelector("#section--1");

//   const callBack = function (entries) {
//     const [entry] = entries;
//     if (!entry.isIntersecting) return;
//     sectionOne.style.backgroundColor = "transparent";
//   };

//   const observerFunc = new IntersectionObserver(callBack, {
//     root: null,
//     threshold: 0.5,
//   });

//   observerFunc.observe(sectionOne);
// };
// sectionOneObserver();

// Sticky header
const stickyHeader = function () {
  const header = document.querySelector(".header");
  const nav = document.querySelector(".nav");
  const navHeight = nav.getBoundingClientRect().height;

  const sticky = function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) {
      nav.classList.add("sticky");
    } else {
      nav.classList.remove("sticky");
    }
  };

  const headerObserver = new IntersectionObserver(sticky, {
    root: null,
    threshold: 0.2,
    rootMargin: `${navHeight}px`,
  });

  headerObserver.observe(header);
};
stickyHeader();

// popUp sections
const popUpSections = function () {
  const sections = document.querySelectorAll(".section");
  const revealSection = function (enteries, observe) {
    const [entry] = enteries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove("section--hidden");
    observe.unobserve(entry.target);
    // console.log("unobserve");
  };
  const sectionObserve = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
  });
  sections.forEach((sec) => {
    sectionObserve.observe(sec);
    sec.classList.add("section--hidden");
  });
};
// popUpSections();

const sliderApp = function () {
  const slider = document.querySelector(".slider");
  const slides = document.querySelectorAll(".slide");
  const rightBtn = document.querySelector(".slider__btn--right");
  const leftBtn = document.querySelector(".slider__btn--left");
  const dots = document.querySelector(".dots");
  const maxSlide = slides.length;
  let currentSlide = 0;

  slides.forEach(function (slide, index) {
    slide.style.transform = `translateX(${index * 100}%)`;
  });

  const goToSlide = function (tmp) {
    slides.forEach(function (slide, index) {
      slide.style.transform = `translateX(${100 * (index - tmp)}%)`;
    });
  };

  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activeDot(currentSlide);
  };

  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activeDot(currentSlide);
  };

  leftBtn.addEventListener("click", prevSlide);
  rightBtn.addEventListener("click", nextSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") nextSlide();
    else if (e.key === "ArrowLeft") prevSlide();
  });

  const addDot = function () {
    slides.forEach(function (slide, index) {
      dots.insertAdjacentHTML("beforeend", `<button class="dots__dot" data-slide="${index}"></button>`);
    });
  };

  const activeDot = function (activeSlide) {
    document.querySelectorAll(".dots__dot").forEach((dot) => {
      dot.classList.remove("dots__dot--active");
    });
    document.querySelector(`.dots__dot[data-slide="${activeSlide}"]`).classList.add("dots__dot--active");
  };

  dots.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const specificSlide = e.target.dataset.slide;
      goToSlide(specificSlide);
      activeDot(specificSlide);
    }
  });

  goToSlide(0);
  addDot();
  activeDot(0);
};
sliderApp();
