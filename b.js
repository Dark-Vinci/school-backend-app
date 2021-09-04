const bcrypt = require('bcrypt');
async function fun() {
    let valid = await bcrypt.compare('abcdef', '$2b$10$nHAORHWx.v/snJdcwA/ibuUpjwT68bA9kIWQOqxVCpn3e1GzBP1rO');
    console.log(valid)
}

fun()

async function tr(p) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(p, salt);
    console.log(hash)
}

// tr('abcdef')