import { stopButton2 } from './initialize';
import randomize from './randomizer';

export var stageSong;


//set variable globally so it can be paused.
export var stageSongs = [
  './audio/stage-song1.mp3',
  './audio/stage-song2.mp3',
  './audio/stage-song3.mp3',
  './audio/stage-song4.mp3'
];

export var fightSnippets = [
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

// selects random stage song
export function stageSongRet(idx) {
  var snippet = randomize(stageSongs);
  var clip = new Audio(snippet);
  return clip
}


// pause song
export function pauseSong(song) {
  song.pause()
  song.currentTime = 0;
}


// plays stage song
export function playStageSong() {
  if (stopButton2.value === "Party Pooper Button") {
    stageSong = stageSongRet()
    stageSong.play()
    stageSong.loop = true;
  }
}
// stops stage song
export function stopMusic2() {
  if (stopButton2.value === "Party Pooper Button") {
    stageSong.volume = 0
    stopButton2.value = "Start party";
  } else {
    stageSong.volume = 1;
    stopButton2.value = "Party Pooper Button";
  }
};


//attack sound affects randomizer
export function playRandomSnippet() {
  if (stopButton2.value === "Party Pooper Button") {
    var snippet = randomize(fightSnippets);
    var clip = new Audio(snippet);
    clip.play();
  }
}