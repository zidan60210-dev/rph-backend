const express = require("express");
const cors = require("cors");
const initSqlJs = require("sql.js");

const app = express();

app.use(cors());
app.use(express.json());

let db;

initSqlJs().then((SQL) => {

    db = new SQL.Database();


    // Users Table
    db.run(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            name TEXT,
            age INTEGER
        )
    `);

    db.run(`
        INSERT INTO users (name, age)
        VALUES ('Zidan SK', 17)
    `);


    // Reports Table
    db.run(`
        CREATE TABLE reports (
            id INTEGER PRIMARY KEY,
            name TEXT,
            problem TEXT,
            status TEXT
        )
    `);



    // Home
    app.get("/", (req, res) => {
        res.send("RPH Backend Running");
    });



    // Get Users
    app.get("/users", (req, res) => {

        const result = db.exec("SELECT * FROM users");

        const users = result[0].values.map(row => ({
            id: row[0],
            name: row[1],
            age: row[2]
        }));

        res.json(users);
    });



    // Submit Report
    app.post("/reports", (req, res) => {

        const { name, problem } = req.body;

        db.run(
            "INSERT INTO reports (name, problem, status) VALUES (?, ?, ?)",
            [
                name,
                problem,
                "Pending"
            ]
        );


        res.json({
            message: "Report submitted successfully"
        });

    });



    // Get All Reports
    app.get("/reports", (req, res) => {

        const result = db.exec("SELECT * FROM reports");


        if (!result.length) {
            return res.json([]);
        }


        const reports = result[0].values.map(row => ({
            id: row[0],
            name: row[1],
            problem: row[2],
            status: row[3]
        }));


        res.json(reports);

    });



    const PORT = process.env.PORT || 3000;


    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });


});
