var PUBLIC_KEY = "438bf8eda93048d2d8e7fd8c711f3cfc";
var PRIV_KEY = "926c1bd505c279e6a79f9fefba59022daff90045";

//variables for index
var main = document.querySelector('.choose-char-main');
var noImg = 'image_not_available';
var nums = [];
var filteredResults = [];
var video = document.querySelector('video');
var videoContainer = document.querySelector('.video-container');

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

var bannerElement = document.createElement('div');

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

  video.addEventListener('ended', removeVideoPlaySong);

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
        newChar(charResults);
    })
    .fail(function(err){
      console.log(err);
    });
};

//removes intro video

function removeVideoPlaySong() {
  video.remove();
  videoContainer.remove();
  loopSong();
}

function loopSong() {
  var backgroundSong = document.createElement('audio');
  backgroundSong.setAttribute('src', './audio/choose-character-song.mp3');
  backgroundSong.setAttribute('autoplay', 'autoplay');
  backgroundSong.play();
  backgroundSong.loop = true;
}

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
      var charImgPath = results[i].thumbnail.path + "/standard_fantastic." + results[i].thumbnail.extension;
      var charHitValue = Math.floor(Math.random() * (5 - 1 )) + 1;
      var charKickValue = Math.floor(Math.random() * (5 - 1 )) + 1;
      var charHealthValue = Math.floor(Math.random() * (20 - 1 )) + 1;
      var importantInfo = [results[i].name, charHealthValue, charHitValue, charKickValue, charImgPath];
      filteredResults.push(importantInfo);
    }
  }
  for(var k = 0; k < filteredResults.length; k ++){
      var charContainer = document.createElement('div');
      var charInfo = document.createElement('div');
      var charButton = document.createElement('button');
      var charName = document.createElement('p');
      var charHealth = document.createElement('p');
      var charHit = document.createElement('p');
      var charKick = document.createElement('p');

      charContainer.setAttribute('class', 'char-container');
      charInfo.setAttribute('class', 'char-info');
      charButton.setAttribute('class', 'char-button');
      charButton.style.backgroundImage = 'url('+filteredResults[k][4]+')';
      charName.setAttribute('class', 'name text-fire');
      charHealth.setAttribute('class', 'stats top');
      charHit.setAttribute('class', 'stats middle');
      charKick.setAttribute('class', 'stats bottom');

      charName.textContent = filteredResults[k][0] + "!";
      charHealth.textContent = "Health: " + filteredResults[k][1];
      charHit.textContent = "Hit Damage: " + filteredResults[k][2];
      charKick.textContent = "Kick Damage: " + filteredResults[k][3];

      charButton.setAttribute('value', [k]);
      charInfo.appendChild(charButton);
      charInfo.appendChild(charName);
      charInfo.appendChild(charHealth);
      charInfo.appendChild(charHit);
      charInfo.appendChild(charKick);
      charContainer.appendChild(charInfo);  main.appendChild(charContainer);

      var allButtons = document.querySelectorAll('button');
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
  hitButton.addEventListener('click', battle);
  kickButton.addEventListener('click', battle);
}
//set variable globally so it can be paused.
// var stageSongs = [
//   './audio/stage-song1.mp3',
//   './audio/stage-song2.mp3',
//   './audio/stage-song3.mp3',
//   './audio/stage-song4.mp3'
// ];
// var stageSong =
// function stageSong() {
//
//   var snippet = snippets[Math.floor(Math.random() * 4)];
//   var clip = new Audio(snippet);
//   clip.play();
// }
//
// function stageSongRet(idx) {
//   var snippet = snippets[idx || Math.floor(Math.random() * 4)];
//   var clip = new Audio(snippet);
//   return clip
// }
//
// function rando () {
//   // do stuff
//   const newSong = stageSongRet()
//   newSong.play()
// }

//builds characters in battle stage
function buildBattle() {
    // stageSong();
    changeBackground();
    bannerElement.remove();
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

//attack sound affects randomizer
function playRandomSnippet() {
  var snippets = [
    './audio/attack1.wav',
    './audio/attack2.wav',
    './audio/attack3.wav',
    './audio/attack4.wav',
    './audio/attack5.wav',
    './audio/attack6.wav',
    './audio/attack7.wav',
    './audio/attack8.wav',
    './audio/attack9.wav',
    './audio/attack10.wav'
  ];
  var snippet = snippets[Math.floor(Math.random()*10)];
  var clip = new Audio(snippet);
  clip.play();
}

//the battle!

function battle() {
if (cpuBattleH > 0 && playerBattleH > 0) {
    if (event.target.className === 'hit'){
      playRandomSnippet();
      cpuBattleH -= playerBattleD2;
    }
    else if (event.target.className === 'kick') {
      playRandomSnippet();
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
    playRandomSnippet();
    cpuImg.setAttribute('class', 'r-swing black-border-fifty');
    playerHBar.setAttribute('value', playerBattleH);
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

function alertDelay(winner) {
  setTimeout(function() {
    if (winner === playerImg) {

      var cheer = new Audio('./audio/win.mp3');
      cheer.play();
      winSong.play();
      banner("YOU WIN!!!");
      winner.setAttribute('class', 'r-grow black-border-fifty');
      delayReset();
    } else {
      var gameOver = new Audio('./audio/game-over.wav');
      gameOver.play();
      loseSong.play();
      banner("YOU LOSE!!!");
      winner.setAttribute('class', 'grow black-border-fifty');
      delayReset();
    }
  }, 1500);
}

//delays the reset of the battlefield so that the win dance can happen
function delayReset() {
    setTimeout(function(){
      winSong.pause();
      loseSong.pause();
      buildBattle();
    }, 5000);
}
