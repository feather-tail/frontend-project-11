install:
	npm ci

develop:
	npx webpack serve

test:
	npm test

lint:
	npx eslint .

remove:
	rm -rf dist

build:
	NODE_ENV=production npx webpack

vercel:
	npm run build
