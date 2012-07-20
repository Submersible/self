/* Self v1.0.0 https://github.com/munro/self
 * https://github.com/munro/self/blob/master/LICENSE */

/*jslint browser: true, nomen: true, forin: true */

var Self = (function () {
    'use strict';

    var makeClass, objectCreate;

    // Base class, and convenience function for extending the Base
    function Self() {
        return Self.extend.apply(Self, arguments);
    }

    Self.VERSION = '1.0.0';

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

    // Wrap an existing method so that it unshifts self onto the arguments
    function wrapMethodWithSelf(fn) {
        return function () {
            // Push `this` in front of arguments before calling
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(this);
            return fn.apply(this, args);
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
        return function (Mixin) {
            var key;

            for (key in Mixin) {
                if (Mixin.hasOwnProperty(key) && key !== 'prototype' && key !== '__super__' && key !== 'extend' && key !== 'mixin' && key !== 'staticProps') {
                    Class[key] = Mixin[key];
                }
            }

            for (key in Mixin.prototype) {
                if (typeof Class.prototype[key] === 'undefined' &&
                        !Object.hasOwnProperty(key)) {
                    Class.prototype[key] = Mixin.prototype[key];
                }
            }

            return Class;
        };
    }

    function makeStaticPropsMethod(Class) {
        return function (def) {
            var key;

            def = def || {};

            for (key in def) {
                if (def.hasOwnProperty(key)) {
                    Class[key] = def[key];
                }
            }

            return Class;
        };
    }

    // Create a prototype object from a Parent class, and a class definition.
    // In the created prototype, all class methods will be wrapped to
    // automatically insert the `self` variable when called.
    makeClass = function (Parent, def) {
        var key;

        function Class() {
            var obj;

            // Call the Mixin constructor
            if (this && this.__class__) {
                Class.prototype.constructor.apply(this, arguments);
                return this;
            }

            // Create new object if the `new` keyword was not used.  Check
            // against `global` for Node.js, and `window` for browser side
            // JavaScript.
            if (this instanceof Class) {
                obj = this;
            } else {
                obj = objectCreate(Class.prototype);
            }

            obj.__class__ = Class;
            obj.__super__ = Parent.prototype;

            // Call the constructor
            if (typeof obj.constructor === 'function') {
                obj.constructor.apply(obj, arguments);
            }

            // Return the constructed object if `new` keyword was not used.
            return obj;
        }

        // Inherit static properties
        for (key in Parent) {
            if (Parent.hasOwnProperty(key) && Parent[key] !== Self[key]) {
                Class[key] = Parent[key];
            }
        }

        // Use differential inheritance
        Class.prototype = objectCreate(Parent.prototype);

        // Helper property & methods
        Class.__super__ = Parent.prototype;
        Class.extend = makeExtendMethod(Class);
        Class.mixin = makeMixinMethod(Class);
        Class.staticProps = makeStaticPropsMethod(Class);

        // Copy class definition into prototype
        for (key in def) {
            if (!Object.hasOwnProperty(key)) {
                if (typeof def[key] === 'function') {
                    Class.prototype[key] = wrapMethodWithSelf(def[key]);
                } else {
                    Class.prototype[key] = def[key];
                }
            }
        }

        return Class;
    };

    // Manually setup the base class
    Self.__super__ = Object.prototype;

    // For the sake of convenience, allow the Self.extend to instead directly 
    // inherit from a prototype, instead of the Self class itself.
    Self.extend = function (arg1, arg2) {
        // `arg1` is the class definition
        if (typeof arg2 === 'undefined') {
            return makeClass(Self, arg1);
        }
        // Extend prototype, `arg1` is the prototype, `arg2` is the class definition
        return makeClass(Self.create(arg1), arg2);
    };

    // I don't recommend mixing into the base class!  But for the sake of
    // consistency... :)
    Self.mixin = makeMixinMethod(Self);

    // Create a new class that directly inherits from a prototype.
    Self.create = function (Proto) {
        var key;

        function Class() {
            var obj;

            // Create a new object if the `new` keyword was not used.  We can
            // detected this by checking to see if the context of this function
            // is an instance of itself (the constructor).
            if (this instanceof Class || (this && this.__class__)) {
                obj = this;
            } else {
                obj = objectCreate(Class.prototype);
            }

            // Call the Prototypal constructor
            Proto.apply(obj, arguments);

            // Return the constructed object if `new` keyword was not used.
            return obj;
        }

        // Inherit static properties
        for (key in Proto) {
            if (Proto.hasOwnProperty(key)) {
                Class[key] = Proto[key];
            }
        }

        Class.__super__ = Object.prototype;
        Class.extend = makeExtendMethod(Class);
        Class.mixin = makeMixinMethod(Class);
        Class.staticProps = makeStaticPropsMethod(Class);
        Class.prototype = objectCreate(Proto.prototype);

        return Class;
    };

    return Self;
}());

// Export as a module for Node.js
if (typeof module !== 'undefined') {
    module.exports = Self;
}
