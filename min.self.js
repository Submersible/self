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
 */var Self=function(){function c(){return c.extend.apply(c,arguments)}function d(b){return function(c){return a(b,c)}}function e(a){return function(b){var c;for(c in b)typeof a.prototype[c]=="undefined"&&!Object.hasOwnProperty(c)&&(a.prototype[c]=b[c])}}"use strict";var a,b;return c.VERSION="0.1.0",typeof Object.create=="function"?b=Object.create:b=function(a){function b(){}return b.prototype=a,new b},a=function(a,c){function g(){var a;return this===(typeof window=="undefined"?global:window)||typeof this=="undefined"?a=b(g.prototype):a=this,typeof a.initialize=="function"&&a.initialize.apply(a,arguments),a}var f;g.prototype=b(a.prototype),g.__super__=a.prototype,g.extend=d(g),g.mixin=e(g);for(f in c)Object.hasOwnProperty(f)||(typeof c[f]=="function"?function(a){g.prototype[f]=function(){var b=Array.prototype.slice.call(arguments,0);return b.splice(0,0,this),a.apply(this,b)}}(c[f]):g.prototype[f]=c[f]);return g},c.__super__=Object.prototype,c.extend=function(b,d){return typeof d=="undefined"?a(c,b):a(c.create(b),d)},c.mixin=e(c),c.create=function(a){function f(){var c;return this===(typeof window=="undefined"?global:window)||typeof this=="undefined"?c=b(f.prototype):c=this,a.apply(c,arguments),c}var c;return f.__super__=Object.prototype,f.extend=d(f),f.mixin=e(f),f.prototype=b(a.prototype),f.prototype.initialize=a,f},c}();typeof global!="undefined"&&typeof module!="undefined"&&(module.exports=Self);