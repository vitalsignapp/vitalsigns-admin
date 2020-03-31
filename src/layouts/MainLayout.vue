<template>
  <q-layout view="lHh Lpr lFf">
    <!-- TODO : Memu Bar Left is Desktop Mode-->
    <q-drawer
      persistent
      show-if-above
      :width="90"
      :breakpoint="100"
      content-class="bg-black"
      v-if="$q.platform.is.desktop"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item class="color-white q-py-sm" @click="goToPatient()" clickable v-ripple>
            <q-item-section>
              <div align="center">
                <img src="../statics/pic/Face.png" style="width:50%;" />
                <div class="q-pb-sm" style="font-size:14px;margin-top:-7px;">ผู้ป่วย</div>
              </div>
            </q-item-section>
          </q-item>

          <q-item class="color-white q-py-sm" clickable @click="goToWard()" v-ripple>
            <q-item-section>
              <div align="center">
                <img src="../statics/pic/Bed.png" style="width:50%;" @ />
                <div class="q-pb-sm" style="font-size:14px;margin-top:-7px;">ห้องพัก</div>
              </div>
            </q-item-section>
          </q-item>

          <q-item class="color-white q-py-md" clickable v-ripple @click="goToUser()">
            <q-item-section>
              <div align="center">
                <img src="../statics/pic/Support.png" style="width:50%;" />
                <div class="q-pb-sm" style="font-size:14px;margin-top:-7px;">บุคลากร</div>
              </div>
            </q-item-section>
          </q-item>

          <q-item class="color-white q-py-md" clickable v-ripple @click="goToAbout()">
            <q-item-section>
              <div align="center">
                <img src="../statics/pic/Setting.png" style="width:50%;" />
                <div class="q-pb-sm" style="font-size:14px;margin-top:-7px;">เพิ่มเติม</div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- TODO : Memu Bar Bottom is Mobile Mode -->
    <q-footer elevated v-if="$q.platform.is.mobile">
      <q-toolbar class="bg-black no-padding">
        <div class="col" align="center">
          <div
            v-ripple
            class="relative-position no-border-radius fit q-py-xs"
            @click="goToPatient()"
          >
            <div align="center">
              <img src="../statics/pic/Face.png" style="width:30px;" />
              <div style="font-size:14px;margin-top:-7px;">ผู้ป่วย</div>
            </div>
          </div>
        </div>
        <q-space></q-space>
        <div class="col" align="center">
          <div v-ripple class="relative-position no-border-radius fit q-py-xs" @click="goToWard()">
            <div align="center">
              <img src="../statics/pic/Bed.png" style="width:30px;" />
              <div style="font-size:14px;margin-top:-7px;">ห้องพัก</div>
            </div>
          </div>
        </div>
        <q-space></q-space>
        <div class="col" align="center">
          <div v-ripple class="relative-position no-border-radius fit q-py-xs">
            <div align="center">
              <img src="../statics/pic/Support.png" style="width:30px;" />
              <div style="font-size:14px;margin-top:-7px;">บุคลากร</div>
            </div>
          </div>
        </div>
        <q-space></q-space>
        <div class="col" align="center">
          <div v-ripple class="relative-position no-border-radius fit q-py-xs" @click="goToAbout()">
            <div align="center">
              <img src="../statics/pic/Setting.png" style="width:30px;" />
              <div style="font-size:14px;margin-top:-7px;">เพิ่มเติม</div>
            </div>
          </div>
        </div>
      </q-toolbar>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
  data() {
    return {};
  },
  methods: {
    goToUser() {
      this.$router.push("/userlist");
    },
    goToWard() {
      this.$router.push("/room");
    },
    goToPatient() {
      this.$router.push("/patient");
    },
    goToAbout() {
      this.$router.push("/about");
    }
  }
};
</script>
