# Experiment Interactive SVG

This is an experiement with making an SVG interactive. Owing to CORS restrictions on ES6 Modules,
this can not be loaded from a local file system. Instead it must be loaded from a web server. This
experiment uses Node (and a few packages) for the web server, however all core functionality uses
native APIs and no dependencies.

## Requirements:
- `Node` + `npm` (to host the server)
- Browser Support for `ES6 Module`s: https://caniuse.com/#feat=es6-module

To run, please run `npm i` followed by `npm run start`. It will open automatically at `http://localhost:1234`