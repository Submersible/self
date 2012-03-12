# Self - Python inspired class sugar!

## Why another OOP abstraction?

Self is class-based sugar inspired from Python syntax that's perfect for
continuation-passing style.  No more `var this = that;`!  The implicit `this`
variable is changed to an explicit `self` variable that your inner functions
inherit.  Self plays nicely with exisiting prototypal, and Backbone OOP.

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

    var Foo = Class({
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

    var Bar = Class({
        initialize: function (self) {
            Foo.call(self);
        }
    });

    Bar.mixin(Foo.prototype);

## Integrating With Other Forms of OOP

### Prototypal OOP

A prototype can be manually wrapped with `Self.create`.

    var EventEmitter = Self.create(require('events').EventEmitter.prototype);

Or use the shorthand and pass your base prototype as the first parameter in your
class definition.

    var Foobar = Self(EventEmitter.prototype, {
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
