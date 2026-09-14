function outer() {
  let message = "Hello from outer function";

  function inner() {
    console.log(message);
  }

  inner();
}

outer();
