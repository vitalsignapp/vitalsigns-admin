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
          <q-btn dense flat icon="chevron_left" to="/room"></q-btn>
          <span class="q-pl-md">{{ roomData.name }}</span>
        </q-toolbar-title>
        <div class="q-pa-sm">
          <q-btn @click="isDialogAddNewPatient = true" flat dense icon="add" label="เพิ่มผู้ป่วย" />
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
        <q-toolbar-title>รายละเอียดผู้ป่วย</q-toolbar-title>
        <q-btn icon="farq fa-bell" flat></q-btn>
        <q-btn flat icon="more_vert" class="no-border-radius">
          <q-menu auto-close>
            <q-list style="min-width: 100px">
              <q-item clickable>
                <q-item-section>พิมพ์ QR Code ทั้งห้อง</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
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
            @click="showPatientData(items.key)"
          >
            <div class="row q-py-sm font-body full-width" style="padding-left:30px">
              <div class="col" align="left">
                <span class="no-padding">{{ items.name }} {{ items.surname }}</span>
                <br />
                <span class="color-light-gray">{{ items.HN }}</span>
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

      <div class="col relative-position desktop-only" align="center">
        <q-scroll-area style="height: 100vh; ">
          <div class="q-px-xs q-pt-md" style="max-width:330px;width:95%;margin:auto;">
            <div class>
              <span class="font-h3">{{ currentPatientData.name }} {{ currentPatientData.surname }}</span>
              <br />
              <div class="font-body q-mt-sm">
                <span class="color-light-gray">รหัส</span>
                {{ currentPatientData.HN }}
                <span class="color-light-gray">วันเกิด</span>
                {{ currentPatientData.dateOfBirth }}
                <span
                  class="color-primary-500 cursor-pointer"
                  @click="isDetails = true"
                >เพิ่มเติม</span>
              </div>
            </div>

            <div class="q-mt-md" v-for="(items,index) in currentPatientLog" :key="index">
              <q-card class="my-card font-body">
                <div class="q-pa-sm" align="center">
                  <span>{{ items.inputDate }} รอบ {{ items.inputRound }}:00 น.</span>
                </div>

                <q-separator />

                <div class="row" style="padding:20px 30px;">
                  <div class="col-8">
                    <div class="q-py-xs" align="left">
                      <span>อุณหภูมิ</span>
                    </div>
                  </div>
                  <div class="col" align="right">
                    <div class="q-py-xs" align="right">
                      <span>{{ items.temperature }} &#176;C</span>
                    </div>
                  </div>
                </div>

                <div class="q-mb-xs" align="center">
                  <span>อาการตอนนี้</span>
                </div>
                <q-separator />

                <div class="row q-my-md q-px-lg">
                  <div class="col-1" style="width:15px;">
                    <div class="q-py-xs" v-for="(sym,index2) in items.symptomsCheck" :key="index2">
                      <q-icon name="fiber_manual_record" size="7px"></q-icon>
                    </div>
                  </div>
                  <div class="col">
                    <div
                      class="q-py-xs"
                      v-for="(sym2,index3) in items.symptomsCheck"
                      :key="index3"
                      align="left"
                    >
                      <span>{{ sym2.sym }}</span>
                    </div>
                  </div>
                </div>
              </q-card>
            </div>
          </div>
        </q-scroll-area>
      </div>
    </div>

    <q-dialog v-model="isDialogAddNewPatient" persistent maximized>
      <q-card class="q-pa-md bg-surface">
        <div align="right">
          <q-btn dense round flat class="color-black" v-close-popup>
            <q-icon name="close" size="45px"></q-icon>
          </q-btn>
        </div>

        <div class="dialog-container">
          <div>
            <div class="font-h3" align="center">เพิ่มผู้ป่วยใหม่</div>
          </div>
          <div class="q-pa-xs q-mt-md">
            <div>
              <span class="font-body">รหัสผู้ป่วย</span>
            </div>
            <q-input
              outlined
              label="NH"
              hide-bottom-space
              ref="nh"
              v-model="patientObj.NH"
              :rules="[val => !!val]"
            ></q-input>
          </div>
          <div class="q-pa-xs q-mt-sm row">
            <div class="col-12">
              <span class="font-body">ชื่อและนามสกุล</span>
            </div>
            <div class="col-5">
              <q-input
                outlined
                class="q-mr-xs"
                hide-bottom-space
                label="ชื่อจริง"
                ref="name"
                v-model="patientObj.name"
                :rules="[val => !!val]"
              ></q-input>
            </div>
            <div class="col">
              <q-input
                outlined
                hide-bottom-space
                class="q-ml-xs"
                label="นามสกุล"
                ref="surname"
                v-model="patientObj.surname"
                :rules="[val => !!val]"
              ></q-input>
            </div>
          </div>
          <div class="q-pa-xs q-mt-sm">
            <div>
              <span class="font-body">เพศ</span>
            </div>
            <div class="q-my-sm">
              <q-radio
                dense
                v-model="patientObj.sex"
                name="sex"
                val="male"
                label="ชาย"
                color="teal"
              />
            </div>
            <div>
              <q-radio
                dense
                class="font-body"
                v-model="patientObj.sex"
                name="sex"
                val="female"
                label="หญิง"
                color="teal"
              />
            </div>
          </div>
          <div class="q-pa-xs q-mt-md">
            <div>
              <span class="font-body">วันเดือนปีเกิด</span>
            </div>
            <div>
              <q-input
                hide-bottom-space
                outlined
                v-model="patientObj.dateOfBirth"
                mask="##/##/####"
                label="เลือกวันที่"
                ref="birth"
                :rules="[val => val.length == 10]"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date
                        v-model="patientObj.dateOfBirth"
                        @input="() => $refs.qDateProxy.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="q-pa-xs q-mt-sm">
            <div>
              <span class="font-body">วันที่เข้าทำการรักษา</span>
            </div>
            <div>
              <q-input
                outlined
                v-model="patientObj.dateOfAdmit"
                mask="##/##/####"
                label="เลือกวันที่"
                ref="admit"
                hide-bottom-space
                :rules="[val => val.length == 10]"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date
                        v-model="patientObj.dateOfAdmit"
                        @input="() => $refs.qDateProxy.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="q-pa-xs q-mt-sm">
            <div>
              <span class="font-body">ห้องผู้ป่วย</span>
            </div>
            <div class="q-my-xs" v-for="(item,index) in patientRoom" :key="index">
              <q-radio
                class="font-body"
                dense
                v-model="patientObj.patientRoomKey"
                name="sex"
                :val="item.key"
                :label="item.name"
                color="teal"
              />
            </div>
          </div>
          <div class="q-pa-xs q-mt-md">
            <div>
              <span class="font-body">Diagnosis</span>
            </div>
            <div>
              <q-input
                outlined
                hide-bottom-space
                class
                type="textarea"
                label="ระบุอาการและโรคที่เป็น"
                ref="diagnosis"
                v-model="patientObj.diagnosis"
                :rules="[val => !!val]"
              ></q-input>
            </div>
          </div>

          <div class="q-mt-lg q-pa-xs" align="center">
            <q-btn
              :disable="isDisabled"
              dense
              class="button-action small"
              label="บันทึก"
              @click="saveData()"
            ></q-btn>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { db } from "../router";
export default {
  data() {
    return {
      items: [{}, {}, {}, {}, {}, {}, {}],
      patientRoom: [],
      isDialogAddNewPatient: false,
      isLoading: false,
      patientData: [],
      roomKey: this.$route.params.roomKey,
      roomData: "",
      isDisabled: false,
      patientObj: {
        HN: "",
        name: "",
        surname: "",
        sex: "male",
        dateOfBirth: "",
        dateOfAdmit: "",
        patientRoomKey: "",
        dianosis: ""
      },
      isListenPatientData: "",
      currentPatientData: "",
      patientLog: "",
      currentPatientLog: "",
      platForm: this.$q.platform.is
    };
  },
  methods: {
    showPatientData(key) {
      // console.log(this.patientData.filter(x => x.key == key));
      console.log(key);
      if (this.platForm.desktop) {
        this.loadingShow();
        this.currentPatientData = this.patientData.filter(x => x.key == key)[0];
        this.currentPatientLog = this.patientLog.filter(
          x => x.patientKey == key
        );
        this.loadingHide();
      } else {
        // MOBILE ROUTE TO OTHER PAGE
        console.log("MOBILE");
      }
    },
    saveData() {
      let refs = db.collection("patientData");

      this.$refs.nh.validate();
      this.$refs.name.validate();
      this.$refs.surname.validate();
      this.$refs.birth.validate();
      this.$refs.admit.validate();
      this.$refs.diagnosis.validate();

      if (
        this.$refs.nh.hasError ||
        this.$refs.name.hasError ||
        this.$refs.surname.hasError ||
        this.$refs.birth.hasError ||
        this.$refs.admit.hasError ||
        this.$refs.diagnosis.hasError
      ) {
        alert("กรุณากรอกข้อมูลให้ไม่ครบ");
        return;
      }

      if (this.patientObj.sex == "") {
        alert("กรุณาเลือกเพศ");
        return;
      }

      if (this.patientObj.patientRoomKey == "") {
        alert("กรุณาเลือกห้องผู้ป่วย");
        return;
      }

      this.loadingShow();
      this.isDisabled = true;
      this.patientObj.hospitalKey = "d9lzg1cDW3csxvCzlq0i";
      refs.add(this.patientObj).then(() => {
        this.loadingHide();
        this.isDisabled = false;
        this.patientObj = {
          HN: "",
          name: "",
          surname: "",
          sex: "",
          dateOfAdmit: "",
          dateOfBirth: "",
          diagnosis: "",
          hospitalKey: "",
          patientRoomKey: ""
        };
        this.isDialogAddNewPatient = false;
      });
    },
    loadPatientRoom() {
      db.collection("patientRoom")
        .where("hospitalKey", "==", "d9lzg1cDW3csxvCzlq0i")
        .get()
        .then(doc => {
          let dataTemp = [];
          doc.forEach(element => {
            dataTemp.push({ ...element.data(), ...{ key: element.id } });
          });
          this.patientRoom = dataTemp;
          this.loadPatientDataInThisRoom();
        });
    },
    loadRoomData() {
      this.loadingShow();
      db.collection("patientRoom")
        .doc(this.roomKey)
        .get()
        .then(doc => {
          this.roomData = doc.data();
          this.patientObj.patientRoomKey = doc.id;
          this.loadPatientRoom();
        });
    },
    loadPatientDataInThisRoom() {
      this.isListenPatientData = db
        .collection("patientData")
        .where("patientRoomKey", "==", this.roomKey)
        .onSnapshot(doc => {
          let dataTemp = [];
          doc.forEach(element => {
            dataTemp.push({ ...element.data(), ...{ key: element.id } });
          });
          this.patientData = dataTemp;
          this.loadPatientLogInThisRoom();
        });
    },
    loadPatientLogInThisRoom() {
      db.collection("patientLog")
        .where("hospitalKey", "==", "d9lzg1cDW3csxvCzlq0i")
        .where("patientRoomKey", "==", this.roomKey)
        .get()
        .then(doc => {
          let dataTemp = [];
          doc.forEach(element => {
            dataTemp.push({ ...element.data(), ...{ key: element.id } });
          });
          dataTemp = dataTemp.sort((a, b) => b.inputRound - a.inputRound);
          this.patientLog = dataTemp;
          this.loadingHide();
        });
    }
  },
  mounted() {
    this.loadRoomData();
  },
  beforeDestroy() {
    this.isListenPatientData();
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