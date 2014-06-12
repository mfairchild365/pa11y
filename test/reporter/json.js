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
/* global beforeEach, describe, it */
'use strict';

var assert = require('proclaim');
var sinon = require('sinon');

describe('reporter/json', function () {
	var reporter;

	beforeEach(function () {
		reporter = require('../../reporter/json');
	});

	it('should be a function', function () {
		assert.isFunction(reporter);
	});

	describe('reporter()', function () {
		var console, info, results;

		beforeEach(function () {
			info = {
				name: 'pa11y',
				version: '1.2.3',
				context: 'http://example.com/'
			};
			console = {
				log: sinon.spy()
			};
			results = require('./mock/results');
			reporter(info, console, results);
		});

		it('should only log once', function () {
			assert.strictEqual(console.log.callCount, 1);
		});

		it('should log the results as JSON', function () {
			assert.strictEqual(console.log.getCall(0).args[0], JSON.stringify(results));
		});

	});

});
