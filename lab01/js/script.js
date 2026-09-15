// I used AI for assistance on this project
// The ways I used it was to check syntax and explain if ther is a better way to do something as well as for checking and making sure it will work


import { MESSAGES } from '../lang/messages/en/user.js';
import { GameController } from './gameController.js';

document.getElementById('inputLabel').textContent = MESSAGES.HOW_MANY_BUTTONS;
document.getElementById('goButton').textContent = MESSAGES.GO;

const gameController = new GameController(
    document.getElementById('goButton'),
    document.getElementById('number'),
    document.getElementById('container'),
    document.getElementById('message')
);

