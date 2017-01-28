'use strict';
/*
* Test successful promise and promises returning error
* SigKill with 1 if assertion fails
*/
const assert = require('assert');
global.Promise.toObject = require('./index.js');

let testObjSucc = {
    testT: 'Hello World',
    testA: ['test', new Promise((resolve, reject) => {
        return resolve({name: 'testA'});
    })],
    testP: new Promise((resolve, reject) => {
        return resolve({name: 'testP'});
    }),
    testPp: new Promise((resolve, reject) => {
        return resolve({name: 'testPp'});
    }),
    testNested: {
        obj: new Promise((resolve, reject) => {
            return resolve({name: 'testPp'});
        }),
        testNn: {
            nested: new Promise((resolve, reject) => {
                return resolve({name: 'testPp'});
            }),
            nestedA: ['test', new Promise((resolve, reject) => {
                return resolve({name: 'testA'});
            })]
        }
    }
};

let testObjFail = {
    testT: "Hello World",
    testP: new Promise((resolve, reject) => {
        return resolve({name: 'testPp'});
    }),
    nestedFail: {
        testPp: new Promise(function(resolve, reject) {
            return reject(new Error('Promise rejected !'));
        })
    }
};
// Start with copy test as original object will be overriden later
Promise.toObject(testObjSucc, { copy: true })
.then(result => {
    assert(result !== testObjSucc);
    assert.deepEqual(result, {
        testT: 'Hello World',
        testA: ['test', {name: 'testA'}],
        testP: {
            name: 'testP'
        },
        testPp: {
            name: 'testPp'
        },
        testNested: {
            obj: { name: 'testPp' },
            testNn: {
                nested: { name: 'testPp' },
                nestedA: ['test', {name: 'testA'}]
            }
        }
    });
    return result;
})
.catch(error => {
    console.error(error);
    console.error('Successful promise with copy test fails.');
    process.exit(1);
})
.then(result => {
    console.log('Successful promise with copy test passes.');
    // start promise without copy
    return Promise.toObject(testObjSucc);
})
.catch(error => {
    console.error(error);
    console.error('Successful promise without copy test fails.');
    process.exit(1);
})
.then(result => {
    try {
        assert.deepEqual(result, testObjSucc);
        assert.deepEqual(result, {
            testT: 'Hello World',
            testA: ['test', {name: 'testA'}],
            testP: {
                name: 'testP'
            },
            testPp: {
                name: 'testPp'
            },
            testNested: {
                obj: { name: 'testPp' },
                testNn: {
                    nested: { name: 'testPp' },
                    nestedA: ['test', {name: 'testA'}]
                }
            }
        });
        console.log('Successful promise without copy test passes.');
    } catch(error){
        console.error(error);
        console.log('Successful promise without copy test fails.');
        process.exit(1);
    }
    // starting promise doomed to fail with copy
    return Promise.toObject(testObjFail);
})
.catch(error => {
    assert(error instanceof Error);
    assert.equal(error.message, 'Promise rejected !');
    console.log('Failed promise test passes.');
    console.log(' -------------------');
    console.log('\\o/ Test successful !');
    console.log(' -------------------');
})
.catch(error => {
    console.error(error);
    console.error('Failed promise test fails.');
    process.exit(1);
});
