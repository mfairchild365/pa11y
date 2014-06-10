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

'use strict';

var _ = require('underscore');

exports.loadSuites = loadSuites;
exports.loadSuite = loadSuite;
exports.applyDefaults = applyDefaults;

function loadSuites (suites) {
	return suites.map(exports.loadSuite);
}

function loadSuite (name) {
	try {
		return exports.applyDefaults(require('../suite/' + name));
	} catch (err) {
		throw new Error('Suite "' + name + '" could not be loaded');
	}
}

function applyDefaults (opts) {
	var defaults = {
		config: {},
		rules: []
	};
	return _.extend({}, defaults, opts);
}
