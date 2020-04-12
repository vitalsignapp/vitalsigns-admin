<template>
  <q-page>
    <!-- TODO : Container Header Bar -->
    <q-header class="row color-white">
      <q-toolbar
        class="col-4 bg-primary-500 no-padding shadow-1"
        :style="
          $q.platform.is.desktop ? 'max-width:360px;width:100%;' : 'width:100%;'
        "
      >
        <q-toolbar-title v-if="!isSearch">
          <div class="q-px-md">
            <span class="font-h3">ผู้ป่วย</span>
          </div>
        </q-toolbar-title>
        <div class="q-pa-sm font-body" v-if="!isSearch">
          <q-btn
            :disable="patientRoom.length == 0"
            dense
            label="+ เพิ่มผู้ป่วย"
            class="q-mx-sm"
            flat
            @click="addPatient()"
          ></q-btn>
          <q-btn flat round dense icon="search" @click="isSearch = true" />
        </div>
        <div class="col q-px-sm" v-if="isSearch">
          <q-input
            class="font-body"
            bg-color="white"
            rounded
            outlined
            dense
            v-model="search"
            label="ค้นหา"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>

            <template v-slot:after>
              <span
                class="font-body q-px-sm color-white cursor-pointer"
                @click="isSearch = false,search = ''"
              >ยกเลิก</span>
            </template>
          </q-input>
        </div>
      </q-toolbar>
      <q-toolbar class="col bg-primary-500 shadow-1" v-if="$q.platform.is.desktop">
        <div class="row full-width" v-if="isShowDetails">
          <q-toolbar-title>
            <div class="q-px-xs">
              <span class="font-h3">รายละเอียดผู้ป่วย</span>
            </div>
          </q-toolbar-title>
          <q-space />
          <div>
            <q-btn dense round flat class="q-mx-sm" size="14px" @click="changeNotify()">
              <q-img
                v-if="patientSelected.isShowNotify"
                src="../statics/pic/Notification.png"
                width="30px"
              ></q-img>
              <q-img
                v-if="!patientSelected.isShowNotify"
                src="../statics/pic/Notification Mute.png"
                width="30px"
              ></q-img>
            </q-btn>
            <q-btn dense round flat class="q-mx-sm" size="14px">
              <q-img src="../statics/pic/Fax.png" width="30px"></q-img>
              <q-menu square :offset="[55, 16]">
                <q-list style="min-width: 160px">
                  <q-btn class="fit row no-border-radius" flat @click="printBtn()">
                    <div class="col" align="left">พิมพ์ QR Code</div>
                  </q-btn>
                  <!-- <q-btn class="fit row no-border-radius" flat>
                    <div class="col" align="left">พิมพ์รายละเอียดผู้ป่วย</div>
                  </q-btn>-->
                </q-list>
              </q-menu>
            </q-btn>
            <q-btn dense round flat class="q-ml-sm" size="14px">
              <q-img src="../statics/pic/Option.png" width="30px"></q-img>
              <q-menu square :offset="[5, 16]">
                <q-list style="min-width: 150px">
                  <q-btn class="fit row no-border-radius" flat @click="editPatient()">
                    <div class="col" align="left">แก้ไขข้อมูลผู้ป่วย</div>
                  </q-btn>
                  <q-btn class="fit row no-border-radius" flat @click="deletePatient()">
                    <div class="col text-red" align="left">ลบผู้ป่วย</div>
                  </q-btn>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>

        <q-dialog v-model="isDialogNotification" persistent>
          <q-card style="max-width: 280px" class="q-py-xs q-px-sm no-border-radius">
            <q-card-section class="q-pt-md">
              <div class="font-h3">
                <span v-if="!patientSelected.isShowNotify">ยกเลิกการแจ้งเตือน</span>
                <span v-if="patientSelected.isShowNotify">เปิดการแจ้งเตือน</span>
              </div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <span class="font-body">
                <span
                  v-if="!patientSelected.isShowNotify"
                >ระบบจะไม่แจ้งเตือน เมื่อคนไข้ท่านนี้ไม่กรอกข้อมูลตามเวลา</span>
                <span
                  v-if="patientSelected.isShowNotify"
                >ระบบจะแจ้งเตือนเมื่อคนไข้ ท่านนี้ไม่กรอกข้อมูลตามเวลา</span>
              </span>
            </q-card-section>

            <div class="q-px-md q-pb-md q-pt-xs" align="right">
              <q-btn flat class="button-action small" dense label="ปิด" v-close-popup />
            </div>
          </q-card>
        </q-dialog>
      </q-toolbar>
    </q-header>

    <!-- TODO : Container List Data -->
    <div class="row">
      <div
        class="col-4 container-list bg-white"
        :class="$q.platform.is.desktop ? 'desktop-only' : 'mobile-only'"
      >
        <!-- TODO : List Data Component -->
        <div v-for="(item, index) in patientRoom" :key="index">
          <div class="q-px-md" style="padding-top:22px;padding-bottom:8px" v-if="!isSearch">
            <span
              class="font-body color-primary-600 text-bold"
              style="font-size:14px;font-weight:bold;"
            >
              {{
              item.name +
              " ( " +
              patientList.filter(x => {
              return x.patientRoomKey == item.key;
              }).length +
              " คน )"
              }}
            </span>
          </div>
          <q-separator
            v-if="
              patientList.filter(x => {
                return x.patientRoomKey == item.key;
              }).length == 0 && !isSearch
            "
          />
          <div
            class="relative-position cursor-pointer"
            :class="[patient.key == patientSelected.key ? 'bg-placeholder' : null,isDisabled ? 'no-pointer-events' : null]"
            v-ripple
            v-for="(patient, index2) in searchPatient"
            :key="index2"
            v-show="patient.patientRoomKey == item.key"
            @click="selectPatient(patient.key)"
          >
            <div class="row q-py-sm font-body full-width">
              <div class="col-1" style="width:30px;" align="center">
                <div v-if="patient.isShowNotify">
                  <div v-if="patient.lastRecord && patient.lastRecord.date == currentDate">
                    <q-icon
                      v-if="!patient.isRead"
                      name="fiber_manual_record"
                      size="10px"
                      class="color-primary-500"
                    ></q-icon>
                  </div>
                  <div v-if="patient.lastRecord && patient.lastRecord.date != currentDate">
                    <q-icon name="fiber_manual_record" size="10px" class="color-error"></q-icon>
                  </div>
                </div>
              </div>
              <div class="col text-overflow" align="left">
                <span class="no-padding">{{ patient.name + " " + patient.surname }}</span>
                <br />
                <span class="color-light-gray">{{patient.username}}</span>
              </div>
              <div
                class="col-4 q-pr-sm"
                :class="!patient.lastRecord ? 'self-center' : null"
                style="max-width:135px;width:100%;font-size:14px;"
                align="right"
              >
                <div v-if="!patient.lastRecord">
                  <span class="color-light-gray">{{"ยังไม่มีข้อมูล"}}</span>
                </div>
                <div v-if="patient.lastRecord">
                  <div v-if="patient.lastRecord.date == currentDate">
                    <span>{{"รอบ " + patient.lastRecord.round + ":00 น."}}</span>
                  </div>
                  <div
                    v-if="patient.lastRecord.date != currentDate"
                    :class="patient.isShowNotify ? 'color-error' : 'color-light-gray'"
                  >
                    <span>{{patient.lastRecord.dateShow}}</span>
                    <br />
                    <q-icon
                      v-if="!patient.isShowNotify"
                      name="fas fa-bell-slash"
                      class="q-pr-sm"
                      size="16px"
                    ></q-icon>
                    <span>ไม่ได้ส่งข้อมูลล่าสุด</span>
                  </div>
                </div>
              </div>
              <div class="col-1 self-center" style="width:30px;">
                <q-icon name="chevron_right" size="24px"></q-icon>
              </div>
            </div>
            <q-separator />
          </div>
        </div>
      </div>

      <!-- TODO : Container Show Data -->
      <div class="col container-list" v-if="$q.platform.is.desktop">
        <!-- NOTE ยังไม่มีการโชว์ข้อมูลผู้ป่วย -->
        <div
          class="font-h3 color q-ma-xl q-pa-xl color-light-gray"
          v-if="!isShowDetails && isFirstLoad"
        >
          <q-icon name="arrow_back" class="q-mr-sm"></q-icon>เลือกผู้ป่วย
          เพื่อดูรายละเอียด
        </div>

        <!-- NOTE  รายละเอียด ผู้ป่วย -->
        <patient-details v-if="isShowDetails" :dataKey="patientKey" :dataRoute="$route.name"></patient-details>
      </div>
    </div>

    <add-edit-patient
      v-if="isDialogAddNewPatient"
      @sendBack="closePopup"
      :sendData="{patientKey:patientKey,isAddMode:isAddMode,isDialogAddNewPatient:isDialogAddNewPatient}"
    ></add-edit-patient>
  </q-page>
</template>

<script>
import { db } from "../router/index.js";
import patientDetails from "../components/patientDetails.vue";
import addEditPatient from "../components/addEditPatient.vue";
import { listRoom, listPatient } from "../api";

export default {
  components: {
    patientDetails,
    addEditPatient
  },
  data() {
    return {
      // NOTE  Patient Data List From DB
      patientKey: "",

      // NOTE  Patient Room & List Data
      patientRoom: [],
      patientList: [],
      patientCheckLog: [],
      patientSelected: "",

      // NOTE  Search Patient
      search: "",
      patientSearch: [],

      // NOTE Current Date
      dateTime: "",
      currentDate: "",

      // NOTE  Active Function
      isShowDetails: false,
      isDetails: false,
      isNotification: false,
      isDialogNotification: false,
      isDialogAddNewPatient: false,

      isSearch: false,
      isAddMode: true,
      isDisabled: false,
      isFirstLoad: true,

      // NOTE  sync
      syncRoom: "",
      syncPatient: "",
      syncCheckLog: ""
    };
  },
  methods: {
    printBtn() {
      let routeData = this.$router.resolve({
        path: "/QRCode/" + this.patientKey
      });
      window.open(routeData.href, "_blank");

      // this.$router.push("/QRCode/" + this.patientKey);
    },
    changeNotify() {
      this.isDialogNotification = true;

      let currentPatientDataSnapshot = this.patientList.filter(
        x => x.key == this.patientKey
      )[0];

      let showNotify = false;

      if (currentPatientDataSnapshot.isShowNotify == undefined) {
        showNotify = false;
      } else {
        showNotify = !currentPatientDataSnapshot.isShowNotify;
      }

      db.collection("patientData")
        .doc(this.patientKey)
        .update({
          isShowNotify: showNotify
        });

      this.patientSelected.isShowNotify = showNotify;
    },

    closePopup(val) {
      this.isDialogAddNewPatient = val.isDialogAddNewPatient;
    },
    selectPatient(key) {
      this.patientKey = key;
      this.isDisabled = true;

      this.isFirstLoad = false;

      this.isShowDetails = false;

      let refs = db.collection("patientData").doc(key);

      refs
        .update({
          isRead: true
        })
        .then(() => {
          if (this.$q.platform.is.desktop) {
            this.isShowDetails = true;

            let currentPatient = this.patientList.filter(
              x => x.key == this.patientKey
            )[0];

            this.patientSelected = currentPatient;
          } else {
            this.$router.push(
              "/patientDetails/" + key + "/" + this.$route.name
            );
          }

          setTimeout(() => {
            this.isDisabled = false;
          }, 300);
        });
    },
    addPatient() {
      this.isDialogAddNewPatient = true;
      this.isAddMode = true;
    },
    editPatient() {
      this.isDialogAddNewPatient = true;
      this.isAddMode = false;
    },
    deletePatient() {
      // ฟังก์ชันการลบข้อมูลผู้ป่วย
      this.$q
        .dialog({
          title: "ลบผู้ป่วย",
          message: "ต้องการลบผู้ป่วยใช่หรือไม่",
          ok: {
            color: "orange-5"
          },
          cancel: { textColor: "black", flat: true }
        })
        .onOk(() => {
          this.loadingShow();

          setTimeout(() => {
            db.collection("patientData")
              .doc(this.patientKey)
              .delete()
              .then(() => {
                console.log(">>>>>>>>>>>>>>> patientData",)
                db.collection("patientLog")
                  .where("patientKey", "==", this.patientKey)
                  .get()
                  .then(doc => {
                    let counter = 0;
                    doc.forEach(element => {
                      db.collection("patientLog")
                        .doc(element.id)
                        .delete()
                        .then(() => {
                          counter++;
                          if (counter == doc.size) {
                            this.loadingHide();
                          }
                        });
                    });

                    this.isShowDetails = false;
                  });
              });
          }, 500);
        });
    },
    async loadRoom() {
      this.dateTime = await this.getDate();

      let newYear = Number(this.dateTime.date.substr(6)) + Number(543);

      this.currentDate =
        this.dateTime.date.substr(0, 2) +
        " " +
        this.showMonthName(this.dateTime.date.substr(3, 2)) +
        " " +
        newYear;

      // let refs = db.collection("patientRoom")
      //   .where("hospitalKey", "==", this.$q.localStorage.getItem("hospitalKey"));

      this.loadingShow();

      // this.syncRoom = refs.onSnapshot(doc => {
      //   let temp = [];
      //   doc.forEach(result => {
      //     let setData = {
      //       key: result.id,
      //       ...result.data()
      //     };
      //     temp.push(setData);
      //   });
      //   temp.sort((a, b) => {
      //     return a.name > b.name ? 1 : -1;
      //   });

      //   this.patientRoom = temp;
      //   this.loadPatient();
      //   return "ส่งข้อมูลเรียบร้อย";
      // });

      const hospitalId = this.$q.localStorage.getItem("hospitalKey");
      const transform = (data = [])=> {
        return data = data.map(d => {
          return {
            ...d, 
            key: d.id, 
            hospitalKey: hospitalId,
            lastRecord: null,
          };
        }).sort((a, b) => { return a.name > b.name ? 1 : -1; });
      };

      this.patientRoom = await listRoom(hospitalId).then(transform);
      this.patientList = await listPatient(hospitalId).then(transform);
      this.loadingHide();
    },
    loadPatient() {
      let refs = db
        .collection("patientData")
        .where(
          "hospitalKey",
          "==",
          this.$q.localStorage.getItem("hospitalKey")
        );

      this.syncPatient = refs.onSnapshot(doc => {
        let temp = [];
        doc.forEach(result => {
          let setData = {
            key: result.id,
            lastRecord: null,
            ...result.data()
          };

          temp.push(setData);
        });

        temp.sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        });

        this.patientList = temp;

        this.loadingHide();

        // return "ส่งข้อมูลเรียบร้อย";
      });
    },
    loadPatientLog() {
      let refs = db.collection("patientLog");

      this.syncCheckLog = refs.onSnapshot(doc => {
        let temp = [];
        doc.forEach(result => {
          let setMonth = result.data().inputDate.substr(3, 2);

          let newMonth =
            result.data().inputDate.substr(0, 2) +
            " " +
            this.showMonthName(setMonth);

          let newDate =
            result.data().inputDate.substr(0, 2) +
            " " +
            this.showMonthName(setMonth) +
            " " +
            result.data().inputDate.substr(6);

          let setData = {
            key: result.data().patientKey,
            round: result.data().inputRound,
            dateShow: newMonth,
            date: newDate,
            microtime: result.data().microtime
          };

          temp.push(setData);
        });

        temp.sort((a, b) => {
          return b.microtime - a.microtime;
        });

        this.patientCheckLog = temp;

        this.patientList.forEach(patientResult => {
          let patientLength = temp.filter(x => {
            return x.key == patientResult.key;
          }).length;

          if (patientLength) {
            patientResult.lastRecord = temp.filter(x => {
              return x.key == patientResult.key;
            })[0];
          } else {
            patientResult.lastRecord = null;
          }
        });
      });
    }
  },
  computed: {
    searchPatient() {
      let getSearch = "";
      if (this.search != "") {
        getSearch = this.patientList.filter(x => {
          return (
            x.username.toLowerCase().includes(this.search) ||
            x.name.toLowerCase().includes(this.search) ||
            x.surname.toLowerCase().includes(this.search)
          );
        });
      } else {
        getSearch = this.patientList;
      }

      return getSearch;
    }
  },
  watch: {
    deep: true,
    patientList() {
      this.loadPatientLog();
      if (this.patientList.length == 0) {
        this.isShowDetails = false;
      }
    }
  },
  mounted() {
    this.loadRoom();
  },
  beforeDestroy() {
    if (typeof this.syncRoom == "function") {
      this.syncRoom();
    }

    if (typeof this.syncPatient == "function") {
      this.syncPatient();
    }

    if (typeof this.syncCheckLog == "function") {
      this.syncCheckLog();
    }
  }
};
</script>

<style lang="scss" scoped>
/* TODO : Container List Data And Scrollbar */
.container-list {
  overflow-y: auto;
  height: calc(100vh - 50px);
  border-right: 1px solid #b3b3b379;
}

.container-list.desktop-only {
  max-width: 360px;
  width: 100%;
}

.container-list.mobile-only {
  width: 100%;
}

.container-list::-webkit-scrollbar {
  width: 2px;
}

.container-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.container-list::-webkit-scrollbar-thumb {
  background: rgb(167, 167, 167);
}

.container-list::-webkit-scrollbar-thumb:hover {
  background: rgb(163, 163, 163);
}

.my-card {
  padding: 2px;
  border-radius: 10px;
}
</style>
