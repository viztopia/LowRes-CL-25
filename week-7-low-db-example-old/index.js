import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import express from 'express'

// Initialize Express app
const app = express();

// DB - 1 - Set up lowdb
const adapter = new JSONFile('db.json');
const db = new Low(adapter, {coffeeTrackerData: []});

// to parse JSON
app.use(express.json());

app.post('/noCups', (req, res) => {
    console.log(req.body);
    let currentDate = new Date().toISOString();
    let obj = {
        date: currentDate,
        coffee: req.body.number
    };

    // DB - 2 - add values to the DB
    db.data.coffeeTrackerData.push(obj);
    db.write()
        .then(() => {
            res.json({ task: "success" });
        })
});

app.use('/', express.static('public'));

let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server listening at port: ' + port);
});

// add route to get all coffee track information
app.get('/getCups', (req, res) => {
    // DB - 3 - fetch from the DB
    db.read()
        .then(() => {
            let obj = { data: db.data.coffeeTrackerData };
            res.json(obj);
        });
});