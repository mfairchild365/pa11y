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

module.exports = [
	{
		code: 'code-1',
		level: 'error',
		message: 'This is an error',
		evidence: '<p>foo</p>'
	},
	{
		code: 'code-1',
		level: 'error',
		message: 'This is an error',
		evidence: '<p>bar</p>'
	},
	{
		code: 'code-2',
		level: 'warning',
		message: 'This is a warning',
		evidence: '<p>baz</p>'
	},
	{
		code: 'code-3',
		level: 'error',
		message: 'This is a different error',
		evidence: '<p>qux</p>'
	},
	{
		level: 'warning',
		message: 'This is a warning',
		evidence: '<p>abc</p>'
	},
	{
		level: 'notice',
		message: 'This is a notice',
		evidence: '<p>def</p>'
	},
	{
		code: 'code-4',
		level: 'notice',
		message: 'This is a different notice',
		evidence: '<p>ghi</p>'
	}
];
