<template>
  <div class>
    <q-dialog v-model="isDialogAddNewPatient" persistent :maximized="maximizedToggle">
      <q-card class="q-pa-md bg-surface">
        <div align="right">
          <q-btn
            dense
            round
            class="relative-position z-top color-black"
            @click="closeDialogAddPatient()"
          >
            <q-icon name="close" size="45px"></q-icon>
          </q-btn>
        </div>

        <div class="dialog-container q-pt-md">
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
              :readonly="!isAddMode"
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
                    <q-popup-proxy
                      ref="dateofbirth"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="patientData.dateOfBirth"
                        @input="() => $refs.dateofbirth.hide()"
                        mask="DD/MM/YYYY"
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
                    <q-popup-proxy
                      ref="dateofadmit"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="patientData.dateOfAdmit"
                        @input="() => $refs.dateofadmit.hide()"
                        mask="DD/MM/YYYY"
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
            <div class="q-my-xs" v-for="(item, index) in room" :key="index">
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
  </div>
</template>

<script>
import { db } from "../router/index.js";
export default {
  props: ["sendData"],
  data() {
    return {
      // NOTE  Patient Data Save to DB
      patientData: {
        HN: "",
        name: "",
        surname: "",
        sex: "",
        dateOfAdmit: "",
        dateOfBirth: "",
        diagnosis: "",
        hospitalKey: "",
        patientRoomKey: ""
      },

      patientKey: this.sendData.patientKey,
      room: [],

      isDialogAddNewPatient: this.sendData.isDialogAddNewPatient,
      maximizedToggle: true,
      isDisabled: false,
      isAddMode: this.sendData.isAddMode
    };
  },
  methods: {
    closeDialogAddPatient() {
      this.isDialogAddNewPatient = false;

      this.$emit("sendBack", {
        isDialogAddNewPatient: false
      });

      this.isAddMode = true;
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
    async saveData() {
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

      this.isDisabled = true;

      let checkHN = await db
        .collection("patientData")
        .where("HN", "==", this.patientData.HN)
        .get();

      if (checkHN.size && this.isAddMode) {
        alert("มีข้อมูล HN นี้แล้ว");
        this.isDisabled = false;
        return;
      }

      this.loadingShow();

      setTimeout(() => {
        this.patientData.hospitalKey = "d9lzg1cDW3csxvCzlq0i";

        if (this.isAddMode) {
          refs.add(this.patientData).then(() => {
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

            this.vnotify("คุณเพิ่มผู้ป่วยใหม่สำเร็จแล้ว");

            this.$emit("sendBack", {
              isDialogAddNewPatient: false
            });

            this.loadingHide();
          });
        } else {
          let copyPatientDate = { ...this.patientData };
          delete copyPatientDate.key;

          refs.update(copyPatientDate).then(() => {
            this.vnotify("แก้ไขข้อมูลผู้ป่วยแล้ว");

            this.$emit("sendBack", {
              isDialogAddNewPatient: false
            });
            this.loadingHide();
          });
        }
      }, 1500);
    },
    loadRoom() {
      let refs = db
        .collection("patientRoom")
        .where("hospitalKey", "==", "d9lzg1cDW3csxvCzlq0i");

      this.loadingShow();

      refs.get().then(doc => {
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

          this.room = temp;

          if (!this.isAddMode) {
            this.loadPatient();
          } else {
            this.loadingHide();
          }

          // return "ส่งข้อมูลเรียบร้อย";
        } else {
          this.loadingHide();
          // return "ไม่มีข้อมูลห้องผู้ป่วย";
        }
      });
    },
    loadPatient() {
      let refs = db.collection("patientData").doc(this.patientKey);

      refs.get().then(result => {
        if (result.exists) {
          this.patientData = result.data();
        }

        this.loadingHide();
      });
    }
  },
  mounted() {
    this.loadRoom();
  }
};
</script>

<style lang="scss" scoped>
</style>