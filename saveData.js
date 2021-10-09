const db = require("quick.db");

function saveData(user, data) {
    db.set(user.id, data);
    if (!db.get('Users')) {
        db.set('Users', [user.id]);
    } else {
        const users = db.get('Users');
        if (!users.includes(user.id)) {
            db.push('Users', user.id);
        } else return;
    }
}

module.exports = saveData;