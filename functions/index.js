let functions = require('firebase-functions');
let admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendPush = functions.database.ref('saleitAds').onWrite(event => {
    console.log(event)
    let msg ='New Ad posted on Sale!t'

    return loadUsers().then(users => {
        let tokens = [];
        for (let user of users) {
            tokens.push(user);
        }

        let payload = {
            notification: {
                title: 'Sale!t Ad',
                body: msg,
                sound: 'default',
                badge: 'https://icon.cat/img/icon_loop.png'
            }
        };
        
        return admin.messaging().sendToDevice(tokens, payload);
    });
});

function loadUsers() {
    let dbRef = admin.database().ref('saleitNotification/');
    let defer = new Promise((resolve, reject) => {
        dbRef.once('value', (snap) => {
            let data = snap.val();
            let users = [];
            for (var property in data) {
                users.push(data[property]);
            }
            resolve(users);
        }, (err) => {
            reject(err);
        });
    });
    return defer;
}