console.log('JS Ready');

$(readyNow);

function readyNow() {
    console.log('JQ is ready');
    $('.number').on('click', setNumber);
    $('.operator').on('click', setOperator);
    $('#equal').on('click', postResults);
    $('#clear').on('click', clearInputs, clearDisplay);
    $('.btn').on('click', clearDisplay);
    $('#clearHistory').on('click', clearHistory)
    $('#resultDisplay').on('click', '#displayHistory', recallHistory);

    getResults();
}

let num1 = '';
let num2 = '';
let operator = '';
let inputNum2 = false;

//sends POST request with the last math problem entered, calls getResults function, clears variables,
//disables number and operator buttons to prevent entry until last problem is cleared
function postResults() {
    console.log('in postResults function');
    if (num1 == '' || num2 == '' || operator == '') {
        alert('ERROR: all calculations must contain two numbers and one operator')
    } else {
        //old inputs from text fields
        // num1 = $('#num1').val();
        // num2 = $('#num2').val();

        console.log(num1, operator, num2);

        $.ajax({
            url: '/results',
            method: 'POST',
            data: {
                num1: num1,
                operator: operator,
                num2: num2
            },
        }).then((response) => {
            console.log(response);
        })

        getResults();
        // $('.operator').prop('disabled', false);
        clearInputs();
        $('.operator').prop('disabled', true);
        $('.number').prop('disabled', true);
        $('#equal').prop('disabled', true);
    }

}

//sends GET request for results array
function getResults() {
    console.log('in getResults function');

    $.ajax({
        url: '/results',
        method: 'GET',
    }).then((response) => {
        console.log(response);
        render(response);
        //render(response);
    }).catch((error) => {
        console.log(error);
        alert('error in GET!')
    })

}

//sets number variables to user entered numbers
function setNumber() {
    console.log('in setNumber function');
    console.log(this.id);

    $('#calcDisplay').append(this.id);
    if (inputNum2 === false) {
        num1 += this.id
    } else {
        num2 += this.id
    }
    console.log(num1, operator, num2);
}

//sets operator variable to user entered operator
function setOperator() {
    console.log('in setOperator function');
    console.log(this.id);

    $('#calcDisplay').append(` ${this.id} `);
    operator = this.id;
    inputNum2 = true;
    $('.operator').prop('disabled', true);
}

//renders results to DOM
//data tags are not currently in use
function render(results) {
    console.log('in render function');
    console.log(results);
    // console.log(lasResult);
    $('#lastResult').empty();
    $('#resultDisplay').empty();
    for (let result of results) {
        if (result === results[0] && $('#titleDisplay').text() !== 'SERVER-SIDE CALCULATOR') {
            // $('#lastResult').append(`${result.calcResult}`);
            $('#calcDisplay').append(`${result.num1} ${result.operator} ${result.num2} = ${result.calcResult}`)
        }

        $('#resultDisplay').append(
            `<li id="displayHistory" data-num1="${result.num1}" data-operator="${result.operator}" data-num2="${result.num2}" data-calcResult="${result.calcResult}">
                ${result.num1} ${result.operator} ${result.num2} = ${result.calcResult} </li>`);
    }
    //ADD ID TO LI FOR DELETE REQUEST????
}

//resets number and operator variables
function clearInputs() {
    console.log('in clearInputs function');

    num1 = '';
    num2 = '';
    operator = '';
    inputNum2 = false;
    $('#calcDisplay').empty();
    $('.operator').prop('disabled', false);
}

//clears calculator display and resets disabled buttons
function clearDisplay() {
    console.log('in clearDisplay function');
    console.log($(this).attr('id'));
    if ($(this).attr('id') === 'clear') {
        $('#calcDisplay').empty();
        $('.operator').prop('disabled', false);
        $('.number').prop('disabled', false);
        $('#equal').prop('disabled', false);
    } else if ($('#titleDisplay').text() === 'SERVER-SIDE CALCULATOR') {
        $('#titleDisplay').empty()
    }

}

//clears DOM and server of history
function clearHistory() {
    console.log('in clearHistory function');

    $.ajax({
        url: '/results',
        method: 'DELETE',
    }).then((response) => {
        console.log(response);
    })

    $('#calcDisplay').empty();
    $('#lastResult').empty();
    $('#resultDisplay').empty();
    $('.operator').prop('disabled', false);
    $('.number').prop('disabled', false);
    $('#equal').prop('disabled', false);
}

//reenters a math problem selected from the results history
function recallHistory() {
    console.log('history clicked!');
    console.log($(this).data('num1'), $(this).data('operator'), $(this).data('num2'));
    num1 = $(this).data('num1');
    num2 = $(this).data('num2');
    operator = $(this).data('operator');

    console.log(num1, operator, num2);

    postResults();
}