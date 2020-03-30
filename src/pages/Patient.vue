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
            @click="isDialogAddNewPatient = true"
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
          v-for="(item, index) in patientSearch"
          :key="index"
          @click="selectPatient(item)"
        >
          <div class="row q-py-sm font-body full-width">
            <div class="col-1" style="width:30px;" align="center"></div>
            <div class="col text-overflow" align="left">
              <span class="no-padding">
                {{
                item.name + " " + item.surname
                }}
              </span>
              <br />
              <span class="color-light-gray">{{ "NH" + item.NH }}</span>
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
        class="col-4 container-list"
        v-else
        :class="$q.platform.is.desktop ? 'desktop-only' : 'mobile-only'"
      >
        <!-- TODO : List Data Component -->
        <div v-for="(item, index) in patientRoom" :key="index">
          <div class="q-px-md" style="padding-top:22px;padding-bottom:8px">
            <span
              class="font-body color-primary-600 text-bold"
              style="font-size:14px;font-weight:bold;"
            >{{ item.name }}</span>
          </div>
          <div
            class="relative-position cursor-pointer"
            v-ripple
            v-for="(patient, index2) in patientList"
            :key="index2"
            v-show="patient.patientRoomKey == item.key"
            @click="selectPatient(patient)"
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
                <span class="no-padding">
                  {{
                  patient.name + " " + patient.surname
                  }}
                </span>
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
      <div class="col" style="margin-top:30px;" v-if="$q.platform.is.desktop">
        <div class="font-h3 color q-ma-xl q-pa-xl color-light-gray" v-if="!isShowDetails">
          <q-icon name="arrow_back" class="q-mr-sm"></q-icon>เลือกผู้ป่วย
          เพื่อดูรายละเอียด
        </div>
        <div class="q-px-xs" style="max-width:330px;width:95%;margin:auto;" v-if="isShowDetails">
          <div class>
            <span class="font-h3">
              <!-- {{ patientData.name }} -->
              ทดสอบ
            </span>
            <br />
            <div class="font-body q-mt-sm">
              <span class="color-light-gray">รหัส</span>
              <!-- {{ " " + patientData.NH + " " + "&nbsp;&nbsp;" }} -->
              {{ "1234567890" + "&nbsp;" }}
              <span class="color-light-gray">วันเกิด</span>
              <!-- {{ " " + patientData.birth + " " + "&nbsp;&nbsp;" }} -->
              {{ " 00/00/0000" + "&nbsp;" }}
              <span
                class="color-primary-500 cursor-pointer"
                @click="isDetails = true"
              >เพิ่มเติม</span>
            </div>
          </div>

          <div class="q-mt-md">
            <q-card class="my-card font-body">
              <div class="q-pa-sm" align="center">
                <span>12 มีนาคม 2562 รอบ 2:00 น.</span>
              </div>

              <q-separator />

              <div class="row" style="padding:20px 30px;">
                <div class="col-8">
                  <div class="q-py-xs">
                    <span>อุณหภูมิ</span>
                  </div>
                  <div class="q-py-xs">
                    <span>ความดันโลหิต</span>
                  </div>
                  <div class="q-py-xs">
                    <span>ออกซิเจนในเลือด</span>
                  </div>
                  <div class="q-py-xs">
                    <span>การเต้นของหัวใจ</span>
                  </div>
                </div>
                <div class="col" align="right">
                  <div class="q-py-xs">
                    <span>37.5 &#176;C</span>
                  </div>
                  <div class="q-py-xs">
                    <span>150/50</span>
                  </div>
                  <div class="q-py-xs">
                    <span>90%</span>
                  </div>
                  <div class="q-py-xs">
                    <span>150/min</span>
                  </div>
                </div>
              </div>

              <div class="q-mb-xs" align="center">
                <span>อาการตอนี้</span>
              </div>
              <q-separator />

              <div class="row q-my-md q-px-lg">
                <div class="col-1" style="width:15px;">
                  <div class="q-py-xs">
                    <q-icon name="fiber_manual_record" size="7px"></q-icon>
                  </div>
                  <div class="q-py-xs">
                    <q-icon name="fiber_manual_record" size="7px"></q-icon>
                  </div>
                  <div class="q-py-xs">
                    <q-icon name="fiber_manual_record" size="7px"></q-icon>
                  </div>
                  <div class="q-py-xs">
                    <q-icon name="fiber_manual_record" size="7px"></q-icon>
                  </div>
                </div>
                <div class="col">
                  <div class="q-py-xs">
                    <span>ไอ</span>
                  </div>
                  <div class="q-py-xs">
                    <span>แน่นหน้าอก: หายใจไม่สะดวก</span>
                  </div>
                  <div class="q-py-xs">
                    <span>อาเจียน</span>
                  </div>
                  <div class="q-py-xs">
                    <span>อื่นๆ:มึนหัวเริ่มรู้สึกบ้านหมุน</span>
                  </div>
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- TODO : Container Dialog Model -->
    <q-dialog v-model="isDetails">
      <q-card class="my-card font-body" style="max-width:320px;width:100%;">
        <div class="q-pa-sm" align="center">
          <span>ข้อมูลผู้ป่วย</span>
        </div>

        <q-separator />

        <div class="q-my-md q-px-sm">
          <div>
            <span class="font-h3">
              <!-- {{ patientData.name }} -->
              ทดสอบ
            </span>
          </div>
          <div class="row q-mt-sm">
            <div class="col-6 q-my-xs">
              <span class="color-light-gray">รหัส</span>
              <!-- {{ " " + patientData.NH + " " + "&nbsp;" }} -->
              {{ " 1234567890 " + "&nbsp;" }}
            </div>
            <div class="col-6 q-my-xs" align="right">
              <span class="color-light-gray">วันเกิด</span>
              <!-- {{ " " + patientData.birth }} -->
              {{ " 00/00/0000 " }}
            </div>
            <div class="col-2 q-my-xs" style="width:75px;">
              <span class="color-light-gray">Diagnosis</span>
            </div>
            <div class="col q-my-xs">
              {{
              "Covid-19 มีอาการปวดหัวข้างเดียวและอาการน้ำในหูไม่เท่ากันเพิ่มเติมขึ้นมา"
              }}
            </div>
            <div class="col-12 q-my-xs">
              <span class="color-light-gray">อายุ</span>
              {{ " " + "43" }}
            </div>
            <div class="col-12 q-my-xs">
              <span class="color-light-gray">เพศ</span>
              {{ " " + "ชาย" }}
            </div>
            <div class="col-12 q-my-xs">
              <span class="color-light-gray">ห้อง</span>
              {{ " " + "ห้องพิเศษ 1" }}
            </div>
            <div class="col-12 q-my-xs">
              <span class="color-light-gray">เข้ารักษา</span>
              {{ " " + "23/01/2563" }}
            </div>
          </div>

          <div align="right" class="q-mt-md">
            <q-btn flat class="button-action small" dense label="ปิด" @click="isDetails = false"></q-btn>
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isDialogAddNewPatient" persistent :maximized="maximizedToggle">
      <q-card class="q-pa-md bg-surface">
        <div align="right">
          <q-btn
            dense
            round
            flat
            class="color-black"
            v-close-popup
            @click="closeDialogAddPatient()"
          >
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
              label="HN"
              hide-bottom-space
              ref="hn"
              v-model="patientData.HN"
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
                v-model="patientData.name"
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
                v-model="patientData.surname"
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
                v-model="patientData.sex"
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
                v-model="patientData.sex"
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
                v-model="patientData.dateOfBirth"
                mask="##/##/####"
                label="เลือกวันที่"
                ref="birth"
                :rules="[val => val.length == 10]"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date
                        v-model="patientData.dateOfBirth"
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
                v-model="patientData.dateOfAdmit"
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
                        v-model="patientData.dateOfAdmit"
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
            <div class="q-my-xs" v-for="(item, index) in patientRoom" :key="index">
              <q-radio
                class="font-body"
                dense
                v-model="patientData.patientRoomKey"
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
                v-model="patientData.diagnosis"
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
import { db } from "../router/index.js";
export default {
  data() {
    return {
      patientData: {
        NH: "",
        name: "",
        surname: "",
        sex: "",
        dateOfAdmit: "",
        dateOfBirth: "",
        diagnosis: "",
        hospitalKey: "",
        patientRoomKey: ""
      },
      patientKey: "",
      diagnosisList: [],

      // Patient Room & List Data
      patientRoom: [],
      patientList: [],

      // Search Patient
      search: "",
      patientSearch: [],

      // Active Function
      isShowDetails: false,
      isDetails: false,
      isNotification: false,
      isDialogNotification: false,

      // Dialog Add New Patient
      isDialogAddNewPatient: false,
      maximizedToggle: true,

      isSearch: true,
      isAddMode: true,
      isDisabled: false
    };
  },
  methods: {
    selectPatient(data) {
      this.patientKey = data.key;
      this.isShowDetails = true;
    },
    editPatient() {
      this.isDialogAddNewPatient = true;
      this.isAddMode = false;

      let setData = this.patientList.filter(x => {
        return x.key == this.patientKey;
      })[0];

      this.patientData = setData;
    },
    deletePatient() {},
    closeDialogAddPatient() {
      this.patientData = {
        NH: "",
        name: "",
        surname: "",
        sex: "",
        dateOfAdmit: "",
        dateOfBirth: "",
        diagnosis: "",
        hospitalKey: "",
        patientRoomKey: ""
      };
    },
    saveData() {
      let refs = this.isAddMode
        ? db.collection("patientData")
        : db.collection("patientData").doc(this.patientKey);

      this.$refs.hn.validate();
      this.$refs.name.validate();
      this.$refs.surname.validate();
      this.$refs.birth.validate();
      this.$refs.admit.validate();

      if (
        this.$refs.hn.hasError ||
        this.$refs.name.hasError ||
        this.$refs.surname.hasError ||
        this.$refs.birth.hasError ||
        this.$refs.admit.hasError
      ) {
        alert("กรุณากรอกข้อมูลให้ไม่ครบ");
        return;
      }

      if (this.patientData.sex == "") {
        alert("กรุณาเลือกเพศ");
        return;
      }

      if (this.patientData.patientRoomKey == "") {
        alert("กรุณาเลือกห้องผู้ป่วย");
        return;
      }

      this.loadingShow();
      this.isDisabled = true;

      this.patientData.hospitalKey = "d9lzg1cDW3csxvCzlq0i";

      if (this.isAddMode) {
        refs.add(this.patientData).then(() => {
          this.loadingHide();
          this.isDisabled = false;
          this.patientData = {
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
        });
      } else {
        delete this.patientData.key;

        refs.update(this.patientData).then(() => {
          this.loadingHide();
          this.isDisabled = false;
        });
      }
    },
    loadRoom() {
      let refs = db
        .collection("patientRoom")
        .where("hospitalKey", "==", "d9lzg1cDW3csxvCzlq0i");

      this.loadingShow();

      refs.onSnapshot(doc => {
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
          // return "ไม่มีข้อมูลห้องผู้ป่วย";
        }
      });
    },
    loadPatient() {
      let refs = db
        .collection("patientData")
        .where("hospitalKey", "==", "d9lzg1cDW3csxvCzlq0i");

      refs.onSnapshot(doc => {
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
          // return "ไม่มีข้อมูลคนไข้";
        }
      });
    }
  },
  computed: {
    searchPatient() {
      let getSearch = this.patientList.filter(x => {
        return x.HN;
      });

      return this.data;
    }
  },
  mounted() {
    this.loadRoom();
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
