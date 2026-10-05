export class Utils {
  static getDate() {
    return new Date().toString();
  }

  // Just make sure nothing is going to change code itself 
  static escapeHtml(text) {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
}
