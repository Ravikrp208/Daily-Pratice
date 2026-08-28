const users = [
  { id: 1, name: "Rahul", email: "rahul@gmail.com" },
  { id: 2, name: "Priya", email: "priya@gmail.com" },
];

const customers = users.map((user) => ({
  customerId: user.id,
  fullName: user.name,
  emailAddress: user.email,
}));

// maping
console.log(customers);

const user = [
  { id: 1, name: "Rahul", age: 20 },
  { id: 2, name: "Priya", age: 22 },
];

const names = user.map((user) => user.name);

console.log(names);
// ["Rahul", "Priya"]

const data = user.map((user) => ({
  name: user.name,
  age: user.age,
}));

console.log(data);