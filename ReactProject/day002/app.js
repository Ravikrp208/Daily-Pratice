import axios from "axios";

async function getUsers() {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users",
    );

    console.log(response.data);
  } catch (error) {
    console.log("Error:", error.message);
  }
}

getUsers();
