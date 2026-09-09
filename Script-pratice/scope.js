const appName = "My App";

function createUser(username) {

    const userId = 101;

    function getUser() {

        console.log(appName);
        console.log(username);
        console.log(userId);

    }

    getUser();
}

createUser("Ravi");