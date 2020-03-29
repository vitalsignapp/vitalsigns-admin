<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-6"></div>
      <div class="col-6">
        <q-infinite-scroll @load="onLoad" :offset="100">
          <div v-for="(item, index) in items" :key="index" class="caption">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.</p>
          </div>
          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [{}, {}, {}, {}, {}, {}, {}]
    };
  },
  methods: {
    onLoad(index, done) {
      setTimeout(() => {
        console.log(this.items);
        if (this.items) {
          this.items.push({}, {}, {}, {}, {}, {}, {});
          done();
        }
      }, 2000);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>