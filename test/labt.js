/* const func = require('./lab');
const db = require('./db');
const mail = require('./mail');

describe('absolute', () => {
    it ('should return P+ for positive input', () => {
        const toReturn = func.absolute(1);
        expect(toReturn).toBe(1); 
    });

    it ('should return a p+ from a p_ input', () => {
        const toReturn = func.absolute(-1);
        expect(toReturn).toBe(1);
    });

    it ('should return a p+ from a 0 input', () => {
        const toReturn = func.absolute(0);
        expect(toReturn).toBe(0);
    });
});

describe('greet', () => {
    it ('greeting should contain a specified name', () => {
        const toReturn = func.greet('tommy');
        expect(toReturn).toContain('tommy'); 
    });

    it ('greeting should contain a specified name', () => {
        const toReturn = func.greet('Tommy');
        expect(toReturn).toMatch(/tommy/i); 
    });
});

describe('currency', () => {
    it ('should return supported currency..', () => {
        const toReturn = func.getCurrencies();
        expect(toReturn).toEqual(expect.arrayContaining(['USD', 'AUD', 'EUR'])) 
    });
});

describe('get product', () => {
    it ('should return the details of products', () => {
        const toReturn = func.getProduct(1);
        expect(toReturn).toMatchObject({ id: 1, price: 200  })
    });
});

describe('testing username', () => {
    it ('should scream if no username is passed', () => {
        const falsey = [ null, undefined, NaN, '', 0, false ];
        falsey.forEach((el) => {
            expect(() => { func.registerUser(el) }).toThrow()
        })
    });

    it ('should  not scream if usernamre is passed', () => {
        const toReturn = func.registerUser('name');
        expect(toReturn).not.toBeUndefined();
    });
});

describe('fizbuz', () => {
    it ('should scream if type of input is nan', () => {
     expect(() => { func.fizBuz('k') }).toThrow()
    });

    it ('should return fizbuz if number is dividible by 5&3', () => {
        const toReturn = func.fizBuz(15);
        expect(toReturn).toBe('FIZBUZ');
    });

    it ('should return fiz if number is dividible only by3', () => {
        const toReturn = func.fizBuz(9);
        expect(toReturn).toBe('FIZ');
    });

    it ('should return buz if number is dividible by 5', () => {
        const toReturn = func.fizBuz(10);
        expect(toReturn).toBe('BUZ');
    });
});

describe('mock', () => {
    it ('should apply 10% discount if customer has more than 10 points', () => {
        db.getCustomerSync = function (customerId) {
            console.log('fake reading customer')
            return { id: customerId, points: 20 }
        }
        
        const order = { customerId: 1, totalPrice: 10 };
        const toReturn = func.applyDiscount(order);
        expect(toReturn.totalPrice).toBe(9);
    });
});

describe('notifyCustomer', () => {
    it ('should send an email to customer', () => {
        db.getCustomerSync = function (customerId) {
            console.log('fake reading customer')
            return { email: 'a' }
        }

        let mailSent = false;
        mail.send = function (email, message) {
            mailSent = true;
        };
        const toReturn = func.notifyCustomer({ customerId: 1 });
        expect(mailSent).toBe(true);
    });
});

describe('notifyCustomer', () => {
    it ('should send an email to customer', () => {
        db.getCustomerSync = jest.fn().mockReturnValue({ email: 'a' })
        mail.send = jest.fn();

        func.notifyCustomer({ customerId: 1 });

        expect(mail.send).toHaveBeenCalled();
        expect(mail.send.mock.calls[0][0]).toBe('a');
        expect(mail.send.mock.calls[0][1]).toMatch(/order/)
    });
});  

 */