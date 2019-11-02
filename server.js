const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const file = "db.sqlite";
const db = new sqlite3.Database(file);

app.get('/app', function (req, res) {
    res.sendfile(path.join(__dirname + '/ajax.html'));
});

app.get('/controller.js', function (req, res) {
    res.sendfile(path.join(__dirname + '/controller.js'));
});

app.get('/style.css', function (req, res) {
    res.sendfile(path.join(__dirname + '/style.css'));
});

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = process.env.PORT || 8000;
const router = express.Router({});

const authBearer = function (req, res, next) {
    const authToken = req.header('Authorization');
    if (!authToken || authToken === '' || !authToken.startsWith('Bearer ')) {
        res.send(401);
    } else {
        const token = authToken.replace('Bearer', '').trim();
        if (token === 'token123') {
            next();
        } else {
            res.send(401);
        }
    }
};

app.use('/api', authBearer);
app.use('/api', router);

router.get('/', function (req, res) {
    res.sendfile(path.join(__dirname + '/ajax.html'));
});

router.get('/todos', function (req, res) {
    db.all("SELECT id, title, tms, done FROM todos", function (err, rows) {
        for (i = 0; i < rows.length; ++i)
            rows[i].tms = new Date(rows[i].tms).toISOString();
        res.json(rows);
    });
});

router.get('/todos/:id', function (req, res) {
    const id = req.params.id;
    const stmt = "SELECT id, title, tms, done FROM todos WHERE id = ?";
    db.get(stmt, [id], (err, row) => {
        if (err)
            return console.error(err.message);
        res.json(row);
    });
});

router.post('/todos', function (req, res) {
    const todoInfo = req.body;
    const stmt = "INSERT INTO todos(title, tms) VALUES(?,?)";
    const tms = new Date(todoInfo.tms);
    db.run(stmt, [todoInfo.title, tms], function (error) {
        if (error) {
            res.json({success: false, error: error.message});
        } else {
            res.json({success: true, id: this.lastID});
            res.send(200);
        }
    });
});

router.put('/todos', function (req, res) {
    const todoInfo = req.body;
    const stmt = "UPDATE todos SET done = " + todoInfo.done + " WHERE id = ?";
    db.run(stmt, [todoInfo.id], function (error) {
        if (error) {
            res.json({success: false, error: error.message});
        } else {
            res.json({success: true});
            res.send(200);
        }
    });
});

router.delete('/todos', function (req, res) {
    const todoInfo = req.body;
    const id = todoInfo.id;
    const stmt = "DELETE FROM todos WHERE id = ?";
    db.run(stmt, [id]);
    res.json({success: true});
    res.send(200);
});

app.listen(port);
console.log('Magic happens on port ' + port);
