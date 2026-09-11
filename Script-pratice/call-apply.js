function introduce(city, profession) {
  console.log(`I am ${this.name}, from ${city}, and I am a ${profession}`);
}

const user = {
  name: "Ravi",
};

introduce.apply(user, ["hazaribagh", "Software Developer"]);
