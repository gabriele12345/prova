const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const file = "db.sqlite";
const db = new sqlite3.Database(file);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8000;
const router = express.Router({});

const authBearer = function (req, res, next) {
    const authToken = req.header('Authorization');
    if(!authToken || authToken==='' || !authToken.startsWith('Bearer ')) {
        res.send(401);
    } else {
        const token = authToken.replace('Bearer', '').trim();
        if(token === 'token123'){
            next();
        } else {
            res.send(401);
        }
    }
};

app.use('/api', authBearer);
app.use('/api', router);

router.get('/', function(req, res) {
    res.json({ message: 'MOCK REST API' });
});

router.get('/todos', function(req, res){
    db.all("SELECT id, title, tms, done FROM todos", function(err, rows) {
        for(i = 0; i<rows.length; ++i) {
                rows[i].tms = new Date(rows[i].tms).toISOString();
        }
        res.json(rows);
    });
});

router.get('/todos/:id', function(req, res){
    const id = req.params.id;
    const stmt = "SELECT id, title, tms, done FROM todos WHERE id = ?";
    db.get(stmt, [id], (err, row) => {
        if (err)
            return console.error(err.message);
        res.json(row);
    });
});

router.post('/todos', function(req, res){
    const todoInfo = req.body;
    const stmt = "INSERT INTO todos(title, tms) VALUES(?,?)";
    const query = db.prepare(stmt);
    const tms = new Date(todoInfo.tms);
    query.run(todoInfo.title, tms);
});

app.listen(port);
console.log('Magic happens on port ' + port);
