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
var exec = require('child_process').exec;
var path = require('path');

describe('bin/pa11y', function () {
	var opts, pkg, run;

	beforeEach(function () {
		opts = {
			cwd: path.resolve(__dirname, '..', '..', 'bin')
		};
		pkg = require('../../package.json');
		run = function (command, done) {
			exec(command, opts, done);
		};
	});

	it('should output help information when called with the `--help` flag', function (done) {
		run('./pa11y.js --help', function (err, stdout) {
			assert.match(stdout, /Usage/);
			done();
		});
	});

	it('should output version information when called with the `--version` flag', function (done) {
		run('./pa11y.js --version', function (err, stdout) {
			assert.strictEqual(stdout.trim(), pkg.version);
			done();
		});
	});

	it('should report no results when called with no suite/rules', function (done) {
		run('./pa11y.js "<p>foo</p>" --reporter json', function (err, stdout) {
			assert.strictEqual(stdout.trim(), '[]');
			done();
		});
	});

	it('should work with stdin', function (done) {
		run('echo "<p>foo</p>" | ./pa11y.js --reporter json', function (err, stdout) {
			assert.strictEqual(stdout.trim(), '[]');
			assert.isNull(err);
			done();
		});
	});

	it('should report the expected results when called with a suite', function (done) {
		run('./pa11y.js "<p>foo</p>" --suite test --reporter json', function (err, stdout) {
			assert.strictEqual(stdout.trim(), JSON.stringify([
				{message: 'foo', level: 'error'},
				{message: 'bar', level: 'warning'}
			]));
			done();
		});
	});

	it('should report the expected results when called with rules', function (done) {
		run('./pa11y.js "<p>foo</p>" --rules test/foo,test/bar --reporter json', function (err, stdout) {
			assert.strictEqual(stdout.trim(), JSON.stringify([
				{message: 'foo', level: 'error'},
				{message: 'bar', level: 'warning'}
			]));
			done();
		});
	});

	it('should report the expected results when called with ignore rules', function (done) {
		run('./pa11y.js "<p>foo</p>" --rules test/foo,test/bar --ignore test/foo,test/bar --reporter json', function (err, stdout) {
			assert.strictEqual(stdout.trim(), '[]');
			done();
		});
	});

	it('should exit with a code of `0` when no errors are found', function (done) {
		run('./pa11y.js "<p>foo</p>" --rules test/bar --reporter json', function (err) {
			assert.isNull(err);
			done();
		});
	});

	it('should exit with a code equal to the number of errors reported', function (done) {
		run('./pa11y.js "<p>foo</p>" --rules test/foo,test/bar,test/baz --reporter json', function (err) {
			assert.strictEqual(err.code, 2);
			done();
		});
	});

	it('should report an error when one occurs in initialisation', function (done) {
		run('./pa11y.js "<p>foo</p>" --rules test/notatest --reporter json', function (err, stdout, stderr) {
			assert.strictEqual(stderr.trim(), 'Error: Rule "test/notatest" could not be loaded');
			assert.strictEqual(err.code, 255);
			done();
		});
	});

});
