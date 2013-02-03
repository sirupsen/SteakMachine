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
  this.machine.state = this.properties["to"];
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
