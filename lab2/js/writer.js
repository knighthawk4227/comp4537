import { Note } from "./note.js";
import { MESSAGES } from "../lang/messages/en/user.js";

const STORAGE_KEY = "lab2_notes";
const SAVE_INTERVAL_MS = 2000;

class NoteManager {
    constructor(listElement, addButton, timestampElement) {
        this.listElement = listElement;
        this.timestampElement = timestampElement;
        this.notes = [];
        this.isDirty = false;

        addButton.addEventListener("click", () => this.addNote());

        this.loadNotes();
        setInterval(() => this.saveIfDirty(), SAVE_INTERVAL_MS);
    }

    loadNotes() {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        stored.forEach((item) => this.addNote(item.text, item.id, false));
    }

    addNote(text = "", id = crypto.randomUUID(), markDirty = true) {
        const note = new Note(
            id,
            text,
            (removedNote) => this.handleRemove(removedNote),
            () => { this.isDirty = true; }
        );
        this.notes.push(note);
        this.listElement.appendChild(note.wrapper);
        if (markDirty) {
            this.isDirty = true;
        }
    }

    handleRemove(removedNote) {
        this.notes = this.notes.filter((note) => note !== removedNote);
        this.saveNotes();
    }

    saveIfDirty() {
        if (this.isDirty) {
            this.saveNotes();
        }
    }

    saveNotes() {
        const data = this.notes.map((note) => note.toJSON());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        this.isDirty = false;
        this.updateTimestamp();
    }

    updateTimestamp() {
        this.timestampElement.textContent = MESSAGES.SAVED_AT_PREFIX + new Date().toLocaleTimeString();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("page-heading").textContent = MESSAGES.WRITER_HEADING;
    document.getElementById("add-button").textContent = MESSAGES.ADD_BUTTON_TEXT;
    document.getElementById("back-link").textContent = MESSAGES.BACK_BUTTON_TEXT;

    const timestampElement = document.getElementById("timestamp");
    timestampElement.textContent = MESSAGES.NOT_SAVED_YET;

    new NoteManager(
        document.getElementById("notes-list"),
        document.getElementById("add-button"),
        timestampElement
    );
});
