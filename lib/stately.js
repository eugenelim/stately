exports.define = function(states) {
  return new Stately(states);
};

// the default type handler
function getType(obj, cb) {
  cb(obj.type);
}

// the default state handler
function getState(obj, cb) {
  cb(obj.state);
};

// the no-op before handler
function before(obj, cb) {cb(obj)};

function Stately(states) {
  this.states = states || {};
  this.states._getState = this.states._getState || getState;
  this.states._getType = this.states._getType || getType;
  this.states._before = this.states._before || before;
};

Stately.prototype.handle = function(obj) {
  var self = this, states = this.states;
  states._before(obj, function(obj) {
    states._getType(obj, function(type) {
      states._getState(obj, function(state) {
        if (type && states[type]) {
          if (states[type][state]) {
            states[type][state](obj);
          } else if (states[type]._default) {
            states[type]._default(obj);
          } else {
            if (states[state]) {
              states[state](obj);
            }
          }
        } else {
          if (states[state]) {
            states[state](obj);
          } else if (states._default) {
            states._default(obj);
          }
        }
      });
    });
  });
};
