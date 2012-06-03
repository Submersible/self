/*jslint browser: true, newcap: true, nomen: true, vars: true */
/*global $: false, test: false, equal: false, Self: false, Backbone: false */

$(document).ready(function () {
    'use strict';

    test('test Self#intialization', function (t) {
        t.equal(typeof Self, 'function');
        t.equal(Self.VERSION, '0.2.2');

        t.equal(typeof Self.extend, 'function');
        t.equal(typeof Self.mixin, 'function');
        t.equal(typeof Self.create, 'function');

        t.equal(Self.__super__, Object.prototype);
    });

    test('test Self#noInheritence', function (t) {
        var def = {
            _property: 123,
            initialize: function (self, a, b, c) {
                t.equal(this, self);
                t.equal(a, 'a1');
                t.equal(b, 'b2');
                t.equal(c, 'c3');
                t.equal(self._property, 123);
                t.equal(self._another_property, 321);
                self.a = a;
                self.b = b;
                self.c = c;
            },
            _another_property: 321,
            getA: function (self) {
                t.equal(this, self);
                return self.a;
            },
            setA: function (self, a) {
                t.equal(this, self);
                self.a = a;
                return self.a;
            }
        };

        var Foo = Self.extend(def),
            Bar = Self(def);

        t.equal(typeof Foo, 'function');
        t.equal(typeof Bar, 'function');
        t.equal(typeof Foo.extend, 'function');
        t.equal(typeof Bar.extend, 'function');
        t.equal(typeof Foo.mixin, 'function');
        t.equal(typeof Bar.mixin, 'function');
        t.equal(typeof Foo.create, 'undefined');
        t.equal(typeof Bar.create, 'undefined');
        t.equal(Foo.__super__, Self.prototype);
        t.equal(Bar.__super__, Self.prototype);

        function testFoobarInstance(obj) {
            t.equal(typeof obj.getA, 'function');
            t.equal(typeof obj.setA, 'function');
            t.equal(obj.getA(), 'a1');
            t.equal(obj.setA('foo'), 'foo');
            t.equal(obj.getA(), 'foo');
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

    test('test Self#classInheritence', function (t) {
        var Foo = Self.extend({
            initialize: function (self, a) {
                t.equal(this, self);
                self.a = a;
                t.equal(self.a, 'a1');
            }
        });
        t.equal(Foo.__super__, Self.prototype);
        t.equal(typeof Foo.extend, 'function');
        t.equal(typeof Foo.mixin, 'function');

        var Bar = Foo.extend({
            initialize: function (self, a, b) {
                t.equal(this, self);
                self.b = b;
                Bar.__super__.initialize(a);
                t.equal(self.a, 'a1');
                t.equal(self.b, 'b2');
            }
        });
        t.equal(Bar.__super__, Foo.prototype);
        t.equal(typeof Bar.extend, 'function');
        t.equal(typeof Bar.mixin, 'function');

        var Hello = Bar.extend({
            initialize: function (self, a, b, c) {
                t.equal(this, self);
                self.c = c;
                Hello.__super__.initialize(a, b);
                t.equal(self.a, 'a1');
                t.equal(self.b, 'b2');
                t.equal(self.c, 'c3');
            }
        });
        t.equal(Hello.__super__, Bar.prototype);
        t.equal(typeof Hello.extend, 'function');
        t.equal(typeof Hello.mixin, 'function');

        var World = Hello.extend({
            initialize: function (self, a, b, c, d) {
                t.equal(this, self);
                self.d = d;
                World.__super__.initialize(a, b, c);
                t.equal(self.a, 'a1');
                t.equal(self.b, 'b2');
                t.equal(self.c, 'c3');
                t.equal(self.d, 'd4');
            }
        });
        t.equal(World.__super__, Hello.prototype);
        t.equal(typeof World.extend, 'function');
        t.equal(typeof World.mixin, 'function');

        var foo_n = new Foo('a1'),
            foo = Foo('a1'),
            bar_n = new Bar('a1', 'b2'),
            bar = Bar('a1', 'b2'),
            hello_n = new Hello('a1', 'b2', 'c3'),
            hello = Hello('a1', 'b2', 'c3'),
            world_n = new World('a1', 'b2', 'c3', 'd4'),
            world = World('a1', 'b2', 'c3', 'd4');
    });

    test('test Self#prototypalInheritence', function (t) {
        function Proto(a, b) {
            this.a = a;
            this.b = b;
            t.equal(a, 'a1');
            t.equal(b, 'b2');
        }

        Proto.prototype.setValue = function (value) {
            this.value = value;
            return this.value;
        };

        Proto.prototype.getValue = function () {
            return this.value;
        };

        var ProtoClass = Self.create(Proto);
        t.equal(ProtoClass.__super__, Object.prototype);
        t.equal(typeof ProtoClass.extend, 'function');
        t.equal(typeof ProtoClass.mixin, 'function');

        var proto_n = new ProtoClass('a1', 'b2'),
            proto = ProtoClass('a1', 'b2');

        t.equal(proto_n.a, 'a1');
        t.equal(proto_n.b, 'b2');
        t.equal(proto_n.setValue('foobar'), 'foobar');
        t.equal(proto_n.getValue(), 'foobar');
        t.equal(proto.a, 'a1');
        t.equal(proto.b, 'b2');
        t.equal(proto.setValue('foobar'), 'foobar');
        t.equal(proto.getValue(), 'foobar');

        var Foo = ProtoClass.extend({
            initialize: function (self, a, b, c) {
                t.equal(this, self);
                self.c = c;
                Foo.__super__.initialize(a, b);
                t.equal(a, 'a1');
                t.equal(b, 'b2');
                t.equal(c, 'c3');
            }
        });

        var foo_n = new Foo('a1', 'b2', 'c3'),
            foo = Foo('a1', 'b2', 'c3');

        t.equal(foo_n.a, 'a1');
        t.equal(foo.a, 'a1');
        t.equal(foo_n.setValue('foobar'), 'foobar');
        t.equal(foo_n.getValue(), 'foobar');
        t.equal(foo.setValue('foobar'), 'foobar');
        t.equal(foo.getValue(), 'foobar');
    });

    test('test Self#mixins', function (t) {
        var Foo = Self({
            a: 'a1',
            b: 'b2',
            d: 'd4'
        });

        t.equal(Foo.mixin({
            prototype: {
                a: 'hello',
                b: 'world',
                c: 'c3',
                d: 'foobar',
                e: 'e5'
            }
        }), Foo, 'Calling mixin returns the original class');

        var foo = Foo();

        t.equal(foo.a, 'a1');
        t.equal(foo.b, 'b2');
        t.equal(foo.c, 'c3');
        t.equal(foo.d, 'd4');
        t.equal(foo.e, 'e5');
    });

    test('test Self#namespacing', function (t) {
        var ns = {
            Main: Self({
                initialize: function (self) {
                    self.is_main = true;
                    t.ok(self.__inst__, 'Is an instance');
                    ns.Mixin.call(self, self);
                },
                mainMethod: function () {
                }
            }),
            Mixin: Self({
                initialize: function (self, wanted_self) {
                    self.is_mixin = true;
                    t.equal(self, wanted_self, 'Got the self we wanted');
                },
                mixinMethod: function () {
                }
            })
        };
        t.equal(ns.Main.mixin(ns.Mixin), ns.Main, 'Calling mixin returns the original class');

        var obj = ns.Main();
        t.ok(obj.is_main, 'Called the Main constructor');
        t.ok(obj.__inst__, 'Is an instance');
        t.ok(obj.is_mixin, 'Called the Mixin constructor');
        t.ok(typeof obj.mainMethod, 'function');
        t.ok(typeof obj.mixinMethod, 'function');

        var new_obj = new ns.Main();
        t.ok(new_obj.is_main, 'Called the Main constructor');
        t.ok(new_obj.is_mixin, 'Called the Mixin constructor');
        t.ok(typeof new_obj.mainMethod, 'function');
        t.ok(typeof new_obj.mixinMethod, 'function');
    });

    test('test Self#backbone', function (t) {
        var MyModel = Backbone.Model.extend({
            initialize: function (attr, opts) {
                this.c = opts.c;
                this.d = opts.d;
            }
        });

        var model = new MyModel({a: 'a1', b: 'b2'}, {c: 'c3', d: 'd4'});
        t.equal(model.attributes.a, 'a1');
        t.equal(model.attributes.b, 'b2');
        t.equal(model.c, 'c3');
        t.equal(model.d, 'd4');

        var MySelfModel = Self(MyModel, {
            initialize: function (self, attr, opts) {
                MySelfModel.__super__.initialize.call(self, attr, opts);
                self.e = opts.e;
                self.f = opts.f;
            }
        });

        var self_model = new MySelfModel({a: 'a1', b: 'b2'},
            {c: 'c3', d: 'd4', e: 'e5', f: 'f6'});
        t.equal(self_model.attributes.a, 'a1');
        t.equal(self_model.attributes.b, 'b2');
        t.equal(self_model.c, 'c3');
        t.equal(self_model.d, 'd4');
        t.equal(self_model.e, 'e5');
        t.equal(self_model.f, 'f6');

        var BlankModel = Self(Backbone.Model, {
            initialize: function (self, attr, opts) {
                MySelfModel.__super__.initialize.call(self, attr, opts);
                self.c = opts.c;
                self.d = opts.d;
            }
        });

        var blank_model = BlankModel({a: 'a1', b: 'b2'}, {c: 'c3', d: 'd4'});
        t.equal(blank_model.attributes.a, 'a1');
        t.equal(blank_model.attributes.b, 'b2');
        t.equal(blank_model.c, 'c3');
        t.equal(blank_model.d, 'd4');
    });
});
