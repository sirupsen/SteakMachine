# SteakMachine [![Build Status](https://travis-ci.org/Sirupsen/SteakMachine.png?branch=master)](https://travis-ci.org/Sirupsen/SteakMachine)

Do you like your Javascript states medium rare? Then Steak Machine is the

simple Javascript state machine with tacky puns you've been longing for.

> "This could prove to be either a huge misteak or it could be a rump above the rest." — [Andrew Leach](http://twitter.com/luaduck)


> "I was hungry for some steak but all I got was this state machine." — [Bouke van der Bijl](http://twitter.com/bvdbijl)


Grilled with love by Sirlionsen.

## Usage

Steak Machine works in such a way you marinate your object with an instance
of steak machine, and pass an array of objects that describe each state. Below
we review the simple case of a walrus' complex life outside the mating season:

```javascript
var Walrus = function(name) {
  var self = this;
  var self.name = name;

  this.stateMachine = new SteakMachine([
    {
      name: "Eat",
      from: "hungry",
      to: "satisfied",
      before: self.eat
    },
    {
      name: "Scate ice",
      from: "satisfied",
      to: "sleepy",
      before: self.skateIce
    },
    {
      name: "Sleep",
      from: "sleepy",
      to: "hungry",
      before: self.sleep,
      after: self.hungry
    }
  ], this);

  self.eat = function() {
    console.log("om nom nom nom");
  }

  self.skateIce = function() {
    console.log("wuhuuu funnyy. " + self.name + " now sleepy.");
  }

  self.sleep = function() {
    console.log("zZzzzZZZzzZzzZZZzz");
  }

  self.hungry = function() {
    console.log("hueerrrp!!1");
  }
}
```

With this simple state machine, we can simulate the states of a walrus' life:

```javascript
walrus = new Walrus("Wally"); 

console.log(walrus.state);
// => "hungry"

console.log(walrus.eat());
// => "om nom nom nom"

// Go to whatever next event we can, prioritize events in order passed in the
Array.
console.log(walrus.next());
// => "wuhuuu .. Wally now sleepy."

walrus.eat();
// error
```
