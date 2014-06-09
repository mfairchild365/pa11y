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

exports.load = load;

function load (rules) {
	return rules.map(loadRule);
}

function loadRule (name) {
	var rule = loadInternalRule(name) || loadNpmRule(name) || loadExternalRule(name);
	if (!rule) {
		throw new Error('Rule "' + name + '" could not be loaded');
	}
	return rule;
}

function loadInternalRule (name) {
	try {
		return require('../rule/' + name);
	} catch (err) {}
}

function loadNpmRule (name) {
	try {
		return require('pa11y-rule-' + name);
	} catch (err) {}
}

function loadExternalRule (name) {
	try {
		return require(name);
	} catch (err) {}
}
