const mail = require('./mail');
const db = require('./db');

function absolute(n) {
    return (n >= 0) ? n : -n
}

function greet(name) {
    return 'Welcome ' + name + "!";
}

function getCurrencies() {
    return ['USD', 'USDT', 'BCH']
}

function fizzBuzz(input) {
    if (typeof input !== 'number') {
        throw new Error('input should have a number');
    }

    if ((input % 3 === 0) && (input % 5 === 0)) {
        return 'FizzBuzz';
    }

    if (input % 3 === 0) {
        return 'Fizz';
    }

    if (input % 5 === 0) {
        return 'Buzz';
    }
    return input
}

function applyDiscount(order) {
    const customer = db.getCustomerSync(order.customerId);
    
    if (customer.points > 10) {
        order.totalPrice *= 0.9;
    }
}

function notifyCustomer(order) {
    const customer = db.getCustomerSync(order.customerId);
    mail.send(customer.email, 'your order was place successfully...')
}

module.exports.notifyCustomer = notifyCustomer;
module.exports.greet = greet;
module.exports.getCurrencies = getCurrencies;
module.exports.absolute = absolute;
module.exports.fizzBuzz = fizzBuzz;
module.exports.applyDiscount = applyDiscount;