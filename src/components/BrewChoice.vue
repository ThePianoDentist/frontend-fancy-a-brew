<template>
  <div class="q-pa-md" style="max-width: 400px">
    <p>{{this.kettleName}}</p>
    <q-form
        @submit="onSubmit"
        class="q-gutter-md"
    >
      <q-input
          filled
          v-model="username"
          label="Name..."
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Enter name']"
      />
      <q-toggle v-model="theUsualTicked" label="Just the usual guvnor." :hint="this.theUsual" />
      <q-input
          filled
          v-model="custom"
          label="Custom..."
          lazy-rules
          :rules="[ this.validation || 'Tick usual or enter custom']"
      />
      <q-toggle v-model="updateUsual" label="This is my new usual!" />

      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
      </div>
    </q-form>

  </div>
</template>

<script>
import {postRequest} from "@/utils";
import {API_URL} from "@/config";

export default {
  name: "BrewChoice",
  props: ["kettleId", "kettleName", "theUsual", "defaultUsername"],
  data: function(){
    return {
      custom: "",
      //theUsual: "",
      username: "",
      theUsualTicked: true,
      updateUsual: false
    }
  },
  methods: {
    onSubmit() {
      (async () => {
        // need stop concurrent kettling
        if (this.updateUsual) {
          const data = {theUsual: this.custom, firebaseToken: this.firebaseToken};
          await postRequest(API_URL + "users/", data);
        }
        const data = {theUsualTicked: this.theUsualTicked, choice: this.theUsualTicked ? this.theUsual: this.custom, name: this.username};
        await postRequest(API_URL + `kettles/${this.kettleId}/response/`, data);
      })()
    },
    validation(val) {
      return val && val.length > 0 || this.theUsualTicked;
    },
  },
  created(){
    this.username = this.defaultUsername;
  }
}
</script>

<style scoped>

</style>