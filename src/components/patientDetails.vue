<template>
  <div>
    <!-- NOTE โชว์ข้อมูลในกรณีที่กดเลือกข้อมูลผู้ป่วยแล้ว -->
    <div
      class="q-px-xs"
      style="max-width:330px;width:95%;margin:auto;"
      v-if="isLoadData"
    >
      <div class="q-mt-lg">
        <span class="font-h3">{{ patient.name + ' ' + patient.surname }}</span>
        <br />
        <!-- text-overflow -->
        <div class="font-body row q-mt-sm">
          <div class="col-4 text-overflow" style="width:130px;">
            <span class="color-light-gray">รหัส</span>
            {{ ' ' + patient.username + ' ' + '&nbsp;' }}
          </div>
          <div class="col" align="right">
            <span class="color-light-gray">วันเกิด</span>
            {{ ' ' + patient.dateOfBirth + '&nbsp;' }}
            <span
              class="color-primary-500 cursor-pointer"
              @click="isDetails = true"
              >เพิ่มเติม</span
            >
          </div>
        </div>
      </div>

      <div>
        <div
          class="q-mt-md q-mb-lg"
          v-for="(item, index) in diagnosisList"
          :key="index"
        >
          <q-card class="my-card font-body">
            <div class="q-pa-sm" align="center">
              <span>{{ item.dateAndRound }}</span>
            </div>

            <q-separator />

            <div class="row" style="padding:15px 30px;">
              <div class="col-8">
                <div class="q-py-xs" v-if="item.temperature">
                  <span>อุณหภูมิ</span>
                </div>
                <div class="q-py-xs" v-if="item.bloodPressure != 'null/null'">
                  <span>ความดันโลหิต</span>
                </div>
                <div class="q-py-xs" v-if="item.oxygen">
                  <span>ออกซิเจนในเลือด</span>
                </div>
                <div class="q-py-xs" v-if="item.heartRate">
                  <span>การเต้นของหัวใจ</span>
                </div>
              </div>
              <div class="col" align="right">
                <div class="q-py-xs" v-if="item.temperature">
                  <span>{{ item.temperature }} &#176;C</span>
                </div>
                <div class="q-py-xs" v-if="item.bloodPressure != 'null/null'">
                  <span>{{ item.bloodPressure }}</span>
                </div>
                <div class="q-py-xs" v-if="item.oxygen">
                  <span>{{ item.oxygen }}%</span>
                </div>
                <div class="q-py-xs" v-if="item.heartRate">
                  <span>{{ item.heartRate }}/min</span>
                </div>
              </div>
            </div>

            <div
              class="q-mb-xs"
              align="center"
              v-if="
                item.symptomsCheck.filter(x => x.status).length ||
                  item.otherSymptoms
              "
            >
              <span>อาการตอนนี้</span>
            </div>
            <q-separator
              v-if="
                item.symptomsCheck.filter(x => x.status).length ||
                  item.otherSymptoms
              "
            />

            <div
              class="q-px-lg"
              :class="{
                'q-mt-md q-pb-sm':
                  item.symptomsCheck.filter(x => x.status).length ||
                  item.otherSymptoms,
              }"
            >
              <div
                class="row"
                v-for="(diag, index2) in item.symptomsCheck"
                :key="index2"
                v-show="diag.status"
              >
                <div class="col-1" style="width:15px;">
                  <div class="q-py-xs">
                    <q-icon name="fiber_manual_record" size="7px"></q-icon>
                  </div>
                </div>
                <div class="col">
                  <div class="q-py-xs">
                    <span>{{ diag.sym }}</span>
                  </div>
                </div>
              </div>
              <div class="row" v-if="item.otherSymptoms">
                <div class="col-1" style="width:15px;">
                  <div class="q-py-xs">
                    <q-icon name="fiber_manual_record" size="7px"></q-icon>
                  </div>
                </div>
                <div class="col">
                  <div class="q-py-xs">
                    <span>{{ 'อื่นๆ: ' + item.otherSymptoms }}</span>
                  </div>
                </div>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>

    <!-- TODO : Container Dialog Model -->
    <q-dialog v-model="isDetails" v-if="isDetails" persistent>
      <q-card class="my-card font-body" style="max-width:320px;width:100%;">
        <div class="q-pa-sm" align="center">
          <span>ข้อมูลผู้ป่วย</span>
        </div>

        <q-separator />

        <div class="q-my-md q-px-sm">
          <div>
            <span class="font-h3">{{
              patient.name + ' ' + patient.surname
            }}</span>
          </div>
          <div class="row q-mt-sm">
            <div class="col-4 q-my-xs text-overflow" style="width:165px;">
              <span class="color-light-gray">รหัส</span>
              {{ ' ' + patient.username + ' ' + '&nbsp;' }}
            </div>
            <div class="col q-my-xs" align="right">
              <span class="color-light-gray">วันเกิด</span>
              {{ ' ' + patient.dateOfBirth }}
            </div>
          </div>
          <div class="row q-mt-sm">
            <div class="col-2 self-start q-my-xs" style="width:75px;">
              <span class="color-light-gray">Diagnosis</span>
            </div>
            <div class="col q-my-xs">
              {{ patient.diagnosis != '' ? patient.diagnosis : '-' }}
            </div>
          </div>
          <div class="row q-mt-sm">
            <div class="col-12 q-my-xs">
              <span class="color-light-gray">อายุ</span>
              {{ ' ' + getAge }}
            </div>
            <div class="col-12 q-my-xs">
              <span class="color-light-gray">เพศ</span>
              <span>{{ patient.sex == 'male' ? ' ชาย' : ' หญิง' }}</span>
            </div>
            <div class="col-12 q-my-xs">
              <span class="color-light-gray">ห้อง</span>
              {{
                ' ' +
                  room.filter(x => {
                    return x.key == patient.patientRoomKey;
                  })[0].name
              }}
            </div>
            <div class="col-12 q-my-xs">
              <span class="color-light-gray">เข้ารักษา</span>
              {{ ' ' + patient.dateOfAdmit }}
            </div>
          </div>

          <div align="right" class="q-mt-md q-pr-sm">
            <q-btn
              flat
              class="button-action small"
              dense
              label="ปิด"
              @click="isDetails = false"
            ></q-btn>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { $db } from '@/api/firebase';
import { getPatientDetailById, getPatientLogById, setPatientRead } from '@/api';
export default {
  props: ['dataKey', 'dataRoute'],
  data() {
    return {
      patient: {
        username: '',
        name: '',
        surname: '',
        sex: '',
        dateOfAdmit: '',
        dateOfBirth: '',
        diagnosis: '',
        hospitalKey: '',
        patientRoomKey: '',
      },

      room: [],
      diagnosisList: [],

      currentDate: '',

      isLoadData: false,
      isDetails: false,

      syncDiagnosis: null,
      syncRoom: null,
      syncPatient: null,
    };
  },
  methods: {
    async loadPaitent() {
      this.currentDate = await this.getDate();
      this.patient = null;
      const result = await getPatientDetailById(this.dataKey);
      if (result) {
        this.patient = result;
        this.$emit('patientData', this.patient);
        this.loadRoom();
        this.isLoadData = true;
      } else {
        this.loadingHide();
      }
    },
    loadRoom() {
      let refs = $db
        .collection('patientRoom')
        .where(
          'hospitalKey',
          '==',
          this.$q.localStorage.getItem('hospitalKey')
        );

      this.loadingShow();

      this.syncRoom = refs.onSnapshot(doc => {
        let temp = [];
        if (doc.size) {
          doc.forEach(result => {
            let setData = {
              key: result.id,
              ...result.data(),
            };

            temp.push(setData);
          });

          temp.sort((a, b) => {
            return a.name > b.name ? 1 : -1;
          });

          this.room = temp;

          this.loadPatientDiagnosis();

          // return "ส่งข้อมูลเรียบร้อย";
        } else {
          this.loadingHide();
          // return "ไม่มีข้อมูลห้องผู้ป่วย";
        }
      });
    },
    loadPatientDiagnosis() {
      getPatientLogById(this.dataKey).then(doc => {
        setPatientRead(this.dataKey, true).then(() => {});
        let temp = [];
        doc.forEach(result => {
          let dateAdmit = result.inputDate;
          let newDate =
            dateAdmit.substr(0, 2) +
            ' ' +
            this.showMonthName(dateAdmit.substr(3, 2)) +
            ' ' +
            dateAdmit.substr(6) +
            ' รอบ ' +
            result.inputRound +
            ':00 น.';

          let setData = {
            key: result.id,
            dateAndRound: newDate,
            ...result,
            symptomsCheck: Array.isArray(result.symptomsCheck)
              ? result.symptomsCheck
              : [],
          };

          temp.push(setData);
        });

        temp.sort((a, b) => {
          return b.microtime - a.microtime;
        });
        this.diagnosisList = temp;
        this.loadingHide();
      });
    },
  },
  computed: {
    getAge() {
      let newdob =
        this.patient.dateOfBirth.substr(6) +
        this.patient.dateOfBirth.substr(0, 2) +
        this.patient.dateOfBirth.substr(3, 2);

      let currentDate =
        Number(this.currentDate.date.substr(6)) +
        '-' +
        this.currentDate.date.substr(3, 2) +
        '-' +
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
    },
  },
  mounted() {
    this.loadPaitent();
  },
  beforeDestroy() {
    if (typeof this.syncDiagnosis === 'function') {
      this.syncDiagnosis();
    }
    if (typeof this.syncRoom === 'function') {
      this.syncRoom();
    }
    // this.syncPatient();
  },
};
</script>

<style lang="scss" scoped>
.my-card {
  padding: 2px;
  border-radius: 10px;
}
</style>
