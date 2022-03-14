const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('server/public'));
app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});

let currentCalc = [];
let results = [];

//GET Route
//sends results array 
app.get('/results', (req, res) => {
    console.log('GET /results');
    res.send(results);
})

//POST Route
//adds last calculation to currentCalc array and runs calculate function
app.post('/results', (req, res) => {
    console.log('POST /results', req.body);
    currentCalc.push(req.body);
    console.log('current calculation', req.body);
    calculate(req.body);
    res.sendStatus(200);
})

//DELETE Route
//clears results array on server
app.delete('/results', (req, res) => {
    console.log('DELETE /results', req.body);
    results = [];
    console.log('delete', req.body);
    res.sendStatus(200);
})

//calculates the last entry from the client, returns result
function calculate(currentCalc) {
    console.log('in calculate function');

    let calcResult;
    if (currentCalc.operator === '+') {
        calcResult = parseFloat(currentCalc.num1) + parseFloat(currentCalc.num2)
    } else if (currentCalc.operator === '-') {
        calcResult = parseFloat(currentCalc.num1) - parseFloat(currentCalc.num2)
    } else if (currentCalc.operator === '*') {
        calcResult = parseFloat(currentCalc.num1) * parseFloat(currentCalc.num2)
    } else if (currentCalc.operator === '/') {
        calcResult = parseFloat(currentCalc.num1) / parseFloat(currentCalc.num2)
    } else {
        calcResult = 'ERROR: missing operator in calculate function'
    }
    
    let resultObject = {
        num1: currentCalc.num1,
        operator: currentCalc.operator,
        num2: currentCalc.num2,
        calcResult: calcResult
    };

    results.unshift(resultObject);

    console.log('calcResult = ', calcResult);

    return calcResult;

}