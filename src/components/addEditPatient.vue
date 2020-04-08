<template>
  <div class>
    <q-dialog v-model="isDialogAddNewPatient" persistent :maximized="maximizedToggle">
      <q-card class="q-pa-md bg-surface">
        <div align="right">
          <q-btn
            dense
            round
            flat
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
              placeholder="ใส่รหัสผู้ป่วยเป็นตัวเลข"
              hide-bottom-space
              ref="username"
              v-model="patientData.username"
              :rules="[val => !!val]"
              :readonly="!isAddMode"
              input-style="font-size:16px;"
              mask="##########"
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
                placeholder="ชื่อจริง"
                ref="name"
                input-style="font-size:16px;"
                v-model="patientData.name"
                :rules="[val => !!val]"
              ></q-input>
            </div>
            <div class="col">
              <q-input
                outlined
                hide-bottom-space
                class="q-ml-xs"
                placeholder="นามสกุล"
                ref="surname"
                v-model="patientData.surname"
                input-style="font-size:16px;"
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
                class="font-body"
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
                placeholder="เลือกวันที่"
                input-style="font-size:16px;"
                ref="birth"
                :rules="[val => val.length == 10,val => val.substr(0,2) >= '01' &&  val.substr(0,2) <= '31' ,val => val.substr(3,2) <= '12']"
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
                placeholder="เลือกวันที่"
                ref="admit"
                input-style="font-size:16px;"
                hide-bottom-space
                :rules="[val => val.length == 10,val => val.substr(0,2) >= '01' &&  val.substr(0,2) <= '31' ,val => val.substr(3,2) <= '12']"
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
                placeholder="ระบุอาการและโรคที่เป็น"
                input-style="font-size:16px;"
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
        username: "",
        name: "",
        surname: "",
        sex: "male",
        dateOfAdmit: "",
        dateOfBirth: "",
        diagnosis: "",
        hospitalKey: this.$q.localStorage.getItem("hospitalKey"),
        patientRoomKey: "",
        isRead: true,
        isShowNotify: true
      },

      // NOTE Current Date
      dateTime: "",

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

      let hospitalKey = this.$q.localStorage.getItem("hospitalKey");

      this.isAddMode = true;
      this.patientData = {
        NH: "",
        name: "",
        surname: "",
        sex: "male",
        dateOfAdmit: "",
        dateOfBirth: "",
        diagnosis: "",
        hospitalKey: hospitalKey,
        patientRoomKey: this.room[0].key,
        isRead: true,
        isShowNotify: true
      };
    },
    async saveData() {
      let refs = this.isAddMode
        ? db.collection("patientData")
        : db.collection("patientData").doc(this.patientKey);

      let hospitalKey = this.$q.localStorage.getItem("hospitalKey");

      this.$refs.username.validate();
      this.$refs.name.validate();
      this.$refs.surname.validate();
      this.$refs.birth.validate();
      this.$refs.admit.validate();

      if (
        this.$refs.username.hasError ||
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

      let checkUsername = await db
        .collection("patientData")
        .where("username", "==", this.patientData.username)
        .where("hospitalKey", "==", hospitalKey)
        .get();

      if (checkUsername.size && this.isAddMode) {
        alert("มีข้อมูลผู้ป่วยนี้แล้ว");

        this.isDisabled = false;
        return;
      }

      this.loadingShow();

      if (this.isAddMode) {
        refs.add(this.patientData).then(() => {
          setTimeout(() => {
            this.patientData = {
              username: "",
              name: "",
              surname: "",
              sex: "male",
              dateOfAdmit: "",
              dateOfBirth: "",
              diagnosis: "",
              hospitalKey: hospitalKey,
              patientRoomKey: this.room[0].key,
              isRead: true,
              isShowNotify: true
            };

            this.loadingHide();

            this.vnotify("คุณเพิ่มผู้ป่วยใหม่สำเร็จแล้ว");

            this.$emit("sendBack", {
              isDialogAddNewPatient: false
            });

            this.isDialogAddNewPatient = false;
          }, 500);
        });
      } else {
        let copyPatientDate = { ...this.patientData };
        delete copyPatientDate.key;

        refs.update(copyPatientDate).then(() => {
          setTimeout(() => {
            this.loadingHide();

            this.vnotify("บันทึกข้อมูลเรียบร้อย");

            this.$emit("sendBack", {
              isDialogAddNewPatient: false
            });

            this.isDialogAddNewPatient = false;
          }, 500);
        });
      }
    },
    async loadRoom() {
      this.dateTime = await this.getDate();

      this.patientData.dateOfAdmit = this.dateTime.date;
      this.patientData.dateOfBirth = this.dateTime.date;

      let refs = db
        .collection("patientRoom")
        .where(
          "hospitalKey",
          "==",
          this.$q.localStorage.getItem("hospitalKey")
        );

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
          this.patientData.patientRoomKey = temp[0].key;

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