
import {stageSongs, fightSnippets } from './audio'

export default function randomizer(array) {
    return array[Math.floor(Math.random() * array.length)];
}