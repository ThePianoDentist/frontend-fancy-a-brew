import Vue from 'vue'
import App from './App.vue'
import './styles/quasar.sass'
import iconSet from 'quasar/icon-set/fontawesome-v5.js'
import {Notify, Quasar} from 'quasar'
import firebase from "firebase";
import 'firebase/messaging'

Vue.config.productionTip = false

// https://stackoverflow.com/questions/37482366/is-it-safe-to-expose-firebase-apikey-to-the-public
// apparently exposing this is "safe".
// as the JS is just 'receiving' fcm notifications I think that's fine. they can't send them (maybe they can. I should check this before release to public)
firebase.initializeApp({
    apiKey: 'AIzaSyC2hnIhL2VsKncd_w1Yw19AvN8GgRxmSug',
    projectId: 'fancy-a-brew-73ba4',
    storageBucket: 'fancy-a-brew-73ba4.appspot.com',
    messagingSenderId: '228232537478',
    appId: '1:228232537478:android:2905299bd638ad3031b807'
})

navigator.serviceWorker.register(
    'firebase-messaging-sw.js',
    {scope: 'firebase-cloud-messaging-push-scope'})
    .then((registration) => {
      const messaging = firebase.messaging();
      messaging.useServiceWorker(registration);
    }).catch(err => console.log(err))

import { library } from '@fortawesome/fontawesome-svg-core'
import { faMugHot, faGrinAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './quasar'
library.add(faMugHot);
library.add(faGrinAlt);
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(Quasar, {
    plugins: {
        Notify
    },
    config: {
        notify: { /* look at QUASARCONFOPTIONS from the API card (bottom of page) */ }
    },
    iconSet: iconSet
})

new Vue({
  render: h => h(App),
}).$mount('#app')
