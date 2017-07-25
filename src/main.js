import md5 from './md5.min.js';
import battle from './initialize.js';

var PUBLIC_KEY = "438bf8eda93048d2d8e7fd8c711f3cfc";
var PRIV_KEY = "926c1bd505c279e6a79f9fefba59022daff90045";
//variables for index
var main = document.querySelector('.choose-char-main');
var noImg = 'image_not_available';
var nums = [];
var filteredResults = [];
var videoContainer = document.querySelector('.video-container');
var video = document.querySelector('video');

//Pulls data from api, sets results
const getMarvelResponse = function(){
video.addEventListener('ended', removeVideoPlaySong);

  var ts = new Date().getTime();
  var hash = md5(ts + PRIV_KEY + PUBLIC_KEY).toString();
  var url = 'https://gateway.marvel.com/v1/public/events/238/characters';
  var charResults;

  $.getJSON(url, {
    ts: ts,
    apikey: PUBLIC_KEY,
    hash: hash,
    limit: 100
  })
    .done(function (data) {
      charResults = data.data.results;
      newChar(charResults);
    })
    .fail(function (err) {
      console.log(err);
    });
};
if(window.location.pathname === '/'){
  getMarvelResponse();
}
if(window.location.pathname === '/battle.html') {
  battle();
}

//removes intro video
function removeVideoPlaySong() {
  video.remove();
  videoContainer.remove();
  loopSong();
}

// creates background song and loops
function loopSong() {
  var backgroundSong = document.createElement('audio');
  backgroundSong.setAttribute('src', './audio/choose-character-song.mp3');
  backgroundSong.setAttribute('autoplay', 'autoplay');
  main.appendChild(backgroundSong);
  backgroundSong.play();
  backgroundSong.loop = true;
}

//creates random character **computer
function randomCharGenerator(results) {
  var cpuStats = []
  for (var i = 0; i < 5; i++) {
    cpuStats.push(results[Math.floor(Math.random() * results.length)]);
  }
  localStorage.cpuComplete = cpuStats.toString();
}

//creates new characters and puts them on page.
function newChar(results) {
  for (var i = 0; i < results.length; i++) {
    //checks whether image_not_available
    if (results[i].thumbnail.path.indexOf(noImg) === -1) {
      var charImgPath = results[i].thumbnail.path + "/standard_fantastic." + results[i].thumbnail.extension;
      var charHitValue = Math.floor(Math.random() * (5 - 1)) + 1;
      var charKickValue = Math.floor(Math.random() * (5 - 1)) + 1;
      var charHealthValue = Math.floor(Math.random() * (20 - 1)) + 1;
      var importantInfo = [results[i].name, charHealthValue, charHitValue, charKickValue, charImgPath];
      filteredResults.push(importantInfo);
    }
  }
  for (var k = 0; k < filteredResults.length; k++) {
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
    charButton.style.backgroundImage = 'url(' + filteredResults[k][4] + ')';
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
    charContainer.appendChild(charInfo); main.appendChild(charContainer);

    var allButtons = document.querySelectorAll('button');
  }
  randomCharGenerator(filteredResults);

  //loops through 'buttons' and assigns event listener, calls handleClick when clicked
  for (var j = 0; j < allButtons.length; j++) {
    allButtons[j].addEventListener("click", handleClick);
  }

  // stops choose character song
  var stopButton = document.getElementById('stopButton');
  stopButton.addEventListener('click', stopMusic);

  function stopMusic() {
    var sounds = document.getElementsByTagName('audio');
    if (stopButton.value === "Party Pooper Button") {
      for (i = 0; i < sounds.length; i++) sounds[i].pause();
      stopButton.value = "Start party";
    } else {
      sounds[0].play();
      stopButton.value = "Party Pooper Button";
    }
  };
}

//function for click on character, sets stats for character
function handleClick(event) {
  var playerStatsComplete = filteredResults[event.target.value];
  localStorage.playerComplete = playerStatsComplete.toString();
  location.assign("./battle.html");
}

