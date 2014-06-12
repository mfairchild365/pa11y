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

exports.loadReporters = loadReporters;
exports.loadReporter = loadReporter;

function loadReporters (reporters) {
	return reporters.map(exports.loadReporter);
}

function loadReporter (name) {
	var reporter = loadInternalReporter(name) || loadNpmReporter(name);
	verifyReporter(name, reporter);
	return reporter;
}

function loadInternalReporter (name) {
	try {
		return require('../reporter/' + name);
	} catch (err) {}
}

function loadNpmReporter (name) {
	try {
		return require('pa11y-reporter-' + name);
	} catch (err) {}
}

function verifyReporter (name, reporter) {
	var msg;
	if (!reporter) {
		msg = 'Reporter "' + name + '" could not be loaded';
		throw new Error(msg);
	}
	if (typeof reporter !== 'function') {
		msg = 'Reporter "' + name + '" is not a valid reporter, module must export a function';
		throw new Error(msg);
	}
}
