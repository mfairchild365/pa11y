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
var rules = require('./rules');
var truffler = require('truffler');

exports.init = init;

function init (opts) {
	opts = defaultOptions(opts);
	return truffler.init(rules.load(opts.rules), {});
}

function defaultOptions (opts) {
	return _.extend({}, {
		rules: []
	}, opts);
}
