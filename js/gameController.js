import { MESSAGES } from '../lang/messages/en/user.js';
import { RandomButton } from './button.js';
import { ButtonMover } from './buttomMover.js';

export class GameController {

    constructor(button, numberInput, container, messageArea) {
        this.goButton = button;
        this.numberInput = numberInput;
        this.messageArea = messageArea;
        this.container = container;
        this.buttons = [];
        this.gameOver = false;
        this.goButton.addEventListener('click', () => this.startGame());
    }

    clearGame() {
        this.buttons.forEach(btn => btn.element.remove());
        this.buttons = [];
        this.container.replaceChildren();
        this.nextExpected = 1;
        this.gameOver = false;
    }

    /* Checks number input then determines 
     * if num is an integer
     * create a bunch of new random buttons */
    startGame() {
        const numberVal = this.numberInput.value;
        const number = Number(numberVal);

        if (!Number.isInteger(number) || number < 3 || number > 7) {
            alert(MESSAGES.INVALID_NUMBER);
            return;
        }

        this.clearGame();
        this.goButton.disabled = true;

        for (let i = 0; i < number; i++) {
            const btn = new RandomButton(i + 1);
            this.buttons.push(btn);
            this.container.appendChild(btn.element);
        }

        // Pause n seconds, then scramble n times
        setTimeout(() => {
            const mover = new ButtonMover(this.buttons);
            /* Scramble hide each buttons num and set it to disabled then call click listener */
            mover.scramble(number, () => this.MemoryTest());
        }, number * 1000);
    }

    MemoryTest() {
        this.nextExpected = 1;
        this.gameOver = false;
        this.goButton.disabled = false;

        this.buttons.forEach(btn => {
            btn.hideNumber();
            btn.element.disabled = false;
            btn.element.style.cursor = 'pointer';
            btn.element.onclick = () => this.handleClick(btn);
        });
    }


    handleClick(btn) {
        if (this.gameOver) return;

        if (btn.number === this.nextExpected) {
            btn.showNumber();
            btn.element.disabled = true;
            this.nextExpected++;

            // if you win LOLLL
            if (this.nextExpected > this.buttons.length) {
                this.gameOver = true;
                this.messageArea.textContent = MESSAGES.GOOD_JOB;
            }
        } else {
            this.gameOver = true;
            this.messageArea.textContent = MESSAGES.WRONG_ORDER;
            // show all buttons since lose
            this.buttons.forEach(btn => {
                btn.showNumber();
                btn.element.disabled = true;
            });
        }
    }
}
