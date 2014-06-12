
# Color helpers
C_CYAN=\x1b[34;01m
C_RESET=\x1b[0m

# Group targets
all: deps lint test
ci: lint test
test: test-lib test-bin test-rule test-reporter

# Install dependencies
deps:
	@echo "$(C_CYAN)> installing dependencies$(C_RESET)"
	@npm install

# Lint JavaScript
lint:
	@echo "$(C_CYAN)> linting javascript$(C_RESET)"
	@./node_modules/.bin/jshint . --exclude node_modules --config .jshintrc

# Run library tests
test-lib:
	@echo "$(C_CYAN)> running lib tests$(C_RESET)"
	@./node_modules/.bin/mocha ./test/setup ./test/lib --reporter spec --colors --recursive

# Run binary tests
test-bin:
	@echo "$(C_CYAN)> running bin tests$(C_RESET)"
	@./node_modules/.bin/mocha ./test/bin --reporter spec --colors --recursive --slow 500

# Run rule tests
test-rule:
	@echo "$(C_CYAN)> running rule tests$(C_RESET)"
	@./node_modules/.bin/mocha ./test/setup ./test/rule --reporter spec --colors --recursive

# Run reporter tests
test-reporter:
	@echo "$(C_CYAN)> running reporter tests$(C_RESET)"
	@./node_modules/.bin/mocha ./test/setup ./test/reporter --reporter spec --colors --recursive

.PHONY: test
