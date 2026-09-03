const numbers = [1, 2, 3];

numbers.forEach(num => {
  console.log(num);
});

const doubled = numbers.map(num => num * 2);

console.log(doubled); // [2, 4, 6]
