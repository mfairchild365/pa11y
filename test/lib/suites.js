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
var sinon = require('sinon');

describe('lib/suites', function () {
	var suites;

	beforeEach(function () {
		mockery.enable({
			useCleanCache: true,
			warnOnUnregistered: false,
			warnOnReplace: false
		});
		suites = require('../../lib/suites');
	});

	afterEach(function () {
		mockery.deregisterAll();
		mockery.disable();
	});

	it('should be an object', function () {
		assert.isObject(suites);
	});

	it('should have a `loadSuites` method', function () {
		assert.isFunction(suites.loadSuites);
	});

	describe('.loadSuites()', function () {

		beforeEach(function () {
			sinon.stub(suites, 'loadSuite');
		});

		afterEach(function () {
			suites.loadSuite.restore();
		});

		it('should call `loadSuite` for each rule in the array', function () {
			suites.loadSuites(['foo', 'bar']);
			assert.strictEqual(suites.loadSuite.callCount, 2);
		});

		it('should return an array of the `loadSuite` results', function () {
			suites.loadSuite.withArgs('foo').returns('baz');
			suites.loadSuite.withArgs('bar').returns('qux');
			assert.deepEqual(suites.loadSuites(['foo', 'bar']), ['baz', 'qux']);
		});

	});

	it('should have a `loadSuite` method', function () {
		assert.isFunction(suites.loadSuite);
	});

	describe('.loadSuite()', function () {

		beforeEach(function () {
			sinon.stub(suites, 'applyDefaults');
		});

		afterEach(function () {
			suites.applyDefaults.restore();
		});

		it('should load in the expected module and apply suite defaults to it', function () {
			var fooSuite = {};
			mockery.registerMock('../suite/foo', 'foo');
			suites.applyDefaults.withArgs('foo').returns(fooSuite);
			assert.strictEqual(suites.loadSuite('foo'), fooSuite);
		});

		it('should error when a suite is not found', function () {
			assert.throws(suites.loadSuite.bind(null, ['foo']), 'Suite "foo" could not be loaded');
		});

	});

	it('should have an `applyDefaults` method', function () {
		assert.isFunction(suites.applyDefaults);
	});

	describe('.applyDefaults()', function () {

		it('should return an object', function () {
			assert.isObject(suites.applyDefaults({}));
		});

		it('should default the `config` option to an empty object', function () {
			assert.deepEqual(suites.applyDefaults({}).config, {});
		});

		it('should default the `rules` option to an empty array', function () {
			assert.deepEqual(suites.applyDefaults({}).rules, []);
		});

	});

});
