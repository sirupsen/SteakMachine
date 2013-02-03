var SteakMachine = function(events) {
  this.events = [];

  for(var i = 0; i < events.length; i++)
    this.events.push(new SteakMachine.Event(events[i], this));

  this.state = events[0].from;
}

SteakMachine.prototype.nextRepeat = function(times) {
  for(var i = 0; i < times; i++) {
    var res = this.next();
    if(!res) return false;
  }

  return true;
}

SteakMachine.prototype.next = function() {
  for(var i = 0; i < this.events.length; i++) {
    var event = this.events[i];

    if(event.isValid())
      return event.execute();
  }

  throw new Error("No event available; either it is invalid or you are at the end of the chain.");
}

SteakMachine.prototype.transition = function(name) {
  for(var i = 0; i < this.events.length; i++) {
    var event = this.events[i];

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

SteakMachine.Event = function(event, machine) {
  this.properties = event;
  this.machine = machine;
}

SteakMachine.Event.prototype.isValid = function() {
  if(this.properties["condition"] && !this.properties["condition"]()) 
    return false;

  return (this.machine.state == this.properties["from"]);
}

SteakMachine.Event.prototype.execute = function() {
  if(this.properties["before"]) 
    this.properties["before"]();

  this.machine.state = this.properties["to"];

  if(this.properties["after"]) 
    this.properties["after"]();

  return true;
}

module.exports = SteakMachine;
