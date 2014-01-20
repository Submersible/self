# Self—Python inspired class sugar! [![Build Status](https://secure.travis-ci.org/Submersible/self.png?branch=master)](http://travis-ci.org/munro/self)

[Downloads](#downloads) – [Documentation](#documentation) – [API](#api) –
[Integrating](#integrating-with-other-forms-of-oop) – [Performance](#performance)

## Why another OOP abstraction?

Self is class-based sugar inspired from Python syntax that's perfect for
continuation-passing style.  No more `var that = this;`!  The implicit `this`
variable is changed to an explicit `self` variable that your inner functions
inherit.  Self plays nicely with existing prototypal, and Backbone OOP.

    var Timer = Self(EventEmitter, {
        count: 0,
        constructor: function (self, interval) {
            Timer.__super__.constructor.call(self);

            setInterval(function () {
                self.tick();
            }, interval);
        },
        tick: function (self) {
            self.count += 1;
            self.emit('tick', self.count);
        }
    });

## Downloads

Tested to work against Internet Explorer 6+, Safari 3+, Google Chrome 1+, Firefox 3+, and Opera 10+!

[Development Version (1.0.0)](https://raw.github.com/munro/self/master/self.js) — 6.5 KiB, uncompressed with comments.

[Production Version (1.0.0)](https://raw.github.com/munro/self/master/self.min.js) — 715 bytes, minified and gzipped.

## Documentation

### Inheritance

To construct a base class, pass in a class definition to `Self(...)`.  The
constructed class may be extended further by calling with `<Class>.extend(...)`
method with a subclass definition.  A class definition is an object containing
properties and methods.  Attached to every class is a `__super__` property that
points the parent class's prototype.

```javascript
var Self = require('self');

var Animal = Self({
});

var Dog = Animal.extend({
});

var Beagle = Dog.extend({
});

Beagle.__super__ === Dog.prototype; // true
```

For JSLint compliance, a base class can be created using `Self.extend(...)`.

```javascript
var Animal = Self.extend({
});
```

### Constructors

The constructor for a class is the `constructor` method.  Inside the constructor
function, parent and mixin constructors can be called.  The `new` keyword may be
omitted when instantiating an object.

```javascript
var Name = Self({
    name_prefix: 'Sir',
    constructor: function (self, name) {
        self._name = name;
    },
    name: function (self, name) {
        if (typeof name !== 'undefined') {
            self._name = name;
        }
        return self.name_prefix + ' ' + self.name;
    }
});

var NameAge = Name.extend({
    constructor: function (self, name, age) {
        NameAge.__super__.constructor.call(self, name);
        self.age = age;
    },
    age: function (self, age) {
        if (typeof age !== 'undefined') {
            self._age = age;
        }
        return self.age;
    }
});

var name = new Name(),
    name_age = NameAge();
```

### Static Properties

Static properties on a class will be inherited by the extending class.  Except
they're not prototypal, so any static definitions will be copied to the child class
when `extend` is called.  Defining a static property is as simple as setting
a property on the class, or it can be done by using the sugar `.staticProps`
method.

```javascript
var Foo = Self({
}).staticProps({
    classMethod: function () {
        return 'ima class!';
    }
});

var Bar = Foo.extend({
});

Bar.otherStaticMethod = function () {
    return 'ima static method on Bar!';
};
```

### Mixin

Mixins can be used for multiple inheritance.  To mixin a object of properties
(not a class), call `<Class>.mixin(object)`.  When mixing in, only properties
not already in the existing class will be copied in.

```javascript
var Foo = Self({
    _foo: 'foo',
    constructor: function (self) {
        console.log('Foo has been mixed in to: ' + self.name + '!');
    },
    foo: function (self, foo) {
        if (typeof foo !== 'undefined') {
            self._foo = foo;
        }
        return self._foo;
    }
});

var Bar = Self({
    constructor: function (self) {
        Foo.call(self);
    }
});

Bar.mixin(Foo);
```

## API

### Module

#### var Class = Self(definition)
#### var Class = Self.extend(definition)

Creates a new class.  `Self()` is shorthand for `Self.extend()`.

#### var Class = Self(prototype, definition)

Shorthand for `Self.extend(Self.create(prototype), definition)`.

#### var Class = Self.create(prototype)

Wraps a prototypal constructor as a Self class, returning the created class.

#### Self.VERSION

Property indicating the version of Self.

----------

### Class static methods & properties 

#### var inst = Class(args...)

Calling returns an instance of the class, passing any arguments to the
`constructor` method.

#### var Child = Class.extend(definition)

Extends the class with a new class definition, returning the created class.

#### Class.staticProps(definition) === Class

Sugar method for defining static properties on a class.

#### Class.mixin(AnotherClass) === Class

Copies another class's definitions into the current class.

#### Class.\_\_super\_\_

Parent class

----------

### Instance properties

#### inst.\_\_class\_\_

The class that created this instance.

#### inst.\_\_super\_\_

The parent class of this instance, same as `inst.__class__.__super__`.

## Integrating With Other Forms of OOP

### Prototypal OOP

A prototype can be manually wrapped with `Self.create`.

```javascript
var EventEmitter = Self.create(require('events').EventEmitter);
```

Or use the shorthand and pass your base prototype as the first parameter in your
class definition.

```javascript
var Foobar = Self(EventEmitter, {
    constructor: function (self) {
        Foobar.__super__.constructor.call(self); // Calls EventEmitter's constructor
    }
});
```

### Backbone

Backbone's `initialize` function is not the constructor.  It's a
[call super method](http://en.wikipedia.org/wiki/Call_super), which gets called
by the real constructor.  So as long as you keep the constructor semantics the
same, you'll be fine!

```javascript
var MyModel = Self(Backbone.Model, {
    initialize: function (self, attr, opts) {
        MyModel.__super__.initialize.call(self, attr, opts);
    }
});
```

I recommend extending the Backbone library into your own namespace, so you don't
have to call Self on the library everytime.  It also provides a place for you to
roll your own base class logic.

```javascript
var mvc = _.reduce(Backbone, function (obj, value, key) {
    obj[key] = (value.prototype && _.keys(value.prototype).length) ? Self.create(value) : value;
    return obj;
}, {});

mvc.Collection = mvc.Collection.extend({
});
```

## Performance

Since Self.js wraps every method with a function that unshifts the context onto
your method's arguments, there *is* overhead.  You will have to weigh the
performance impact vs the convenience of an explicit `self` variable.

For me, an empty Self method is 2 orders of magnitude slower than an empty
prototypal method.  Keep in mind this overhead may be negligible compared to the
time it takes to run the code in your method.  Below are the actual timings of
calling those methods on my machine.

* Without Self — 6 nanoseconds/call
* With Self —  610 nanoseconds/call

To run these benchmarks yourself, clone this project and run:
`npm install -d && node ./benchmarks.js`

### Thoughts

It should be possible to macro Self methods in-place (only in Node.js), thus
removing the overhead of wrapping every method.  If anyone is interested in
this, please let me know and we can investigate it!
