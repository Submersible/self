build:
	npm install -d
	./node_modules/.bin/uglifyjs ./lib/self.js > ./min.self.js
