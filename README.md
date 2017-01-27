# Promise to object
Resolves an object containing promises, works with nested promises.
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

#### Promise rejection
Rejection will occur when first promise rejection happens.
