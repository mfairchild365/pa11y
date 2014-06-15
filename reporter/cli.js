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

var chalk = require('chalk');

module.exports = reporter;

function reporter (info, console, results) {
	console.log(chalk.cyan.underline('Running %s %s'), info.name, info.version);
	console.log(chalk.grey(info.context));
	console.log('');
	if (results.length) {
		results.forEach(reportResult.bind(null, console));
	} else {
		console.log(chalk.green('Success: no issues were found'));
	}
	console.log('');
}

function reportResult (console, result) {
	var line = [
		chalk[getLevelColor(result.level)]('• ' + padResultLevel(result.level)),
		chalk.grey(' | '),
		(result.code ? '[' + result.code + '] ' : ''),
		result.message,
		chalk.grey(result.evidence ? ' ' +result.evidence : '')
	];
	console.log(line.join(''));
}

function getLevelColor (level) {
	if (level === 'error') {
		return 'red';
	}
	if (level === 'warning') {
		return 'yellow';
	}
	return 'grey';
}

function padResultLevel (level) {
	while (level.length < 7) {
		level += ' ';
	}
	return level;
}
