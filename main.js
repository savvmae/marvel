var PUBLIC_KEY = "438bf8eda93048d2d8e7fd8c711f3cfc";
var PRIV_KEY = "926c1bd505c279e6a79f9fefba59022daff90045";

//variables for index
var main = document.querySelector('.choose-char-main');
var noImg = 'image_not_available';
var nums = [];
var filteredResults = [];

//variables for both



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
        newChar(charResults)
    })
    .fail(function(err){
      console.log(err);
    });
};

//creates random character **computer
function randomCharGenerator(results) {
  var cpuStats = results[Math.floor(Math.random()*results.length)];
  localStorage.cpuComplete = cpuStats.toString();
}

//creates new characters and puts them on page.
function newChar (results) {
  for(var i = 0; i < results.length; i ++){
    //checks whether image_not_available
    if(results[i].thumbnail.path.indexOf(noImg) === -1){

      var charContainer = document.createElement('div');
      var charInfo = document.createElement('div');
      var charButton = document.createElement('button');
      var charName = document.createElement('p');
      var charHealth = document.createElement('p');
      var charHit = document.createElement('p');
      var charKick = document.createElement('p');
      var charHitValue = Math.floor(Math.random() * (5 - 1 )) + 1;
      var charKickValue = Math.floor(Math.random() * (5 - 1 )) + 1;
      var charHealthValue = Math.floor(Math.random() * (20 - 1 )) + 1;
      var charImgPath = results[i].thumbnail.path + "/standard_fantastic." + results[i].thumbnail.extension;
      var charImg = document.createElement('img');

      charContainer.setAttribute('class', 'char-container');
      charInfo.setAttribute('class', 'char-info');
      charButton.setAttribute('class', 'char-button');
      charImg.setAttribute('class', 'thumbnail');
      charImg.setAttribute('src', charImgPath);
      charName.setAttribute('class', 'name text-fire');
      charHealth.setAttribute('class', 'stats');
      charHit.setAttribute('class', 'stats');
      charKick.setAttribute('class', 'stats');

      charName.textContent = results[i].name + "!";
      charHealth.textContent = "Health: " + charHealthValue;
      charHit.textContent = "Hit Damage: " + charHitValue;
      charKick.textContent = "Kick Damage: " + charKickValue;
      charButton.textContent ="Select";

      charInfo.appendChild(charImg);
      charInfo.appendChild(charName);
      charInfo.appendChild(charHealth);
      charInfo.appendChild(charHit);
      charInfo.appendChild(charKick);
      charInfo.appendChild(charButton);
      charButton.setAttribute('value', [i]);
      charContainer.appendChild(charInfo);  main.appendChild(charContainer);

      var importantInfo = [results[i].name, charHealthValue, charHitValue, charKickValue, charImgPath];
      var allButtons = document.querySelectorAll('button');
      filteredResults.push(importantInfo);
    }
  }
  randomCharGenerator(filteredResults);

//loops through 'buttons' and assigns event listener, calls handleClick when clicked

  for(var j = 0; j < allButtons.length; j++) {
    allButtons[j].addEventListener("click", handleClick);
  }
}

//function for click on character, sets stats for character
function handleClick(event) {
  var playerStatsComplete = filteredResults[event.target.value];
  localStorage.playerComplete = playerStatsComplete.toString();
  location.assign("./battle.html");
}

//functions for battle

//chooses random stage background
function changeBackground() {
  var backgroundClasses = [
    'stage1',
    'stage2',
    'stage3',
    'stage4',
    'stage5',
    'stage6',
    'stage7',
    'stage8',
    'stage9',
    'stage10',
    'stage11'
  ];
  var currentBackGround = backgroundClasses[Math.floor(Math.random()*11)];
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
    playerImg.setAttribute('class', 'black-border-fifty');
    playerImgDiv.appendChild(playerImg);
    cpuInfoDiv.textContent = cpuBattle[0];
    cpuImg.setAttribute('src', cpuBattle[4]);
    cpuImg.setAttribute('class', 'black-border-fifty');
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
      playerImg.setAttribute('class', 'swing black-border-fifty');
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
    img.setAttribute('class', 'black-border-fifty');
  }, 500);
}

//delays attack of cpu so that characters aren't attacking simultaneously
function cpuAttackDelay() {
  setTimeout(function() {
    cpuImg.setAttribute('class', 'r-swing black-border-fifty');
    playerHBar.setAttribute('value', playerBattleH);
    remSwing(cpuImg);
  }, 500);
}

//delays the win dance so that the progress bar and attack animation can happen first.
function alertDelay(winner) {
  setTimeout(function() {
    if (winner === playerImg) {
      winner.setAttribute('class', 'r-grow black-border-fifty');
      // var winMessage = document.createElement('p');
      // winMessage.textContent = "YOU WIN!";
      // battleMain.appendChild(winMessage);
      // Work on displaying dancing win message!
      delayReset();
    } else {
      winner.setAttribute('class', 'grow black-border-fifty');
      delayReset();
    }
  }, 1500);
}

//delays the reset of the battlefield so that the win dance can happen
function delayReset() {
    setTimeout(function(){
      buildBattle();
    }, 4000);
}
