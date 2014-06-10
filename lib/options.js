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

exports.applyDefaults = applyDefaults;
exports.resolveRules = resolveRules;

function applyDefaults (opts) {
	var defaults = {
		rules: []
	};
	return _.extend({}, defaults, opts);
}

function resolveRules (opts) {
	opts.resolvedRules = opts.rules.slice();
	return _.compose(dedupeRules, resolveExcludes, resolveSuite)(opts);
}

function resolveSuite (opts) {
	if (typeof opts.suite === 'string') {
		var suite = applySuiteDefaults(loadSuite(opts.suite));
		opts.resolvedRules = opts.resolvedRules.concat(suite.rules);
	}
	return opts;
}

function applySuiteDefaults (opts) {
	var defaults = {
		rules: []
	};
	return _.extend({}, defaults, opts);
}

function loadSuite (name) {
	try {
		return require('../suite/' + name);
	} catch (err) {
		throw new Error('Suite "' + name + '" could not be loaded');
	}
}

function resolveExcludes (opts) {
	if (Array.isArray(opts.exclude)) {
		opts.resolvedRules = _.difference(opts.resolvedRules, opts.exclude);
	}
	return opts;
}

function dedupeRules (opts) {
	opts.resolvedRules = _.uniq(opts.resolvedRules);
	return opts;
}
