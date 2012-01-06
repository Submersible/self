var assert = require('assert'),
    Self = require('../lib/self');

exports['test Self#intialization'] = function () {
    assert.equal(typeof Self, 'function');
    assert.equal(Self.VERSION, '0.1.0');

    assert.equal(typeof Self.extend, 'function');
    assert.equal(typeof Self.mixin, 'function');
    assert.equal(typeof Self.create, 'function');

    assert.equal(Self.__super__, Object.prototype);
};

exports['test Self#noInheritence'] = function () {
    var def = {
        _property: 123,
        initialize: function (self, a, b, c) {
            assert.equal(this, self);
            assert.equal(a, 'a1');
            assert.equal(b, 'b2');
            assert.equal(c, 'c3');
            assert.equal(self._property, 123);
            assert.equal(self._another_property, 321);
            self.a = a;
            self.b = b;
            self.c = c;
        },
        _another_property: 321,
        getA: function (self) {
            assert.equal(this, self);
            return self.a;
        },
        setA: function (self, a) {
            assert.equal(this, self);
            self.a = a;
            return self.a;
        }
    };
    
    var Foo = Self.extend(def),
        Bar = Self(def);

    assert.equal(typeof Foo, 'function');
    assert.equal(typeof Bar, 'function');
    assert.equal(typeof Foo.extend, 'function');
    assert.equal(typeof Bar.extend, 'function');
    assert.equal(typeof Foo.mixin, 'function');
    assert.equal(typeof Bar.mixin, 'function');
    assert.equal(typeof Foo.create, 'undefined');
    assert.equal(typeof Bar.create, 'undefined');
    assert.equal(Foo.__super__, Self.prototype);
    assert.equal(Bar.__super__, Self.prototype);

    function testFoobarInstance(obj) {
        assert.equal(typeof obj.getA, 'function');
        assert.equal(typeof obj.setA, 'function');
        assert.equal(obj.getA(), 'a1');
        assert.equal(obj.setA('foo'), 'foo');
        assert.equal(obj.getA(), 'foo');
    }

    var a = new Foo('a1', 'b2', 'c3'),
        b = Foo('a1', 'b2', 'c3'),
        c = new Bar('a1', 'b2', 'c3'),
        d = Bar('a1', 'b2', 'c3');

    testFoobarInstance(a);
    testFoobarInstance(b);
    testFoobarInstance(c);
    testFoobarInstance(d);
};

exports['test Self#classInheritence'] = function () {
    var Foo = Self.extend({
        initialize: function (self, a) {
            assert.equal(this, self);
            self.a = a;
            assert.equal(self.a, 'a1');
        }
    });
    assert.equal(Foo.__super__, Self.prototype);
    assert.equal(typeof Foo.extend, 'function');
    assert.equal(typeof Foo.mixin, 'function');

    var Bar = Foo.extend({
        initialize: function (self, a, b) {
            assert.equal(this, self);
            self.b = b;
            Bar.__super__.initialize(a);
            assert.equal(self.a, 'a1');
            assert.equal(self.b, 'b2');
        }
    });
    assert.equal(Bar.__super__, Foo.prototype);
    assert.equal(typeof Bar.extend, 'function');
    assert.equal(typeof Bar.mixin, 'function');

    var Hello = Bar.extend({
        initialize: function (self, a, b, c) {
            assert.equal(this, self);
            self.c = c;
            Hello.__super__.initialize(a, b);
            assert.equal(self.a, 'a1');
            assert.equal(self.b, 'b2');
            assert.equal(self.c, 'c3');
        }
    });
    assert.equal(Hello.__super__, Bar.prototype);
    assert.equal(typeof Hello.extend, 'function');
    assert.equal(typeof Hello.mixin, 'function');

    var World = Hello.extend({
        initialize: function (self, a, b, c, d) {
            assert.equal(this, self);
            self.d = d;
            World.__super__.initialize(a, b, c);
            assert.equal(self.a, 'a1');
            assert.equal(self.b, 'b2');
            assert.equal(self.c, 'c3');
            assert.equal(self.d, 'd4');
        }
    });
    assert.equal(World.__super__, Hello.prototype);
    assert.equal(typeof World.extend, 'function');
    assert.equal(typeof World.mixin, 'function');

    var foo_n = new Foo('a1'),
        foo = Foo('a1'),
        bar_n = new Bar('a1', 'b2'),
        bar = Bar('a1', 'b2'),
        hello_n = new Hello('a1', 'b2', 'c3'),
        hello = Hello('a1', 'b2', 'c3'),
        world_n = new World('a1', 'b2', 'c3', 'd4'),
        world = World('a1', 'b2', 'c3', 'd4');
};

exports['test Self#prototypalInheritence'] = function () {
    function Proto(a, b) {
        this.a = a;
        this.b = b;
        assert.equal(a, 'a1');
        assert.equal(b, 'b2');
    }

    Proto.prototype.setValue = function (value) {
        this.value = value;
        return this.value;
    };

    Proto.prototype.getValue = function () {
        return this.value;
    };


    var ProtoClass = Self.create(Proto);
    assert.equal(ProtoClass.__super__, Object.prototype);
    assert.equal(typeof ProtoClass.extend, 'function');
    assert.equal(typeof ProtoClass.mixin, 'function');

    var proto_n = new ProtoClass('a1', 'b2');
        proto = ProtoClass('a1', 'b2');

    assert.equal(proto_n.a, 'a1');
    assert.equal(proto_n.b, 'b2');
    assert.equal(proto_n.setValue('foobar'), 'foobar');
    assert.equal(proto_n.getValue(), 'foobar');
    assert.equal(proto.a, 'a1');
    assert.equal(proto.b, 'b2');
    assert.equal(proto.setValue('foobar'), 'foobar');
    assert.equal(proto.getValue(), 'foobar');


    var Foo = ProtoClass.extend({
        initialize: function (self, a, b, c) {
            assert.equal(this, self);
            self.c = c;
            Foo.__super__.initialize(a, b);
            assert.equal(a, 'a1');
            assert.equal(b, 'b2');
            assert.equal(c, 'c3');
        }
    });


    var foo_n = new Foo('a1', 'b2', 'c3'),
        foo = Foo('a1', 'b2', 'c3');

    assert.equal(foo_n.a, 'a1');
    assert.equal(foo.a, 'a1');
    assert.equal(foo_n.setValue('foobar'), 'foobar');
    assert.equal(foo_n.getValue(), 'foobar');
    assert.equal(foo.setValue('foobar'), 'foobar');
    assert.equal(foo.getValue(), 'foobar');
};

exports['test Self#mixins'] = function () {
    var Foo = Self({
        a: 'a1',
        b: 'b2',
        d: 'd4'
    });

    Foo.mixin({
        a: 'hello',
        b: 'world',
        c: 'c3',
        d: 'foobar',
        e: 'e5'
    });

    var foo = Foo();

    assert.equal(foo.a, 'a1');
    assert.equal(foo.b, 'b2');
    assert.equal(foo.c, 'c3');
    assert.equal(foo.d, 'd4');
    assert.equal(foo.e, 'e5');
};
