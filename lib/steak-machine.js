SteakMachine = function(events, subject) {
  var self = this;

  self.subject = subject;
  self.events = [];

  for(var i = 0; i < events.length; i++)
    self.events.push(new SteakMachine.Event(events[i], self));

  self.state = function() {
    if(typeof(self.subject.state) == "function")
      return self.subject.state();

    return self.subject.state;
  }

  self.setState = function(newState) {
    if(typeof(self.subject.state) == "function") 
      return self.subject.state(newState);

    return self.subject.state = newState;
  }

  self.setState(self.events[0].properties["from"]);

  self.next = function(times) {
    var times = times || 1;

    var perform = function() {
      for(var i = 0; i < self.events.length; i++) {
        var event = self.events[i];
        if(event.isValid()) return event.execute();
      }

      throw new Error("No event available; either it is invalid or you are at the end of the chain.");
    }

    for(var i = 0; i < times; i++)
      if(!perform()) return false;

    return true;
  }

  self.transition = function(name) {
    for(var i = 0; i < self.events.length; i++) {
      var event = self.events[i];

      if(event.properties.name == name) {
        if(event.isValid()) {
          return event.execute();
        } else {
          throw new Error("Invalid transition from " + name + " to " + event.properties.name);
        }
      }
    }

    throw new Error("Transition does not exist.");
  }
}

SteakMachine.Event = function(event, machine) {
  var self = this;

  self.properties = event;
  self.machine = machine;

  self.isValid = function() {
    if(self.properties.condition && !self.properties.condition()) 
      return false;

    if(self.machine.state() != self.properties.from)
      return false;

    return true;
  }

  self.execute = function() {
    if(typeof(self.properties.before) == "function") 
      self.properties.before();

    self.machine.setState(self.properties.to);

    if(typeof(self.properties.after) == "function") 
      self.properties.after();

    return true;
  }
}

if (typeof(module) != "undefined") 
  module.exports = SteakMachine;
