const db = require("quick.db");
const users = db.get('Users');
console.log(users);
console.log(Array.isArray(users));
if (Array.isArray(users)) {
    users.forEach(user => {
        console.log(user);
        const userData = db.get(user);
        console.log(userData);
    });
}