import { MESSAGES } from "../lang/messages/en/user.js";

export class Note {
    constructor(id, text, onRemove, onChange) {
        this.id = id;
        this.onRemove = onRemove;
        this.onChange = onChange;

        this.wrapper = document.createElement("div");
        this.wrapper.className = "note-item";

        this.textarea = document.createElement("textarea");
        this.textarea.className = "note-textarea";
        this.textarea.value = text;
        this.textarea.addEventListener("input", () => this.onChange());

        this.removeButton = document.createElement("button");
        this.removeButton.className = "note-remove-button";
        this.removeButton.textContent = MESSAGES.REMOVE_BUTTON_TEXT;
        this.removeButton.addEventListener("click", () => this.remove());

        this.wrapper.appendChild(this.textarea);
        this.wrapper.appendChild(this.removeButton);
    }

    remove() {
        this.wrapper.remove();
        this.onRemove(this);
    }

    getText() {
        return this.textarea.value;
    }

    toJSON() {
        return { id: this.id, text: this.getText() };
    }
}
