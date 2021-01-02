<template>
  <div class="q-pa-md" style="max-width: 400px">

    <q-form
        @submit="onSubmit"
        class="q-gutter-md"
    >
      <q-input
          filled
          v-model="name"
          label="Kettle name"
          hint="why do you need a hint you moron?"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Pick a name you berk.']"
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
      </div>
      <div>
        <p>Submit whilst next to kettle to help location accuracy!</p>
      </div>
    </q-form>

  </div>
</template>

<script>
import {API_URL} from "@/config";
import { uuid } from 'vue-uuid';
import { postRequest } from '@/utils';
//import { Notify } from 'quasar';

export default {
  data () {
    return {
      name: null,
    }
  },
  methods: {
    onSubmit () {
      navigator.geolocation.getCurrentPosition((loc) => {
        const long = loc.coords.longitude;
        const lat = loc.coords.latitude;
        const data = {name: this.name, long: long, lat: lat, wirelessId: uuid.v4()}
        postRequest(API_URL + "kettles/", data).then((data) => {
          this.$emit("update-kettle", data);
          // Notify.create({
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            //icon: 'cloud_done',
            icon: 'grin-alt',
            message: `Congrats! ${this.name} is ready to make a round`
          })
        })
      }, (err) => console.log("unable to get location", err))
    },
  }
}
</script>

