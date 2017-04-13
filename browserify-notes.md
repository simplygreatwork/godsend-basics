```
npm install --g browserify
cd godsend
npm install .
browserify src/main-browserify.js --standalone basic > dist/godsend-basics-client.js
```