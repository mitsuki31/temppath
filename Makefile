# Makefile to run tests on cross-platform
# Written by Ryuu Mitsuki

REQUIRED_FILES := test.js test.mjs

# Run all tests
test: $(REQUIRED_FILES) | test-cjs test-esm

# Run CommonJS test
test-cjs: test.js
	$(info Run test: $^)
	@node $^

# Run ESModule test
test-esm: test.mjs
	$(info Run test: $^)
	@node $^
