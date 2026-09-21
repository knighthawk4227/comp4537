import { MESSAGES } from "../lang/messages/en/user.js";

const STORAGE_KEY = "lab2_notes";
const POLL_INTERVAL_MS = 2000;

class NoteReader {
    constructor(listElement, timestampElement) {
        this.listElement = listElement;
        this.timestampElement = timestampElement;
        this.lastRenderedJSON = null;

        this.refresh();
        setInterval(() => this.refresh(), POLL_INTERVAL_MS);
        window.addEventListener("storage", (event) => {
            if (event.key === STORAGE_KEY) {
                this.refresh();
            }
        });
    }

    refresh() {
        const raw = localStorage.getItem(STORAGE_KEY) || "[]";
        if (raw !== this.lastRenderedJSON) {
            this.render(JSON.parse(raw));
            this.lastRenderedJSON = raw;
        }
        this.updateTimestamp();
    }

    render(notes) {
        this.listElement.innerHTML = "";
        notes.forEach((note) => {
            const textarea = document.createElement("textarea");
            textarea.className = "note-textarea";
            textarea.value = note.text;
            textarea.readOnly = true;
            this.listElement.appendChild(textarea);
        });
    }

    updateTimestamp() {
        this.timestampElement.textContent = MESSAGES.RETRIEVED_AT_PREFIX + new Date().toLocaleTimeString();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("page-heading").textContent = MESSAGES.READER_HEADING;
    document.getElementById("back-link").textContent = MESSAGES.BACK_BUTTON_TEXT;

    const timestampElement = document.getElementById("timestamp");
    timestampElement.textContent = MESSAGES.NOT_RETRIEVED_YET;

    new NoteReader(document.getElementById("notes-list"), timestampElement);
});
