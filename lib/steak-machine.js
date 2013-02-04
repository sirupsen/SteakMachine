SteakMachine = function(events, subject) {
  var self = this;

  self.subject = subject;
  self.events = [];

  for(var i = 0; i < events.length; i++)
    self.events.push(new SteakMachine.Event(events[i], self));

  if(self.subject === undefined)
    throw new Error("Pass your current object in: new SteakMachine([events], this)");

  self.state = function() {
    if(typeof(self.subject.state) == "function")
      return self.subject.state();

    return self.subject.state;
  }

  self.setState = function(newState) {
    if(typeof(self.subject.state) == "function") 
      self.subject.state(newState);
    else
      self.subject.state = newState;
  }

  self.setDefaultState = function() {
    var from = self.events[0].properties.from;

    if(from instanceof Array) {
      self.setState(from[0]);
    } else {
      self.setState(from);
    }
  }

  self.setDefaultState();

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
        if(event.isValid()) 
          return event.execute();

        throw new Error("Invalid transition from " + self.state() + " to " + event.properties.to);
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

    var from = self.properties.from;
    if(!(from instanceof Array)) from = [from];

    var ok = false;
    for(var i = 0; i < from.length; i++)
      if(self.machine.state() == from[i])
        ok = true;

    if(!ok) return false;

    return true;
  }

  self.execute = function() {
    self.fireCallbacks("before")
    self.machine.setState(self.properties.to);
    self.fireCallbacks("after");

    return true;
  }

  self.fireCallbacks = function(type) {
    if(typeof(self.properties[type]) == "function") {
      self.properties[type]();
    } else if(self.properties[type] instanceof Array) {
      for(var i = 0; i < self.properties[type].length; i++)
        self.properties[type][i]();
    } else if(self.properties[type] !== undefined) {
      throw new Error("Invalid callback " + type + " type for " + self.properties.name);
    }
  }
}

if (typeof(module) != "undefined") 
  module.exports = SteakMachine;
