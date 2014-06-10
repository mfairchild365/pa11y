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

describe('pa11y', function () {
	var options, pa11y, rules, truffler;

	beforeEach(function () {
		mockery.enable({
			useCleanCache: true,
			warnOnUnregistered: false,
			warnOnReplace: false
		});

		options = {
			applyDefaults: sinon.stub().returns({}),
			resolveRules: sinon.stub().returns({})
		};
		rules = {
			loadRules: sinon.stub()
		};
		truffler = {
			init: sinon.stub()
		};

		mockery.registerMock('./options', options);
		mockery.registerMock('./rules', rules);
		mockery.registerMock('truffler', truffler);

		pa11y = require('../lib/pa11y');
	});

	afterEach(function () {
		mockery.deregisterAll();
		mockery.disable();
	});

	it('should be an object', function () {
		assert.isObject(pa11y);
	});

	it('should have an `init` method', function () {
		assert.isFunction(pa11y.init);
	});

	describe('.init()', function () {

		it('should apply default options', function () {
			var opts = {};
			pa11y.init(opts);
			assert.strictEqual(options.applyDefaults.withArgs(opts).callCount, 1);
		});

		it('should resolve the rules/suite/excludes', function () {
			var opts = {};
			options.applyDefaults.returns(opts);
			pa11y.init({});
			assert.strictEqual(options.resolveRules.withArgs(opts).callCount, 1);
		});

		it('should load the resolved rules with config', function () {
			var opts = {
				resolvedRules: ['foo', 'bar'],
				config: {foo: 1, bar: 2}
			};
			options.resolveRules.returns(opts);
			pa11y.init({});
			assert.strictEqual(rules.loadRules.withArgs(opts.resolvedRules, opts.config).callCount, 1);
		});

		it('should create a truffler test function', function () {
			pa11y.init();
			assert.strictEqual(truffler.init.callCount, 1);
		});

		it('should return the truffler test function', function () {
			var test = function () {};
			truffler.init.returns(test);
			assert.strictEqual(pa11y.init(), test);
		});

		it('should pass the loaded rules into truffler', function () {
			rules.loadRules.returns(['foo', 'bar']);
			pa11y.init();
			assert.deepEqual(truffler.init.getCall(0).args[0], ['foo', 'bar']);
		});

	});

});
