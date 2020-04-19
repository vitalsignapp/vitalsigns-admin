<template>
  <q-page>
    <q-header>
      <q-toolbar class="col bg-primary-500 shadow-1 color-white no-padding">
        <div class="row full-width">
          <q-toolbar-title class="col">
            <div class="q-pr-xs">
              <q-btn dense flat @click="goBack()">
                <q-icon name="chevron_left" size="35px"></q-icon>
              </q-btn>
              <span class="font-h3">รายละเอียดผู้ป่วย</span>
            </div>
          </q-toolbar-title>
          <q-space />
          <div class="self-center">
            <q-btn
              dense
              round
              flat
              class="q-mx-sm"
              size="14px"
              @click="changeNotify()"
            >
              <q-img
                v-if="patient.isShowNotify"
                src="../statics/pic/Notification.png"
                width="30px"
              ></q-img>
              <q-img
                v-if="!patient.isShowNotify"
                src="../statics/pic/Notification Mute.png"
                width="30px"
              ></q-img>
            </q-btn>
            <q-btn
              dense
              round
              flat
              class="q-mx-sm"
              size="14px"
              @click="printBtn()"
            >
              <q-img src="../statics/pic/QR Code.png" width="30px"></q-img>
              <!-- <q-menu square :offset="[55, 16]">
                <q-list style="min-width: 160px">
                  <q-btn class="fit row no-border-radius" flat>
                    <div class="col" align="left">พิมพ์ QR Code</div>
                  </q-btn>
                  <q-btn class="fit row no-border-radius" flat>
                    <div class="col" align="left">พิมพ์รายละเอียดผู้ป่วย</div>
                  </q-btn>
                </q-list>
              </q-menu>-->
            </q-btn>
            <q-btn dense round flat class="q-mx-sm" size="14px">
              <q-img src="../statics/pic/Option.png" width="30px"></q-img>
              <q-menu square :offset="[5, 16]">
                <q-list style="min-width: 160px">
                  <q-btn class="fit row no-border-radius" flat>
                    <div class="col" align="left">พิมพ์รายละเอียดผู้ป่วย</div>
                  </q-btn>
                  <q-btn
                    class="fit row no-border-radius"
                    flat
                    @click="editPatient()"
                  >
                    <div class="col" align="left">แก้ไขข้อมูลผู้ป่วย</div>
                  </q-btn>
                  <q-btn
                    class="fit row no-border-radius"
                    flat
                    @click="deletePatient()"
                  >
                    <div class="col text-red" align="left">ลบผู้ป่วย</div>
                  </q-btn>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>

        <q-dialog v-model="isDialogNotification" persistent>
          <q-card
            style="max-width: 280px"
            class="q-py-xs q-px-sm no-border-radius"
          >
            <q-card-section class="q-pt-md">
              <div class="font-h3">
                <span v-if="!patient.isShowNotify">ยกเลิกการแจ้งเตือน</span>
                <span v-if="patient.isShowNotify">เปิดการแจ้งเตือน</span>
              </div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <span class="font-body">
                <span v-if="!patient.isShowNotify"
                  >ระบบจะไม่แจ้งเตือน
                  เมื่อคนไข้ท่านนี้ไม่กรอกข้อมูลตามเวลา</span
                >
                <span v-if="patient.isShowNotify"
                  >ระบบจะแจ้งเตือนเมื่อคนไข้ ท่านนี้ไม่กรอกข้อมูลตามเวลา</span
                >
              </span>
            </q-card-section>

            <div class="q-px-md q-pb-md q-pt-xs" align="right">
              <q-btn
                flat
                class="button-action small"
                dense
                label="ปิด"
                v-close-popup
              />
            </div>
          </q-card>
        </q-dialog>
      </q-toolbar>
    </q-header>

    <!-- SECTION Patient Details -->
    <div>
      <patient-details
        :dataKey="$route.params.key"
        :dataRoute="$route.name"
        @patientData="getPatient"
      ></patient-details>
    </div>

    <!-- SECTION Add Edit Mode -->
    <add-edit-patient
      v-if="isDialogAddNewPatient"
      @sendBack="closePopup"
      :sendData="{
        patientKey: $route.params.key,
        isAddMode: false,
        isDialogAddNewPatient: isDialogAddNewPatient,
      }"
    ></add-edit-patient>
  </q-page>
</template>

<script>
import { $db } from '@/api/firebase';
import patientDetails from '../components/patientDetails.vue';
import addEditPatient from '../components/addEditPatient.vue';
import { getPatientLogById } from './../api';
export default {
  components: {
    patientDetails,
    addEditPatient,
  },
  data() {
    return {
      patient: '',
      // NOTE Page Name : Patient Details
      isNotification: false,
      isDialogNotification: false,

      // NOTE Page Name : Add Edit Patient
      isDialogAddNewPatient: false,
    };
  },
  methods: {
    printBtn() {
      let routeData = this.$router.resolve({
        path: '/QRCode/' + this.$route.params.key,
      });
      window.open(routeData.href, '_blank');

      // this.$router.push("/QRCode/" + this.patientKey);
    },
    getPatient(val) {
      this.patient = val;
    },

    goBack() {
      if (this.$route.params.roomKey) {
        this.$router.push(
          '/' + this.$route.params.routeName + '/' + this.$route.params.roomKey
        );
      } else {
        this.$router.push('/' + this.$route.params.routeName);
      }
    },
    changeNotify() {
      this.isDialogNotification = true;

      let showNotify = false;

      if (this.patient.isShowNotify == undefined) {
        showNotify = false;
      } else {
        showNotify = !this.patient.isShowNotify;
      }

      $db
        .collection('patientData')
        .doc(this.$route.params.key)
        .update({
          isShowNotify: showNotify,
        });

      this.patient.isShowNotify = showNotify;
    },
    closePopup(val) {
      this.isDialogAddNewPatient = val.isDialogAddNewPatient;
    },
    editPatient() {
      this.isDialogAddNewPatient = true;
    },
    deletePatient() {
      // ฟังก์ชันการลบข้อมูลผู้ป่วย
      this.$q
        .dialog({
          title: 'ลบผู้ป่วย',
          message: 'ต้องการลบผู้ป่วยใช่หรือไม่',
          ok: {
            color: 'orange-5',
          },
          cancel: { textColor: 'black', flat: true },
        })
        .onOk(() => {
          this.loadingShow();

          setTimeout(() => {
            $db
              .collection('patientData')
              .doc(this.$route.params.key)
              .delete()
              .then(() => {
                getPatientLogById(this.$route.params.key).then(doc => {
                  let counter = 0;
                  if (doc && Array.isArray(doc) && doc.length > 0) {
                    doc.forEach(element => {
                      $db
                        .collection('patientLog')
                        .doc(element.id)
                        .delete()
                        .then(() => {
                          counter++;
                          if (counter == doc.size) {
                            this.loadingHide();
                          }
                        });
                    });
                  } else {
                    this.loadingHide();
                  }
                  this.$router.push('/patient');
                });
              });
          }, 500);
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
