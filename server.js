const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const file = "db.sqlite";
const db = new sqlite3.Database(file);

/* fs.readFile('db.json', (err, data) => {
    if (err) throw err;
    let db = JSON.parse(data);
    console.log(db);
}); */

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

const router = express.Router({});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

app.use('/api', router);

router.get('/todos', function(req, res){
    db.all("SELECT id, title, tms, done FROM todos", function(err, rows) {
        res.json(rows);
    });
});

router.get('/todos/:id', function(req, res){
    var id = req.params.id;
    var stmt = "SELECT id, title, tms, done FROM todos WHERE id = ?";
    db.get(stmt, [id], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        res.json(row);
    });
});



router.post('/todos/:id', function(req, res){
    var id = request.params.id;
    var stmt = db.prepare("SELECT id, title, 'when', done FROM todos WHERE id = ?");
    db.all("SELECT id, title, 'when', done FROM todos WHERE id = ?", function(err, rows) {
        res.json(rows);
    });
});

app.listen(port);
console.log('Magic happens on port ' + port);
