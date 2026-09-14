import { RandomButton } from "./button";

export class ButtonMover {

    constructor(buttons) {
        this.buttons = buttons;
    }

    /**
     * Move buttons within body
     * @param n - n times to scramble
     * @param onComplete - promise of completetion
     */
    scramble(n, onComplete) {
        this.buttons.forEach(btn => document.body.appendChild(btn.element));

        let count = 0;

        // move button n times
        const doMove = () => {
            this.moveAllToRandom();
            count++;
            if (count < n) {
                setTimeout(doMove, 2000);
            } else {
                setTimeout(onComplete, 2000);
            }
        };

        doMove();
    }

    moveAllToRandom() {
        this.buttons.forEach(btn => {
            btn.moveToRandom();
        });
    }
}

