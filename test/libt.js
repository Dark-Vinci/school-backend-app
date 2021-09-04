// const lion = require('./lion');
// const db = require('./db');
// const mail = require('./mail');
// const { User } = require('../models/registerM');
// const jwt = require('jsonwebtoken');
// const config = require('config');
// const mongoose = require('mongoose');

// describe('greet', () => {
//     it('should return the greeating message', () => {
//         const result = lion.greet('Tomiwa');
//         expect(result).toContain('Tomiwa');
//     })
// })

// describe('getCurrencies', () => {
//     it('should return supported currencies', () => {
//         const result = lion.getCurrencies();
//         expect(result).toEqual(expect.arrayContaining(['USD', 'USDT', 'BCH']))
//     })
// })

// describe('fizbuzz', () => {
//     it('should throw am error if input is nan', () => {
//         expect(() => { lion.fizzBuzz('jdk') }).toThrow()
//     })

//     it('should return fizbuzz if the input is divisible both by 3 and 5', () => {
//         const result = lion.fizzBuzz(15)
//         expect(result).toEqual('FizzBuzz')
//     })

//     it('should return fizbuzz if the input is divisible only by 3', () => {
//         const result = lion.fizzBuzz(3)
//         expect(result).toEqual('Fizz')
//     })

//     it('should return fizbuzz if the input is divisible only by 5', () => {
//         const result = lion.fizzBuzz(5)
//         expect(result).toEqual('Buzz')
//     })

//     it('should return fizbuzz if the input is not divisible only by 5 or 3', () => {
//         const result = lion.fizzBuzz(11)
//         expect(result).toBe(result)
//     })
// })

// describe('getPrice', () => {
//     it('should apply a 10% of the total price is a customer has ponts > 10', () => {
//         db.getCustomerSync = function(customerId) {
//             return { id: customerId, points: 20 } ;
//         }
        
//         const order = { customerId: 1, totalPrice: 10 };
//         lion.applyDiscount(order);
//         expect(order.totalPrice).toBe(9)
//     })
// });

// describe('mail customer', () => {
//     it('should send an email to a customer', () => {
//         db.getCustomerSync = function(customerId) {
//             return { email: 'a' } ;
//         }

//         let mailSent = false;
//         mail.send = function (email, message) {
//             mailSent = true;
//         }
//         lion.notifyCustomer({ customerId: 1 });
//         expect(mailSent).toBe(true)
//     });
// })

// describe('mail customer', () => {
//     it('should send an email to a customer', () => {
//         db.getCustomerSync = jest.fn().mockReturnValue({ email: 'a' });
//         mail.send = jest.fn()

//         lion.notifyCustomer({ customerId: 1 });
        
//         expect(mail.send).toHaveBeenCalled();
//         expect(mail.send.mock.calls[0][0]).toBe('a');
//         expect(mail.send.mock.calls[0][1]).toMatch(/order/)
//     });
// })

// describe('wt genetaion', () => {
//     it('should generate a valid jwt', () => {
//         const payLoad = {
//             _id: new mongoose.Types.ObjectId().toHexString(),
//             isAdmin: true 
//         };
//         const user = new User(payLoad);
//         const token = user.generateToken()
//         const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
//         expect(decoded).toMatchObject(payLoad)
//     })
// })















/*
describe('absolute', () => {
    it('- should return a positive number for positive input', () => {
        const result = absolute(1);
        expect(result).toBe(1);
    });

    it(' should return 0 for input 0', () => {
        const result = absolute(0);
        expect(result).toBe(0);
    });

    it(' - should return  a positive number for nagetive input', () => {
        const result = absolute(-1);
        expect(result).toBe(1);
    });
})*/
  