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
                @click="isSearch = false"
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
            <q-btn
              dense
              round
              flat
              class="q-mx-sm"
              size="14px"
              @click="
                (isDialogNotification = true),
                  (isNotification = !isNotification)
              "
            >
              <q-img v-if="!isNotification" src="../statics/pic/Notification.png" width="30px"></q-img>
              <q-img v-if="isNotification" src="../statics/pic/Notification Mute.png" width="30px"></q-img>
            </q-btn>
            <q-btn dense round flat class="q-mx-sm" size="14px">
              <q-img src="../statics/pic/Fax.png" width="30px"></q-img>
              <q-menu square :offset="[55, 16]">
                <q-list style="min-width: 160px">
                  <q-btn class="fit row no-border-radius" flat>
                    <div class="col" align="left">พิมพ์ QR Code</div>
                  </q-btn>
                  <q-btn class="fit row no-border-radius" flat>
                    <div class="col" align="left">พิมพ์รายละเอียดผู้ป่วย</div>
                  </q-btn>
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
      </q-toolbar>

      <q-dialog v-model="isDialogNotification" persistent>
        <q-card style="max-width: 280px" class="q-py-xs q-px-sm no-border-radius">
          <q-card-section class="q-pt-md">
            <div class="font-h3">
              <span v-if="isNotification">ยกเลิกการแจ้งเตือน</span>
              <span v-if="!isNotification">เปิดการแจ้งเตือน</span>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <span class="font-body">
              <span v-if="isNotification">ระบบจะไม่แจ้งเตือน เมื่อคนไข้ท่านนี้ไม่กรอกข้อมูลตามเวลา</span>
              <span v-if="!isNotification">ระบบจะแจ้งเตือนเมื่อคนไข้ ท่านนี้ไม่กรอกข้อมูลตามเวลา</span>
            </span>
          </q-card-section>

          <div class="q-px-md q-pb-md q-pt-xs" align="right">
            <q-btn flat class="button-action small" dense label="ปิด" v-close-popup />
          </div>
        </q-card>
      </q-dialog>
    </q-header>

    <!-- TODO : Container List Data -->
    <div class="row">
      <div
        class="col-4 container-list bg-white"
        v-if="isSearch"
        :class="$q.platform.is.desktop ? 'desktop-only' : 'mobile-only'"
      >
        <div
          class="relative-position cursor-pointer"
          v-ripple
          v-for="(item, index) in searchPatient"
          :key="index"
          @click="selectPatient(item.key)"
        >
          <div class="row q-py-sm font-body full-width">
            <div class="col-1" style="width:30px;" align="center"></div>
            <div class="col text-overflow" align="left">
              <span class="no-padding">{{ item.name + " " + item.surname }}</span>
              <br />
              <span class="color-light-gray">{{ "HN" + item.HN }}</span>
            </div>
            <div class="col-4 q-px-xs" style="max-width:120px;width:100%;" align="right">
              <!-- <span>{{"รอบ " + patient.betweenTime + " น "}}</span> -->
            </div>
            <div class="col-1 self-center" style="width:30px;">
              <q-icon name="chevron_right" size="24px"></q-icon>
            </div>
          </div>
          <q-separator />
        </div>
      </div>
      <div
        class="col-4 container-list bg-white"
        v-else
        :class="$q.platform.is.desktop ? 'desktop-only' : 'mobile-only'"
      >
        <!-- TODO : List Data Component -->
        <div v-for="(item, index) in patientRoom" :key="index">
          <div class="q-px-md" style="padding-top:22px;padding-bottom:8px">
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
              }).length == 0
            "
          />
          <div
            class="relative-position cursor-pointer"
            v-ripple
            v-for="(patient, index2) in patientList"
            :key="index2"
            v-show="patient.patientRoomKey == item.key"
            @click="selectPatient(patient.key)"
          >
            <div class="row q-py-sm font-body full-width">
              <div class="col-1" style="width:30px;" align="center">
                <!-- <q-icon
                  v-if="item.status != 'read'"
                  name="fiber_manual_record"
                  size="10px"
                  :class="
                    item.date < 27 && item.status == 'readNoMark'
                      ? 'color-error'
                      : 'color-primary-500'
                  "
                ></q-icon>-->
              </div>
              <div class="col text-overflow" align="left">
                <span class="no-padding">{{ patient.name + " " + patient.surname }}</span>
                <br />
                <span class="color-light-gray">{{ "HN" + patient.HN }}</span>
              </div>
              <div class="col-4 q-px-xs" style="max-width:120px;width:100%;" align="right">
                <!-- <span>{{"รอบ " + patient.betweenTime + " น "}}</span> -->
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
        <div class="font-h3 color q-ma-xl q-pa-xl color-light-gray" v-if="!isShowDetails">
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
export default {
  components: {
    patientDetails,
    addEditPatient
  },
  data() {
    return {
      // NOTE  Patient Data List From DB
      patientKey: "",
      patientDiagnosisList: [],
      items: [{}, {}, {}, {}, {}, {}, {}],

      // NOTE  Patient Room & List Data
      patientRoom: [],
      patientList: [],

      // NOTE  Search Patient
      search: "",
      patientSearch: [],

      // NOTE Current Date
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

      // NOTE  sync
      syncRoom: "",
      syncPatient: ""
    };
  },
  methods: {
    closePopup(val) {
      this.isDialogAddNewPatient = val.isDialogAddNewPatient;
    },
    selectPatient(key) {
      this.patientKey = key;

      if (this.$q.platform.is.desktop) {
        this.isShowDetails = false;

        setTimeout(() => {
          this.isShowDetails = true;
        }, 500);
      } else {
        this.$router.push("/patientDetails/" + key + "/" + this.$route.name);
      }
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
      this.loadingShow();

      setTimeout(() => {
        db.collection("patientData")
          .doc(this.patientKey)
          .delete()
          .then(() => {
            this.isShowDetails = false;
            setTimeout(() => {
              this.loadingHide();
            }, 1500);
          });
      }, 1000);
    },

    async loadRoom() {
      this.currentDate = await this.getDate();

      let refs = db
        .collection("patientRoom")
        .where("hospitalKey", "==", "d9lzg1cDW3csxvCzlq0i");

      this.loadingShow();

      this.syncRoom = refs.onSnapshot(doc => {
        let temp = [];
        if (doc.size) {
          doc.forEach(result => {
            let setData = {
              key: result.id,
              ...result.data()
            };

            temp.push(setData);
          });

          temp.sort((a, b) => {
            return a.name > b.name ? 1 : -1;
          });

          this.patientRoom = temp;

          this.loadPatient();

          // return "ส่งข้อมูลเรียบร้อย";
        } else {
          this.loadingHide();
          // return "ไม่มีข้อมูลห้องผู้ป่วย";
        }
      });
    },
    loadPatient() {
      let refs = db
        .collection("patientData")
        .where("hospitalKey", "==", "d9lzg1cDW3csxvCzlq0i");

      this.syncPatient = refs.onSnapshot(doc => {
        let temp = [];

        if (doc.size) {
          doc.forEach(result => {
            let setData = {
              key: result.id,
              ...result.data()
            };

            temp.push(setData);
          });

          this.patientList = temp;

          this.loadingHide();

          // return "ส่งข้อมูลเรียบร้อย";
        } else {
          this.loadingHide();
          // return "ไม่มีข้อมูลคนไข้";
        }
      });
    }
  },
  computed: {
    searchPatient() {
      let getSearch = "";
      if (this.search != "") {
        getSearch = this.patientList.filter(x => {
          return x.HN.includes(this.search) || x.name.includes(this.search);
        });
      }

      return getSearch;
    }
  },
  mounted() {
    this.loadRoom();
  },
  beforeDestroy() {
    this.syncRoom();
    this.syncPatient();
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
