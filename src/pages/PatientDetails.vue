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
            <q-btn dense round flat class="q-mx-sm" size="14px">
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
      </q-toolbar>
    </q-header>

    <!-- SECTION Patient Details -->
    <div>
      <patient-details :dataKey="$route.params.key" :dataRoute="$route.name"></patient-details>
    </div>

    <!-- SECTION Add Edit Mode -->
    <add-edit-patient
      v-if="isDialogAddNewPatient"
      @sendBack="closePopup"
      :sendData="{patientKey:$route.params.key,isAddMode:false,isDialogAddNewPatient:isDialogAddNewPatient}"
    ></add-edit-patient>
  </q-page>
</template>

<script>
import patientDetails from "../components/patientDetails.vue";
import addEditPatient from "../components/addEditPatient.vue";
export default {
  components: {
    patientDetails,
    addEditPatient
  },
  data() {
    return {
      // NOTE Page Name : Patient Details
      isNotification: false,
      isDialogNotification: false,

      // NOTE Page Name : Add Edit Patient
      isDialogAddNewPatient: false
    };
  },
  methods: {
    goBack() {
      this.$router.push("/" + this.$route.params.routeName);
    },
    closePopup(val) {
      this.isDialogAddNewPatient = val.isDialogAddNewPatient;
    },
    editPatient() {
      this.isDialogAddNewPatient = true;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>