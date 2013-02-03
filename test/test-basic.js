var SteakMachine = require("../steak-machine.js");

exports.basic = {
  setUp: function(callback) {
     this.tester = {
      stateMachine: new SteakMachine([
        {
          from: "A",
          to: "B"
        },
        {
          from: "C",
          to: "D"
        },
        {
          from: "B",
          to: "C"
        },
      ])
    }

    callback();
  },

  testDefaultStateIsFirstEvent: function(test) {
    test.equal(this.tester.stateMachine.state, "A");
    test.done();
  },

  testSimpleNext: function(test) {
    this.tester.stateMachine.next();
    test.equal(this.tester.stateMachine.state, "B");

    this.tester.stateMachine.next();
    test.equal(this.tester.stateMachine.state, "C");

    this.tester.stateMachine.next();
    test.equal(this.tester.stateMachine.state, "D");

    test.done();
  },

  testRepetitiveNext: function(test) {
    this.tester.stateMachine.nextRepeat(3);
    test.equal(this.tester.stateMachine.state, "D");

    test.done();
  },

  testNoEvent: function(test) {
    this.tester.stateMachine.nextRepeat(3);
    test.throws(function() { this.tester.stateMachine.next() });

    test.done();
  }
}
