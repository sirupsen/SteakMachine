var SteakMachine = require("../lib/steak-machine.js");

exports["Simple callbacks"] = {
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

exports["Multiple callbacks"] = {
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
          after: [
            function() { self.events.push("after 1"); }, 
            function() { self.events.push("after 2"); }
          ]
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

  "multiple after callbacks should all be fired in order": function(test) {
    this.tester.stateMachine.next(); // A -> B
    this.tester.stateMachine.next(); // B -> C

    test.equal(this.events[0], "after 1");
    test.equal(this.events[1], "after 2");

    test.done();
  }
}

exports["Invalid callback type"] = {
  setUp: function(callback) {
    var self = this;

    self.tester = {
      stateMachine: new SteakMachine([
         {
          from: "A",
          after: "invalid",
          to: "B"
        },
      ], this)
    }

    callback();
  },

  "results in error when called": function(test) {
    test.throws(function(){this.tester.stateMachine.next()});
    test.done();
  }
}
