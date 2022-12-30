const mainword = document.querySelector(".main-word");
const playagainbtn = document.querySelector(".play-again-btn");
const wrongletter = document.querySelector(".wrong-letters");
const winningpopup = document.querySelector(".winning-popup");
const notification = document.querySelector(".notification");
const figureparts = document.querySelectorAll(".figure-part");
const endtitle = document.querySelector(".end-title");

winningpopup.style.display = "none";

let correctletters = [];
let wrongletters = [];

let initialword = "";

const apiurl = "https://random-word-api.herokuapp.com/word";

async function getwords() {
  try {
    const res = await fetch(apiurl);
    const wordsarray = await res.json();
    initialword = wordsarray[0];
    displaymainword();
  } catch (error) {
    //catch error here
  }
}

getwords();

// show the main word
function displaymainword() {
  if (initialword) {
    mainword.innerHTML = `
    ${initialword
      .split("")
      .map(
        (letter) => `
      <span class="word">
        ${correctletters.includes(letter) ? letter : ""}
      </span>
    `
      )
      .join("")}
    `;

    const innerword = mainword.innerText.replace(/\n/g, "");

    // check if player won
    if (innerword === initialword && innerword && initialword) {
      winningpopup.style.display = "flex";
      endtitle.innerText = "congradulation, you won";
      correctletters.splice(0);
      wrongletters.splice(0);
      updatewrongletters();

      getwords();
      correctletters = [];
    }
  }
}

// update the wrong letters
function updatewrongletters() {
  wrongletter.innerHTML = `
  
    ${wrongletters.length > 0 ? "<p>Wrong letters</p>" : ""}
    ${wrongletters.map((letter) => `<span>${letter}</span>`)}
  `;

  // display figure parts
  figureparts.forEach((part, index) => {
    const errors = wrongletters.length;

    if (index < errors) {
      part.style.display = "flex";
    } else {
      part.style.display = "none";
    }

    // check if player lost the game
    if (errors >= figureparts.length) {
      winningpopup.style.display = "flex";
      endtitle.textContent = "unfortunately you lost";
      correctletters.splice(0);
      wrongletters.splice(0);
      updatewrongletters();

      getwords();
    }
  });
}

// show notification , if player type the same letter two or more times
function shownotification() {
  notification.classList.add("show-notification");

  setTimeout(() => {
    notification.classList.remove("show-notification");
  }, 1000);
}

//keydown letter press
window.addEventListener("keydown", (e) => {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    const letter = e.key;

    if (initialword.includes(letter)) {
      if (!correctletters.includes(letter)) {
        correctletters.push(letter);
        displaymainword();
      } else {
        shownotification();
      }
    } else {
      if (!wrongletters.includes(letter)) {
        wrongletters.push(letter);
        updatewrongletters();
      } else {
        shownotification();
      }
    }
  }
});

//restore game and play again
playagainbtn.addEventListener("click", () => {
  //empty arrays
  correctletters.splice(0);
  wrongletters.splice(0);

  setTimeout(() => {
    winningpopup.style.display = "none";
  }, 100);

  updatewrongletters();

  window.location.reload();
});
