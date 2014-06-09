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

describe('rules', function () {
	var rules;

	beforeEach(function () {
		mockery.enable({
			useCleanCache: true,
			warnOnUnregistered: false,
			warnOnReplace: false
		});
		rules = require('../lib/rules');
	});

	afterEach(function () {
		mockery.deregisterAll();
		mockery.disable();
	});

	it('should be an object', function () {
		assert.isObject(rules);
	});

	it('should have a `load` method', function () {
		assert.isFunction(rules.load);
	});

	describe('.load()', function () {
		var fooModule, barModule, bazModule;

		beforeEach(function () {
			fooModule = sinon.spy();
			barModule = sinon.spy();
			bazModule = sinon.spy();
		});

		it('should load in the expected internal modules', function () {
			mockery.registerMock('../rule/foo', fooModule);
			mockery.registerMock('../rule/bar', barModule);
			assert.deepEqual(rules.load(['foo', 'bar']), [fooModule, barModule]);
		});

		it('should load in the expected external modules if present', function () {
			mockery.registerMock('foo', fooModule);
			mockery.registerMock('bar', barModule);
			assert.deepEqual(rules.load(['foo', 'bar']), [fooModule, barModule]);
		});

		it('should load in the expected npm modules if present', function () {
			mockery.registerMock('pa11y-rule-foo', fooModule);
			mockery.registerMock('pa11y-rule-bar', barModule);
			assert.deepEqual(rules.load(['foo', 'bar']), [fooModule, barModule]);
		});

		it('should attempt to load modules in the correct order (internal, npm, external)', function () {
			mockery.registerMock('foo', null);
			mockery.registerMock('bar', null);
			mockery.registerMock('baz', bazModule);
			mockery.registerMock('../rule/foo', fooModule);
			mockery.registerMock('pa11y-rule-foo', null);
			mockery.registerMock('pa11y-rule-bar', barModule);
			assert.deepEqual(rules.load(['foo', 'bar', 'baz']), [fooModule, barModule, bazModule]);
		});

		it('should error when a rule is not found', function () {
			assert.throws(rules.load.bind(null, ['foo']), 'Rule "foo" could not be loaded');
		});

	});

});
