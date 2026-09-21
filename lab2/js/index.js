// I did use AI in this assignment
import { MESSAGES } from "../lang/messages/en/user.js";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("app-title").textContent = MESSAGES.APP_TITLE;
    document.getElementById("student-name").textContent = MESSAGES.STUDENT_NAME;
    document.getElementById("writer-link").textContent = MESSAGES.WRITER_LINK_TEXT;
    document.getElementById("reader-link").textContent = MESSAGES.READER_LINK_TEXT;
});
