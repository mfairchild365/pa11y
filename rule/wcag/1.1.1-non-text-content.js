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

module.exports = rule;

// WCAG 1.1.1 Non-text Content
// http://www.w3.org/TR/WCAG20/#text-equiv-all
// NOTE: rule not complete, only checks `img alt` is present
function rule (config, dom, report, done) {
	getImages(dom).filter(hasMissingAltAttribute).forEach(function (img) {
		report({
			code: 'wcag-1.1.1',
			level: config.level || 'error',
			message: 'Images must have alternative text',
			evidence: img.outerHTML
		});
	});
	done();
}

function getImages (dom) {
	return Array.prototype.slice.call(dom.document.querySelectorAll('img'));
}

function hasMissingAltAttribute (img) {
	return (img.getAttribute('alt') === null);
}
