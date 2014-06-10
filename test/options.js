// This file is part of pa11y.
// 
// pa11y is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// pa11y is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with pa11y.  If not, see <http://www.gnu.org/licenses/>.

/* jshint maxstatements: false, maxlen: false */
/* global afterEach, beforeEach, describe, it */
'use strict';

var assert = require('proclaim');
var mockery = require('mockery');

describe('options', function () {
	var options;

	beforeEach(function () {
		mockery.enable({
			useCleanCache: true,
			warnOnUnregistered: false,
			warnOnReplace: false
		});
		options = require('../lib/options');
	});

	afterEach(function () {
		mockery.deregisterAll();
		mockery.disable();
	});

	it('should be an object', function () {
		assert.isObject(options);
	});

	it('should have a `applyDefaults` method', function () {
		assert.isFunction(options.applyDefaults);
	});

	describe('.applyDefaults()', function () {

		it('should return an object', function () {
			assert.isObject(options.applyDefaults({}));
		});

		it('should default the `config` option to an empty object', function () {
			assert.deepEqual(options.applyDefaults({}).config, {});
		});

		it('should default the `rules` option to an empty array', function () {
			assert.deepEqual(options.applyDefaults({}).rules, []);
		});

	});

	it('should have a `resolveRules` method', function () {
		assert.isFunction(options.resolveRules);
	});

	describe('.resolveRules()', function () {
		var fooSuite;

		beforeEach(function () {
			fooSuite = {
				rules: [
					'abc',
					'def'
				]
			};
			mockery.registerMock('../suite/foo', fooSuite);
		});

		it('should not modify the rules when no suite is specified', function () {
			var opts = {
				rules: ['foo', 'bar', 'baz']
			};
			options.resolveRules(opts);
			assert.deepEqual(opts.resolvedRules, ['foo', 'bar', 'baz']);
		});

		it('should return the expected rules when a suite is specified', function () {
			var opts = {
				rules: [],
				suite: 'foo'
			};
			options.resolveRules(opts);
			assert.deepEqual(opts.resolvedRules, ['abc', 'def']);
		});

		it('should combine rules from a suite with specified rules', function () {
			var opts = {
				rules: ['foo', 'bar'],
				suite: 'foo'
			};
			options.resolveRules(opts);
			assert.deepEqual(opts.resolvedRules, ['foo', 'bar', 'abc', 'def']);
		});

		it('should de-duplicate rules when they appear in both a suite and specified rules', function () {
			var opts = {
				rules: ['foo', 'bar', 'abc'],
				suite: 'foo'
			};
			options.resolveRules(opts);
			assert.deepEqual(opts.resolvedRules, ['foo', 'bar', 'abc', 'def']);
		});

		it('should exclude rules when specified', function () {
			var opts = {
				exclude: ['foo', 'abc'],
				rules: ['foo', 'bar'],
				suite: 'foo'
			};
			options.resolveRules(opts);
			assert.deepEqual(opts.resolvedRules, ['bar', 'def']);
		});

		it('should error when a suite is not found', function () {
			var opts = {
				rules: [],
				suite: 'bar'
			};
			assert.throws(options.resolveRules.bind(null, opts), 'Suite "bar" could not be loaded');
		});

	});

});
