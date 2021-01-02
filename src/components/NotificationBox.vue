<template>
  <div v-show="notify">
    <div id="notification-box" class="notification-box">
      <a href="#" id="notification-close" @click="closed()" title="close">x</a>

      <div class="notification-data">
        <div class="notification-title">
          <p id="title">
            {{from}}
            <br />
            <span id="title" style="font-size: 12px; font-weight: 600;">{{title}}</span>
          </p>
        </div>

        <div class="notification-notice">
          <p id="subject">{{subject}}</p>
        </div>
        <BrewChoice v-bind:the-usual="theUsual" v-bind:kettle-id="kettleId" v-bind:kettle-name="kettleName"/>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/messaging";
import BrewChoice from "@/components/BrewChoice";
export default {
  name: "NotificationBox",

  components: {BrewChoice},
  props: ['theUsual'],

  data() {
    return {
      title: "",
      from: "",
      subject: "",
      userimg: "",
      messaging: firebase.messaging(),
      currentMessage: "",
      notify: false,
      kettleId: "",
      kettleName: "",
    };
  },

  methods: {
    receiveMessage() {
      try {
        this.messaging.onMessage((payload) => {
          // debugger
          // can check lat/long one last time here before deliver notification
          this.currentMessage = payload;
          if (payload.data.type === "offer") {
            this.kettleId = payload.data.kettleId;
            this.kettleName = payload.data.kettleName;
            console.log(this.currentMessage);
            console.log("Message received. ", payload);
          }
          // It feels a bit shit having the notification box handle stuff that doesnt get shown.
          // Might want to refactor, but also might want to show notifications on new drink-request.
          else if (payload.data.type === "request") {
            this.$emit("add-drinker", payload.data)
          }
          else{
            console.log("warning. got unexpected fcm message-type", payload.data.type);
            return
          }
          this.notify = true;
          setTimeout(() => {
            this.notify = false;
          }, 300000);
        });
      } catch (e) {
        console.log(e);
      }
    },
  },

  created() {
    this.receiveMessage();
  },

  computed: {},
};
</script>

<style>
.notification-box {
  display: flex;
  position: absolute;
  right: 5px;
  bottom: 10px;
  width: 30%;
  height: 100px;
  background-color: #fff;
  z-index: 999;
}
#notification-close {
  position: absolute;
  color: #777;
  font-size: 14px;
  right: 5px;
  text-decoration: none;
  text-shadow: 0 1px 0 #fff;
  top: 2px;
  z-index: 10;
  cursor: pointer;
}

.notification-data {
  margin: 0 20px;
}
.notification-data p {
  margin: 10px 0;
}
.notification-notice p {
  font-size: 14px;
  font-weight: 400;
}
.notification-title p {
  font-size: 18px;
  font-weight: bold;
  line-height: 18px;
}
.notification-time small {
  font-size: 12px;
}

.notification-wall-number small {
  font-size: 8px;
}
img{
  width: 30px;
}
</style>