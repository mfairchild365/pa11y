#!/usr/bin/env node

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

var pa11y = require('../lib/pa11y');
var pkg = require('../package.json');
var program = require('commander');

initProgram();
runProgram();

function initProgram () {
	program
		.version(pkg.version)
		.usage('[options] <url|html>')
		.option('-s, --suite [name]', 'The name of a suite to use rules from')
		.option('-r, --rules [rules]', 'A comma-separated list of rules to use', optionToArray)
		.option('-i, --ignore [rules]', 'A comma-separated list of rules to ignore', optionToArray)
		.option('-c. --config [file]', 'The name of a pa11y configuration file')
		.parse(process.argv);
}

function optionToArray (opt) {
	return (opt ? opt.split(',') : []);
}

function runProgram () {
	if (program.args.length) {
		runProgramOnArgument();
	} else {
		runProgramOnStdIn();
	}
}

function runProgramOnArgument () {
	runPa11y(program.args.join(' '));
}

function runProgramOnStdIn () {
	if (process.stdin.isTTY) {
		program.help();
	} else {
		captureStdIn(runPa11y);
	}
}

function captureStdIn (done) {
	var data = '';
    process.stdin.resume();
    process.stdin.on('data', function (chunk) {
        data += chunk;
    });
    process.stdin.on('end', function () {
        done(data);
    });
}

function runPa11y (context) {
	var test;
	try {
		test = pa11y.init({
			ignore: program.ignore,
			rules: program.rules,
			suite: program.suite
		});
		test(context, function (err, results) {
			if (err) {
				return reportError(err);
			}
			console.log(results);
		});
	} catch (err) {
		return reportError(err);
	}
}

function reportError (err) {
	console.error('Error:', err.message);
	process.exit(-1);
}
