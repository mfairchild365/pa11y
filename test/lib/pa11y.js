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

describe('lib/pa11y', function () {
	var options, pa11y, rules, suites, truffler;

	beforeEach(function () {
		mockery.enable({
			useCleanCache: true,
			warnOnUnregistered: false,
			warnOnReplace: false
		});

		options = {
			applyDefaults: sinon.stub().returns({})
		};
		rules = {
			loadRules: sinon.stub(),
			resolveRules: sinon.stub().returns([]),
			resolveConfig: sinon.stub().returns({})
		};
		suites = {
			loadSuite: sinon.stub().returns({})
		};
		truffler = {
			init: sinon.stub()
		};

		mockery.registerMock('./options', options);
		mockery.registerMock('./rules', rules);
		mockery.registerMock('./suites', suites);
		mockery.registerMock('truffler', truffler);

		pa11y = require('../../lib/pa11y');
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

		it('should load the suite if one is specified', function () {
			options.applyDefaults.returns({
				suite: 'foo'
			});
			pa11y.init();
			assert.strictEqual(suites.loadSuite.withArgs('foo').callCount, 1);
		});

		it('should resolve the rules, suite, and ignore options', function () {
			var opts = {
				ignore: ['bar', 'baz'],
				rules: ['foo', 'bar'],
				suite: 'foo'
			};
			var suite = {
				rules: ['baz', 'qux']
			};
			options.applyDefaults.returns(opts);
			suites.loadSuite.returns(suite);
			pa11y.init();
			assert.strictEqual(rules.resolveRules.withArgs(opts.rules, suite.rules, opts.ignore).callCount, 1);
		});

		it('should resolve the config and suite config', function () {
			var opts = {
				config: {foo: 1, bar: 2},
				suite: 'foo'
			};
			var suite = {
				config: {baz: 3, qux: 4}
			};
			options.applyDefaults.returns(opts);
			suites.loadSuite.returns(suite);
			pa11y.init();
			assert.strictEqual(rules.resolveConfig.withArgs(opts.config, suite.config).callCount, 1);
		});

		it('should load the resolved rules with the resolved config', function () {
			var resolvedRules = ['foo', 'bar'];
			var resolvedConfig = {foo: 1, bar: 2};
			rules.resolveRules.returns(resolvedRules);
			rules.resolveConfig.returns(resolvedConfig);
			pa11y.init();
			assert.strictEqual(rules.loadRules.withArgs(resolvedRules, resolvedConfig).callCount, 1);
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
			var loadedRules = [function () {}, function () {}];
			rules.loadRules.returns(loadedRules);
			pa11y.init();
			assert.deepEqual(truffler.init.withArgs(loadedRules).callCount, 1);
		});

	});

});
