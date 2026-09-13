/* 1. This is a simple function that logs a greeting to the console */

function sayHello() {
  console.log("Hello JavaScript");
}

sayHello();

/* 2. This is a function that takes two parameters and returns their sum */
function add(a, b) {
  return a + b;
}

console.log(add(10, 20));

/* 3. This is a function that takes a parameter with a default value */
function greet(name = "Guest") {
  console.log(`Hi ${name}`);
}

greet();
greet("Ravi");