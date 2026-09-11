const user1 = {
  name: "Ravi",
};

const user2 = {
  name: "Amit",
};

function greet(age) {
  console.log(`Hello ${this.name}, age is ${age}`);
}

greet.call(user1, 23);
greet.call(user2, 25);
