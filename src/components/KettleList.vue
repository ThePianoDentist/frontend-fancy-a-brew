<template>
  <div class="q-pa-md">
    <q-btn-dropdown color="primary" label="Hot Steamy Kettles In Your Area! >">
      <q-list>
        <q-item clickable v-for="k in kettles" v-bind:key="k.kettleId" v-close-popup @click="onItemClick(k.kettleId, k.name)">
          <q-item-section>
            <q-item-label>{{k.name}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script>
import {API_URL} from "@/config";

export default {
  name: "KettleList",
  // Seems ok for these to be passed as props.
  // appears in lifecycle App.vue (parent) created() finishes before child created() called
  props: ['firebaseToken', 'lastKnownLong', 'lastKnownLat'],
  data(){
    return {
      kettles: []
    }
  },
  methods: {
    onItemClick(kettleId, name) {
      this.$emit('update-kettle', {kettleId: kettleId, name: name});
    },
    getKettles(long, lat) {
      (async () => {
        console.log("getting kettles list around", long, lat)
        const data = {metreRadius: 100, long: long, lat: lat}
        const rawResponse = await fetch(API_URL + "kettles/list/", {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        const content = await rawResponse.json();
        this.kettles = content.data;

        console.log(content.data);
      })()
    },
    getKettlesWrapper(){
      // should probably have something more complex which stores last-check timestamp and works out if need to refresh.
      // avoid float inprecision comparison errors
      if (this.lastKnownLat <= 0.00001 && this.lastKnownLat <= 0.00001){
        navigator.geolocation.getCurrentPosition((loc) => {
          const long = loc.coords.longitude;
          const lat = loc.coords.latitude;
          this.getKettles(long, lat);
        }, (err) => console.log("unable to get location", err))
      } else{
        this.getKettles(this.lastKnownLong, this.lastKnownLat)
      }
    }
  },
  created: function(){
    this.getKettlesWrapper();
  }
}
</script>

<style scoped>

</style>