importScripts("https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js")
// Important. I couldnt receive messages until I bumped the 5.5.0 I copy pasta'd from tutorial to 8.2.1
// Maybe it has to match the package.json version? or maybe 5.5.0 was just too old.
// ANyway works now :D
importScripts("https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js")

// https://stackoverflow.com/questions/37482366/is-it-safe-to-expose-firebase-apikey-to-the-public
// apparently exposing this is "safe".
// as the JS is just 'receiving' fcm notifications I think that's fine. they can't send them (maybe they can. I should check this before release to public)
const firebaseConfig = {
    apiKey: 'AIzaSyC2hnIhL2VsKncd_w1Yw19AvN8GgRxmSug',
    projectId: 'fancy-a-brew-73ba4',
    storageBucket: 'fancy-a-brew-73ba4.appspot.com',
    messagingSenderId: '228232537478',
    appId: '1:228232537478:android:2905299bd638ad3031b807'
}

try{
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();
    messaging.setBackgroundMessageHandler(function(payload){
        const title = `Brew? ${payload.data.kettleName}`;
        // erm how pass payload.data.kettleId back into app when re-opened, so knows what is responding to?
        // maybe if I have a table of offers-sent I can look for most-recent for this user when re-opened.
        let iconPath = "";
        const options = {
            body: payload.image.body,
            icon: 'public/assets/logo.png',
            click_action : payload.data.click_action,
            data: {click_action: payload.data.click_action}
        };
        console.log("got a message")
        // https://developer.android.com/training/notify-user/build-notification#click
        return self.registration.showNotification(title, options);
    })

    // untested
    self.addEventListener('notificationclick', function(event) {
        event.notification.close();

        console.log('event',event);
        console.log('clients :', clients);

        const promise = new Promise(function(resolve) {
            setTimeout(resolve, 1000);
        }).then(function() {
            return clients.openWindow(event.notification.data.click_action);
        });

        console.log('promise',promise);
        event.waitUntil(promise);

    });
}
catch (err){
    console.log(err)
}