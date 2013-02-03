var SteakMachine = require("../lib/steak-machine.js");

exports.namedEvents = {
  setUp: function(callback) {
    var self = this;
    self.events = [];
    self.i = 0;

    self.tester = {
      stateMachine: new SteakMachine([
         {
          name: "Pet",
          from: "A",
          to: "B"
        },
        {
          name: "Eat",
          from: "B",
          to: "C"
        },
        {
          name: "Sleep",
          from: "C",
          to: "D"
        }
      ], this)
    }

    callback();
  },

  testNamedEvents: function(test) {
    this.tester.stateMachine.transition("Pet");
    test.equal(this.tester.stateMachine.state(), "B");

    test.throws(function(){this.tester.stateMachine.transition("Sleep")});

    this.tester.stateMachine.transition("Eat");
    test.equal(this.tester.stateMachine.state(), "C");

    test.throws(function(){this.tester.stateMachine.transition("Pet")});

    this.tester.stateMachine.transition("Sleep");
    test.equal(this.tester.stateMachine.state(), "D");

    test.done();
  }

};
