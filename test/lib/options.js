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

describe('lib/options', function () {
	var options;

	beforeEach(function () {
		options = require('../../lib/options');
	});

	it('should be an object', function () {
		assert.isObject(options);
	});

	it('should have an `applyDefaults` method', function () {
		assert.isFunction(options.applyDefaults);
	});

	describe('.applyDefaults()', function () {

		it('should return an object', function () {
			assert.isObject(options.applyDefaults({}));
		});

		it('should default the `config` option to an empty object', function () {
			assert.deepEqual(options.applyDefaults({}).config, {});
		});

		it('should default the `ignore` option to an empty array', function () {
			assert.deepEqual(options.applyDefaults({}).ignore, []);
		});

		it('should default the `rules` option to an empty array', function () {
			assert.deepEqual(options.applyDefaults({}).rules, []);
		});

		it('should default the `suite` option to `null`', function () {
			assert.isNull(options.applyDefaults({}).suite);
		});

	});

});
