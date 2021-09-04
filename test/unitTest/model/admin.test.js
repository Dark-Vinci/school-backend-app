const { Admin } = require("../../../model/adminM");
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('admin.genarateToken', () => {
    it ('should generate a valid web token', () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            power: 2
        }
        const user = new Admin(payload);
        const token = user.generateToken();
        const decoded = jwt.verify(token, config.get('jwt_pass'));
        
        expect(decoded).toMatchObject(payload);
    })
})