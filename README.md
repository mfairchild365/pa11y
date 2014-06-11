
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

TODO: write documentation


Usage
-----

```js
var pa11y = require('pa11y');
```

### Creating a tester

Create a test function using `pa11y.init()`.

```js
var test = pa11y.init({ ... });
```

TODO: write documentation


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
