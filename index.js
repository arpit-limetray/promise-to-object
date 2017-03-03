'use strict';

var promiseToObject = function(object, opts){
    if (!object || typeof object !== 'object') {
        throw new Error('first arg must be an object or an array.');
    }
    opts = opts || {};
    var keys = Object.keys(object);
    var target;
    if (opts.copy) {
        target = object instanceof Array ? [] : {};
    } else {
        target = object;
    }
    return new Promise(function(resolve, reject) {
        if (keys.length > 0) {
            Promise.all(keys.reduce(function(agg, k) {
                if (object.hasOwnProperty(k)) {
                    if (object[k].then) {
                        agg.push(new Promise(function(resolve, reject) {
                            object[k].then(function(result) {
                                target[k] = result;
                                return resolve();
                            })
                            .catch(function(error) {
                                return reject(error);
                            })
                        }));
                    } else if (object[k] instanceof Array) {
                        target[k] = target[k] || [];
                        agg.concat(object[k].reduce(function(agg, elt, index) {
                            if (elt.then) {
                                agg.push(new Promise(function(resolve, reject) {
                                    elt.then(function(result) {
                                        target[k][index] = result;
                                        return resolve();
                                    })
                                    .catch(function(error) {
                                        return reject(error);
                                    });
                                }));
                            } else if (elt && typeof elt === 'object') {
                                agg.push(new Promise(function(resolve, reject) {
                                    return promiseToObject(elt, opts)
                                    .then(function(result) {
                                        target[k][index] = result;
                                        return resolve();
                                    })
                                    .catch(function(error) {
                                        return reject(error);
                                    });
                                }));
                            }  else {
                                target[k][index] = elt;
                            }
                            return agg;
                        }, []));
                    } else if (object[k] && typeof object[k] === 'object')  {
                        agg.push(new Promise(function(resolve, reject) {
                            promiseToObject(object[k], opts)
                            .then(function(result) {
                                target[k] = result;
                                return resolve();
                            })
                            .catch(function(error) {
                                return reject(error);
                            });
                        }));
                    } else {
                        target[k] = object[k];
                    }
                }
                return agg
            }, []))
            .then(function() {
                return resolve(target);
            })
            .catch(function(error) {
                return reject(error);
            });
        } else {
            return resolve(object);
        }
    });
};

module.exports = promiseToObject;
