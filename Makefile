build:
	npm install -d
	./node_modules/.bin/uglifyjs ./lib/self.js > ./self.min.js
