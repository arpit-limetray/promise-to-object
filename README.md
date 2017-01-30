# Promise to object
Resolves an object containing promises, works with nested promises and arrays.
Works with Bluebird.

Resolution is concurrent.

### How to use ?


#### Basic usage :

```javascript
global.Promise.toObject = require('promise-to-object');

Promise.toObject({
    foo: 'bar',
    greet: Promise.resolve('Hello world !')
})
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
        nestedGreeting: Promise.resolve('Hello world !')
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

Example with Array as first arg :
```javascript
Promise.toObject([
    'foo',
    Promise.resolve('bar'),
    {
        hello: Promise.resolve('world')
    }
])
.then(result => {
    console.log(result); // [ 'foo', 'bar', { hello: 'world' } ]
});
```
Or array in object :
```javascript
Promise.toObject({
    foo: 'bar',
    someArrayWithPromises: [
        'hello',
        Promise.resolve('world !')
    ]
})
.then(result => {
    console.log(result); // { foo: bar, someArrayWithPromises: ['hello', 'world !'] }
})
```

#### Promise rejection
Rejection will occur when first promise rejection happens.

```javascript
Promise.toObject({
    foo: new Promise((resolve, reject) => {
        setTimeout(() => reject('1st promise rejection.'), 300)
    }),
    bar: new Promise((resolve, reject) => {
        setTimeout(() => reject('2nd promise rejection.'), 100)
    })
})
.catch(error => {
    console.log(error); // 2nd promise rejection.
});
```
