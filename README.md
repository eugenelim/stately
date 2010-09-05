# Stately
## A CommonJS state-machine that works in Node or the browser.

This is extracted from [Twebz](http://github.com/jchris/twebz) and is designed to DRY out the CouchDB changes listner Twebz's bot uses for handling Twitter API interactions. That said, this is entirely agnostic to backends and should work great with Redis, message queues, or anything else where you can get a feed of updates as they are happening to the database.

It is totally isolated from IO, so it will also run fine in the browser, although I haven't done that yet.

## Usage

    var stately = require("stately")
      , myMachine = stately.define({
        foo : function(obj) {
          // this function will be called if obj.state == "foo"
          obj.fooRan = true;
        }
      })
      , obj = {state : "foo", fooRan : false};

    myMachine.handle(obj);
    
    assert.isTrue(obj.fooRan);

In real life you would hook `myMachine.handle` up as the listener to events on a Node.js stream. Or in the browser as the callback to an event system or a comet feed.

You can also deal with object of multiple types if you want, by nesting the definitions one-layer deep, see the tests for details.

The plan is to make the `getState` and `getType` methods pluggable.

## Tests

Haters gonna hate, but I used [Vows](http://vowsjs.org) and "it works!"

To run them:

    npm install vows
    vows test/test.js

## TODO

* Add NPM Package ceremony
* Make state and type readers pluggable
* Add ability to do pluggable channel-ack so you can have eg: concurrent CouchDB _changes handlers.

## License

[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html)
