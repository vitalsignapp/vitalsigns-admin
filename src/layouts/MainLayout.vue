<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer
      v-model="drawer"
      show-if-above
      :width="90"
      :breakpoint="500"
      content-class="bg-black"
    >
      <q-scroll-area class="fit ">
        <q-list padding>
          <q-item class="color-white q-py-sm" clickable v-ripple>
            <q-item-section>
              <div align="center">
                <img src="../statics/pic/Face.png" style="width:50%;" />
                <div class="q-pb-sm" style="font-size:14px;margin-top:-7px;">
                  ผู้ป่วย
                </div>
              </div>
            </q-item-section>
          </q-item>

          <q-item class="color-white q-py-sm" clickable v-ripple>
            <q-item-section>
              <div align="center">
                <img src="../statics/pic/Bed.png" style="width:50%;" />
                <div class="q-pb-sm" style="font-size:14px;margin-top:-7px;">
                  ห้องพัก
                </div>
              </div>
            </q-item-section>
          </q-item>

          <q-item class="color-white q-py-md" clickable v-ripple>
            <q-item-section>
              <div align="center">
                <img src="../statics/pic/Support.png" style="width:50%;" />
                <div class="q-pb-sm" style="font-size:14px;margin-top:-7px;">
                  บุคลากร
                </div>
              </div>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item class="color-white q-py-md" clickable v-ripple>
            <q-item-section>
              <div align="center">
                <img src="../statics/pic/Setting.png" style="width:50%;" />
                <div class="q-pb-sm" style="font-size:14px;margin-top:-7px;">
                  เพิ่มเติม
                </div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
  data() {
    return {
      drawer: false,
      miniState: true,
      leftDrawerOpen: false
    };
  }
};
</script>
