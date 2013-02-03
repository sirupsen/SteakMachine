var SteakMachine = require("../steak-machine.js");

exports.callbacks = {
  setUp: function(callback) {
    var self = this;
    self.events = [];

    self.tester = {
      stateMachine: new SteakMachine([
         {
          from: "A",
          to: "B"
        },
        {
          from: "B",
          to: "C",
          after: function() {
            self.events.push("after");
          }
        },
        {
          from: "C",
          to: "D",
          before: function() {
            self.events.push("before");
          }
        }
      ], this)
    }

    callback();
  },

  testAfter: function(test) {
    this.tester.stateMachine.next(); // A -> B
    this.tester.stateMachine.next(); // B -> C

    test.equal(this.events[0], "after");

    test.done();
  },

  testBefore: function(test) {
    this.tester.stateMachine.next(); // A -> B
    this.tester.stateMachine.next(); // B -> C
    this.tester.stateMachine.next(); // C -> D

    test.equal(this.events[1], "before");

    test.done();
  }
}
