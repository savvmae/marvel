var PUBLIC_KEY = "438bf8eda93048d2d8e7fd8c711f3cfc";
var PRIV_KEY = "926c1bd505c279e6a79f9fefba59022daff90045";
var main = document.querySelector('main');
var noImg = 'image_not_available';
var nums = [];
var playerHealth;
var playerDamage;

function isNumber(arr) {
  for (i = 0; i < arr.length; i ++){
    if (arr[i].length <= 2) {
      nums.push(arr[i]);
    }
  }
}


function handleClick(event) {
  var playerStats = event.target.textContent;
  var playerArrayName = playerStats.split("!");
  var playerName = playerArrayName[0];
  var playerArrayStats = playerStats.split(" ");
  isNumber(playerArrayStats);
  playerHealth = nums[0];
  playerDamage = nums[1];
  playerStatsComplete = [playerName, playerHealth, playerDamage];
  console.log(playerStatsComplete);
}

function newChar (results) {

  for(var i = 0; i < results.length; i ++){
    if(results[i].thumbnail.path.indexOf(noImg) === -1){

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
      charDamage = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
      charName.textContent = results[i].name + "! Health: " + charHealth + " Damage: " + charDamage;
      charContainer.appendChild(charImg);
      charInfo.appendChild(charName);
      charContainer.appendChild(charInfo);
      main.appendChild(charContainer);
      var allButtons = document.querySelectorAll('button');
    }
  }

  for(var j = 0; j < allButtons.length; j++) {
    allButtons[j].addEventListener("click", handleClick);
  }
}


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

getMarvelResponse();
