var Self = require('./self'),
    microtime = require('microtime');

var COUNT = 0xfffff;

function Proto() {
}

Proto.prototype.method = function () {
};

var SelfClass = Self({
    method: function (self) {
    }
});

var proto = new Proto(),
    self_class = SelfClass();

// Benchmark prototypal oop
var start = microtime.now();
for (var i = 0; i < COUNT; i += 1) {
    proto.method();
}
var duration = microtime.now() - start;
console.log('Prototypal:', COUNT / (duration / 1000000), 'ops/sec');
console.log('           ', duration / COUNT * 1000, 'ns/ops');
console.log('');

// Benchmark self
start = microtime.now();
for (var i = 0; i < COUNT; i += 1) {
    self_class.method();
}
var s_duration = microtime.now() - start;
console.log('Self:      ', COUNT / (s_duration / 1000000), 'ops/sec');
console.log('           ', s_duration / COUNT * 1000, 'ns/ops');
console.log('');

// Ratio
console.log('Proto/Self:', Math.round(duration / s_duration * 10000) / 100, '% efficiency');
