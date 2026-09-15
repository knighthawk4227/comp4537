
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
                // done no delay
                setTimeout(onComplete);
            }
        };
        doMove();
    }

    moveAllToRandom() {
        const W = window.innerWidth;
        const H = window.innerHeight;


        this.buttons.forEach(btn => {
            const btnW = btn.element.offsetWidth || 160;
            const btnH = btn.element.offsetHeight || 80;

            const x = Math.random() * (W - btnW);
            const y = Math.random() * (H - btnH);
            btn.setPosition(x, y);
        });
    }
}

