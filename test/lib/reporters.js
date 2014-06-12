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

describe('lib/reporters', function () {
	var reporters;

	beforeEach(function () {
		reporters = require('../../lib/reporters');
	});

	it('should be an object', function () {
		assert.isObject(reporters);
	});

	it('should have a `loadReporters` method', function () {
		assert.isFunction(reporters.loadReporters);
	});

	describe('.loadReporters()', function () {

		beforeEach(function () {
			sinon.stub(reporters, 'loadReporter');
		});

		afterEach(function () {
			reporters.loadReporter.restore();
		});

		it('should call `loadReporter` for each reporter in the array', function () {
			reporters.loadReporters(['foo', 'bar']);
			assert.strictEqual(reporters.loadReporter.callCount, 2);
		});

		it('should return an array of the `loadReporter` results', function () {
			reporters.loadReporter.withArgs('foo').returns('baz');
			reporters.loadReporter.withArgs('bar').returns('qux');
			assert.deepEqual(reporters.loadReporters(['foo', 'bar']), ['baz', 'qux']);
		});

	});

	it('should have a `loadReporter` method', function () {
		assert.isFunction(reporters.loadReporter);
	});

	describe('.loadReporter()', function () {
		var fooModule, barModule;

		beforeEach(function () {
			fooModule = function () {};
			barModule = function () {};
		});

		it('should load in the expected internal module', function () {
			mockery.registerMock('../reporter/foo', fooModule);
			assert.strictEqual(reporters.loadReporter('foo'), fooModule);
		});

		it('should load in the expected npm module if present', function () {
			mockery.registerMock('pa11y-reporter-foo', fooModule);
			assert.strictEqual(reporters.loadReporter('foo'), fooModule);
		});

		it('should error when a reporter is not found', function () {
			assert.throws(reporters.loadReporter.bind(null, 'foo'), 'Reporter "foo" could not be loaded');
		});

		it('should error when a reporter module does not export a function', function () {
			mockery.registerMock('../reporter/foo', {});
			assert.throws(reporters.loadReporter.bind(null, 'foo'), 'Reporter "foo" is not a valid reporter, module must export a function');
		});

	});

});
