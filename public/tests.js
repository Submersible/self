$(document).ready(function(){
    test('Self intialization', function () {
        equal(typeof Self, 'function');
        equal(Self.VERSION, '0.1.2');

        equal(typeof Self.extend, 'function');
        equal(typeof Self.mixin, 'function');
        equal(typeof Self.create, 'function');

        equal(Self.__super__, Object.prototype);
    });

    test('Self noInheritence', function () {
        var def = {
            _property: 123,
            initialize: function (self, a, b, c) {
                equal(this, self);
                equal(a, 'a1');
                equal(b, 'b2');
                equal(c, 'c3');
                equal(self._property, 123);
                equal(self._another_property, 321);
                self.a = a;
                self.b = b;
                self.c = c;
            },
            _another_property: 321,
            getA: function (self) {
                equal(this, self);
                return self.a;
            },
            setA: function (self, a) {
                equal(this, self);
                self.a = a;
                return self.a;
            }
        };

        var Foo = Self.extend(def),
            Bar = Self(def);

        equal(typeof Foo, 'function');
        equal(typeof Bar, 'function');
        equal(typeof Foo.extend, 'function');
        equal(typeof Bar.extend, 'function');
        equal(typeof Foo.mixin, 'function');
        equal(typeof Bar.mixin, 'function');
        equal(typeof Foo.create, 'undefined');
        equal(typeof Bar.create, 'undefined');
        equal(Foo.__super__, Self.prototype);
        equal(Bar.__super__, Self.prototype);

        function testFoobarInstance(obj) {
            equal(typeof obj.getA, 'function');
            equal(typeof obj.setA, 'function');
            equal(obj.getA(), 'a1');
            equal(obj.setA('foo'), 'foo');
            equal(obj.getA(), 'foo');
        }

        var a = new Foo('a1', 'b2', 'c3'),
            b = Foo('a1', 'b2', 'c3'),
            c = new Bar('a1', 'b2', 'c3'),
            d = Bar('a1', 'b2', 'c3');

        testFoobarInstance(a);
        testFoobarInstance(b);
        testFoobarInstance(c);
        testFoobarInstance(d);
    });

    test('Self classInheritence', function () {
        var Foo = Self.extend({
            initialize: function (self, a) {
                equal(this, self);
                self.a = a;
                equal(self.a, 'a1');
            }
        });
        equal(Foo.__super__, Self.prototype);
        equal(typeof Foo.extend, 'function');
        equal(typeof Foo.mixin, 'function');

        var Bar = Foo.extend({
            initialize: function (self, a, b) {
                equal(this, self);
                self.b = b;
                Bar.__super__.initialize(a);
                equal(self.a, 'a1');
                equal(self.b, 'b2');
            }
        });
        equal(Bar.__super__, Foo.prototype);
        equal(typeof Bar.extend, 'function');
        equal(typeof Bar.mixin, 'function');

        var Hello = Bar.extend({
            initialize: function (self, a, b, c) {
                equal(this, self);
                self.c = c;
                Hello.__super__.initialize(a, b);
                equal(self.a, 'a1');
                equal(self.b, 'b2');
                equal(self.c, 'c3');
            }
        });
        equal(Hello.__super__, Bar.prototype);
        equal(typeof Hello.extend, 'function');
        equal(typeof Hello.mixin, 'function');

        var World = Hello.extend({
            initialize: function (self, a, b, c, d) {
                equal(this, self);
                self.d = d;
                World.__super__.initialize(a, b, c);
                equal(self.a, 'a1');
                equal(self.b, 'b2');
                equal(self.c, 'c3');
                equal(self.d, 'd4');
            }
        });
        equal(World.__super__, Hello.prototype);
        equal(typeof World.extend, 'function');
        equal(typeof World.mixin, 'function');

        var foo_n = new Foo('a1'),
            foo = Foo('a1'),
            bar_n = new Bar('a1', 'b2'),
            bar = Bar('a1', 'b2'),
            hello_n = new Hello('a1', 'b2', 'c3'),
            hello = Hello('a1', 'b2', 'c3'),
            world_n = new World('a1', 'b2', 'c3', 'd4'),
            world = World('a1', 'b2', 'c3', 'd4');
    });

    test('test Self#prototypalInheritence', function () {
        function Proto(a, b) {
            this.a = a;
            this.b = b;
            equal(a, 'a1');
            equal(b, 'b2');
        }

        Proto.prototype.setValue = function (value) {
            this.value = value;
            return this.value;
        };

        Proto.prototype.getValue = function () {
            return this.value;
        };


        var ProtoClass = Self.create(Proto);
        equal(ProtoClass.__super__, Object.prototype);
        equal(typeof ProtoClass.extend, 'function');
        equal(typeof ProtoClass.mixin, 'function');

        var proto_n = new ProtoClass('a1', 'b2');
            proto = ProtoClass('a1', 'b2');

        equal(proto_n.a, 'a1');
        equal(proto_n.b, 'b2');
        equal(proto_n.setValue('foobar'), 'foobar');
        equal(proto_n.getValue(), 'foobar');
        equal(proto.a, 'a1');
        equal(proto.b, 'b2');
        equal(proto.setValue('foobar'), 'foobar');
        equal(proto.getValue(), 'foobar');


        var Foo = ProtoClass.extend({
            initialize: function (self, a, b, c) {
                equal(this, self);
                self.c = c;
                Foo.__super__.initialize(a, b);
                equal(a, 'a1');
                equal(b, 'b2');
                equal(c, 'c3');
            }
        });


        var foo_n = new Foo('a1', 'b2', 'c3'),
            foo = Foo('a1', 'b2', 'c3');

        equal(foo_n.a, 'a1');
        equal(foo.a, 'a1');
        equal(foo_n.setValue('foobar'), 'foobar');
        equal(foo_n.getValue(), 'foobar');
        equal(foo.setValue('foobar'), 'foobar');
        equal(foo.getValue(), 'foobar');
    });

    test('Self mixins', function () {
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

        equal(foo.a, 'a1');
        equal(foo.b, 'b2');
        equal(foo.c, 'c3');
        equal(foo.d, 'd4');
        equal(foo.e, 'e5');
    });
});
