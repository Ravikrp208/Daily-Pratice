const user1 = {
  name: "Ravi",

  greet: function () {
    console.log("Hello " + this.name);
  },
};

const user2 = {
  name: "Amit",

  greet: user1.greet,
};

user1.greet();
user2.greet();
