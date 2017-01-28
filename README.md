# Promise to object
Resolves an object containing promises, works with nested promises and arrays.
Works with Bluebird.

### How to use ?


#### Basic usage :

```javascript
global.Promise.toObject = require('promise-to-object');

Promise.toObject({
    foo: 'bar',
    greet: new Promise((resolve, reject) => {
        resolve('Hello world !');
    })
};)
.then(result => {
    console.log(result.foo); // bar
    console.log(result.greet); // Hello world !
})
.catch(error => {
    console.error(error);
});

```

#### Copying the original object :
Useful if you intend to reuse the object with promises later.

```javascript
Promise.toObject(someObjectWithPromises, { copy: true })
```

#### Works with unlimited nested objects :

```javascript
let someObjectWithPromises = {
    foo: 'bar',
    nested: {
        nestedGreeting: new Promise((resolve, reject) => {
            resolve('Hello world !');
        })
    }
};
Promise.toObject(someObjectWithPromises, { copy: true })
.then(result => {
    console.log(result.foo); // bar
    console.log(result.nested.nestedGreeting); // Hello world !
})
```

#### Works with Arrays
Mixed arrays will return the array with the result of promise at the same index
the promise was.
Example :
```javascript
Promise.toObject({
    foo: 'bar',
    someArrayWithPromises: [
        'hello',
        new Promise((resolve, reject) => {
            return resolve('world !');
        })
    ]
})
.then(result => {
    console.log(result.foo); // bar
    console.log(result.someArrayWithPromises); // ['hello', 'world !']
})
```

#### Promise rejection
Rejection will occur when first promise rejection happens.
