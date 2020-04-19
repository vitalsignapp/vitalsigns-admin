<template>
  <q-page>
    <q-header class="row color-white">
      <q-toolbar
        class="col-4 bg-primary-500 no-padding shadow-1"
        :style="
          $q.platform.is.desktop ? 'max-width:360px;width:100%;' : 'width:100%;'
        "
      >
        <q-toolbar-title>
          <span class="q-pl-md">ห้องพักผู้ป่วย</span>
        </q-toolbar-title>
        <div class="q-pa-sm">
          <q-btn
            @click="isShowAddRoomDialog = true"
            flat
            dense
            class="q-mx-sm"
            label="+ เพิ่มห้องพัก"
          />
        </div>
      </q-toolbar>
      <q-toolbar
        class="col bg-primary-500 shadow-1"
        v-if="$q.platform.is.desktop"
      >
        <q-toolbar-title></q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>

    <!-- TODO : Container List Data -->
    <div class="row" v-if="!isLoading">
      <div
        class="container-list-data bg-white"
        :class="$q.platform.is.desktop ? 'col-4' : 'col-12'"
        :style="
          $q.platform.is.desktop ? 'max-width:360px;width:100%;' : 'width:100%;'
        "
      >
        <div>
          <div
            v-for="(items, index) in patientRoom"
            :key="index"
            class="relative-position container cursor-pointer"
            v-ripple
            @click="showRoomData(items.key)"
          >
            <div
              class="row q-py-sm font-body full-width"
              style="padding-left:30px"
            >
              <div class="col" align="left">
                <span class="no-padding">{{ items.name }}</span>
                <br />
                <span class="color-light-gray"
                  >{{
                    patientData.filter(x => x.patientRoomKey == items.key)
                      .length
                  }}
                  คน</span
                >
              </div>
              <div class="col-1 self-center" style="width:30px;">
                <q-icon name="chevron_right" size="24px"></q-icon>
              </div>
            </div>
            <q-separator />
          </div>
        </div>
      </div>

      <div class="col relative-position desktop-only">
        <div class="font-h3 color q-ma-xl q-pa-xl color-light-gray">
          <q-icon name="arrow_back" class="q-mr-sm"></q-icon>เลือกห้องพัก
          เพื่อดูรายชื่อผู้ป่วยในห้อง
        </div>

        <!-- <div class="font-h3 color-light-gray" style="position:relative;top:18%;">
          <q-icon name="arrow_back"></q-icon>เลือกห้องพัก เพื่อดูรายชื่อผู้ป่วยในห้อง
        </div>-->
      </div>
    </div>

    <q-dialog
      maximized
      v-model="isShowAddRoomDialog"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-white">
        <q-card-section align="right">
          <q-btn
            dense
            round
            flat
            class="relative-position z-top color-black"
            v-close-popup
          >
            <q-icon name="close" size="45px"></q-icon>
          </q-btn>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="font-h3" align="center">เพิ่มห้องพักผู้ป่วย</div>
        </q-card-section>

        <q-card-section class="q-pt-none" align="center">
          <q-input
            v-model="roomName"
            style="max-width:330px;min-height:80px;"
            input-style="font-size:23px;font-weight:500;"
            outlined
            placeholder="ชื่อห้องพักผู้ป่วย"
          ></q-input>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            @click="addNewRoom()"
            label="บันทึก"
            class="button-action"
            style="min-width:80px"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { $db } from '@/api/firebase';
import { listRoom, listPatient } from '../api';

export default {
  data() {
    return {
      isShowAddRoomDialog: false,
      roomName: '',
      patientRoom: [],
      patientData: [],
      isListenPatientRoom: '',
      isLoading: true,
    };
  },
  methods: {
    showRoomData(roomKey) {
      this.$router.push('/roomdetails/' + roomKey);
    },
    async addNewRoom() {
      this.loadingShow();
      let date = await this.getDate();
      $db
        .collection('patientRoom')
        .add({
          name: this.roomName,
          hospitalKey: this.$q.localStorage.getItem('hospitalKey'),
          addTime: date.microtime,
          date: date,
        })
        .then(() => {
          this.$q.notify({
            message: 'คุณสร้างห้องพักสำเร็จแล้ว',
            color: 'black',
          });
          this.isShowAddRoomDialog = false;
          this.loadingHide();
        });
    },
    async loadPatientData() {
      // this.loadingShow();
      // db.collection("patientData")
      //   .where("hospitalKey", "==", this.$q.localStorage.getItem("hospitalKey"))
      //   .get()
      //   .then(doc => {
      //     let dataTemp = [];
      //     doc.forEach(element => {
      //       dataTemp.push({ ...element.data(), ...{ key: element.id } });
      //     });
      //     this.patientData = dataTemp;
      //     this.loadPatientRoom();
      //   });
      this.loadingShow();
      const hospitalId = this.$q.localStorage.getItem('hospitalKey');
      const transformPatientList = (data = []) => {
        return (data = data
          .map(d => {
            return {
              ...d,
              key: d.id,
            };
          })
          .sort((a, b) => {
            return a.name > b.name ? 1 : -1;
          }));
      };
      this.patientData = await listPatient(hospitalId).then(
        transformPatientList
      );
      this.loadPatientRoom();
    },
    loadPatientRoom() {
      // this.isListenPatientRoom = $db
      //   .collection("patientRoom")
      //   .where("hospitalKey", "==", this.$q.localStorage.getItem("hospitalKey"))
      //   .onSnapshot(doc => {
      //     let dataTemp = [];
      //     doc.forEach(element => {
      //       let dataKey = {
      //         key: element.id
      //       };
      //       dataTemp.push({ ...element.data(), ...dataKey });
      //     });
      //     dataTemp = dataTemp.sort((a, b) => a.addTime - b.addTime);
      //     this.patientRoom = dataTemp;
      //     this.isLoading = false;
      //     this.loadingHide();
      //   });

      const hospitalId = this.$q.localStorage.getItem('hospitalKey');
      listRoom(hospitalId)
        .then(data => {
          data = data
            .map(d => {
              return { ...d, key: d.id };
            })
            .sort((a, b) => a.addTime - b.addTime);

          this.patientRoom = data;
          this.isLoading = false;
          this.loadingHide();
        })
        .catch(err => {
          this.isLoading = false;
          this.loadingHide();
        });
    },
  },
  mounted() {
    this.loadPatientData();
  },
  beforeDestroy() {
    // this.isListenPatientRoom();
  },
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

.test-font {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}
</style>
