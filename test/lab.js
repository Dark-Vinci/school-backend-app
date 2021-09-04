const db = require('./db');
const mail = require('./mail')

module.exports.absolute = function (num) {
    return (num >= 0) ? num :  -num;
}

module.exports.greet = function (name) {
    return `helloo ${name}`;
}

module.exports.getCurrencies = function() {
    return ['USD', 'AUD', 'EUR'];
};

module.exports.getProduct = function (productId) {
    return { id: productId, price: 200 }
}

module.exports.registerUser = function (username) {
    if (!username) throw new Error('username is required');
    return { id: new Date().getTime(), username: username }
}

module.exports.fizBuz = function (inp) {
    if (typeof inp !== 'number') {
        throw new Error('input should be a number');
    }

    if ((inp % 3 === 0) && (inp % 5 === 0)) {
        return 'FIZBUZ'
    }

    if (inp % 3 === 0) {
        return 'FIZ'
    }

    if (inp % 5 === 0) {
        return 'BUZ'
    }

    return inp
}

module.exports.applyDiscount = function (order) {
    const customer = db.getCustomerSync(order.customerId);

    if (customer.points > 0) {
        order.totalPrice *= 0.9;
    }

    return order;
}

module.exports.notifyCustomer = function (order) {
    const customer = db.getCustomerSync(order.customerId);
    mail.send(customer.email, 'your order was placed successfully')
}