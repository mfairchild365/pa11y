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
var format = require('util').format;
var sinon = require('sinon');

describe('reporter/cli', function () {
	var reporter;

	beforeEach(function () {
		reporter = require('../../reporter/cli');
	});

	it('should be a function', function () {
		assert.isFunction(reporter);
	});

	describe('reporter()', function () {
		var console, info, output, results;

		beforeEach(function () {
			info = {
				name: 'pa11y',
				version: '1.2.3',
				context: 'http://example.com/'
			};
			output = '';
			console = {
				log: sinon.spy(function () {
					output += format.apply(null, arguments) + '\n';
				})
			};
			results = require('./mock/results');
			reporter(info, console, results);
		});

		it('should log the command name/version', function () {
			assert.match(output, /Running pa11y 1\.2\.3/);
		});

		it('should log the context', function () {
			assert.match(output, /http:\/\/example.com\//);
		});

	});

});
