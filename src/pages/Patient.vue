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
        <q-toolbar-title>
          <q-btn flat round dense class="q-ml-sm q-mr-xs">
            <q-icon name="chevron_left" size="24px"></q-icon>
          </q-btn>
          <span clas>ผู้ป่วย</span>
        </q-toolbar-title>
        <div class="q-pa-sm">
          <q-btn flat round dense icon="search" />
        </div>
      </q-toolbar>
      <q-toolbar
        class="col bg-primary-500 shadow-1"
        v-if="$q.platform.is.desktop"
      >
        <q-toolbar-title></q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>

    <!-- TODO : Container List Data -->
    <div class="row">
      <div
        class="col-4 container-list-data"
        :class="$q.platform.is.desktop ? 'desktop-only' : 'mobile-only'"
      >
        <!-- TODO : List Data Component -->
        <div v-for="(room, index) in dataList" :key="index">
          <div class="q-px-md " style="padding-top:22px;padding-bottom:8px">
            <span
              class="font-body color-primary-600 text-bold "
              style="font-size:14px;font-weight:bold;"
            >
              {{ "ห้องผู้ป่วย " + index.substr(index.length - 1) }}
            </span>
          </div>
          <div v-for="(item, index2) in dataList[index]" :key="index2">
            <q-btn
              flat=""
              dense=""
              class=" fit q-pr-xs q-py-xs no-border-radius"
              no-caps
              @click="selectPatient(item)"
            >
              <div class="row font-body  full-width ">
                <div class="col-1 " style="width:30px;" align="cetner">
                  <q-icon
                    v-if="item.status != 'read'"
                    name="fiber_manual_record"
                    size="10px"
                    :class="
                      item.date < 27 && item.status == 'readNoMark'
                        ? 'color-error'
                        : 'color-primary-500'
                    "
                  ></q-icon>
                </div>
                <div class="col " align="left">
                  <span class="no-padding">
                    {{ item.name }}
                  </span>
                  <br />
                  <span class="color-light-gray ">
                    {{ item.NH }}
                  </span>
                </div>
                <div
                  class="col  q-px-xs"
                  :class="item.status != 'readNoMark' ? null : 'color-error'"
                  align="right"
                >
                  <span>
                    {{
                      item.status != "readNoMark"
                        ? "รอบ " + item.betweenTime + " น "
                        : "Mar 26"
                    }}
                  </span>
                  <br />
                  <span>{{
                    item.status != "readNoMark" ? null : "ไม่ได้ส่งข้อมูลล่าสุด"
                  }}</span>
                </div>
                <div class="col-1  self-center" style="width:30px;">
                  <q-icon name="chevron_right" size="24px"></q-icon>
                </div>
              </div>
            </q-btn>
            <q-separator />
          </div>
        </div>
      </div>

      <!-- TODO : Container Show Data -->
      <div class="col" style="margin-top:30px;" v-if="$q.platform.is.desktop">
        <div
          class="q-px-xs"
          style="max-width:325px;width:95%;margin:auto;"
          v-if="patientData != null"
        >
          <div class="">
            <span class="font-h3 ">
              {{ patientData.name }}
            </span>
            <br />
            <div class="font-body q-mt-sm">
              <span class="color-light-gray">รหัส</span>
              {{ " " + patientData.NH + "   " + "&nbsp;&nbsp;" }}
              <span class="color-light-gray">วันเกิด</span>
              {{ " " + patientData.birth + " " + "&nbsp;&nbsp;" }}
              <span
                class="color-primary-500 cursor-pointer"
                @click="isDetails = true"
                >เพิ่มเติม</span
              >
            </div>
          </div>

          <div class=" q-mt-md">
            <q-card class="my-card font-body">
              <div class="q-pa-sm" align="center">
                <span>
                  12 มีนาคม 2562 รอบ 2:00 น.
                </span>
              </div>

              <q-separator />

              <div class="row" style="padding:20px 30px;">
                <div class="col-8 ">
                  <div class="q-py-xs">
                    <span>
                      อุณหภูมิ
                    </span>
                  </div>
                  <div class="q-py-xs">
                    <span>
                      ความดันโลหิต
                    </span>
                  </div>
                  <div class="q-py-xs">
                    <span>
                      ออกซิเจนในเลือด
                    </span>
                  </div>
                  <div class="q-py-xs">
                    <span>
                      การเต้นของหัวใจ
                    </span>
                  </div>
                </div>
                <div class="col " align="right">
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
                <div class="col-1 " style="width:15px;">
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
                <div class="col ">
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
          <span>
            ข้อมูลผู้ป่วย
          </span>
        </div>

        <q-separator />

        <div class="q-my-md q-px-sm">
          <div>
            <span class="font-h3">
              {{ patientData.name }}
            </span>
          </div>
          <div class="row q-mt-sm">
            <div class="col-6 q-my-xs">
              <span class="color-light-gray">รหัส</span>
              {{ " " + patientData.NH + "   " + "&nbsp;&nbsp;" }}
            </div>
            <div class="col-6 q-my-xs" align="right">
              <span class="color-light-gray">วันเกิด</span>
              {{ " " + patientData.birth }}
            </div>
            <div class="col-2 q-my-xs " style="width:75px;">
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
              {{ " " + "ห้องพักผู้ป่วย 1" }}
            </div>
            <div class="col-12 q-my-xs">
              <span class="color-light-gray">เข้ารักษา</span>
              {{ " " + "23/01/2563" }}
            </div>
          </div>

          <div align="right" class="q-mt-md">
            <q-btn
              flat
              class="button-action small"
              dense=""
              label="ปิด"
              @click="isDetails = false"
            ></q-btn>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      dataList: {
        room5: [
          {
            name: "สมชาย มากบุตร",
            NH: "NH15025",
            status: "read",
            date: 27,
            betweenTime: "12:00",
            birth: "23/01/2523"
          },
          {
            name: "สมศักษ์ ปรีดีชม",
            NH: "NH15025",
            status: "new",
            date: 27,
            betweenTime: "10:00",
            birth: "23/01/2523"
          },
          {
            name: "สมชาย มากบุตร",
            NH: "NH15025",
            status: "readNoMark",
            date: 26,
            betweenTime: "14:00",
            birth: "23/01/2523"
          },
          {
            name: "สมศักษ์ ปรีดีชม",
            NH: "NH15025",
            status: "read",
            date: 26,
            betweenTime: "13:00",
            birth: "23/01/2523"
          }
        ],
        room4: [
          {
            name: "สมชาย มากบุตร",
            NH: "NH15025",
            status: "read",
            date: 27,
            betweenTime: "12:00",
            birth: "23/01/2523"
          },
          {
            name: "สมศักษ์ ปรีดีชม",
            NH: "NH15025",
            status: "new",
            date: 27,
            betweenTime: "10:00",
            birth: "23/01/2523"
          }
        ]
      },
      patientData: {
        name: "สมชาย มากบุตร",
        NH: "NH15025",
        status: "read",
        date: 27,
        betweenTime: "12:00",
        birth: "23/01/2523"
      },

      isDetails: false
    };
  },
  methods: {
    selectPatient(data) {
      this.patientData = data;
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
/* TODO : Container List Data And Scrollbar */
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
