<template>
  <div>
    <div>
      <h2>{{this.kettleName}}</h2>
    </div>
    <div>
<!--      <q-btn class="glossy" rounded icon="fa-mug-hot" color="deep-orange" label="Fancy a brew anyone?" @click="offerOnClick()"/>-->
      <q-btn class="glossy" rounded color="deep-orange" label="Fancy a brew anyone?" @click="offerOnClick()">
        <!-- cant get fa and quasar integration perfect. maybe awkward cos using vue-cli? -->
        <font-awesome-icon icon="mug-hot" class="on-left"/>
      </q-btn>
    </div>
    <DrinkerList v-bind:drinkers="drinkers"/>
    <div>
      <q-btn v-show="inprogress" label="Drinks ready!" type="submit" color="primary" @click="readyOnClick()"/>
    </div>
<!--    <div> does destroy kettle make sense when nobody "admins" a kettle? but at same time what is harm in recreating? destroy means more logic to handle concurrency-->
<!--      <q-btn label="Destroy kettle" type="submit" color="primary"/>-->
<!--    </div>-->
  </div>
</template>

<script>
import {postRequest} from "@/utils";
import {API_URL} from "@/config";
import DrinkerList from "@/components/DrinkerList";

export default {
name: "Kettle",
  props: ["kettleId", "kettleName", "firebaseToken", "drinkers"],
  data() {
    // TODO this isnt currently checking if other users making.
    // also it needs to be initialised based on server-status. not always false when open.
    return {inprogress: false}
  },
  components: {DrinkerList},
  methods: {
  offerOnClick(){
    console.log("clicked offer", this.kettleId, this.kettleName);
    if (this.firebaseToken === ""){
      this.$q.notify({
        color: 'red',
        textColor: 'white',
        //icon: 'cloud_done',
        //icon: 'grin-alt',
        message: "FirebaseToken missing. Try reloading app."
      })
      return
    }
    if (this.inprogress){
      this.$q.notify({
        color: 'red',
        textColor: 'white',
        //icon: 'cloud_done',
        //icon: 'grin-alt',
        message: "Round already in-progress!"
      })
      return
    }
    this.inprogress = true;
    postRequest(API_URL + `kettles/${this.kettleId}/offer/`, {firebaseToken: this.firebaseToken}).then((data) =>{
      if (!data) this.inprogress = false;
    });

    },
    readyOnClick(){
      // what else need do? block notifications for more drinks for one.
      // api call to set current-maker to none
      postRequest(API_URL + `kettles/${this.kettleId}/finished/`, {}).then(() => {
        this.$emit("clear-drinkers");
      })
      this.inprogress = false;
    }
  }
}
</script>

<style scoped>

</style>