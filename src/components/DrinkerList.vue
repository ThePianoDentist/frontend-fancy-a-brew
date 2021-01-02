<template>
  <div class="q-pa-md">
    <p>Drinkers</p>
    <q-list>
<!--      <q-item clickable v-for="d in drinkers" v-bind:key="d.userId">-->
      <q-item clickable v-for="d in drinkers" v-bind:key="d.name">
        <q-item-section>
          <q-item-label>{{d.name}}: {{d.choice}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>

export default {
  name: "DrinkerList",
  props: ["drinkers"],
  data(){
    return {
    }
  },
  methods: {
  },
  created: function(){
  }
}
</script>

<style scoped>

</style>