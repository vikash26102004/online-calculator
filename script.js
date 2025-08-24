// Calculator state variables
let currentInput = '0';
let previousInput = '';
let operator = null;
let waitingForNewInput = false;
let history = '';

// Get display elements
const display = document.getElementById('display');
const historyDisplay = document.getElementById('history');

// Update the main display
function updateDisplay() {
    display.textContent = currentInput;
    historyDisplay.textContent = history;
}

// Clear all (AC)
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    waitingForNewInput = false;
    history = '';
    updateDisplay();
}

// Clear current entry (CE)
function clearEntry() {
    currentInput = '0';
    waitingForNewInput = false;
    updateDisplay();
}

// Append number to current input
function appendNumber(num) {
    if (waitingForNewInput) {
        currentInput = num;
        waitingForNewInput = false;
    } else {
        if (currentInput === '0' && num !== '.') {
            currentInput = num;
        } else {
            // Prevent multiple decimal points
            if (num === '.' && currentInput.includes('.')) {
                return;
            }
            currentInput += num;
        }
    }
    updateDisplay();
}

// Append operator
function appendOperator(op) {
    if (operator && !waitingForNewInput) {
        calculate();
    }

    previousInput = currentInput;
    operator = op;
    waitingForNewInput = true;
    
    // Update history display
    const operatorSymbol = {
        '+': '+',
        '-': '-',
        '*': '×',
        '/': '÷'
    };
    
    history = `${previousInput} ${operatorSymbol[op] || op}`;
    updateDisplay();
}

// Handle special functions
function appendFunction(func) {
    const num = parseFloat(currentInput);
    let result;

    switch (func) {
        case 'sqrt':
            if (num < 0) {
                currentInput = 'Error';
            } else {
                result = Math.sqrt(num);
                currentInput = formatResult(result);
                history = `√(${num}) =`;
            }
            break;
    }

    waitingForNewInput = true;
    updateDisplay();
}

// Perform calculation
function calculate() {
    if (!operator || waitingForNewInput) return;

    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                currentInput = 'Error';
                operator = null;
                waitingForNewInput = true;
                history += ` ${current} =`;
                updateDisplay();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }

    // Update history with complete calculation
    const operatorSymbol = {
        '+': '+',
        '-': '-',
        '*': '×',
        '/': '÷'
    };
    history = `${previousInput} ${operatorSymbol[operator]} ${current} =`;

    currentInput = formatResult(result);
    operator = null;
    waitingForNewInput = true;
    updateDisplay();
}

// Format the result to handle long decimals
function formatResult(result) {
    if (result === parseInt(result)) {
        return result.toString();
    } else {
        // Limit decimal places to prevent overflow
        return parseFloat(result.toFixed(10)).toString();
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;

    // Numbers and decimal point
    if ('0123456789.'.includes(key)) {
        event.preventDefault();
        appendNumber(key);
    }
    // Operators
    else if (key === '+' || key === '-') {
        event.preventDefault();
        appendOperator(key);
    }
    else if (key === '*') {
        event.preventDefault();
        appendOperator('*');
    }
    else if (key === '/') {
        event.preventDefault();
        appendOperator('/');
    }
    // Calculate
    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    }
    // Clear
    else if (key === 'Escape') {
        event.preventDefault();
        clearAll();
    }
    else if (key === 'Backspace') {
        event.preventDefault();
        clearEntry();
    }
});

// Initialize display
updateDisplay();