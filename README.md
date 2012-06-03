# Self — Python inspired class sugar! [![Build Status](https://secure.travis-ci.org/munro/self.png?branch=master)](http://travis-ci.org/munro/self)

## Why another OOP abstraction?

Self is class-based sugar inspired from Python syntax that's perfect for
continuation-passing style.  No more `var that = this;`!  The implicit `this`
variable is changed to an explicit `self` variable that your inner functions
inherit.  Self plays nicely with existing prototypal, and Backbone OOP.

    var Timer = Self(EventEmitter, {
        count: 0,
        initialize: function (self, interval) {
            Timer.__super__.initialize.call(self);

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

Tested to work against Internet Explorer 5.5+, Safari 3+, Google Chrome 4+, Firefox 3+, and Opera 10+!

[Development Version (0.2.2)](https://raw.github.com/munro/self/master/self.js) — 6.3 KiB, uncompressed with comments.

[Production Version (0.2.2)](https://raw.github.com/munro/self/master/self.min.js) — 704 bytes, minified and gzipped.

## Documentation

### Inheritance

To construct a base class, pass in a class definition to `Self(...)`.  The
constructed class may be extended further by calling with `<Class>.extend(...)`
method with a subclass definition.  A class definition is an object containing
properties and methods.  Attached to every class is a `__super__` property that
points the parent class's prototype.

    var Self = require('self');

    var Animal = Self({
    });

    var Dog = Animal.extend({
    });

    var Beagle = Dog.extend({
    });

    Beagle.__super__ === Dog.prototype; // true


For JSLint compliance, a base class can be created using `Self.extend(...)`.

    var Animal = Self.extend({
    });

### Constructors

The constructor for a class is the `initialize` method.  Inside the constructor,
parent and mixin constructors can be called.  The `new` keyword may be omitted
when instantiating an object.

    var Name = Self({
        name_prefix: 'Sir',
        initialize: function (self, name) {
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
        initialize: function (self, name, age) {
            NameAge.__super__.initialize.call(self, name);
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

### Mixin

Mixins can be used for multiple inheritance.  To mixin a object of properties
(not a class), call `<Class>.mixin(object)`.  When mixing in, only properties
not already in the existing class will be copied in.

    var Foo = Self({
        _foo: 'foo',
        initialize: function (self) {
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
        initialize: function (self) {
            Foo.call(self);
        }
    });

    Bar.mixin(Foo);

## API

* `Self` module
    * `Self({Object} definition)` — Shorthand for
        `.extend({Object} definition)`.
    * `Self({Object} prototype, {Object} definition)` — Shorthand for
        `.extend(Self.create({Object} prototype), {Object} definition)`.
    * `.VERSION` — Property indicating the version of Self.
    * `.__super__` — Super prototype of `Self`, which is `Object.prototype`.
    * `.extend({Object} definition) -> {Class}` — Extends the class with a new
        class definition, returning the created class.
    * `.mixin({Class})` — Copies another class's definitions into the Self base
        class.
    * `.create({Constructor}) -> {Class}` — Wraps a prototypal constructor as a
        Self class, returning the created class.

* `{Class}` functor
    * Calling returns `{Class Instance}`, passing any arguments to the
        `initialize` method definition.
    * `.__super__`
    * `.extend({Object} definition) -> {Class}` — Same as above, extends the
        class, returning the created class.
    * `.mixin({Class}) -> {Class}` — Same as above, copies class definitions
        from mixin class into the current class.  Returns the same class for
        chaining.

* `{Class Instance}` instantiated class object
    * Self does not add any extra methods aside from what was passed into the
      class definition.

## Integrating With Other Forms of OOP

### Prototypal OOP

A prototype can be manually wrapped with `Self.create`.

    var EventEmitter = Self.create(require('events').EventEmitter);

Or use the shorthand and pass your base prototype as the first parameter in your
class definition.

    var Foobar = Self(EventEmitter, {
        initialize: function (self) {
            Foobar.__super__.initialize.call(self); // Calls EventEmitter's constructor
        }
    });

### Backbone

    var MyModel = Self(Backbone.Model, {
        initialize: function (self, attr, opts) {
            MyModel.__super__.initialize.call(self, attr, opts);
        }
    });

## Performance

Since Self.js wraps every method with a function that unshifts the context onto
your method's arguments, there *is* overhead.  Yo u will have to weigh the
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
