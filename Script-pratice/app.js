let n = 17;
let isPrime = true;

if (n < 2) {
  isPrime = false;
}

for (let i = 2; i < n; i++) {
  if (n % i === 0) {
    isPrime = false;
    break;
  }
}

if (isPrime) {
  console.log(n + " is Prime");
} else {
  console.log(n + " is Not Prime");
}
