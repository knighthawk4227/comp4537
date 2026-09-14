
export class ButtonMover {

    constructor(buttons) {
        this.buttons = buttons;
    }

    /**
     * Move buttons in a container
     * @param container - container holding buttons
     * @param time - amount of time before moving buttons
     */
    scramble(n, onComplete) {
        this.buttons.forEach(btn => document.body.appendChild(btn.element));

        let count = 0;

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

