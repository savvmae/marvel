import { stageSongRet, pauseSong, playStageSong, stopMusic2, playRandomSnippet, stageSong } from './audio'
import changeBackground from './background'




//variables for battle

var playerDiv = document.querySelector('.player');
var playerImgDiv = document.querySelector('.player-img');
var playerInfoDiv = document.querySelector('.player-info');
var playerHBar = document.querySelector('.playerBar');
var cpuDiv = document.querySelector('.cpu');
var cpuImgDiv = document.querySelector('.cpu-img');
var cpuInfoDiv = document.querySelector('.cpu-info');
var cpuHB = document.querySelector('.cpuBar');

var buttonWrapper = document.querySelector('.button-wrapper');
var playerSpecialBar = document.querySelector('.playerSpecialBar');
var cpuSpecialBar = document.querySelector('.cpu-special-bar');
var bannerElement = document.createElement('div');
var stageNumberDiv = document.querySelector('.stage');
var stageNumber = 0;

var randomChar;
var randomCharImgPath;
var playerBattleH;
var playerH100;
var playerBattleD;
var playerBattleD2;
var cpuBattle;
var cpuBattleH;
var cpuH100;
var cpuBattleD;
var cpuBattleD2;
var playerImgPath;


export var stopButton2;
export var battleMain = document.querySelector('main');
export var hitButton = document.querySelector('.hit');
export var kickButton = document.querySelector('.kick');

var upNextDiv = document.querySelector('.next');
var previousDiv = document.querySelector('.previous');
var nextThum = document.querySelector('.next-thumb');
var tallyWin = document.querySelector('.tally-win');
var tallyLose = document.querySelector('.tally-lose');


var playerImg = document.createElement('img');
var cpuImg = document.createElement('img');

//functions for battle




var cpu1;
var cpu2;
var cpu3;
var cpu4;
var cpu5;
var allCPUS = [];
var upNext;
var previous;
var hasRunInit;

// set up dom for previous and next characters
function buildEnemyCycle(prev, next) {

  if (prev && next) {
    upNextDiv.textContent = "Up Next: " + next[0];
    nextThum.style.backgroundImage = 'url(' + next[4] + ')';
    previousDiv.textContent = "Previous: " + previous[0];
  }
  else if (next) {
    upNextDiv.textContent = "Up Next: " + next[0];
    nextThum.style.backgroundImage = 'url(' + next[4] + ')';
  }
  else if (!next) {
    upNextDiv.textContent = ""
    nextThum.style.backgroundImage = 'none';
    previousDiv.textContent = "Previous: " + previous[0];
  }
}

// move to next enemy in list
function selectNextEnemy() {
  if (hasRunInit) {
    for (var i = 0; i < allCPUS.length; i++) {
      if (cpuInfoDiv.textContent === allCPUS[i][0]) {
        cpuBattle = allCPUS[i + 1];
        upNext = allCPUS[i + 2];
        previous = allCPUS[i];
        buildEnemyCycle(previous, upNext);
      }
      else if (cpuInfoDiv.textContent === allCPUS[allCPUS.length - 1][0]) {
        location.assign("/");
      }
    }
  }
}

// build out cpu characters
export default function cpuChars() {
  hasRunInit = true;
  var allCPUCharsString = localStorage.cpuComplete.split(",");
  cpu1 = allCPUCharsString.slice(0, 5);
  cpu2 = allCPUCharsString.slice(5, 10);
  cpu3 = allCPUCharsString.slice(10, 15);
  cpu4 = allCPUCharsString.slice(15, 20);
  cpu5 = allCPUCharsString.slice(20, 25);
  allCPUS.push(cpu1, cpu2, cpu3, cpu4, cpu5);

  cpuBattle = cpu1;
  upNext = cpu2;
  buildEnemyCycle(previous, upNext);
  buildBattle();

}

//builds characters in battle stage
function buildBattle() {
  selectNextEnemy();
  stageNumber += 1;
  stageNumberDiv.textContent = "Stage " + stageNumber;
  cpuBattleH = cpuBattle[1];
  cpuH100 = cpuBattleH;
  cpuBattleD = cpuBattle[2];
  cpuBattleD2 = cpuBattle[3];
  cpuInfoDiv.textContent = cpuBattle[0];
  cpuImg.setAttribute('src', cpuBattle[4]);

  cpuHitCounter = 0;
  specialBar(playerSpecialBar, playerHitCounter);
  specialBar(cpuSpecialBar, cpuHitCounter);
  removeSpecialButton();
  changeBackground();
  bannerElement.remove();

  var playerBattle = localStorage.playerComplete.split(",");
  playerBattleH = playerBattle[1];
  playerH100 = playerBattleH;
  playerBattleD = playerBattle[2];
  playerBattleD2 = playerBattle[3];

  //append info to html
  playerInfoDiv.textContent = playerBattle[0];
  playerImg.setAttribute('src', playerBattle[4]);
  playerImg.setAttribute('class', 'black-border-fifty');
  playerImgDiv.appendChild(playerImg);

  cpuImg.setAttribute('class', 'black-border-fifty');
  cpuImgDiv.appendChild(cpuImg);
  cpuHB.setAttribute('style', 'width: 100%');
  cpuHB.setAttribute('class', 'progress-bar cpuBar');
  playerHBar.setAttribute('style', 'width: 100%');
  playerHBar.setAttribute('class', 'progress-bar playerBar');

  hitButton.addEventListener('click', battle);
  kickButton.addEventListener('click', battle);

  // adds event listener for stop stage song
  stopButton2 = document.getElementById('stopButton2');
  stopButton2.addEventListener('click', stopMusic2);

  playStageSong();

}



//the battle!
var playerHitCounter = 0;
var cpuHitCounter = 0;
var specialButton = document.createElement('button');

// creates special move button
function specialButtonCreator() {
  if (buttonWrapper.contains(specialButton)) {
    return
  } else {
    specialButton.setAttribute('class', 'special glow');
    specialButton.textContent = "Special"
    specialButton.addEventListener('click', battle);
    buttonWrapper.appendChild(specialButton);
  }
}
// removes special button and resets hit count
function removeSpecialButton() {
  playerHitCounter = 0;
  specialBar(playerSpecialBar, playerHitCounter);
  if (buttonWrapper.contains(specialButton)) {
    buttonWrapper.removeChild(specialButton);
  } else {
    return
  }
}

// caculates percent of health
function determineHealthPercent(current, constant, bar) {
  var healthPercent = (current / constant) * 100;
  changeProgressBar(bar, healthPercent);
}

// adjusts health bar for percent of health.
function changeProgressBar(bar, healthPercent) {
  bar.setAttribute("style", "width: " + healthPercent + "%");
  if (healthPercent <= 50 && healthPercent >= 15) {
    bar.className += " health-warning";
  } else if (healthPercent <= 15) {
    bar.className += " health-danger";
  }
}

// sets special bar width, adds glow when full
function specialBar(bar, count) {
  if (count === 1) {
    bar.setAttribute("style", "width: 33%");
  } else if (count === 2) {
    bar.setAttribute("style", "width: 66%");
  } else if (count === 3) {
    bar.setAttribute("style", "width: 100%");
    bar.className += " glow";
  } else if (count === 0) {
    bar.setAttribute("style", "width: 0%");
    bar.classList.remove("glow");
  }
}

// battle!
function battle() {

  if (cpuBattleH > 0 && playerBattleH > 0) {

    playerHitCounter += 1;
    specialBar(playerSpecialBar, playerHitCounter);
    if (playerHitCounter > 0 && playerHitCounter % 3 === 0) {
      specialButtonCreator();
    }
    if (event.target.className === 'hit') {
      playRandomSnippet();
      cpuBattleH -= playerBattleD2;
    }
    else if (event.target.className === 'kick') {
      playRandomSnippet();
      cpuBattleH -= playerBattleD;
    }
    else if (event.target.className === 'special glow') {
      playRandomSnippet();
      cpuBattleH -= playerBattleD * 2;
      removeSpecialButton();
    }
    determineHealthPercent(cpuBattleH, cpuH100, cpuHB);
    playerImg.setAttribute('class', 'swing black-border-fifty');
    remSwing(playerImg);
    if (cpuBattleH <= 0) {
      return alertDelay(playerImg);
    }
    cpuAttackDelay();

    if (cpuHitCounter > 0 && cpuHitCounter % 3 === 0) {
      playerBattleH -= cpuBattleD2 * 2;
      cpuHitCounter = 0;
    } else {
      playerBattleH -= cpuBattleD2;
      cpuHitCounter += 1;

    }
    if (playerBattleH <= 0) {
      return alertDelay(cpuImg);
    }
  }
}

//removes animation so that it can be reassigned at next move
function remSwing(img) {
  setTimeout(function () {
    img.removeAttribute('class', 'swing');
    img.setAttribute('class', 'black-border-fifty');
  }, 500);
}

//delays attack of cpu so that characters aren't attacking simultaneously
function cpuAttackDelay() {
  setTimeout(function () {
    playRandomSnippet();
    specialBar(cpuSpecialBar, cpuHitCounter);
    cpuImg.setAttribute('class', 'r-swing black-border-fifty');
    determineHealthPercent(playerBattleH, playerH100, playerHBar);
    remSwing(cpuImg);
  }, 500);
}

//creates banner for end of game-over
function banner(message) {
  bannerElement.textContent = message;
  bannerElement.setAttribute('class', 'banner victory text-fire');
  battleMain.appendChild(bannerElement);
}

//delays the win dance so that the progress bar and attack animation can happen first.
var winSong = new Audio('./audio/congrats-song.mp3');
var loseSong = new Audio('./audio/lose-song.mp3');

// win or lose
function alertDelay(winner) {
  setTimeout(function () {
    if (winner === playerImg) {
      var cheer = new Audio('./audio/win.mp3');
      tallyWin.textContent += " I";
      pauseSong(stageSong);
      if (stopButton2.value === "Party Pooper Button") {
        cheer.play();
        winSong.play();
      }
      banner("YOU WIN!!!");
      winner.setAttribute('class', 'spin black-border-fifty');
      delayReset();
    } else {
      var gameOver = new Audio('./audio/game-over.wav');
      tallyLose.textContent += " I";
      pauseSong(stageSong);
      if (stopButton2.value === "Party Pooper Button") {
        gameOver.play();
        loseSong.play();
      }
      banner("YOU LOSE!!!");
      winner.setAttribute('class', 'spin black-border-fifty');
      delayReset();
    }
  }, 1500);
}

//delays the reset of the battlefield so that the win dance can happen
function delayReset() {
  setTimeout(function () {
    pauseSong(winSong)
    pauseSong(loseSong);
    buildBattle();
  }, 5000);
}

