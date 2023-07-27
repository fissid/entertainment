const rates = document.querySelectorAll(".rate");
const stars = document.querySelector(".stars");
const submit = document.querySelector(".submit");
const ratingCard = document.querySelector(".rating");
const thankingCard = document.querySelector(".thanking");
const message = document.querySelector(".message");

rates.forEach(function (rate, index) {
  rate.addEventListener("mouseover", function (e) {
    const prev = e.target.previousElementSibling;
    const next = e.target.nextElementSibling;
    if (next) next.classList.add("sibling");
    if (prev) prev.classList.add("sibling");
  });
  rate.addEventListener("mouseout", function (e) {
    const prev = e.target.previousElementSibling;
    const next = e.target.nextElementSibling;
    if (next) next.classList.remove("sibling");
    if (prev) prev.classList.remove("sibling");
  });
  rate.addEventListener("click", function (e) {
    // if there exist any tag in stars, do empty it (from previous clicking)
    if (stars.innerHTML) stars.innerHTML = "";
    const starHTML = `
    <div class="star">
      <i class="fa fa-star"></i>
    </div>`;
    const givenRate = Number(e.target.textContent);
    for (let i = 0; i < givenRate; i++) {
      stars.insertAdjacentHTML("afterbegin", starHTML);
    }
  });
});

submit.addEventListener("click", function () {
  ratingCard.classList.add("d-none");
  thankingCard.classList.remove("d-none");
  const selectedRate = stars.children.length;
  const messageHTML = `<p>You selected ${selectedRate} out of 5</p>`;
  message.insertAdjacentHTML("afterbegin", messageHTML);
});
