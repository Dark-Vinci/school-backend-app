module.exports.getCustomerSync = function(id) {
    console.log('getting customer from the database...');
    return { id: id, points: 11 };
}

module.exports.getCustomer = async function  (id) {
    return new Promise((resolve, reject) => {
        console.log('reading a customer from mongo...');
        resolve({ id: id, points: 11})
    })
}