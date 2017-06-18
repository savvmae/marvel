var PUBLIC_KEY = "438bf8eda93048d2d8e7fd8c711f3cfc";
var PRIV_KEY = "926c1bd505c279e6a79f9fefba59022daff90045";

//variables for index
var main = document.querySelector('.choose-char-main');
var noImg = 'image_not_available';
var nums = [];
var filteredResults = [];

//variables for both
var playerHealth;
var playerDamage;
var playerStatsComplete;
var cpuHealth;
var cpuDamage;
var cpuDamage2;
var cpuStats;

//variables for battle
var battleMain = document.querySelector('main');
var playerDiv = document.querySelector('.player');
var playerImgDiv = document.querySelector('.player-img');
var playerInfoDiv = document.querySelector('.player-info');
var playerHBar = document.querySelector('#player-health-bar');
var cpuDiv = document.querySelector('.cpu');
var cpuImgDiv = document.querySelector('.cpu-img');
var cpuInfoDiv = document.querySelector('.cpu-info');
var cpuHB = document.querySelector('#cpu-health-bar');
var hitButton = document.querySelector('.hit');
var kickButton = document.querySelector('.kick');


var randomChar;
var randomCharImgPath;
var playerBattleH;
var playerBattleD;
var playerBattleD2;
var cpuBattleH;
var cpuBattleD;
var cpuBattleD2;
var playerImgPath;

var playerImg = document.createElement('img');
var cpuImg = document.createElement('img');




//functions for battle

//chooses random stage background
function changeBackground() {
  var backgroundClasses = [
    'stage1',
    'stage2',
    'stage3',
    'stage5',
    'stage6',
    'stage7'
  ];
  var currentBackGround = backgroundClasses[Math.floor(Math.random()*5)];
  battleMain.setAttribute('class', 'battle-main ' + currentBackGround);
  buildBattle();
  hitButton.addEventListener('click', battle);
  kickButton.addEventListener('click', battle);
}
//builds characters in battle stage
function buildBattle() {
    var cpuBattle = localStorage.cpuComplete.split(",");
    cpuBattleH = cpuBattle[1];
    cpuBattleD = cpuBattle[2];
    cpuBattleD2 = cpuBattle[3];
    var playerBattle = localStorage.playerComplete.split(",");
    playerBattleH = playerBattle[1];
    playerBattleD = playerBattle[2];
    playerBattleD2 = playerBattle[3];

    //append info to html
    playerInfoDiv.textContent = playerBattle[0];
    playerImg.setAttribute('src', playerBattle[4]);
    playerImg.setAttribute('class', 'black-border');
    playerImgDiv.appendChild(playerImg);
    cpuInfoDiv.textContent = cpuBattle[0];
    cpuImg.setAttribute('src', cpuBattle[4]);
    cpuImg.setAttribute('class', 'black-border');
    cpuImgDiv.appendChild(cpuImg);
    cpuHB.setAttribute('max', cpuBattleH);
    playerHBar.setAttribute('max', playerBattleH);
    cpuHB.setAttribute('value', cpuBattleH);
    playerHBar.setAttribute('value', playerBattleH);
}

//the battle!

// want to implement the 2 varieties of damage here. will take some restructuring of the logic.
function battle() {
if (cpuBattleH > 0 && playerBattleH > 0) {
    if (event.target.className === 'hit'){
      cpuBattleH -= playerBattleD2;
    }
    else if (event.target.className === 'kick') {
      cpuBattleH -= playerBattleD;
    }
      cpuHB.setAttribute('value', cpuBattleH);
      playerImg.setAttribute('class', 'swing black-border');
      remSwing(playerImg);
        if (cpuBattleH <= 0) {
          return alertDelay(playerImg);
        }
      cpuAttackDelay();
      playerBattleH -= cpuBattleD2;
        if(playerBattleH <= 0) {
          return alertDelay(cpuImg);
      }
    }
  }


//removes animation so that it can be reassigned at next move
function remSwing(img) {
  setTimeout(function() {
    img.removeAttribute('class', 'swing');
    img.setAttribute('class', 'black-border');
  }, 500);
}

//delays attack of cpu so that characters aren't attacking simultaneously
function cpuAttackDelay() {
  setTimeout(function() {
    cpuImg.setAttribute('class', 'r-swing black-border');
    playerHBar.setAttribute('value', playerBattleH);
    remSwing(cpuImg);
  }, 500);
}

//delays the win dance so that the progress bar and attack animation can happen first.
function alertDelay(winner) {
  setTimeout(function() {
    winner.setAttribute('class', 'grow black-border');
    delayReset();
  }, 1500);
}

//delays the reset of the battlefield so that the win dance can happen
function delayReset() {
    setTimeout(function(){
      buildBattle();
    }, 4000);
}

//loops through charInfo and gets health/damage numbers.
function isNumber(arr) {
  for (i = 0; i < arr.length; i ++){
    if (arr[i].length <= 2) {
      nums.push(arr[i]);
    }
  }
}

//function for click on character, sets stats for character
function handleClick(event) {
  var selectedCharacter = event.target.textContent;
  playerImgPath = event.target.previousElementSibling.src;
  var playerArrayName = selectedCharacter.split("!");
  var playerName = playerArrayName[0];
  var playerArrayStats = selectedCharacter.split(" ");
  isNumber(playerArrayStats);
  playerHealth = parseInt(nums[0]);
  playerDamage = parseInt(nums[1]);
  playerDamage2 = parseInt(nums[2])
  playerStatsComplete = [playerName, playerHealth, playerDamage, playerDamage2, playerImgPath];
  localStorage.playerComplete = playerStatsComplete.toString();
  location.assign("./battle.html");
}

//creates new characters and puts them on page.
function newChar (results) {
  for(var i = 0; i < results.length; i ++){
    //checks whether image_not_available
    if(results[i].thumbnail.path.indexOf(noImg) === -1){
      filteredResults.push(results[i]);
      var charContainer = document.createElement('div');
      var charInfo = document.createElement('div');
      var charButton = document.createElement('button');
      var charImgPath = results[i].thumbnail.path + "/standard_large." + results[i].thumbnail.extension;
      var charImg = document.createElement('img');
      charContainer.setAttribute('class', 'char-container');
      charInfo.setAttribute('class', 'char-info');
      charButton.setAttribute('class', 'char-button');
      charImg.setAttribute('class', 'thumbnail');
      charImg.setAttribute('src', charImgPath);
      var charHealth = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
      var charDamage = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
      var charDamage2 = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
      charButton.textContent = results[i].name + "! Health: " + charHealth + " Hit: " + charDamage + " Kick: " + charDamage2;
      charInfo.appendChild(charImg);
      charInfo.appendChild(charButton);
      charContainer.appendChild(charInfo);
      main.appendChild(charContainer);
      var allButtons = document.querySelectorAll('button');
    }
  }
  randomCharGenerator(filteredResults);

//loops through 'buttons' and assigns event listener, calls handleClick when clicked

  for(var j = 0; j < allButtons.length; j++) {
    allButtons[j].addEventListener("click", handleClick);
  }
}

//creates random character **computer
function randomCharGenerator(results) {
  randomChar = results[Math.floor(Math.random()*results.length)];
  var cpuCharName = randomChar.name;
  randomCharImgPath = randomChar.thumbnail.path + "/standard_large." + randomChar.thumbnail.extension;
  cpuHealth = Math.floor(Math.random() * (20 - 1 )) + 1;
  cpuDamage = Math.floor(Math.random() * (5 - 1 )) + 1;
  cpuDamage2 = Math.floor(Math.random() * (5 - 1 )) + 1;
  cpuStats = [cpuCharName, cpuHealth, cpuDamage, cpuDamage2, randomCharImgPath];
  localStorage.cpuComplete = cpuStats.toString();
}

//Pulls data from api, sets results
function getMarvelResponse() {

  var ts = new Date().getTime();
  var hash = md5(ts + PRIV_KEY + PUBLIC_KEY).toString();
  var url = 'http://gateway.marvel.com/v1/public/events/238/characters';
  var charResults;

  $.getJSON(url, {
    ts: ts,
    apikey: PUBLIC_KEY,
    hash: hash,
    limit: 100
    })
    .done(function(data) {
        charResults = data.data.results;
        console.log(charResults);
        newChar(charResults)
    })
    .fail(function(err){
      console.log(err);
    });
};
