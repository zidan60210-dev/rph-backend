const express = require("express");
const cors = require("cors");
const initSqlJs = require("sql.js");

const app = express();

app.use(cors());
app.use(express.json());

let db;

initSqlJs().then((SQL) => {
    db = new SQL.Database();

    db.run(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            name TEXT,
            age INTEGER
        )
    `);

    db.run("INSERT INTO users (name, age) VALUES ('Zidan SK', 17)");

    app.get("/", (req, res) => {
        res.send("RPH Backend Running");
    });

    app.get("/users", (req, res) => {
        const result = db.exec("SELECT * FROM users");

        const users = result[0].values.map(row => ({
            id: row[0],
            name: row[1],
            age: row[2]
        }));

        res.json(users);
    });

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
