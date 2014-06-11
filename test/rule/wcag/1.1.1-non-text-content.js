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
var jsdom = require('jsdom');
var mockery = require('mockery');
var sinon = require('sinon');

describe('rule/wcag/1.1.1-non-text-content', function () {
	var rule;

	beforeEach(function () {
		mockery.enable({
			useCleanCache: true,
			warnOnUnregistered: false,
			warnOnReplace: false
		});
		rule = require('../../../rule/wcag/1.1.1-non-text-content');
	});

	afterEach(function () {
		mockery.deregisterAll();
		mockery.disable();
	});

	it('should be a function', function () {
		assert.isFunction(rule);
	});

	describe('rule()', function () {
		var config, dom, html, report;

		beforeEach(function (done) {
			config = {};
			report = sinon.spy();
			html = [
				'<img src="foo.png" alt="foo"/>',
				'<img src="bar.png" title="bar"/>',
				'<img src="baz.png"/>'
			].join('');
			jsdom.env(html, function (err, win) {
				dom = win;
				done();
			});
		});

		it('should call the callback', function (done) {
			rule(config, dom, report, done);
		});

		it('should call `report` for each image that doesn\'t have an `alt` attribute', function (done) {
			rule(config, dom, report, function () {
				assert.strictEqual(report.callCount, 2);
				done();
			});
		});

		it('should report with the expected code, level, and message', function (done) {
			rule(config, dom, report, function () {
				var code = 'wcag-1.1.1';
				var level = 'error';
				var message = 'Images must have alternative text';
				assert.strictEqual(report.getCall(0).args[0].code, code);
				assert.strictEqual(report.getCall(0).args[0].level, level);
				assert.strictEqual(report.getCall(0).args[0].message, message);
				assert.strictEqual(report.getCall(1).args[0].code, code);
				assert.strictEqual(report.getCall(1).args[0].level, level);
				assert.strictEqual(report.getCall(1).args[0].message, message);
				done();
			});
		});

		it('should report with the configured level if it\'s specified', function (done) {
			config = {level: 'warning'};
			rule(config, dom, report, function () {
				assert.strictEqual(report.getCall(0).args[0].level, config.level);
				assert.strictEqual(report.getCall(1).args[0].level, config.level);
				done();
			});
		});

		it('should include HTML evidence in the report', function (done) {
			rule(config, dom, report, function () {
				assert.strictEqual(report.getCall(0).args[0].evidence, '<img src="bar.png" title="bar">');
				assert.strictEqual(report.getCall(1).args[0].evidence, '<img src="baz.png">');
				done();
			});
		});

	});

});
