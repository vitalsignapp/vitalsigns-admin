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
          <q-btn dense round flat icon="more_vert" class="no-border-radius">
            <q-menu square :offset="[43, 10]">
              <q-list style="min-width: 100px">
                <q-btn class="fit row no-border-radius" flat @click="printAll()">
                  <div class="col" align="left">พิมพ์ QR Code ทั้งห้อง</div>
                </q-btn>
                <q-btn class="fit row no-border-radius" flat @click="isEditRoom = true">
                  <div class="col" align="left">แก้ไขข้อมูลห้องพัก</div>
                </q-btn>
                <q-btn class="fit row no-border-radius" flat @click="checkDeleteRoom()">
                  <div class="col color-error" align="left">ลบห้องพัก</div>
                </q-btn>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
      <q-toolbar class="col bg-primary-500 shadow-1" v-if="$q.platform.is.desktop ">
        <div class="row full-width" v-if="isClickedOnPatient">
          <q-toolbar-title>รายละเอียดผู้ป่วย</q-toolbar-title>

          <q-btn
            icon="notifications"
            v-show="!currentPatientData.isShowNotify"
            @click="changeNotify()"
            dense
            round
            flat
            class="q-mx-sm"
          ></q-btn>
          <q-btn
            icon="notifications_off"
            v-show="currentPatientData.isShowNotify"
            @click="changeNotify()"
            dense
            round
            class="q-mx-sm"
            flat
          ></q-btn>
          <q-btn dense round flat class="q-mx-sm" icon="print">
            <q-menu square :offset="[43, 16]">
              <q-list style="min-width: 160px">
                <q-btn class="fit row no-border-radius" flat @click="printBtn()">
                  <div class="col" align="left">พิมพ์ QR Code</div>
                </q-btn>
                <q-btn class="fit row no-border-radius" flat>
                  <div class="col" align="left">พิมพ์รายละเอียดผู้ป่วย</div>
                </q-btn>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn dense round flat icon="more_vert">
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
                <span class="color-light-gray">HN{{ items.HN }}</span>
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
        <div
          class="font-h3 color-light-gray"
          v-if="!isClickedOnPatient"
          style="position:relative;top:18%;"
        >
          <q-icon name="arrow_back"></q-icon>เลือกห้องพัก เพื่อดูรายชื่อผู้ป่วยในห้อง
        </div>

        <q-scroll-area style="height: 100vh; " v-else>
          <div class="q-px-xs q-pt-md" style="max-width:330px;width:95%;margin:auto;">
            <div class="q-mt-lg">
              <span class="font-h3">{{ currentPatientData.name + " " + currentPatientData.surname }}</span>
              <br />
              <!-- text-overflow -->
              <div class="font-body row q-mt-sm">
                <div class="col-4 text-overflow" style="width:130px;">
                  <span class="color-light-gray">รหัส</span>
                  {{ " " + currentPatientData.HN + " " + "&nbsp;" }}
                </div>
                <div class="col">
                  <span class="color-light-gray">วันเกิด</span>
                  {{ " " + currentPatientData.dateOfBirth + "&nbsp;" }}
                  <span
                    class="color-primary-500 cursor-pointer"
                    @click="isDetails = true"
                  >เพิ่มเติม</span>
                </div>
              </div>
            </div>

            <div class="q-mt-md" v-for="(items,index) in currentPatientLog" :key="index">
              <q-card class="my-card font-body">
                <div class="q-pa-sm" align="center">
                  <span>{{ items.inputDate }} รอบ {{ items.inputRound }}:00 น.</span>
                </div>

                <q-separator />

                <div class="row" style="padding:20px 30px;">
                  <div class="col-8" v-show="items.temperature">
                    <div class="q-py-xs" align="left">
                      <span>อุณหภูมิ</span>
                    </div>
                  </div>
                  <div class="col" align="right" v-show="items.temperature">
                    <div class="q-py-xs" align="right">
                      <span>{{ items.temperature }} &#176;C</span>
                    </div>
                  </div>
                  <div class="col-8" v-show="items.bloodPressure">
                    <div class="q-py-xs" align="left">
                      <span>ความดันโลหิต</span>
                    </div>
                  </div>
                  <div class="col" align="right" v-show="items.bloodPressure">
                    <div class="q-py-xs" align="right">
                      <span>{{ items.bloodPressure }}</span>
                    </div>
                  </div>
                  <div class="col-8" v-show="items.oxygen">
                    <div class="q-py-xs" align="left">
                      <span>ออกซิเจนในเลือด</span>
                    </div>
                  </div>
                  <div class="col" align="right" v-show="items.oxygen">
                    <div class="q-py-xs" align="right">
                      <span>{{ items.oxygen }}%</span>
                    </div>
                  </div>
                  <div class="col-8" v-show="items.heartRate">
                    <div class="q-py-xs" align="left">
                      <span>การเต้นของหัวใจ</span>
                    </div>
                  </div>
                  <div class="col" align="right" v-show="items.heartRate">
                    <div class="q-py-xs" align="right">
                      <span>{{ items.heartRate }}/min</span>
                    </div>
                  </div>
                </div>

                <div class="q-mb-xs" align="center" v-show="items.symptomsCheck">
                  <span>อาการตอนนี้</span>
                </div>
                <q-separator v-show="items.symptomsCheck" />

                <div class="row q-my-md q-px-lg" v-show="items.symptomsCheck">
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
          <q-btn dense round flat class="color-black" v-close-popup @click="closeAddEditPatient()">
            <q-icon name="close" size="45px"></q-icon>
          </q-btn>
        </div>

        <div class="dialog-container">
          <div>
            <div class="font-h3" align="center">
              <span>เพิ่มผู้ป่วยใหม่</span>
            </div>
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
              :readonly="!isAddMode"
              v-model="patientObj.HN"
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
                readonly
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
                    <q-popup-proxy
                      ref="qDateProxy1"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        mask="DD/MM/YYYY"
                        v-model="patientObj.dateOfBirth"
                        @input="() => $refs.qDateProxy1.hide()"
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
                readonly
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date
                        mask="DD/MM/YYYY"
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

    <q-dialog v-model="isEditRoom" maximized>
      <q-card class="q-pa-md bg-surface">
        <div align="right">
          <q-btn dense round flat class="color-black" v-close-popup>
            <q-icon name="close" size="45px"></q-icon>
          </q-btn>
        </div>
        <q-card-section style="max-width:360px;margin:auto">
          <div class="font-h3 q-pt-md" align="center">แก้ไขห้องพักผู้ป่วย</div>
          <div class="q-pt-md font-h4">ชื่อห้องพักผู้ป่วย</div>
          <div class="q-pt-sm">
            <q-input label="ชื่อห้องพักผู้ป่วย" v-model="roomName" outlined class="bg-white"></q-input>
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn class="button-action" label="บันทึก" @click="editRoomName()"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="deletePatientConfirmation" maximized>
      <q-card class="q-pa-md bg-surface">
        <div align="right">
          <q-btn dense round flat class="color-black" v-close-popup>
            <q-icon name="close" size="45px"></q-icon>
          </q-btn>
        </div>
        <q-card-section style="max-width:360px;margin:auto">
          <div class="font-h3 q-pt-md" align="center">ลบห้องผู้ป่วย</div>
          <div class="q-pt-md font-h4">ย้ายผู้ป่วยในห้องปัจจุบันไปยังห้องใด</div>
          <div class="q-pt-sm">
            <q-toolbar class="q-pa-xs" v-for="(items,index) in patientRoomCheckbox" :key="index">
              <div class="fit border-light-gray rounded-borders row">
                <div class="col-12">
                  <q-radio :val="items.key" v-model="roomChoosed" keep-color color="teal">
                    <span>{{ items.name }}</span>
                  </q-radio>
                </div>
              </div>
            </q-toolbar>
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn class="button-action" label="บันทึก" @click="transferPatientDataToChoosedRoom()"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- TODO : Container Dialog Model -->
    <q-dialog v-model="isDetails" v-if="isDetails" persistent>
      <q-card class="my-card font-body" style="max-width:320px;width:100%;">
        <div class="q-pa-sm" align="center">
          <span>ข้อมูลผู้ป่วย</span>
        </div>

        <q-separator />

        <div class="q-my-md q-px-sm">
          <div class="text-overflow">
            <span class="font-h3">{{ currentPatientData.name + " " + currentPatientData.surname }}</span>
          </div>
          <div class="row q-mt-sm">
            <div class="col-4 q-my-xs text-overflow" style="width:165px;">
              <span class="color-light-gray">รหัส</span>
              {{ " " + currentPatientData.HN + " " + "&nbsp;" }}
            </div>
            <div class="col q-my-xs" align="right">
              <span class="color-light-gray">วันเกิด</span>
              {{ " " + currentPatientData.dateOfBirth }}
            </div>
          </div>
          <div class="row q-mt-sm">
            <div class="col-2 self-start q-my-xs" style="width:75px;">
              <span class="color-light-gray">Diagnosis</span>
            </div>
            <div
              class="col q-my-xs"
            >{{ currentPatientData.diagnosis != '' ? currentPatientData.diagnosis : '-' }}</div>
          </div>
          <div class="row q-mt-sm">
            <div class="col-12 q-my-xs">
              <span class="color-light-gray">อายุ</span>
              {{ " " + getAge }}
            </div>
            <div class="col-12 q-my-xs">
              <span class="color-light-gray">เพศ</span>
              <span>{{ currentPatientData.sex == 'male' ? " ชาย" : ' หญิง'}}</span>
            </div>
            <div class="col-12 q-my-xs">
              <span class="color-light-gray">ห้อง</span>
              {{ " " + roomData.name }}
            </div>
            <div class="col-12 q-my-xs">
              <span class="color-light-gray">เข้ารักษา</span>
              {{ " " + currentPatientData.dateOfAdmit }}
            </div>
          </div>

          <div align="right" class="q-mt-md q-pr-sm">
            <q-btn flat class="button-action small" dense label="ปิด" @click="isDetails = false"></q-btn>
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
      currentDate: "",
      deletePatientConfirmation: false,
      isEditRoom: false,
      items: [{}, {}, {}, {}, {}, {}, {}],
      patientRoom: [],
      isDialogAddNewPatient: false,
      isLoading: true,
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
        diagnosis: ""
      },

      isListenPatientData: "",
      currentPatientData: "",
      patientLog: "",
      currentPatientLog: "",
      platForm: this.$q.platform.is,
      isClickedOnPatient: false,
      roomName: "",
      patientRoomCheckbox: "",
      roomChoosed: "",
      isDetails: false,

      isAddMode: true
    };
  },
  methods: {
    printBtn() {
      let routeData = this.$router.resolve({
        path: "/QRCode/" + this.currentPatientData.key
      });
      window.open(routeData.href, "_blank");

      // this.$router.push("/QRCode/" + this.patientKey);
    },
    printAll() {
      let routeData = this.$router.resolve({
        path: "/QRCode/" + this.roomKey + "/all"
      });
      window.open(routeData.href, "_blank");
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
          db.collection("patientData")
            .doc(this.currentPatientData.key)
            .delete()
            .then(() => {
              db.collection("patientLog")
                .where("patientKey", "==", this.currentPatientData.key)
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
                });
            });
        });
    },
    changeNotify() {
      console.log("CHANGED");
      let currentPatientDataSnapshot = this.patientData.filter(
        x => x.key == this.currentPatientData.key
      )[0];
      let showNotify = false;

      if (currentPatientDataSnapshot.isShowNotify == undefined) {
        showNotify = false;
      } else {
        showNotify = !currentPatientDataSnapshot.isShowNotify;
      }

      let titleText =
        showNotify == false ? "เปิดการแจ้งเตือน" : "ยกเลิกการแจ้งเตือน";
      let contentText =
        showNotify == false
          ? "ระบบจะแจ้งเตือนเมื่อคนไข้ ท่านนี้ ไม่กรอกข้อมูลตามเวลา "
          : "ระบบจะไม่แจ้งเตือน เมื่อคนไข้ท่านนี้ไม่กรอกข้อมูลตามเวลา ";

      this.popUpDialog(titleText, contentText);

      db.collection("patientData")
        .doc(this.currentPatientData.key)
        .update({
          isShowNotify: showNotify
        });

      this.currentPatientData.isShowNotify = showNotify;
      this.patientObj.isShowNotify = showNotify;

      // console.log(this.currentPatientData);
    },
    transferPatientDataToChoosedRoom() {
      db.collection("patientData")
        .where("patientRoomKey", "==", this.roomKey)
        .get()
        .then(doc => {
          let counter = 0;
          doc.forEach(element => {
            db.collection("patientLog")
              .where("patientKey", "==", element.id)
              .get()
              .then(doc => {
                doc.forEach(pelement => {
                  db.collection("patientLog")
                    .doc(pelement.id)
                    .update({
                      patientRoomKey: this.roomChoosed
                    });
                });
              });

            db.collection("patientData")
              .doc(element.id)
              .update({
                patientRoomKey: this.roomChoosed
              })
              .then(() => {
                counter++;
                if (counter == doc.size) {
                  this.loadingHide();
                  this.deletePatientConfirmation = false;
                  // this.$router.push("/roomdetails/" + this.roomChoosed);
                }
              });
          });
        });
    },
    checkDeleteRoom() {
      console.log("CHECK DELETE ROOm");
      this.loadingShow();
      // ต้องเช็คว่าภายในห้องนี้มีผู้ป่วยอยู่แล้วหรือไม่
      db.collection("patientData")
        .where("patientRoomKey", "==", this.roomKey)
        .get()
        .then(doc => {
          console.log(doc.size);
          this.loadingHide();
          if (doc.size) {
            // กรณี มีผู้ป่วยอยู่ในห้องนี้ ต้องแจ้งเตือนให้ย้ายผู้ป่วยก่อน
            this.deletePatientConfirmation = true;
          } else {
            // confirmation และลบได้เลย
          }
        });
    },
    editRoomName() {
      this.loadingShow();
      if (this.roomData.name == this.roomName) {
        this.isEditRoom = false;
        this.loadingHide();
        return;
      }
      db.collection("patientRoom")
        .where("name", "==", this.roomName)
        .where("hospitalKey", "==", this.$q.localStorage.getItem("hospitalKey"))
        .get()
        .then(doc => {
          if (doc.size) {
            // กรณีชื่อซ้ำ
            this.popUpDialog("ผิดพลาด", "พบชื่อห้องซ้ำ");
            this.loadingHide();
          } else {
            db.collection("patientRoom")
              .doc(this.roomKey)
              .update({
                name: this.roomName
              })
              .then(() => {
                db.collection("patientRoom")
                  .doc(this.roomKey)
                  .get()
                  .then(doc => {
                    this.vnotify("บันทึกข้อมูลเรียบร้อย");
                    this.roomData = doc.data();
                    this.patientObj.patientRoomKey = doc.id;
                    this.roomName = doc.data().name;
                    this.isEditRoom = false;
                    this.loadingHide();
                  });
              });
          }
        });
    },
    closeAddEditPatient() {
      this.patientObj = {
        HN: "",
        name: "",
        surname: "",
        sex: "male",
        dateOfAdmit: "",
        dateOfBirth: "",
        diagnosis: "",
        hospitalKey: "",
        patientRoomKey: this.roomKey
      };
    },
    editPatient() {
      this.isDialogAddNewPatient = true;
      this.isAddMode = false;

      let copy = { ...this.currentPatientData };

      this.patientObj = copy;

      delete this.patientObj.key;
    },

    showPatientData(key) {
      // console.log(this.patientData.filter(x => x.key == key));

      if (this.platForm.desktop) {
        this.isClickedOnPatient = true;
        this.loadingShow();
        this.currentPatientData = this.patientData.filter(x => x.key == key)[0];
        this.currentPatientLog = this.patientLog.filter(
          x => x.patientKey == key
        );

        this.loadingHide();
      } else {
        // MOBILE ROUTE TO OTHER PAGE
        this.$router.push(
          "/patientDetails/" + key + "/" + this.$route.name + "/" + this.roomKey
        );
      }
    },
    saveData() {
      let refs = db.collection("patientData");

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
        alert("กรุณากรอกข้อมูลให้ครบ");
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
      this.patientObj.hospitalKey = this.$q.localStorage.getItem("hospitalKey");

      if (this.isAddMode) {
        refs.add(this.patientObj).then(() => {
          this.isDisabled = false;
          this.patientObj = {
            HN: "",
            name: "",
            surname: "",
            sex: "male",
            dateOfAdmit: "",
            dateOfBirth: "",
            diagnosis: "",
            hospitalKey: "",
            patientRoomKey: this.roomKey
          };
          this.isDialogAddNewPatient = false;
          this.loadingHide();
        });
      } else {
        refs
          .doc(this.currentPatientData.key)
          .set(this.patientObj)
          .then(() => {
            this.isDisabled = false;

            this.isDialogAddNewPatient = false;
            this.loadingHide();
          });
      }
    },
    loadPatientRoom() {
      db.collection("patientRoom")
        .where("hospitalKey", "==", this.$q.localStorage.getItem("hospitalKey"))
        .get()
        .then(doc => {
          let dataTemp = [];
          let dataCheckBox = [];
          doc.forEach(element => {
            dataTemp.push({ ...element.data(), ...{ key: element.id } });
            dataCheckBox.push({
              ...element.data(),
              ...{ key: element.id, status: false }
            });
          });
          this.patientRoom = dataTemp;
          dataCheckBox.sort((a, b) => {
            return a.addTime - b.addTime;
          });
          this.patientRoomCheckbox = dataCheckBox;
          this.loadPatientDataInThisRoom();
        });
    },
    async loadRoomData() {
      this.currentDate = await this.getDate();

      this.loadingShow();
      db.collection("patientRoom")
        .doc(this.roomKey)
        .get()
        .then(doc => {
          this.roomData = doc.data();
          this.patientObj.patientRoomKey = doc.id;
          this.roomName = doc.data().name;
          this.roomChoosed = doc.id;

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
        .where("hospitalKey", "==", this.$q.localStorage.getItem("hospitalKey"))
        .where("patientRoomKey", "==", this.roomKey)
        .get()
        .then(doc => {
          let dataTemp = [];
          doc.forEach(element => {
            dataTemp.push({ ...element.data(), ...{ key: element.id } });
          });
          dataTemp = dataTemp.sort((a, b) => b.inputRound - a.inputRound);
          this.patientLog = dataTemp;
          // this.currentPatientLog = dataTemp.filter(
          //   x => x.patientKey == this.currentPatientData.key
          // );

          this.isLoading = false;
          this.loadingHide();
        });
    }
  },
  computed: {
    getAge() {
      let newdob =
        this.currentPatientData.dateOfBirth.substr(6) +
        this.currentPatientData.dateOfBirth.substr(0, 2) +
        this.currentPatientData.dateOfBirth.substr(3, 2);

      let currentDate =
        Number(this.currentDate.date.substr(6)) +
        "-" +
        this.currentDate.date.substr(3, 2) +
        "-" +
        this.currentDate.date.substr(0, 2);

      let dob = newdob;
      let year = Number(dob.substr(0, 4));
      let month = Number(dob.substr(4, 2)) - 1;
      let day = Number(dob.substr(6, 2));
      let today = new Date(currentDate);
      let age = today.getFullYear() - year;

      if (
        today.getMonth() < month ||
        (today.getMonth() == month && today.getDate() < day)
      ) {
        age--;
      }

      return age;
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