const user = {
    name: "Ravi",
    age: 23
};

function showUser(city) {
    console.log(`
        Name: ${this.name}
        Age: ${this.age}
        City: ${city}
    `);
}

showUser.call(user, "Patna");

showUser.apply(user, ["Patna"]);

const userFunction = showUser.bind(user);
userFunction("Patna");