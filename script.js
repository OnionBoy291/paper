const start = document.querySelector(".start");
const menu = document.querySelector(".menu");
const game = document.querySelector(".game-container");
const dialog = document.querySelector(".dialog");
const instruction = document.querySelector(".instruction");
const choices = document.querySelector(".choices");
const rickroll = document.querySelector("#rickroll");
const heart = document.querySelector(".heart");
let lives = 5;
let playerName = "";
const sceneInput = document.querySelector(".scene-input");
const jumpBtn = document.querySelector(".jump-btn");
let sceneTimeouts = [];
const flashOverlay = document.querySelector(".flash-overlay");
const totalEndings = 5;
let unlockedEndings = 
  JSON.parse(localStorage.getItem("paperEndings")) 
  || []; 
const scenes = {
  start: {
    dialog: "Hello...\nMy name is Paper.\nWill you be my friend?",
    instruction: "Accept Paper as your friend?",
    choices: [
      { text: "Yes", nextScene: "friend" },
      { text: "No", nextScene: "rejected" }
    ]
  },

  friend: {
    dialog: "Yay!\n I knew you were a good person!\nWhat's your name, friend?",
    instruction: "Enter your name below",
    choices: []
  },

  afterName: {
    dialog: "${playerName}...\nThat is a BEATUFIUL name!\nI am so happy to have a friend like you!",
    instruction: "",
    choices: [],
    autonext: "story1",
    delay: 1000
  },

  story1: {
    dialog: "So... ${playerName},\nLet's have a chat shall we? :3",
    instruction: "",
    choices: [
      { text: "Sure", nextScene: "scene1" }
    ]
  },

  scene1: {
    dialog: "${playerName}...\nI have a question for you.\nWhat would you like to do with a new best frined like me?",
    instruction: "Choose the correct answer or you will lose a life.",
    choices: [
      { text: "Play video games together", nextScene: "S1A1" },
      { text: "Have a long conversations", nextScene: "S1A2" },
      { text: "Go for walks", nextScene: "S1A3" },
    ]
  },

  S1A1: {
    dialog: "Yay!\nI love playing video games too\nMaybe We can play together someday!",
    instruction: "",
    choices: [],
    autonext: "scene2",
    delay: 1000
  },

  S1A2: {
    dialog: "I love having nice chats with my friends!\nWe can share stories about our past...\nand maybe even our darkest secrets.",
    instruction: "",
    choices: [],
    autonext: "scene2",
    delay: 1000
  },

  S1A3: {
    dialog: "We could take a walk in the park someday.\nBut for now let's have a chat,ok?",
    instruction: "",
    choices: [],
    autonext: "scene2",
    delay: 1000
  },

  scene2: {
    dialog: "Alright, next question\nWhat is your favourite food?",
    instruction: "",
    choices: [
      { text: "Garlic Bread", nextScene: "S2A1" },
      { text: "Onion Rings", nextScene: "S2A2" },
      { text: "Carrot Cake", nextScene: "S2A3" },
    ]
  },

  S2A1: {
    dialog: "Oh wow I love garlic bread too\nWe have so much in common!\n",
    instruction: "",
    choices: [],
    autonext: "scene3",
    delay: 1000
  },

  S2A2: {
    dialog: "Oh... I see.\nI don't really like onion rings\nBut it's okay, we can still be friends.",
    instruction: "",
    choices: [],
    autonext: "scene3",
    delay: 1000
  },

  S2A3: {
    dialog: "Carrot cake??\nYou have weird taste ${playerName},\nbut I won't judge you.",
    instruction: "",
    choices: [],
    autonext: "scene3",
    delay: 1000
  },

  scene3: {
    dialog: "I want you to answer honestly.\nWhat do you think is my greatest quality?",
    instruction: "",
    choices: [
      { text: "Your glowing eyes, make me feel hypnotized whenever I look at them", nextScene: "S3A1" },
      { text: "Your determination to make friends and get to know me better", nextScene: "S3A2" },
      { text: "Your sharp teeth and claws show how strong you are", nextScene: "S3A3", damage: true },
    ]
  },

  S3A1: {
    dialog: "Oh please, you made me blushing\nI never thought of it that way before.\nThank you for your kind words ${playerName}.",
    instruction: "",
    choices: [],
    autonext: "scene4",
    delay: 1000
  },

  S3A2: {
    dialog: "Oh, you really think so?\nI'm touched by your kind words ${playerName}.\nThank you for being such a good friend.",
    instruction: "",
    choices: [],
    autonext: "scene4",
    delay: 1000
  },

  S3A3: {
    dialog: "Everyone is terrified of me because of my sharp teeth and claws.\nStop lying to me ${playerName}.\nI wanna know the truth",
    instruction: "",
    choices: [],
    autonext: "scene4",
    delay: 1000
  },

  rejected: {
    dialog: "Oh...\nAm I that scary? \nI just want to be your friend.",
    instruction: "What will you do?",
    choices: [
      { text: "Accept Paper as your friend", nextScene: "friend" },
      { text: "Run Away", nextScene: "run" }
    ]
  },

  run: {
    dialog: "...\nSo you are one of them too huh.",
    instruction: "",
    choices: [
      { text: "...", nextScene: "run2" }
    ]
  },

  run2: {
    dialog: "They all said they would stay.\nBUT NO!\nThey left me alone,\nlaughed at me,\nmade fun of me.\nAnd now I'm all alone...",
    instruction: "",
    choices: [
      { text: "...", nextScene: "run3" }
    ]
  },

  run3: {
    dialog: "Good thing they're all dead now.",
    instruction: "",
    choices: []
  },

  secret1: {
    dialog: "What? You don't have a name?\nThat's weird. Everyone should have a name.\nOh I know. How about I give you one?",
    instruction: "",
    choices: [
      { text: "What?", nextScene: "secret2" }
    ]
  },

  secret2: {
    dialog: "Hmm... what should I name you...",
    instruction: "",
    choices: [
      { text: "...", nextScene: "secret3" }
    ]
  },
  
  secret3: {
    dialog: "I know! I know this one singer that I admire so much.\nHe is so talented and have a beautiful voice.\nI will name you after him!",
    instruction: "",
    choices: [
      { text: "Sure, why not", nextScene: "secret4" }
    ]
  },

  secret4: {
    dialog: "From now on, your name will be...\n Rick!\nHere I will play one of his songs for you.",
    instruction: "",
    choices: []
  },

}

// isi dropdown developer panel
for (const sceneName in scenes) {
    const option = document.createElement("option");
    option.value = sceneName;
    option.textContent = sceneName;
    sceneInput.appendChild(option);
}

start.addEventListener("click", () => {

  menu.style.opacity = "0";

  addSceneTimeout(() => {
    menu.style.display = "none";
    game.style.display = "block";
    game.style.visibility = "visible";
    addSceneTimeout(() => {
      document.body.style.backgroundColor = "#000";
      addSceneTimeout(() => {
        game.style.opacity = "1";
        loadScene("start");
       }, 1000);
    }, 700);

  }, 1000);

});


function typeWriter(text, index, callback) {

  if (index < text.length) {

    if (text.charAt(index) === "\n") {
      dialog.innerHTML += "<br>";
    } else {
      dialog.innerHTML += text.charAt(index);
    }

    let speed = 100;

    // pause kejap bila jumpa titik
    if (text.charAt(index) === ".") {
      speed = 250;
    }

    addSceneTimeout(() => {
      typeWriter(text, index + 1,callback);
    }, speed);

  } else {

    if(callback) callback();

  }
}

function loadScene(sceneKey) {

  const scene = scenes[sceneKey];

  sceneTimeouts.forEach(clearTimeout);
  sceneTimeouts = [];

  dialog.innerHTML = "";
  instruction.innerHTML = "";
  choices.innerHTML = "";
  
  dialog.classList.add("show");
  const dialogText = parse(scene.dialog);
  typeWriter(dialogText, 0, () => {

    // instruction keluar lepas dialog habis
    instruction.innerHTML = scene.instruction;
    instruction.classList.add("show");


    //yang ni untuk auto next scene
    if(scene.autonext) {
      addSceneTimeout(() => {
        loadScene(scene.autonext);
      }, scene.delay || 3000);
      return;
    }

    // choices keluar lepas tu
    addSceneTimeout(() => {
  scene.choices.forEach(choice => {
    const button = document.createElement("button");
    button.classList.add("action");
    button.classList.add("show");
    button.textContent = choice.text;

    button.addEventListener("click", () => {

      if(choice.damage) {
        loseLife();
      }

      loadScene(choice.nextScene);
    });
    choices.appendChild(button);
  });

    }, 1000);

  if(sceneKey === "friend"){

  const input = document.createElement("input");


  input.placeholder = "Enter your name...";
  input.classList.add("name-input");

  const button = document.createElement("button");

  button.textContent = "Confirm";
  button.classList.add("action");
  button.classList.add("show");

  // ruang nama player
  button.addEventListener("click", () => {

    playerName = input.value.trim();

    //ni nak secret ending
    if(playerName === "")  {
      loadScene("secret1");
    }

    else{
    loadScene("afterName");
    }
  });

  choices.appendChild(input);
  choices.appendChild(button);

  return;
  }

  //ending+special case

  if(sceneKey === "run3"){

  addSceneTimeout(() => {

    showEnding(
      "RUN AWAY ENDING",
      "run away",
      "You made Paper sad. What a horrible person you are."
    );

  }, 4000);

  }

  if(sceneKey === "secret4"){
    console.log("secret4 detected");
    addSceneTimeout(() => {
      playRickroll();
    }, 1500);
   }
  
  });

  //nak call heart
  if(sceneKey === "scene1"){
    heart.style.display = "flex";
    renderHeart();
  }

}

//transfer nama dalam dialog
function parse(text) {
  return text.replace(/\$\{playerName\}/g, playerName);
}

//untuk ending
function unlockEnding(endingID){

  if(!unlockedEndings.includes(endingID)){

    unlockedEndings.push(endingID);

    localStorage.setItem(
      "paperEndings",
      JSON.stringify(unlockedEndings)
    );
  }
}

function showEnding(title, endingID, description){

  unlockEnding(endingID);

  game.innerHTML = `

    <div class="ending-screen">

      <h1>You unlocked</h1>

      <h2>${title}</h2>

      <p>
        ${description}
      </p>

      <p>
        Endings Unlocked:
        ${unlockedEndings.length}
        /
        ${totalEndings}
      </p>

      <button class="restart">
        Play Again
      </button>

    </div>

  `;

  const restartBtn =
    document.querySelector(".restart");

  restartBtn.addEventListener("click", () => {

    location.reload();

  });

}

//untuk rickroll
function playRickroll() {
  game.innerHTML = "";
  document.body.style.backgroundColor = "#000";

  rickroll.volume = 1;
  rickroll.currentTime = 0;

  rickroll.play();
  addSceneTimeout(() => {
    const gif = document.createElement("img");
    gif.src = "RickRollGif.gif";
    gif.classList.add("rickroll-gif");
    game.appendChild(gif);
  }, 2000);
  addSceneTimeout(() => {
    showEnding(
      "GET RICKROLLED ENDING",
      "rick rolled",
      "Never gonna give you up,<br>Never gonna let you down,<br>Never gonna run around and desert you. :3"
    );
   }, 12000);
  }

  //untuk heart
  function renderHeart() {
    heart.innerHTML = "";
    for(let i = 0; i < lives; i++) {
      const heartIcon = document.createElement("img");

      heartIcon.src = "heart.png";
      heartIcon.classList.add("heartIcon");
      heart.appendChild(heartIcon);
    }
  }

  //tolak nyawa
  function loseLife() {
    lives--;
    renderHeart();
    flashRed();
    if(lives <= 0) {
      showEnding(
        "GAME OVER",
        "game over",
        "You lost all your lives.<br>Paper is sad now."
      );
    }
  }

  //flash merah
  function flashRed() {
    flashOverlay.animate(
      [
        {opacity: 0},
        {opacity: 0.9},
        {opacity: 0}
      ],
      {
        duration: 400
      }
    );
  }

//developer panel
jumpBtn.addEventListener("click", () => {
  const target = (sceneInput.value || "").trim();
  if (!target || !scenes[target]) {
    console.error(`[DevPanel] Invalid scene: ${target}`);
    return;
  }

  playerName = "Developer";
  lives = 5;

  heart.style.display = "flex";
  renderHeart();

  loadScene(target);
});

function addSceneTimeout(callback, delay) {
  const id = setTimeout(callback, delay);
  sceneTimeouts.push(id);
}
