const { Parent } = require('../../../model/parentM');
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('parent.generateToken', () => {
    it ('should generate a valid web token', () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString()
        };
        const parent = new Parent(payload);
        const token = parent.generateToken();
        const decoded = jwt.verify(token, config.get('jwt_pass'));
        
        expect(decoded).toMatchObject(payload);
    })
})