// Application-level defense in depth for the GET /sql/<query> route.
// The real protection is the lab5_reader DB role having no write privileges -
// this is a second layer so obviously-bad input gets a clean 400 instead of
// relying on Postgres to throw first.
export class Validator {
  // Returns true only if `sql` looks like a single SELECT statement.
  // Simple keyword-based check - not bulletproof SQL parsing, but combined with
  // the lab5_reader role's privileges (no write grants at all) it's enough for this lab.
  static isSelectOnly(sql) {
    if (typeof sql !== "string") return false;

    const trimmed = sql.trim();
    if (trimmed.length === 0) return false;

    const lower = trimmed.toLowerCase();
    if (!lower.startsWith("select")) return false;

    // reject stacked queries: strip one optional trailing semicolon, then any
    // semicolon left over means there's a second statement hiding in there
    const withoutTrailingSemicolon = trimmed.endsWith(";")
      ? trimmed.slice(0, -1)
      : trimmed;
    if (withoutTrailingSemicolon.includes(";")) return false;

    const forbidden = [
      "insert", "update", "delete", "drop",
      "alter", "create", "truncate", "grant", "revoke",
    ];
    return !forbidden.some((word) => new RegExp(`\\b${word}\\b`).test(lower));
  }
}
