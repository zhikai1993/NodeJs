var square = x => x * x;
console.log(square(9));

/*
  the gotcha point between an arrow function and a regular function is the this keyword
  'this' will to the object properties in regular function, but to global reference, which is the class level in arrow function
  to make 'this' keyword to behave the same as regular function in arrow function, see line 15
*/

var user = {
  name: 'Andrew',
  sayHi: () => {
    console.log(arguments);
    console.log(`Hi. I'm ${this.name}`);
  },
  //adding ALT at the end of the function name will make the 'this' keyword to work
  sayHiAlt () {
    console.log(arguments);
    console.log(`Hi. I'm ${this.name}`);
  }
};

user.sayHi(1, 2, 3);
