<template>
  <q-layout view="lHh Lpr lFf">
<!--    <q-header elevated class="glossy">-->
<!--      <q-toolbar>-->
<!--        <q-btn-->
<!--          flat-->
<!--          dense-->
<!--          round-->
<!--          @click="leftDrawerOpen = !leftDrawerOpen"-->
<!--          aria-label="Menu"-->
<!--          icon="ion-menu"-->
<!--        />-->

<!--        <q-toolbar-title>-->
<!--          Quasar App-->
<!--        </q-toolbar-title>-->

<!--        <div>Quasar v{{ $q.version }}</div>-->
<!--      </q-toolbar>-->
<!--    </q-header>-->

<!--    <q-drawer-->
<!--      v-model="leftDrawerOpen"-->
<!--      show-if-above-->
<!--      bordered-->
<!--      content-class="bg-grey-2"-->
<!--    >-->
<!--      <q-list>-->
<!--        <q-item-label header>Essential Links</q-item-label>-->
<!--        <q-item clickable tag="a" target="_blank" href="https://quasar.dev">-->
<!--          <q-item-section avatar>-->
<!--            <q-icon name="ion-school" />-->
<!--          </q-item-section>-->
<!--          <q-item-section>-->
<!--            <q-item-label>Docs</q-item-label>-->
<!--            <q-item-label caption>quasar.dev</q-item-label>-->
<!--          </q-item-section>-->
<!--        </q-item>-->
<!--        <q-item clickable tag="a" target="_blank" href="https://github.com/quasarframework/">-->
<!--          <q-item-section avatar>-->
<!--            <q-icon name="ion-code" />-->
<!--          </q-item-section>-->
<!--          <q-item-section>-->
<!--            <q-item-label>Github</q-item-label>-->
<!--            <q-item-label caption>github.com/quasarframework</q-item-label>-->
<!--          </q-item-section>-->
<!--        </q-item>-->
<!--        <q-item clickable tag="a" target="_blank" href="https://chat.quasar.dev">-->
<!--          <q-item-section avatar>-->
<!--            <q-icon name="ion-chatbubbles" />-->
<!--          </q-item-section>-->
<!--          <q-item-section>-->
<!--            <q-item-label>Discord Chat Channel</q-item-label>-->
<!--            <q-item-label caption>chat.quasar.dev</q-item-label>-->
<!--          </q-item-section>-->
<!--        </q-item>-->
<!--        <q-item clickable tag="a" target="_blank" href="https://forum.quasar.dev">-->
<!--          <q-item-section avatar>-->
<!--            <q-icon name="ion-chatboxes" />-->
<!--          </q-item-section>-->
<!--          <q-item-section>-->
<!--            <q-item-label>Forum</q-item-label>-->
<!--            <q-item-label caption>forum.quasar.dev</q-item-label>-->
<!--          </q-item-section>-->
<!--        </q-item>-->
<!--        <q-item clickable tag="a" target="_blank" href="https://twitter.com/quasarframework">-->
<!--          <q-item-section avatar>-->
<!--            <q-icon name="ion-logo-twitter" />-->
<!--          </q-item-section>-->
<!--          <q-item-section>-->
<!--            <q-item-label>Twitter</q-item-label>-->
<!--            <q-item-label caption>@quasarframework</q-item-label>-->
<!--          </q-item-section>-->
<!--        </q-item>-->
<!--      </q-list>-->
<!--    </q-drawer>-->

    <q-page-container>
      <Kettle v-bind:firebase-token="firebaseToken" v-bind:kettle-id="kettleId" v-bind:kettle-name="kettleName"
              v-bind:default-username="defaultUsername" v-bind:drinkers="drinkers"
              v-on:clear-drinkers="clearDrinkers"/>
      <NewKettle v-on:update-kettle="updateKettle" />
      <KettleList v-bind:firebase-token="firebaseToken" v-bind:last-known-long="lastKnownLong" v-bind:last-known-lat="lastKnownLat" v-on:update-kettle="updateKettle"/>
    </q-page-container>
    <NotificationBox v-bind:the-usual="theUsual" v-on:add-drinker="addDrinker"/>
  </q-layout>
</template>

<script>
import NotificationBox from "@/components/NotificationBox"
import KettleList from "@/components/KettleList";
import NewKettle from "@/components/NewKettle";
import Kettle from "@/components/Kettle";
import firebase from "firebase";
import 'firebase/messaging'
import {API_URL} from "@/config";

export default {
  name: 'LayoutDefault',

  components: {
    NotificationBox,
    KettleList,
    NewKettle,
    Kettle,
  },

  data () {
    return {
      leftDrawerOpen: false,
      lastKnownLong: 0.0,
      lastKnownLat: 0.0,
      firebaseToken: "",
      theUsual: "",
      kettleId: "",
      kettleName: "",
      defaultUsername: "",
      drinkers: [],
    }
  },
  methods: {
    updateKettle(data){
      console.log("updating kettle: ", data);
      this.kettleId = data.kettleId;
      this.kettleName = data.name;
    },
    addDrinker(data){
      console.log("adding drinker: ", data);
      this.drinkers.push({name: data.name, choice: data.choice});
    },
    clearDrinkers(){
      console.log("clearing drinkers");
      this.drinkers = [];
    }
  },
  created (){
    try{
      firebase.messaging().getToken().then((token) => {
        window.console.log(token);
        this.firebaseToken = token;
        navigator.geolocation.getCurrentPosition((loc) => {
          this.lastKnownLong = loc.coords.longitude;
          this.lastKnownLat = loc.coords.latitude;
          console.log("set location", loc.coords)
          const data = {
            lastKnownLong: this.lastKnownLong,
            lastKnownLat: this.lastKnownLat,
            firebaseToken: this.firebaseToken,
          };
          (async () => {
            console.log("posting new user")
            const rawResponse = await fetch(API_URL + "users/", {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            });
            const content = await rawResponse.json();
            // this.theUsual = content.data.theUsual;

            console.log(content);
          })();
          // console.log("posting new user")
          // const rawResponse = fetch(API_URL + "users/", {
          //   method: 'POST',
          //   headers: {
          //     'Accept': 'application/json',
          //     'Content-Type': 'application/json'
          //   },
          //   body: JSON.stringify(data)
          // });
          // const content = rawResponse.json();
          //
          // console.log(content);
        },
        (err) => console.log("unable to get location", err)
        );
      }).catch((err) => console.log("unable to get token.", err))
    } catch (err){
      console.log(err);
    }
  }
}
</script>

<style>
</style>
