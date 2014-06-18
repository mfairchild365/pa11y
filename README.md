
pa11y
=====

Run accessibility tests against web pages or HTML snippets. pa11y is your automated accessibility testing pal.

**Current Version:** *2.0.0-alpha*  
**Node Support:** *0.10.x, 0.11.x*  
**License:** [GPLv3][gpl3]  
**Build Status:** [![Build Status][travis-img]][travis]


Install
-------

Install pa11y with [npm][npm]:

```sh
npm install pa11y
```


Command-Line Tool
-----------------

```
Usage: pa11y [options] <url|html>

  Options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -s, --suite [name]         The name of a suite to use rules from
    -r, --rules [rules]        A comma-separated list of rules to use
    -i, --ignore [rules]       A comma-separated list of rules to ignore
    -R, --reporter [reporter]  The name of a reporter to use
    -u, --useragent [ua]       The user-agent to send to the page being tested
```

### Specifying A Suite

Specify a suite of rules to use with the `-s` option. The following suites are available:

- wcag2a
- wcag2aa *(default)*
- wcag2aaa

```sh
pa11y http://example.com/ -s wcag2aaa
```

### Specifying Rules

Provide a list of rules to test with the `-r` option. This list should be comma-separated.

```sh
pa11y http://example.com/ -r example1,example2
```

### Ignoring Rules

You can ignore rules specified by suites with the `-i` option. This also expects a comma-separated list of rules.

```sh
pa11y http://example.com/ -s wcag2aaa -i example1,example2
```

### Reporters

You can change the output of the pa11y command using reporters with the `-R` option. Pa11y ships with a few useful ones:

- cli *(default)* - lists results in a human-readable format
- json - outputs the results array as a JSON string

```
pa11y http://example.com -R json
```

You can also [write your own reporters](#writing-your-own-cli-reporters) if you need a custom output format.

### User-Agent

You can specify a user-agent to send to the page being tested with the `-u` option. This defaults to `pa11y/<version>`.

```
pa11y http://example.com/ -u myapp/1.0
```


Usage
-----

```js
var pa11y = require('pa11y');
```

### Creating A Tester

Create a test function using `pa11y.init()`. This accepts an [options](#options) object which can be used to change pa11y's behaviour.

`pa11y.init` returns a function, which will be used to test individual URLs and HTML snippets.

```js
var test = pa11y.init({
    ...
});
```

### Running Tests

Once you have a test function, you can use it multiple times to test different URLs and HTML snippets. It accepts a `context` argument, and a callback.

```js
test('http://example.com/', function (err, results) {
    ...
});

test('<p>Hello World!</p>', function (err, results) {
    ...
});
```

The callback function will be called with an error object if something went wrong, and a `results` array which will contain the test results.

### Options

The following options are available when initialising pa11y. You'll always need to specify either a suite, or an array of rules – otherwise pa11y won't report anything.

#### `options.suite` *(string)*

Specify a suite of rules to use. The following suites are available:

- wcag2a
- wcag2aa
- wcag2aaa

Defaults to `null`;

#### `options.rules` *(array)*

Provide an array of rules to test with. Defaults to `[]`.

#### `options.ignore` *(array)*

Provide an array of rules to ignore, this can be used to disable rules in a suite you've specified. Defaults to `[]`.

#### `options.config` *(object)*

Provide configurations for individual rules. This is explained further in the [configuration docs](#configuration). Defaults to `{}`.

#### `options.useragent` *(string)*

Specify a user-agent to send to the page being tested. Defaults to `pa11y/<version>`.

### Configuration

Individual rules can be configured with the `config` option. This allows you to do things like change the error level or alter the way the rules test your code. Different rules have different configurations, refer to the rule documentation (TODO).

```js
// TODO: update this when the wcag/1.4.3 rule is actually written
var test = pa11y.init({
    rules: ['wcag/1.4.3-minimum-contrast'],
    config: {
        'wcag/1.4.3-minimum-contrast': {
            level: 'warning',
            ratio: '4.5:1',
            ratioLargeText: '3:1'
        }
    }
});
```


Writing Your Own Accessibility Rules
------------------------------------

TODO: write documentation


Writing Your Own CLI Reporters
------------------------------

TODO: write documentation


Contributing
------------

To contribute to pa11y, clone this repo locally and commit your code on a separate branch.

Please write unit tests for your code, and check that everything works by running the following before opening a pull-request:

```sh
make lint test
```

For users with push-access, don't commit to the master branch. Code should be in `develop` until it's ready to be released.


License
-------

pa11y is licensed under the [GNU General Public License 3.0][gpl3].  
Copyright &copy; 2014, Nature Publishing Group



[gpl3]: http://www.gnu.org/licenses/gpl-3.0.html
[npm]: https://npmjs.org/
[travis]: https://travis-ci.org/nature/pa11y
[travis-img]: https://travis-ci.org/nature/pa11y.svg?branch=master
