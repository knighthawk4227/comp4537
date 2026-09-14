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
