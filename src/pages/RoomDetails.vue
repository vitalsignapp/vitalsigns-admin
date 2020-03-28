<template>
  <q-page>
    <!-- APP BAR -->
    <q-header class="row color-white">
      <q-toolbar
        class="col-4 bg-primary-500 no-padding shadow-1"
        :style="
          $q.platform.is.desktop ? 'max-width:360px;width:100%;' : 'width:100%;'
        "
      >
        <q-toolbar-title>
          <span class="q-pl-md">{{ roomData.name }}</span>
        </q-toolbar-title>
        <div class="q-pa-sm">
          <q-btn @click="isShowAddRoomDialog = true" flat dense icon="add" label="เพิ่มผู้ป่วย" />
          <q-btn flat icon="more_vert" class="no-border-radius">
            <q-menu auto-close>
              <q-list style="min-width: 100px">
                <q-item clickable>
                  <q-item-section>พิมพ์ QR Code ทั้งห้อง</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
      <q-toolbar class="col bg-primary-500 shadow-1" v-if="$q.platform.is.desktop">
        <q-toolbar-title></q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>
    <!-- END APP BAR -->

    <div class="row" v-if="!isLoading">
      <div
        class="container-list-data"
        :class="$q.platform.is.desktop ? 'col-4' : 'col-12'"
        :style="
          $q.platform.is.desktop ? 'max-width:360px;width:100%;' : 'width:100%;'
        "
      >
        <div>
          <div
            v-for="(items,index) in patientData"
            :key="index"
            class="relative-position container cursor-pointer"
            v-ripple
          >
            <div class="row q-py-sm font-body full-width" style="padding-left:30px">
              <div class="col" align="left">
                <span class="no-padding">{{ items.name }} {{ items.surname }}</span>
                <br />
                <span class="color-light-gray">{{ items.NH }}</span>
              </div>
              <div class="col-1 self-center" style="width:30px;">
                <q-icon name="chevron_right" size="24px"></q-icon>
              </div>
            </div>
            <q-separator />
          </div>
        </div>
      </div>

      <!-- COLUMN ขวา -->
      <div class="col relative-position desktop-only" align="center"></div>
    </div>
  </q-page>
</template>

<script>
import { db } from "../router";
export default {
  data() {
    return {
      isLoading: false,
      patientData: [],
      roomKey: this.$route.params.roomKey,
      roomData: ""
    };
  },
  methods: {
    loadRoomData() {
      db.collection("patientRoom")
        .doc(this.roomKey)
        .get()
        .then(doc => {
          this.roomData = doc.data();
        });
    },
    loadPatientDataInThisRoom() {
      db.collection("patientData")
        .where("patientRoomKey", "==", this.roomKey)
        .get()
        .then(doc => {
          console.log(doc.size);
          let dataTemp = [];
          doc.forEach(element => {
            dataTemp.push({ ...element.data(), ...{ key: element.id } });
          });
          this.patientData = dataTemp;
        });
    }
  },
  mounted() {
    this.loadRoomData();
    this.loadPatientDataInThisRoom();
  }
};
</script>

<style lang="scss" scoped>
.container-list-data {
  overflow-y: auto;
  height: calc(100vh - 50px);
  border-right: 1px solid #b3b3b379;
}

.container-list-data.desktop-only {
  max-width: 360px;
  width: 100%;
}

.container-list-data.mobile-only {
  width: 100%;
}

.container-list-data::-webkit-scrollbar {
  width: 2px;
}

.container-list-data::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.container-list-data::-webkit-scrollbar-thumb {
  background: rgb(167, 167, 167);
}

.container-list-data::-webkit-scrollbar-thumb:hover {
  background: rgb(163, 163, 163);
}

.my-card {
  padding: 2px;
  border-radius: 10px;
}
</style>