var SteakMachine = require("../lib/steak-machine.js");

exports["Simple array states"] = {
  setUp: function(callback) {
    this.tester = {
      state: "hi",
      stateMachine: new SteakMachine([
        {
          name: "gogo",
          from: ["A", "B"],
          to: "C"
        }
      ], this)
    }

    callback();
  },

  "have default state": function(test) {
    test.equal(this.tester.stateMachine.state(), "A");
    test.done();
  },

  "transition from A->C": function(test) {
    this.tester.stateMachine.transition("gogo");
    test.done();
  }
}
