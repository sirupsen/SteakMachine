SteakMachine = function(events, subject) {
  var self = this;

  self.subject = subject;
  self.events = [];

  for(var i = 0; i < events.length; i++)
    self.events.push(new SteakMachine.Event(events[i], self));

  self.state = function() {
    if(typeof(self.subject.state) == "function") {
      return self.subject.state();
    } else {
      return self.subject.state;
    }
  }

  self.setState = function(newState) {
    if(typeof(self.subject.state) == "function") {
      self.subject.state(newState);
    } else {
      self.subject.state = newState;
    }
  }

  self.setState(self.events[0].properties["from"]);

  self.nextRepeat = function(times) {
    for(var i = 0; i < times; i++) {
      var res = self.next();
      if(!res) return false;
    }

    return true;
  }

  self.next = function() {
    for(var i = 0; i < self.events.length; i++) {
      var event = self.events[i];

      if(event.isValid())
        return event.execute();
    }

    throw new Error("No event available; either it is invalid or you are at the end of the chain.");
  }

  self.transition = function(name) {
    for(var i = 0; i < self.events.length; i++) {
      var event = self.events[i];

      if(event.properties["name"] == name) {
        if(event.isValid()) {
          return event.execute();
        } else {
          throw new Error("Invalid transition");
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
    if(self.properties["condition"] && !self.properties["condition"]()) 
      return false;

    return (self.machine.subject.state == self.properties["from"]);
  }

  self.execute = function() {
    if(self.properties["before"]) 
      self.properties["before"]();

    self.machine.subject.state = self.properties["to"];

    if(self.properties["after"]) 
      self.properties["after"]();

    return true;
  }
}

if (typeof(module) != "undefined") 
  module.exports = SteakMachine;
