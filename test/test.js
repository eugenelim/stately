// you can set as a listener on a stream
// it will callback the thing

var vows = require('vows')
  , assert = require('assert')
  , stately = require('../lib/stately')
  ;

vows.describe('Stately').addBatch({
  "very simple" : {
    topic : function() {
      var machine = stately.define({
        foo : function(obj) {
          obj.foo = 'bar';
        }
      });
      return machine;
    },
    "with a matching state" : {
      topic : function(machine) {
        var obj = {state : "foo"};
        machine.handle(obj);
        return obj;
      },
      "should get triggered" : function(obj) {
        assert.equal(obj.foo, 'bar');
      }
    },
    "with a non-matching state" : {
      topic : function(machine) {
        var obj = {state : "bam"};
        machine.handle(obj);
        return obj;
      },
      "should not run" : function(obj) {
        assert.equal(obj.state, 'bam');
      }
    }
  },
  "with types and states" : {
    topic : function() {
      return stately.define({
        apple : {
          ripe : function(apple) {
            apple.bite = "chomp";
          }
        }
      });
    },
    "with an obj that matches" : {
      topic : function(machine) {
        var obj = {
          type : "apple",
          state : "ripe"
        };
        machine.handle(obj);
        return obj;
      },
      "should run" : function(obj) {
        assert.equal(obj.bite, "chomp");
      }
    },
    "with an obj that doesn't match" : {
      topic : function(machine) {
        var obj = {
          type : "banana",
          state : "ripe"
        };
        machine.handle(obj);
        return obj;
      },
      "should not run" : function(obj) {
        assert.equal(obj.state, "ripe");
      }
    }
  },
  "with a default" : {
    topic : stately.define({
      foo : function(obj) {
        obj.foo = 'bar';
      },
      _default : function(obj) {
        obj.default_ran = true;
      }
    }),
    "with an obj that doesn't match" : {
      topic : function(machine) {
        var obj = {state : "nomatch"};
        machine.handle(obj);
        return obj;
      },
      "should run the default" : function(obj) {
        assert.isTrue(obj.default_ran);
      }
    }
  },
  "with a typed default" : {
    topic : stately.define({
      apple : {
        ripe : function(apple) {
          apple.bite = "chomp";
        },
        _default : function(apple) {
          apple.apple_default_ran = true;
        }
      }
    }),
    "with a typed obj that doesn't match state" : {
      topic : function(machine) {
        var obj = {type:"apple",state : "nomatch"};
        machine.handle(obj);
        return obj;
      },
      "should run the default" : function(obj) {
        assert.isTrue(obj.apple_default_ran);
      }
    },
    "with an untyped object" : {
      topic : function(machine) {
        var obj = {state : "nomatch"};
        machine.handle(obj);
        return obj;
      },
      "should not run" : function(obj) {
        assert.isUndefined(obj.apple_default_ran);
      }
    }
  },
  "with a generic default and typed default" : {
    topic : stately.define({
      apple : {
        ripe : function(apple) {
          apple.bite = "chomp";
        },
        _default : function(apple) {
          apple.apple_default_ran = true;
        }
      },
      _default : function(obj) {
        obj.generic_default_ran = true;
      }
    }),
    "with a typed obj that doesn't match state" : {
      topic : function(machine) {
        var obj = {type:"apple",state : "nomatch"};
        machine.handle(obj);
        return obj;
      },
      "should run the default" : function(obj) {
        assert.isTrue(obj.apple_default_ran);
      },
      "should not run the generic default" : function(obj) {
        assert.isUndefined(obj.generic_default_ran);
      }
    },
    "with an untyped object" : {
      topic : function(machine) {
        var obj = {state : "nomatch"};
        machine.handle(obj);
        return obj;
      },
      "should run the generic default" : function(obj) {
        assert.isUndefined(obj.apple_default_ran);
        assert.isTrue(obj.generic_default_ran);
      }
    }
  }
}).export(module);

