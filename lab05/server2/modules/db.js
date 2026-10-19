import pg from "pg";
const { Pool } = pg;

// One class, two pools. The whole "least privilege" design lives here:
// - this.writerPool connects as lab5_writer (CREATE + INSERT, used by the POST route)
// - this.readerPool connects as lab5_reader (SELECT only, used by the GET route)
// Nothing in server.js should ever open its own pg client - always go through this class,
// and always through the pool that matches what the route is allowed to do.
export class Database {
  constructor() {
    const host = process.env.DB_HOST || "postgres";
    const port = process.env.DB_PORT || 5432;
    const database = process.env.DB_NAME || "lab5";

    this.writerPool = new Pool({
      host,
      port,
      database,
      user: "lab5_writer",
      password: process.env.LAB5_WRITER_PW,
    });

    this.readerPool = new Pool({
      host,
      port,
      database,
      user: "lab5_reader",
      password: process.env.LAB5_READER_PW,
    });
  }

  // Called at the top of every POST insert request.
  // ERD (MySQL-flavored) translated to Postgres: int(11) -> SERIAL (Postgres has no
  // display-width syntax, so the (11) is dropped), varchar(100) -> VARCHAR(100),
  // datetime -> TIMESTAMP. patientid is assumed PK + auto-increment since the spec
  // has rows keep appearing on repeated Insert presses, so IDs can't be client-supplied.
  // Note: the assignment's "Engine=innoDB" instruction is MySQL-specific and has no
  // Postgres equivalent - Postgres has no pluggable storage engines, every table is
  // already transactional/ACID by default, which is InnoDB's whole purpose.
  async ensureTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS patient (
        patientid SERIAL PRIMARY KEY,
        name VARCHAR(100),
        dateOfBirth TIMESTAMP
      )
    `;
    await this.writerPool.query(sql);
  }

  // Called by the POST route. Calls ensureTable() first, every time (per spec),
  // then inserts the fixed set of rows the Insert button always sends.
  // NOTE: these 4 people are a placeholder set - swap in whatever rows the
  // assignment's ERD/table image on the Hub actually shows.
  // RETURNING * gives the client real data to display instead of just "ok".
  async insertPatients() {
    await this.ensureTable();
    const sql = `
      INSERT INTO patient (name, dateOfBirth) VALUES
        ('Sara Brown', '1901-01-01'),
        ('John Smith', '1941-01-01'),
        ('Jack Ma', '1961-01-30'),
        ('Elon Musk', '1999-01-01')
      RETURNING *
    `;
    const result = await this.writerPool.query(sql);
    return result.rows;
  }

  // Called by the GET route with whatever SQL string the client sent.
  // IMPORTANT: this runs against this.readerPool, which is the lab5_reader role -
  // that role has no INSERT/UPDATE/DELETE/DROP/CREATE privilege at the DB level, so even
  // if validation in server.js has a hole, Postgres itself refuses the statement.
  // Still worth an application-level check too (defense in depth) - see modules/validator.js.
  async runReadQuery(sql) {
    const result = await this.readerPool.query(sql);
    return result.rows;
  }
}
