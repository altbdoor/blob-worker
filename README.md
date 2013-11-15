blobWorker v0.1
===

Making Web Workers work inline with Blob.

I was working on a personal site, with some pretty wacky JavaScript. While it runs perfectly well on Google Chrome, it suffers terribly on Mozilla Firefox. I looked around for ways to optimize, or speed up the JavaScript process, and I bumped into [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Worker).

While it works perfectly well, I find the need to have a separate JavaScript file for the Web Worker to work with, somewhat a hassle. Digging further, I found [this interesting post on StackOverflow](http://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string), which uses [Blobs](https://developer.mozilla.org/en-US/docs/Web/API/Blob).

Needless to say, I started to work on making a script, and this is the result.

---

How To Use
---

#### Methods

`.check()` returns true if the browser supports Worker, URL and either Blob or BlobBuilder.

`.prepare()` takes in an object to initialize the blobWorker.
```
foo.prepare({
    fn:         /* function for the Web Worker to execute */,
    arg:        /* the argument to send (postMessage) to Web Worker */,
    success:    /* callback function when the Web Worker is done */,
    error:      /* OPTIONAL callback function when Web Worker encounters errors */,
    addJs:      /* OPTIONAL list of scripts to add into Web Worker (importScripts) */
});
```

`.exec()` calls the Web Worker to start working. (Essentially calling `Worker.postMessage()`) If an argument is supplied, the argument will be passed to the Web Worker, instead of the already-initialized argument in `.prepare()`.

`.kill()` terminates the Web Worker and destroys the Blob containing the JavaScript. (Essentially calling `Worker.terminate()` and `URL.revokeURLObject(blob)`)

---

#### Prepare

`fn` takes in a function, which is executed by the Web Worker.

`arg` takes in an object, which will be passed to the Web Worker to be executed.

`success` takes in a function, which is executed when the Web Worker posts back a message to the script.

`error` is an optional argument, which takes in a function that is executed when the Web Worker encounters errors.

`addJs` is an optional argument, which takes in an array of String that is added into the Web Worker via `importScripts()`.

#### Please note that the functions and arguments are simply wrapped and passed to the Web Worker. You need to code the functions and arguments like how you would with a Web Worker. Please refer to the Example.

Example
---

```
var foo = new blobWorker();

if (foo.check()) {
    foo.prepare({
        fn: function (e) {
            postMessage('Worker here, I got (' + e.data + ') !');
        },
        arg: 'the argument to pass to Web Worker',
        success: function (e) {
            alert(e.data);
        }
    });
    
    foo.exec();
    
    foo.exec( 'NOPE' );
    
    foo.kill();
}
else {
    // a gracious fallback?
}

```

Browser Support
---
Ah yes. The most dreaded question. All data is based on [CanIUse.com](http://caniuse.com/). Did not really made a thorough test myself.

- No IE Support (Boo hoo ;_;)
- Firefox 6.0
- Chrome 8.0
- Safari 6.0
- Opera 12.1

Credits
---
- [StackOverflow](http://stackoverflow.com/)
  - [How to create a Web Worker from a string](http://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string)
  - [Passing objects to a Worker](http://stackoverflow.com/questions/7704323/passing-objects-to-a-web-worker)
- [Mozilla Development Network](https://developer.mozilla.org/en-US/)
  - [Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/Guide/Performance/Using_web_workers)
  - [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
  - [BlobBuilder](https://developer.mozilla.org/en-US/docs/Web/API/BlobBuilder)
  - [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL)
  - [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker)

License
---

MIT
