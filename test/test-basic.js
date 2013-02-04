var SteakMachine = require("../lib/steak-machine.js");

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
      ], this)
    }

    callback();
  },

  testDefaultStateIsFirstEvent: function(test) {
    test.equal(this.tester.stateMachine.subject.state, "A");
    test.done();
  },

  testSimpleNext: function(test) {
    this.tester.stateMachine.next();
    test.equal(this.tester.stateMachine.state(), "B");

    this.tester.stateMachine.next();
    test.equal(this.tester.stateMachine.state(), "C");

    this.tester.stateMachine.next();
    test.equal(this.tester.stateMachine.state(), "D");

    test.done();
  },

  testRepetitiveNext: function(test) {
    this.tester.stateMachine.next(3);
    test.equal(this.tester.stateMachine.state(), "D");

    test.done();
  },

  testNoEvent: function(test) {
    this.tester.stateMachine.next(3);
    test.throws(function() { this.tester.stateMachine.next() });

    test.done();
  }
}

exports.functionState = {
  setUp: function(callback) {
     this.tester = {
      self: this,
      actualState: "",

      state: function(newState) {
        if(newState) {
          self.actualState = newState;
        } else {
          return self.actualState;
        }
      },

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
      ], this)
    }

    callback();
  },

  testDefaultStateIsFirstEvent: function(test) {
    test.equal(this.tester.stateMachine.subject.state, "A");
    test.done();
  },

  testSetState: function(test) {
    this.tester.stateMachine.next();
    test.equal(this.tester.stateMachine.state(), "B");

    test.done();
  },
}

exports.ringStates = {
  setUp: function(callback) {
    this.walrus = {
      state: "lol",

      stateMachine: new SteakMachine([
        {
          name: "eat",
          from: "hungry",
          to: "satisfied"
        },
        {
          name: "scate ice",
          from: "satisfied",
          to: "sleepy"
        },
        {
          name: "sleep",
          from: "sleepy",
          to: "hungry"
        }
      ], this)
    }

    callback();
  },

  testRing: function(test) {
    test.equal(this.walrus.stateMachine.state(), "hungry");

    this.walrus.stateMachine.transition("eat");

    test.equal(this.walrus.stateMachine.state(), "satisfied");

    this.walrus.stateMachine.next();

    test.equal(this.walrus.stateMachine.state(), "sleepy");

    this.walrus.stateMachine.transition("sleep");

    test.equal(this.walrus.stateMachine.state(), "hungry");

    test.done();
  }
}
