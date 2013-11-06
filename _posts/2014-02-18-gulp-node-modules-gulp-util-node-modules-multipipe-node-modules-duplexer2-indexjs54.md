---
layout: post
title: Gulp error
---

Trying out [gulp](https://github.com/gulpjs/gulp) for the first time tonight, I was getting this error:

    $ gulp
    /usr/local/share/npm/lib/node_modules/gulp/node_modules/gulp-util/node_modules/multipipe/node_modules/duplexer2/index.js:54
    DuplexWrapper.prototype = Object.create(stream.Duplex.prototype, {constructor:
                                                         ^
    TypeError: Cannot read property 'prototype' of undefined
        at Object.<anonymous> (/usr/local/share/npm/lib/node_modules/gulp/node_modules/gulp-util/node_modules/multipipe/node_modules/duplexer2/index.js:54:54)
        at Module._compile (module.js:449:26)
        at Object.Module._extensions..js (module.js:467:10)
        at Module.load (module.js:356:32)
        at Function.Module._load (module.js:312:12)
        at Module.require (module.js:362:17)
        at require (module.js:378:17)
        at Object.<anonymous> (/usr/local/share/npm/lib/node_modules/gulp/node_modules/gulp-util/node_modules/multipipe/index.js:6:16)
        at Module._compile (module.js:449:26)
        at Object.Module._extensions..js (module.js:467:10)

For all those poor souls out there googling this:

Upgrade node. I used `brew upgrade node`.

