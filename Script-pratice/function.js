function createBankAccount() {
  let balance = 1000;

  return {
    deposit(amount) {
      balance += amount;
      console.log("Balance:", balance);
    },

    checkBalance() {
      console.log("Balance:", balance);
    },
  };
}

const account = createBankAccount();

account.checkBalance();
account.deposit(500);
account.checkBalance();
