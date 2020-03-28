<template>
  <q-page>
    <q-header class="row color-white">
      <q-toolbar
        class="col-4 bg-primary-500 no-padding shadow-1"
        :style="
          $q.platform.is.desktop ? 'max-width:360px;width:100%;' : 'width:100%;'
        "
      >
        <q-toolbar-title>
          <span class="q-pl-md">ห้องพักผู้ป่วย</span>
        </q-toolbar-title>
        <div class="q-pa-sm">
          <q-btn flat dense icon="add" label="เพิ่มห้องพัก" />
        </div>
      </q-toolbar>
      <q-toolbar class="col bg-primary-500 shadow-1" v-if="$q.platform.is.desktop">
        <q-toolbar-title></q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>

    <!-- TODO : Container Tow List Data -->
    <div class="row">
      <div
        class="col-4 container-list-data brx"
        :class="$q.platform.is.desktop ? 'col-4' : 'col-12'"
        style="max-width:360px;width:100%;"
      >
        <div>
          <div v-for="i in 5" :key="i" class="relative-position container cursor-pointer" v-ripple>
            <div class="row q-py-sm font-body full-width" style="padding-left:30px">
              <div class="col" align="left">
                <span class="no-padding">ห้องพักผู้ป่วย {{ i }}</span>
                <br />
                <span class="color-light-gray">{{ i * Math.floor(Math.random() * 10) }} คน</span>
              </div>
              <div class="col-1 self-center" style="width:30px;">
                <q-icon name="chevron_right" size="24px"></q-icon>
              </div>
            </div>
            <q-separator />
          </div>
        </div>
      </div>

      <div class="col relative-position desktop-only">
        <div class="font-h3" style="position:relative;top:18%;left:15%">
          <q-icon name="arrow_back"></q-icon>เลือกห้องพัก เพื่อดูรายชื่อผู้ป่วยในห้อง
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {};
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