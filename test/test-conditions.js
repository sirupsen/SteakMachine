var SteakMachine = require("../lib/steak-machine.js");

exports.conditions = {
  setUp: function(callback) {
    var self = this;
    self.events = [];
    self.i = 0;

    self.tester = {
      stateMachine: new SteakMachine([
         {
          from: "A",
          to: "B"
        },
        {
          from: "B",
          to: "C",
          condition: function() {
            return self.i == 1;
          }
        },
        {
          from: "C",
          to: "D",
        }
      ], this)
    }

    callback();
  },

  testReturnFalseWhenNoValidEvent: function(test) {
    this.tester.stateMachine.next(); // A -> B
    test.throws(function(){this.tester.stateMachine.next()}); // B -> C
    test.done();
  }
}
