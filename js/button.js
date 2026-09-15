export class RandomButton {
    constructor(number) {
        this.number = number;
        this.colour = this.getRandomColour();
        this.element = this.createElement();
    }

    getRandomColour() {
        const COLOUR_LENGTH = 6;
        const NUM_OF_LETTERS = 16;
        // I honestly got this entire function from stack overflow can not lie
        const letters = '0123456789ABCDEF';
        let colour = '#'

        for (let i = 0; i < COLOUR_LENGTH; i++) {
            colour += letters[Math.floor(Math.random() * NUM_OF_LETTERS)];
        }
        return colour;
    }

    createElement() {
        const btn = document.createElement('button');
        btn.textContent = this.number;
        btn.style.backgroundColor = this.colour;
        btn.style.height = '5em';
        btn.style.width = '10em';
        btn.disabled = true;
        return btn;
    }

    /*
     * Move each button based on window height
     */
    // AI said that this should not know it's place within a window and I actually agree it makes sense to not need to know about non button things
    // moveToRandom() {
    //     const W = window.innerWidth;
    //     const H = window.innerHeight;
    //
    //     const btnW = this.element.offsetWidth || 160;
    //     const btnH = this.element.offsetHeight || 80;
    //
    //     const x = Math.random() * (W - btnW);
    //     const y = Math.random() * (H - btnH);
    //     this.setPosition(x, y);
    //
    // }

    hideNumber() {
        this.element.textContent = ' ';
    }

    showNumber() {
        this.element.textContent = this.number;
    }

    setPosition(x, y) {
        this.element.style.position = 'fixed';
        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';
    }
}
