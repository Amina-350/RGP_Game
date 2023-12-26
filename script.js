let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

// getting the queries form html
const XPtext = document.querySelector("#XPtext");
const XPhealthtext = document.querySelector("#XPhealthtext");
const XPgoldtext = document.querySelector("#XPgoldtext");
const monstarstatus = document.querySelector("#monstarstatus");
const monstarsname = document.querySelector("#monstarsname");
let monstarhealth = document.querySelector("#monstarhealth");
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to Cave", "Fight dragons"],
    "button functions": [goStore, goCave, fightDragon],
    text: 'You are in the town square. you see a sign tat says "Store.|',
  },
  {
    name: "store",
    "button text": [
      "Buy 10 health (10 gold)",
      "Buy weapon (30 gold)",
      "Go to town square",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store.|",
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters|",
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster",
  },
  {
    name: "kill monster",
    "button text": [
      "Go to town square",
      "Go to town square",
      "Go to town square",
    ],
    "button functions": [goTown, goTown, easterEgg],
    text: "The monster screams Arg ! as it dies. You gain experience points and find gold",
  },
  {
    name: "lose",
    "button text": ["Replay?", "Replay?", "Replay?"],
    "button functions": [restart, restart, restart],
    text: "You die",
  },
  {
    name: "win",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You defeat the dragon! YOU WIN THE GAME!",
  },
  {
    name:'easter egg',
    "button text":["2","8","Go to town square?"],
    "button functions": [pickTwo,pickEight,goTown],
    text:"You find a secret game. Pick a numer above. Ten numbers will be chosen between 0 and 10. if the number you choose matches one of the random numbers, you win!"
  },
];

// weapons
const weapons = [
  {
    name: "stick",
    power: 5,
  },
  {
    name: "dagger",
    power: 30,
  },
  {
    name: "claw hammer",
    power: 50,
  },
  {
    name: "sword",
    power: 100,
  },
];

// monsters
const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15,
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60,
  },
  {
    name: "dragon",
    level: 20,
    health: 300,
  },
];
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;
// update function
function update(location) {
  monstarstatus.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerText = location.text;
}

// go to town function
function goTown() {
  update(locations[0]);
}
// gostore function
function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold = gold - 10;
    health = health + 10;
    XPgoldtext.innerText = `Gold:${gold}`;
    XPhealthtext.innerText = `Health:${health}`;
  } else {
    text.innerText = "You do not have enough gold";
  }
}
function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon += 1;
      XPgoldtext.innerText = `Gold: ${gold}`;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += "In your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText =
      "You already have the most powerful weapon in your inventory";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}
function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    XPgoldtext.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += "In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapons!";
  }
}
// fight with monster functions
function fightSlime() {
  fighting = 0;
  goFight();
}
function fightBeast() {
  fighting = 1;
  goFight();
}
function fightDragon() {
  fighting = 2;
  goFight();
}
function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monstarstatus.style.display = "block";
  monstarsname.innerText = monsters[fighting].name;
  monstarhealth.textContent = monsterHealth;
}
function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText +=
    " You attack it with your " + weapons[currentWeapon].name + ".";

  if (isMonsterHit()) {
    health -= getMonsterAttackValue(monsters[fighting].level);
  } else {
    text.innerText = "You miss.";
  }

  XPhealthtext.innerText = `Health: ${health}`;
  monsterHealth =
    parseInt(monstarhealth.innerText, 10) -
    (weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1);
  monstarhealth.innerText = monsterHealth;

  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    fighting === 2 ? winGame() : defeatMonster();
  }

  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--;
  }
}


function getMonsterAttackValue(level){
   let hit=(level*5)-(Math.floor(Math.random()*xp));
   return hit;
}
function isMonsterHit() {
  return Math.random() > 0.2 && health >= 20;
}
function dodge() {
  text.innerText =
    "You dofge the attack from the " + monsters[fighting].name + ".";
}
function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  XPgoldtext.innerText = gold;
  XPtext.innerText = xp;
  update(locations[4]);
}
function lose() {
  update(locations[5]);
}
function winGame() {
  update(locations[6]);
}
function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  (inventory = ["stick"]), (XPgoldtext.innerText = gold);
  XPhealthtext.innerText = health;
  XPtext.innerText = xp;
  goTown();
}
function easterEgg(){
  update(locations[7]);
}
function pickTwo(){
  pick(2);
}
function pickEight(){
  pick(8);
}
function pick(guess)
{
  let numbers=[];
  while(numbers.length<10){
   numbers.push(Math.floor(Math.random()*11));
  }
  text.innerText="You picked"+ guess+". Here is the random number: \n";
  for(let i=0;i<10;i++){
   text.innerText+=numbers[i]+"\n";   
  }
  if(numbers.indexOf(guess)!==-1){
    text.innerText+="Right! You win 20 gold!";
    gold +=20;
    XPgoldtext.innerText =gold;
  }
  else{
    text.innerText +="wrong! You lose 10 health";
    health -=10;
    XPhealthtext.innerText=health;
    if(health<=0){
      lose();
    }
  }
}