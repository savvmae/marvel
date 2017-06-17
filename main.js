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
var cpuStats;


//variables for battle
var battleMain = document.querySelector('main');
var randomChar;
var randomCharImgPath;

var playerDiv = document.querySelector('.player');
var playerImgDiv = document.querySelector('.player-img');
var playerImg = document.createElement('img');
var playerInfoDiv = document.querySelector('.player-info');
var playerImgPath;
var playerHBar = document.querySelector('#player-health-bar');


var playerBattleH;
var playerBattleD;


var cpuDiv = document.querySelector('.cpu');
var cpuImgDiv = document.querySelector('.cpu-img');
var cpuImg = document.createElement('img');
var cpuInfoDiv = document.querySelector('.cpu-info');
var cpuHB = document.querySelector('#cpu-health-bar');


var cpuBattleH;
var cpuBattleD;


var playButton = document.querySelector('.play');
playButton.addEventListener('click', battle);

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
  // console.log(localStorage.cpuComplete);
  buildBattle();
  // need to call subsequent functions within each funcion - only one onload allowed
}
//builds characters in battle
function buildBattle() {

  var cpuBattle = localStorage.cpuComplete.split(",");
  cpuBattleH = cpuBattle[1];
  cpuBattleD = cpuBattle[2];
  var playerBattle = localStorage.playerComplete.split(",");
  playerBattleH = playerBattle[1];
  playerBattleD = playerBattle[2];

  //append info to html
  playerInfoDiv.textContent = playerBattle[0] + " Health: " + playerBattle[1] + " Damage: " + playerBattle[2];
  playerImg.setAttribute('src', playerBattle[3]);
  playerImgDiv.appendChild(playerImg);
  cpuInfoDiv.textContent = cpuBattle[0] + " Health: " + cpuBattle[1] + " Damage: " + cpuBattle[2];
  cpuImg.setAttribute('src', cpuBattle[3]);
  cpuImgDiv.appendChild(cpuImg);

  cpuHB.setAttribute('max', cpuBattleH);
  playerHBar.setAttribute('max', playerBattleH);
  cpuHB.setAttribute('value', cpuBattleH);
  playerHBar.setAttribute('value', playerBattleH);
}

function battle() {
  cpuInfoDiv.textContent = "";
  playerInfoDiv.textContent = "";

  if (cpuBattleH > 0 && playerBattleH > 0) {
    cpuBattleH -= playerBattleD;
    cpuHB.setAttribute('value', cpuBattleH);
    playerBattleH -= cpuBattleD;
    playerHBar.setAttribute('value', playerBattleH);
  }
  else if (cpuBattleH <= 0) {
    alert("you win!");
  }
  else if (playerBattleH <= 0) {
    alert("you lose!");
  }
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
  playerStatsComplete = [playerName, playerHealth, playerDamage, playerImgPath];
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
      var charName = document.createElement('button');
      var charImgPath = results[i].thumbnail.path + "/standard_large." + results[i].thumbnail.extension;
      var charImg = document.createElement('img');
      charContainer.setAttribute('class', 'char-container');
      charInfo.setAttribute('class', 'char-info');
      charName.setAttribute('class', 'char-name click-me');
      charImg.setAttribute('class', 'thumbnail');
      charImg.setAttribute('src', charImgPath);
      charHealth = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
      charDamage = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
      charName.textContent = results[i].name + "! Health: " + charHealth + " Damage: " + charDamage;
      charInfo.appendChild(charImg);
      charInfo.appendChild(charName);
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
  cpuStats = [cpuCharName, cpuHealth, cpuDamage, randomCharImgPath];
  localStorage.cpuComplete = cpuStats.toString();
}
//Pulls data from api, sets results, make IIFE??

function getMarvelResponse() {

  var ts = new Date().getTime();
  var hash = md5(ts + PRIV_KEY + PUBLIC_KEY).toString();
  var url = 'http://gateway.marvel.com:80/v1/public/characters';
  var charResults;


  $.getJSON(url, {
    ts: ts,
    apikey: PUBLIC_KEY,
    hash: hash,
    limit: 89
    })
    .done(function(data) {
        charResults = data.data.results;
        newChar(charResults)
    })
    .fail(function(err){
      console.log(err);
    });
};
