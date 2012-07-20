build:
	@npm install -d
	@echo "/* Self v1.0.0 https://github.com/munro/self | https://github.com/munro/self/blob/master/LICENSE */" > self.min.js
	@./node_modules/.bin/uglifyjs -nc self.js >> self.min.js
	@echo -n "Development:        " && cat self.js | wc -c
	@echo -n "Production:         " && cat self.min.js | wc -c
	@echo -n "Production+gzipped: " && cat self.min.js | gzip -c -f | wc -c
