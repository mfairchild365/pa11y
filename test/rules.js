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

	it('should have a `loadRules` method', function () {
		assert.isFunction(rules.loadRules);
	});

	describe('.loadRules()', function () {

		beforeEach(function () {
			sinon.stub(rules, 'loadRule');
		});

		afterEach(function () {
			rules.loadRule.restore();
		});

		it('should call `loadRule` for each rule in the array', function () {
			rules.loadRules(['foo', 'bar']);
			assert.strictEqual(rules.loadRule.callCount, 2);
		});

		it('should return an array of the `loadRule` results', function () {
			rules.loadRule.withArgs('foo').returns('baz');
			rules.loadRule.withArgs('bar').returns('qux');
			assert.deepEqual(rules.loadRules(['foo', 'bar']), ['baz', 'qux']);
		});

		it('should pass in matching rule configurations if given', function () {
			var fooConfig = {foo: true};
			var barConfig = {bar: true};
			rules.loadRules(['foo', 'bar'], {foo: fooConfig, bar: barConfig});
			assert.strictEqual(rules.loadRule.withArgs('foo', fooConfig).callCount, 1);
			assert.strictEqual(rules.loadRule.withArgs('bar', barConfig).callCount, 1);
		});

	});

	it('should have a `loadRule` method', function () {
		assert.isFunction(rules.loadRule);
	});

	describe('.loadRule()', function () {
		var fooModule, fooModuleBound, barModule, barModuleBound, bazModule, bazModuleBound;

		beforeEach(function () {
			fooModule = function () {};
			barModule = function () {};
			bazModule = function () {};
			fooModuleBound = function () {};
			barModuleBound = function () {};
			bazModuleBound = function () {};
			sinon.stub(fooModule, 'bind').returns(fooModuleBound);
			sinon.stub(barModule, 'bind').returns(barModuleBound);
			sinon.stub(bazModule, 'bind').returns(bazModuleBound);
		});

		it('should load in the expected internal module', function () {
			mockery.registerMock('../rule/foo', fooModule);
			assert.strictEqual(rules.loadRule('foo'), fooModuleBound);
		});

		it('should load in the expected external module if present', function () {
			mockery.registerMock('foo', fooModule);
			assert.strictEqual(rules.loadRule('foo'), fooModuleBound);
		});

		it('should load in the expected npm module if present', function () {
			mockery.registerMock('pa11y-rule-foo', fooModule);
			assert.strictEqual(rules.loadRule('foo'), fooModuleBound);
		});

		it('should attempt to load modules in the correct order (internal, npm, external)', function () {
			mockery.registerMock('foo', null);
			mockery.registerMock('bar', null);
			mockery.registerMock('baz', bazModule);
			mockery.registerMock('../rule/foo', fooModule);
			mockery.registerMock('pa11y-rule-foo', null);
			mockery.registerMock('pa11y-rule-bar', barModule);
			assert.strictEqual(rules.loadRule('foo'), fooModuleBound);
			assert.strictEqual(rules.loadRule('bar'), barModuleBound);
			assert.strictEqual(rules.loadRule('baz'), bazModuleBound);
		});

		it('should bind the rule config to the rule function if given', function () {
			var config = {foo: 'bar'};
			mockery.registerMock('../rule/foo', fooModule);
			rules.loadRule('foo', config);
			assert.strictEqual(fooModule.bind.withArgs(null, config).callCount, 1);
		});

		it('should error when a rule is not found', function () {
			assert.throws(rules.loadRule.bind(null, ['foo']), 'Rule "foo" could not be loaded');
		});

		it('should error when a rule module does not export a function', function () {
			mockery.registerMock('../rule/foo', {});
			assert.throws(rules.loadRule.bind(null, ['foo']), 'Rule "foo" is not a valid rule, module must export a function');
		});

	});

	it('should have a `resolveRules` method', function () {
		assert.isFunction(rules.resolveRules);
	});

	describe('.resolveRules()', function () {

		it('should combine the rules and suite rules', function () {
			assert.deepEqual(rules.resolveRules(['foo', 'bar'], ['baz', 'qux'], []), ['foo', 'bar', 'baz', 'qux']);
		});

		it('should deduplicate the rules', function () {
			assert.deepEqual(rules.resolveRules(['foo', 'bar'], ['bar', 'baz'], []), ['foo', 'bar', 'baz']);
		});

		it('should exclude rules (from rules and suite rules) based on the ignore parameter', function () {
			assert.deepEqual(rules.resolveRules(['foo', 'bar'], ['baz', 'qux'], ['bar', 'baz']), ['foo', 'qux']);
		});

		it('should filter out non-string values', function () {
			assert.deepEqual(rules.resolveRules(['foo', true, 'bar', {}, undefined], [], []), ['foo', 'bar']);
		});

		it('should not modify the original arrays', function () {
			var optsRules = ['foo', 'bar'];
			var suiteRules = ['baz', 'qux'];
			rules.resolveRules(optsRules, suiteRules, []);
			assert.deepEqual(optsRules, ['foo', 'bar']);
			assert.deepEqual(suiteRules, ['baz', 'qux']);
		});

	});

	it('should have a `resolveConfig` method', function () {
		assert.isFunction(rules.resolveConfig);
	});

	describe('.resolveConfig()', function () {

		it('should combine the config and suite config objects', function () {
			var optsConfig = {foo: 'bar'};
			var suiteConfig = {bar: 'baz'};
			assert.deepEqual(rules.resolveConfig(optsConfig, suiteConfig), {foo: 'bar', bar: 'baz'});
		});

		it('should use the options config rather than suite config when both define a property', function () {
			var optsConfig = {foo: 'bar'};
			var suiteConfig = {foo: 'baz'};
			assert.deepEqual(rules.resolveConfig(optsConfig, suiteConfig), {foo: 'bar'});
		});

		it('should not modify the original objects', function () {
			var optsConfig = {foo: 'bar'};
			var suiteConfig = {bar: 'baz'};
			rules.resolveConfig(optsConfig, suiteConfig);
			assert.isUndefined(optsConfig.bar);
			assert.isUndefined(suiteConfig.foo);
		});

	});

});
