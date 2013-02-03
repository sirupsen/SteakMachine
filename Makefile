SRC = steak-machine.js

.PHONY: test

test:
	node_modules/.bin/nodeunit test/
