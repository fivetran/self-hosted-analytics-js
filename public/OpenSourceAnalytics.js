(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.analytics = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
    'use strict';
    /**
     * Analytics.js
     *
     * (C) 2015 Segment.io Inc.
     */

    var analytics = require('@segment/analytics.js-core');
    var Integrations = require('./integrations');

    /**
     * Expose the `analytics` singleton.
     */

    module.exports = exports = analytics;

    /**
     * Expose require.
     */

    analytics.require = require;

    /**
     * Expose `VERSION`.
     */

    exports.VERSION = require('../package.json').version;

    /**
     * Add integrations.
     */

    Object.keys(Integrations).forEach(function(name) {
      analytics.use(Integrations[name]);
    });

    },{"../package.json":120,"./integrations":2,"@segment/analytics.js-core":22}],2:[function(require,module,exports){
    /* eslint quote-props: off */
    'use strict';

    /*
     Add all integrations you want registered here.
     Integration repos: https://github.com/segment-integrations?utf8=%E2%9C%93&query=analytics.js
     Make sure the integrations added are also installed and saved in the package.json
     */
    module.exports = {
      'segmentio': require('@segment/analytics.js-integration-segmentio')
    };

    },{"@segment/analytics.js-integration-segmentio":30}],3:[function(require,module,exports){
    'use strict';

    /*
     * Module dependencies.
     */

    var arity = require('@ndhoule/arity');

    var objToString = Object.prototype.toString;

    /**
     * Determine if a value is a function.
     *
     * @param {*} val
     * @return {boolean}
     */
    // TODO: Move to lib
    var isFunction = function(val) {
      return typeof val === 'function';
    };

    /**
     * Determine if a value is a number.
     *
     * @param {*} val
     * @return {boolean}
     */
    // TODO: Move to lib
    var isNumber = function(val) {
      var type = typeof val;
      return type === 'number' || (type === 'object' && objToString.call(val) === '[object Number]');
    };

    /**
     * Wrap a function `fn` in a function that will invoke `fn` when invoked `n` or
     * more times.
     *
     * @name after
     * @api public
     * @category Function
     * @param {Number} n The number of
     * @param {Function} fn The function to wrap.
     * @return {Function} A function that will call `fn` after `n` or more
     * invocations.
     * @example
     */
    var after = function after(n, fn) {
      if (!isNumber(n)) {
        throw new TypeError('Expected a number but received ' + typeof n);
      }

      if (!isFunction(fn)) {
        throw new TypeError('Expected a function but received ' + typeof fn);
      }

      var callCount = 0;

      return arity(fn.length, function() {
        callCount += 1;

        if (callCount < n) {
          return;
        }

        return fn.apply(this, arguments);
      });
    };

    /*
     * Exports.
     */

    module.exports = after;

    },{"@ndhoule/arity":4}],4:[function(require,module,exports){
    'use strict';

    var objToString = Object.prototype.toString;

    /**
     * Determine if a value is a function.
     *
     * @param {*} val
     * @return {boolean}
     */
    // TODO: Move to lib
    var isFunction = function(val) {
      return typeof val === 'function';
    };

    /**
     * Determine if a value is a number.
     *
     * @param {*} val
     * @return {boolean}
     */
    // TODO: Move to lib
    var isNumber = function(val) {
      var type = typeof val;
      return type === 'number' || (type === 'object' && objToString.call(val) === '[object Number]');
    };

     /**
      * Creates an array of generic, numbered argument names.
      *
      * @name createParams
      * @api private
      * @param {number} n
      * @return {Array}
      * @example
      * argNames(2);
      * //=> ['arg1', 'arg2']
      */
    var createParams = function createParams(n) {
      var args = [];

      for (var i = 1; i <= n; i += 1) {
        args.push('arg' + i);
      }

      return args;
    };

     /**
      * Dynamically construct a wrapper function of `n` arity that.
      *
      * If at all possible, prefer a function from the arity wrapper cache above to
      * avoid allocating a new function at runtime.
      *
      * @name createArityWrapper
      * @api private
      * @param {number} n
      * @return {Function(Function)}
      */
    var createArityWrapper = function createArityWrapper(n) {
      var paramNames = createParams(n).join(', ');
      var wrapperBody = ''.concat(
        '  return function(', paramNames, ') {\n',
        '    return func.apply(this, arguments);\n',
        '  };'
      );

      /* eslint-disable no-new-func */
      return new Function('func', wrapperBody);
      /* eslint-enable no-new-func */
    };

    // Cache common arity wrappers to avoid constructing them at runtime
    var arityWrapperCache = [
      /* eslint-disable no-unused-vars */
      function(fn) {
        return function() {
          return fn.apply(this, arguments);
        };
      },

      function(fn) {
        return function(arg1) {
          return fn.apply(this, arguments);
        };
      },

      function(fn) {
        return function(arg1, arg2) {
          return fn.apply(this, arguments);
        };
      },

      function(fn) {
        return function(arg1, arg2, arg3) {
          return fn.apply(this, arguments);
        };
      },

      function(fn) {
        return function(arg1, arg2, arg3, arg4) {
          return fn.apply(this, arguments);
        };
      },

      function(fn) {
        return function(arg1, arg2, arg3, arg4, arg5) {
          return fn.apply(this, arguments);
        };
      }
      /* eslint-enable no-unused-vars */
    ];

    /**
     * Takes a function and an [arity](https://en.wikipedia.org/wiki/Arity) `n`, and returns a new
     * function that expects `n` arguments.
     *
     * @name arity
     * @api public
     * @category Function
     * @see {@link curry}
     * @param {Number} n The desired arity of the returned function.
     * @param {Function} fn The function to wrap.
     * @return {Function} A function of n arity, wrapping `fn`.
     * @example
     * var add = function(a, b) {
     *   return a + b;
     * };
     *
     * // Check the number of arguments this function expects by accessing `.length`:
     * add.length;
     * //=> 2
     *
     * var unaryAdd = arity(1, add);
     * unaryAdd.length;
     * //=> 1
     */
    var arity = function arity(n, func) {
      if (!isFunction(func)) {
        throw new TypeError('Expected a function but got ' + typeof func);
      }

      n = Math.max(isNumber(n) ? n : 0, 0);

      if (!arityWrapperCache[n]) {
        arityWrapperCache[n] = createArityWrapper(n);
      }

      return arityWrapperCache[n](func);
    };

    /*
     * Exports.
     */

    module.exports = arity;

    },{}],5:[function(require,module,exports){
    'use strict';

    /*
     * Module dependencies.
     */

    var type = require('component-type');

    /**
     * Deeply clone an object.
     *
     * @param {*} obj Any object.
     */

    var clone = function clone(obj) {
      var t = type(obj);

      if (t === 'object') {
        var copy = {};
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            copy[key] = clone(obj[key]);
          }
        }
        return copy;
      }

      if (t === 'array') {
        var copy = new Array(obj.length);
        for (var i = 0, l = obj.length; i < l; i++) {
          copy[i] = clone(obj[i]);
        }
        return copy;
      }

      if (t === 'regexp') {
        // from millermedeiros/amd-utils - MIT
        var flags = '';
        flags += obj.multiline ? 'm' : '';
        flags += obj.global ? 'g' : '';
        flags += obj.ignoreCase ? 'i' : '';
        return new RegExp(obj.source, flags);
      }

      if (t === 'date') {
        return new Date(obj.getTime());
      }

      // string, number, boolean, etc.
      return obj;
    };

    /*
     * Exports.
     */

    module.exports = clone;

    },{"component-type":73}],6:[function(require,module,exports){
    'use strict';

    /*
     * Module dependencies.
     */

    var drop = require('@ndhoule/drop');
    var rest = require('@ndhoule/rest');

    var has = Object.prototype.hasOwnProperty;
    var objToString = Object.prototype.toString;

    /**
     * Returns `true` if a value is an object, otherwise `false`.
     *
     * @name isObject
     * @api private
     * @param {*} val The value to test.
     * @return {boolean}
     */
    // TODO: Move to a library
    var isObject = function isObject(value) {
      return Boolean(value) && typeof value === 'object';
    };

    /**
     * Returns `true` if a value is a plain object, otherwise `false`.
     *
     * @name isPlainObject
     * @api private
     * @param {*} val The value to test.
     * @return {boolean}
     */
    // TODO: Move to a library
    var isPlainObject = function isPlainObject(value) {
      return Boolean(value) && objToString.call(value) === '[object Object]';
    };

    /**
     * Assigns a key-value pair to a target object when the value assigned is owned,
     * and where target[key] is undefined.
     *
     * @name shallowCombiner
     * @api private
     * @param {Object} target
     * @param {Object} source
     * @param {*} value
     * @param {string} key
     */
    var shallowCombiner = function shallowCombiner(target, source, value, key) {
      if (has.call(source, key) && target[key] === undefined) {
        target[key] = value;
      }
      return source;
    };

    /**
     * Assigns a key-value pair to a target object when the value assigned is owned,
     * and where target[key] is undefined; also merges objects recursively.
     *
     * @name deepCombiner
     * @api private
     * @param {Object} target
     * @param {Object} source
     * @param {*} value
     * @param {string} key
     * @return {Object}
     */
    var deepCombiner = function(target, source, value, key) {
      if (has.call(source, key)) {
        if (isPlainObject(target[key]) && isPlainObject(value)) {
            target[key] = defaultsDeep(target[key], value);
        } else if (target[key] === undefined) {
            target[key] = value;
        }
      }

      return source;
    };

    /**
     * TODO: Document
     *
     * @name defaultsWith
     * @api private
     * @param {Function} combiner
     * @param {Object} target
     * @param {...Object} sources
     * @return {Object} Return the input `target`.
     */
    var defaultsWith = function(combiner, target /*, ...sources */) {
      if (!isObject(target)) {
        return target;
      }

      combiner = combiner || shallowCombiner;
      var sources = drop(2, arguments);

      for (var i = 0; i < sources.length; i += 1) {
        for (var key in sources[i]) {
          combiner(target, sources[i], sources[i][key], key);
        }
      }

      return target;
    };

    /**
     * Copies owned, enumerable properties from a source object(s) to a target
     * object when the value of that property on the source object is `undefined`.
     * Recurses on objects.
     *
     * @name defaultsDeep
     * @api public
     * @param {Object} target
     * @param {...Object} sources
     * @return {Object} The input `target`.
     */
    var defaultsDeep = function defaultsDeep(target /*, sources */) {
      // TODO: Replace with `partial` call?
      return defaultsWith.apply(null, [deepCombiner, target].concat(rest(arguments)));
    };

    /**
     * Copies owned, enumerable properties from a source object(s) to a target
     * object when the value of that property on the source object is `undefined`.
     *
     * @name defaults
     * @api public
     * @param {Object} target
     * @param {...Object} sources
     * @return {Object}
     * @example
     * var a = { a: 1 };
     * var b = { a: 2, b: 2 };
     *
     * defaults(a, b);
     * console.log(a); //=> { a: 1, b: 2 }
     */
    var defaults = function(target /*, ...sources */) {
      // TODO: Replace with `partial` call?
      return defaultsWith.apply(null, [null, target].concat(rest(arguments)));
    };

    /*
     * Exports.
     */

    module.exports = defaults;
    module.exports.deep = defaultsDeep;

    },{"@ndhoule/drop":7,"@ndhoule/rest":16}],7:[function(require,module,exports){
    'use strict';

    var max = Math.max;

    /**
     * Produce a new array composed of all but the first `n` elements of an input `collection`.
     *
     * @name drop
     * @api public
     * @param {number} count The number of elements to drop.
     * @param {Array} collection The collection to iterate over.
     * @return {Array} A new array containing all but the first element from `collection`.
     * @example
     * drop(0, [1, 2, 3]); // => [1, 2, 3]
     * drop(1, [1, 2, 3]); // => [2, 3]
     * drop(2, [1, 2, 3]); // => [3]
     * drop(3, [1, 2, 3]); // => []
     * drop(4, [1, 2, 3]); // => []
     */
    var drop = function drop(count, collection) {
      var length = collection ? collection.length : 0;

      if (!length) {
        return [];
      }

      // Preallocating an array *significantly* boosts performance when dealing with
      // `arguments` objects on v8. For a summary, see:
      // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
      var toDrop = max(Number(count) || 0, 0);
      var resultsLength = max(length - toDrop, 0);
      var results = new Array(resultsLength);

      for (var i = 0; i < resultsLength; i += 1) {
        results[i] = collection[i + toDrop];
      }

      return results;
    };

    /*
     * Exports.
     */

    module.exports = drop;

    },{}],8:[function(require,module,exports){
    'use strict';

    /*
     * Module dependencies.
     */

    var keys = require('@ndhoule/keys');

    var objToString = Object.prototype.toString;

    /**
     * Tests if a value is a number.
     *
     * @name isNumber
     * @api private
     * @param {*} val The value to test.
     * @return {boolean} Returns `true` if `val` is a number, otherwise `false`.
     */
    // TODO: Move to library
    var isNumber = function isNumber(val) {
      var type = typeof val;
      return type === 'number' || (type === 'object' && objToString.call(val) === '[object Number]');
    };

    /**
     * Tests if a value is an array.
     *
     * @name isArray
     * @api private
     * @param {*} val The value to test.
     * @return {boolean} Returns `true` if the value is an array, otherwise `false`.
     */
    // TODO: Move to library
    var isArray = typeof Array.isArray === 'function' ? Array.isArray : function isArray(val) {
      return objToString.call(val) === '[object Array]';
    };

    /**
     * Tests if a value is array-like. Array-like means the value is not a function and has a numeric
     * `.length` property.
     *
     * @name isArrayLike
     * @api private
     * @param {*} val
     * @return {boolean}
     */
    // TODO: Move to library
    var isArrayLike = function isArrayLike(val) {
      return val != null && (isArray(val) || (val !== 'function' && isNumber(val.length)));
    };

    /**
     * Internal implementation of `each`. Works on arrays and array-like data structures.
     *
     * @name arrayEach
     * @api private
     * @param {Function(value, key, collection)} iterator The function to invoke per iteration.
     * @param {Array} array The array(-like) structure to iterate over.
     * @return {undefined}
     */
    var arrayEach = function arrayEach(iterator, array) {
      for (var i = 0; i < array.length; i += 1) {
        // Break iteration early if `iterator` returns `false`
        if (iterator(array[i], i, array) === false) {
          break;
        }
      }
    };

    /**
     * Internal implementation of `each`. Works on objects.
     *
     * @name baseEach
     * @api private
     * @param {Function(value, key, collection)} iterator The function to invoke per iteration.
     * @param {Object} object The object to iterate over.
     * @return {undefined}
     */
    var baseEach = function baseEach(iterator, object) {
      var ks = keys(object);

      for (var i = 0; i < ks.length; i += 1) {
        // Break iteration early if `iterator` returns `false`
        if (iterator(object[ks[i]], ks[i], object) === false) {
          break;
        }
      }
    };

    /**
     * Iterate over an input collection, invoking an `iterator` function for each element in the
     * collection and passing to it three arguments: `(value, index, collection)`. The `iterator`
     * function can end iteration early by returning `false`.
     *
     * @name each
     * @api public
     * @param {Function(value, key, collection)} iterator The function to invoke per iteration.
     * @param {Array|Object|string} collection The collection to iterate over.
     * @return {undefined} Because `each` is run only for side effects, always returns `undefined`.
     * @example
     * var log = console.log.bind(console);
     *
     * each(log, ['a', 'b', 'c']);
     * //-> 'a', 0, ['a', 'b', 'c']
     * //-> 'b', 1, ['a', 'b', 'c']
     * //-> 'c', 2, ['a', 'b', 'c']
     * //=> undefined
     *
     * each(log, 'tim');
     * //-> 't', 2, 'tim'
     * //-> 'i', 1, 'tim'
     * //-> 'm', 0, 'tim'
     * //=> undefined
     *
     * // Note: Iteration order not guaranteed across environments
     * each(log, { name: 'tim', occupation: 'enchanter' });
     * //-> 'tim', 'name', { name: 'tim', occupation: 'enchanter' }
     * //-> 'enchanter', 'occupation', { name: 'tim', occupation: 'enchanter' }
     * //=> undefined
     */
    var each = function each(iterator, collection) {
      return (isArrayLike(collection) ? arrayEach : baseEach).call(this, iterator, collection);
    };

    /*
     * Exports.
     */

    module.exports = each;

    },{"@ndhoule/keys":13}],9:[function(require,module,exports){
    'use strict';

    /*
     * Module dependencies.
     */

    var each = require('@ndhoule/each');

    /**
     * Check if a predicate function returns `true` for all values in a `collection`.
     * Checks owned, enumerable values and exits early when `predicate` returns
     * `false`.
     *
     * @name every
     * @param {Function} predicate The function used to test values.
     * @param {Array|Object|string} collection The collection to search.
     * @return {boolean} True if all values passes the predicate test, otherwise false.
     * @example
     * var isEven = function(num) { return num % 2 === 0; };
     *
     * every(isEven, []); // => true
     * every(isEven, [1, 2]); // => false
     * every(isEven, [2, 4, 6]); // => true
     */
    var every = function every(predicate, collection) {
      if (typeof predicate !== 'function') {
        throw new TypeError('`predicate` must be a function but was a ' + typeof predicate);
      }

      var result = true;

      each(function(val, key, collection) {
        result = !!predicate(val, key, collection);

        // Exit early
        if (!result) {
          return false;
        }
      }, collection);

      return result;
    };

    /*
     * Exports.
     */

    module.exports = every;

    },{"@ndhoule/each":8}],10:[function(require,module,exports){
    'use strict';

    var has = Object.prototype.hasOwnProperty;

    /**
     * Copy the properties of one or more `objects` onto a destination object. Input objects are iterated over
     * in left-to-right order, so duplicate properties on later objects will overwrite those from
     * erevious ones. Only enumerable and own properties of the input objects are copied onto the
     * resulting object.
     *
     * @name extend
     * @api public
     * @category Object
     * @param {Object} dest The destination object.
     * @param {...Object} sources The source objects.
     * @return {Object} `dest`, extended with the properties of all `sources`.
     * @example
     * var a = { a: 'a' };
     * var b = { b: 'b' };
     * var c = { c: 'c' };
     *
     * extend(a, b, c);
     * //=> { a: 'a', b: 'b', c: 'c' };
     */
    var extend = function extend(dest /*, sources */) {
      var sources = Array.prototype.slice.call(arguments, 1);

      for (var i = 0; i < sources.length; i += 1) {
        for (var key in sources[i]) {
          if (has.call(sources[i], key)) {
            dest[key] = sources[i][key];
          }
        }
      }

      return dest;
    };

    /*
     * Exports.
     */

    module.exports = extend;

    },{}],11:[function(require,module,exports){
    'use strict';

    /*
     * Module dependencies.
     */

    var each = require('@ndhoule/each');

    /**
     * Reduces all the values in a collection down into a single value. Does so by iterating through the
     * collection from left to right, repeatedly calling an `iterator` function and passing to it four
     * arguments: `(accumulator, value, index, collection)`.
     *
     * Returns the final return value of the `iterator` function.
     *
     * @name foldl
     * @api public
     * @param {Function} iterator The function to invoke per iteration.
     * @param {*} accumulator The initial accumulator value, passed to the first invocation of `iterator`.
     * @param {Array|Object} collection The collection to iterate over.
     * @return {*} The return value of the final call to `iterator`.
     * @example
     * foldl(function(total, n) {
     *   return total + n;
     * }, 0, [1, 2, 3]);
     * //=> 6
     *
     * var phonebook = { bob: '555-111-2345', tim: '655-222-6789', sheila: '655-333-1298' };
     *
     * foldl(function(results, phoneNumber) {
     *  if (phoneNumber[0] === '6') {
     *    return results.concat(phoneNumber);
     *  }
     *  return results;
     * }, [], phonebook);
     * // => ['655-222-6789', '655-333-1298']
     */
    var foldl = function foldl(iterator, accumulator, collection) {
      if (typeof iterator !== 'function') {
        throw new TypeError('Expected a function but received a ' + typeof iterator);
      }

      each(function(val, i, collection) {
        accumulator = iterator(accumulator, val, i, collection);
      }, collection);

      return accumulator;
    };

    /*
     * Exports.
     */

    module.exports = foldl;

    },{"@ndhoule/each":8}],12:[function(require,module,exports){
    'use strict';

    /*
     * Module dependencies.
     */

    var each = require('@ndhoule/each');

    var strIndexOf = String.prototype.indexOf;

    /**
     * Object.is/sameValueZero polyfill.
     *
     * @api private
     * @param {*} value1
     * @param {*} value2
     * @return {boolean}
     */
    // TODO: Move to library
    var sameValueZero = function sameValueZero(value1, value2) {
      // Normal values and check for 0 / -0
      if (value1 === value2) {
        return value1 !== 0 || 1 / value1 === 1 / value2;
      }
      // NaN
      return value1 !== value1 && value2 !== value2;
    };

    /**
     * Searches a given `collection` for a value, returning true if the collection
     * contains the value and false otherwise. Can search strings, arrays, and
     * objects.
     *
     * @name includes
     * @api public
     * @param {*} searchElement The element to search for.
     * @param {Object|Array|string} collection The collection to search.
     * @return {boolean}
     * @example
     * includes(2, [1, 2, 3]);
     * //=> true
     *
     * includes(4, [1, 2, 3]);
     * //=> false
     *
     * includes(2, { a: 1, b: 2, c: 3 });
     * //=> true
     *
     * includes('a', { a: 1, b: 2, c: 3 });
     * //=> false
     *
     * includes('abc', 'xyzabc opq');
     * //=> true
     *
     * includes('nope', 'xyzabc opq');
     * //=> false
     */
    var includes = function includes(searchElement, collection) {
      var found = false;

      // Delegate to String.prototype.indexOf when `collection` is a string
      if (typeof collection === 'string') {
        return strIndexOf.call(collection, searchElement) !== -1;
      }

      // Iterate through enumerable/own array elements and object properties.
      each(function(value) {
        if (sameValueZero(value, searchElement)) {
          found = true;
          // Exit iteration early when found
          return false;
        }
      }, collection);

      return found;
    };

    /*
     * Exports.
     */

    module.exports = includes;

    },{"@ndhoule/each":8}],13:[function(require,module,exports){
    'use strict';

    var hop = Object.prototype.hasOwnProperty;
    var strCharAt = String.prototype.charAt;
    var toStr = Object.prototype.toString;

    /**
     * Returns the character at a given index.
     *
     * @param {string} str
     * @param {number} index
     * @return {string|undefined}
     */
    // TODO: Move to a library
    var charAt = function(str, index) {
      return strCharAt.call(str, index);
    };

    /**
     * hasOwnProperty, wrapped as a function.
     *
     * @name has
     * @api private
     * @param {*} context
     * @param {string|number} prop
     * @return {boolean}
     */

    // TODO: Move to a library
    var has = function has(context, prop) {
      return hop.call(context, prop);
    };

    /**
     * Returns true if a value is a string, otherwise false.
     *
     * @name isString
     * @api private
     * @param {*} val
     * @return {boolean}
     */

    // TODO: Move to a library
    var isString = function isString(val) {
      return toStr.call(val) === '[object String]';
    };

    /**
     * Returns true if a value is array-like, otherwise false. Array-like means a
     * value is not null, undefined, or a function, and has a numeric `length`
     * property.
     *
     * @name isArrayLike
     * @api private
     * @param {*} val
     * @return {boolean}
     */
    // TODO: Move to a library
    var isArrayLike = function isArrayLike(val) {
      return val != null && (typeof val !== 'function' && typeof val.length === 'number');
    };


    /**
     * indexKeys
     *
     * @name indexKeys
     * @api private
     * @param {} target
     * @param {Function} pred
     * @return {Array}
     */
    var indexKeys = function indexKeys(target, pred) {
      pred = pred || has;

      var results = [];

      for (var i = 0, len = target.length; i < len; i += 1) {
        if (pred(target, i)) {
          results.push(String(i));
        }
      }

      return results;
    };

    /**
     * Returns an array of an object's owned keys.
     *
     * @name objectKeys
     * @api private
     * @param {*} target
     * @param {Function} pred Predicate function used to include/exclude values from
     * the resulting array.
     * @return {Array}
     */
    var objectKeys = function objectKeys(target, pred) {
      pred = pred || has;

      var results = [];

      for (var key in target) {
        if (pred(target, key)) {
          results.push(String(key));
        }
      }

      return results;
    };

    /**
     * Creates an array composed of all keys on the input object. Ignores any non-enumerable properties.
     * More permissive than the native `Object.keys` function (non-objects will not throw errors).
     *
     * @name keys
     * @api public
     * @category Object
     * @param {Object} source The value to retrieve keys from.
     * @return {Array} An array containing all the input `source`'s keys.
     * @example
     * keys({ likes: 'avocado', hates: 'pineapple' });
     * //=> ['likes', 'pineapple'];
     *
     * // Ignores non-enumerable properties
     * var hasHiddenKey = { name: 'Tim' };
     * Object.defineProperty(hasHiddenKey, 'hidden', {
     *   value: 'i am not enumerable!',
     *   enumerable: false
     * })
     * keys(hasHiddenKey);
     * //=> ['name'];
     *
     * // Works on arrays
     * keys(['a', 'b', 'c']);
     * //=> ['0', '1', '2']
     *
     * // Skips unpopulated indices in sparse arrays
     * var arr = [1];
     * arr[4] = 4;
     * keys(arr);
     * //=> ['0', '4']
     */
    var keys = function keys(source) {
      if (source == null) {
        return [];
      }

      // IE6-8 compatibility (string)
      if (isString(source)) {
        return indexKeys(source, charAt);
      }

      // IE6-8 compatibility (arguments)
      if (isArrayLike(source)) {
        return indexKeys(source, has);
      }

      return objectKeys(source);
    };

    /*
     * Exports.
     */

    module.exports = keys;

    },{}],14:[function(require,module,exports){
    'use strict';

    /*
     * Module dependencies.
     */

    var each = require('@ndhoule/each');

    /**
     * Produce a new array by passing each value in the input `collection` through a transformative
     * `iterator` function. The `iterator` function is passed three arguments:
     * `(value, index, collection)`.
     *
     * @name map
     * @api public
     * @param {Function} iterator The transformer function to invoke per iteration.
     * @param {Array} collection The collection to iterate over.
     * @return {Array} A new array containing the results of each `iterator` invocation.
     * @example
     * var square = function(x) { return x * x; };
     *
     * map(square, [1, 2, 3]);
     * //=> [1, 4, 9]
     */
    var map = function map(iterator, collection) {
      if (typeof iterator !== 'function') {
        throw new TypeError('Expected a function but received a ' + typeof iterator);
      }

      var result = [];

      each(function(val, i, collection) {
        result.push(iterator(val, i, collection));
      }, collection);

      return result;
    };

    /*
     * Exports.
     */

    module.exports = map;

    },{"@ndhoule/each":8}],15:[function(require,module,exports){
    'use strict';

    var objToString = Object.prototype.toString;

    // TODO: Move to lib
    var existy = function(val) {
      return val != null;
    };

    // TODO: Move to lib
    var isArray = function(val) {
      return objToString.call(val) === '[object Array]';
    };

    // TODO: Move to lib
    var isString = function(val) {
       return typeof val === 'string' || objToString.call(val) === '[object String]';
    };

    // TODO: Move to lib
    var isObject = function(val) {
      return val != null && typeof val === 'object';
    };

    /**
     * Returns a copy of the new `object` containing only the specified properties.
     *
     * @name pick
     * @api public
     * @param {string|string[]} props The property or properties to keep.
     * @param {Object} object The object to iterate over.
     * @return {Object} A new object containing only the specified properties from `object`.
     * @example
     * var person = { name: 'Tim', occupation: 'enchanter', fears: 'rabbits' };
     *
     * pick('name', person);
     * //=> { name: 'Tim' }
     *
     * pick(['name', 'fears'], person);
     * //=> { name: 'Tim', fears: 'rabbits' }
     */
    var pick = function pick(props, object) {
      if (!existy(object) || !isObject(object)) {
        return {};
      }

      if (isString(props)) {
        props = [props];
      }

      if (!isArray(props)) {
        props = [];
      }

      var result = {};

      for (var i = 0; i < props.length; i += 1) {
        if (isString(props[i]) && props[i] in object) {
          result[props[i]] = object[props[i]];
        }
      }

      return result;
    };

    /*
     * Exports.
     */

    module.exports = pick;

    },{}],16:[function(require,module,exports){
    'use strict';

    var max = Math.max;

    /**
     * Produce a new array by passing each value in the input `collection` through a transformative
     * `iterator` function. The `iterator` function is passed three arguments:
     * `(value, index, collection)`.
     *
     * @name rest
     * @api public
     * @param {Array} collection The collection to iterate over.
     * @return {Array} A new array containing all but the first element from `collection`.
     * @example
     * rest([1, 2, 3]); // => [2, 3]
     */
    var rest = function rest(collection) {
      if (collection == null || !collection.length) {
        return [];
      }

      // Preallocating an array *significantly* boosts performance when dealing with
      // `arguments` objects on v8. For a summary, see:
      // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
      var results = new Array(max(collection.length - 2, 0));

      for (var i = 1; i < collection.length; i += 1) {
        results[i - 1] = collection[i];
      }

      return results;
    };

    /*
     * Exports.
     */

    module.exports = rest;

    },{}],17:[function(require,module,exports){
    'use strict';

    /*
     * Module dependencies.
     */

    var parse = require('component-querystring').parse;

    /**
     * All the ad query params we look for.
     */
    var QUERYIDS = {
      btid: 'dataxu',
      urid: 'millennial-media'
    };

    /**
     * Get all ads info from the given `querystring`
     *
     * @param {string} query
     * @return {Object}
     */
    function ads(query) {
      var params = parse(query);
      for (var key in params) {
        if (params.hasOwnProperty(key)) {
          for (var id in QUERYIDS) {
            if (QUERYIDS.hasOwnProperty(id)) {
              if (key === id) {
                return {
                  id : params[key],
                  type : QUERYIDS[id]
                };
              }
            }
          }
        }
      }
    }

    /*
     * Exports.
     */

    module.exports = ads;

    },{"component-querystring":71}],18:[function(require,module,exports){
    (function (global){
    'use strict';

    var _analytics = global.analytics;

    /*
     * Module dependencies.
     */

    var Alias = require('segmentio-facade').Alias;
    var Emitter = require('component-emitter');
    var Group = require('segmentio-facade').Group;
    var Identify = require('segmentio-facade').Identify;
    var Page = require('segmentio-facade').Page;
    var Track = require('segmentio-facade').Track;
    var after = require('@ndhoule/after');
    var bindAll = require('bind-all');
    var clone = require('@ndhoule/clone');
    var extend = require('extend');
    var cookie = require('./cookie');
    var metrics = require('./metrics');
    var debug = require('debug');
    var defaults = require('@ndhoule/defaults');
    var each = require('@ndhoule/each');
    var foldl = require('@ndhoule/foldl');
    var group = require('./group');
    var is = require('is');
    var isMeta = require('@segment/is-meta');
    var keys = require('@ndhoule/keys');
    var memory = require('./memory');
    var nextTick = require('next-tick');
    var normalize = require('./normalize');
    var on = require('component-event').bind;
    var pageDefaults = require('./pageDefaults');
    var pick = require('@ndhoule/pick');
    var prevent = require('@segment/prevent-default');
    var querystring = require('component-querystring');
    var store = require('./store');
    var user = require('./user');
    var type = require('component-type');

    /**
     * Initialize a new `Analytics` instance.
     */

    function Analytics() {
      this._options({});
      this.Integrations = {};
      this._integrations = {};
      this._readied = false;
      this._timeout = 300;
      // XXX: BACKWARDS COMPATIBILITY
      this._user = user;
      this.log = debug('analytics.js');
      bindAll(this);

      var self = this;
      this.on('initialize', function(settings, options) {
        if (options.initialPageview) self.page();
        self._parseQuery(window.location.search);
      });
    }

    /**
     * Mix in event emitter.
     */

    Emitter(Analytics.prototype);

    /**
     * Use a `plugin`.
     *
     * @param {Function} plugin
     * @return {Analytics}
     */

    Analytics.prototype.use = function(plugin) {
      plugin(this);
      return this;
    };

    /**
     * Define a new `Integration`.
     *
     * @param {Function} Integration
     * @return {Analytics}
     */

    Analytics.prototype.addIntegration = function(Integration) {
      var name = Integration.prototype.name;
      if (!name) throw new TypeError('attempted to add an invalid integration');
      this.Integrations[name] = Integration;
      return this;
    };

    /**
     * Initialize with the given integration `settings` and `options`.
     *
     * Aliased to `init` for convenience.
     *
     * @param {Object} [settings={}]
     * @param {Object} [options={}]
     * @return {Analytics}
     */

    Analytics.prototype.init = Analytics.prototype.initialize = function(
      settings,
      options
    ) {
      settings = settings || {};
      options = options || {};

      this._options(options);
      this._readied = false;

      // clean unknown integrations from settings
      var self = this;
      each(function(opts, name) {
        var Integration = self.Integrations[name];
        if (!Integration) delete settings[name];
      }, settings);

      // add integrations
      each(function(opts, name) {
        // Don't load disabled integrations
        if (options.integrations) {
          if (
            options.integrations[name] === false ||
            (options.integrations.All === false && !options.integrations[name])
          ) {
            return;
          }
        }

        var Integration = self.Integrations[name];
        var clonedOpts = {};
        extend(true, clonedOpts, opts); // deep clone opts
        var integration = new Integration(clonedOpts);
        self.log('initialize %o - %o', name, opts);
        self.add(integration);
      }, settings);

      var integrations = this._integrations;

      // load user now that options are set
      user.load();
      group.load();

      // make ready callback
      var integrationCount = keys(integrations).length;
      var ready = after(integrationCount, function() {
        self._readied = true;
        self.emit('ready');
      });

      // init if no integrations
      if (integrationCount <= 0) {
        ready();
      }

      // initialize integrations, passing ready
      // create a list of any integrations that did not initialize - this will be passed with all events for replay support:
      this.failedInitializations = [];
      each(function(integration) {
        if (
          options.initialPageview &&
          integration.options.initialPageview === false
        ) {
          integration.page = after(2, integration.page);
        }

        integration.analytics = self;
        integration.once('ready', ready);
        try {
          metrics.increment('analytics_js.integration.invoke', {
            method: 'initialize',
            integration_name: integration.name
          });
          integration.initialize();
        } catch (e) {
          var integrationName = integration.name;
          metrics.increment('analytics_js.integration.invoke.error', {
            method: 'initialize',
            integration_name: integration.name
          });
          self.failedInitializations.push(integrationName);
          self.log('Error initializing %s integration: %o', integrationName, e);
          // Mark integration as ready to prevent blocking of anyone listening to analytics.ready()
          integration.ready();
        }
      }, integrations);

      // backwards compat with angular plugin.
      // TODO: remove
      this.initialized = true;

      this.emit('initialize', settings, options);
      return this;
    };

    /**
     * Set the user's `id`.
     *
     * @param {Mixed} id
     */

    Analytics.prototype.setAnonymousId = function(id) {
      this.user().anonymousId(id);
      return this;
    };

    /**
     * Add an integration.
     *
     * @param {Integration} integration
     */

    Analytics.prototype.add = function(integration) {
      this._integrations[integration.name] = integration;
      return this;
    };

    /**
     * Identify a user by optional `id` and `traits`.
     *
     * @param {string} [id=user.id()] User ID.
     * @param {Object} [traits=null] User traits.
     * @param {Object} [options=null]
     * @param {Function} [fn]
     * @return {Analytics}
     */

    Analytics.prototype.identify = function(id, traits, options, fn) {
      // Argument reshuffling.
      /* eslint-disable no-unused-expressions, no-sequences */
      if (is.fn(options)) (fn = options), (options = null);
      if (is.fn(traits)) (fn = traits), (options = null), (traits = null);
      if (is.object(id)) (options = traits), (traits = id), (id = user.id());
      /* eslint-enable no-unused-expressions, no-sequences */

      // clone traits before we manipulate so we don't do anything uncouth, and take
      // from `user` so that we carryover anonymous traits
      user.identify(id, traits);

      var msg = this.normalize({
        options: options,
        traits: user.traits(),
        userId: user.id()
      });

      // Add the initialize integrations so the server-side ones can be disabled too
      if (this.options.integrations) {
        defaults(msg.integrations, this.options.integrations);
      }

      this._invoke('identify', new Identify(msg));

      // emit
      this.emit('identify', id, traits, options);
      this._callback(fn);
      return this;
    };

    /**
     * Return the current user.
     *
     * @return {Object}
     */

    Analytics.prototype.user = function() {
      return user;
    };

    /**
     * Identify a group by optional `id` and `traits`. Or, if no arguments are
     * supplied, return the current group.
     *
     * @param {string} [id=group.id()] Group ID.
     * @param {Object} [traits=null] Group traits.
     * @param {Object} [options=null]
     * @param {Function} [fn]
     * @return {Analytics|Object}
     */

    Analytics.prototype.group = function(id, traits, options, fn) {
      /* eslint-disable no-unused-expressions, no-sequences */
      if (!arguments.length) return group;
      if (is.fn(options)) (fn = options), (options = null);
      if (is.fn(traits)) (fn = traits), (options = null), (traits = null);
      if (is.object(id)) (options = traits), (traits = id), (id = group.id());
      /* eslint-enable no-unused-expressions, no-sequences */

      // grab from group again to make sure we're taking from the source
      group.identify(id, traits);

      var msg = this.normalize({
        options: options,
        traits: group.traits(),
        groupId: group.id()
      });

      // Add the initialize integrations so the server-side ones can be disabled too
      if (this.options.integrations) {
        defaults(msg.integrations, this.options.integrations);
      }

      this._invoke('group', new Group(msg));

      this.emit('group', id, traits, options);
      this._callback(fn);
      return this;
    };

    /**
     * Track an `event` that a user has triggered with optional `properties`.
     *
     * @param {string} event
     * @param {Object} [properties=null]
     * @param {Object} [options=null]
     * @param {Function} [fn]
     * @return {Analytics}
     */

    Analytics.prototype.track = function(event, properties, options, fn) {
      // Argument reshuffling.
      /* eslint-disable no-unused-expressions, no-sequences */
      if (is.fn(options)) (fn = options), (options = null);
      if (is.fn(properties))
        (fn = properties), (options = null), (properties = null);
      /* eslint-enable no-unused-expressions, no-sequences */

      // figure out if the event is archived.
      var plan = this.options.plan || {};
      var events = plan.track || {};
      var planIntegrationOptions = {};

      // normalize
      var msg = this.normalize({
        properties: properties,
        options: options,
        event: event
      });

      // plan.
      plan = events[event];
      if (plan) {
        this.log('plan %o - %o', event, plan);
        if (plan.enabled === false) {
          // Disabled events should always be sent to Segment.
          planIntegrationOptions = { All: false, 'Segment.io': true };
        } else {
          planIntegrationOptions = plan.integrations || {};
        }
      } else {
        var defaultPlan = events.__default || { enabled: true };
        if (!defaultPlan.enabled) {
          // Disabled events should always be sent to Segment.
          planIntegrationOptions = { All: false, 'Segment.io': true };
        }
      }

      // Add the initialize integrations so the server-side ones can be disabled too
      defaults(
        msg.integrations,
        this._mergeInitializeAndPlanIntegrations(planIntegrationOptions)
      );

      this._invoke('track', new Track(msg));

      this.emit('track', event, properties, options);
      this._callback(fn);
      return this;
    };

    /**
     * Helper method to track an outbound link that would normally navigate away
     * from the page before the analytics calls were sent.
     *
     * BACKWARDS COMPATIBILITY: aliased to `trackClick`.
     *
     * @param {Element|Array} links
     * @param {string|Function} event
     * @param {Object|Function} properties (optional)
     * @return {Analytics}
     */

    Analytics.prototype.trackClick = Analytics.prototype.trackLink = function(
      links,
      event,
      properties
    ) {
      if (!links) return this;
      // always arrays, handles jquery
      if (type(links) === 'element') links = [links];

      var self = this;
      each(function(el) {
        if (type(el) !== 'element') {
          throw new TypeError('Must pass HTMLElement to `analytics.trackLink`.');
        }
        on(el, 'click', function(e) {
          var ev = is.fn(event) ? event(el) : event;
          var props = is.fn(properties) ? properties(el) : properties;
          var href =
            el.getAttribute('href') ||
            el.getAttributeNS('http://www.w3.org/1999/xlink', 'href') ||
            el.getAttribute('xlink:href');

          self.track(ev, props);

          if (href && el.target !== '_blank' && !isMeta(e)) {
            prevent(e);
            self._callback(function() {
              window.location.href = href;
            });
          }
        });
      }, links);

      return this;
    };

    /**
     * Helper method to track an outbound form that would normally navigate away
     * from the page before the analytics calls were sent.
     *
     * BACKWARDS COMPATIBILITY: aliased to `trackSubmit`.
     *
     * @param {Element|Array} forms
     * @param {string|Function} event
     * @param {Object|Function} properties (optional)
     * @return {Analytics}
     */

    Analytics.prototype.trackSubmit = Analytics.prototype.trackForm = function(
      forms,
      event,
      properties
    ) {
      if (!forms) return this;
      // always arrays, handles jquery
      if (type(forms) === 'element') forms = [forms];

      var self = this;
      each(function(el) {
        if (type(el) !== 'element')
          throw new TypeError('Must pass HTMLElement to `analytics.trackForm`.');
        function handler(e) {
          prevent(e);

          var ev = is.fn(event) ? event(el) : event;
          var props = is.fn(properties) ? properties(el) : properties;
          self.track(ev, props);

          self._callback(function() {
            el.submit();
          });
        }

        // Support the events happening through jQuery or Zepto instead of through
        // the normal DOM API, because `el.submit` doesn't bubble up events...
        var $ = window.jQuery || window.Zepto;
        if ($) {
          $(el).submit(handler);
        } else {
          on(el, 'submit', handler);
        }
      }, forms);

      return this;
    };

    /**
     * Trigger a pageview, labeling the current page with an optional `category`,
     * `name` and `properties`.
     *
     * @param {string} [category]
     * @param {string} [name]
     * @param {Object|string} [properties] (or path)
     * @param {Object} [options]
     * @param {Function} [fn]
     * @return {Analytics}
     */

    Analytics.prototype.page = function(category, name, properties, options, fn) {
      // Argument reshuffling.
      /* eslint-disable no-unused-expressions, no-sequences */
      if (is.fn(options)) (fn = options), (options = null);
      if (is.fn(properties)) (fn = properties), (options = properties = null);
      if (is.fn(name)) (fn = name), (options = properties = name = null);
      if (type(category) === 'object')
        (options = name), (properties = category), (name = category = null);
      if (type(name) === 'object')
        (options = properties), (properties = name), (name = null);
      if (type(category) === 'string' && type(name) !== 'string')
        (name = category), (category = null);
      /* eslint-enable no-unused-expressions, no-sequences */

      properties = clone(properties) || {};
      if (name) properties.name = name;
      if (category) properties.category = category;

      // Ensure properties has baseline spec properties.
      // TODO: Eventually move these entirely to `options.context.page`
      var defs = pageDefaults();
      defaults(properties, defs);

      // Mirror user overrides to `options.context.page` (but exclude custom properties)
      // (Any page defaults get applied in `this.normalize` for consistency.)
      // Weird, yeah--moving special props to `context.page` will fix this in the long term.
      var overrides = pick(keys(defs), properties);
      if (!is.empty(overrides)) {
        options = options || {};
        options.context = options.context || {};
        options.context.page = overrides;
      }

      var msg = this.normalize({
        properties: properties,
        category: category,
        options: options,
        name: name
      });

      // Add the initialize integrations so the server-side ones can be disabled too
      if (this.options.integrations) {
        defaults(msg.integrations, this.options.integrations);
      }

      this._invoke('page', new Page(msg));

      this.emit('page', category, name, properties, options);
      this._callback(fn);
      return this;
    };

    /**
     * FIXME: BACKWARDS COMPATIBILITY: convert an old `pageview` to a `page` call.
     *
     * @param {string} [url]
     * @return {Analytics}
     * @api private
     */

    Analytics.prototype.pageview = function(url) {
      var properties = {};
      if (url) properties.path = url;
      this.page(properties);
      return this;
    };

    /**
     * Merge two previously unassociated user identities.
     *
     * @param {string} to
     * @param {string} from (optional)
     * @param {Object} options (optional)
     * @param {Function} fn (optional)
     * @return {Analytics}
     */

    Analytics.prototype.alias = function(to, from, options, fn) {
      // Argument reshuffling.
      /* eslint-disable no-unused-expressions, no-sequences */
      if (is.fn(options)) (fn = options), (options = null);
      if (is.fn(from)) (fn = from), (options = null), (from = null);
      if (is.object(from)) (options = from), (from = null);
      /* eslint-enable no-unused-expressions, no-sequences */

      var msg = this.normalize({
        options: options,
        previousId: from,
        userId: to
      });

      // Add the initialize integrations so the server-side ones can be disabled too
      if (this.options.integrations) {
        defaults(msg.integrations, this.options.integrations);
      }

      this._invoke('alias', new Alias(msg));

      this.emit('alias', to, from, options);
      this._callback(fn);
      return this;
    };

    /**
     * Register a `fn` to be fired when all the analytics services are ready.
     *
     * @param {Function} fn
     * @return {Analytics}
     */

    Analytics.prototype.ready = function(fn) {
      if (is.fn(fn)) {
        if (this._readied) {
          nextTick(fn);
        } else {
          this.once('ready', fn);
        }
      }
      return this;
    };

    /**
     * Set the `timeout` (in milliseconds) used for callbacks.
     *
     * @param {Number} timeout
     */

    Analytics.prototype.timeout = function(timeout) {
      this._timeout = timeout;
    };

    /**
     * Enable or disable debug.
     *
     * @param {string|boolean} str
     */

    Analytics.prototype.debug = function(str) {
      if (!arguments.length || str) {
        debug.enable('analytics:' + (str || '*'));
      } else {
        debug.disable();
      }
    };

    /**
     * Apply options.
     *
     * @param {Object} options
     * @return {Analytics}
     * @api private
     */

    Analytics.prototype._options = function(options) {
      options = options || {};
      this.options = options;
      cookie.options(options.cookie);
      metrics.options(options.metrics);
      store.options(options.localStorage);
      user.options(options.user);
      group.options(options.group);
      return this;
    };

    /**
     * Callback a `fn` after our defined timeout period.
     *
     * @param {Function} fn
     * @return {Analytics}
     * @api private
     */

    Analytics.prototype._callback = function(fn) {
      if (is.fn(fn)) {
        this._timeout ? setTimeout(fn, this._timeout) : nextTick(fn);
      }
      return this;
    };

    /**
     * Call `method` with `facade` on all enabled integrations.
     *
     * @param {string} method
     * @param {Facade} facade
     * @return {Analytics}
     * @api private
     */

    Analytics.prototype._invoke = function(method, facade) {
      var self = this;
      metrics.increment('analytics_js.invoke', {
        method: method
      });
      this.emit('invoke', facade);

      var failedInitializations = self.failedInitializations || [];
      each(function(integration, name) {
        if (!facade.enabled(name)) return;
        // Check if an integration failed to initialize.
        // If so, do not process the message as the integration is in an unstable state.
        if (failedInitializations.indexOf(name) >= 0) {
          self.log(
            'Skipping invokation of .%s method of %s integration. Integation failed to initialize properly.',
            method,
            name
          );
        } else {
          try {
            metrics.increment('analytics_js.integration.invoke', {
              method: method,
              integration_name: integration.name
            });
            integration.invoke.call(integration, method, facade);
          } catch (e) {
            metrics.increment('analytics_js.integration.invoke.error', {
              method: method,
              integration_name: integration.name
            });
            self.log(
              'Error invoking .%s method of %s integration: %o',
              method,
              name,
              e
            );
          }
        }
      }, this._integrations);

      return this;
    };

    /**
     * Push `args`.
     *
     * @param {Array} args
     * @api private
     */

    Analytics.prototype.push = function(args) {
      var method = args.shift();
      if (!this[method]) return;
      this[method].apply(this, args);
    };

    /**
     * Reset group and user traits and id's.
     *
     * @api public
     */

    Analytics.prototype.reset = function() {
      this.user().logout();
      this.group().logout();
    };

    /**
     * Parse the query string for callable methods.
     *
     * @param {String} query
     * @return {Analytics}
     * @api private
     */

    Analytics.prototype._parseQuery = function(query) {
      // Parse querystring to an object
      var q = querystring.parse(query);
      // Create traits and properties objects, populate from querysting params
      var traits = pickPrefix('ajs_trait_', q);
      var props = pickPrefix('ajs_prop_', q);
      // Trigger based on callable parameters in the URL
      if (q.ajs_uid) this.identify(q.ajs_uid, traits);
      if (q.ajs_event) this.track(q.ajs_event, props);
      if (q.ajs_aid) user.anonymousId(q.ajs_aid);
      return this;

      /**
       * Create a shallow copy of an input object containing only the properties
       * whose keys are specified by a prefix, stripped of that prefix
       *
       * @param {String} prefix
       * @param {Object} object
       * @return {Object}
       * @api private
       */

      function pickPrefix(prefix, object) {
        var length = prefix.length;
        var sub;
        return foldl(
          function(acc, val, key) {
            if (key.substr(0, length) === prefix) {
              sub = key.substr(length);
              acc[sub] = val;
            }
            return acc;
          },
          {},
          object
        );
      }
    };

    /**
     * Normalize the given `msg`.
     *
     * @param {Object} msg
     * @return {Object}
     */

    Analytics.prototype.normalize = function(msg) {
      msg = normalize(msg, keys(this._integrations));
      if (msg.anonymousId) user.anonymousId(msg.anonymousId);
      msg.anonymousId = user.anonymousId();

      // Ensure all outgoing requests include page data in their contexts.
      msg.context.page = defaults(msg.context.page || {}, pageDefaults());

      return msg;
    };

    /**
     * Merges the tracking plan and initialization integration options.
     *
     * @param  {Object} planIntegrations Tracking plan integrations.
     * @return {Object}                  The merged integrations.
     */
    Analytics.prototype._mergeInitializeAndPlanIntegrations = function(
      planIntegrations
    ) {
      // Do nothing if there are no initialization integrations
      if (!this.options.integrations) {
        return planIntegrations;
      }

      // Clone the initialization integrations
      var integrations = extend({}, this.options.integrations);
      var integrationName;

      // Allow the tracking plan to disable integrations that were explicitly
      // enabled on initialization
      if (planIntegrations.All === false) {
        integrations = { All: false };
      }

      for (integrationName in planIntegrations) {
        if (planIntegrations.hasOwnProperty(integrationName)) {
          // Don't allow the tracking plan to re-enable disabled integrations
          if (this.options.integrations[integrationName] !== false) {
            integrations[integrationName] = planIntegrations[integrationName];
          }
        }
      }

      return integrations;
    };

    /**
     * No conflict support.
     */

    Analytics.prototype.noConflict = function() {
      window.analytics = _analytics;
      return this;
    };

    /*
     * Exports.
     */

    module.exports = Analytics;
    module.exports.cookie = cookie;
    module.exports.memory = memory;
    module.exports.store = store;
    module.exports.metrics = metrics;

    }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    },{"./cookie":19,"./group":21,"./memory":23,"./metrics":24,"./normalize":25,"./pageDefaults":26,"./store":27,"./user":28,"@ndhoule/after":3,"@ndhoule/clone":5,"@ndhoule/defaults":6,"@ndhoule/each":8,"@ndhoule/foldl":11,"@ndhoule/keys":13,"@ndhoule/pick":15,"@segment/is-meta":40,"@segment/prevent-default":53,"bind-all":59,"component-emitter":68,"component-event":69,"component-querystring":71,"component-type":73,"debug":75,"extend":77,"is":81,"next-tick":92,"segmentio-facade":102}],19:[function(require,module,exports){
    'use strict';

    /**
     * Module dependencies.
     */

    var bindAll = require('bind-all');
    var clone = require('@ndhoule/clone');
    var cookie = require('component-cookie');
    var debug = require('debug')('analytics.js:cookie');
    var defaults = require('@ndhoule/defaults');
    var json = require('json3');
    var topDomain = require('@segment/top-domain');

    /**
     * Initialize a new `Cookie` with `options`.
     *
     * @param {Object} options
     */

    function Cookie(options) {
      this.options(options);
    }

    /**
     * Get or set the cookie options.
     *
     * @param {Object} options
     *   @field {Number} maxage (1 year)
     *   @field {String} domain
     *   @field {String} path
     *   @field {Boolean} secure
     */

    Cookie.prototype.options = function(options) {
      if (arguments.length === 0) return this._options;

      options = options || {};

      var domain = '.' + topDomain(window.location.href);
      if (domain === '.') domain = null;

      this._options = defaults(options, {
        // default to a year
        maxage: 31536000000,
        path: '/',
        domain: domain
      });

      // http://curl.haxx.se/rfc/cookie_spec.html
      // https://publicsuffix.org/list/effective_tld_names.dat
      //
      // try setting a dummy cookie with the options
      // if the cookie isn't set, it probably means
      // that the domain is on the public suffix list
      // like myapp.herokuapp.com or localhost / ip.
      this.set('ajs:test', true);
      if (!this.get('ajs:test')) {
        debug('fallback to domain=null');
        this._options.domain = null;
      }
      this.remove('ajs:test');
    };

    /**
     * Set a `key` and `value` in our cookie.
     *
     * @param {String} key
     * @param {Object} value
     * @return {Boolean} saved
     */

    Cookie.prototype.set = function(key, value) {
      try {
        value = json.stringify(value);
        cookie(key, value, clone(this._options));
        return true;
      } catch (e) {
        return false;
      }
    };

    /**
     * Get a value from our cookie by `key`.
     *
     * @param {String} key
     * @return {Object} value
     */

    Cookie.prototype.get = function(key) {
      try {
        var value = cookie(key);
        value = value ? json.parse(value) : null;
        return value;
      } catch (e) {
        return null;
      }
    };

    /**
     * Remove a value from our cookie by `key`.
     *
     * @param {String} key
     * @return {Boolean} removed
     */

    Cookie.prototype.remove = function(key) {
      try {
        cookie(key, null, clone(this._options));
        return true;
      } catch (e) {
        return false;
      }
    };

    /**
     * Expose the cookie singleton.
     */

    module.exports = bindAll(new Cookie());

    /**
     * Expose the `Cookie` constructor.
     */

    module.exports.Cookie = Cookie;

    },{"@ndhoule/clone":5,"@ndhoule/defaults":6,"@segment/top-domain":57,"bind-all":59,"component-cookie":62,"debug":75,"json3":82}],20:[function(require,module,exports){
    'use strict';

    /*
     * Module dependencies.
     */

    var clone = require('@ndhoule/clone');
    var cookie = require('./cookie');
    var debug = require('debug')('analytics:entity');
    var defaults = require('@ndhoule/defaults');
    var extend = require('@ndhoule/extend');
    var memory = require('./memory');
    var store = require('./store');
    var isodateTraverse = require('@segment/isodate-traverse');

    /**
     * Expose `Entity`
     */

    module.exports = Entity;

    /**
     * Initialize new `Entity` with `options`.
     *
     * @param {Object} options
     */

    function Entity(options) {
      this.options(options);
      this.initialize();
    }

    /**
     * Initialize picks the storage.
     *
     * Checks to see if cookies can be set
     * otherwise fallsback to localStorage.
     */

    Entity.prototype.initialize = function() {
      cookie.set('ajs:cookies', true);

      // cookies are enabled.
      if (cookie.get('ajs:cookies')) {
        cookie.remove('ajs:cookies');
        this._storage = cookie;
        return;
      }

      // localStorage is enabled.
      if (store.enabled) {
        this._storage = store;
        return;
      }

      // fallback to memory storage.
      debug(
        'warning using memory store both cookies and localStorage are disabled'
      );
      this._storage = memory;
    };

    /**
     * Get the storage.
     */

    Entity.prototype.storage = function() {
      return this._storage;
    };

    /**
     * Get or set storage `options`.
     *
     * @param {Object} options
     *   @property {Object} cookie
     *   @property {Object} localStorage
     *   @property {Boolean} persist (default: `true`)
     */

    Entity.prototype.options = function(options) {
      if (arguments.length === 0) return this._options;
      this._options = defaults(options || {}, this.defaults || {});
    };

    /**
     * Get or set the entity's `id`.
     *
     * @param {String} id
     */

    Entity.prototype.id = function(id) {
      switch (arguments.length) {
        case 0:
          return this._getId();
        case 1:
          return this._setId(id);
        default:
        // No default case
      }
    };

    /**
     * Get the entity's id.
     *
     * @return {String}
     */

    Entity.prototype._getId = function() {
      var ret = this._options.persist
        ? this.storage().get(this._options.cookie.key)
        : this._id;
      return ret === undefined ? null : ret;
    };

    /**
     * Set the entity's `id`.
     *
     * @param {String} id
     */

    Entity.prototype._setId = function(id) {
      if (this._options.persist) {
        this.storage().set(this._options.cookie.key, id);
      } else {
        this._id = id;
      }
    };

    /**
     * Get or set the entity's `traits`.
     *
     * BACKWARDS COMPATIBILITY: aliased to `properties`
     *
     * @param {Object} traits
     */

    Entity.prototype.properties = Entity.prototype.traits = function(traits) {
      switch (arguments.length) {
        case 0:
          return this._getTraits();
        case 1:
          return this._setTraits(traits);
        default:
        // No default case
      }
    };

    /**
     * Get the entity's traits. Always convert ISO date strings into real dates,
     * since they aren't parsed back from local storage.
     *
     * @return {Object}
     */

    Entity.prototype._getTraits = function() {
      var ret = this._options.persist
        ? store.get(this._options.localStorage.key)
        : this._traits;
      return ret ? isodateTraverse(clone(ret)) : {};
    };

    /**
     * Set the entity's `traits`.
     *
     * @param {Object} traits
     */

    Entity.prototype._setTraits = function(traits) {
      traits = traits || {};
      if (this._options.persist) {
        store.set(this._options.localStorage.key, traits);
      } else {
        this._traits = traits;
      }
    };

    /**
     * Identify the entity with an `id` and `traits`. If we it's the same entity,
     * extend the existing `traits` instead of overwriting.
     *
     * @param {String} id
     * @param {Object} traits
     */

    Entity.prototype.identify = function(id, traits) {
      traits = traits || {};
      var current = this.id();
      if (current === null || current === id)
        traits = extend(this.traits(), traits);
      if (id) this.id(id);
      this.debug('identify %o, %o', id, traits);
      this.traits(traits);
      this.save();
    };

    /**
     * Save the entity to local storage and the cookie.
     *
     * @return {Boolean}
     */

    Entity.prototype.save = function() {
      if (!this._options.persist) return false;
      cookie.set(this._options.cookie.key, this.id());
      store.set(this._options.localStorage.key, this.traits());
      return true;
    };

    /**
     * Log the entity out, reseting `id` and `traits` to defaults.
     */

    Entity.prototype.logout = function() {
      this.id(null);
      this.traits({});
      cookie.remove(this._options.cookie.key);
      store.remove(this._options.localStorage.key);
    };

    /**
     * Reset all entity state, logging out and returning options to defaults.
     */

    Entity.prototype.reset = function() {
      this.logout();
      this.options({});
    };

    /**
     * Load saved entity `id` or `traits` from storage.
     */

    Entity.prototype.load = function() {
      this.id(cookie.get(this._options.cookie.key));
      this.traits(store.get(this._options.localStorage.key));
    };

    },{"./cookie":19,"./memory":23,"./store":27,"@ndhoule/clone":5,"@ndhoule/defaults":6,"@ndhoule/extend":10,"@segment/isodate-traverse":41,"debug":75}],21:[function(require,module,exports){
    'use strict';

    /*
     * Module dependencies.
     */

    var Entity = require('./entity');
    var bindAll = require('bind-all');
    var debug = require('debug')('analytics:group');
    var inherit = require('inherits');

    /**
     * Group defaults
     */

    Group.defaults = {
      persist: true,
      cookie: {
        key: 'ajs_group_id'
      },
      localStorage: {
        key: 'ajs_group_properties'
      }
    };

    /**
     * Initialize a new `Group` with `options`.
     *
     * @param {Object} options
     */

    function Group(options) {
      this.defaults = Group.defaults;
      this.debug = debug;
      Entity.call(this, options);
    }

    /**
     * Inherit `Entity`
     */

    inherit(Group, Entity);

    /**
     * Expose the group singleton.
     */

    module.exports = bindAll(new Group());

    /**
     * Expose the `Group` constructor.
     */

    module.exports.Group = Group;

    },{"./entity":20,"bind-all":59,"debug":75,"inherits":79}],22:[function(require,module,exports){
    'use strict';

    /**
     * Analytics.js
     *
     * (C) 2013-2016 Segment.io Inc.
     */

    var Analytics = require('./analytics');

    // Create a new `analytics` singleton.
    var analytics = new Analytics();

    // Expose `require`.
    // TODO(ndhoule): Look into deprecating, we no longer need to expose it in tests
    analytics.require = require;

    // Expose package version.
    analytics.VERSION = require('../package.json').version;

    /*
     * Exports.
     */

    module.exports = analytics;

    },{"../package.json":29,"./analytics":18}],23:[function(require,module,exports){
    'use strict';

    /*
     * Module Dependencies.
     */

    var bindAll = require('bind-all');
    var clone = require('@ndhoule/clone');

    /**
     * HOP.
     */

    var has = Object.prototype.hasOwnProperty;

    /**
     * Expose `Memory`
     */

    module.exports = bindAll(new Memory());

    /**
     * Initialize `Memory` store
     */

    function Memory() {
      this.store = {};
    }

    /**
     * Set a `key` and `value`.
     *
     * @param {String} key
     * @param {Mixed} value
     * @return {Boolean}
     */

    Memory.prototype.set = function(key, value) {
      this.store[key] = clone(value);
      return true;
    };

    /**
     * Get a `key`.
     *
     * @param {String} key
     */

    Memory.prototype.get = function(key) {
      if (!has.call(this.store, key)) return;
      return clone(this.store[key]);
    };

    /**
     * Remove a `key`.
     *
     * @param {String} key
     * @return {Boolean}
     */

    Memory.prototype.remove = function(key) {
      delete this.store[key];
      return true;
    };

    },{"@ndhoule/clone":5,"bind-all":59}],24:[function(require,module,exports){
    'use strict';

    var bindAll = require('bind-all');
    var send = require('@segment/send-json');
    var debug = require('debug')('analytics.js:metrics');

    function Metrics(options) {
      this.options(options);
    }

    /**
     * Set the metrics options.
     *
     * @param {Object} options
     *   @field {String} host
     *   @field {Number} sampleRate
     *   @field {Number} flushTimer
     */

    Metrics.prototype.options = function(options) {
      options = options || {};

      this.host = options.host || 'api.segment.io/v1';
      this.sampleRate = options.sampleRate || 0; // disable metrics by default.
      this.flushTimer = options.flushTimer || 30 * 1000 /* 30s */;
      this.maxQueueSize = options.maxQueueSize || 20;

      this.queue = [];

      if (this.sampleRate > 0) {
        var self = this;
        setInterval(function() {
          self._flush();
        }, this.flushTimer);
      }
    };

    /**
     * Increments the counter identified by name and tags by one.
     *
     * @param {String} metric Name of the metric to increment.
     * @param {Object} tags Dimensions associated with the metric.
     */
    Metrics.prototype.increment = function(metric, tags) {
      if (Math.random() > this.sampleRate) {
        return;
      }

      if (this.queue.length >= this.maxQueueSize) {
        return;
      }

      this.queue.push({ type: 'Counter', metric: metric, value: 1, tags: tags });

      // Trigger a flush if this is an error metric.
      if (metric.indexOf('error') > 0) {
        this._flush();
      }
    };

    /**
     * Flush all queued metrics.
     */
    Metrics.prototype._flush = function() {
      var self = this;

      if (self.queue.length <= 0) {
        return;
      }

      var payload = { series: this.queue };
      var headers = { 'Content-Type': 'text/plain' };

      self.queue = [];

      // This endpoint does not support jsonp, so only proceed if the browser
      // supports xhr.
      if (send.type !== 'xhr') return;

      send('https://' + this.host + '/m', payload, headers, function(err, res) {
        debug('sent %O, received %O', payload, [err, res]);
      });
    };

    /**
     * Expose the metrics singleton.
     */

    module.exports = bindAll(new Metrics());

    /**
     * Expose the `Metrics` constructor.
     */

    module.exports.Metrics = Metrics;

    },{"@segment/send-json":55,"bind-all":59,"debug":75}],25:[function(require,module,exports){
    'use strict';

    /**
     * Module Dependencies.
     */

    var debug = require('debug')('analytics.js:normalize');
    var defaults = require('@ndhoule/defaults');
    var each = require('@ndhoule/each');
    var includes = require('@ndhoule/includes');
    var map = require('@ndhoule/map');
    var type = require('component-type');

    /**
     * HOP.
     */

    var has = Object.prototype.hasOwnProperty;

    /**
     * Expose `normalize`
     */

    module.exports = normalize;

    /**
     * Toplevel properties.
     */

    var toplevel = ['integrations', 'anonymousId', 'timestamp', 'context'];

    /**
     * Normalize `msg` based on integrations `list`.
     *
     * @param {Object} msg
     * @param {Array} list
     * @return {Function}
     */

    function normalize(msg, list) {
      var lower = map(function(s) {
        return s.toLowerCase();
      }, list);
      var opts = msg.options || {};
      var integrations = opts.integrations || {};
      var providers = opts.providers || {};
      var context = opts.context || {};
      var ret = {};
      debug('<-', msg);

      // integrations.
      each(function(value, key) {
        if (!integration(key)) return;
        if (!has.call(integrations, key)) integrations[key] = value;
        delete opts[key];
      }, opts);

      // providers.
      delete opts.providers;
      each(function(value, key) {
        if (!integration(key)) return;
        if (type(integrations[key]) === 'object') return;
        if (has.call(integrations, key) && typeof providers[key] === 'boolean')
          return;
        integrations[key] = value;
      }, providers);

      // move all toplevel options to msg
      // and the rest to context.
      each(function(value, key) {
        if (includes(key, toplevel)) {
          ret[key] = opts[key];
        } else {
          context[key] = opts[key];
        }
      }, opts);

      // cleanup
      delete msg.options;
      ret.integrations = integrations;
      ret.context = context;
      ret = defaults(ret, msg);
      debug('->', ret);
      return ret;

      function integration(name) {
        return !!(
          includes(name, list) ||
          name.toLowerCase() === 'all' ||
          includes(name.toLowerCase(), lower)
        );
      }
    }

    },{"@ndhoule/defaults":6,"@ndhoule/each":8,"@ndhoule/includes":12,"@ndhoule/map":14,"component-type":73,"debug":75}],26:[function(require,module,exports){
    'use strict';

    /*
     * Module dependencies.
     */

    var canonical = require('@segment/canonical');
    var includes = require('@ndhoule/includes');
    var url = require('component-url');

    /**
     * Return a default `options.context.page` object.
     *
     * https://segment.com/docs/spec/page/#properties
     *
     * @return {Object}
     */

    function pageDefaults() {
      return {
        path: canonicalPath(),
        referrer: document.referrer,
        search: location.search,
        title: document.title,
        url: canonicalUrl(location.search)
      };
    }

    /**
     * Return the canonical path for the page.
     *
     * @return {string}
     */

    function canonicalPath() {
      var canon = canonical();
      if (!canon) return window.location.pathname;
      var parsed = url.parse(canon);
      return parsed.pathname;
    }

    /**
     * Return the canonical URL for the page concat the given `search`
     * and strip the hash.
     *
     * @param {string} search
     * @return {string}
     */

    function canonicalUrl(search) {
      var canon = canonical();
      if (canon) return includes('?', canon) ? canon : canon + search;
      var url = window.location.href;
      var i = url.indexOf('#');
      return i === -1 ? url : url.slice(0, i);
    }

    /*
     * Exports.
     */

    module.exports = pageDefaults;

    },{"@ndhoule/includes":12,"@segment/canonical":38,"component-url":74}],27:[function(require,module,exports){
    'use strict';

    /*
     * Module dependencies.
     */

    var bindAll = require('bind-all');
    var defaults = require('@ndhoule/defaults');
    var store = require('@segment/store');

    /**
     * Initialize a new `Store` with `options`.
     *
     * @param {Object} options
     */

    function Store(options) {
      this.options(options);
    }

    /**
     * Set the `options` for the store.
     *
     * @param {Object} options
     *   @field {Boolean} enabled (true)
     */

    Store.prototype.options = function(options) {
      if (arguments.length === 0) return this._options;

      options = options || {};
      defaults(options, { enabled: true });

      this.enabled = options.enabled && store.enabled;
      this._options = options;
    };

    /**
     * Set a `key` and `value` in local storage.
     *
     * @param {string} key
     * @param {Object} value
     */

    Store.prototype.set = function(key, value) {
      if (!this.enabled) return false;
      return store.set(key, value);
    };

    /**
     * Get a value from local storage by `key`.
     *
     * @param {string} key
     * @return {Object}
     */

    Store.prototype.get = function(key) {
      if (!this.enabled) return null;
      return store.get(key);
    };

    /**
     * Remove a value from local storage by `key`.
     *
     * @param {string} key
     */

    Store.prototype.remove = function(key) {
      if (!this.enabled) return false;
      return store.remove(key);
    };

    /**
     * Expose the store singleton.
     */

    module.exports = bindAll(new Store());

    /**
     * Expose the `Store` constructor.
     */

    module.exports.Store = Store;

    },{"@ndhoule/defaults":6,"@segment/store":56,"bind-all":59}],28:[function(require,module,exports){
    'use strict';

    /*
     * Module dependencies.
     */

    var Entity = require('./entity');
    var bindAll = require('bind-all');
    var cookie = require('./cookie');
    var debug = require('debug')('analytics:user');
    var inherit = require('inherits');
    var rawCookie = require('component-cookie');
    var uuid = require('uuid');

    /**
     * User defaults
     */

    User.defaults = {
      persist: true,
      cookie: {
        key: 'ajs_user_id',
        oldKey: 'ajs_user'
      },
      localStorage: {
        key: 'ajs_user_traits'
      }
    };

    /**
     * Initialize a new `User` with `options`.
     *
     * @param {Object} options
     */

    function User(options) {
      this.defaults = User.defaults;
      this.debug = debug;
      Entity.call(this, options);
    }

    /**
     * Inherit `Entity`
     */

    inherit(User, Entity);

    /**
     * Set/get the user id.
     *
     * When the user id changes, the method will reset his anonymousId to a new one.
     *
     * // FIXME: What are the mixed types?
     * @param {string} id
     * @return {Mixed}
     * @example
     * // didn't change because the user didn't have previous id.
     * anonymousId = user.anonymousId();
     * user.id('foo');
     * assert.equal(anonymousId, user.anonymousId());
     *
     * // didn't change because the user id changed to null.
     * anonymousId = user.anonymousId();
     * user.id('foo');
     * user.id(null);
     * assert.equal(anonymousId, user.anonymousId());
     *
     * // change because the user had previous id.
     * anonymousId = user.anonymousId();
     * user.id('foo');
     * user.id('baz'); // triggers change
     * user.id('baz'); // no change
     * assert.notEqual(anonymousId, user.anonymousId());
     */

    User.prototype.id = function(id) {
      var prev = this._getId();
      var ret = Entity.prototype.id.apply(this, arguments);
      if (prev == null) return ret;
      // FIXME: We're relying on coercion here (1 == "1"), but our API treats these
      // two values differently. Figure out what will break if we remove this and
      // change to strict equality
      /* eslint-disable eqeqeq */
      if (prev != id && id) this.anonymousId(null);
      /* eslint-enable eqeqeq */
      return ret;
    };

    /**
     * Set / get / remove anonymousId.
     *
     * @param {String} anonymousId
     * @return {String|User}
     */

    User.prototype.anonymousId = function(anonymousId) {
      var store = this.storage();

      // set / remove
      if (arguments.length) {
        store.set('ajs_anonymous_id', anonymousId);
        return this;
      }

      // new
      anonymousId = store.get('ajs_anonymous_id');
      if (anonymousId) {
        return anonymousId;
      }

      // old - it is not stringified so we use the raw cookie.
      anonymousId = rawCookie('_sio');
      if (anonymousId) {
        anonymousId = anonymousId.split('----')[0];
        store.set('ajs_anonymous_id', anonymousId);
        store.remove('_sio');
        return anonymousId;
      }

      // empty
      anonymousId = uuid.v4();
      store.set('ajs_anonymous_id', anonymousId);
      return store.get('ajs_anonymous_id');
    };

    /**
     * Remove anonymous id on logout too.
     */

    User.prototype.logout = function() {
      Entity.prototype.logout.call(this);
      this.anonymousId(null);
    };

    /**
     * Load saved user `id` or `traits` from storage.
     */

    User.prototype.load = function() {
      if (this._loadOldCookie()) return;
      Entity.prototype.load.call(this);
    };

    /**
     * BACKWARDS COMPATIBILITY: Load the old user from the cookie.
     *
     * @api private
     * @return {boolean}
     */

    User.prototype._loadOldCookie = function() {
      var user = cookie.get(this._options.cookie.oldKey);
      if (!user) return false;

      this.id(user.id);
      this.traits(user.traits);
      cookie.remove(this._options.cookie.oldKey);
      return true;
    };

    /**
     * Expose the user singleton.
     */

    module.exports = bindAll(new User());

    /**
     * Expose the `User` constructor.
     */

    module.exports.User = User;

    },{"./cookie":19,"./entity":20,"bind-all":59,"component-cookie":62,"debug":75,"inherits":79,"uuid":117}],29:[function(require,module,exports){
    module.exports={
      "_from": "@segment/analytics.js-core@^3.0.0",
      "_id": "@segment/analytics.js-core@3.7.2",
      "_inBundle": false,
      "_integrity": "sha512-+I0jGiZka4oZVZCXCYmTdG0h0kebcqXLVWTgDp/ZiXGwUeVjT6yfk2H69j7NbAJDMUg09db0nEMbZcyjltX/Zw==",
      "_location": "/@segment/analytics.js-core",
      "_phantomChildren": {},
      "_requested": {
        "type": "range",
        "registry": true,
        "raw": "@segment/analytics.js-core@^3.0.0",
        "name": "@segment/analytics.js-core",
        "escapedName": "@segment%2fanalytics.js-core",
        "scope": "@segment",
        "rawSpec": "^3.0.0",
        "saveSpec": null,
        "fetchSpec": "^3.0.0"
      },
      "_requiredBy": [
        "/"
      ],
      "_resolved": "https://registry.npmjs.org/@segment/analytics.js-core/-/analytics.js-core-3.7.2.tgz",
      "_shasum": "4e663b49ec5c9cb6baf40394ba798a6d84075a1f",
      "_spec": "@segment/analytics.js-core@^3.0.0",
      "_where": "/Users/georgefraser/Documents/analytics.js",
      "author": {
        "name": "Segment",
        "email": "friends@segment.com"
      },
      "bugs": {
        "url": "https://github.com/segmentio/analytics.js-core/issues"
      },
      "bundleDependencies": false,
      "dependencies": {
        "@ndhoule/after": "^1.0.0",
        "@ndhoule/clone": "^1.0.0",
        "@ndhoule/defaults": "^2.0.1",
        "@ndhoule/each": "^2.0.1",
        "@ndhoule/extend": "^2.0.0",
        "@ndhoule/foldl": "^2.0.1",
        "@ndhoule/includes": "^2.0.1",
        "@ndhoule/keys": "^2.0.0",
        "@ndhoule/map": "^2.0.1",
        "@ndhoule/pick": "^2.0.0",
        "@segment/canonical": "^1.0.0",
        "@segment/is-meta": "^1.0.0",
        "@segment/isodate": "^1.0.2",
        "@segment/isodate-traverse": "^1.0.1",
        "@segment/prevent-default": "^1.0.0",
        "@segment/send-json": "^3.0.0",
        "@segment/store": "^1.3.20",
        "@segment/top-domain": "^3.0.0",
        "bind-all": "^1.0.0",
        "component-cookie": "^1.1.2",
        "component-emitter": "^1.2.1",
        "component-event": "^0.1.4",
        "component-querystring": "^2.0.0",
        "component-type": "^1.2.1",
        "component-url": "^0.2.1",
        "debug": "^0.7.4",
        "extend": "3.0.1",
        "inherits": "^2.0.1",
        "install": "^0.7.3",
        "is": "^3.1.0",
        "json3": "^3.3.2",
        "new-date": "^1.0.0",
        "next-tick": "^0.2.2",
        "segmentio-facade": "^3.0.2",
        "uuid": "^2.0.2"
      },
      "deprecated": false,
      "description": "The hassle-free way to integrate analytics into any web application.",
      "devDependencies": {
        "@segment/analytics.js-integration": "^3.2.1",
        "@segment/eslint-config": "^4.0.0",
        "browserify": "13.0.0",
        "browserify-istanbul": "^2.0.0",
        "codecov": "^3.0.2",
        "compat-trigger-event": "^1.0.0",
        "component-each": "^0.2.6",
        "eslint": "^4.19.1",
        "eslint-config-prettier": "^2.9.0",
        "eslint-plugin-mocha": "^5.0.0",
        "eslint-plugin-react": "^7.9.1",
        "eslint-plugin-require-path-exists": "^1.1.8",
        "husky": "^0.14.3",
        "istanbul": "^0.4.3",
        "jquery": "^3.2.1",
        "karma": "1.3.0",
        "karma-browserify": "^5.0.4",
        "karma-chrome-launcher": "^1.0.1",
        "karma-coverage": "^1.0.0",
        "karma-junit-reporter": "^1.0.0",
        "karma-mocha": "1.0.1",
        "karma-phantomjs-launcher": "^1.0.0",
        "karma-sauce-launcher": "^1.0.0",
        "karma-spec-reporter": "0.0.26",
        "karma-summary-reporter": "^1.5.0",
        "lint-staged": "^7.2.0",
        "mocha": "^2.2.5",
        "np": "^3.0.4",
        "phantomjs-prebuilt": "^2.1.7",
        "prettier-eslint-cli": "^4.7.1",
        "proclaim": "^3.4.1",
        "sinon": "^1.7.3",
        "snyk": "^1.83.0",
        "watchify": "^3.7.0"
      },
      "homepage": "https://github.com/segmentio/analytics.js-core#readme",
      "keywords": [
        "analytics",
        "analytics.js",
        "segment",
        "segment.io"
      ],
      "license": "SEE LICENSE IN LICENSE",
      "lint-staged": {
        "linters": {
          "*.{js,json,md}": [
            "prettier-eslint --write",
            "git add"
          ]
        }
      },
      "main": "lib/index.js",
      "name": "@segment/analytics.js-core",
      "repository": {
        "type": "git",
        "url": "git+https://github.com/segmentio/analytics.js-core.git"
      },
      "scripts": {
        "format": "prettier-eslint --write --list-different \"./{lib,test}/**/*.{js,json,md}\"",
        "lint": "eslint \"./{lib,test}/**/*.js\"",
        "np": "np --no-publish",
        "precommit": "lint-staged",
        "test": "make test"
      },
      "version": "3.7.2"
    }

    },{}],30:[function(require,module,exports){
    'use strict';

    /**
     * Module dependencies.
     */

    var ads = require('@segment/ad-params');
    var clone = require('component-clone');
    var cookie = require('component-cookie');
    var extend = require('@ndhoule/extend');
    var integration = require('@segment/analytics.js-integration');
    var json = require('json3');
    var keys = require('@ndhoule/keys');
    var localstorage = require('yields-store');
    var md5 = require('spark-md5').hash;
    var protocol = require('@segment/protocol');
    var send = require('@segment/send-json');
    var topDomain = require('@segment/top-domain');
    var utm = require('@segment/utm-params');
    var uuid = require('uuid').v4;
    var Queue = require('@segment/localstorage-retry');

    /**
     * Cookie options
     */

    var cookieOptions = {
      // 1 year
      maxage: 31536000000,
      secure: false,
      path: '/'
    };


    /**
     * Segment messages can be a maximum of 32kb.
     */
    var MAX_SIZE = 32 * 1000;

    /**
     * Queue options
     *
     * Attempt with exponential backoff for upto 10 times.
     * Backoff periods are: 1s, 2s, 4s, 8s, 16s, 32s, 64s, 128s (~2m), 256s (~4m),
     * 512s (~8.5m) and 1024s (~17m).
     */

    var queueOptions = {
      maxRetryDelay: 360000, // max interval of 1hr. Added as a guard.
      minRetryDelay: 1000, // first attempt (1s)
      backoffFactor: 2,
      maxAttempts: 10,
      maxItems: 100
    };

    /**
     * Expose `Segment` integration.
     */

    var Segment = exports = module.exports = integration('Segment.io')
      .option('apiKey', '')
      .option('apiHost', 'api.segment.io/v1')
      .option('crossDomainIdServers', [])
      .option('retryQueue', true)
      .option('addBundledMetadata', false)
      .option('unbundledIntegrations', []);

    /**
     * Get the store.
     *
     * @return {Function}
     */

    exports.storage = function() {
      return protocol() === 'file:' || protocol() === 'chrome-extension:' ? localstorage : cookie;
    };

    /**
     * Expose global for testing.
     */

    exports.global = window;


    /**
     * Send the given `obj` and `headers` to `url` with the specified `timeout` and
     * `fn(err, req)`. Exported for testing.
     *
     * @param {String} url
     * @param {Object} obj
     * @param {Object} headers
     * @param {long} timeout
     * @param {Function} fn
     * @api private
     */

    exports.sendJsonWithTimeout = function(url, obj, headers, timeout, fn) {
      // only proceed with our new code path when cors is supported. this is
      // unlikely to happen in production, but we're being safe to preserve backward
      // compatibility.
      if (send.type !== 'xhr') {
        send(url, obj, headers, fn);
        return;
      }

      var req = new XMLHttpRequest();
      req.onerror = fn;
      req.onreadystatechange = done;

      req.open('POST', url, true);

      req.timeout = timeout;
      req.ontimeout = fn;

      // TODO: Remove this eslint disable
      // eslint-disable-next-line guard-for-in
      for (var k in headers) {
        req.setRequestHeader(k, headers[k]);
      }
      req.send(json.stringify(obj));

      function done() {
        if (req.readyState === 4) {
          // Fail on 429 and 5xx HTTP errors
          if (req.status === 429 || req.status >= 500 && req.status < 600) {
            fn(new Error('HTTP Error ' + req.status + ' (' + req.statusText + ')'));
          } else {
            fn(null, req);
          }
        }
      }
    };

    /**
     * Initialize.
     *
     * https://github.com/segmentio/segmentio/blob/master/modules/segmentjs/segment.js/v1/segment.js
     *
     * @api public
     */

    Segment.prototype.initialize = function() {
      var self = this;

      if (this.options.retryQueue) {
        this._lsqueue = new Queue('segmentio', queueOptions, function(item, done) {
          // apply sentAt at flush time and reset on each retry
          // so the tracking-api doesn't interpret a time skew
          item.msg.sentAt = new Date();

          // send with 10s timeout
          Segment.sendJsonWithTimeout(item.url, item.msg, item.headers, 10 * 1000, function(err, res) {
            self.debug('sent %O, received %O', item.msg, [err, res]);
            if (err) return done(err);
            done(null, res);
          });
        });

        this._lsqueue.start();
      }

      this.ready();

      this.analytics.on('invoke', function(msg) {
        var action = msg.action();
        var listener = 'on' + msg.action();
        self.debug('%s %o', action, msg);
        if (self[listener]) self[listener](msg);
        self.ready();
      });

      // Migrate from old cross domain id cookie names
      if (this.cookie('segment_cross_domain_id')) {
        this.cookie('seg_xid', this.cookie('segment_cross_domain_id'));
        this.cookie('seg_xid_fd', this.cookie('segment_cross_domain_id_from_domain'));
        this.cookie('seg_xid_ts', this.cookie('segment_cross_domain_id_timestamp'));
        this.cookie('segment_cross_domain_id', null);
        this.cookie('segment_cross_domain_id_from_domain', null);
        this.cookie('segment_cross_domain_id_timestamp', null);
      }

      // At this moment we intentionally do not want events to be queued while we retrieve the `crossDomainId`
      // so `.ready` will get called right away and we'll try to figure out `crossDomainId`
      // separately
      if (this.options.crossDomainIdServers && this.options.crossDomainIdServers.length > 0) {
        this.retrieveCrossDomainId();
      }
    };

    /**
     * Loaded.
     *
     * @api private
     * @return {boolean}
     */

    Segment.prototype.loaded = function() {
      return true;
    };

    /**
     * Page.
     *
     * @api public
     * @param {Page} page
     */

    Segment.prototype.onpage = function(page) {
      this.enqueue('/p', page.json());
    };

    /**
     * Identify.
     *
     * @api public
     * @param {Identify} identify
     */

    Segment.prototype.onidentify = function(identify) {
      this.enqueue('/i', identify.json());
    };

    /**
     * Group.
     *
     * @api public
     * @param {Group} group
     */

    Segment.prototype.ongroup = function(group) {
      this.enqueue('/g', group.json());
    };

    /**
     * ontrack.
     *
     * TODO: Document this.
     *
     * @api private
     * @param {Track} track
     */

    Segment.prototype.ontrack = function(track) {
      var json = track.json();
      // TODO: figure out why we need traits.
      delete json.traits;
      this.enqueue('/t', json);
    };

    /**
     * Alias.
     *
     * @api public
     * @param {Alias} alias
     */

    Segment.prototype.onalias = function(alias) {
      var json = alias.json();
      var user = this.analytics.user();
      json.previousId = json.previousId || json.from || user.id() || user.anonymousId();
      json.userId = json.userId || json.to;
      delete json.from;
      delete json.to;
      this.enqueue('/a', json);
    };

    /**
     * Normalize the given `msg`.
     *
     * @api private
     * @param {Object} msg
     */

    Segment.prototype.normalize = function(msg) {
      this.debug('normalize %o', msg);
      var user = this.analytics.user();
      var global = exports.global;
      var query = global.location.search;
      var ctx = msg.context = msg.context || msg.options || {};
      delete msg.options;
      msg.writeKey = this.options.apiKey;
      ctx.userAgent = navigator.userAgent;
      if (!ctx.library) ctx.library = { name: 'analytics.js', version: this.analytics.VERSION };
      var crossDomainId = this.cookie('seg_xid');
      if (crossDomainId) {
        if (!ctx.traits) {
          ctx.traits = { crossDomainId: crossDomainId };
        } else if (!ctx.traits.crossDomainId) {
          ctx.traits.crossDomainId = crossDomainId;
        }
      }
      // if user provides campaign via context, do not overwrite with UTM qs param
      if (query && !ctx.campaign) {
        ctx.campaign = utm(query);
      }
      this.referrerId(query, ctx);
      msg.userId = msg.userId || user.id();
      msg.anonymousId = user.anonymousId();
      msg.sentAt = new Date();
      // Add _metadata.
      var failedInitializations = this.analytics.failedInitializations || [];
      if (failedInitializations.length > 0) {
        msg._metadata = { failedInitializations: failedInitializations };
      }
      if (this.options.addBundledMetadata) {
        var bundled = keys(this.analytics.Integrations);
        msg._metadata = msg._metadata || {};
        msg._metadata.bundled = bundled;
        msg._metadata.unbundled = this.options.unbundledIntegrations;
      }
      // add some randomness to the messageId checksum
      msg.messageId = 'ajs-' + md5(json.stringify(msg) + uuid());
      this.debug('normalized %o', msg);
      this.ampId(ctx);
      return msg;
    };

    /**
     * Add amp id if it exists.
     *
     * @param {Object} ctx
     */

    Segment.prototype.ampId = function(ctx) {
      var ampId = this.cookie('segment_amp_id');
      if (ampId) ctx.amp = { id: ampId };
    };

    /**
     * Send `obj` to `path`.
     *
     * @api private
     * @param {string} path
     * @param {Object} obj
     * @param {Function} fn
     */

    Segment.prototype.enqueue = function(path, msg, fn) {
      var url = 'https://' + this.options.apiHost + path;
      var headers = { 'Content-Type': 'text/plain' };
      msg = this.normalize(msg);

      // Print a log statement when messages exceed the maximum size. In the future,
      // we may consider dropping this event on the client entirely.
      if (json.stringify(msg).length > MAX_SIZE) {
        this.debug('message must be less than 32kb %O', msg);
      }

      this.debug('enqueueing %O', msg);

      var self = this;
      if (this.options.retryQueue) {
        this._lsqueue.addItem({
          url: url,
          headers: headers,
          msg: msg
        });
      } else {
        send(url, msg, headers, function(err, res) {
          self.debug('sent %O, received %O', msg, [err, res]);
          if (fn) {
            if (err) return fn(err);
            fn(null, res);
          }
        });
      }
    };

    /**
     * Gets/sets cookies on the appropriate domain.
     *
     * @api private
     * @param {string} name
     * @param {*} val
     */

    Segment.prototype.cookie = function(name, val) {
      var store = Segment.storage();
      if (arguments.length === 1) return store(name);
      var global = exports.global;
      var href = global.location.href;
      var domain = '.' + topDomain(href);
      if (domain === '.') domain = '';
      this.debug('store domain %s -> %s', href, domain);
      var opts = clone(cookieOptions);
      opts.domain = domain;
      this.debug('store %s, %s, %o', name, val, opts);
      store(name, val, opts);
      if (store(name)) return;
      delete opts.domain;
      this.debug('fallback store %s, %s, %o', name, val, opts);
      store(name, val, opts);
    };

    /**
     * Add referrerId to context.
     *
     * TODO: remove.
     *
     * @api private
     * @param {Object} query
     * @param {Object} ctx
     */

    Segment.prototype.referrerId = function(query, ctx) {
      var stored = this.cookie('s:context.referrer');
      var ad;

      if (stored) stored = json.parse(stored);
      if (query) ad = ads(query);

      ad = ad || stored;

      if (!ad) return;
      ctx.referrer = extend(ctx.referrer || {}, ad);
      this.cookie('s:context.referrer', json.stringify(ad));
    };


    /**
     * retrieveCrossDomainId.
     *
     * @api private
     * @param {function) callback => err, {crossDomainId, fromServer, timestamp}
     */
    Segment.prototype.retrieveCrossDomainId = function(callback) {
      if (!this.options.crossDomainIdServers) {
        if (callback) {
          callback('crossDomainId not enabled', null);
        }
        return;
      }
      if (!this.cookie('seg_xid')) {
        var self = this;
        var writeKey = this.options.apiKey;

        // Exclude the current domain from the list of servers we're querying
        var currentTld = getTld(window.location.hostname);
        var domains = [];
        for (var i=0; i<this.options.crossDomainIdServers.length; i++) {
          var domain = this.options.crossDomainIdServers[i];
          if (getTld(domain) !== currentTld) {
            domains.push(domain);
          }
        }

        getCrossDomainIdFromServerList(domains, writeKey, function(err, res) {
          if (err) {
            // We optimize for no conflicting xid as much as possible. So bail out if there is an
            // error and we cannot be sure that xid does not exist on any other domains
            if (callback) {
              callback(err, null);
            }
            return;
          }
          var crossDomainId = null;
          var fromDomain = null;
          if (res) {
            crossDomainId = res.id;
            fromDomain = res.domain;
          } else {
            crossDomainId = uuid();
            fromDomain = window.location.hostname;
          }
          var currentTimeMillis = (new Date()).getTime();
          self.cookie('seg_xid', crossDomainId);
          // Not actively used. Saving for future conflict resolution purposes
          self.cookie('seg_xid_fd', fromDomain);
          self.cookie('seg_xid_ts', currentTimeMillis);
          self.analytics.identify({
            crossDomainId: crossDomainId
          });
          if (callback) {
            callback(null, {
              crossDomainId: crossDomainId,
              fromDomain: fromDomain,
              timestamp: currentTimeMillis
            });
          }
        });
      }
    };

    /**
     * getCrossDomainIdFromServers
     * @param {Array} domains
     * @param {string} writeKey
     * @param {function} callback => err, {domain, id}
     */
    function getCrossDomainIdFromServerList(domains, writeKey, callback) {
      // Should not happen but special case
      if (domains.length === 0) {
        callback(null, null);
      }
      var crossDomainIdFound = false;
      var finishedRequests = 0;
      var error = null;
      for (var i=0; i<domains.length; i++) {
        var domain = domains[i];

        getCrossDomainIdFromSingleServer(domain, writeKey, function(err, res) {
          finishedRequests++;
          if (err) {
            // if request against a particular domain fails, we won't early exit
            // but rather wait and see if requests to other domains succeed
            error = err;
          } else if (res && res.id && !crossDomainIdFound) {
            // If we found an xid from any of the servers, we'll just early exit and callback
            crossDomainIdFound = true;
            callback(null, res);
          }
          if (finishedRequests === domains.length && !crossDomainIdFound) {
            // Error is non-null if we encountered an issue, otherwise error will be null
            // meaning that no domains in the list has an xid for current user
            callback(error, null);
          }
        });
      }
    }

    /**
     * getCrossDomainId
     * @param {Array} domain
     * @param {string} writeKey
     * @param {function} callback => err, {domain, id}
     */
    function getCrossDomainIdFromSingleServer(domain, writeKey, callback) {
      var endpoint = 'https://' + domain + '/v1/id/' + writeKey;
      getJson(endpoint, function(err, res) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, {
            domain: domain,
            id: res && res.id || null
          });
        }
      });
    }

    /**
     * getJson
     * @param {string} url
     * @param {function} callback => err, json
     */
    function getJson(url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.withCredentials = true;
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status >= 200 && xhr.status < 300) {
            callback(null, xhr.responseText ? json.parse(xhr.responseText) : null);
          } else {
            callback(xhr.statusText || 'Unknown Error', null);
          }
        }
      };
      xhr.send();
    }

    /**
     * getTld
     * Get domain.com from subdomain.domain.com, etc.
     * @param {string} domain
     * @return {string} tld
     */
    function getTld(domain) {
      return domain.split('.').splice(-2).join('.');
    }

    },{"@ndhoule/extend":10,"@ndhoule/keys":13,"@segment/ad-params":17,"@segment/analytics.js-integration":31,"@segment/localstorage-retry":45,"@segment/protocol":54,"@segment/send-json":55,"@segment/top-domain":57,"@segment/utm-params":58,"component-clone":61,"component-cookie":62,"json3":82,"spark-md5":109,"uuid":117,"yields-store":118}],31:[function(require,module,exports){
    'use strict';

    /**
     * Module dependencies.
     */

    var bind = require('component-bind');
    var clone = require('@ndhoule/clone');
    var debug = require('debug');
    var defaults = require('@ndhoule/defaults');
    var extend = require('@ndhoule/extend');
    var slug = require('slug-component');
    var protos = require('./protos');
    var statics = require('./statics');

    /**
     * Create a new `Integration` constructor.
     *
     * @constructs Integration
     * @param {string} name
     * @return {Function} Integration
     */

    function createIntegration(name) {
      /**
       * Initialize a new `Integration`.
       *
       * @class
       * @param {Object} options
       */

      function Integration(options) {
        if (options && options.addIntegration) {
          // plugin
          return options.addIntegration(Integration);
        }
        this.debug = debug('analytics:integration:' + slug(name));
        this.options = defaults(clone(options) || {}, this.defaults);
        this._queue = [];
        this.once('ready', bind(this, this.flush));

        Integration.emit('construct', this);
        this.ready = bind(this, this.ready);
        this._wrapInitialize();
        this._wrapPage();
        this._wrapTrack();
      }

      Integration.prototype.defaults = {};
      Integration.prototype.globals = [];
      Integration.prototype.templates = {};
      Integration.prototype.name = name;
      extend(Integration, statics);
      extend(Integration.prototype, protos);

      return Integration;
    }

    /**
     * Exports.
     */

    module.exports = createIntegration;

    },{"./protos":32,"./statics":33,"@ndhoule/clone":5,"@ndhoule/defaults":6,"@ndhoule/extend":10,"component-bind":60,"debug":35,"slug-component":108}],32:[function(require,module,exports){
    'use strict';

    /**
     * Module dependencies.
     */

    var Emitter = require('component-emitter');
    var after = require('@ndhoule/after');
    var each = require('@ndhoule/each');
    var events = require('analytics-events');
    var every = require('@ndhoule/every');
    var fmt = require('@segment/fmt');
    var foldl = require('@ndhoule/foldl');
    var is = require('is');
    var loadIframe = require('load-iframe');
    var loadScript = require('@segment/load-script');
    var nextTick = require('next-tick');
    var normalize = require('to-no-case');

    /**
     * hasOwnProperty reference.
     */

    var has = Object.prototype.hasOwnProperty;

    /**
     * No operation.
     */

    var noop = function noop() {};

    /**
     * Window defaults.
     */

    var onerror = window.onerror;
    var onload = null;

    /**
     * Mixin emitter.
     */

    /* eslint-disable new-cap */
    Emitter(exports);
    /* eslint-enable new-cap */

    /**
     * Initialize.
     */

    exports.initialize = function() {
      var ready = this.ready;
      nextTick(ready);
    };

    /**
     * Loaded?
     *
     * @api private
     * @return {boolean}
     */

    exports.loaded = function() {
      return false;
    };

    /**
     * Page.
     *
     * @api public
     * @param {Page} page
     */

    /* eslint-disable no-unused-vars */
    exports.page = function(page) {};
    /* eslint-enable no-unused-vars */

    /**
     * Track.
     *
     * @api public
     * @param {Track} track
     */

    /* eslint-disable no-unused-vars */
    exports.track = function(track) {};
    /* eslint-enable no-unused-vars */

    /**
     * Get values from items in `options` that are mapped to `key`.
     * `options` is an integration setting which is a collection
     * of type 'map', 'array', or 'mixed'
     *
     * Use cases include mapping events to pixelIds (map), sending generic
     * conversion pixels only for specific events (array), or configuring dynamic
     * mappings of event properties to query string parameters based on event (mixed)
     *
     * @api public
     * @param {Object|Object[]|String[]} options An object, array of objects, or
     * array of strings pulled from settings.mapping.
     * @param {string} key The name of the item in options whose metadata
     * we're looking for.
     * @return {Array} An array of settings that match the input `key` name.
     * @example
     *
     * // 'Map'
     * var events = { my_event: 'a4991b88' };
     * .map(events, 'My Event');
     * // => ["a4991b88"]
     * .map(events, 'whatever');
     * // => []
     *
     * // 'Array'
     * * var events = ['Completed Order', 'My Event'];
     * .map(events, 'My Event');
     * // => ["My Event"]
     * .map(events, 'whatever');
     * // => []
     *
     * // 'Mixed'
     * var events = [{ key: 'my event', value: '9b5eb1fa' }];
     * .map(events, 'my_event');
     * // => ["9b5eb1fa"]
     * .map(events, 'whatever');
     * // => []
     */

    exports.map = function(options, key) {
      var normalizedComparator = normalize(key);
      var mappingType = getMappingType(options);

      if (mappingType === 'unknown') {
        return [];
      }

      return foldl(function(matchingValues, val, key) {
        var compare;
        var result;

        if (mappingType === 'map') {
          compare = key;
          result = val;
        }

        if (mappingType === 'array') {
          compare = val;
          result = val;
        }

        if (mappingType === 'mixed') {
          compare = val.key;
          result = val.value;
        }

        if (normalize(compare) === normalizedComparator) {
          matchingValues.push(result);
        }

        return matchingValues;
      }, [], options);
    };

    /**
     * Invoke a `method` that may or may not exist on the prototype with `args`,
     * queueing or not depending on whether the integration is "ready". Don't
     * trust the method call, since it contains integration party code.
     *
     * @api private
     * @param {string} method
     * @param {...*} args
     */

    exports.invoke = function(method) {
      if (!this[method]) return;
      var args = Array.prototype.slice.call(arguments, 1);
      if (!this._ready) return this.queue(method, args);

      this.debug('%s with %o', method, args);
      return this[method].apply(this, args);
    };

    /**
     * Queue a `method` with `args`. If the integration assumes an initial
     * pageview, then let the first call to `page` pass through.
     *
     * @api private
     * @param {string} method
     * @param {Array} args
     */

    exports.queue = function(method, args) {
      if (method === 'page' && this._assumesPageview && !this._initialized) {
        return this.page.apply(this, args);
      }

      this._queue.push({ method: method, args: args });
    };

    /**
     * Flush the internal queue.
     *
     * @api private
     */

    exports.flush = function() {
      this._ready = true;
      var self = this;

      each(function(call) {
        self[call.method].apply(self, call.args);
      }, this._queue);

      // Empty the queue.
      this._queue.length = 0;
    };

    /**
     * Reset the integration, removing its global variables.
     *
     * @api private
     */

    exports.reset = function() {
      for (var i = 0; i < this.globals.length; i++) {
        window[this.globals[i]] = undefined;
      }

      window.onerror = onerror;
      window.onload = onload;
    };

    /**
     * Load a tag by `name`.
     *
     * @param {string} name The name of the tag.
     * @param {Object} locals Locals used to populate the tag's template variables
     * (e.g. `userId` in '<img src="https://whatever.com/{{ userId }}">').
     * @param {Function} [callback=noop] A callback, invoked when the tag finishes
     * loading.
     */

    exports.load = function(name, locals, callback) {
      // Argument shuffling
      if (typeof name === 'function') { callback = name; locals = null; name = null; }
      if (name && typeof name === 'object') { callback = locals; locals = name; name = null; }
      if (typeof locals === 'function') { callback = locals; locals = null; }

      // Default arguments
      name = name || 'library';
      locals = locals || {};

      locals = this.locals(locals);
      var template = this.templates[name];
      if (!template) throw new Error(fmt('template "%s" not defined.', name));
      var attrs = render(template, locals);
      callback = callback || noop;
      var self = this;
      var el;

      switch (template.type) {
      case 'img':
        attrs.width = 1;
        attrs.height = 1;
        el = loadImage(attrs, callback);
        break;
      case 'script':
        el = loadScript(attrs, function(err) {
          if (!err) return callback();
          self.debug('error loading "%s" error="%s"', self.name, err);
        });
          // TODO: hack until refactoring load-script
        delete attrs.src;
        each(function(val, key) {
          el.setAttribute(key, val);
        }, attrs);
        break;
      case 'iframe':
        el = loadIframe(attrs, callback);
        break;
      default:
          // No default case
      }

      return el;
    };

    /**
     * Locals for tag templates.
     *
     * By default it includes a cache buster and all of the options.
     *
     * @param {Object} [locals]
     * @return {Object}
     */

    exports.locals = function(locals) {
      locals = locals || {};
      var cache = Math.floor(new Date().getTime() / 3600000);
      if (!locals.hasOwnProperty('cache')) locals.cache = cache;
      each(function(val, key) {
        if (!locals.hasOwnProperty(key)) locals[key] = val;
      }, this.options);
      return locals;
    };

    /**
     * Simple way to emit ready.
     *
     * @api public
     */

    exports.ready = function() {
      this.emit('ready');
    };

    /**
     * Wrap the initialize method in an exists check, so we don't have to do it for
     * every single integration.
     *
     * @api private
     */

    exports._wrapInitialize = function() {
      var initialize = this.initialize;
      this.initialize = function() {
        this.debug('initialize');
        this._initialized = true;
        var ret = initialize.apply(this, arguments);
        this.emit('initialize');
        return ret;
      };

      if (this._assumesPageview) this.initialize = after(2, this.initialize);
    };

    /**
     * Wrap the page method to call `initialize` instead if the integration assumes
     * a pageview.
     *
     * @api private
     */

    exports._wrapPage = function() {
      var page = this.page;
      this.page = function() {
        if (this._assumesPageview && !this._initialized) {
          return this.initialize.apply(this, arguments);
        }

        return page.apply(this, arguments);
      };
    };

    /**
     * Wrap the track method to call other ecommerce methods if available depending
     * on the `track.event()`.
     *
     * @api private
     */

    exports._wrapTrack = function() {
      var t = this.track;
      this.track = function(track) {
        var event = track.event();
        var called;
        var ret;

        for (var method in events) {
          if (has.call(events, method)) {
            var regexp = events[method];
            if (!this[method]) continue;
            if (!regexp.test(event)) continue;
            ret = this[method].apply(this, arguments);
            called = true;
            break;
          }
        }

        if (!called) ret = t.apply(this, arguments);
        return ret;
      };
    };

    /**
     * Determine the type of the option passed to `#map`
     *
     * @api private
     * @param {Object|Object[]} mapping
     * @return {String} mappingType
     */

    function getMappingType(mapping) {
      if (is.array(mapping)) {
        return every(isMixed, mapping) ? 'mixed' : 'array';
      }
      if (is.object(mapping)) return 'map';
      return 'unknown';
    }

    /**
     * Determine if item in mapping array is a valid "mixed" type value
     *
     * Must be an object with properties "key" (of type string)
     * and "value" (of any type)
     *
     * @api private
     * @param {*} item
     * @return {Boolean}
     */

    function isMixed(item) {
      if (!is.object(item)) return false;
      if (!is.string(item.key)) return false;
      if (!has.call(item, 'value')) return false;
      return true;
    }

    /**
     * TODO: Document me
     *
     * @api private
     * @param {Object} attrs
     * @param {Function} fn
     * @return {Image}
     */

    function loadImage(attrs, fn) {
      fn = fn || function() {};
      var img = new Image();
      img.onerror = error(fn, 'failed to load pixel', img);
      img.onload = function() { fn(); };
      img.src = attrs.src;
      img.width = 1;
      img.height = 1;
      return img;
    }

    /**
     * TODO: Document me
     *
     * @api private
     * @param {Function} fn
     * @param {string} message
     * @param {Element} img
     * @return {Function}
     */

    function error(fn, message, img) {
      return function(e) {
        e = e || window.event;
        var err = new Error(message);
        err.event = e;
        err.source = img;
        fn(err);
      };
    }

    /**
     * Render template + locals into an `attrs` object.
     *
     * @api private
     * @param {Object} template
     * @param {Object} locals
     * @return {Object}
     */

    function render(template, locals) {
      return foldl(function(attrs, val, key) {
        attrs[key] = val.replace(/\{\{\ *(\w+)\ *\}\}/g, function(_, $1) {
          return locals[$1];
        });
        return attrs;
      }, {}, template.attrs);
    }

    },{"@ndhoule/after":3,"@ndhoule/each":8,"@ndhoule/every":9,"@ndhoule/foldl":11,"@segment/fmt":39,"@segment/load-script":43,"analytics-events":34,"component-emitter":68,"is":81,"load-iframe":86,"next-tick":92,"to-no-case":112}],33:[function(require,module,exports){
    'use strict';

    /**
     * Module dependencies.
     */

    var Emitter = require('component-emitter');
    var domify = require('domify');
    var each = require('@ndhoule/each');
    var includes = require('@ndhoule/includes');

    /**
     * Mix in emitter.
     */

    /* eslint-disable new-cap */
    Emitter(exports);
    /* eslint-enable new-cap */

    /**
     * Add a new option to the integration by `key` with default `value`.
     *
     * @api public
     * @param {string} key
     * @param {*} value
     * @return {Integration}
     */

    exports.option = function(key, value) {
      this.prototype.defaults[key] = value;
      return this;
    };

    /**
     * Add a new mapping option.
     *
     * This will create a method `name` that will return a mapping for you to use.
     *
     * @api public
     * @param {string} name
     * @return {Integration}
     * @example
     * Integration('My Integration')
     *   .mapping('events');
     *
     * new MyIntegration().track('My Event');
     *
     * .track = function(track){
     *   var events = this.events(track.event());
     *   each(send, events);
     *  };
     */

    exports.mapping = function(name) {
      this.option(name, []);
      this.prototype[name] = function(key) {
        return this.map(this.options[name], key);
      };
      return this;
    };

    /**
     * Register a new global variable `key` owned by the integration, which will be
     * used to test whether the integration is already on the page.
     *
     * @api public
     * @param {string} key
     * @return {Integration}
     */

    exports.global = function(key) {
      this.prototype.globals.push(key);
      return this;
    };

    /**
     * Mark the integration as assuming an initial pageview, so to defer loading
     * the script until the first `page` call, noop the first `initialize`.
     *
     * @api public
     * @return {Integration}
     */

    exports.assumesPageview = function() {
      this.prototype._assumesPageview = true;
      return this;
    };

    /**
     * Mark the integration as being "ready" once `load` is called.
     *
     * @api public
     * @return {Integration}
     */

    exports.readyOnLoad = function() {
      this.prototype._readyOnLoad = true;
      return this;
    };

    /**
     * Mark the integration as being "ready" once `initialize` is called.
     *
     * @api public
     * @return {Integration}
     */

    exports.readyOnInitialize = function() {
      this.prototype._readyOnInitialize = true;
      return this;
    };

    /**
     * Define a tag to be loaded.
     *
     * @api public
     * @param {string} [name='library'] A nicename for the tag, commonly used in
     * #load. Helpful when the integration has multiple tags and you need a way to
     * specify which of the tags you want to load at a given time.
     * @param {String} str DOM tag as string or URL.
     * @return {Integration}
     */

    exports.tag = function(name, tag) {
      if (tag == null) {
        tag = name;
        name = 'library';
      }
      this.prototype.templates[name] = objectify(tag);
      return this;
    };

    /**
     * Given a string, give back DOM attributes.
     *
     * Do it in a way where the browser doesn't load images or iframes. It turns
     * out domify will load images/iframes because whenever you construct those
     * DOM elements, the browser immediately loads them.
     *
     * @api private
     * @param {string} str
     * @return {Object}
     */

    function objectify(str) {
      // replace `src` with `data-src` to prevent image loading
      str = str.replace(' src="', ' data-src="');

      var el = domify(str);
      var attrs = {};

      each(function(attr) {
        // then replace it back
        var name = attr.name === 'data-src' ? 'src' : attr.name;
        if (!includes(attr.name + '=', str)) return;
        attrs[name] = attr.value;
      }, el.attributes);

      return {
        type: el.tagName.toLowerCase(),
        attrs: attrs
      };
    }

    },{"@ndhoule/each":8,"@ndhoule/includes":12,"component-emitter":68,"domify":76}],34:[function(require,module,exports){

    module.exports = {
      // Promotions
      promotionViewed: /^[ _]?promotion[ _]?viewed?[ _]?$/i,
      viewedPromotion: /^[ _]?viewed[ _]?promotion?[ _]?$/i,
      promotionClicked: /^[ _]?promotion[ _]?clicked?[ _]?$/i,
      clickedPromotion: /^[ _]?clicked[ _]?promotion?[ _]?$/i,
      // Browsing
      productsSearched: /^[ _]?products[ _]?searched[ _]?$/i,
      productListViewed: /^[ _]?product[ _]?list[ _]?viewed[ _]?$/i,
      productListFiltered: /^[ _]?product[ _]?list[ _]?filtered[ _]?$/i,
      viewedProductCategory: /^[ _]?viewed[ _]?product[ _]?category[ _]?$/i,
      viewedProductDetails: /^[ _]?viewed[ _]?product[ _]?details?[ _]?$/i,
      // Core Ordering
      productClicked: /^[ _]?product[ _]?clicked[ _]?$/i,
      clickedProduct: /^[ _]?clicked[ _]?product[ _]?$/i,
      productViewed: /^[ _]?product[ _]?viewed[ _]?$/i,
      viewedProduct: /^[ _]?viewed[ _]?product[ _]?$/i,
      productAdded: /^[ _]?product[ _]?added[ _]?$/i,
      addedProduct: /^[ _]?added[ _]?product[ _]?$/i,
      productRemoved: /^[ _]?product[ _]?removed[ _]?$/i,
      removedProduct: /^[ _]?removed[ _]?product[ _]?$/i,
      cartViewed: /^[ _]?cart[ _]?viewed[ _]?$/i,
      orderStarted: /^[ _]?order[ _]?started[ _]?$/i,
      startedOrder: /^[ _]?started[ _]?order[ _]?$/i,
      orderUpdated: /^[ _]?order[ _]?updated[ _]?$/i,
      updatedOrder: /^[ _]?updated[ _]?order[ _]?$/i,
      orderCompleted: /^[ _]?order[ _]?completed[ _]?$/i,
      completedOrder: /^[ _]?completed[ _]?order[ _]?$/i,
      orderRefunded: /^[ _]?order[ _]?refunded[ _]?$/i,
      refundedOrder: /^[ _]?refunded[ _]?order[ _]?$/i,
      orderCancelled: /^[ _]?order[ _]?cancelled[ _]?$/i,
      paymentInfoAdded: /^[ _]?payment[ _]?info[ _]?added[ _]?$/i,
      checkoutStarted: /^[ _]?checkout[ _]?started[ _]?$/i,
      checkoutStepViewed: /^[ _]?checkout[ _]?step[ _]?viewed[ _]?$/i,
      viewedCheckoutStep: /^[ _]?viewed[ _]?checkout[ _]?step[ _]?$/i,
      checkoutStepCompleted: /^[ _]?checkout[ _]?step[ _]?completed[ _]?$/i,
      completedCheckoutStep: /^[ _]?completed[ _]?checkout[ _]?step[ _]?$/i,
      // Coupons
      couponEntered: /^[ _]?coupon[ _]?entered[ _]?$/i,
      couponApplied: /^[ _]?coupon[ _]?applied[ _]?$/i,
      couponDenied: /^[ _]?coupon[ _]?denied[ _]?$/i,
      couponRemoved: /^[ _]?coupon[ _]?removed[ _]?$/i,
      // Wishlisting
      productAddedToWishlist: /^[ _]?product[ _]?added[ _]?to[ _]?wishlist[ _]?$/i,
      wishlistProductRemoved: /^[ _]?wishlist[ _]?product[ _]?removed[ _]?$/i,
      wishlistProductAddedToCart: /^[ _]?wishlist[ _]?product[ _]?added[ _]?to[ _]?cart[ _]?$/i,
      // Sharing
      productShared: /^[ _]?product[ _]?shared[ _]?$/i,
      cartShared: /^[ _]?cart[ _]?shared[ _]?$/i,
      // Reviewing
      productRemoved: /^[ _]?product[ _]?removed[ _]?$/i,
      // App Lifecycle
      applicationInstalled: /^[ _]?application[ _]?installed[ _]?$/i,
      applicationUpdated: /^[ _]?application[ _]?updated[ _]?$/i,
      applicationOpened: /^[ _]?application[ _]?opened[ _]?$/i,
      applicationBackgrounded: /^[ _]?application[ _]?backgrounded[ _]?$/i,
      applicationUninstalled: /^[ _]?application[ _]?uninstalled[ _]?$/i,
      // App Campaign and Referral Events
      installAttributed: /^[ _]?install[ _]?attributed[ _]?$/i,
      deepLinkOpened: /^[ _]?deep[ _]?link[ _]?opened[ _]?$/i,
      pushNotificationReceived: /^[ _]?push[ _]?notification[ _]?received[ _]?$/i,
      pushNotificationTapped: /^[ _]?push[ _]?notification[ _]?received[ _]?$/i,
      pushNotificationBounced: /^[ _]?push[ _]?notification[ _]?bounced[ _]?$/i
    };

    },{}],35:[function(require,module,exports){
    (function (process){
    /**
     * This is the web browser implementation of `debug()`.
     *
     * Expose `debug()` as the module.
     */

    exports = module.exports = require('./debug');
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = 'undefined' != typeof chrome
                   && 'undefined' != typeof chrome.storage
                      ? chrome.storage.local
                      : localstorage();

    /**
     * Colors.
     */

    exports.colors = [
      'lightseagreen',
      'forestgreen',
      'goldenrod',
      'dodgerblue',
      'darkorchid',
      'crimson'
    ];

    /**
     * Currently only WebKit-based Web Inspectors, Firefox >= v31,
     * and the Firebug extension (any Firefox version) are known
     * to support "%c" CSS customizations.
     *
     * TODO: add a `localStorage` variable to explicitly enable/disable colors
     */

    function useColors() {
      // NB: In an Electron preload script, document will be defined but not fully
      // initialized. Since we know we're in Chrome, we'll just detect this case
      // explicitly
      if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
        return true;
      }

      // is webkit? http://stackoverflow.com/a/16459606/376773
      // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
      return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
        // is firebug? http://stackoverflow.com/a/398120/376773
        (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
        // is firefox >= v31?
        // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
        (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
        // double check webkit in userAgent just in case we are in a worker
        (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
    }

    /**
     * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
     */

    exports.formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (err) {
        return '[UnexpectedJSONParseError]: ' + err.message;
      }
    };


    /**
     * Colorize log arguments if enabled.
     *
     * @api public
     */

    function formatArgs(args) {
      var useColors = this.useColors;

      args[0] = (useColors ? '%c' : '')
        + this.namespace
        + (useColors ? ' %c' : ' ')
        + args[0]
        + (useColors ? '%c ' : ' ')
        + '+' + exports.humanize(this.diff);

      if (!useColors) return;

      var c = 'color: ' + this.color;
      args.splice(1, 0, c, 'color: inherit')

      // the final "%c" is somewhat tricky, because there could be other
      // arguments passed either before or after the %c, so we need to
      // figure out the correct index to insert the CSS into
      var index = 0;
      var lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, function(match) {
        if ('%%' === match) return;
        index++;
        if ('%c' === match) {
          // we only are interested in the *last* %c
          // (the user may have provided their own)
          lastC = index;
        }
      });

      args.splice(lastC, 0, c);
    }

    /**
     * Invokes `console.log()` when available.
     * No-op when `console.log` is not a "function".
     *
     * @api public
     */

    function log() {
      // this hackery is required for IE8/9, where
      // the `console.log` function doesn't have 'apply'
      return 'object' === typeof console
        && console.log
        && Function.prototype.apply.call(console.log, console, arguments);
    }

    /**
     * Save `namespaces`.
     *
     * @param {String} namespaces
     * @api private
     */

    function save(namespaces) {
      try {
        if (null == namespaces) {
          exports.storage.removeItem('debug');
        } else {
          exports.storage.debug = namespaces;
        }
      } catch(e) {}
    }

    /**
     * Load `namespaces`.
     *
     * @return {String} returns the previously persisted debug modes
     * @api private
     */

    function load() {
      var r;
      try {
        r = exports.storage.debug;
      } catch(e) {}

      // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
      if (!r && typeof process !== 'undefined' && 'env' in process) {
        r = process.env.DEBUG;
      }

      return r;
    }

    /**
     * Enable namespaces listed in `localStorage.debug` initially.
     */

    exports.enable(load());

    /**
     * Localstorage attempts to return the localstorage.
     *
     * This is necessary because safari throws
     * when a user disables cookies/localstorage
     * and you attempt to access it.
     *
     * @return {LocalStorage}
     * @api private
     */

    function localstorage() {
      try {
        return window.localStorage;
      } catch (e) {}
    }

    }).call(this,require('_process'))
    },{"./debug":36,"_process":94}],36:[function(require,module,exports){

    /**
     * This is the common logic for both the Node.js and web browser
     * implementations of `debug()`.
     *
     * Expose `debug()` as the module.
     */

    exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
    exports.coerce = coerce;
    exports.disable = disable;
    exports.enable = enable;
    exports.enabled = enabled;
    exports.humanize = require('ms');

    /**
     * The currently active debug mode names, and names to skip.
     */

    exports.names = [];
    exports.skips = [];

    /**
     * Map of special "%n" handling functions, for the debug "format" argument.
     *
     * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
     */

    exports.formatters = {};

    /**
     * Previous log timestamp.
     */

    var prevTime;

    /**
     * Select a color.
     * @param {String} namespace
     * @return {Number}
     * @api private
     */

    function selectColor(namespace) {
      var hash = 0, i;

      for (i in namespace) {
        hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }

      return exports.colors[Math.abs(hash) % exports.colors.length];
    }

    /**
     * Create a debugger with the given `namespace`.
     *
     * @param {String} namespace
     * @return {Function}
     * @api public
     */

    function createDebug(namespace) {

      function debug() {
        // disabled?
        if (!debug.enabled) return;

        var self = debug;

        // set `diff` timestamp
        var curr = +new Date();
        var ms = curr - (prevTime || curr);
        self.diff = ms;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;

        // turn the `arguments` into a proper Array
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }

        args[0] = exports.coerce(args[0]);

        if ('string' !== typeof args[0]) {
          // anything else let's inspect with %O
          args.unshift('%O');
        }

        // apply any `formatters` transformations
        var index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
          // if we encounter an escaped % then don't increase the array index
          if (match === '%%') return match;
          index++;
          var formatter = exports.formatters[format];
          if ('function' === typeof formatter) {
            var val = args[index];
            match = formatter.call(self, val);

            // now we need to remove `args[index]` since it's inlined in the `format`
            args.splice(index, 1);
            index--;
          }
          return match;
        });

        // apply env-specific formatting (colors, etc.)
        exports.formatArgs.call(self, args);

        var logFn = debug.log || exports.log || console.log.bind(console);
        logFn.apply(self, args);
      }

      debug.namespace = namespace;
      debug.enabled = exports.enabled(namespace);
      debug.useColors = exports.useColors();
      debug.color = selectColor(namespace);

      // env-specific initialization logic for debug instances
      if ('function' === typeof exports.init) {
        exports.init(debug);
      }

      return debug;
    }

    /**
     * Enables a debug mode by namespaces. This can include modes
     * separated by a colon and wildcards.
     *
     * @param {String} namespaces
     * @api public
     */

    function enable(namespaces) {
      exports.save(namespaces);

      exports.names = [];
      exports.skips = [];

      var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
      var len = split.length;

      for (var i = 0; i < len; i++) {
        if (!split[i]) continue; // ignore empty strings
        namespaces = split[i].replace(/\*/g, '.*?');
        if (namespaces[0] === '-') {
          exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
        } else {
          exports.names.push(new RegExp('^' + namespaces + '$'));
        }
      }
    }

    /**
     * Disable debug output.
     *
     * @api public
     */

    function disable() {
      exports.enable('');
    }

    /**
     * Returns true if the given mode name is enabled, false otherwise.
     *
     * @param {String} name
     * @return {Boolean}
     * @api public
     */

    function enabled(name) {
      var i, len;
      for (i = 0, len = exports.skips.length; i < len; i++) {
        if (exports.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = exports.names.length; i < len; i++) {
        if (exports.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }

    /**
     * Coerce `val`.
     *
     * @param {Mixed} val
     * @return {Mixed}
     * @api private
     */

    function coerce(val) {
      if (val instanceof Error) return val.stack || val.message;
      return val;
    }

    },{"ms":87}],37:[function(require,module,exports){
    var utf8Encode = require('utf8-encode');
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    module.exports = encode;
    function encode(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = utf8Encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                keyStr.charAt(enc3) + keyStr.charAt(enc4);

        }

        return output;
    }
    },{"utf8-encode":115}],38:[function(require,module,exports){
    'use strict';

    /**
     * Get the current page's canonical URL.
     *
     * @return {string|undefined}
     */
    function canonical() {
      var tags = document.getElementsByTagName('link');
      // eslint-disable-next-line no-cond-assign
      for (var i = 0, tag; tag = tags[i]; i++) {
        if (tag.getAttribute('rel') === 'canonical') {
          return tag.getAttribute('href');
        }
      }
    }

    /*
     * Exports.
     */

    module.exports = canonical;

    },{}],39:[function(require,module,exports){
    (function (global){
    'use strict';

    // Stringifier
    var toString = global.JSON && typeof JSON.stringify === 'function' ? JSON.stringify : String;

    /**
     * Format the given `str`.
     *
     * @param {string} str
     * @param {...*} [args]
     * @return {string}
     */
    function fmt(str) {
      var args = Array.prototype.slice.call(arguments, 1);
      var j = 0;

      return str.replace(/%([a-z])/gi, function(match, f) {
        return fmt[f] ? fmt[f](args[j++]) : match + f;
      });
    }

    // Formatters
    fmt.o = toString;
    fmt.s = String;
    fmt.d = parseInt;

    /*
     * Exports.
     */

    module.exports = fmt;

    }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    },{}],40:[function(require,module,exports){
    'use strict';

    function isMeta(e) {
      if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) {
        return true;
      }

      // Logic that handles checks for the middle mouse button, based
      // on [jQuery](https://github.com/jquery/jquery/blob/master/src/event.js#L466).
      var which = e.which;
      var button = e.button;
      if (!which && button !== undefined) {
        // eslint-disable-next-line no-bitwise, no-extra-parens
        return (!button & 1) && (!button & 2) && (button & 4);
      } else if (which === 2) {
        return true;
      }

      return false;
    }

    /*
     * Exports.
     */

    module.exports = isMeta;

    },{}],41:[function(require,module,exports){
    'use strict';

    var type = require('component-type');
    var each = require('component-each');
    var isodate = require('@segment/isodate');

    /**
     * Expose `traverse`.
     */

    module.exports = traverse;

    /**
     * Traverse an object or array, and return a clone with all ISO strings parsed
     * into Date objects.
     *
     * @param {Object} obj
     * @return {Object}
     */

    function traverse(input, strict) {
      if (strict === undefined) strict = true;

      if (type(input) === 'object') return object(input, strict);
      if (type(input) === 'array') return array(input, strict);
      return input;
    }

    /**
     * Object traverser.
     *
     * @param {Object} obj
     * @param {Boolean} strict
     * @return {Object}
     */

    function object(obj, strict) {
      // 'each' utility uses obj.length to check whether the obj is array. To avoid incorrect classification, wrap call to 'each' with rename of obj.length
      if (obj.length && typeof obj.length === 'number' && !(obj.length - 1 in obj)) { // cross browser compatible way of checking has length and is not array
        obj.lengthNonArray = obj.length;
        delete obj.length;
      }
      each(obj, function(key, val) {
        if (isodate.is(val, strict)) {
          obj[key] = isodate.parse(val);
        } else if (type(val) === 'object' || type(val) === 'array') {
          traverse(val, strict);
        }
      });
      // restore obj.length if it was renamed
      if (obj.lengthNonArray) {
        obj.length = obj.lengthNonArray;
        delete obj.lengthNonArray;
      }
      return obj;
    }

    /**
     * Array traverser.
     *
     * @param {Array} arr
     * @param {Boolean} strict
     * @return {Array}
     */

    function array(arr, strict) {
      each(arr, function(val, x) {
        if (type(val) === 'object') {
          traverse(val, strict);
        } else if (isodate.is(val, strict)) {
          arr[x] = isodate.parse(val);
        }
      });
      return arr;
    }

    },{"@segment/isodate":42,"component-each":66,"component-type":73}],42:[function(require,module,exports){
    'use strict';

    /**
     * Matcher, slightly modified from:
     *
     * https://github.com/csnover/js-iso8601/blob/lax/iso8601.js
     */

    var matcher = /^(\d{4})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:([ T])(\d{2}):?(\d{2})(?::?(\d{2})(?:[,\.](\d{1,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?)?)?$/;

    /**
     * Convert an ISO date string to a date. Fallback to native `Date.parse`.
     *
     * https://github.com/csnover/js-iso8601/blob/lax/iso8601.js
     *
     * @param {String} iso
     * @return {Date}
     */

    exports.parse = function(iso) {
      var numericKeys = [1, 5, 6, 7, 11, 12];
      var arr = matcher.exec(iso);
      var offset = 0;

      // fallback to native parsing
      if (!arr) {
        return new Date(iso);
      }

      /* eslint-disable no-cond-assign */
      // remove undefined values
      for (var i = 0, val; val = numericKeys[i]; i++) {
        arr[val] = parseInt(arr[val], 10) || 0;
      }
      /* eslint-enable no-cond-assign */

      // allow undefined days and months
      arr[2] = parseInt(arr[2], 10) || 1;
      arr[3] = parseInt(arr[3], 10) || 1;

      // month is 0-11
      arr[2]--;

      // allow abitrary sub-second precision
      arr[8] = arr[8] ? (arr[8] + '00').substring(0, 3) : 0;

      // apply timezone if one exists
      if (arr[4] === ' ') {
        offset = new Date().getTimezoneOffset();
      } else if (arr[9] !== 'Z' && arr[10]) {
        offset = arr[11] * 60 + arr[12];
        if (arr[10] === '+') {
          offset = 0 - offset;
        }
      }

      var millis = Date.UTC(arr[1], arr[2], arr[3], arr[5], arr[6] + offset, arr[7], arr[8]);
      return new Date(millis);
    };


    /**
     * Checks whether a `string` is an ISO date string. `strict` mode requires that
     * the date string at least have a year, month and date.
     *
     * @param {String} string
     * @param {Boolean} strict
     * @return {Boolean}
     */

    exports.is = function(string, strict) {
      if (typeof string !== 'string') {
        return false;
      }
      if (strict && (/^\d{4}-\d{2}-\d{2}/).test(string) === false) {
        return false;
      }
      return matcher.test(string);
    };

    },{}],43:[function(require,module,exports){
    'use strict';

    /*
     * Module dependencies.
     */

    var onload = require('script-onload');
    var tick = require('next-tick');
    var type = require('component-type');

    /**
     * Loads a script asynchronously.
     *
     * @param {Object} options
     * @param {Function} cb
     */
    function loadScript(options, cb) {
      if (!options) {
        throw new Error('Can\'t load nothing...');
      }

      // Allow for the simplest case, just passing a `src` string.
      if (type(options) === 'string') {
        options = { src : options };
      }

      var https = document.location.protocol === 'https:' || document.location.protocol === 'chrome-extension:';

      // If you use protocol relative URLs, third-party scripts like Google
      // Analytics break when testing with `file:` so this fixes that.
      if (options.src && options.src.indexOf('//') === 0) {
        options.src = (https ? 'https:' : 'http:') + options.src;
      }

      // Allow them to pass in different URLs depending on the protocol.
      if (https && options.https) {
        options.src = options.https;
      } else if (!https && options.http) {
        options.src = options.http;
      }

      // Make the `<script>` element and insert it before the first script on the
      // page, which is guaranteed to exist since this Javascript is running.
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = options.src;

      // If we have a cb, attach event handlers. Does not work on < IE9 because
      // older browser versions don't register element.onerror
      if (type(cb) === 'function') {
        onload(script, cb);
      }

      tick(function() {
        // Append after event listeners are attached for IE.
        var firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(script, firstScript);
      });

      // Return the script element in case they want to do anything special, like
      // give it an ID or attributes.
      return script;
    }

    /*
     * Exports.
     */

    module.exports = loadScript;

    },{"component-type":73,"next-tick":92,"script-onload":95}],44:[function(require,module,exports){
    'use strict';

    var keys = require('@ndhoule/keys');
    var uuid = require('uuid').v4;

    var inMemoryStore = {
      _data: {},
      length: 0,
      setItem: function(key, value) {
        this._data[key] = value;
        this.length = keys(this._data).length;
        return value;
      },
      getItem: function(key) {
        if (key in this._data) {
          return this._data[key];
        }
        return null;
      },
      removeItem: function(key) {
        if (key in this._data) {
          delete this._data[key];
        }
        this.length = keys(this._data).length;
        return null;
      },
      clear: function() {
        this._data = {};
        this.length = 0;
      },
      key: function(index) {
        return keys(this._data)[index];
      }
    };

    function isSupportedNatively() {
      try {
        if (!window.localStorage) return false;
        var key = uuid();
        window.localStorage.setItem(key, 'test_value');
        var value = window.localStorage.getItem(key);
        window.localStorage.removeItem(key);

        // handle localStorage silently failing
        return value === 'test_value';
      } catch (e) {
        // Can throw if localStorage is disabled
        return false;
      }
    }

    function pickStorage() {
      if (isSupportedNatively()) {
        return window.localStorage;
      }
      // fall back to in-memory
      return inMemoryStore;
    }

    // Return a shared instance
    module.exports.defaultEngine = pickStorage();
    // Expose the in-memory store explicitly for testing
    module.exports.inMemoryEngine = inMemoryStore;

    },{"@ndhoule/keys":13,"uuid":48}],45:[function(require,module,exports){
    'use strict';

    var uuid = require('uuid').v4;
    var Store = require('./store');
    var each = require('@ndhoule/each');
    var Schedule = require('./schedule');
    var debug = require('debug')('localstorage-retry');
    var Emitter = require('component-emitter');

    // Some browsers don't support Function.prototype.bind, so just including a simplified version here
    function bind(func, obj) {
      return function() {
        return func.apply(obj, arguments);
      };
    }

    /**
     * @callback processFunc
     * @param {Mixed} item The item added to the queue to process
     * @param {Function} done A function to call when processing is completed.
     *   @param {Error} Optional error parameter if the processing failed
     *   @param {Response} Optional response parameter to emit for async handling
     */

    /**
     * Constructs a Queue backed by localStorage
     *
     * @constructor
     * @param {String} name The name of the queue. Will be used to find abandoned queues and retry their items
     * @param {processFunc} fn The function to call in order to process an item added to the queue
     */
    function Queue(name, opts, fn) {
      if (typeof opts === 'function') fn = opts;
      this.name = name;
      this.id = uuid();
      this.fn = fn;
      this.maxItems = opts.maxItems || Infinity;
      this.maxAttempts = opts.maxAttempts || Infinity;

      this.backoff = {
        MIN_RETRY_DELAY: opts.minRetryDelay || 1000,
        MAX_RETRY_DELAY: opts.maxRetryDelay || 30000,
        FACTOR: opts.backoffFactor || 2,
        JITTER: opts.backoffJitter || 0
      };

      // painstakingly tuned. that's why they're not "easily" configurable
      this.timeouts = {
        ACK_TIMER: 1000,
        RECLAIM_TIMER: 3000,
        RECLAIM_TIMEOUT: 10000,
        RECLAIM_WAIT: 500
      };

      this.keys = {
        IN_PROGRESS: 'inProgress',
        QUEUE: 'queue',
        ACK: 'ack',
        RECLAIM_START: 'reclaimStart',
        RECLAIM_END: 'reclaimEnd'
      };

      this._schedule = new Schedule();
      this._processId = 0;

      // Set up our empty queues
      this._store = new Store(this.name, this.id, this.keys);
      this._store.set(this.keys.IN_PROGRESS, {});
      this._store.set(this.keys.QUEUE, []);

      // bind recurring tasks for ease of use
      this._ack = bind(this._ack, this);
      this._checkReclaim = bind(this._checkReclaim, this);
      this._processHead = bind(this._processHead, this);

      this._running = false;
    }

    /**
     * Mix in event emitter
     */

    Emitter(Queue.prototype);

    /**
     * Starts processing the queue
     */
    Queue.prototype.start = function() {
      if (this._running) {
        this.stop();
      }
      this._running = true;
      this._ack();
      this._checkReclaim();
      this._processHead();
    };

    /**
     * Stops processing the queue
     */
    Queue.prototype.stop = function() {
      this._schedule.cancelAll();
      this._running = false;
    };

    /**
     * Decides whether to retry. Overridable.
     *
     * @param {Object} item The item being processed
     * @param {Number} attemptNumber The attemptNumber (1 for first retry)
     * @param {Error} error The error from previous attempt, if there was one
     * @return {Boolean} Whether to requeue the message
     */
    Queue.prototype.shouldRetry = function(_, attemptNumber) {
      if (attemptNumber > this.maxAttempts) return false;
      return true;
    };

    /**
     * Calculates the delay (in ms) for a retry attempt
     *
     * @param {Number} attemptNumber The attemptNumber (1 for first retry)
     * @return {Number} The delay in milliseconds to wait before attempting a retry
     */
    Queue.prototype.getDelay = function(attemptNumber) {
      var ms = this.backoff.MIN_RETRY_DELAY * Math.pow(this.backoff.FACTOR, attemptNumber);
      if (this.backoff.JITTER) {
        var rand =  Math.random();
        var deviation = Math.floor(rand * this.backoff.JITTER * ms);
        if (Math.floor(rand * 10) < 5) {
          ms -= deviation;
        } else {
          ms += deviation;
        }
      }
      return Number(Math.min(ms, this.backoff.MAX_RETRY_DELAY).toPrecision(1));
    };

    /**
     * Adds an item to the queue
     *
     * @param {Mixed} item The item to process
     */
    Queue.prototype.addItem = function(item) {
      this._enqueue({
        item: item,
        attemptNumber: 0,
        time: this._schedule.now()
      });
    };

    /**
     * Adds an item to the retry queue
     *
     * @param {Mixed} item The item to retry
     * @param {Number} attemptNumber The attempt number (1 for first retry)
     * @param {Error} [error] The error from previous attempt, if there was one
     */
    Queue.prototype.requeue = function(item, attemptNumber, error) {
      if (this.shouldRetry(item, attemptNumber, error)) {
        this._enqueue({
          item: item,
          attemptNumber: attemptNumber,
          time: this._schedule.now() + this.getDelay(attemptNumber)
        });
      } else {
        this.emit('discard', item, attemptNumber);
      }
    };

    Queue.prototype._enqueue = function(entry) {
      var queue = this._store.get(this.keys.QUEUE) || [];
      queue = queue.slice(-(this.maxItems - 1));
      queue.push(entry);
      queue = queue.sort(function(a,b) {
        return a.time - b.time;
      });

      this._store.set(this.keys.QUEUE, queue);

      if (this._running) {
        this._processHead();
      }
    };

    Queue.prototype._processHead = function() {
      var self = this;
      var store = this._store;

      // cancel the scheduled task if it exists
      this._schedule.cancel(this._processId);

      // Pop the head off the queue
      var queue = store.get(this.keys.QUEUE) || [];
      var inProgress = store.get(this.keys.IN_PROGRESS) || {};
      var now = this._schedule.now();
      var toRun = [];

      function enqueue(el, id) {
        toRun.push({
          item: el.item,
          done: function handle(err, res) {
            var inProgress = store.get(self.keys.IN_PROGRESS) || {};
            delete inProgress[id];
            store.set(self.keys.IN_PROGRESS, inProgress);
            self.emit('processed', err, res, el.item);
            if (err) {
              self.requeue(el.item, el.attemptNumber + 1, err);
            }
          }
        });
      }

      var inProgressSize = Object.keys(inProgress).length;

      while (queue.length && queue[0].time <= now && inProgressSize++ < self.maxItems) {
        var el = queue.shift();
        var id = uuid();

        // Save this to the in progress map
        inProgress[id] = {
          item: el.item,
          attemptNumber: el.attemptNumber,
          time: self._schedule.now()
        };

        enqueue(el, id);
      }

      store.set(this.keys.QUEUE, queue);
      store.set(this.keys.IN_PROGRESS, inProgress);

      each(function(el) {
        // TODO: handle fn timeout
        try {
          self.fn(el.item, el.done);
        } catch (err) {
          debug('Process function threw error: ' + err);
        }
      }, toRun);

      // re-read the queue in case the process function finished immediately or added another item
      queue = store.get(this.keys.QUEUE) || [];
      this._schedule.cancel(this._processId);
      if (queue.length > 0) {
        this._processId = this._schedule.run(this._processHead, queue[0].time - now);
      }
    };

    // Ack continuously to prevent other tabs from claiming our queue
    Queue.prototype._ack = function() {
      this._store.set(this.keys.ACK, this._schedule.now());
      this._store.set(this.keys.RECLAIM_START, null);
      this._store.set(this.keys.RECLAIM_END, null);
      this._schedule.run(this._ack, this.timeouts.ACK_TIMER);
    };

    Queue.prototype._checkReclaim = function() {
      var self = this;

      function tryReclaim(store) {
        store.set(self.keys.RECLAIM_START, self.id);
        store.set(self.keys.ACK, self._schedule.now());

        self._schedule.run(function() {
          if (store.get(self.keys.RECLAIM_START) !== self.id) return;
          store.set(self.keys.RECLAIM_END, self.id);

          self._schedule.run(function() {
            if (store.get(self.keys.RECLAIM_END) !== self.id) return;
            if (store.get(self.keys.RECLAIM_START) !== self.id) return;
            self._reclaim(store.id);
          }, self.timeouts.RECLAIM_WAIT);
        }, self.timeouts.RECLAIM_WAIT);
      }

      function findOtherQueues(name) {
        var res = [];
        var storage = self._store.engine;
        for (var i = 0; i < storage.length; i++) {
          var k = storage.key(i);
          var parts = k.split('.');
          if (parts.length !== 3) continue;
          if (parts[0] !== name) continue;
          if (parts[2] !== 'ack') continue;
          res.push(new Store(name, parts[1], self.keys));
        }
        return res;
      }

      each(function(store) {
        if (store.id === self.id) return;
        if (self._schedule.now() - store.get(self.keys.ACK) < self.timeouts.RECLAIM_TIMEOUT) return;
        tryReclaim(store);
      }, findOtherQueues(this.name));

      this._schedule.run(this._checkReclaim, this.timeouts.RECLAIM_TIMER);
    };

    Queue.prototype._reclaim = function(id) {
      var self = this;
      var other = new Store(this.name, id, this.keys);

      var our = {
        queue: this._store.get(this.keys.QUEUE) || []
      };

      var their = {
        inProgress: other.get(this.keys.IN_PROGRESS) || {},
        queue: other.get(this.keys.QUEUE) || []
      };

      // add their queue to ours, resetting run-time to immediate and copying the attempt#
      each(function(el) {
        our.queue.push({
          item: el.item,
          attemptNumber: el.attemptNumber,
          time: self._schedule.now()
        });
      }, their.queue);

      // if the queue is abandoned, all the in-progress are failed. retry them immediately and increment the attempt#
      each(function(el) {
        our.queue.push({
          item: el.item,
          attemptNumber: el.attemptNumber + 1,
          time: self._schedule.now()
        });
      }, their.inProgress);

      our.queue = our.queue.sort(function(a,b) {
        return a.time - b.time;
      });

      this._store.set(this.keys.QUEUE, our.queue);

      // remove all keys
      other.remove(this.keys.ACK);
      other.remove(this.keys.RECLAIM_START);
      other.remove(this.keys.RECLAIM_END);
      other.remove(this.keys.IN_PROGRESS);
      other.remove(this.keys.QUEUE);

      // process the new items we claimed
      this._processHead();
    };

    module.exports = Queue;

    },{"./schedule":46,"./store":47,"@ndhoule/each":8,"component-emitter":68,"debug":75,"uuid":48}],46:[function(require,module,exports){
    'use strict';

    var each = require('@ndhoule/each');

    var defaultClock = {
      setTimeout: function(fn, ms) {
        return window.setTimeout(fn, ms);
      },
      clearTimeout: function(id) {
        return window.clearTimeout(id);
      },
      Date: window.Date
    };

    var clock = defaultClock;

    function Schedule() {
      this.tasks = {};
      this.nextId = 1;
    }

    Schedule.prototype.now = function() {
      return +new clock.Date();
    };

    Schedule.prototype.run = function(task, timeout) {
      var id = this.nextId++;
      this.tasks[id] = clock.setTimeout(this._handle(id, task), timeout);
      return id;
    };

    Schedule.prototype.cancel = function(id) {
      if (this.tasks[id]) {
        clock.clearTimeout(this.tasks[id]);
        delete this.tasks[id];
      }
    };

    Schedule.prototype.cancelAll = function() {
      each(clock.clearTimeout, this.tasks);
      this.tasks = {};
    };

    Schedule.prototype._handle = function(id, callback) {
      var self = this;
      return function() {
        delete self.tasks[id];
        return callback();
      };
    };

    Schedule.setClock = function(newClock) {
      clock = newClock;
    };

    Schedule.resetClock = function() {
      clock = defaultClock;
    };

    module.exports = Schedule;

    },{"@ndhoule/each":8}],47:[function(require,module,exports){
    'use strict';

    var defaultEngine = require('./engine').defaultEngine;
    var inMemoryEngine = require('./engine').inMemoryEngine;
    var each = require('@ndhoule/each');
    var keys = require('@ndhoule/keys');
    var json = require('json3');

    /**
    * Store Implementation with dedicated
    */

    function Store(name, id, keys, optionalEngine) {
      this.id = id;
      this.name = name;
      this.keys = keys || {};
      this.engine = optionalEngine || defaultEngine;
    }

    /**
    * Set value by key.
    */

    Store.prototype.set = function(key, value) {
      var compoundKey = this._createValidKey(key);
      if (!compoundKey) return;
      try {
        this.engine.setItem(compoundKey, json.stringify(value));
      } catch (err) {
        if (isQuotaExceeded(err)) {
          // switch to inMemory engine
          this._swapEngine();
          // and save it there
          this.set(key, value);
        }
      }
    };

    /**
    * Get by Key.
    */

    Store.prototype.get = function(key) {
      try {
        var str = this.engine.getItem(this._createValidKey(key));
        if (str === null) {
          return null;
        }
        return json.parse(str);
      } catch (err) {
        return null;
      }
    };

    /**
    * Remove by Key.
    */

    Store.prototype.remove = function(key) {
      this.engine.removeItem(this._createValidKey(key));
    };

    /**
    * Ensure the key is valid
    */

    Store.prototype._createValidKey = function(key) {
      var name = this.name;
      var id = this.id;

      if (!keys(this.keys).length) return [name, id, key].join('.');

      // validate and return undefined if invalid key
      var compoundKey;
      each(function(value) {
        if (value === key) {
          compoundKey = [name, id, key].join('.');
        }
      }, this.keys);
      return compoundKey;
    };

    /**
    * Switch to inMemoryEngine, bringing any existing data with.
    */

    Store.prototype._swapEngine = function() {
      var self = this;

      // grab existing data, but only for this page's queue instance, not all
      // better to keep other queues in localstorage to be flushed later
      // than to pull them into memory and remove them from durable storage
      each(function(key) {
        var value = self.get(key);
        inMemoryEngine.setItem([self.name, self.id, key].join('.'), value);
        self.remove(key);
      }, this.keys);

      this.engine = inMemoryEngine;
    };

    module.exports = Store;

    function isQuotaExceeded(e) {
      var quotaExceeded = false;
      if (e.code) {
        switch (e.code) {
        case 22:
          quotaExceeded = true;
          break;
        case 1014:
          // Firefox
          if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            quotaExceeded = true;
          }
          break;
        default:
          break;
        }
      } else if (e.number === -2147024882) {
        // Internet Explorer 8
        quotaExceeded = true;
      }
      return quotaExceeded;
    }

    },{"./engine":44,"@ndhoule/each":8,"@ndhoule/keys":13,"json3":82}],48:[function(require,module,exports){
    var v1 = require('./v1');
    var v4 = require('./v4');

    var uuid = v4;
    uuid.v1 = v1;
    uuid.v4 = v4;

    module.exports = uuid;

    },{"./v1":51,"./v4":52}],49:[function(require,module,exports){
    /**
     * Convert array of 16 byte values to UUID string format of the form:
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     */
    var byteToHex = [];
    for (var i = 0; i < 256; ++i) {
      byteToHex[i] = (i + 0x100).toString(16).substr(1);
    }

    function bytesToUuid(buf, offset) {
      var i = offset || 0;
      var bth = byteToHex;
      // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
      return ([bth[buf[i++]], bth[buf[i++]],
      bth[buf[i++]], bth[buf[i++]], '-',
      bth[buf[i++]], bth[buf[i++]], '-',
      bth[buf[i++]], bth[buf[i++]], '-',
      bth[buf[i++]], bth[buf[i++]], '-',
      bth[buf[i++]], bth[buf[i++]],
      bth[buf[i++]], bth[buf[i++]],
      bth[buf[i++]], bth[buf[i++]]]).join('');
    }

    module.exports = bytesToUuid;

    },{}],50:[function(require,module,exports){
    // Unique ID creation requires a high quality random # generator.  In the
    // browser this is a little complicated due to unknown quality of Math.random()
    // and inconsistent support for the `crypto` API.  We do the best we can via
    // feature-detection

    // getRandomValues needs to be invoked in a context where "this" is a Crypto
    // implementation. Also, find the complete implementation of crypto on IE11.
    var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                          (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

    if (getRandomValues) {
      // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
      var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

      module.exports = function whatwgRNG() {
        getRandomValues(rnds8);
        return rnds8;
      };
    } else {
      // Math.random()-based (RNG)
      //
      // If all else fails, use Math.random().  It's fast, but is of unspecified
      // quality.
      var rnds = new Array(16);

      module.exports = function mathRNG() {
        for (var i = 0, r; i < 16; i++) {
          if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
          rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
        }

        return rnds;
      };
    }

    },{}],51:[function(require,module,exports){
    var rng = require('./lib/rng');
    var bytesToUuid = require('./lib/bytesToUuid');

    // **`v1()` - Generate time-based UUID**
    //
    // Inspired by https://github.com/LiosK/UUID.js
    // and http://docs.python.org/library/uuid.html

    var _nodeId;
    var _clockseq;

    // Previous uuid creation time
    var _lastMSecs = 0;
    var _lastNSecs = 0;

    // See https://github.com/broofa/node-uuid for API details
    function v1(options, buf, offset) {
      var i = buf && offset || 0;
      var b = buf || [];

      options = options || {};
      var node = options.node || _nodeId;
      var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

      // node and clockseq need to be initialized to random values if they're not
      // specified.  We do this lazily to minimize issues related to insufficient
      // system entropy.  See #189
      if (node == null || clockseq == null) {
        var seedBytes = rng();
        if (node == null) {
          // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
          node = _nodeId = [
            seedBytes[0] | 0x01,
            seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
          ];
        }
        if (clockseq == null) {
          // Per 4.2.2, randomize (14 bit) clockseq
          clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
        }
      }

      // UUID timestamps are 100 nano-second units since the Gregorian epoch,
      // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
      // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
      // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
      var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

      // Per 4.2.1.2, use count of uuid's generated during the current clock
      // cycle to simulate higher resolution clock
      var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

      // Time since last uuid creation (in msecs)
      var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

      // Per 4.2.1.2, Bump clockseq on clock regression
      if (dt < 0 && options.clockseq === undefined) {
        clockseq = clockseq + 1 & 0x3fff;
      }

      // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
      // time interval
      if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
        nsecs = 0;
      }

      // Per 4.2.1.2 Throw error if too many uuids are requested
      if (nsecs >= 10000) {
        throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
      }

      _lastMSecs = msecs;
      _lastNSecs = nsecs;
      _clockseq = clockseq;

      // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
      msecs += 12219292800000;

      // `time_low`
      var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
      b[i++] = tl >>> 24 & 0xff;
      b[i++] = tl >>> 16 & 0xff;
      b[i++] = tl >>> 8 & 0xff;
      b[i++] = tl & 0xff;

      // `time_mid`
      var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
      b[i++] = tmh >>> 8 & 0xff;
      b[i++] = tmh & 0xff;

      // `time_high_and_version`
      b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
      b[i++] = tmh >>> 16 & 0xff;

      // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
      b[i++] = clockseq >>> 8 | 0x80;

      // `clock_seq_low`
      b[i++] = clockseq & 0xff;

      // `node`
      for (var n = 0; n < 6; ++n) {
        b[i + n] = node[n];
      }

      return buf ? buf : bytesToUuid(b);
    }

    module.exports = v1;

    },{"./lib/bytesToUuid":49,"./lib/rng":50}],52:[function(require,module,exports){
    var rng = require('./lib/rng');
    var bytesToUuid = require('./lib/bytesToUuid');

    function v4(options, buf, offset) {
      var i = buf && offset || 0;

      if (typeof(options) == 'string') {
        buf = options === 'binary' ? new Array(16) : null;
        options = null;
      }
      options = options || {};

      var rnds = options.random || (options.rng || rng)();

      // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
      rnds[6] = (rnds[6] & 0x0f) | 0x40;
      rnds[8] = (rnds[8] & 0x3f) | 0x80;

      // Copy bytes to buffer, if provided
      if (buf) {
        for (var ii = 0; ii < 16; ++ii) {
          buf[i + ii] = rnds[ii];
        }
      }

      return buf || bytesToUuid(rnds);
    }

    module.exports = v4;

    },{"./lib/bytesToUuid":49,"./lib/rng":50}],53:[function(require,module,exports){
    'use strict';

    /**
     * Prevent default on a given event.
     *
     * @param {Event} e
     * @example
     * anchor.onclick = prevent;
     * anchor.onclick = function(e){
     *   if (something) return prevent(e);
     * };
     */

    function preventDefault(e) {
      e = e || window.event;
      return e.preventDefault ? e.preventDefault() : e.returnValue = false;
    }

    /*
     * Exports.
     */

    module.exports = preventDefault;

    },{}],54:[function(require,module,exports){
    'use strict';

    /**
     * Convenience alias
     */

    var define = Object.defineProperty;


    /**
     *  The base protocol
     */

    var initialProtocol = window.location.protocol;

    /**
     * Fallback mocked protocol in case Object.defineProperty doesn't exist.
     */

    var mockedProtocol;


    module.exports = function(protocol) {
      if (arguments.length === 0) {
        return get();
      }
      return set(protocol);
    };


    /**
     * Sets the protocol to be http:
     */

    module.exports.http = function() {
      set('http:');
    };


    /**
     * Sets the protocol to be https:
     */

    module.exports.https = function() {
      set('https:');
    };


    /**
     * Reset to the initial protocol.
     */

    module.exports.reset = function() {
      set(initialProtocol);
    };


    /**
     * Gets the current protocol, using the fallback and then the native protocol.
     *
     * @return {String} protocol
     */

    function get() {
      return mockedProtocol || window.location.protocol;
    }


    /**
     * Sets the protocol
     *
     * @param {String} protocol
     */

    function set(protocol) {
      try {
        define(window.location, 'protocol', {
          get: function() { return protocol; }
        });
      } catch (err) {
        mockedProtocol = protocol;
      }
    }

    },{}],55:[function(require,module,exports){
    'use strict';

    /*
     * Module dependencies.
     */

    var JSON = require('json3');
    var base64encode = require('@segment/base64-encode');
    var cors = require('has-cors');
    var jsonp = require('jsonp');

    /*
     * Exports.
     */

    exports = module.exports = cors ? json : base64;

    /**
     * Expose `callback`
     */

    exports.callback = 'callback';

    /**
     * Expose `prefix`
     */

    exports.prefix = 'data';

    /**
     * Expose `json`.
     */

    exports.json = json;

    /**
     * Expose `base64`.
     */

    exports.base64 = base64;

    /**
     * Expose `type`
     */

    exports.type = cors ? 'xhr' : 'jsonp';

    /**
     * Send the given `obj` to `url` with `fn(err, req)`.
     *
     * @param {String} url
     * @param {Object} obj
     * @param {Object} headers
     * @param {Function} fn
     * @api private
     */

    function json(url, obj, headers, fn) {
      if (arguments.length === 3) fn = headers, headers = {};

      var req = new XMLHttpRequest;
      req.onerror = fn;
      req.onreadystatechange = done;
      req.open('POST', url, true);

      // TODO: Remove this eslint disable
      // eslint-disable-next-line guard-for-in
      for (var k in headers) {
        req.setRequestHeader(k, headers[k]);
      }
      req.send(JSON.stringify(obj));

      function done() {
        if (req.readyState === 4) {
          return fn(null, req);
        }
      }
    }

    /**
     * Send the given `obj` to `url` with `fn(err, req)`.
     *
     * @param {String} url
     * @param {Object} obj
     * @param {Function} fn
     * @api private
     */

    function base64(url, obj, _, fn) {
      if (arguments.length === 3) fn = _;

      var prefix = exports.prefix;
      var data = encode(obj);
      url += '?' + prefix + '=' + data;
      jsonp(url, { param: exports.callback }, function(err, obj) {
        if (err) return fn(err);
        fn(null, {
          url: url,
          body: obj
        });
      });
    }

    /**
     * Encodes `obj`.
     *
     * @param {Object} obj
     */

    function encode(obj) {
      var str = '';
      str = JSON.stringify(obj);
      str = base64encode(str);
      str = str.replace(/\+/g, '-').replace(/\//g, '_');
      return encodeURIComponent(str);
    }

    },{"@segment/base64-encode":37,"has-cors":78,"json3":82,"jsonp":83}],56:[function(require,module,exports){
    (function (global){
    "use strict"

    var JSON = require('json3');

    module.exports = (function() {
      // Store.js
      var store = {},
        win = (typeof window != 'undefined' ? window : global),
        doc = win.document,
        localStorageName = 'localStorage',
        scriptTag = 'script',
        storage

      store.disabled = false
      store.version = '1.3.20'
      store.set = function(key, value) {}
      store.get = function(key, defaultVal) {}
      store.has = function(key) { return store.get(key) !== undefined }
      store.remove = function(key) {}
      store.clear = function() {}
      store.transact = function(key, defaultVal, transactionFn) {
        if (transactionFn == null) {
          transactionFn = defaultVal
          defaultVal = null
        }
        if (defaultVal == null) {
          defaultVal = {}
        }
        var val = store.get(key, defaultVal)
        transactionFn(val)
        store.set(key, val)
      }
      store.getAll = function() {
        var ret = {}
        store.forEach(function(key, val) {
          ret[key] = val
        })
        return ret
      }
      store.forEach = function() {}
      store.serialize = function(value) {
        return JSON.stringify(value)
      }
      store.deserialize = function(value) {
        if (typeof value != 'string') { return undefined }
        try { return JSON.parse(value) }
        catch(e) { return value || undefined }
      }

      // Functions to encapsulate questionable FireFox 3.6.13 behavior
      // when about.config::dom.storage.enabled === false
      // See https://github.com/marcuswestin/store.js/issues#issue/13
      function isLocalStorageNameSupported() {
        try { return (localStorageName in win && win[localStorageName]) }
        catch(err) { return false }
      }

      if (isLocalStorageNameSupported()) {
        storage = win[localStorageName]
        store.set = function(key, val) {
          if (val === undefined) { return store.remove(key) }
          storage.setItem(key, store.serialize(val))
          return val
        }
        store.get = function(key, defaultVal) {
          var val = store.deserialize(storage.getItem(key))
          return (val === undefined ? defaultVal : val)
        }
        store.remove = function(key) { storage.removeItem(key) }
        store.clear = function() { storage.clear() }
        store.forEach = function(callback) {
          for (var i=0; i<storage.length; i++) {
            var key = storage.key(i)
            callback(key, store.get(key))
          }
        }
      } else if (doc && doc.documentElement.addBehavior) {
        var storageOwner,
          storageContainer
        // Since #userData storage applies only to specific paths, we need to
        // somehow link our data to a specific path.  We choose /favicon.ico
        // as a pretty safe option, since all browsers already make a request to
        // this URL anyway and being a 404 will not hurt us here.  We wrap an
        // iframe pointing to the favicon in an ActiveXObject(htmlfile) object
        // (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
        // since the iframe access rules appear to allow direct access and
        // manipulation of the document element, even for a 404 page.  This
        // document can be used instead of the current document (which would
        // have been limited to the current path) to perform #userData storage.
        try {
          storageContainer = new ActiveXObject('htmlfile')
          storageContainer.open()
          storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>')
          storageContainer.close()
          storageOwner = storageContainer.w.frames[0].document
          storage = storageOwner.createElement('div')
        } catch(e) {
          // somehow ActiveXObject instantiation failed (perhaps some special
          // security settings or otherwse), fall back to per-path storage
          storage = doc.createElement('div')
          storageOwner = doc.body
        }
        var withIEStorage = function(storeFunction) {
          return function() {
            var args = Array.prototype.slice.call(arguments, 0)
            args.unshift(storage)
            // See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
            // and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
            storageOwner.appendChild(storage)
            storage.addBehavior('#default#userData')
            storage.load(localStorageName)
            var result = storeFunction.apply(store, args)
            storageOwner.removeChild(storage)
            return result
          }
        }

        // In IE7, keys cannot start with a digit or contain certain chars.
        // See https://github.com/marcuswestin/store.js/issues/40
        // See https://github.com/marcuswestin/store.js/issues/83
        var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
        var ieKeyFix = function(key) {
          return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___')
        }
        store.set = withIEStorage(function(storage, key, val) {
          key = ieKeyFix(key)
          if (val === undefined) { return store.remove(key) }
          storage.setAttribute(key, store.serialize(val))
          storage.save(localStorageName)
          return val
        })
        store.get = withIEStorage(function(storage, key, defaultVal) {
          key = ieKeyFix(key)
          var val = store.deserialize(storage.getAttribute(key))
          return (val === undefined ? defaultVal : val)
        })
        store.remove = withIEStorage(function(storage, key) {
          key = ieKeyFix(key)
          storage.removeAttribute(key)
          storage.save(localStorageName)
        })
        store.clear = withIEStorage(function(storage) {
          var attributes = storage.XMLDocument.documentElement.attributes
          storage.load(localStorageName)
          for (var i=attributes.length-1; i>=0; i--) {
            storage.removeAttribute(attributes[i].name)
          }
          storage.save(localStorageName)
        })
        store.forEach = withIEStorage(function(storage, callback) {
          var attributes = storage.XMLDocument.documentElement.attributes
          for (var i=0, attr; attr=attributes[i]; ++i) {
            callback(attr.name, store.deserialize(storage.getAttribute(attr.name)))
          }
        })
      }

      try {
        var testKey = '__storejs__'
        store.set(testKey, testKey)
        if (store.get(testKey) != testKey) { store.disabled = true }
        store.remove(testKey)
      } catch(e) {
        store.disabled = true
      }
      store.enabled = !store.disabled

      return store
    }())

    }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    },{"json3":82}],57:[function(require,module,exports){
    'use strict';

    /**
     * Module dependencies.
     */

    var parse = require('component-url').parse;
    var cookie = require('component-cookie');

    /**
     * Get the top domain.
     *
     * The function constructs the levels of domain and attempts to set a global
     * cookie on each one when it succeeds it returns the top level domain.
     *
     * The method returns an empty string when the hostname is an ip or `localhost`.
     *
     * Example levels:
     *
     *      domain.levels('http://www.google.co.uk');
     *      // => ["co.uk", "google.co.uk", "www.google.co.uk"]
     *
     * Example:
     *
     *      domain('http://localhost:3000/baz');
     *      // => ''
     *      domain('http://dev:3000/baz');
     *      // => ''
     *      domain('http://127.0.0.1:3000/baz');
     *      // => ''
     *      domain('http://segment.io/baz');
     *      // => 'segment.io'
     *
     * @param {string} url
     * @return {string}
     * @api public
     */
    function domain(url) {
      var cookie = exports.cookie;
      var levels = exports.levels(url);

      // Lookup the real top level one.
      for (var i = 0; i < levels.length; ++i) {
        var cname = '__tld__';
        var domain = levels[i];
        var opts = { domain: '.' + domain };

        cookie(cname, 1, opts);
        if (cookie(cname)) {
          cookie(cname, null, opts);
          return domain;
        }
      }

      return '';
    }

    /**
     * Levels returns all levels of the given url.
     *
     * @param {string} url
     * @return {Array}
     * @api public
     */
    domain.levels = function(url) {
      var host = parse(url).hostname;
      var parts = host.split('.');
      var last = parts[parts.length - 1];
      var levels = [];

      // Ip address.
      if (parts.length === 4 && last === parseInt(last, 10)) {
        return levels;
      }

      // Localhost.
      if (parts.length <= 1) {
        return levels;
      }

      // Create levels.
      for (var i = parts.length - 2; i >= 0; --i) {
        levels.push(parts.slice(i).join('.'));
      }

      return levels;
    };

    /**
     * Expose cookie on domain.
     */
    domain.cookie = cookie;

    /*
     * Exports.
     */

    exports = module.exports = domain;

    },{"component-cookie":62,"component-url":74}],58:[function(require,module,exports){
    'use strict';

    /**
     * Module dependencies.
     */

    var foldl = require('@ndhoule/foldl');
    var parse = require('component-querystring').parse;

    /**
     * hasOwnProperty reference.
     */

    var has = Object.prototype.hasOwnProperty;

    /**
     * Get all utm params from the given `querystring`
     *
     * @param {String} query
     * @return {Object}
     * @api private
     */

    function utm(query) {
      // Remove leading ? if present
      if (query.charAt(0) === '?') {
        query = query.substring(1);
      }

      query = query.replace(/\?/g, '&');

      var param;
      var params = parse(query);
      var results = {};

      for (var key in params) {
        if (has.call(params, key)) {
          if (key.substr(0, 4) === 'utm_') {
            param = key.substr(4);
            if (param === 'campaign') param = 'name';
            results[param] = params[key];
          }
        }
      }

      return results;
    }

    var allowedKeys = {
      name: true,
      term: true,
      source: true,
      medium: true,
      content: true
    };

    /**
     * Get strict utm params - from the given `querystring`
     *
     * @param {String} query
     * @return {Object}
     * @api private
     */

    function strict(query) {
      return foldl(function(acc, val, key) {
        if (has.call(allowedKeys, key)) acc[key] = val;
        return acc;
      }, {}, utm(query));
    }

    /*
     * Exports.
     */

    module.exports = utm;
    module.exports.strict = strict;

    },{"@ndhoule/foldl":11,"component-querystring":71}],59:[function(require,module,exports){
    'use strict';

    var bind = require('component-bind');

    function bindAll(obj) {
      // eslint-disable-next-line guard-for-in
      for (var key in obj) {
        var val = obj[key];
        if (typeof val === 'function') {
          obj[key] = bind(obj, obj[key]);
        }
      }
      return obj;
    }

    module.exports = bindAll;

    },{"component-bind":60}],60:[function(require,module,exports){
    /**
     * Slice reference.
     */

    var slice = [].slice;

    /**
     * Bind `obj` to `fn`.
     *
     * @param {Object} obj
     * @param {Function|String} fn or string
     * @return {Function}
     * @api public
     */

    module.exports = function(obj, fn){
      if ('string' == typeof fn) fn = obj[fn];
      if ('function' != typeof fn) throw new Error('bind() requires a function');
      var args = slice.call(arguments, 2);
      return function(){
        return fn.apply(obj, args.concat(slice.call(arguments)));
      }
    };

    },{}],61:[function(require,module,exports){
    /**
     * Module dependencies.
     */

    var type;
    try {
      type = require('component-type');
    } catch (_) {
      type = require('type');
    }

    /**
     * Module exports.
     */

    module.exports = clone;

    /**
     * Clones objects.
     *
     * @param {Mixed} any object
     * @api public
     */

    function clone(obj){
      switch (type(obj)) {
        case 'object':
          var copy = {};
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              copy[key] = clone(obj[key]);
            }
          }
          return copy;

        case 'array':
          var copy = new Array(obj.length);
          for (var i = 0, l = obj.length; i < l; i++) {
            copy[i] = clone(obj[i]);
          }
          return copy;

        case 'regexp':
          // from millermedeiros/amd-utils - MIT
          var flags = '';
          flags += obj.multiline ? 'm' : '';
          flags += obj.global ? 'g' : '';
          flags += obj.ignoreCase ? 'i' : '';
          return new RegExp(obj.source, flags);

        case 'date':
          return new Date(obj.getTime());

        default: // string, number, boolean, …
          return obj;
      }
    }

    },{"component-type":73,"type":73}],62:[function(require,module,exports){

    /**
     * Module dependencies.
     */

    var debug = require('debug')('cookie');

    /**
     * Set or get cookie `name` with `value` and `options` object.
     *
     * @param {String} name
     * @param {String} value
     * @param {Object} options
     * @return {Mixed}
     * @api public
     */

    module.exports = function(name, value, options){
      switch (arguments.length) {
        case 3:
        case 2:
          return set(name, value, options);
        case 1:
          return get(name);
        default:
          return all();
      }
    };

    /**
     * Set cookie `name` to `value`.
     *
     * @param {String} name
     * @param {String} value
     * @param {Object} options
     * @api private
     */

    function set(name, value, options) {
      options = options || {};
      var str = encode(name) + '=' + encode(value);

      if (null == value) options.maxage = -1;

      if (options.maxage) {
        options.expires = new Date(+new Date + options.maxage);
      }

      if (options.path) str += '; path=' + options.path;
      if (options.domain) str += '; domain=' + options.domain;
      if (options.expires) str += '; expires=' + options.expires.toUTCString();
      if (options.secure) str += '; secure';

      document.cookie = str;
    }

    /**
     * Return all cookies.
     *
     * @return {Object}
     * @api private
     */

    function all() {
      var str;
      try {
        str = document.cookie;
      } catch (err) {
        if (typeof console !== 'undefined' && typeof console.error === 'function') {
          console.error(err.stack || err);
        }
        return {};
      }
      return parse(str);
    }

    /**
     * Get cookie `name`.
     *
     * @param {String} name
     * @return {String}
     * @api private
     */

    function get(name) {
      return all()[name];
    }

    /**
     * Parse cookie `str`.
     *
     * @param {String} str
     * @return {Object}
     * @api private
     */

    function parse(str) {
      var obj = {};
      var pairs = str.split(/ *; */);
      var pair;
      if ('' == pairs[0]) return obj;
      for (var i = 0; i < pairs.length; ++i) {
        pair = pairs[i].split('=');
        obj[decode(pair[0])] = decode(pair[1]);
      }
      return obj;
    }

    /**
     * Encode.
     */

    function encode(value){
      try {
        return encodeURIComponent(value);
      } catch (e) {
        debug('error `encode(%o)` - %o', value, e)
      }
    }

    /**
     * Decode.
     */

    function decode(value) {
      try {
        return decodeURIComponent(value);
      } catch (e) {
        debug('error `decode(%o)` - %o', value, e)
      }
    }

    },{"debug":63}],63:[function(require,module,exports){

    /**
     * This is the web browser implementation of `debug()`.
     *
     * Expose `debug()` as the module.
     */

    exports = module.exports = require('./debug');
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = 'undefined' != typeof chrome
                   && 'undefined' != typeof chrome.storage
                      ? chrome.storage.local
                      : localstorage();

    /**
     * Colors.
     */

    exports.colors = [
      'lightseagreen',
      'forestgreen',
      'goldenrod',
      'dodgerblue',
      'darkorchid',
      'crimson'
    ];

    /**
     * Currently only WebKit-based Web Inspectors, Firefox >= v31,
     * and the Firebug extension (any Firefox version) are known
     * to support "%c" CSS customizations.
     *
     * TODO: add a `localStorage` variable to explicitly enable/disable colors
     */

    function useColors() {
      // is webkit? http://stackoverflow.com/a/16459606/376773
      return ('WebkitAppearance' in document.documentElement.style) ||
        // is firebug? http://stackoverflow.com/a/398120/376773
        (window.console && (console.firebug || (console.exception && console.table))) ||
        // is firefox >= v31?
        // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
        (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
    }

    /**
     * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
     */

    exports.formatters.j = function(v) {
      return JSON.stringify(v);
    };


    /**
     * Colorize log arguments if enabled.
     *
     * @api public
     */

    function formatArgs() {
      var args = arguments;
      var useColors = this.useColors;

      args[0] = (useColors ? '%c' : '')
        + this.namespace
        + (useColors ? ' %c' : ' ')
        + args[0]
        + (useColors ? '%c ' : ' ')
        + '+' + exports.humanize(this.diff);

      if (!useColors) return args;

      var c = 'color: ' + this.color;
      args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

      // the final "%c" is somewhat tricky, because there could be other
      // arguments passed either before or after the %c, so we need to
      // figure out the correct index to insert the CSS into
      var index = 0;
      var lastC = 0;
      args[0].replace(/%[a-z%]/g, function(match) {
        if ('%%' === match) return;
        index++;
        if ('%c' === match) {
          // we only are interested in the *last* %c
          // (the user may have provided their own)
          lastC = index;
        }
      });

      args.splice(lastC, 0, c);
      return args;
    }

    /**
     * Invokes `console.log()` when available.
     * No-op when `console.log` is not a "function".
     *
     * @api public
     */

    function log() {
      // this hackery is required for IE8/9, where
      // the `console.log` function doesn't have 'apply'
      return 'object' === typeof console
        && console.log
        && Function.prototype.apply.call(console.log, console, arguments);
    }

    /**
     * Save `namespaces`.
     *
     * @param {String} namespaces
     * @api private
     */

    function save(namespaces) {
      try {
        if (null == namespaces) {
          exports.storage.removeItem('debug');
        } else {
          exports.storage.debug = namespaces;
        }
      } catch(e) {}
    }

    /**
     * Load `namespaces`.
     *
     * @return {String} returns the previously persisted debug modes
     * @api private
     */

    function load() {
      var r;
      try {
        r = exports.storage.debug;
      } catch(e) {}
      return r;
    }

    /**
     * Enable namespaces listed in `localStorage.debug` initially.
     */

    exports.enable(load());

    /**
     * Localstorage attempts to return the localstorage.
     *
     * This is necessary because safari throws
     * when a user disables cookies/localstorage
     * and you attempt to access it.
     *
     * @return {LocalStorage}
     * @api private
     */

    function localstorage(){
      try {
        return window.localStorage;
      } catch (e) {}
    }

    },{"./debug":64}],64:[function(require,module,exports){

    /**
     * This is the common logic for both the Node.js and web browser
     * implementations of `debug()`.
     *
     * Expose `debug()` as the module.
     */

    exports = module.exports = debug;
    exports.coerce = coerce;
    exports.disable = disable;
    exports.enable = enable;
    exports.enabled = enabled;
    exports.humanize = require('ms');

    /**
     * The currently active debug mode names, and names to skip.
     */

    exports.names = [];
    exports.skips = [];

    /**
     * Map of special "%n" handling functions, for the debug "format" argument.
     *
     * Valid key names are a single, lowercased letter, i.e. "n".
     */

    exports.formatters = {};

    /**
     * Previously assigned color.
     */

    var prevColor = 0;

    /**
     * Previous log timestamp.
     */

    var prevTime;

    /**
     * Select a color.
     *
     * @return {Number}
     * @api private
     */

    function selectColor() {
      return exports.colors[prevColor++ % exports.colors.length];
    }

    /**
     * Create a debugger with the given `namespace`.
     *
     * @param {String} namespace
     * @return {Function}
     * @api public
     */

    function debug(namespace) {

      // define the `disabled` version
      function disabled() {
      }
      disabled.enabled = false;

      // define the `enabled` version
      function enabled() {

        var self = enabled;

        // set `diff` timestamp
        var curr = +new Date();
        var ms = curr - (prevTime || curr);
        self.diff = ms;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;

        // add the `color` if not set
        if (null == self.useColors) self.useColors = exports.useColors();
        if (null == self.color && self.useColors) self.color = selectColor();

        var args = Array.prototype.slice.call(arguments);

        args[0] = exports.coerce(args[0]);

        if ('string' !== typeof args[0]) {
          // anything else let's inspect with %o
          args = ['%o'].concat(args);
        }

        // apply any `formatters` transformations
        var index = 0;
        args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
          // if we encounter an escaped % then don't increase the array index
          if (match === '%%') return match;
          index++;
          var formatter = exports.formatters[format];
          if ('function' === typeof formatter) {
            var val = args[index];
            match = formatter.call(self, val);

            // now we need to remove `args[index]` since it's inlined in the `format`
            args.splice(index, 1);
            index--;
          }
          return match;
        });

        if ('function' === typeof exports.formatArgs) {
          args = exports.formatArgs.apply(self, args);
        }
        var logFn = enabled.log || exports.log || console.log.bind(console);
        logFn.apply(self, args);
      }
      enabled.enabled = true;

      var fn = exports.enabled(namespace) ? enabled : disabled;

      fn.namespace = namespace;

      return fn;
    }

    /**
     * Enables a debug mode by namespaces. This can include modes
     * separated by a colon and wildcards.
     *
     * @param {String} namespaces
     * @api public
     */

    function enable(namespaces) {
      exports.save(namespaces);

      var split = (namespaces || '').split(/[\s,]+/);
      var len = split.length;

      for (var i = 0; i < len; i++) {
        if (!split[i]) continue; // ignore empty strings
        namespaces = split[i].replace(/\*/g, '.*?');
        if (namespaces[0] === '-') {
          exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
        } else {
          exports.names.push(new RegExp('^' + namespaces + '$'));
        }
      }
    }

    /**
     * Disable debug output.
     *
     * @api public
     */

    function disable() {
      exports.enable('');
    }

    /**
     * Returns true if the given mode name is enabled, false otherwise.
     *
     * @param {String} name
     * @return {Boolean}
     * @api public
     */

    function enabled(name) {
      var i, len;
      for (i = 0, len = exports.skips.length; i < len; i++) {
        if (exports.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = exports.names.length; i < len; i++) {
        if (exports.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }

    /**
     * Coerce `val`.
     *
     * @param {Mixed} val
     * @return {Mixed}
     * @api private
     */

    function coerce(val) {
      if (val instanceof Error) return val.stack || val.message;
      return val;
    }

    },{"ms":65}],65:[function(require,module,exports){
    /**
     * Helpers.
     */

    var s = 1000;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var y = d * 365.25;

    /**
     * Parse or format the given `val`.
     *
     * Options:
     *
     *  - `long` verbose formatting [false]
     *
     * @param {String|Number} val
     * @param {Object} options
     * @return {String|Number}
     * @api public
     */

    module.exports = function(val, options){
      options = options || {};
      if ('string' == typeof val) return parse(val);
      return options.long
        ? long(val)
        : short(val);
    };

    /**
     * Parse the given `str` and return milliseconds.
     *
     * @param {String} str
     * @return {Number}
     * @api private
     */

    function parse(str) {
      str = '' + str;
      if (str.length > 10000) return;
      var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
      if (!match) return;
      var n = parseFloat(match[1]);
      var type = (match[2] || 'ms').toLowerCase();
      switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
          return n * y;
        case 'days':
        case 'day':
        case 'd':
          return n * d;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
          return n * h;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
          return n * m;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
          return n * s;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
          return n;
      }
    }

    /**
     * Short format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function short(ms) {
      if (ms >= d) return Math.round(ms / d) + 'd';
      if (ms >= h) return Math.round(ms / h) + 'h';
      if (ms >= m) return Math.round(ms / m) + 'm';
      if (ms >= s) return Math.round(ms / s) + 's';
      return ms + 'ms';
    }

    /**
     * Long format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function long(ms) {
      return plural(ms, d, 'day')
        || plural(ms, h, 'hour')
        || plural(ms, m, 'minute')
        || plural(ms, s, 'second')
        || ms + ' ms';
    }

    /**
     * Pluralization helper.
     */

    function plural(ms, n, name) {
      if (ms < n) return;
      if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
      return Math.ceil(ms / n) + ' ' + name + 's';
    }

    },{}],66:[function(require,module,exports){

    /**
     * Module dependencies.
     */

    try {
      var type = require('type');
    } catch (err) {
      var type = require('component-type');
    }

    var toFunction = require('to-function');

    /**
     * HOP reference.
     */

    var has = Object.prototype.hasOwnProperty;

    /**
     * Iterate the given `obj` and invoke `fn(val, i)`
     * in optional context `ctx`.
     *
     * @param {String|Array|Object} obj
     * @param {Function} fn
     * @param {Object} [ctx]
     * @api public
     */

    module.exports = function(obj, fn, ctx){
      fn = toFunction(fn);
      ctx = ctx || this;
      switch (type(obj)) {
        case 'array':
          return array(obj, fn, ctx);
        case 'object':
          if ('number' == typeof obj.length) return array(obj, fn, ctx);
          return object(obj, fn, ctx);
        case 'string':
          return string(obj, fn, ctx);
      }
    };

    /**
     * Iterate string chars.
     *
     * @param {String} obj
     * @param {Function} fn
     * @param {Object} ctx
     * @api private
     */

    function string(obj, fn, ctx) {
      for (var i = 0; i < obj.length; ++i) {
        fn.call(ctx, obj.charAt(i), i);
      }
    }

    /**
     * Iterate object keys.
     *
     * @param {Object} obj
     * @param {Function} fn
     * @param {Object} ctx
     * @api private
     */

    function object(obj, fn, ctx) {
      for (var key in obj) {
        if (has.call(obj, key)) {
          fn.call(ctx, key, obj[key]);
        }
      }
    }

    /**
     * Iterate array-ish.
     *
     * @param {Array|Object} obj
     * @param {Function} fn
     * @param {Object} ctx
     * @api private
     */

    function array(obj, fn, ctx) {
      for (var i = 0; i < obj.length; ++i) {
        fn.call(ctx, obj[i], i);
      }
    }

    },{"component-type":67,"to-function":111,"type":67}],67:[function(require,module,exports){

    /**
     * toString ref.
     */

    var toString = Object.prototype.toString;

    /**
     * Return the type of `val`.
     *
     * @param {Mixed} val
     * @return {String}
     * @api public
     */

    module.exports = function(val){
      switch (toString.call(val)) {
        case '[object Function]': return 'function';
        case '[object Date]': return 'date';
        case '[object RegExp]': return 'regexp';
        case '[object Arguments]': return 'arguments';
        case '[object Array]': return 'array';
        case '[object String]': return 'string';
      }

      if (val === null) return 'null';
      if (val === undefined) return 'undefined';
      if (val && val.nodeType === 1) return 'element';
      if (val === Object(val)) return 'object';

      return typeof val;
    };

    },{}],68:[function(require,module,exports){

    /**
     * Expose `Emitter`.
     */

    if (typeof module !== 'undefined') {
      module.exports = Emitter;
    }

    /**
     * Initialize a new `Emitter`.
     *
     * @api public
     */

    function Emitter(obj) {
      if (obj) return mixin(obj);
    };

    /**
     * Mixin the emitter properties.
     *
     * @param {Object} obj
     * @return {Object}
     * @api private
     */

    function mixin(obj) {
      for (var key in Emitter.prototype) {
        obj[key] = Emitter.prototype[key];
      }
      return obj;
    }

    /**
     * Listen on the given `event` with `fn`.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.on =
    Emitter.prototype.addEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};
      (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
        .push(fn);
      return this;
    };

    /**
     * Adds an `event` listener that will be invoked a single
     * time then automatically removed.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.once = function(event, fn){
      function on() {
        this.off(event, on);
        fn.apply(this, arguments);
      }

      on.fn = fn;
      this.on(event, on);
      return this;
    };

    /**
     * Remove the given callback for `event` or all
     * registered callbacks.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.off =
    Emitter.prototype.removeListener =
    Emitter.prototype.removeAllListeners =
    Emitter.prototype.removeEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};

      // all
      if (0 == arguments.length) {
        this._callbacks = {};
        return this;
      }

      // specific event
      var callbacks = this._callbacks['$' + event];
      if (!callbacks) return this;

      // remove all handlers
      if (1 == arguments.length) {
        delete this._callbacks['$' + event];
        return this;
      }

      // remove specific handler
      var cb;
      for (var i = 0; i < callbacks.length; i++) {
        cb = callbacks[i];
        if (cb === fn || cb.fn === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }
      return this;
    };

    /**
     * Emit `event` with the given args.
     *
     * @param {String} event
     * @param {Mixed} ...
     * @return {Emitter}
     */

    Emitter.prototype.emit = function(event){
      this._callbacks = this._callbacks || {};
      var args = [].slice.call(arguments, 1)
        , callbacks = this._callbacks['$' + event];

      if (callbacks) {
        callbacks = callbacks.slice(0);
        for (var i = 0, len = callbacks.length; i < len; ++i) {
          callbacks[i].apply(this, args);
        }
      }

      return this;
    };

    /**
     * Return array of callbacks for `event`.
     *
     * @param {String} event
     * @return {Array}
     * @api public
     */

    Emitter.prototype.listeners = function(event){
      this._callbacks = this._callbacks || {};
      return this._callbacks['$' + event] || [];
    };

    /**
     * Check if this emitter has `event` handlers.
     *
     * @param {String} event
     * @return {Boolean}
     * @api public
     */

    Emitter.prototype.hasListeners = function(event){
      return !! this.listeners(event).length;
    };

    },{}],69:[function(require,module,exports){
    var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
        unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
        prefix = bind !== 'addEventListener' ? 'on' : '';

    /**
     * Bind `el` event `type` to `fn`.
     *
     * @param {Element} el
     * @param {String} type
     * @param {Function} fn
     * @param {Boolean} capture
     * @return {Function}
     * @api public
     */

    exports.bind = function(el, type, fn, capture){
      el[bind](prefix + type, fn, capture || false);
      return fn;
    };

    /**
     * Unbind `el` event `type`'s callback `fn`.
     *
     * @param {Element} el
     * @param {String} type
     * @param {Function} fn
     * @param {Boolean} capture
     * @return {Function}
     * @api public
     */

    exports.unbind = function(el, type, fn, capture){
      el[unbind](prefix + type, fn, capture || false);
      return fn;
    };
    },{}],70:[function(require,module,exports){
    /**
     * Global Names
     */

    var globals = /\b(Array|Date|Object|Math|JSON)\b/g;

    /**
     * Return immediate identifiers parsed from `str`.
     *
     * @param {String} str
     * @param {String|Function} map function or prefix
     * @return {Array}
     * @api public
     */

    module.exports = function(str, fn){
      var p = unique(props(str));
      if (fn && 'string' == typeof fn) fn = prefixed(fn);
      if (fn) return map(str, p, fn);
      return p;
    };

    /**
     * Return immediate identifiers in `str`.
     *
     * @param {String} str
     * @return {Array}
     * @api private
     */

    function props(str) {
      return str
        .replace(/\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\//g, '')
        .replace(globals, '')
        .match(/[a-zA-Z_]\w*/g)
        || [];
    }

    /**
     * Return `str` with `props` mapped with `fn`.
     *
     * @param {String} str
     * @param {Array} props
     * @param {Function} fn
     * @return {String}
     * @api private
     */

    function map(str, props, fn) {
      var re = /\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g;
      return str.replace(re, function(_){
        if ('(' == _[_.length - 1]) return fn(_);
        if (!~props.indexOf(_)) return _;
        return fn(_);
      });
    }

    /**
     * Return unique array.
     *
     * @param {Array} arr
     * @return {Array}
     * @api private
     */

    function unique(arr) {
      var ret = [];

      for (var i = 0; i < arr.length; i++) {
        if (~ret.indexOf(arr[i])) continue;
        ret.push(arr[i]);
      }

      return ret;
    }

    /**
     * Map with prefix `str`.
     */

    function prefixed(str) {
      return function(_){
        return str + _;
      };
    }

    },{}],71:[function(require,module,exports){

    /**
     * Module dependencies.
     */

    var trim = require('trim');
    var type = require('type');

    var pattern = /(\w+)\[(\d+)\]/

    /**
     * Safely encode the given string
     *
     * @param {String} str
     * @return {String}
     * @api private
     */

    var encode = function(str) {
      try {
        return encodeURIComponent(str);
      } catch (e) {
        return str;
      }
    };

    /**
     * Safely decode the string
     *
     * @param {String} str
     * @return {String}
     * @api private
     */

    var decode = function(str) {
      try {
        return decodeURIComponent(str.replace(/\+/g, ' '));
      } catch (e) {
        return str;
      }
    }

    /**
     * Parse the given query `str`.
     *
     * @param {String} str
     * @return {Object}
     * @api public
     */

    exports.parse = function(str){
      if ('string' != typeof str) return {};

      str = trim(str);
      if ('' == str) return {};
      if ('?' == str.charAt(0)) str = str.slice(1);

      var obj = {};
      var pairs = str.split('&');
      for (var i = 0; i < pairs.length; i++) {
        var parts = pairs[i].split('=');
        var key = decode(parts[0]);
        var m;

        if (m = pattern.exec(key)) {
          obj[m[1]] = obj[m[1]] || [];
          obj[m[1]][m[2]] = decode(parts[1]);
          continue;
        }

        obj[parts[0]] = null == parts[1]
          ? ''
          : decode(parts[1]);
      }

      return obj;
    };

    /**
     * Stringify the given `obj`.
     *
     * @param {Object} obj
     * @return {String}
     * @api public
     */

    exports.stringify = function(obj){
      if (!obj) return '';
      var pairs = [];

      for (var key in obj) {
        var value = obj[key];

        if ('array' == type(value)) {
          for (var i = 0; i < value.length; ++i) {
            pairs.push(encode(key + '[' + i + ']') + '=' + encode(value[i]));
          }
          continue;
        }

        pairs.push(encode(key) + '=' + encode(obj[key]));
      }

      return pairs.join('&');
    };

    },{"trim":113,"type":72}],72:[function(require,module,exports){
    /**
     * toString ref.
     */

    var toString = Object.prototype.toString;

    /**
     * Return the type of `val`.
     *
     * @param {Mixed} val
     * @return {String}
     * @api public
     */

    module.exports = function(val){
      switch (toString.call(val)) {
        case '[object Date]': return 'date';
        case '[object RegExp]': return 'regexp';
        case '[object Arguments]': return 'arguments';
        case '[object Array]': return 'array';
        case '[object Error]': return 'error';
      }

      if (val === null) return 'null';
      if (val === undefined) return 'undefined';
      if (val !== val) return 'nan';
      if (val && val.nodeType === 1) return 'element';

      val = val.valueOf
        ? val.valueOf()
        : Object.prototype.valueOf.apply(val)

      return typeof val;
    };

    },{}],73:[function(require,module,exports){
    /**
     * toString ref.
     */

    var toString = Object.prototype.toString;

    /**
     * Return the type of `val`.
     *
     * @param {Mixed} val
     * @return {String}
     * @api public
     */

    module.exports = function(val){
      switch (toString.call(val)) {
        case '[object Date]': return 'date';
        case '[object RegExp]': return 'regexp';
        case '[object Arguments]': return 'arguments';
        case '[object Array]': return 'array';
        case '[object Error]': return 'error';
      }

      if (val === null) return 'null';
      if (val === undefined) return 'undefined';
      if (val !== val) return 'nan';
      if (val && val.nodeType === 1) return 'element';

      if (isBuffer(val)) return 'buffer';

      val = val.valueOf
        ? val.valueOf()
        : Object.prototype.valueOf.apply(val);

      return typeof val;
    };

    // code borrowed from https://github.com/feross/is-buffer/blob/master/index.js
    function isBuffer(obj) {
      return !!(obj != null &&
        (obj._isBuffer || // For Safari 5-7 (missing Object.prototype.constructor)
          (obj.constructor &&
          typeof obj.constructor.isBuffer === 'function' &&
          obj.constructor.isBuffer(obj))
        ))
    }

    },{}],74:[function(require,module,exports){

    /**
     * Parse the given `url`.
     *
     * @param {String} str
     * @return {Object}
     * @api public
     */

    exports.parse = function(url){
      var a = document.createElement('a');
      a.href = url;
      return {
        href: a.href,
        host: a.host || location.host,
        port: ('0' === a.port || '' === a.port) ? port(a.protocol) : a.port,
        hash: a.hash,
        hostname: a.hostname || location.hostname,
        pathname: a.pathname.charAt(0) != '/' ? '/' + a.pathname : a.pathname,
        protocol: !a.protocol || ':' == a.protocol ? location.protocol : a.protocol,
        search: a.search,
        query: a.search.slice(1)
      };
    };

    /**
     * Check if `url` is absolute.
     *
     * @param {String} url
     * @return {Boolean}
     * @api public
     */

    exports.isAbsolute = function(url){
      return 0 == url.indexOf('//') || !!~url.indexOf('://');
    };

    /**
     * Check if `url` is relative.
     *
     * @param {String} url
     * @return {Boolean}
     * @api public
     */

    exports.isRelative = function(url){
      return !exports.isAbsolute(url);
    };

    /**
     * Check if `url` is cross domain.
     *
     * @param {String} url
     * @return {Boolean}
     * @api public
     */

    exports.isCrossDomain = function(url){
      url = exports.parse(url);
      var location = exports.parse(window.location.href);
      return url.hostname !== location.hostname
        || url.port !== location.port
        || url.protocol !== location.protocol;
    };

    /**
     * Return default port for `protocol`.
     *
     * @param  {String} protocol
     * @return {String}
     * @api private
     */
    function port (protocol){
      switch (protocol) {
        case 'http:':
          return 80;
        case 'https:':
          return 443;
        default:
          return location.port;
      }
    }

    },{}],75:[function(require,module,exports){

    /**
     * Expose `debug()` as the module.
     */

    module.exports = debug;

    /**
     * Create a debugger with the given `name`.
     *
     * @param {String} name
     * @return {Type}
     * @api public
     */

    function debug(name) {
      if (!debug.enabled(name)) return function(){};

      return function(fmt){
        fmt = coerce(fmt);

        var curr = new Date;
        var ms = curr - (debug[name] || curr);
        debug[name] = curr;

        fmt = name
          + ' '
          + fmt
          + ' +' + debug.humanize(ms);

        // This hackery is required for IE8
        // where `console.log` doesn't have 'apply'
        window.console
          && console.log
          && Function.prototype.apply.call(console.log, console, arguments);
      }
    }

    /**
     * The currently active debug mode names.
     */

    debug.names = [];
    debug.skips = [];

    /**
     * Enables a debug mode by name. This can include modes
     * separated by a colon and wildcards.
     *
     * @param {String} name
     * @api public
     */

    debug.enable = function(name) {
      try {
        localStorage.debug = name;
      } catch(e){}

      var split = (name || '').split(/[\s,]+/)
        , len = split.length;

      for (var i = 0; i < len; i++) {
        name = split[i].replace('*', '.*?');
        if (name[0] === '-') {
          debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
        }
        else {
          debug.names.push(new RegExp('^' + name + '$'));
        }
      }
    };

    /**
     * Disable debug output.
     *
     * @api public
     */

    debug.disable = function(){
      debug.enable('');
    };

    /**
     * Humanize the given `ms`.
     *
     * @param {Number} m
     * @return {String}
     * @api private
     */

    debug.humanize = function(ms) {
      var sec = 1000
        , min = 60 * 1000
        , hour = 60 * min;

      if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
      if (ms >= min) return (ms / min).toFixed(1) + 'm';
      if (ms >= sec) return (ms / sec | 0) + 's';
      return ms + 'ms';
    };

    /**
     * Returns true if the given mode name is enabled, false otherwise.
     *
     * @param {String} name
     * @return {Boolean}
     * @api public
     */

    debug.enabled = function(name) {
      for (var i = 0, len = debug.skips.length; i < len; i++) {
        if (debug.skips[i].test(name)) {
          return false;
        }
      }
      for (var i = 0, len = debug.names.length; i < len; i++) {
        if (debug.names[i].test(name)) {
          return true;
        }
      }
      return false;
    };

    /**
     * Coerce `val`.
     */

    function coerce(val) {
      if (val instanceof Error) return val.stack || val.message;
      return val;
    }

    // persist

    try {
      if (window.localStorage) debug.enable(localStorage.debug);
    } catch(e){}

    },{}],76:[function(require,module,exports){

    /**
     * Expose `parse`.
     */

    module.exports = parse;

    /**
     * Tests for browser support.
     */

    var innerHTMLBug = false;
    var bugTestDiv;
    if (typeof document !== 'undefined') {
      bugTestDiv = document.createElement('div');
      // Setup
      bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
      // Make sure that link elements get serialized correctly by innerHTML
      // This requires a wrapper element in IE
      innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
      bugTestDiv = undefined;
    }

    /**
     * Wrap map from jquery.
     */

    var map = {
      legend: [1, '<fieldset>', '</fieldset>'],
      tr: [2, '<table><tbody>', '</tbody></table>'],
      col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
      // for script/link/style tags to work in IE6-8, you have to wrap
      // in a div with a non-whitespace character in front, ha!
      _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
    };

    map.td =
    map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

    map.option =
    map.optgroup = [1, '<select multiple="multiple">', '</select>'];

    map.thead =
    map.tbody =
    map.colgroup =
    map.caption =
    map.tfoot = [1, '<table>', '</table>'];

    map.polyline =
    map.ellipse =
    map.polygon =
    map.circle =
    map.text =
    map.line =
    map.path =
    map.rect =
    map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

    /**
     * Parse `html` and return a DOM Node instance, which could be a TextNode,
     * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
     * instance, depending on the contents of the `html` string.
     *
     * @param {String} html - HTML string to "domify"
     * @param {Document} doc - The `document` instance to create the Node for
     * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
     * @api private
     */

    function parse(html, doc) {
      if ('string' != typeof html) throw new TypeError('String expected');

      // default to the global `document` object
      if (!doc) doc = document;

      // tag name
      var m = /<([\w:]+)/.exec(html);
      if (!m) return doc.createTextNode(html);

      html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

      var tag = m[1];

      // body support
      if (tag == 'body') {
        var el = doc.createElement('html');
        el.innerHTML = html;
        return el.removeChild(el.lastChild);
      }

      // wrap map
      var wrap = map[tag] || map._default;
      var depth = wrap[0];
      var prefix = wrap[1];
      var suffix = wrap[2];
      var el = doc.createElement('div');
      el.innerHTML = prefix + html + suffix;
      while (depth--) el = el.lastChild;

      // one element
      if (el.firstChild == el.lastChild) {
        return el.removeChild(el.firstChild);
      }

      // several elements
      var fragment = doc.createDocumentFragment();
      while (el.firstChild) {
        fragment.appendChild(el.removeChild(el.firstChild));
      }

      return fragment;
    }

    },{}],77:[function(require,module,exports){
    'use strict';

    var hasOwn = Object.prototype.hasOwnProperty;
    var toStr = Object.prototype.toString;

    var isArray = function isArray(arr) {
      if (typeof Array.isArray === 'function') {
        return Array.isArray(arr);
      }

      return toStr.call(arr) === '[object Array]';
    };

    var isPlainObject = function isPlainObject(obj) {
      if (!obj || toStr.call(obj) !== '[object Object]') {
        return false;
      }

      var hasOwnConstructor = hasOwn.call(obj, 'constructor');
      var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
      // Not own constructor property must be Object
      if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
        return false;
      }

      // Own properties are enumerated firstly, so to speed up,
      // if last one is own, then all properties are own.
      var key;
      for (key in obj) { /**/ }

      return typeof key === 'undefined' || hasOwn.call(obj, key);
    };

    module.exports = function extend() {
      var options, name, src, copy, copyIsArray, clone;
      var target = arguments[0];
      var i = 1;
      var length = arguments.length;
      var deep = false;

      // Handle a deep copy situation
      if (typeof target === 'boolean') {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2;
      }
      if (target == null || (typeof target !== 'object' && typeof target !== 'function')) {
        target = {};
      }

      for (; i < length; ++i) {
        options = arguments[i];
        // Only deal with non-null/undefined values
        if (options != null) {
          // Extend the base object
          for (name in options) {
            src = target[name];
            copy = options[name];

            // Prevent never-ending loop
            if (target !== copy) {
              // Recurse if we're merging plain objects or arrays
              if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                if (copyIsArray) {
                  copyIsArray = false;
                  clone = src && isArray(src) ? src : [];
                } else {
                  clone = src && isPlainObject(src) ? src : {};
                }

                // Never move original objects, clone them
                target[name] = extend(deep, clone, copy);

              // Don't bring in undefined values
              } else if (typeof copy !== 'undefined') {
                target[name] = copy;
              }
            }
          }
        }
      }

      // Return the modified object
      return target;
    };

    },{}],78:[function(require,module,exports){

    /**
     * Module exports.
     *
     * Logic borrowed from Modernizr:
     *
     *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
     */

    try {
      module.exports = typeof XMLHttpRequest !== 'undefined' &&
        'withCredentials' in new XMLHttpRequest();
    } catch (err) {
      // if XMLHttp support is disabled in IE then it will throw
      // when trying to create
      module.exports = false;
    }

    },{}],79:[function(require,module,exports){
    if (typeof Object.create === 'function') {
      // implementation from standard node.js 'util' module
      module.exports = function inherits(ctor, superCtor) {
        ctor.super_ = superCtor
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      };
    } else {
      // old school shim for old browsers
      module.exports = function inherits(ctor, superCtor) {
        ctor.super_ = superCtor
        var TempCtor = function () {}
        TempCtor.prototype = superCtor.prototype
        ctor.prototype = new TempCtor()
        ctor.prototype.constructor = ctor
      }
    }

    },{}],80:[function(require,module,exports){

    module.exports = function isEmail (string) {
        return (/.+\@.+\..+/).test(string);
    };
    },{}],81:[function(require,module,exports){
    /* globals window, HTMLElement */

    'use strict';

    /**!
     * is
     * the definitive JavaScript type testing library
     *
     * @copyright 2013-2014 Enrico Marino / Jordan Harband
     * @license MIT
     */

    var objProto = Object.prototype;
    var owns = objProto.hasOwnProperty;
    var toStr = objProto.toString;
    var symbolValueOf;
    if (typeof Symbol === 'function') {
      symbolValueOf = Symbol.prototype.valueOf;
    }
    var isActualNaN = function (value) {
      return value !== value;
    };
    var NON_HOST_TYPES = {
      'boolean': 1,
      number: 1,
      string: 1,
      undefined: 1
    };

    var base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
    var hexRegex = /^[A-Fa-f0-9]+$/;

    /**
     * Expose `is`
     */

    var is = {};

    /**
     * Test general.
     */

    /**
     * is.type
     * Test if `value` is a type of `type`.
     *
     * @param {Mixed} value value to test
     * @param {String} type type
     * @return {Boolean} true if `value` is a type of `type`, false otherwise
     * @api public
     */

    is.a = is.type = function (value, type) {
      return typeof value === type;
    };

    /**
     * is.defined
     * Test if `value` is defined.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if 'value' is defined, false otherwise
     * @api public
     */

    is.defined = function (value) {
      return typeof value !== 'undefined';
    };

    /**
     * is.empty
     * Test if `value` is empty.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is empty, false otherwise
     * @api public
     */

    is.empty = function (value) {
      var type = toStr.call(value);
      var key;

      if (type === '[object Array]' || type === '[object Arguments]' || type === '[object String]') {
        return value.length === 0;
      }

      if (type === '[object Object]') {
        for (key in value) {
          if (owns.call(value, key)) {
            return false;
          }
        }
        return true;
      }

      return !value;
    };

    /**
     * is.equal
     * Test if `value` is equal to `other`.
     *
     * @param {Mixed} value value to test
     * @param {Mixed} other value to compare with
     * @return {Boolean} true if `value` is equal to `other`, false otherwise
     */

    is.equal = function equal(value, other) {
      if (value === other) {
        return true;
      }

      var type = toStr.call(value);
      var key;

      if (type !== toStr.call(other)) {
        return false;
      }

      if (type === '[object Object]') {
        for (key in value) {
          if (!is.equal(value[key], other[key]) || !(key in other)) {
            return false;
          }
        }
        for (key in other) {
          if (!is.equal(value[key], other[key]) || !(key in value)) {
            return false;
          }
        }
        return true;
      }

      if (type === '[object Array]') {
        key = value.length;
        if (key !== other.length) {
          return false;
        }
        while (key--) {
          if (!is.equal(value[key], other[key])) {
            return false;
          }
        }
        return true;
      }

      if (type === '[object Function]') {
        return value.prototype === other.prototype;
      }

      if (type === '[object Date]') {
        return value.getTime() === other.getTime();
      }

      return false;
    };

    /**
     * is.hosted
     * Test if `value` is hosted by `host`.
     *
     * @param {Mixed} value to test
     * @param {Mixed} host host to test with
     * @return {Boolean} true if `value` is hosted by `host`, false otherwise
     * @api public
     */

    is.hosted = function (value, host) {
      var type = typeof host[value];
      return type === 'object' ? !!host[value] : !NON_HOST_TYPES[type];
    };

    /**
     * is.instance
     * Test if `value` is an instance of `constructor`.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is an instance of `constructor`
     * @api public
     */

    is.instance = is['instanceof'] = function (value, constructor) {
      return value instanceof constructor;
    };

    /**
     * is.nil / is.null
     * Test if `value` is null.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is null, false otherwise
     * @api public
     */

    is.nil = is['null'] = function (value) {
      return value === null;
    };

    /**
     * is.undef / is.undefined
     * Test if `value` is undefined.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is undefined, false otherwise
     * @api public
     */

    is.undef = is.undefined = function (value) {
      return typeof value === 'undefined';
    };

    /**
     * Test arguments.
     */

    /**
     * is.args
     * Test if `value` is an arguments object.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is an arguments object, false otherwise
     * @api public
     */

    is.args = is.arguments = function (value) {
      var isStandardArguments = toStr.call(value) === '[object Arguments]';
      var isOldArguments = !is.array(value) && is.arraylike(value) && is.object(value) && is.fn(value.callee);
      return isStandardArguments || isOldArguments;
    };

    /**
     * Test array.
     */

    /**
     * is.array
     * Test if 'value' is an array.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is an array, false otherwise
     * @api public
     */

    is.array = Array.isArray || function (value) {
      return toStr.call(value) === '[object Array]';
    };

    /**
     * is.arguments.empty
     * Test if `value` is an empty arguments object.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is an empty arguments object, false otherwise
     * @api public
     */
    is.args.empty = function (value) {
      return is.args(value) && value.length === 0;
    };

    /**
     * is.array.empty
     * Test if `value` is an empty array.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is an empty array, false otherwise
     * @api public
     */
    is.array.empty = function (value) {
      return is.array(value) && value.length === 0;
    };

    /**
     * is.arraylike
     * Test if `value` is an arraylike object.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is an arguments object, false otherwise
     * @api public
     */

    is.arraylike = function (value) {
      return !!value && !is.bool(value)
        && owns.call(value, 'length')
        && isFinite(value.length)
        && is.number(value.length)
        && value.length >= 0;
    };

    /**
     * Test boolean.
     */

    /**
     * is.bool
     * Test if `value` is a boolean.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is a boolean, false otherwise
     * @api public
     */

    is.bool = is['boolean'] = function (value) {
      return toStr.call(value) === '[object Boolean]';
    };

    /**
     * is.false
     * Test if `value` is false.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is false, false otherwise
     * @api public
     */

    is['false'] = function (value) {
      return is.bool(value) && Boolean(Number(value)) === false;
    };

    /**
     * is.true
     * Test if `value` is true.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is true, false otherwise
     * @api public
     */

    is['true'] = function (value) {
      return is.bool(value) && Boolean(Number(value)) === true;
    };

    /**
     * Test date.
     */

    /**
     * is.date
     * Test if `value` is a date.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is a date, false otherwise
     * @api public
     */

    is.date = function (value) {
      return toStr.call(value) === '[object Date]';
    };

    /**
     * is.date.valid
     * Test if `value` is a valid date.
     *
     * @param {Mixed} value value to test
     * @returns {Boolean} true if `value` is a valid date, false otherwise
     */
    is.date.valid = function (value) {
      return is.date(value) && !isNaN(Number(value));
    };

    /**
     * Test element.
     */

    /**
     * is.element
     * Test if `value` is an html element.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is an HTML Element, false otherwise
     * @api public
     */

    is.element = function (value) {
      return value !== undefined
        && typeof HTMLElement !== 'undefined'
        && value instanceof HTMLElement
        && value.nodeType === 1;
    };

    /**
     * Test error.
     */

    /**
     * is.error
     * Test if `value` is an error object.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is an error object, false otherwise
     * @api public
     */

    is.error = function (value) {
      return toStr.call(value) === '[object Error]';
    };

    /**
     * Test function.
     */

    /**
     * is.fn / is.function (deprecated)
     * Test if `value` is a function.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is a function, false otherwise
     * @api public
     */

    is.fn = is['function'] = function (value) {
      var isAlert = typeof window !== 'undefined' && value === window.alert;
      if (isAlert) {
        return true;
      }
      var str = toStr.call(value);
      return str === '[object Function]' || str === '[object GeneratorFunction]' || str === '[object AsyncFunction]';
    };

    /**
     * Test number.
     */

    /**
     * is.number
     * Test if `value` is a number.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is a number, false otherwise
     * @api public
     */

    is.number = function (value) {
      return toStr.call(value) === '[object Number]';
    };

    /**
     * is.infinite
     * Test if `value` is positive or negative infinity.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is positive or negative Infinity, false otherwise
     * @api public
     */
    is.infinite = function (value) {
      return value === Infinity || value === -Infinity;
    };

    /**
     * is.decimal
     * Test if `value` is a decimal number.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is a decimal number, false otherwise
     * @api public
     */

    is.decimal = function (value) {
      return is.number(value) && !isActualNaN(value) && !is.infinite(value) && value % 1 !== 0;
    };

    /**
     * is.divisibleBy
     * Test if `value` is divisible by `n`.
     *
     * @param {Number} value value to test
     * @param {Number} n dividend
     * @return {Boolean} true if `value` is divisible by `n`, false otherwise
     * @api public
     */

    is.divisibleBy = function (value, n) {
      var isDividendInfinite = is.infinite(value);
      var isDivisorInfinite = is.infinite(n);
      var isNonZeroNumber = is.number(value) && !isActualNaN(value) && is.number(n) && !isActualNaN(n) && n !== 0;
      return isDividendInfinite || isDivisorInfinite || (isNonZeroNumber && value % n === 0);
    };

    /**
     * is.integer
     * Test if `value` is an integer.
     *
     * @param value to test
     * @return {Boolean} true if `value` is an integer, false otherwise
     * @api public
     */

    is.integer = is['int'] = function (value) {
      return is.number(value) && !isActualNaN(value) && value % 1 === 0;
    };

    /**
     * is.maximum
     * Test if `value` is greater than 'others' values.
     *
     * @param {Number} value value to test
     * @param {Array} others values to compare with
     * @return {Boolean} true if `value` is greater than `others` values
     * @api public
     */

    is.maximum = function (value, others) {
      if (isActualNaN(value)) {
        throw new TypeError('NaN is not a valid value');
      } else if (!is.arraylike(others)) {
        throw new TypeError('second argument must be array-like');
      }
      var len = others.length;

      while (--len >= 0) {
        if (value < others[len]) {
          return false;
        }
      }

      return true;
    };

    /**
     * is.minimum
     * Test if `value` is less than `others` values.
     *
     * @param {Number} value value to test
     * @param {Array} others values to compare with
     * @return {Boolean} true if `value` is less than `others` values
     * @api public
     */

    is.minimum = function (value, others) {
      if (isActualNaN(value)) {
        throw new TypeError('NaN is not a valid value');
      } else if (!is.arraylike(others)) {
        throw new TypeError('second argument must be array-like');
      }
      var len = others.length;

      while (--len >= 0) {
        if (value > others[len]) {
          return false;
        }
      }

      return true;
    };

    /**
     * is.nan
     * Test if `value` is not a number.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is not a number, false otherwise
     * @api public
     */

    is.nan = function (value) {
      return !is.number(value) || value !== value;
    };

    /**
     * is.even
     * Test if `value` is an even number.
     *
     * @param {Number} value value to test
     * @return {Boolean} true if `value` is an even number, false otherwise
     * @api public
     */

    is.even = function (value) {
      return is.infinite(value) || (is.number(value) && value === value && value % 2 === 0);
    };

    /**
     * is.odd
     * Test if `value` is an odd number.
     *
     * @param {Number} value value to test
     * @return {Boolean} true if `value` is an odd number, false otherwise
     * @api public
     */

    is.odd = function (value) {
      return is.infinite(value) || (is.number(value) && value === value && value % 2 !== 0);
    };

    /**
     * is.ge
     * Test if `value` is greater than or equal to `other`.
     *
     * @param {Number} value value to test
     * @param {Number} other value to compare with
     * @return {Boolean}
     * @api public
     */

    is.ge = function (value, other) {
      if (isActualNaN(value) || isActualNaN(other)) {
        throw new TypeError('NaN is not a valid value');
      }
      return !is.infinite(value) && !is.infinite(other) && value >= other;
    };

    /**
     * is.gt
     * Test if `value` is greater than `other`.
     *
     * @param {Number} value value to test
     * @param {Number} other value to compare with
     * @return {Boolean}
     * @api public
     */

    is.gt = function (value, other) {
      if (isActualNaN(value) || isActualNaN(other)) {
        throw new TypeError('NaN is not a valid value');
      }
      return !is.infinite(value) && !is.infinite(other) && value > other;
    };

    /**
     * is.le
     * Test if `value` is less than or equal to `other`.
     *
     * @param {Number} value value to test
     * @param {Number} other value to compare with
     * @return {Boolean} if 'value' is less than or equal to 'other'
     * @api public
     */

    is.le = function (value, other) {
      if (isActualNaN(value) || isActualNaN(other)) {
        throw new TypeError('NaN is not a valid value');
      }
      return !is.infinite(value) && !is.infinite(other) && value <= other;
    };

    /**
     * is.lt
     * Test if `value` is less than `other`.
     *
     * @param {Number} value value to test
     * @param {Number} other value to compare with
     * @return {Boolean} if `value` is less than `other`
     * @api public
     */

    is.lt = function (value, other) {
      if (isActualNaN(value) || isActualNaN(other)) {
        throw new TypeError('NaN is not a valid value');
      }
      return !is.infinite(value) && !is.infinite(other) && value < other;
    };

    /**
     * is.within
     * Test if `value` is within `start` and `finish`.
     *
     * @param {Number} value value to test
     * @param {Number} start lower bound
     * @param {Number} finish upper bound
     * @return {Boolean} true if 'value' is is within 'start' and 'finish'
     * @api public
     */
    is.within = function (value, start, finish) {
      if (isActualNaN(value) || isActualNaN(start) || isActualNaN(finish)) {
        throw new TypeError('NaN is not a valid value');
      } else if (!is.number(value) || !is.number(start) || !is.number(finish)) {
        throw new TypeError('all arguments must be numbers');
      }
      var isAnyInfinite = is.infinite(value) || is.infinite(start) || is.infinite(finish);
      return isAnyInfinite || (value >= start && value <= finish);
    };

    /**
     * Test object.
     */

    /**
     * is.object
     * Test if `value` is an object.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is an object, false otherwise
     * @api public
     */
    is.object = function (value) {
      return toStr.call(value) === '[object Object]';
    };

    /**
     * is.primitive
     * Test if `value` is a primitive.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is a primitive, false otherwise
     * @api public
     */
    is.primitive = function isPrimitive(value) {
      if (!value) {
        return true;
      }
      if (typeof value === 'object' || is.object(value) || is.fn(value) || is.array(value)) {
        return false;
      }
      return true;
    };

    /**
     * is.hash
     * Test if `value` is a hash - a plain object literal.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is a hash, false otherwise
     * @api public
     */

    is.hash = function (value) {
      return is.object(value) && value.constructor === Object && !value.nodeType && !value.setInterval;
    };

    /**
     * Test regexp.
     */

    /**
     * is.regexp
     * Test if `value` is a regular expression.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is a regexp, false otherwise
     * @api public
     */

    is.regexp = function (value) {
      return toStr.call(value) === '[object RegExp]';
    };

    /**
     * Test string.
     */

    /**
     * is.string
     * Test if `value` is a string.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if 'value' is a string, false otherwise
     * @api public
     */

    is.string = function (value) {
      return toStr.call(value) === '[object String]';
    };

    /**
     * Test base64 string.
     */

    /**
     * is.base64
     * Test if `value` is a valid base64 encoded string.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if 'value' is a base64 encoded string, false otherwise
     * @api public
     */

    is.base64 = function (value) {
      return is.string(value) && (!value.length || base64Regex.test(value));
    };

    /**
     * Test base64 string.
     */

    /**
     * is.hex
     * Test if `value` is a valid hex encoded string.
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if 'value' is a hex encoded string, false otherwise
     * @api public
     */

    is.hex = function (value) {
      return is.string(value) && (!value.length || hexRegex.test(value));
    };

    /**
     * is.symbol
     * Test if `value` is an ES6 Symbol
     *
     * @param {Mixed} value value to test
     * @return {Boolean} true if `value` is a Symbol, false otherise
     * @api public
     */

    is.symbol = function (value) {
      return typeof Symbol === 'function' && toStr.call(value) === '[object Symbol]' && typeof symbolValueOf.call(value) === 'symbol';
    };

    module.exports = is;

    },{}],82:[function(require,module,exports){
    (function (global){
    /*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
    ;(function () {
      // Detect the `define` function exposed by asynchronous module loaders. The
      // strict `define` check is necessary for compatibility with `r.js`.
      var isLoader = typeof define === "function" && define.amd;

      // A set of types used to distinguish objects from primitives.
      var objectTypes = {
        "function": true,
        "object": true
      };

      // Detect the `exports` object exposed by CommonJS implementations.
      var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

      // Use the `global` object exposed by Node (including Browserify via
      // `insert-module-globals`), Narwhal, and Ringo as the default context,
      // and the `window` object in browsers. Rhino exports a `global` function
      // instead.
      var root = objectTypes[typeof window] && window || this,
          freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof global == "object" && global;

      if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) {
        root = freeGlobal;
      }

      // Public: Initializes JSON 3 using the given `context` object, attaching the
      // `stringify` and `parse` functions to the specified `exports` object.
      function runInContext(context, exports) {
        context || (context = root["Object"]());
        exports || (exports = root["Object"]());

        // Native constructor aliases.
        var Number = context["Number"] || root["Number"],
            String = context["String"] || root["String"],
            Object = context["Object"] || root["Object"],
            Date = context["Date"] || root["Date"],
            SyntaxError = context["SyntaxError"] || root["SyntaxError"],
            TypeError = context["TypeError"] || root["TypeError"],
            Math = context["Math"] || root["Math"],
            nativeJSON = context["JSON"] || root["JSON"];

        // Delegate to the native `stringify` and `parse` implementations.
        if (typeof nativeJSON == "object" && nativeJSON) {
          exports.stringify = nativeJSON.stringify;
          exports.parse = nativeJSON.parse;
        }

        // Convenience aliases.
        var objectProto = Object.prototype,
            getClass = objectProto.toString,
            isProperty, forEach, undef;

        // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
        var isExtended = new Date(-3509827334573292);
        try {
          // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
          // results for certain dates in Opera >= 10.53.
          isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
            // Safari < 2.0.2 stores the internal millisecond time value correctly,
            // but clips the values returned by the date methods to the range of
            // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
            isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
        } catch (exception) {}

        // Internal: Determines whether the native `JSON.stringify` and `parse`
        // implementations are spec-compliant. Based on work by Ken Snyder.
        function has(name) {
          if (has[name] !== undef) {
            // Return cached feature test result.
            return has[name];
          }
          var isSupported;
          if (name == "bug-string-char-index") {
            // IE <= 7 doesn't support accessing string characters using square
            // bracket notation. IE 8 only supports this for primitives.
            isSupported = "a"[0] != "a";
          } else if (name == "json") {
            // Indicates whether both `JSON.stringify` and `JSON.parse` are
            // supported.
            isSupported = has("json-stringify") && has("json-parse");
          } else {
            var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
            // Test `JSON.stringify`.
            if (name == "json-stringify") {
              var stringify = exports.stringify, stringifySupported = typeof stringify == "function" && isExtended;
              if (stringifySupported) {
                // A test function object with a custom `toJSON` method.
                (value = function () {
                  return 1;
                }).toJSON = value;
                try {
                  stringifySupported =
                    // Firefox 3.1b1 and b2 serialize string, number, and boolean
                    // primitives as object literals.
                    stringify(0) === "0" &&
                    // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
                    // literals.
                    stringify(new Number()) === "0" &&
                    stringify(new String()) == '""' &&
                    // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
                    // does not define a canonical JSON representation (this applies to
                    // objects with `toJSON` properties as well, *unless* they are nested
                    // within an object or array).
                    stringify(getClass) === undef &&
                    // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
                    // FF 3.1b3 pass this test.
                    stringify(undef) === undef &&
                    // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
                    // respectively, if the value is omitted entirely.
                    stringify() === undef &&
                    // FF 3.1b1, 2 throw an error if the given value is not a number,
                    // string, array, object, Boolean, or `null` literal. This applies to
                    // objects with custom `toJSON` methods as well, unless they are nested
                    // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
                    // methods entirely.
                    stringify(value) === "1" &&
                    stringify([value]) == "[1]" &&
                    // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
                    // `"[null]"`.
                    stringify([undef]) == "[null]" &&
                    // YUI 3.0.0b1 fails to serialize `null` literals.
                    stringify(null) == "null" &&
                    // FF 3.1b1, 2 halts serialization if an array contains a function:
                    // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
                    // elides non-JSON values from objects and arrays, unless they
                    // define custom `toJSON` methods.
                    stringify([undef, getClass, null]) == "[null,null,null]" &&
                    // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
                    // where character escape codes are expected (e.g., `\b` => `\u0008`).
                    stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
                    // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
                    stringify(null, value) === "1" &&
                    stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
                    // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
                    // serialize extended years.
                    stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
                    // The milliseconds are optional in ES 5, but required in 5.1.
                    stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
                    // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
                    // four-digit years instead of six-digit years. Credits: @Yaffle.
                    stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
                    // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
                    // values less than 1000. Credits: @Yaffle.
                    stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
                } catch (exception) {
                  stringifySupported = false;
                }
              }
              isSupported = stringifySupported;
            }
            // Test `JSON.parse`.
            if (name == "json-parse") {
              var parse = exports.parse;
              if (typeof parse == "function") {
                try {
                  // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
                  // Conforming implementations should also coerce the initial argument to
                  // a string prior to parsing.
                  if (parse("0") === 0 && !parse(false)) {
                    // Simple parsing test.
                    value = parse(serialized);
                    var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                    if (parseSupported) {
                      try {
                        // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                        parseSupported = !parse('"\t"');
                      } catch (exception) {}
                      if (parseSupported) {
                        try {
                          // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                          // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                          // certain octal literals.
                          parseSupported = parse("01") !== 1;
                        } catch (exception) {}
                      }
                      if (parseSupported) {
                        try {
                          // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                          // points. These environments, along with FF 3.1b1 and 2,
                          // also allow trailing commas in JSON objects and arrays.
                          parseSupported = parse("1.") !== 1;
                        } catch (exception) {}
                      }
                    }
                  }
                } catch (exception) {
                  parseSupported = false;
                }
              }
              isSupported = parseSupported;
            }
          }
          return has[name] = !!isSupported;
        }

        if (!has("json")) {
          // Common `[[Class]]` name aliases.
          var functionClass = "[object Function]",
              dateClass = "[object Date]",
              numberClass = "[object Number]",
              stringClass = "[object String]",
              arrayClass = "[object Array]",
              booleanClass = "[object Boolean]";

          // Detect incomplete support for accessing string characters by index.
          var charIndexBuggy = has("bug-string-char-index");

          // Define additional utility methods if the `Date` methods are buggy.
          if (!isExtended) {
            var floor = Math.floor;
            // A mapping between the months of the year and the number of days between
            // January 1st and the first of the respective month.
            var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
            // Internal: Calculates the number of days between the Unix epoch and the
            // first day of the given month.
            var getDay = function (year, month) {
              return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
            };
          }

          // Internal: Determines if a property is a direct property of the given
          // object. Delegates to the native `Object#hasOwnProperty` method.
          if (!(isProperty = objectProto.hasOwnProperty)) {
            isProperty = function (property) {
              var members = {}, constructor;
              if ((members.__proto__ = null, members.__proto__ = {
                // The *proto* property cannot be set multiple times in recent
                // versions of Firefox and SeaMonkey.
                "toString": 1
              }, members).toString != getClass) {
                // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
                // supports the mutable *proto* property.
                isProperty = function (property) {
                  // Capture and break the object's prototype chain (see section 8.6.2
                  // of the ES 5.1 spec). The parenthesized expression prevents an
                  // unsafe transformation by the Closure Compiler.
                  var original = this.__proto__, result = property in (this.__proto__ = null, this);
                  // Restore the original prototype chain.
                  this.__proto__ = original;
                  return result;
                };
              } else {
                // Capture a reference to the top-level `Object` constructor.
                constructor = members.constructor;
                // Use the `constructor` property to simulate `Object#hasOwnProperty` in
                // other environments.
                isProperty = function (property) {
                  var parent = (this.constructor || constructor).prototype;
                  return property in this && !(property in parent && this[property] === parent[property]);
                };
              }
              members = null;
              return isProperty.call(this, property);
            };
          }

          // Internal: Normalizes the `for...in` iteration algorithm across
          // environments. Each enumerated key is yielded to a `callback` function.
          forEach = function (object, callback) {
            var size = 0, Properties, members, property;

            // Tests for bugs in the current environment's `for...in` algorithm. The
            // `valueOf` property inherits the non-enumerable flag from
            // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
            (Properties = function () {
              this.valueOf = 0;
            }).prototype.valueOf = 0;

            // Iterate over a new instance of the `Properties` class.
            members = new Properties();
            for (property in members) {
              // Ignore all properties inherited from `Object.prototype`.
              if (isProperty.call(members, property)) {
                size++;
              }
            }
            Properties = members = null;

            // Normalize the iteration algorithm.
            if (!size) {
              // A list of non-enumerable properties inherited from `Object.prototype`.
              members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
              // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
              // properties.
              forEach = function (object, callback) {
                var isFunction = getClass.call(object) == functionClass, property, length;
                var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
                for (property in object) {
                  // Gecko <= 1.0 enumerates the `prototype` property of functions under
                  // certain conditions; IE does not.
                  if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                    callback(property);
                  }
                }
                // Manually invoke the callback for each non-enumerable property.
                for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
              };
            } else if (size == 2) {
              // Safari <= 2.0.4 enumerates shadowed properties twice.
              forEach = function (object, callback) {
                // Create a set of iterated properties.
                var members = {}, isFunction = getClass.call(object) == functionClass, property;
                for (property in object) {
                  // Store each property name to prevent double enumeration. The
                  // `prototype` property of functions is not enumerated due to cross-
                  // environment inconsistencies.
                  if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
                    callback(property);
                  }
                }
              };
            } else {
              // No bugs detected; use the standard `for...in` algorithm.
              forEach = function (object, callback) {
                var isFunction = getClass.call(object) == functionClass, property, isConstructor;
                for (property in object) {
                  if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                    callback(property);
                  }
                }
                // Manually invoke the callback for the `constructor` property due to
                // cross-environment inconsistencies.
                if (isConstructor || isProperty.call(object, (property = "constructor"))) {
                  callback(property);
                }
              };
            }
            return forEach(object, callback);
          };

          // Public: Serializes a JavaScript `value` as a JSON string. The optional
          // `filter` argument may specify either a function that alters how object and
          // array members are serialized, or an array of strings and numbers that
          // indicates which properties should be serialized. The optional `width`
          // argument may be either a string or number that specifies the indentation
          // level of the output.
          if (!has("json-stringify")) {
            // Internal: A map of control characters and their escaped equivalents.
            var Escapes = {
              92: "\\\\",
              34: '\\"',
              8: "\\b",
              12: "\\f",
              10: "\\n",
              13: "\\r",
              9: "\\t"
            };

            // Internal: Converts `value` into a zero-padded string such that its
            // length is at least equal to `width`. The `width` must be <= 6.
            var leadingZeroes = "000000";
            var toPaddedString = function (width, value) {
              // The `|| 0` expression is necessary to work around a bug in
              // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
              return (leadingZeroes + (value || 0)).slice(-width);
            };

            // Internal: Double-quotes a string `value`, replacing all ASCII control
            // characters (characters with code unit values between 0 and 31) with
            // their escaped equivalents. This is an implementation of the
            // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
            var unicodePrefix = "\\u00";
            var quote = function (value) {
              var result = '"', index = 0, length = value.length, useCharIndex = !charIndexBuggy || length > 10;
              var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
              for (; index < length; index++) {
                var charCode = value.charCodeAt(index);
                // If the character is a control character, append its Unicode or
                // shorthand escape sequence; otherwise, append the character as-is.
                switch (charCode) {
                  case 8: case 9: case 10: case 12: case 13: case 34: case 92:
                    result += Escapes[charCode];
                    break;
                  default:
                    if (charCode < 32) {
                      result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                      break;
                    }
                    result += useCharIndex ? symbols[index] : value.charAt(index);
                }
              }
              return result + '"';
            };

            // Internal: Recursively serializes an object. Implements the
            // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
            var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
              var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
              try {
                // Necessary for host object support.
                value = object[property];
              } catch (exception) {}
              if (typeof value == "object" && value) {
                className = getClass.call(value);
                if (className == dateClass && !isProperty.call(value, "toJSON")) {
                  if (value > -1 / 0 && value < 1 / 0) {
                    // Dates are serialized according to the `Date#toJSON` method
                    // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
                    // for the ISO 8601 date time string format.
                    if (getDay) {
                      // Manually compute the year, month, date, hours, minutes,
                      // seconds, and milliseconds if the `getUTC*` methods are
                      // buggy. Adapted from @Yaffle's `date-shim` project.
                      date = floor(value / 864e5);
                      for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                      for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                      date = 1 + date - getDay(year, month);
                      // The `time` value specifies the time within the day (see ES
                      // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                      // to compute `A modulo B`, as the `%` operator does not
                      // correspond to the `modulo` operation for negative numbers.
                      time = (value % 864e5 + 864e5) % 864e5;
                      // The hours, minutes, seconds, and milliseconds are obtained by
                      // decomposing the time within the day. See section 15.9.1.10.
                      hours = floor(time / 36e5) % 24;
                      minutes = floor(time / 6e4) % 60;
                      seconds = floor(time / 1e3) % 60;
                      milliseconds = time % 1e3;
                    } else {
                      year = value.getUTCFullYear();
                      month = value.getUTCMonth();
                      date = value.getUTCDate();
                      hours = value.getUTCHours();
                      minutes = value.getUTCMinutes();
                      seconds = value.getUTCSeconds();
                      milliseconds = value.getUTCMilliseconds();
                    }
                    // Serialize extended years correctly.
                    value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
                      "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                      // Months, dates, hours, minutes, and seconds should have two
                      // digits; milliseconds should have three.
                      "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                      // Milliseconds are optional in ES 5.0, but required in 5.1.
                      "." + toPaddedString(3, milliseconds) + "Z";
                  } else {
                    value = null;
                  }
                } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
                  // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
                  // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
                  // ignores all `toJSON` methods on these objects unless they are
                  // defined directly on an instance.
                  value = value.toJSON(property);
                }
              }
              if (callback) {
                // If a replacement function was provided, call it to obtain the value
                // for serialization.
                value = callback.call(object, property, value);
              }
              if (value === null) {
                return "null";
              }
              className = getClass.call(value);
              if (className == booleanClass) {
                // Booleans are represented literally.
                return "" + value;
              } else if (className == numberClass) {
                // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
                // `"null"`.
                return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
              } else if (className == stringClass) {
                // Strings are double-quoted and escaped.
                return quote("" + value);
              }
              // Recursively serialize objects and arrays.
              if (typeof value == "object") {
                // Check for cyclic structures. This is a linear search; performance
                // is inversely proportional to the number of unique nested objects.
                for (length = stack.length; length--;) {
                  if (stack[length] === value) {
                    // Cyclic structures cannot be serialized by `JSON.stringify`.
                    throw TypeError();
                  }
                }
                // Add the object to the stack of traversed objects.
                stack.push(value);
                results = [];
                // Save the current indentation level and indent one additional level.
                prefix = indentation;
                indentation += whitespace;
                if (className == arrayClass) {
                  // Recursively serialize array elements.
                  for (index = 0, length = value.length; index < length; index++) {
                    element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                    results.push(element === undef ? "null" : element);
                  }
                  result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
                } else {
                  // Recursively serialize object members. Members are selected from
                  // either a user-specified list of property names, or the object
                  // itself.
                  forEach(properties || value, function (property) {
                    var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                    if (element !== undef) {
                      // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                      // is not the empty string, let `member` {quote(property) + ":"}
                      // be the concatenation of `member` and the `space` character."
                      // The "`space` character" refers to the literal space
                      // character, not the `space` {width} argument provided to
                      // `JSON.stringify`.
                      results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                    }
                  });
                  result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
                }
                // Remove the object from the traversed object stack.
                stack.pop();
                return result;
              }
            };

            // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
            exports.stringify = function (source, filter, width) {
              var whitespace, callback, properties, className;
              if (objectTypes[typeof filter] && filter) {
                if ((className = getClass.call(filter)) == functionClass) {
                  callback = filter;
                } else if (className == arrayClass) {
                  // Convert the property names array into a makeshift set.
                  properties = {};
                  for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
                }
              }
              if (width) {
                if ((className = getClass.call(width)) == numberClass) {
                  // Convert the `width` to an integer and create a string containing
                  // `width` number of space characters.
                  if ((width -= width % 1) > 0) {
                    for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
                  }
                } else if (className == stringClass) {
                  whitespace = width.length <= 10 ? width : width.slice(0, 10);
                }
              }
              // Opera <= 7.54u2 discards the values associated with empty string keys
              // (`""`) only if they are used directly within an object member list
              // (e.g., `!("" in { "": 1})`).
              return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
            };
          }

          // Public: Parses a JSON source string.
          if (!has("json-parse")) {
            var fromCharCode = String.fromCharCode;

            // Internal: A map of escaped control characters and their unescaped
            // equivalents.
            var Unescapes = {
              92: "\\",
              34: '"',
              47: "/",
              98: "\b",
              116: "\t",
              110: "\n",
              102: "\f",
              114: "\r"
            };

            // Internal: Stores the parser state.
            var Index, Source;

            // Internal: Resets the parser state and throws a `SyntaxError`.
            var abort = function () {
              Index = Source = null;
              throw SyntaxError();
            };

            // Internal: Returns the next token, or `"$"` if the parser has reached
            // the end of the source string. A token may be a string, number, `null`
            // literal, or Boolean literal.
            var lex = function () {
              var source = Source, length = source.length, value, begin, position, isSigned, charCode;
              while (Index < length) {
                charCode = source.charCodeAt(Index);
                switch (charCode) {
                  case 9: case 10: case 13: case 32:
                    // Skip whitespace tokens, including tabs, carriage returns, line
                    // feeds, and space characters.
                    Index++;
                    break;
                  case 123: case 125: case 91: case 93: case 58: case 44:
                    // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
                    // the current position.
                    value = charIndexBuggy ? source.charAt(Index) : source[Index];
                    Index++;
                    return value;
                  case 34:
                    // `"` delimits a JSON string; advance to the next character and
                    // begin parsing the string. String tokens are prefixed with the
                    // sentinel `@` character to distinguish them from punctuators and
                    // end-of-string tokens.
                    for (value = "@", Index++; Index < length;) {
                      charCode = source.charCodeAt(Index);
                      if (charCode < 32) {
                        // Unescaped ASCII control characters (those with a code unit
                        // less than the space character) are not permitted.
                        abort();
                      } else if (charCode == 92) {
                        // A reverse solidus (`\`) marks the beginning of an escaped
                        // control character (including `"`, `\`, and `/`) or Unicode
                        // escape sequence.
                        charCode = source.charCodeAt(++Index);
                        switch (charCode) {
                          case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
                            // Revive escaped control characters.
                            value += Unescapes[charCode];
                            Index++;
                            break;
                          case 117:
                            // `\u` marks the beginning of a Unicode escape sequence.
                            // Advance to the first character and validate the
                            // four-digit code point.
                            begin = ++Index;
                            for (position = Index + 4; Index < position; Index++) {
                              charCode = source.charCodeAt(Index);
                              // A valid sequence comprises four hexdigits (case-
                              // insensitive) that form a single hexadecimal value.
                              if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                                // Invalid Unicode escape sequence.
                                abort();
                              }
                            }
                            // Revive the escaped character.
                            value += fromCharCode("0x" + source.slice(begin, Index));
                            break;
                          default:
                            // Invalid escape sequence.
                            abort();
                        }
                      } else {
                        if (charCode == 34) {
                          // An unescaped double-quote character marks the end of the
                          // string.
                          break;
                        }
                        charCode = source.charCodeAt(Index);
                        begin = Index;
                        // Optimize for the common case where a string is valid.
                        while (charCode >= 32 && charCode != 92 && charCode != 34) {
                          charCode = source.charCodeAt(++Index);
                        }
                        // Append the string as-is.
                        value += source.slice(begin, Index);
                      }
                    }
                    if (source.charCodeAt(Index) == 34) {
                      // Advance to the next character and return the revived string.
                      Index++;
                      return value;
                    }
                    // Unterminated string.
                    abort();
                  default:
                    // Parse numbers and literals.
                    begin = Index;
                    // Advance past the negative sign, if one is specified.
                    if (charCode == 45) {
                      isSigned = true;
                      charCode = source.charCodeAt(++Index);
                    }
                    // Parse an integer or floating-point value.
                    if (charCode >= 48 && charCode <= 57) {
                      // Leading zeroes are interpreted as octal literals.
                      if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                        // Illegal octal literal.
                        abort();
                      }
                      isSigned = false;
                      // Parse the integer component.
                      for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
                      // Floats cannot contain a leading decimal point; however, this
                      // case is already accounted for by the parser.
                      if (source.charCodeAt(Index) == 46) {
                        position = ++Index;
                        // Parse the decimal component.
                        for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                        if (position == Index) {
                          // Illegal trailing decimal.
                          abort();
                        }
                        Index = position;
                      }
                      // Parse exponents. The `e` denoting the exponent is
                      // case-insensitive.
                      charCode = source.charCodeAt(Index);
                      if (charCode == 101 || charCode == 69) {
                        charCode = source.charCodeAt(++Index);
                        // Skip past the sign following the exponent, if one is
                        // specified.
                        if (charCode == 43 || charCode == 45) {
                          Index++;
                        }
                        // Parse the exponential component.
                        for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                        if (position == Index) {
                          // Illegal empty exponent.
                          abort();
                        }
                        Index = position;
                      }
                      // Coerce the parsed value to a JavaScript number.
                      return +source.slice(begin, Index);
                    }
                    // A negative sign may only precede numbers.
                    if (isSigned) {
                      abort();
                    }
                    // `true`, `false`, and `null` literals.
                    if (source.slice(Index, Index + 4) == "true") {
                      Index += 4;
                      return true;
                    } else if (source.slice(Index, Index + 5) == "false") {
                      Index += 5;
                      return false;
                    } else if (source.slice(Index, Index + 4) == "null") {
                      Index += 4;
                      return null;
                    }
                    // Unrecognized token.
                    abort();
                }
              }
              // Return the sentinel `$` character if the parser has reached the end
              // of the source string.
              return "$";
            };

            // Internal: Parses a JSON `value` token.
            var get = function (value) {
              var results, hasMembers;
              if (value == "$") {
                // Unexpected end of input.
                abort();
              }
              if (typeof value == "string") {
                if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
                  // Remove the sentinel `@` character.
                  return value.slice(1);
                }
                // Parse object and array literals.
                if (value == "[") {
                  // Parses a JSON array, returning a new JavaScript array.
                  results = [];
                  for (;; hasMembers || (hasMembers = true)) {
                    value = lex();
                    // A closing square bracket marks the end of the array literal.
                    if (value == "]") {
                      break;
                    }
                    // If the array literal contains elements, the current token
                    // should be a comma separating the previous element from the
                    // next.
                    if (hasMembers) {
                      if (value == ",") {
                        value = lex();
                        if (value == "]") {
                          // Unexpected trailing `,` in array literal.
                          abort();
                        }
                      } else {
                        // A `,` must separate each array element.
                        abort();
                      }
                    }
                    // Elisions and leading commas are not permitted.
                    if (value == ",") {
                      abort();
                    }
                    results.push(get(value));
                  }
                  return results;
                } else if (value == "{") {
                  // Parses a JSON object, returning a new JavaScript object.
                  results = {};
                  for (;; hasMembers || (hasMembers = true)) {
                    value = lex();
                    // A closing curly brace marks the end of the object literal.
                    if (value == "}") {
                      break;
                    }
                    // If the object literal contains members, the current token
                    // should be a comma separator.
                    if (hasMembers) {
                      if (value == ",") {
                        value = lex();
                        if (value == "}") {
                          // Unexpected trailing `,` in object literal.
                          abort();
                        }
                      } else {
                        // A `,` must separate each object member.
                        abort();
                      }
                    }
                    // Leading commas are not permitted, object property names must be
                    // double-quoted strings, and a `:` must separate each property
                    // name and value.
                    if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                      abort();
                    }
                    results[value.slice(1)] = get(lex());
                  }
                  return results;
                }
                // Unexpected token encountered.
                abort();
              }
              return value;
            };

            // Internal: Updates a traversed object member.
            var update = function (source, property, callback) {
              var element = walk(source, property, callback);
              if (element === undef) {
                delete source[property];
              } else {
                source[property] = element;
              }
            };

            // Internal: Recursively traverses a parsed JSON object, invoking the
            // `callback` function for each value. This is an implementation of the
            // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
            var walk = function (source, property, callback) {
              var value = source[property], length;
              if (typeof value == "object" && value) {
                // `forEach` can't be used to traverse an array in Opera <= 8.54
                // because its `Object#hasOwnProperty` implementation returns `false`
                // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
                if (getClass.call(value) == arrayClass) {
                  for (length = value.length; length--;) {
                    update(value, length, callback);
                  }
                } else {
                  forEach(value, function (property) {
                    update(value, property, callback);
                  });
                }
              }
              return callback.call(source, property, value);
            };

            // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
            exports.parse = function (source, callback) {
              var result, value;
              Index = 0;
              Source = "" + source;
              result = get(lex());
              // If a JSON string contains multiple tokens, it is invalid.
              if (lex() != "$") {
                abort();
              }
              // Reset the parser state.
              Index = Source = null;
              return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
            };
          }
        }

        exports["runInContext"] = runInContext;
        return exports;
      }

      if (freeExports && !isLoader) {
        // Export for CommonJS environments.
        runInContext(root, freeExports);
      } else {
        // Export for web browsers and JavaScript engines.
        var nativeJSON = root.JSON,
            previousJSON = root["JSON3"],
            isRestored = false;

        var JSON3 = runInContext(root, (root["JSON3"] = {
          // Public: Restores the original value of the global `JSON` object and
          // returns a reference to the `JSON3` object.
          "noConflict": function () {
            if (!isRestored) {
              isRestored = true;
              root.JSON = nativeJSON;
              root["JSON3"] = previousJSON;
              nativeJSON = previousJSON = null;
            }
            return JSON3;
          }
        }));

        root.JSON = {
          "parse": JSON3.parse,
          "stringify": JSON3.stringify
        };
      }

      // Export for asynchronous module loaders.
      if (isLoader) {
        define(function () {
          return JSON3;
        });
      }
    }).call(this);

    }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    },{}],83:[function(require,module,exports){
    /**
     * Module dependencies
     */

    var debug = require('debug')('jsonp');

    /**
     * Module exports.
     */

    module.exports = jsonp;

    /**
     * Callback index.
     */

    var count = 0;

    /**
     * Noop function.
     */

    function noop(){}

    /**
     * JSONP handler
     *
     * Options:
     *  - param {String} qs parameter (`callback`)
     *  - prefix {String} qs parameter (`__jp`)
     *  - name {String} qs parameter (`prefix` + incr)
     *  - timeout {Number} how long after a timeout error is emitted (`60000`)
     *
     * @param {String} url
     * @param {Object|Function} optional options / callback
     * @param {Function} optional callback
     */

    function jsonp(url, opts, fn){
      if ('function' == typeof opts) {
        fn = opts;
        opts = {};
      }
      if (!opts) opts = {};

      var prefix = opts.prefix || '__jp';

      // use the callback name that was passed if one was provided.
      // otherwise generate a unique name by incrementing our counter.
      var id = opts.name || (prefix + (count++));

      var param = opts.param || 'callback';
      var timeout = null != opts.timeout ? opts.timeout : 60000;
      var enc = encodeURIComponent;
      var target = document.getElementsByTagName('script')[0] || document.head;
      var script;
      var timer;


      if (timeout) {
        timer = setTimeout(function(){
          cleanup();
          if (fn) fn(new Error('Timeout'));
        }, timeout);
      }

      function cleanup(){
        if (script.parentNode) script.parentNode.removeChild(script);
        window[id] = noop;
        if (timer) clearTimeout(timer);
      }

      function cancel(){
        if (window[id]) {
          cleanup();
        }
      }

      window[id] = function(data){
        debug('jsonp got', data);
        cleanup();
        if (fn) fn(null, data);
      };

      // add qs component
      url += (~url.indexOf('?') ? '&' : '?') + param + '=' + enc(id);
      url = url.replace('?&', '?');

      debug('jsonp req "%s"', url);

      // create script
      script = document.createElement('script');
      script.src = url;
      target.parentNode.insertBefore(script, target);

      return cancel;
    }

    },{"debug":84}],84:[function(require,module,exports){
    arguments[4][35][0].apply(exports,arguments)
    },{"./debug":85,"_process":94,"dup":35}],85:[function(require,module,exports){
    arguments[4][36][0].apply(exports,arguments)
    },{"dup":36,"ms":87}],86:[function(require,module,exports){
    /**
     * Module dependencies.
     */

    var is = require('is');
    var onload = require('script-onload');
    var tick = require('next-tick');

    /**
     * Expose `loadScript`.
     *
     * @param {Object} options
     * @param {Function} fn
     * @api public
     */

    module.exports = function loadIframe(options, fn){
      if (!options) throw new Error('Cant load nothing...');

      // Allow for the simplest case, just passing a `src` string.
      if (is.string(options)) options = { src : options };

      var https = document.location.protocol === 'https:' ||
                  document.location.protocol === 'chrome-extension:';

      // If you use protocol relative URLs, third-party scripts like Google
      // Analytics break when testing with `file:` so this fixes that.
      if (options.src && options.src.indexOf('//') === 0) {
        options.src = https ? 'https:' + options.src : 'http:' + options.src;
      }

      // Allow them to pass in different URLs depending on the protocol.
      if (https && options.https) options.src = options.https;
      else if (!https && options.http) options.src = options.http;

      // Make the `<iframe>` element and insert it before the first iframe on the
      // page, which is guaranteed to exist since this Javaiframe is running.
      var iframe = document.createElement('iframe');
      iframe.src = options.src;
      iframe.width = options.width || 1;
      iframe.height = options.height || 1;
      iframe.style.display = 'none';

      // If we have a fn, attach event handlers, even in IE. Based off of
      // the Third-Party Javascript script loading example:
      // https://github.com/thirdpartyjs/thirdpartyjs-code/blob/master/examples/templates/02/loading-files/index.html
      if (is.fn(fn)) {
        onload(iframe, fn);
      }

      tick(function(){
        // Append after event listeners are attached for IE.
        var firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(iframe, firstScript);
      });

      // Return the iframe element in case they want to do anything special, like
      // give it an ID or attributes.
      return iframe;
    };

    },{"is":81,"next-tick":92,"script-onload":95}],87:[function(require,module,exports){
    /**
     * Helpers.
     */

    var s = 1000;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var y = d * 365.25;

    /**
     * Parse or format the given `val`.
     *
     * Options:
     *
     *  - `long` verbose formatting [false]
     *
     * @param {String|Number} val
     * @param {Object} [options]
     * @throws {Error} throw an error if val is not a non-empty string or a number
     * @return {String|Number}
     * @api public
     */

    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === 'string' && val.length > 0) {
        return parse(val);
      } else if (type === 'number' && isNaN(val) === false) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        'val is not a non-empty string or a valid number. val=' +
          JSON.stringify(val)
      );
    };

    /**
     * Parse the given `str` and return milliseconds.
     *
     * @param {String} str
     * @return {Number}
     * @api private
     */

    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || 'ms').toLowerCase();
      switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
          return n * y;
        case 'days':
        case 'day':
        case 'd':
          return n * d;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
          return n * h;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
          return n * m;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
          return n * s;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
          return n;
        default:
          return undefined;
      }
    }

    /**
     * Short format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function fmtShort(ms) {
      if (ms >= d) {
        return Math.round(ms / d) + 'd';
      }
      if (ms >= h) {
        return Math.round(ms / h) + 'h';
      }
      if (ms >= m) {
        return Math.round(ms / m) + 'm';
      }
      if (ms >= s) {
        return Math.round(ms / s) + 's';
      }
      return ms + 'ms';
    }

    /**
     * Long format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function fmtLong(ms) {
      return plural(ms, d, 'day') ||
        plural(ms, h, 'hour') ||
        plural(ms, m, 'minute') ||
        plural(ms, s, 'second') ||
        ms + ' ms';
    }

    /**
     * Pluralization helper.
     */

    function plural(ms, n, name) {
      if (ms < n) {
        return;
      }
      if (ms < n * 1.5) {
        return Math.floor(ms / n) + ' ' + name;
      }
      return Math.ceil(ms / n) + ' ' + name + 's';
    }

    },{}],88:[function(require,module,exports){
    'use strict';

    var is = require('is');
    var isodate = require('@segment/isodate');
    var milliseconds = require('./milliseconds');
    var seconds = require('./seconds');

    /**
     * Returns a new Javascript Date object, allowing a variety of extra input types
     * over the native Date constructor.
     *
     * @param {Date|string|number} val
     */
    module.exports = function newDate(val) {
      if (is.date(val)) return val;
      if (is.number(val)) return new Date(toMs(val));

      // date strings
      if (isodate.is(val)) {
        return isodate.parse(val);
      }
      if (milliseconds.is(val)) {
        return milliseconds.parse(val);
      }
      if (seconds.is(val)) {
        return seconds.parse(val);
      }

      // fallback to Date.parse
      return new Date(val);
    };


    /**
     * If the number passed val is seconds from the epoch, turn it into milliseconds.
     * Milliseconds would be greater than 31557600000 (December 31, 1970).
     *
     * @param {number} num
     */
    function toMs(num) {
      if (num < 31557600000) return num * 1000;
      return num;
    }

    },{"./milliseconds":89,"./seconds":90,"@segment/isodate":91,"is":81}],89:[function(require,module,exports){
    'use strict';

    /**
     * Matcher.
     */

    var matcher = /\d{13}/;


    /**
     * Check whether a string is a millisecond date string.
     *
     * @param {string} string
     * @return {boolean}
     */
    exports.is = function(string) {
      return matcher.test(string);
    };


    /**
     * Convert a millisecond string to a date.
     *
     * @param {string} millis
     * @return {Date}
     */
    exports.parse = function(millis) {
      millis = parseInt(millis, 10);
      return new Date(millis);
    };

    },{}],90:[function(require,module,exports){
    'use strict';

    /**
     * Matcher.
     */

    var matcher = /\d{10}/;


    /**
     * Check whether a string is a second date string.
     *
     * @param {string} string
     * @return {Boolean}
     */
    exports.is = function(string) {
      return matcher.test(string);
    };


    /**
     * Convert a second string to a date.
     *
     * @param {string} seconds
     * @return {Date}
     */
    exports.parse = function(seconds) {
      var millis = parseInt(seconds, 10) * 1000;
      return new Date(millis);
    };

    },{}],91:[function(require,module,exports){
    'use strict';

    /**
     * Matcher, slightly modified from:
     *
     * https://github.com/csnover/js-iso8601/blob/lax/iso8601.js
     */

    var matcher = /^(\d{4})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:([ T])(\d{2}):?(\d{2})(?::?(\d{2})(?:[,\.](\d{1,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?)?)?$/;

    /**
     * Convert an ISO date string to a date. Fallback to native `Date.parse`.
     *
     * https://github.com/csnover/js-iso8601/blob/lax/iso8601.js
     *
     * @param {String} iso
     * @return {Date}
     */

    exports.parse = function(iso) {
      var numericKeys = [1, 5, 6, 7, 11, 12];
      var arr = matcher.exec(iso);
      var offset = 0;

      // fallback to native parsing
      if (!arr) {
        return new Date(iso);
      }

      /* eslint-disable no-cond-assign */
      // remove undefined values
      for (var i = 0, val; val = numericKeys[i]; i++) {
        arr[val] = parseInt(arr[val], 10) || 0;
      }
      /* eslint-enable no-cond-assign */

      // allow undefined days and months
      arr[2] = parseInt(arr[2], 10) || 1;
      arr[3] = parseInt(arr[3], 10) || 1;

      // month is 0-11
      arr[2]--;

      // allow abitrary sub-second precision
      arr[8] = arr[8] ? (arr[8] + '00').substring(0, 3) : 0;

      // apply timezone if one exists
      if (arr[4] === ' ') {
        offset = new Date().getTimezoneOffset();
      } else if (arr[9] !== 'Z' && arr[10]) {
        offset = arr[11] * 60 + arr[12];
        if (arr[10] === '+') {
          offset = 0 - offset;
        }
      }

      var millis = Date.UTC(arr[1], arr[2], arr[3], arr[5], arr[6] + offset, arr[7], arr[8]);
      return new Date(millis);
    };


    /**
     * Checks whether a `string` is an ISO date string. `strict` mode requires that
     * the date string at least have a year, month and date.
     *
     * @param {String} string
     * @param {Boolean} strict
     * @return {Boolean}
     */

    exports.is = function(string, strict) {
      if (strict && (/^\d{4}-\d{2}-\d{2}/).test(string) === false) {
        return false;
      }
      return matcher.test(string);
    };

    },{}],92:[function(require,module,exports){
    (function (process,setImmediate){
    'use strict';

    var callable, byObserver;

    callable = function (fn) {
      if (typeof fn !== 'function') throw new TypeError(fn + " is not a function");
      return fn;
    };

    byObserver = function (Observer) {
      var node = document.createTextNode(''), queue, i = 0;
      new Observer(function () {
        var data;
        if (!queue) return;
        data = queue;
        queue = null;
        if (typeof data === 'function') {
          data();
          return;
        }
        data.forEach(function (fn) { fn(); });
      }).observe(node, { characterData: true });
      return function (fn) {
        callable(fn);
        if (queue) {
          if (typeof queue === 'function') queue = [queue, fn];
          else queue.push(fn);
          return;
        }
        queue = fn;
        node.data = (i = ++i % 2);
      };
    };

    module.exports = (function () {
      // Node.js
      if ((typeof process !== 'undefined') && process &&
          (typeof process.nextTick === 'function')) {
        return process.nextTick;
      }

      // MutationObserver=
      if ((typeof document === 'object') && document) {
        if (typeof MutationObserver === 'function') {
          return byObserver(MutationObserver);
        }
        if (typeof WebKitMutationObserver === 'function') {
          return byObserver(WebKitMutationObserver);
        }
      }

      // W3C Draft
      // http://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html
      if (typeof setImmediate === 'function') {
        return function (cb) { setImmediate(callable(cb)); };
      }

      // Wide available standard
      if (typeof setTimeout === 'function') {
        return function (cb) { setTimeout(callable(cb), 0); };
      }

      return null;
    }());

    }).call(this,require('_process'),require("timers").setImmediate)
    },{"_process":94,"timers":110}],93:[function(require,module,exports){

    var identity = function(_){ return _; };


    /**
     * Module exports, export
     */

    module.exports = multiple(find);
    module.exports.find = module.exports;


    /**
     * Export the replacement function, return the modified object
     */

    module.exports.replace = function (obj, key, val, options) {
      multiple(replace).call(this, obj, key, val, options);
      return obj;
    };


    /**
     * Export the delete function, return the modified object
     */

    module.exports.del = function (obj, key, options) {
      multiple(del).call(this, obj, key, null, options);
      return obj;
    };


    /**
     * Compose applying the function to a nested key
     */

    function multiple (fn) {
      return function (obj, path, val, options) {
        normalize = options && isFunction(options.normalizer) ? options.normalizer : defaultNormalize;
        path = normalize(path);

        var key;
        var finished = false;

        while (!finished) loop();

        function loop() {
          for (key in obj) {
            var normalizedKey = normalize(key);
            if (0 === path.indexOf(normalizedKey)) {
              var temp = path.substr(normalizedKey.length);
              if (temp.charAt(0) === '.' || temp.length === 0) {
                path = temp.substr(1);
                var child = obj[key];

                // we're at the end and there is nothing.
                if (null == child) {
                  finished = true;
                  return;
                }

                // we're at the end and there is something.
                if (!path.length) {
                  finished = true;
                  return;
                }

                // step into child
                obj = child;

                // but we're done here
                return;
              }
            }
          }

          key = undefined;
          // if we found no matching properties
          // on the current object, there's no match.
          finished = true;
        }

        if (!key) return;
        if (null == obj) return obj;

        // the `obj` and `key` is one above the leaf object and key, so
        // start object: { a: { 'b.c': 10 } }
        // end object: { 'b.c': 10 }
        // end key: 'b.c'
        // this way, you can do `obj[key]` and get `10`.
        return fn(obj, key, val);
      };
    }


    /**
     * Find an object by its key
     *
     * find({ first_name : 'Calvin' }, 'firstName')
     */

    function find (obj, key) {
      if (obj.hasOwnProperty(key)) return obj[key];
    }


    /**
     * Delete a value for a given key
     *
     * del({ a : 'b', x : 'y' }, 'X' }) -> { a : 'b' }
     */

    function del (obj, key) {
      if (obj.hasOwnProperty(key)) delete obj[key];
      return obj;
    }


    /**
     * Replace an objects existing value with a new one
     *
     * replace({ a : 'b' }, 'a', 'c') -> { a : 'c' }
     */

    function replace (obj, key, val) {
      if (obj.hasOwnProperty(key)) obj[key] = val;
      return obj;
    }

    /**
     * Normalize a `dot.separated.path`.
     *
     * A.HELL(!*&#(!)O_WOR   LD.bar => ahelloworldbar
     *
     * @param {String} path
     * @return {String}
     */

    function defaultNormalize(path) {
      return path.replace(/[^a-zA-Z0-9\.]+/g, '').toLowerCase();
    }

    /**
     * Check if a value is a function.
     *
     * @param {*} val
     * @return {boolean} Returns `true` if `val` is a function, otherwise `false`.
     */

    function isFunction(val) {
      return typeof val === 'function';
    }

    },{}],94:[function(require,module,exports){
    // shim for using process in browser
    var process = module.exports = {};

    // cached from whatever global is present so that test runners that stub it
    // don't break things.  But we need to wrap it in a try catch in case it is
    // wrapped in strict mode code which doesn't define any globals.  It's inside a
    // function because try/catches deoptimize in certain engines.

    var cachedSetTimeout;
    var cachedClearTimeout;

    function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
    }
    function defaultClearTimeout () {
        throw new Error('clearTimeout has not been defined');
    }
    (function () {
        try {
            if (typeof setTimeout === 'function') {
                cachedSetTimeout = setTimeout;
            } else {
                cachedSetTimeout = defaultSetTimout;
            }
        } catch (e) {
            cachedSetTimeout = defaultSetTimout;
        }
        try {
            if (typeof clearTimeout === 'function') {
                cachedClearTimeout = clearTimeout;
            } else {
                cachedClearTimeout = defaultClearTimeout;
            }
        } catch (e) {
            cachedClearTimeout = defaultClearTimeout;
        }
    } ())
    function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
            //normal enviroments in sane situations
            return setTimeout(fun, 0);
        }
        // if setTimeout wasn't available but was latter defined
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
            cachedSetTimeout = setTimeout;
            return setTimeout(fun, 0);
        }
        try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedSetTimeout(fun, 0);
        } catch(e){
            try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                return cachedSetTimeout.call(null, fun, 0);
            } catch(e){
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                return cachedSetTimeout.call(this, fun, 0);
            }
        }


    }
    function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
            //normal enviroments in sane situations
            return clearTimeout(marker);
        }
        // if clearTimeout wasn't available but was latter defined
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
            cachedClearTimeout = clearTimeout;
            return clearTimeout(marker);
        }
        try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedClearTimeout(marker);
        } catch (e){
            try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                return cachedClearTimeout.call(null, marker);
            } catch (e){
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                return cachedClearTimeout.call(this, marker);
            }
        }



    }
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;

    function cleanUpNextTick() {
        if (!draining || !currentQueue) {
            return;
        }
        draining = false;
        if (currentQueue.length) {
            queue = currentQueue.concat(queue);
        } else {
            queueIndex = -1;
        }
        if (queue.length) {
            drainQueue();
        }
    }

    function drainQueue() {
        if (draining) {
            return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;

        var len = queue.length;
        while(len) {
            currentQueue = queue;
            queue = [];
            while (++queueIndex < len) {
                if (currentQueue) {
                    currentQueue[queueIndex].run();
                }
            }
            queueIndex = -1;
            len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
    }

    process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
            }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
            runTimeout(drainQueue);
        }
    };

    // v8 likes predictible objects
    function Item(fun, array) {
        this.fun = fun;
        this.array = array;
    }
    Item.prototype.run = function () {
        this.fun.apply(null, this.array);
    };
    process.title = 'browser';
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = ''; // empty string to avoid regexp issues
    process.versions = {};

    function noop() {}

    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.prependListener = noop;
    process.prependOnceListener = noop;

    process.listeners = function (name) { return [] }

    process.binding = function (name) {
        throw new Error('process.binding is not supported');
    };

    process.cwd = function () { return '/' };
    process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
    };
    process.umask = function() { return 0; };

    },{}],95:[function(require,module,exports){

    // https://github.com/thirdpartyjs/thirdpartyjs-code/blob/master/examples/templates/02/loading-files/index.html

    /**
     * Invoke `fn(err)` when the given `el` script loads.
     *
     * @param {Element} el
     * @param {Function} fn
     * @api public
     */

    module.exports = function(el, fn){
      return el.addEventListener
        ? add(el, fn)
        : attach(el, fn);
    };

    /**
     * Add event listener to `el`, `fn()`.
     *
     * @param {Element} el
     * @param {Function} fn
     * @api private
     */

    function add(el, fn){
      el.addEventListener('load', function(_, e){ fn(null, e); }, false);
      el.addEventListener('error', function(e){
        var err = new Error('script error "' + el.src + '"');
        err.event = e;
        fn(err);
      }, false);
    }

    /**
     * Attach event.
     *
     * @param {Element} el
     * @param {Function} fn
     * @api private
     */

    function attach(el, fn){
      el.attachEvent('onreadystatechange', function(e){
        if (!/complete|loaded/.test(el.readyState)) return;
        fn(null, e);
      });
      el.attachEvent('onerror', function(e){
        var err = new Error('failed to load the script "' + el.src + '"');
        err.event = e || window.event;
        fn(err);
      });
    }

    },{}],96:[function(require,module,exports){
    'use strict';

    var get = require('obj-case');

    /**
     * Add address getters to `proto`.
     *
     * @ignore
     * @param {Function} proto
     */
    module.exports = function(proto) {
      proto.zip = trait('postalCode', 'zip');
      proto.country = trait('country');
      proto.street = trait('street');
      proto.state = trait('state');
      proto.city = trait('city');
      proto.region = trait('region');

      function trait(a, b) {
        return function() {
          var traits = this.traits();
          var props = this.properties ? this.properties() : {};

          return get(traits, 'address.' + a)
            || get(traits, a)
            || (b ? get(traits, 'address.' + b) : null)
            || (b ? get(traits, b) : null)
            || get(props, 'address.' + a)
            || get(props, a)
            || (b ? get(props, 'address.' + b) : null)
            || (b ? get(props, b) : null);
        };
      }
    };

    },{"obj-case":93}],97:[function(require,module,exports){
    'use strict';

    var inherit = require('./utils').inherit;
    var Facade = require('./facade');

    /**
     * Initialize a new `Alias` facade with a `dictionary` of arguments.
     *
     * @param {Object} dictionary - The object to wrap.
     * @param {string} [dictionary.from] - The previous ID of the user.
     * @param {string} [dictionary.to] - The new ID of the user.
     * @param {Object} opts - Options about what kind of Facade to create.
     *
     * @augments Facade
     */
    function Alias(dictionary, opts) {
      Facade.call(this, dictionary, opts);
    }

    inherit(Alias, Facade);

    /**
     * Return the type of facade this is. This will always return `"alias"`.
     *
     * @return {string}
     */
    Alias.prototype.action = function() {
      return 'alias';
    };

    /**
     * An alias for {@link Alias#action}.
     *
     * @function
     * @return {string}
     */
    Alias.prototype.type = Alias.prototype.action;

    /**
     * Get the user's previous ID from `previousId` or `from`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Alias.prototype.previousId = function() {
      return this.field('previousId') || this.field('from');
    };

    /**
     * An alias for {@link Alias#previousId}.
     *
     * @function
     * @return {string}
     */
    Alias.prototype.from = Alias.prototype.previousId;

    /**
     * Get the user's new ID from `userId` or `to`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Alias.prototype.userId = function() {
      return this.field('userId') || this.field('to');
    };

    /**
     * An alias for {@link Alias#userId}.
     *
     * @function
     * @return {string}
     */
    Alias.prototype.to = Alias.prototype.userId;

    module.exports = Alias;

    },{"./facade":99,"./utils":107}],98:[function(require,module,exports){
    'use strict';

    var inherit = require('./utils').inherit;
    var Facade = require('./facade');

    /**
     * Initialize a new `Delete` facade with a `dictionary` of arguments.
     *
     * @param {Object} dictionary - The object to wrap.
     * @param {string} [dictionary.category] - The delete category.
     * @param {string} [dictionary.name] - The delete name.
     * @param {string} [dictionary.properties] - The delete properties.
     * @param {Object} opts - Options about what kind of Facade to create.
     *
     * @augments Facade
     */
    function Delete(dictionary, opts) {
      Facade.call(this, dictionary, opts);
    }

    inherit(Delete, Facade);

    /**
     * Return the type of facade this is. This will always return `"delete"`.
     *
     * @return {string}
     */
    Delete.prototype.type = function() {
      return 'delete';
    };

    module.exports = Delete;

    },{"./facade":99,"./utils":107}],99:[function(require,module,exports){
    'use strict';

    var address = require('./address');
    var clone = require('./utils').clone;
    var isEnabled = require('./is-enabled');
    var newDate = require('new-date');
    var objCase = require('obj-case');
    var traverse = require('@segment/isodate-traverse');
    var type = require('./utils').type;

    /**
     * A *Facade* is an object meant for creating convience wrappers around
     * objects. When developing integrations, you probably want to look at its
     * subclasses, such as {@link Track} or {@link Identify}, rather than this
     * general-purpose class.
     *
     * This constructor will initialize a new `Facade` with an `obj` of arguments.
     *
     * If the inputted `obj` doesn't have a `timestamp` property, one will be added
     * with the value `new Date()`. Otherwise, the `timestamp` property will be
     * converted to a Date using the `new-date` package.
     *
     * By default, the inputted object will be defensively copied, and all ISO
     * strings present in the string will be converted into Dates.
     *
     * @param {Object} obj - The object to wrap.
     * @param {Object} opts - Options about what kind of Facade to create.
     * @param {boolean} [opts.clone=true] - Whether to make defensive clones. If enabled,
     * the inputted object will be cloned, and any objects derived from this facade
     * will be cloned before being returned.
     * @param {boolean} [opts.traverse=true] - Whether to perform ISODate-Traverse
     * on the inputted object.
     *
     * @see {@link https://github.com/segmentio/new-date|new-date}
     * @see {@link https://github.com/segmentio/isodate-traverse|isodate-traverse}
     */
    function Facade(obj, opts) {
      opts = opts || {};
      if (!('clone' in opts)) opts.clone = true;
      if (opts.clone) obj = clone(obj);
      if (!('traverse' in opts)) opts.traverse = true;
      if (!('timestamp' in obj)) obj.timestamp = new Date();
      else obj.timestamp = newDate(obj.timestamp);
      if (opts.traverse) traverse(obj);
      this.opts = opts;
      this.obj = obj;
    }

    /**
     * Get a potentially-nested field in this facade. `field` should be a
     * period-separated sequence of properties.
     *
     * If the first field passed in points to a function (e.g. the `field` passed
     * in is `a.b.c` and this facade's `obj.a` is a function), then that function
     * will be called, and then the deeper fields will be fetched (using obj-case)
     * from what that function returns. If the first field isn't a function, then
     * this function works just like obj-case.
     *
     * Because this function uses obj-case, the camel- or snake-case of the input
     * is irrelevant.
     *
     * @example
     * YourClass.prototype.height = function() {
     *   return this.proxy('getDimensions.height') ||
     *     this.proxy('props.size.side_length');
     * }
     * @param {string} field - A sequence of properties, joined by periods (`.`).
     * @return {*} - A property of the inputted object.
     * @see {@link https://github.com/segmentio/obj-case|obj-case}
     */
    Facade.prototype.proxy = function(field) {
      var fields = field.split('.');
      field = fields.shift();

      // Call a function at the beginning to take advantage of facaded fields
      var obj = this[field] || this.field(field);
      if (!obj) return obj;
      if (typeof obj === 'function') obj = obj.call(this) || {};
      if (fields.length === 0) return this.opts.clone ? transform(obj) : obj;

      obj = objCase(obj, fields.join('.'));
      return this.opts.clone ? transform(obj) : obj;
    };

    /**
     * Directly access a specific `field` from the underlying object. Only
     * "top-level" fields will work with this function. "Nested" fields *will not
     * work* with this function.
     *
     * @param {string} field
     * @return {*}
     */
    Facade.prototype.field = function(field) {
      var obj = this.obj[field];
      return this.opts.clone ? transform(obj) : obj;
    };

    /**
     * Utility method to always proxy a particular `field`. In other words, it
     * returns a function that will always return `this.proxy(field)`.
     *
     * @example
     * MyClass.prototype.height = Facade.proxy('options.dimensions.height');
     *
     * @param {string} field
     * @return {Function}
     */
    Facade.proxy = function(field) {
      return function() {
        return this.proxy(field);
      };
    };

    /**
     * Utility method to always access a `field`. In other words, it returns a
     * function that will always return `this.field(field)`.
     *
     * @param {string} field
     * @return {Function}
     */
    Facade.field = function(field) {
      return function() {
        return this.field(field);
      };
    };

    /**
     * Create a helper function for fetching a "plural" thing.
     *
     * The generated method will take the inputted `path` and append an "s" to it
     * and calls `this.proxy` with this "pluralized" path. If that produces an
     * array, that will be returned. Otherwise, a one-element array containing
     * `this.proxy(path)` will be returned.
     *
     * @example
     * MyClass.prototype.birds = Facade.multi('animals.bird');
     *
     * @param {string} path
     * @return {Function}
     */
    Facade.multi = function(path) {
      return function() {
        var multi = this.proxy(path + 's');
        if (type(multi) === 'array') return multi;
        var one = this.proxy(path);
        if (one) one = [this.opts.clone ? clone(one) : one];
        return one || [];
      };
    };

    /**
     * Create a helper function for getting a "singular" thing.
     *
     * The generated method will take the inputted path and call
     * `this.proxy(path)`. If a truthy thing is produced, it will be returned.
     * Otherwise, `this.proxy(path + 's')` will be called, and if that produces an
     * array the first element of that array will be returned. Otherwise,
     * `undefined` is returned.
     *
     * @example
     * MyClass.prototype.bird = Facade.one('animals.bird');
     *
     * @param {string} path
     * @return {Function}
     */
    Facade.one = function(path) {
      return function() {
        var one = this.proxy(path);
        if (one) return one;
        var multi = this.proxy(path + 's');
        if (type(multi) === 'array') return multi[0];
      };
    };

    /**
     * Gets the underlying object this facade wraps around.
     *
     * If this facade has a property `type`, it will be invoked as a function and
     * will be assigned as the property `type` of the outputted object.
     *
     * @return {Object}
     */
    Facade.prototype.json = function() {
      var ret = this.opts.clone ? clone(this.obj) : this.obj;
      if (this.type) ret.type = this.type();
      return ret;
    };

    /**
     * Get the options of a call. If an integration is passed, only the options for
     * that integration are included. If the integration is not enabled, then
     * `undefined` is returned.
     *
     * Options are taken from the `options` property of the underlying object,
     * falling back to the object's `context` or simply `{}`.
     *
     * @param {string} integration - The name of the integration to get settings
     * for. Casing does not matter.
     * @return {Object|undefined}
     */
    Facade.prototype.options = function(integration) {
      var obj = this.obj.options || this.obj.context || {};
      var options = this.opts.clone ? clone(obj) : obj;
      if (!integration) return options;
      if (!this.enabled(integration)) return;
      var integrations = this.integrations();
      var value = integrations[integration] || objCase(integrations, integration);
      if (typeof value !== 'object') value = objCase(this.options(), integration);
      return typeof value === 'object' ? value : {};
    };

    /**
     * An alias for {@link Facade#options}.
     */
    Facade.prototype.context = Facade.prototype.options;

    /**
     * Check whether an integration is enabled.
     *
     * Basically, this method checks whether this integration is explicitly
     * enabled. If it isn'texplicitly mentioned, it checks whether it has been
     * enabled at the global level. Some integrations (e.g. Salesforce), cannot
     * enabled by these global event settings.
     *
     * More concretely, the deciding factors here are:
     *
     * 1. If `this.integrations()` has the integration set to `true`, return `true`.
     * 2. If `this.integrations().providers` has the integration set to `true`, return `true`.
     * 3. If integrations are set to default-disabled via global parameters (i.e.
     * `options.providers.all`, `options.all`, or `integrations.all`), then return
     * false.
     * 4. If the integration is one of the special default-deny integrations
     * (currently, only Salesforce), then return false.
     * 5. Else, return true.
     *
     * @param {string} integration
     * @return {boolean}
     */
    Facade.prototype.enabled = function(integration) {
      var allEnabled = this.proxy('options.providers.all');
      if (typeof allEnabled !== 'boolean') allEnabled = this.proxy('options.all');
      if (typeof allEnabled !== 'boolean') allEnabled = this.proxy('integrations.all');
      if (typeof allEnabled !== 'boolean') allEnabled = true;

      var enabled = allEnabled && isEnabled(integration);
      var options = this.integrations();

      // If the integration is explicitly enabled or disabled, use that
      // First, check options.providers for backwards compatibility
      if (options.providers && options.providers.hasOwnProperty(integration)) {
        enabled = options.providers[integration];
      }

      // Next, check for the integration's existence in 'options' to enable it.
      // If the settings are a boolean, use that, otherwise it should be enabled.
      if (options.hasOwnProperty(integration)) {
        var settings = options[integration];
        if (typeof settings === 'boolean') {
          enabled = settings;
        } else {
          enabled = true;
        }
      }

      return !!enabled;
    };

    /**
     * Get all `integration` options.
     *
     * @ignore
     * @param {string} integration
     * @return {Object}
     */
    Facade.prototype.integrations = function() {
      return this.obj.integrations || this.proxy('options.providers') || this.options();
    };

    /**
     * Check whether the user is active.
     *
     * @return {boolean}
     */
    Facade.prototype.active = function() {
      var active = this.proxy('options.active');
      if (active === null || active === undefined) active = true;
      return active;
    };

    /**
     * Get `sessionId / anonymousId`.
     *
     * @return {*}
     */
    Facade.prototype.anonymousId = function() {
      return this.field('anonymousId') || this.field('sessionId');
    };

    /**
     * An alias for {@link Facade#anonymousId}.
     *
     * @function
     * @return {string}
     */
    Facade.prototype.sessionId = Facade.prototype.anonymousId;

    /**
     * Get `groupId` from `context.groupId`.
     *
     * @function
     * @return {string}
     */
    Facade.prototype.groupId = Facade.proxy('options.groupId');

    /**
     * Get the call's "traits". All event types can pass in traits, though {@link
     * Identify} and {@link Group} override this implementation.
     *
     * Traits are gotten from `options.traits`, augmented with a property `id` with
     * the event's `userId`.
     *
     * The parameter `aliases` is meant to transform keys in `options.traits` into
     * new keys. Each alias like `{ "xxx": "yyy" }` will take whatever is at `xxx`
     * in the traits, and move it to `yyy`. If `xxx` is a method of this facade,
     * it'll be called as a function instead of treated as a key into the traits.
     *
     * @example
     * var obj = { options: { traits: { foo: "bar" } }, anonymousId: "xxx" }
     * var facade = new Facade(obj)
     *
     * facade.traits() // { "foo": "bar" }
     * facade.traits({ "foo": "asdf" }) // { "asdf": "bar" }
     * facade.traits({ "sessionId": "rofl" }) // { "rofl": "xxx" }
     *
     * @param {Object} aliases - A mapping from keys to the new keys they should be
     * transformed to.
     * @return {Object}
     */
    Facade.prototype.traits = function(aliases) {
      var ret = this.proxy('options.traits') || {};
      var id = this.userId();
      aliases = aliases || {};

      if (id) ret.id = id;

      for (var alias in aliases) {
        var value = this[alias] == null ? this.proxy('options.traits.' + alias) : this[alias]();
        if (value == null) continue;
        ret[aliases[alias]] = value;
        delete ret[alias];
      }

      return ret;
    };

    /**
     * The library and version of the client used to produce the message.
     *
     * If the library name cannot be determined, it is set to `"unknown"`. If the
     * version cannot be determined, it is set to `null`.
     *
     * @return {{name: string, version: string}}
     */
    Facade.prototype.library = function() {
      var library = this.proxy('options.library');
      if (!library) return { name: 'unknown', version: null };
      if (typeof library === 'string') return { name: library, version: null };
      return library;
    };

    /**
     * Return the device information, falling back to an empty object.
     *
     * Interesting values of `type` are `"ios"` and `"android"`, but other values
     * are possible if the client is doing something unusual with `context.device`.
     *
     * @return {{type: string}}
     */
    Facade.prototype.device = function() {
      var device = this.proxy('context.device');
      if (type(device) !== 'object') device = {};
      var library = this.library().name;
      if (device.type) return device;

      if (library.indexOf('ios') > -1) device.type = 'ios';
      if (library.indexOf('android') > -1) device.type = 'android';
      return device;
    };

    /**
     * Get the User-Agent from `context.userAgent`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return string
     */
    Facade.prototype.userAgent = Facade.proxy('context.userAgent');

    /**
     * Get the timezone from `context.timezone`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return string
     */
    Facade.prototype.timezone = Facade.proxy('context.timezone');

    /**
     * Get the timestamp from `context.timestamp`.
     *
     * @function
     * @return string
     */
    Facade.prototype.timestamp = Facade.field('timestamp');

    /**
     * Get the channel from `channel`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return string
     */
    Facade.prototype.channel = Facade.field('channel');

    /**
     * Get the IP address from `context.ip`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return string
     */
    Facade.prototype.ip = Facade.proxy('context.ip');

    /**
     * Get the user ID from `userId`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return string
     */
    Facade.prototype.userId = Facade.field('userId');

    /**
     * Get the ZIP/Postal code from `traits`, `traits.address`, `properties`, or
     * `properties.address`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @name zip
     * @function
     * @memberof Facade.prototype
     * @return {string}
     */

    /**
     * Get the country from `traits`, `traits.address`, `properties`, or
     * `properties.address`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @name country
     * @function
     * @memberof Facade.prototype
     * @return {string}
     */

    /**
     * Get the street from `traits`, `traits.address`, `properties`, or
     * `properties.address`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @name street
     * @function
     * @memberof Facade.prototype
     * @return {string}
     */

    /**
     * Get the state from `traits`, `traits.address`, `properties`, or
     * `properties.address`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @name state
     * @function
     * @memberof Facade.prototype
     * @return {string}
     */

    /**
     * Get the city from `traits`, `traits.address`, `properties`, or
     * `properties.address`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @name city
     * @function
     * @memberof Facade.prototype
     * @return {string}
     */

    /**
     * Get the region from `traits`, `traits.address`, `properties`, or
     * `properties.address`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @name region
     * @function
     * @memberof Facade.prototype
     * @return {string}
     */

    address(Facade.prototype);

    /**
     * Return the cloned and traversed object
     *
     * @ignore
     * @param {*} obj
     * @return {*}
     */
    function transform(obj) {
      return clone(obj);
    }

    module.exports = Facade;

    },{"./address":96,"./is-enabled":103,"./utils":107,"@segment/isodate-traverse":41,"new-date":88,"obj-case":93}],100:[function(require,module,exports){
    'use strict';

    var inherit = require('./utils').inherit;
    var isEmail = require('is-email');
    var newDate = require('new-date');
    var Facade = require('./facade');

    /**
     * Initialize a new `Group` facade with a `dictionary` of arguments.
     *
     * @param {Object} dictionary - The object to wrap.
     * @param {string} [dictionary.userId] - The user to add to the group.
     * @param {string} [dictionary.groupId] - The ID of the group.
     * @param {Object} [dictionary.traits] - The traits of the group.
     * @param {Object} opts - Options about what kind of Facade to create.
     *
     * @augments Facade
     */
    function Group(dictionary, opts) {
      Facade.call(this, dictionary, opts);
    }

    inherit(Group, Facade);

    /**
     * Return the type of facade this is. This will always return `"group"`.
     *
     * @return {string}
     */
    Group.prototype.action = function() {
      return 'group';
    };

    /**
     * An alias for {@link Group#action}.
     *
     * @function
     * @return {string}
     */
    Group.prototype.type = Group.prototype.action;

    /**
     * Get the group ID from `groupId`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Group.prototype.groupId = Facade.field('groupId');

    /**
     * Get the time of creation of the group from `traits.createdAt`,
     * `traits.created`, `properties.createdAt`, or `properties.created`.
     *
     * @return {Date}
     */
    Group.prototype.created = function() {
      var created = this.proxy('traits.createdAt')
        || this.proxy('traits.created')
        || this.proxy('properties.createdAt')
        || this.proxy('properties.created');

      if (created) return newDate(created);
    };

    /**
     * Get the group's email from `traits.email`, falling back to `groupId` only if
     * it looks like a valid email.
     *
     * @return {string}
     */
    Group.prototype.email = function() {
      var email = this.proxy('traits.email');
      if (email) return email;
      var groupId = this.groupId();
      if (isEmail(groupId)) return groupId;
    };

    /**
     * Get the group's traits. This is identical to how {@link Facade#traits}
     * works, except it looks at `traits.*` instead of `options.traits.*`.
     *
     * Traits are gotten from `traits`, augmented with a property `id` with
     * the event's `groupId`.
     *
     * The parameter `aliases` is meant to transform keys in `traits` into new
     * keys. Each alias like `{ "xxx": "yyy" }` will take whatever is at `xxx` in
     * the traits, and move it to `yyy`. If `xxx` is a method of this facade, it'll
     * be called as a function instead of treated as a key into the traits.
     *
     * @example
     * var obj = { traits: { foo: "bar" }, anonymousId: "xxx" }
     * var group = new Group(obj)
     *
     * group.traits() // { "foo": "bar" }
     * group.traits({ "foo": "asdf" }) // { "asdf": "bar" }
     * group.traits({ "sessionId": "rofl" }) // { "rofl": "xxx" }
     *
     * @param {Object} aliases - A mapping from keys to the new keys they should be
     * transformed to.
     * @return {Object}
     */
    Group.prototype.traits = function(aliases) {
      var ret = this.properties();
      var id = this.groupId();
      aliases = aliases || {};

      if (id) ret.id = id;

      for (var alias in aliases) {
        var value = this[alias] == null ? this.proxy('traits.' + alias) : this[alias]();
        if (value == null) continue;
        ret[aliases[alias]] = value;
        delete ret[alias];
      }

      return ret;
    };

    /**
     * Get the group's name from `traits.name`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {string}
     */
    Group.prototype.name = Facade.proxy('traits.name');

    /**
     * Get the group's industry from `traits.industry`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {string}
     */
    Group.prototype.industry = Facade.proxy('traits.industry');

    /**
     * Get the group's employee count from `traits.employees`.
     *
     * This *should* be a number, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {number}
     */
    Group.prototype.employees = Facade.proxy('traits.employees');

    /**
     * Get the group's properties from `traits` or `properties`, falling back to
     * simply an empty object.
     *
     * @return {Object}
     */
    Group.prototype.properties = function() {
      // TODO remove this function
      return this.field('traits') || this.field('properties') || {};
    };

    module.exports = Group;

    },{"./facade":99,"./utils":107,"is-email":80,"new-date":88}],101:[function(require,module,exports){
    'use strict';

    var Facade = require('./facade');
    var get = require('obj-case');
    var inherit = require('./utils').inherit;
    var isEmail = require('is-email');
    var newDate = require('new-date');
    var trim = require('trim');
    var type = require('./utils').type;

    /**
     * Initialize a new `Identify` facade with a `dictionary` of arguments.
     *
     * @param {Object} dictionary - The object to wrap.
     * @param {string} [dictionary.userId] - The ID of the user.
     * @param {string} [dictionary.anonymousId] - The anonymous ID of the user.
     * @param {string} [dictionary.traits] - The user's traits.
     * @param {Object} opts - Options about what kind of Facade to create.
     *
     * @augments Facade
     */
    function Identify(dictionary, opts) {
      Facade.call(this, dictionary, opts);
    }

    inherit(Identify, Facade);

    /**
     * Return the type of facade this is. This will always return `"identify"`.
     *
     * @return {string}
     */
    Identify.prototype.action = function() {
      return 'identify';
    };

    /**
     * An alias for {@link Identify#action}.
     *
     * @function
     * @return {string}
     */
    Identify.prototype.type = Identify.prototype.action;

    /**
     * Get the user's traits. This is identical to how {@link Facade#traits} works,
     * except it looks at `traits.*` instead of `options.traits.*`.
     *
     * Traits are gotten from `traits`, augmented with a property `id` with
     * the event's `userId`.
     *
     * The parameter `aliases` is meant to transform keys in `traits` into new
     * keys. Each alias like `{ "xxx": "yyy" }` will take whatever is at `xxx` in
     * the traits, and move it to `yyy`. If `xxx` is a method of this facade, it'll
     * be called as a function instead of treated as a key into the traits.
     *
     * @example
     * var obj = { traits: { foo: "bar" }, anonymousId: "xxx" }
     * var identify = new Identify(obj)
     *
     * identify.traits() // { "foo": "bar" }
     * identify.traits({ "foo": "asdf" }) // { "asdf": "bar" }
     * identify.traits({ "sessionId": "rofl" }) // { "rofl": "xxx" }
     *
     * @param {Object} aliases - A mapping from keys to the new keys they should be
     * transformed to.
     * @return {Object}
     */
    Identify.prototype.traits = function(aliases) {
      var ret = this.field('traits') || {};
      var id = this.userId();
      aliases = aliases || {};

      if (id) ret.id = id;

      for (var alias in aliases) {
        var value = this[alias] == null ? this.proxy('traits.' + alias) : this[alias]();
        if (value == null) continue;
        ret[aliases[alias]] = value;
        if (alias !== aliases[alias]) delete ret[alias];
      }

      return ret;
    };

    /**
     * Get the user's email from `traits.email`, falling back to `userId` only if
     * it looks like a valid email.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Identify.prototype.email = function() {
      var email = this.proxy('traits.email');
      if (email) return email;

      var userId = this.userId();
      if (isEmail(userId)) return userId;
    };

    /**
     * Get the time of creation of the user from `traits.created` or
     * `traits.createdAt`.
     *
     * @return {Date}
     */
    Identify.prototype.created = function() {
      var created = this.proxy('traits.created') || this.proxy('traits.createdAt');
      if (created) return newDate(created);
    };

    /**
     * Get the time of creation of the user's company from `traits.company.created`
     * or `traits.company.createdAt`.
     *
     * @return {Date}
     */
    Identify.prototype.companyCreated = function() {
      var created = this.proxy('traits.company.created') || this.proxy('traits.company.createdAt');

      if (created) {
        return newDate(created);
      }
    };

    /**
     * Get the user's company name from `traits.company.name`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Identify.prototype.companyName = function() {
      return this.proxy('traits.company.name');
    };

    /**
     * Get the user's name `traits.name`, falling back to combining {@link
     * Identify#firstName} and {@link Identify#lastName} if possible.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Identify.prototype.name = function() {
      var name = this.proxy('traits.name');
      if (typeof name === 'string') {
        return trim(name);
      }

      var firstName = this.firstName();
      var lastName = this.lastName();
      if (firstName && lastName) {
        return trim(firstName + ' ' + lastName);
      }
    };

    /**
     * Get the user's first name from `traits.firstName`, optionally splitting it
     * out of a the full name if that's all that was provided.
     *
     * Splitting the full name works on the assumption that the full name is of the
     * form "FirstName LastName"; it will not work for non-Western names.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Identify.prototype.firstName = function() {
      var firstName = this.proxy('traits.firstName');
      if (typeof firstName === 'string') {
        return trim(firstName);
      }

      var name = this.proxy('traits.name');
      if (typeof name === 'string') {
        return trim(name).split(' ')[0];
      }
    };

    /**
     * Get the user's last name from `traits.lastName`, optionally splitting it out
     * of a the full name if that's all that was provided.
     *
     * Splitting the full name works on the assumption that the full name is of the
     * form "FirstName LastName"; it will not work for non-Western names.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Identify.prototype.lastName = function() {
      var lastName = this.proxy('traits.lastName');
      if (typeof lastName === 'string') {
        return trim(lastName);
      }

      var name = this.proxy('traits.name');
      if (typeof name !== 'string') {
        return;
      }

      var space = trim(name).indexOf(' ');
      if (space === -1) {
        return;
      }

      return trim(name.substr(space + 1));
    };

    /**
     * Get the user's "unique id" from `userId`, `traits.username`, or
     * `traits.email`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Identify.prototype.uid = function() {
      return this.userId() || this.username() || this.email();
    };

    /**
     * Get the user's description from `traits.description` or `traits.background`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Identify.prototype.description = function() {
      return this.proxy('traits.description') || this.proxy('traits.background');
    };

    /**
     * Get the user's age from `traits.age`, falling back to computing it from
     * `traits.birthday` and the current time.
     *
     * @return {number}
     */
    Identify.prototype.age = function() {
      var date = this.birthday();
      var age = get(this.traits(), 'age');
      if (age != null) return age;
      if (type(date) !== 'date') return;
      var now = new Date();
      return now.getFullYear() - date.getFullYear();
    };

    /**
     * Get the URL of the user's avatar from `traits.avatar`, `traits.photoUrl`, or
     * `traits.avatarUrl`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Identify.prototype.avatar = function() {
      var traits = this.traits();
      return get(traits, 'avatar') || get(traits, 'photoUrl') || get(traits, 'avatarUrl');
    };

    /**
     * Get the user's job position from `traits.position` or `traits.jobTitle`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Identify.prototype.position = function() {
      var traits = this.traits();
      return get(traits, 'position') || get(traits, 'jobTitle');
    };

    /**
     * Get the user's username from `traits.username`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {string}
     */
    Identify.prototype.username = Facade.proxy('traits.username');

    /**
     * Get the user's website from `traits.website`, or if there are multiple in
     * `traits.websites`, return the first one.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {string}
     */
    Identify.prototype.website = Facade.one('traits.website');

    /**
     * Get the user's websites from `traits.websites`, or if there is only one in
     * `traits.website`, then wrap it in an array.
     *
     * This *should* be an array of strings, but may not be if the client isn't
     * adhering to the spec.
     *
     * @function
     * @return {array}
     */
    Identify.prototype.websites = Facade.multi('traits.website');

    /**
     * Get the user's phone number from `traits.phone`, or if there are multiple in
     * `traits.phones`, return the first one.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {string}
     */
    Identify.prototype.phone = Facade.one('traits.phone');

    /**
     * Get the user's phone numbers from `traits.phones`, or if there is only one
     * in `traits.phone`, then wrap it in an array.
     *
     * This *should* be an array of strings, but may not be if the client isn't
     * adhering to the spec.
     *
     * @function
     * @return {array}
     */
    Identify.prototype.phones = Facade.multi('traits.phone');

    /**
     * Get the user's address from `traits.address`.
     *
     * This *should* be an object, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {object}
     */
    Identify.prototype.address = Facade.proxy('traits.address');

    /**
     * Get the user's gender from `traits.gender`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {string}
     */
    Identify.prototype.gender = Facade.proxy('traits.gender');

    /**
     * Get the user's birthday from `traits.birthday`.
     *
     * This *should* be a Date if `opts.traverse` was enabled (it is by default)
     * when constructing this Identify. Otherwise, it should be a string. But it
     * may be neither if the client isn't adhering to the spec.
     * spec.
     *
     * @function
     * @return {object}
     */
    Identify.prototype.birthday = Facade.proxy('traits.birthday');

    module.exports = Identify;

    },{"./facade":99,"./utils":107,"is-email":80,"new-date":88,"obj-case":93,"trim":113}],102:[function(require,module,exports){
    'use strict';

    var Facade = require('./facade');

    Facade.Alias = require('./alias');
    Facade.Group = require('./group');
    Facade.Identify = require('./identify');
    Facade.Track = require('./track');
    Facade.Page = require('./page');
    Facade.Screen = require('./screen');
    Facade.Delete = require('./delete');

    module.exports = Facade;

    },{"./alias":97,"./delete":98,"./facade":99,"./group":100,"./identify":101,"./page":104,"./screen":105,"./track":106}],103:[function(require,module,exports){
    'use strict';

    // A few integrations are disabled by default. They must be explicitly enabled
    // by setting options[Provider] = true.
    var disabled = {
      Salesforce: true
    };

    /**
     * Check whether an integration should be enabled by default.
     *
     * @ignore
     * @param {string} integration
     * @return {boolean}
     */
    module.exports = function(integration) {
      return !disabled[integration];
    };

    },{}],104:[function(require,module,exports){
    'use strict';

    var inherit = require('./utils').inherit;
    var Facade = require('./facade');
    var Track = require('./track');
    var isEmail = require('is-email');

    /**
     * Initialize a new `Page` facade with a `dictionary` of arguments.
     *
     * @param {Object} dictionary - The object to wrap.
     * @param {string} [dictionary.category] - The page category.
     * @param {string} [dictionary.name] - The page name.
     * @param {string} [dictionary.properties] - The page properties.
     * @param {Object} opts - Options about what kind of Facade to create.
     *
     * @augments Facade
     */
    function Page(dictionary, opts) {
      Facade.call(this, dictionary, opts);
    }

    inherit(Page, Facade);

    /**
     * Return the type of facade this is. This will always return `"page"`.
     *
     * @return {string}
     */
    Page.prototype.action = function() {
      return 'page';
    };

    /**
     * An alias for {@link Page#action}.
     *
     * @function
     * @return {string}
     */
    Page.prototype.type = Page.prototype.action;

    /**
     * Get the page category from `category`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Page.prototype.category = Facade.field('category');

    /**
     * Get the page name from `name`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Page.prototype.name = Facade.field('name');

    /**
     * Get the page title from `properties.title`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Page.prototype.title = Facade.proxy('properties.title');

    /**
     * Get the page path from `properties.path`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Page.prototype.path = Facade.proxy('properties.path');

    /**
     * Get the page URL from `properties.url`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Page.prototype.url = Facade.proxy('properties.url');

    /**
     * Get the HTTP referrer from `context.referrer.url`, `context.page.referrer`,
     * or `properties.referrer`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Page.prototype.referrer = function() {
      return this.proxy('context.referrer.url')
        || this.proxy('context.page.referrer')
        || this.proxy('properties.referrer');
    };

    /**
     * Get the page's properties. This is identical to how {@link Facade#traits}
     * works, except it looks at `properties.*` instead of `options.traits.*`.
     *
     * Properties are gotten from `properties`, augmented with the page's `name`
     * and `category`.
     *
     * The parameter `aliases` is meant to transform keys in `properties` into new
     * keys. Each alias like `{ "xxx": "yyy" }` will take whatever is at `xxx` in
     * the traits, and move it to `yyy`. If `xxx` is a method of this facade, it'll
     * be called as a function instead of treated as a key into the traits.
     *
     * @example
     * var obj = { properties: { foo: "bar" }, anonymousId: "xxx" }
     * var page = new Page(obj)
     *
     * page.traits() // { "foo": "bar" }
     * page.traits({ "foo": "asdf" }) // { "asdf": "bar" }
     * page.traits({ "sessionId": "rofl" }) // { "rofl": "xxx" }
     *
     * @param {Object} aliases - A mapping from keys to the new keys they should be
     * transformed to.
     * @return {Object}
     */
    Page.prototype.properties = function(aliases) {
      var props = this.field('properties') || {};
      var category = this.category();
      var name = this.name();
      aliases = aliases || {};

      if (category) props.category = category;
      if (name) props.name = name;

      for (var alias in aliases) {
        var value = this[alias] == null
          ? this.proxy('properties.' + alias)
          : this[alias]();
        if (value == null) continue;
        props[aliases[alias]] = value;
        if (alias !== aliases[alias]) delete props[alias];
      }

      return props;
    };

    /**
     * Get the user's email from `context.traits.email` or `properties.email`,
     * falling back to `userId` if it's a valid email.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Page.prototype.email = function() {
      var email = this.proxy('context.traits.email') || this.proxy('properties.email');
      if (email) return email;

      var userId = this.userId();
      if (isEmail(userId)) return userId;
    };

    /**
     * Get the page fullName. This is `$category $name` if both are present, and
     * just `name` otherwiser.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Page.prototype.fullName = function() {
      var category = this.category();
      var name = this.name();
      return name && category
        ? category + ' ' + name
        : name;
    };

    /**
     * Get an event name from this page call. If `name` is present, this will be
     * `Viewed $name Page`; otherwise, it will be `Loaded a Page`.
     *
     * @param {string} name - The name of this page.
     * @return {string}
     */
    Page.prototype.event = function(name) {
      return name
        ? 'Viewed ' + name + ' Page'
        : 'Loaded a Page';
    };

    /**
     * Convert this Page to a {@link Track} facade. The inputted `name` will be
     * converted to the Track's event name via {@link Page#event}.
     *
     * @param {string} name
     * @return {Track}
     */
    Page.prototype.track = function(name) {
      var json = this.json();
      json.event = this.event(name);
      json.timestamp = this.timestamp();
      json.properties = this.properties();
      return new Track(json, this.opts);
    };

    module.exports = Page;

    },{"./facade":99,"./track":106,"./utils":107,"is-email":80}],105:[function(require,module,exports){
    'use strict';

    var inherit = require('./utils').inherit;
    var Page = require('./page');
    var Track = require('./track');

    /**
     * Initialize a new `Screen` facade with a `dictionary` of arguments.
     *
     * Note that this class extends {@link Page}, so its methods are available to
     * instances of this class as well.
     *
     * @param {Object} dictionary - The object to wrap.
     * @param {string} [dictionary.category] - The page category.
     * @param {string} [dictionary.name] - The page name.
     * @param {string} [dictionary.properties] - The page properties.
     * @param {Object} opts - Options about what kind of Facade to create.
     *
     * @augments Page
     */
    function Screen(dictionary, opts) {
      Page.call(this, dictionary, opts);
    }

    inherit(Screen, Page);

    /**
     * Return the type of facade this is. This will always return `"screen"`.
     *
     * @return {string}
     */
    Screen.prototype.action = function() {
      return 'screen';
    };

    /**
     * An alias for {@link Screen#action}.
     *
     * @function
     * @return {string}
     */
    Screen.prototype.type = Screen.prototype.action;

    /**
     * Get an event name from this screen call. If `name` is present, this will be
     * `Viewed $name Screen`; otherwise, it will be `Loaded a Screen`.
     *
     * @param {string} name - The name of this screen.
     * @return {string}
     */
    Screen.prototype.event = function(name) {
      return name ? 'Viewed ' + name + ' Screen' : 'Loaded a Screen';
    };

    /**
     * Convert this Screen to a {@link Track} facade. The inputted `name` will be
     * converted to the Track's event name via {@link Screen#event}.
     *
     * @param {string} name
     * @return {Track}
     */
    Screen.prototype.track = function(name) {
      var json = this.json();
      json.event = this.event(name);
      json.timestamp = this.timestamp();
      json.properties = this.properties();
      return new Track(json, this.opts);
    };

    module.exports = Screen;

    },{"./page":104,"./track":106,"./utils":107}],106:[function(require,module,exports){
    'use strict';

    var inherit = require('./utils').inherit;
    var type = require('./utils').type;
    var Facade = require('./facade');
    var Identify = require('./identify');
    var isEmail = require('is-email');
    var get = require('obj-case');

    /**
     * Initialize a new `Track` facade with a `dictionary` of arguments.
     *
     * @param {Object} dictionary - The object to wrap.
     * @param {string} [dictionary.event] - The name of the event being tracked.
     * @param {string} [dictionary.userId] - The ID of the user being tracked.
     * @param {string} [dictionary.anonymousId] - The anonymous ID of the user.
     * @param {string} [dictionary.properties] - Properties of the track event.
     * @param {Object} opts - Options about what kind of Facade to create.
     *
     * @augments Facade
     */
    function Track(dictionary, opts) {
      Facade.call(this, dictionary, opts);
    }

    inherit(Track, Facade);

    /**
     * Return the type of facade this is. This will always return `"track"`.
     *
     * @return {string}
     */
    Track.prototype.action = function() {
      return 'track';
    };

    /**
     * An alias for {@link Track#action}.
     *
     * @function
     * @return {string}
     */
    Track.prototype.type = Track.prototype.action;

    /**
     * Get the event name from `event`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {string}
     */
    Track.prototype.event = Facade.field('event');

    /**
     * Get the event value, usually the monetary value, from `properties.value`.
     *
     * This *should* be a number, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {string}
     */
    Track.prototype.value = Facade.proxy('properties.value');

    /**
     * Get the event cateogry from `properties.category`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {string}
     */
    Track.prototype.category = Facade.proxy('properties.category');

    /**
     * Get the event ID from `properties.id`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {string}
     */
    Track.prototype.id = Facade.proxy('properties.id');

    /**
     * Get the product ID from `properties.productId`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Track.prototype.productId = function() {
      return this.proxy('properties.product_id') || this.proxy('properties.productId');
    };

    /**
     * Get the promotion ID from `properties.promotionId`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Track.prototype.promotionId = function() {
      return this.proxy('properties.promotion_id') || this.proxy('properties.promotionId');
    };

    /**
     * Get the cart ID from `properties.cartId`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Track.prototype.cartId = function() {
      return this.proxy('properties.cart_id') || this.proxy('properties.cartId');
    };

    /**
     * Get the checkout ID from `properties.checkoutId`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Track.prototype.checkoutId = function() {
      return this.proxy('properties.checkout_id') || this.proxy('properties.checkoutId');
    };

    /**
     * Get the payment ID from `properties.paymentId`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Track.prototype.paymentId = function() {
      return this.proxy('properties.payment_id') || this.proxy('properties.paymentId');
    };

    /**
     * Get the coupon ID from `properties.couponId`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Track.prototype.couponId = function() {
      return this.proxy('properties.coupon_id') || this.proxy('properties.couponId');
    };

    /**
     * Get the wishlist ID from `properties.wishlistId`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Track.prototype.wishlistId = function() {
      return this.proxy('properties.wishlist_id') || this.proxy('properties.wishlistId');
    };

    /**
     * Get the review ID from `properties.reviewId`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Track.prototype.reviewId = function() {
      return this.proxy('properties.review_id') || this.proxy('properties.reviewId');
    };

    /**
     * Get the order ID from `properties.id` or `properties.orderId`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Track.prototype.orderId = function() {
      // doesn't follow above convention since this fallback order was how it used to be
      return this.proxy('properties.id')
        || this.proxy('properties.order_id')
        || this.proxy('properties.orderId');
    };

    /**
     * Get the SKU from `properties.sku`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {string}
     */
    Track.prototype.sku = Facade.proxy('properties.sku');

    /**
     * Get the amount of tax for this purchase from `properties.tax`.
     *
     * This *should* be a number, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {number}
     */
    Track.prototype.tax = Facade.proxy('properties.tax');

    /**
     * Get the name of this event from `properties.name`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {string}
     */
    Track.prototype.name = Facade.proxy('properties.name');

    /**
     * Get the price of this purchase from `properties.price`.
     *
     * This *should* be a number, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {number}
     */
    Track.prototype.price = Facade.proxy('properties.price');

    /**
     * Get the total for this purchase from `properties.total`.
     *
     * This *should* be a number, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {number}
     */
    Track.prototype.total = Facade.proxy('properties.total');

    /**
     * Whether this is a repeat purchase from `properties.repeat`.
     *
     * This *should* be a boolean, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {boolean}
     */
    Track.prototype.repeat = Facade.proxy('properties.repeat');

    /**
     * Get the coupon for this purchase from `properties.coupon`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {string}
     */
    Track.prototype.coupon = Facade.proxy('properties.coupon');

    /**
     * Get the shipping for this purchase from `properties.shipping`.
     *
     * This *should* be a number, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {number}
     */
    Track.prototype.shipping = Facade.proxy('properties.shipping');

    /**
     * Get the discount for this purchase from `properties.discount`.
     *
     * This *should* be a number, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {number}
     */
    Track.prototype.discount = Facade.proxy('properties.discount');

    /**
     * Get the shipping method for this purchase from `properties.shippingMethod`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Track.prototype.shippingMethod = function() {
      return this.proxy('properties.shipping_method') || this.proxy('properties.shippingMethod');
    };

    /**
     * Get the payment method for this purchase from `properties.paymentMethod`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Track.prototype.paymentMethod = function() {
      return this.proxy('properties.payment_method') || this.proxy('properties.paymentMethod');
    };

    /**
     * Get a description for this event from `properties.description`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {string}
     */
    Track.prototype.description = Facade.proxy('properties.description');

    /**
     * Get a plan, as in the plan the user is on, for this event from
     * `properties.plan`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {string}
     */
    Track.prototype.plan = Facade.proxy('properties.plan');

    /**
     * Get the subtotal for this purchase from `properties.subtotal`.
     *
     * If `properties.subtotal` isn't available, then fall back to computing the
     * total from `properties.total` or `properties.revenue`, and then subtracting
     * tax, shipping, and discounts.
     *
     * If neither subtotal, total, nor revenue are available, then return 0.
     *
     * @return {number}
     */
    Track.prototype.subtotal = function() {
      var subtotal = get(this.properties(), 'subtotal');
      var total = this.total() || this.revenue();

      if (subtotal) return subtotal;
      if (!total) return 0;

      if (this.total()) {
        var n = this.tax();
        if (n) total -= n;
        n = this.shipping();
        if (n) total -= n;
        n = this.discount();
        if (n) total += n;
      }

      return total;
    };

    /**
     * Get the products for this event from `properties.products` if it's an
     * array, falling back to an empty array.
     *
     * @return {Array}
     */
    Track.prototype.products = function() {
      var props = this.properties();
      var products = get(props, 'products');
      return type(products) === 'array' ? products : [];
    };

    /**
     * Get the quantity for this event from `properties.quantity`, falling back to
     * a quantity of one.
     *
     * @return {number}
     */
    Track.prototype.quantity = function() {
      var props = this.obj.properties || {};
      return props.quantity || 1;
    };

    /**
     * Get the currency for this event from `properties.currency`, falling back to
     * "USD".
     *
     * @return {string}
     */
    Track.prototype.currency = function() {
      var props = this.obj.properties || {};
      return props.currency || 'USD';
    };

    /**
     * Get the referrer for this event from `context.referrer.url`,
     * `context.page.referrer`, or `properties.referrer`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string}
     */
    Track.prototype.referrer = function() {
      // TODO re-examine whether this function is necessary
      return this.proxy('context.referrer.url')
        || this.proxy('context.page.referrer')
        || this.proxy('properties.referrer');
    };

    /**
     * Get the query for this event from `options.query`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @function
     * @return {string|object}
     */
    Track.prototype.query = Facade.proxy('options.query');

    /**
     * Get the page's properties. This is identical to how {@link Facade#traits}
     * works, except it looks at `properties.*` instead of `options.traits.*`.
     *
     * Properties are gotten from `properties`.
     *
     * The parameter `aliases` is meant to transform keys in `properties` into new
     * keys. Each alias like `{ "xxx": "yyy" }` will take whatever is at `xxx` in
     * the traits, and move it to `yyy`. If `xxx` is a method of this facade, it'll
     * be called as a function instead of treated as a key into the traits.
     *
     * @example
     * var obj = { properties: { foo: "bar" }, anonymousId: "xxx" }
     * var track = new Track(obj)
     *
     * track.traits() // { "foo": "bar" }
     * track.traits({ "foo": "asdf" }) // { "asdf": "bar" }
     * track.traits({ "sessionId": "rofl" }) // { "rofl": "xxx" }
     *
     * @param {Object} aliases - A mapping from keys to the new keys they should be
     * transformed to.
     * @return {Object}
     */
    Track.prototype.properties = function(aliases) {
      var ret = this.field('properties') || {};
      aliases = aliases || {};

      for (var alias in aliases) {
        var value = this[alias] == null ? this.proxy('properties.' + alias) : this[alias]();
        if (value == null) continue;
        ret[aliases[alias]] = value;
        delete ret[alias];
      }

      return ret;
    };

    /**
     * Get the username of the user for this event from `traits.username`,
     * `properties.username`, `userId`, or `anonymousId`.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string|undefined}
     */
    Track.prototype.username = function() {
      return this.proxy('traits.username')
        || this.proxy('properties.username')
        || this.userId()
        || this.sessionId();
    };

    /**
     * Get the email of the user for this event from `trais.email`,
     * `properties.email`, or `options.traits.email`, falling back to `userId` if
     * it looks like a valid email.
     *
     * This *should* be a string, but may not be if the client isn't adhering to
     * the spec.
     *
     * @return {string|undefined}
     */
    Track.prototype.email = function() {
      var email = this.proxy('traits.email')
        || this.proxy('properties.email')
        || this.proxy('options.traits.email');
      if (email) return email;

      var userId = this.userId();
      if (isEmail(userId)) return userId;
    };

    /**
     * Get the revenue for this event.
     *
     * If this is an "Order Completed" event, this will be the `properties.total`
     * falling back to the `properties.revenue`. For all other events, this is
     * simply taken from `properties.revenue`.
     *
     * If there are dollar signs in these properties, they will be removed. The
     * result will be parsed into a number.
     *
     * @return {number}
     */
    Track.prototype.revenue = function() {
      var revenue = this.proxy('properties.revenue');
      var event = this.event();
      var orderCompletedRegExp = /^[ _]?completed[ _]?order[ _]?|^[ _]?order[ _]?completed[ _]?$/i;

      // it's always revenue, unless it's called during an order completion.
      if (!revenue && event && event.match(orderCompletedRegExp)) {
        revenue = this.proxy('properties.total');
      }

      return currency(revenue);
    };

    /**
     * Get the revenue for this event in "cents" -- in other words, multiply the
     * {@link Track#revenue} by 100, or return 0 if there isn't a numerical revenue
     * for this event.
     *
     * @return {number}
     */
    Track.prototype.cents = function() {
      var revenue = this.revenue();
      return typeof revenue !== 'number' ? this.value() || 0 : revenue * 100;
    };

    /**
     * Convert this event into an {@link Identify} facade.
     *
     * This works by taking this event's underlying object and creating an Identify
     * from it. This event's traits, taken from `options.traits`, will be used as
     * the Identify's traits.
     *
     * @return {Identify}
     */
    Track.prototype.identify = function() {
      // TODO: remove me.
      var json = this.json();
      json.traits = this.traits();
      return new Identify(json, this.opts);
    };

    /**
     * Get float from currency value.
     *
     * @ignore
     * @param {*} val
     * @return {number}
     */
    function currency(val) {
      if (!val) return;
      if (typeof val === 'number') {
        return val;
      }
      if (typeof val !== 'string') {
        return;
      }

      val = val.replace(/\$/g, '');
      val = parseFloat(val);

      if (!isNaN(val)) {
        return val;
      }
    }

    module.exports = Track;

    },{"./facade":99,"./identify":101,"./utils":107,"is-email":80,"obj-case":93}],107:[function(require,module,exports){
    'use strict';

    exports.inherit = require('inherits');
    exports.clone = require('@ndhoule/clone');
    exports.type = require('type-component');

    },{"@ndhoule/clone":5,"inherits":79,"type-component":114}],108:[function(require,module,exports){

    /**
     * Generate a slug from the given `str`.
     *
     * example:
     *
     *        generate('foo bar');
     *        // > foo-bar
     *
     * @param {String} str
     * @param {Object} options
     * @config {String|RegExp} [replace] characters to replace, defaulted to `/[^a-z0-9]/g`
     * @config {String} [separator] separator to insert, defaulted to `-`
     * @return {String}
     */

    module.exports = function (str, options) {
      options || (options = {});
      return str.toLowerCase()
        .replace(options.replace || /[^a-z0-9]/g, ' ')
        .replace(/^ +| +$/g, '')
        .replace(/ +/g, options.separator || '-')
    };

    },{}],109:[function(require,module,exports){
    (function (factory) {
        if (typeof exports === 'object') {
            // Node/CommonJS
            module.exports = factory();
        } else if (typeof define === 'function' && define.amd) {
            // AMD
            define(factory);
        } else {
            // Browser globals (with support for web workers)
            var glob;

            try {
                glob = window;
            } catch (e) {
                glob = self;
            }

            glob.SparkMD5 = factory();
        }
    }(function (undefined) {

        'use strict';

        /*
         * Fastest md5 implementation around (JKM md5).
         * Credits: Joseph Myers
         *
         * @see http://www.myersdaily.org/joseph/javascript/md5-text.html
         * @see http://jsperf.com/md5-shootout/7
         */

        /* this function is much faster,
          so if possible we use it. Some IEs
          are the only ones I know of that
          need the idiotic second function,
          generated by an if clause.  */
        var add32 = function (a, b) {
            return (a + b) & 0xFFFFFFFF;
        },
            hex_chr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];


        function cmn(q, a, b, x, s, t) {
            a = add32(add32(a, q), add32(x, t));
            return add32((a << s) | (a >>> (32 - s)), b);
        }

        function ff(a, b, c, d, x, s, t) {
            return cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }

        function gg(a, b, c, d, x, s, t) {
            return cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }

        function hh(a, b, c, d, x, s, t) {
            return cmn(b ^ c ^ d, a, b, x, s, t);
        }

        function ii(a, b, c, d, x, s, t) {
            return cmn(c ^ (b | (~d)), a, b, x, s, t);
        }

        function md5cycle(x, k) {
            var a = x[0],
                b = x[1],
                c = x[2],
                d = x[3];

            a = ff(a, b, c, d, k[0], 7, -680876936);
            d = ff(d, a, b, c, k[1], 12, -389564586);
            c = ff(c, d, a, b, k[2], 17, 606105819);
            b = ff(b, c, d, a, k[3], 22, -1044525330);
            a = ff(a, b, c, d, k[4], 7, -176418897);
            d = ff(d, a, b, c, k[5], 12, 1200080426);
            c = ff(c, d, a, b, k[6], 17, -1473231341);
            b = ff(b, c, d, a, k[7], 22, -45705983);
            a = ff(a, b, c, d, k[8], 7, 1770035416);
            d = ff(d, a, b, c, k[9], 12, -1958414417);
            c = ff(c, d, a, b, k[10], 17, -42063);
            b = ff(b, c, d, a, k[11], 22, -1990404162);
            a = ff(a, b, c, d, k[12], 7, 1804603682);
            d = ff(d, a, b, c, k[13], 12, -40341101);
            c = ff(c, d, a, b, k[14], 17, -1502002290);
            b = ff(b, c, d, a, k[15], 22, 1236535329);

            a = gg(a, b, c, d, k[1], 5, -165796510);
            d = gg(d, a, b, c, k[6], 9, -1069501632);
            c = gg(c, d, a, b, k[11], 14, 643717713);
            b = gg(b, c, d, a, k[0], 20, -373897302);
            a = gg(a, b, c, d, k[5], 5, -701558691);
            d = gg(d, a, b, c, k[10], 9, 38016083);
            c = gg(c, d, a, b, k[15], 14, -660478335);
            b = gg(b, c, d, a, k[4], 20, -405537848);
            a = gg(a, b, c, d, k[9], 5, 568446438);
            d = gg(d, a, b, c, k[14], 9, -1019803690);
            c = gg(c, d, a, b, k[3], 14, -187363961);
            b = gg(b, c, d, a, k[8], 20, 1163531501);
            a = gg(a, b, c, d, k[13], 5, -1444681467);
            d = gg(d, a, b, c, k[2], 9, -51403784);
            c = gg(c, d, a, b, k[7], 14, 1735328473);
            b = gg(b, c, d, a, k[12], 20, -1926607734);

            a = hh(a, b, c, d, k[5], 4, -378558);
            d = hh(d, a, b, c, k[8], 11, -2022574463);
            c = hh(c, d, a, b, k[11], 16, 1839030562);
            b = hh(b, c, d, a, k[14], 23, -35309556);
            a = hh(a, b, c, d, k[1], 4, -1530992060);
            d = hh(d, a, b, c, k[4], 11, 1272893353);
            c = hh(c, d, a, b, k[7], 16, -155497632);
            b = hh(b, c, d, a, k[10], 23, -1094730640);
            a = hh(a, b, c, d, k[13], 4, 681279174);
            d = hh(d, a, b, c, k[0], 11, -358537222);
            c = hh(c, d, a, b, k[3], 16, -722521979);
            b = hh(b, c, d, a, k[6], 23, 76029189);
            a = hh(a, b, c, d, k[9], 4, -640364487);
            d = hh(d, a, b, c, k[12], 11, -421815835);
            c = hh(c, d, a, b, k[15], 16, 530742520);
            b = hh(b, c, d, a, k[2], 23, -995338651);

            a = ii(a, b, c, d, k[0], 6, -198630844);
            d = ii(d, a, b, c, k[7], 10, 1126891415);
            c = ii(c, d, a, b, k[14], 15, -1416354905);
            b = ii(b, c, d, a, k[5], 21, -57434055);
            a = ii(a, b, c, d, k[12], 6, 1700485571);
            d = ii(d, a, b, c, k[3], 10, -1894986606);
            c = ii(c, d, a, b, k[10], 15, -1051523);
            b = ii(b, c, d, a, k[1], 21, -2054922799);
            a = ii(a, b, c, d, k[8], 6, 1873313359);
            d = ii(d, a, b, c, k[15], 10, -30611744);
            c = ii(c, d, a, b, k[6], 15, -1560198380);
            b = ii(b, c, d, a, k[13], 21, 1309151649);
            a = ii(a, b, c, d, k[4], 6, -145523070);
            d = ii(d, a, b, c, k[11], 10, -1120210379);
            c = ii(c, d, a, b, k[2], 15, 718787259);
            b = ii(b, c, d, a, k[9], 21, -343485551);

            x[0] = add32(a, x[0]);
            x[1] = add32(b, x[1]);
            x[2] = add32(c, x[2]);
            x[3] = add32(d, x[3]);
        }

        function md5blk(s) {
            var md5blks = [],
                i; /* Andy King said do it this way. */

            for (i = 0; i < 64; i += 4) {
                md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
            }
            return md5blks;
        }

        function md5blk_array(a) {
            var md5blks = [],
                i; /* Andy King said do it this way. */

            for (i = 0; i < 64; i += 4) {
                md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
            }
            return md5blks;
        }

        function md51(s) {
            var n = s.length,
                state = [1732584193, -271733879, -1732584194, 271733878],
                i,
                length,
                tail,
                tmp,
                lo,
                hi;

            for (i = 64; i <= n; i += 64) {
                md5cycle(state, md5blk(s.substring(i - 64, i)));
            }
            s = s.substring(i - 64);
            length = s.length;
            tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (i = 0; i < length; i += 1) {
                tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
            }
            tail[i >> 2] |= 0x80 << ((i % 4) << 3);
            if (i > 55) {
                md5cycle(state, tail);
                for (i = 0; i < 16; i += 1) {
                    tail[i] = 0;
                }
            }

            // Beware that the final length might not fit in 32 bits so we take care of that
            tmp = n * 8;
            tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
            lo = parseInt(tmp[2], 16);
            hi = parseInt(tmp[1], 16) || 0;

            tail[14] = lo;
            tail[15] = hi;

            md5cycle(state, tail);
            return state;
        }

        function md51_array(a) {
            var n = a.length,
                state = [1732584193, -271733879, -1732584194, 271733878],
                i,
                length,
                tail,
                tmp,
                lo,
                hi;

            for (i = 64; i <= n; i += 64) {
                md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
            }

            // Not sure if it is a bug, however IE10 will always produce a sub array of length 1
            // containing the last element of the parent array if the sub array specified starts
            // beyond the length of the parent array - weird.
            // https://connect.microsoft.com/IE/feedback/details/771452/typed-array-subarray-issue
            a = (i - 64) < n ? a.subarray(i - 64) : new Uint8Array(0);

            length = a.length;
            tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (i = 0; i < length; i += 1) {
                tail[i >> 2] |= a[i] << ((i % 4) << 3);
            }

            tail[i >> 2] |= 0x80 << ((i % 4) << 3);
            if (i > 55) {
                md5cycle(state, tail);
                for (i = 0; i < 16; i += 1) {
                    tail[i] = 0;
                }
            }

            // Beware that the final length might not fit in 32 bits so we take care of that
            tmp = n * 8;
            tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
            lo = parseInt(tmp[2], 16);
            hi = parseInt(tmp[1], 16) || 0;

            tail[14] = lo;
            tail[15] = hi;

            md5cycle(state, tail);

            return state;
        }

        function rhex(n) {
            var s = '',
                j;
            for (j = 0; j < 4; j += 1) {
                s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
            }
            return s;
        }

        function hex(x) {
            var i;
            for (i = 0; i < x.length; i += 1) {
                x[i] = rhex(x[i]);
            }
            return x.join('');
        }

        // In some cases the fast add32 function cannot be used..
        if (hex(md51('hello')) !== '5d41402abc4b2a76b9719d911017c592') {
            add32 = function (x, y) {
                var lsw = (x & 0xFFFF) + (y & 0xFFFF),
                    msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                return (msw << 16) | (lsw & 0xFFFF);
            };
        }

        // ---------------------------------------------------

        /**
         * ArrayBuffer slice polyfill.
         *
         * @see https://github.com/ttaubert/node-arraybuffer-slice
         */

        if (typeof ArrayBuffer !== 'undefined' && !ArrayBuffer.prototype.slice) {
            (function () {
                function clamp(val, length) {
                    val = (val | 0) || 0;

                    if (val < 0) {
                        return Math.max(val + length, 0);
                    }

                    return Math.min(val, length);
                }

                ArrayBuffer.prototype.slice = function (from, to) {
                    var length = this.byteLength,
                        begin = clamp(from, length),
                        end = length,
                        num,
                        target,
                        targetArray,
                        sourceArray;

                    if (to !== undefined) {
                        end = clamp(to, length);
                    }

                    if (begin > end) {
                        return new ArrayBuffer(0);
                    }

                    num = end - begin;
                    target = new ArrayBuffer(num);
                    targetArray = new Uint8Array(target);

                    sourceArray = new Uint8Array(this, begin, num);
                    targetArray.set(sourceArray);

                    return target;
                };
            })();
        }

        // ---------------------------------------------------

        /**
         * Helpers.
         */

        function toUtf8(str) {
            if (/[\u0080-\uFFFF]/.test(str)) {
                str = unescape(encodeURIComponent(str));
            }

            return str;
        }

        function utf8Str2ArrayBuffer(str, returnUInt8Array) {
            var length = str.length,
               buff = new ArrayBuffer(length),
               arr = new Uint8Array(buff),
               i;

            for (i = 0; i < length; i += 1) {
                arr[i] = str.charCodeAt(i);
            }

            return returnUInt8Array ? arr : buff;
        }

        function arrayBuffer2Utf8Str(buff) {
            return String.fromCharCode.apply(null, new Uint8Array(buff));
        }

        function concatenateArrayBuffers(first, second, returnUInt8Array) {
            var result = new Uint8Array(first.byteLength + second.byteLength);

            result.set(new Uint8Array(first));
            result.set(new Uint8Array(second), first.byteLength);

            return returnUInt8Array ? result : result.buffer;
        }

        function hexToBinaryString(hex) {
            var bytes = [],
                length = hex.length,
                x;

            for (x = 0; x < length - 1; x += 2) {
                bytes.push(parseInt(hex.substr(x, 2), 16));
            }

            return String.fromCharCode.apply(String, bytes);
        }

        // ---------------------------------------------------

        /**
         * SparkMD5 OOP implementation.
         *
         * Use this class to perform an incremental md5, otherwise use the
         * static methods instead.
         */

        function SparkMD5() {
            // call reset to init the instance
            this.reset();
        }

        /**
         * Appends a string.
         * A conversion will be applied if an utf8 string is detected.
         *
         * @param {String} str The string to be appended
         *
         * @return {SparkMD5} The instance itself
         */
        SparkMD5.prototype.append = function (str) {
            // Converts the string to utf8 bytes if necessary
            // Then append as binary
            this.appendBinary(toUtf8(str));

            return this;
        };

        /**
         * Appends a binary string.
         *
         * @param {String} contents The binary string to be appended
         *
         * @return {SparkMD5} The instance itself
         */
        SparkMD5.prototype.appendBinary = function (contents) {
            this._buff += contents;
            this._length += contents.length;

            var length = this._buff.length,
                i;

            for (i = 64; i <= length; i += 64) {
                md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
            }

            this._buff = this._buff.substring(i - 64);

            return this;
        };

        /**
         * Finishes the incremental computation, reseting the internal state and
         * returning the result.
         *
         * @param {Boolean} raw True to get the raw string, false to get the hex string
         *
         * @return {String} The result
         */
        SparkMD5.prototype.end = function (raw) {
            var buff = this._buff,
                length = buff.length,
                i,
                tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ret;

            for (i = 0; i < length; i += 1) {
                tail[i >> 2] |= buff.charCodeAt(i) << ((i % 4) << 3);
            }

            this._finish(tail, length);
            ret = hex(this._hash);

            if (raw) {
                ret = hexToBinaryString(ret);
            }

            this.reset();

            return ret;
        };

        /**
         * Resets the internal state of the computation.
         *
         * @return {SparkMD5} The instance itself
         */
        SparkMD5.prototype.reset = function () {
            this._buff = '';
            this._length = 0;
            this._hash = [1732584193, -271733879, -1732584194, 271733878];

            return this;
        };

        /**
         * Gets the internal state of the computation.
         *
         * @return {Object} The state
         */
        SparkMD5.prototype.getState = function () {
            return {
                buff: this._buff,
                length: this._length,
                hash: this._hash
            };
        };

        /**
         * Gets the internal state of the computation.
         *
         * @param {Object} state The state
         *
         * @return {SparkMD5} The instance itself
         */
        SparkMD5.prototype.setState = function (state) {
            this._buff = state.buff;
            this._length = state.length;
            this._hash = state.hash;

            return this;
        };

        /**
         * Releases memory used by the incremental buffer and other additional
         * resources. If you plan to use the instance again, use reset instead.
         */
        SparkMD5.prototype.destroy = function () {
            delete this._hash;
            delete this._buff;
            delete this._length;
        };

        /**
         * Finish the final calculation based on the tail.
         *
         * @param {Array}  tail   The tail (will be modified)
         * @param {Number} length The length of the remaining buffer
         */
        SparkMD5.prototype._finish = function (tail, length) {
            var i = length,
                tmp,
                lo,
                hi;

            tail[i >> 2] |= 0x80 << ((i % 4) << 3);
            if (i > 55) {
                md5cycle(this._hash, tail);
                for (i = 0; i < 16; i += 1) {
                    tail[i] = 0;
                }
            }

            // Do the final computation based on the tail and length
            // Beware that the final length may not fit in 32 bits so we take care of that
            tmp = this._length * 8;
            tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
            lo = parseInt(tmp[2], 16);
            hi = parseInt(tmp[1], 16) || 0;

            tail[14] = lo;
            tail[15] = hi;
            md5cycle(this._hash, tail);
        };

        /**
         * Performs the md5 hash on a string.
         * A conversion will be applied if utf8 string is detected.
         *
         * @param {String}  str The string
         * @param {Boolean} raw True to get the raw string, false to get the hex string
         *
         * @return {String} The result
         */
        SparkMD5.hash = function (str, raw) {
            // Converts the string to utf8 bytes if necessary
            // Then compute it using the binary function
            return SparkMD5.hashBinary(toUtf8(str), raw);
        };

        /**
         * Performs the md5 hash on a binary string.
         *
         * @param {String}  content The binary string
         * @param {Boolean} raw     True to get the raw string, false to get the hex string
         *
         * @return {String} The result
         */
        SparkMD5.hashBinary = function (content, raw) {
            var hash = md51(content),
                ret = hex(hash);

            return raw ? hexToBinaryString(ret) : ret;
        };

        // ---------------------------------------------------

        /**
         * SparkMD5 OOP implementation for array buffers.
         *
         * Use this class to perform an incremental md5 ONLY for array buffers.
         */
        SparkMD5.ArrayBuffer = function () {
            // call reset to init the instance
            this.reset();
        };

        /**
         * Appends an array buffer.
         *
         * @param {ArrayBuffer} arr The array to be appended
         *
         * @return {SparkMD5.ArrayBuffer} The instance itself
         */
        SparkMD5.ArrayBuffer.prototype.append = function (arr) {
            var buff = concatenateArrayBuffers(this._buff.buffer, arr, true),
                length = buff.length,
                i;

            this._length += arr.byteLength;

            for (i = 64; i <= length; i += 64) {
                md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
            }

            this._buff = (i - 64) < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0);

            return this;
        };

        /**
         * Finishes the incremental computation, reseting the internal state and
         * returning the result.
         *
         * @param {Boolean} raw True to get the raw string, false to get the hex string
         *
         * @return {String} The result
         */
        SparkMD5.ArrayBuffer.prototype.end = function (raw) {
            var buff = this._buff,
                length = buff.length,
                tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                i,
                ret;

            for (i = 0; i < length; i += 1) {
                tail[i >> 2] |= buff[i] << ((i % 4) << 3);
            }

            this._finish(tail, length);
            ret = hex(this._hash);

            if (raw) {
                ret = hexToBinaryString(ret);
            }

            this.reset();

            return ret;
        };

        /**
         * Resets the internal state of the computation.
         *
         * @return {SparkMD5.ArrayBuffer} The instance itself
         */
        SparkMD5.ArrayBuffer.prototype.reset = function () {
            this._buff = new Uint8Array(0);
            this._length = 0;
            this._hash = [1732584193, -271733879, -1732584194, 271733878];

            return this;
        };

        /**
         * Gets the internal state of the computation.
         *
         * @return {Object} The state
         */
        SparkMD5.ArrayBuffer.prototype.getState = function () {
            var state = SparkMD5.prototype.getState.call(this);

            // Convert buffer to a string
            state.buff = arrayBuffer2Utf8Str(state.buff);

            return state;
        };

        /**
         * Gets the internal state of the computation.
         *
         * @param {Object} state The state
         *
         * @return {SparkMD5.ArrayBuffer} The instance itself
         */
        SparkMD5.ArrayBuffer.prototype.setState = function (state) {
            // Convert string to buffer
            state.buff = utf8Str2ArrayBuffer(state.buff, true);

            return SparkMD5.prototype.setState.call(this, state);
        };

        SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy;

        SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish;

        /**
         * Performs the md5 hash on an array buffer.
         *
         * @param {ArrayBuffer} arr The array buffer
         * @param {Boolean}     raw True to get the raw string, false to get the hex one
         *
         * @return {String} The result
         */
        SparkMD5.ArrayBuffer.hash = function (arr, raw) {
            var hash = md51_array(new Uint8Array(arr)),
                ret = hex(hash);

            return raw ? hexToBinaryString(ret) : ret;
        };

        return SparkMD5;
    }));

    },{}],110:[function(require,module,exports){
    (function (setImmediate,clearImmediate){
    var nextTick = require('process/browser.js').nextTick;
    var apply = Function.prototype.apply;
    var slice = Array.prototype.slice;
    var immediateIds = {};
    var nextImmediateId = 0;

    // DOM APIs, for completeness

    exports.setTimeout = function() {
      return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
    };
    exports.setInterval = function() {
      return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
    };
    exports.clearTimeout =
    exports.clearInterval = function(timeout) { timeout.close(); };

    function Timeout(id, clearFn) {
      this._id = id;
      this._clearFn = clearFn;
    }
    Timeout.prototype.unref = Timeout.prototype.ref = function() {};
    Timeout.prototype.close = function() {
      this._clearFn.call(window, this._id);
    };

    // Does not start the time, just sets up the members needed.
    exports.enroll = function(item, msecs) {
      clearTimeout(item._idleTimeoutId);
      item._idleTimeout = msecs;
    };

    exports.unenroll = function(item) {
      clearTimeout(item._idleTimeoutId);
      item._idleTimeout = -1;
    };

    exports._unrefActive = exports.active = function(item) {
      clearTimeout(item._idleTimeoutId);

      var msecs = item._idleTimeout;
      if (msecs >= 0) {
        item._idleTimeoutId = setTimeout(function onTimeout() {
          if (item._onTimeout)
            item._onTimeout();
        }, msecs);
      }
    };

    // That's not how node.js implements it but the exposed api is the same.
    exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
      var id = nextImmediateId++;
      var args = arguments.length < 2 ? false : slice.call(arguments, 1);

      immediateIds[id] = true;

      nextTick(function onNextTick() {
        if (immediateIds[id]) {
          // fn.call() is faster so we optimize for the common use-case
          // @see http://jsperf.com/call-apply-segu
          if (args) {
            fn.apply(null, args);
          } else {
            fn.call(null);
          }
          // Prevent ids from leaking
          exports.clearImmediate(id);
        }
      });

      return id;
    };

    exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
      delete immediateIds[id];
    };
    }).call(this,require("timers").setImmediate,require("timers").clearImmediate)
    },{"process/browser.js":94,"timers":110}],111:[function(require,module,exports){

    /**
     * Module Dependencies
     */

    var expr;
    try {
      expr = require('props');
    } catch(e) {
      expr = require('component-props');
    }

    /**
     * Expose `toFunction()`.
     */

    module.exports = toFunction;

    /**
     * Convert `obj` to a `Function`.
     *
     * @param {Mixed} obj
     * @return {Function}
     * @api private
     */

    function toFunction(obj) {
      switch ({}.toString.call(obj)) {
        case '[object Object]':
          return objectToFunction(obj);
        case '[object Function]':
          return obj;
        case '[object String]':
          return stringToFunction(obj);
        case '[object RegExp]':
          return regexpToFunction(obj);
        default:
          return defaultToFunction(obj);
      }
    }

    /**
     * Default to strict equality.
     *
     * @param {Mixed} val
     * @return {Function}
     * @api private
     */

    function defaultToFunction(val) {
      return function(obj){
        return val === obj;
      };
    }

    /**
     * Convert `re` to a function.
     *
     * @param {RegExp} re
     * @return {Function}
     * @api private
     */

    function regexpToFunction(re) {
      return function(obj){
        return re.test(obj);
      };
    }

    /**
     * Convert property `str` to a function.
     *
     * @param {String} str
     * @return {Function}
     * @api private
     */

    function stringToFunction(str) {
      // immediate such as "> 20"
      if (/^ *\W+/.test(str)) return new Function('_', 'return _ ' + str);

      // properties such as "name.first" or "age > 18" or "age > 18 && age < 36"
      return new Function('_', 'return ' + get(str));
    }

    /**
     * Convert `object` to a function.
     *
     * @param {Object} object
     * @return {Function}
     * @api private
     */

    function objectToFunction(obj) {
      var match = {};
      for (var key in obj) {
        match[key] = typeof obj[key] === 'string'
          ? defaultToFunction(obj[key])
          : toFunction(obj[key]);
      }
      return function(val){
        if (typeof val !== 'object') return false;
        for (var key in match) {
          if (!(key in val)) return false;
          if (!match[key](val[key])) return false;
        }
        return true;
      };
    }

    /**
     * Built the getter function. Supports getter style functions
     *
     * @param {String} str
     * @return {String}
     * @api private
     */

    function get(str) {
      var props = expr(str);
      if (!props.length) return '_.' + str;

      var val, i, prop;
      for (i = 0; i < props.length; i++) {
        prop = props[i];
        val = '_.' + prop;
        val = "('function' == typeof " + val + " ? " + val + "() : " + val + ")";

        // mimic negative lookbehind to avoid problems with nested properties
        str = stripNested(prop, str, val);
      }

      return str;
    }

    /**
     * Mimic negative lookbehind to avoid problems with nested properties.
     *
     * See: http://blog.stevenlevithan.com/archives/mimic-lookbehind-javascript
     *
     * @param {String} prop
     * @param {String} str
     * @param {String} val
     * @return {String}
     * @api private
     */

    function stripNested (prop, str, val) {
      return str.replace(new RegExp('(\\.)?' + prop, 'g'), function($0, $1) {
        return $1 ? $0 : val;
      });
    }

    },{"component-props":70,"props":70}],112:[function(require,module,exports){

    /**
     * Expose `toNoCase`.
     */

    module.exports = toNoCase;


    /**
     * Test whether a string is camel-case.
     */

    var hasSpace = /\s/;
    var hasSeparator = /[\W_]/;


    /**
     * Remove any starting case from a `string`, like camel or snake, but keep
     * spaces and punctuation that may be important otherwise.
     *
     * @param {String} string
     * @return {String}
     */

    function toNoCase (string) {
      if (hasSpace.test(string)) return string.toLowerCase();
      if (hasSeparator.test(string)) return (unseparate(string) || string).toLowerCase();
      return uncamelize(string).toLowerCase();
    }


    /**
     * Separator splitter.
     */

    var separatorSplitter = /[\W_]+(.|$)/g;


    /**
     * Un-separate a `string`.
     *
     * @param {String} string
     * @return {String}
     */

    function unseparate (string) {
      return string.replace(separatorSplitter, function (m, next) {
        return next ? ' ' + next : '';
      });
    }


    /**
     * Camelcase splitter.
     */

    var camelSplitter = /(.)([A-Z]+)/g;


    /**
     * Un-camelcase a `string`.
     *
     * @param {String} string
     * @return {String}
     */

    function uncamelize (string) {
      return string.replace(camelSplitter, function (m, previous, uppers) {
        return previous + ' ' + uppers.toLowerCase().split('').join(' ');
      });
    }
    },{}],113:[function(require,module,exports){

    exports = module.exports = trim;

    function trim(str){
      return str.replace(/^\s*|\s*$/g, '');
    }

    exports.left = function(str){
      return str.replace(/^\s*/, '');
    };

    exports.right = function(str){
      return str.replace(/\s*$/, '');
    };

    },{}],114:[function(require,module,exports){

    /**
     * toString ref.
     */

    var toString = Object.prototype.toString;

    /**
     * Return the type of `val`.
     *
     * @param {Mixed} val
     * @return {String}
     * @api public
     */

    module.exports = function(val){
      switch (toString.call(val)) {
        case '[object Function]': return 'function';
        case '[object Date]': return 'date';
        case '[object RegExp]': return 'regexp';
        case '[object Arguments]': return 'arguments';
        case '[object Array]': return 'array';
      }

      if (val === null) return 'null';
      if (val === undefined) return 'undefined';
      if (val === Object(val)) return 'object';

      return typeof val;
    };

    },{}],115:[function(require,module,exports){
    module.exports = encode;

    function encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    }
    },{}],116:[function(require,module,exports){
    (function (global){

    var rng;

    var crypto = global.crypto || global.msCrypto; // for IE 11
    if (crypto && crypto.getRandomValues) {
      // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
      // Moderately fast, high quality
      var _rnds8 = new Uint8Array(16);
      rng = function whatwgRNG() {
        crypto.getRandomValues(_rnds8);
        return _rnds8;
      };
    }

    if (!rng) {
      // Math.random()-based (RNG)
      //
      // If all else fails, use Math.random().  It's fast, but is of unspecified
      // quality.
      var  _rnds = new Array(16);
      rng = function() {
        for (var i = 0, r; i < 16; i++) {
          if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
          _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
        }

        return _rnds;
      };
    }

    module.exports = rng;


    }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    },{}],117:[function(require,module,exports){
    //     uuid.js
    //
    //     Copyright (c) 2010-2012 Robert Kieffer
    //     MIT License - http://opensource.org/licenses/mit-license.php

    // Unique ID creation requires a high quality random # generator.  We feature
    // detect to determine the best RNG source, normalizing to a function that
    // returns 128-bits of randomness, since that's what's usually required
    var _rng = require('./rng');

    // Maps for number <-> hex string conversion
    var _byteToHex = [];
    var _hexToByte = {};
    for (var i = 0; i < 256; i++) {
      _byteToHex[i] = (i + 0x100).toString(16).substr(1);
      _hexToByte[_byteToHex[i]] = i;
    }

    // **`parse()` - Parse a UUID into it's component bytes**
    function parse(s, buf, offset) {
      var i = (buf && offset) || 0, ii = 0;

      buf = buf || [];
      s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
        if (ii < 16) { // Don't overflow!
          buf[i + ii++] = _hexToByte[oct];
        }
      });

      // Zero out remaining bytes if string was short
      while (ii < 16) {
        buf[i + ii++] = 0;
      }

      return buf;
    }

    // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
    function unparse(buf, offset) {
      var i = offset || 0, bth = _byteToHex;
      return  bth[buf[i++]] + bth[buf[i++]] +
              bth[buf[i++]] + bth[buf[i++]] + '-' +
              bth[buf[i++]] + bth[buf[i++]] + '-' +
              bth[buf[i++]] + bth[buf[i++]] + '-' +
              bth[buf[i++]] + bth[buf[i++]] + '-' +
              bth[buf[i++]] + bth[buf[i++]] +
              bth[buf[i++]] + bth[buf[i++]] +
              bth[buf[i++]] + bth[buf[i++]];
    }

    // **`v1()` - Generate time-based UUID**
    //
    // Inspired by https://github.com/LiosK/UUID.js
    // and http://docs.python.org/library/uuid.html

    // random #'s we need to init node and clockseq
    var _seedBytes = _rng();

    // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
    var _nodeId = [
      _seedBytes[0] | 0x01,
      _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
    ];

    // Per 4.2.2, randomize (14 bit) clockseq
    var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

    // Previous uuid creation time
    var _lastMSecs = 0, _lastNSecs = 0;

    // See https://github.com/broofa/node-uuid for API details
    function v1(options, buf, offset) {
      var i = buf && offset || 0;
      var b = buf || [];

      options = options || {};

      var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

      // UUID timestamps are 100 nano-second units since the Gregorian epoch,
      // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
      // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
      // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
      var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

      // Per 4.2.1.2, use count of uuid's generated during the current clock
      // cycle to simulate higher resolution clock
      var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

      // Time since last uuid creation (in msecs)
      var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

      // Per 4.2.1.2, Bump clockseq on clock regression
      if (dt < 0 && options.clockseq === undefined) {
        clockseq = clockseq + 1 & 0x3fff;
      }

      // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
      // time interval
      if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
        nsecs = 0;
      }

      // Per 4.2.1.2 Throw error if too many uuids are requested
      if (nsecs >= 10000) {
        throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
      }

      _lastMSecs = msecs;
      _lastNSecs = nsecs;
      _clockseq = clockseq;

      // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
      msecs += 12219292800000;

      // `time_low`
      var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
      b[i++] = tl >>> 24 & 0xff;
      b[i++] = tl >>> 16 & 0xff;
      b[i++] = tl >>> 8 & 0xff;
      b[i++] = tl & 0xff;

      // `time_mid`
      var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
      b[i++] = tmh >>> 8 & 0xff;
      b[i++] = tmh & 0xff;

      // `time_high_and_version`
      b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
      b[i++] = tmh >>> 16 & 0xff;

      // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
      b[i++] = clockseq >>> 8 | 0x80;

      // `clock_seq_low`
      b[i++] = clockseq & 0xff;

      // `node`
      var node = options.node || _nodeId;
      for (var n = 0; n < 6; n++) {
        b[i + n] = node[n];
      }

      return buf ? buf : unparse(b);
    }

    // **`v4()` - Generate random UUID**

    // See https://github.com/broofa/node-uuid for API details
    function v4(options, buf, offset) {
      // Deprecated - 'format' argument, as supported in v1.2
      var i = buf && offset || 0;

      if (typeof(options) == 'string') {
        buf = options == 'binary' ? new Array(16) : null;
        options = null;
      }
      options = options || {};

      var rnds = options.random || (options.rng || _rng)();

      // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
      rnds[6] = (rnds[6] & 0x0f) | 0x40;
      rnds[8] = (rnds[8] & 0x3f) | 0x80;

      // Copy bytes to buffer, if provided
      if (buf) {
        for (var ii = 0; ii < 16; ii++) {
          buf[i + ii] = rnds[ii];
        }
      }

      return buf || unparse(rnds);
    }

    // Export public API
    var uuid = v4;
    uuid.v1 = v1;
    uuid.v4 = v4;
    uuid.parse = parse;
    uuid.unparse = unparse;

    module.exports = uuid;

    },{"./rng":116}],118:[function(require,module,exports){

    /**
     * dependencies.
     */

    var unserialize = require('unserialize');
    var each = require('each');
    var storage;

    /**
     * Safari throws when a user
     * blocks access to cookies / localstorage.
     */

    try {
      storage = window.localStorage;
    } catch (e) {
      storage = null;
    }

    /**
     * Expose `store`
     */

    module.exports = store;

    /**
     * Store the given `key`, `val`.
     *
     * @param {String|Object} key
     * @param {Mixed} value
     * @return {Mixed}
     * @api public
     */

    function store(key, value){
      var length = arguments.length;
      if (0 == length) return all();
      if (2 <= length) return set(key, value);
      if (1 != length) return;
      if (null == key) return storage.clear();
      if ('string' == typeof key) return get(key);
      if ('object' == typeof key) return each(key, set);
    }

    /**
     * supported flag.
     */

    store.supported = !! storage;

    /**
     * Set `key` to `val`.
     *
     * @param {String} key
     * @param {Mixed} val
     */

    function set(key, val){
      return null == val
        ? storage.removeItem(key)
        : storage.setItem(key, JSON.stringify(val));
    }

    /**
     * Get `key`.
     *
     * @param {String} key
     * @return {Mixed}
     */

    function get(key){
      return unserialize(storage.getItem(key));
    }

    /**
     * Get all.
     *
     * @return {Object}
     */

    function all(){
      var len = storage.length;
      var ret = {};
      var key;

      while (0 <= --len) {
        key = storage.key(len);
        ret[key] = get(key);
      }

      return ret;
    }

    },{"each":66,"unserialize":119}],119:[function(require,module,exports){

    /**
     * Unserialize the given "stringified" javascript.
     *
     * @param {String} val
     * @return {Mixed}
     */

    module.exports = function(val){
      try {
        return JSON.parse(val);
      } catch (e) {
        return val || undefined;
      }
    };

    },{}],120:[function(require,module,exports){
    module.exports={
      "name": "@segment/analytics.js",
      "author": "Segment <friends@segment.com>",
      "version": "2.11.0",
      "description": "The hassle-free way to integrate analytics into any web application.",
      "keywords": [
        "analytics",
        "analytics.js",
        "segment",
        "segment.io"
      ],
      "main": "analytics.js",
      "scripts": {
        "build": "make build",
        "clean": "make clean",
        "test": "make test"
      },
      "repository": {
        "type": "git",
        "url": "https://github.com/segmentio/analytics.js.git"
      },
      "license": "SEE LICENSE IN LICENSE",
      "bugs": {
        "url": "https://github.com/segmentio/analytics.js/issues"
      },
      "homepage": "https://github.com/segmentio/analytics.js#readme",
      "dependencies": {
        "@segment/analytics.js-core": "^3.0.0",
        "@segment/analytics.js-integration": "^3.1.0",
        "@segment/analytics.js-integration-segmentio": "git+https://github.com/segment-integrations/analytics.js-integration-segmentio.git"
      },
      "devDependencies": {
        "@segment/eslint-config": "^3.1.1",
        "browserify": "^13.0.1",
        "eslint": "^2.9.0",
        "eslint-plugin-mocha": "^2.2.0",
        "eslint-plugin-require-path-exists": "^1.1.5",
        "uglify-js": "^2.6.4"
      }
    }

    },{}]},{},[1])(1)
    });
