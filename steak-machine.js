var SteakMachine = function(events) {
  this.events = [];

  for(var i = 0; i < events.length; i++)
    this.events.push(new SteakMachine.Event(events[i], this));

  this.state = events[0].from;
}

SteakMachine.prototype.next = function() {
  for(var i = 0; i < this.events.length; i++) {
    var event = this.events[i];

    if(event.isValid())
      return event.execute();
  }
}

SteakMachine.Event = function(event, machine) {
  this.properties = event;
  this.machine = machine;
}

SteakMachine.Event.prototype.isValid = function() {
  return (this.machine.state == this.properties["from"]);
}

SteakMachine.Event.prototype.execute = function() {
  if(this.properties["before"]) 
    this.properties["before"]();

  this.machine.state = this.properties["to"];

  if(this.properties["after"]) 
    this.properties["after"]();
}

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
  }
}

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
      ])
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
