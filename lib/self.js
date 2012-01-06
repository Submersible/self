/*
 * Copyright (C) 2012 Ryan Munro <munro.github@gmail.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var Self = (function () {
    'use strict';

    var makeClass, objectCreate;

    // Base class, and convience function for extending the Base
    function Self() {
        return Self.extend.apply(Self, arguments);
    }

    Self.VERSION = '0.1.0';

    // Create a new object based on the old one
    // http://javascript.crockford.com/prototypal.html
    if (typeof Object.create === 'function') {
        objectCreate = Object.create;
    } else {
        objectCreate = function (o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }

    // Return a function to extend a class
    function makeExtendMethod(Class) {
        return function (def) {
            return makeClass(Class, def);
        };
    }

    // Copies another object's prototype into the Class, skipping any properties
    // that already exists, or are from `Object.prototype`.
    function makeMixinMethod(Class) {
        return function (properties) {
            var key;

            for (key in properties) {
                if (typeof Class.prototype[key] === 'undefined' &&
                        !Object.hasOwnProperty(key)) {
                    Class.prototype[key] = properties[key];
                }
            }
        };
    }

    // Create a prototype object from a Parent class, and a class definition.
    // In the created prototype, all class methods will be wrapped to
    // automatically insert the `self` variable when called.
    makeClass = function (Parent, def) {
        var key;

        function Class() {
            var obj;

            // Create new object if the `new` keyword was not used.  Check
            // against `global` for Node.js, and `window` for browser side
            // JavaScript.
            if (this === (typeof window === 'undefined' ? global : window) ||
                    typeof this === 'undefined') {
                obj = objectCreate(Class.prototype);
            } else {
                obj = this;
            }

            // Call the constructor
            if (typeof obj.initialize === 'function') {
                obj.initialize.apply(obj, arguments);
            }

            // Return the constructed object if `new` keyword was not used.
            return obj;
        }

        // Use differential inheritence
        Class.prototype = objectCreate(Parent.prototype);

        // Helper property & methods
        Class.__super__ = Parent.prototype;
        Class.extend = makeExtendMethod(Class);
        Class.mixin = makeMixinMethod(Class);

        // Copy class definition into prototype
        for (key in def) {
            if (!Object.hasOwnProperty(key)) {
                if (typeof def[key] === 'function') {
                    (function (fn) {
                        Class.prototype[key] = function () {
                            // Push `this` infront of arguments before calling
                            var args = Array.prototype.slice.call(arguments, 0);
                            args.splice(0, 0, this);
                            return fn.apply(this, args);
                        };
                    }(def[key]));
                } else {
                    Class.prototype[key] = def[key];
                }
            }
        }

        return Class;
    };

    // Manually setup the base class
    Self.__super__ = Object.prototype;

    // For the sake of convience, allow the Self.extend to instead directly 
    // inherit from a prototype, instead of the Self class itself.
    Self.extend = function (arg1, arg2) {
        // arg1 is the class definition
        if (typeof arg2 === 'undefined') {
            return makeClass(Self, arg1);
        // Extend prototype, arg1 is the prototype, arg2 is the class definition
        } else {
            return makeClass(Self.create(arg1), arg2);
        }
    };

    // I don't recommend mixing into the base class!  But for the sake of
    // consistency... :)
    Self.mixin = makeMixinMethod(Self);

    // Create a new class that directly inherits from a prototype.
    Self.create = function (proto) {
        var key;

        function Class() {
            var obj;

            // Create new object if the `new` keyword was not used.  Check
            // against `global` for Node.js, and `window` for browser side
            // JavaScript.
            if (this === (typeof window === 'undefined' ? global : window) ||
                    typeof this === 'undefined') {
                obj = objectCreate(Class.prototype);
            } else {
                obj = this;
            }

            // Call the prototypal constructor
            proto.apply(obj, arguments);

            // Return the constructed object if `new` keyword was not used.
            return obj;
        }

        Class.__super__ = Object.prototype;
        Class.extend = makeExtendMethod(Class);
        Class.mixin = makeMixinMethod(Class);

        Class.prototype = objectCreate(proto.prototype);
        Class.prototype.initialize = proto;

        return Class;
    };

    return Self;
}());

// Export as a module for Node.JS
if (typeof global !== 'undefined' && typeof module !== 'undefined') {
    module.exports = Self;
}
