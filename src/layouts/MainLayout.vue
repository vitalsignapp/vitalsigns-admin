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
                <q-icon
                  size="33px"
                  name="face"
                  :color="$route.name == 'patient' ? 'white' : 'grey'"
                />

                <div
                  class="q-pb-sm"
                  :class="$route.name == 'patient' ? 'text-white' : 'text-grey'"
                >ผู้ป่วย</div>
              </div>
            </q-item-section>
          </q-item>

          <q-item class="color-white q-py-sm" clickable @click="goToWard()" v-ripple>
            <q-item-section>
              <div align="center">
                <q-icon
                  size="33px"
                  name="hotel"
                  :color="$route.name == 'room' || $route.name == 'roomdetails' ? 'white' : 'grey'"
                />
                <div
                  class="q-pb-sm"
                  :class="$route.name == 'room' || $route.name == 'roomdetails' ? 'text-white' : 'text-grey'"
                >ห้องพัก</div>
              </div>
            </q-item-section>
          </q-item>

          <q-item class="color-white q-py-md" clickable v-ripple @click="goToUser()">
            <q-item-section>
              <div align="center">
                <q-icon
                  size="33px"
                  name="contact_phone"
                  :color="$route.name == 'userlist' ? 'white' : 'grey'"
                />

                <div
                  class="q-pb-sm"
                  :class="$route.name == 'userlist' ? 'text-white' : 'text-grey'"
                >บุคลากร</div>
              </div>
            </q-item-section>
          </q-item>

          <q-item class="color-white q-py-md" clickable v-ripple @click="goToAbout()">
            <q-item-section>
              <div align="center">
                <q-icon
                  size="33px"
                  name="settings"
                  :color="$route.name == 'about' ? 'white' : 'grey'"
                />
                <div
                  class="q-pb-sm"
                  :class="$route.name == 'about' ? 'text-white' : 'text-grey'"
                >เพิ่มเติม</div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- TODO : Memu Bar Bottom is Mobile Mode -->
    <q-footer elevated v-if="$q.platform.is.mobile">
      <q-toolbar
        class="bg-black no-padding"
        v-show="$route.name != 'roomdetails' && $route.name != 'patientDetails' && $route.name != 'userData'"
      >
        <div class="col" align="center">
          <div
            v-ripple
            class="relative-position no-border-radius fit q-py-xs"
            @click="goToPatient()"
          >
            <div align="center">
              <q-icon size="33px" name="face" :color="$route.name == 'patient' ? 'white' : 'grey'" />
              <div :class="$route.name == 'patient' ? 'text-white' : 'text-grey'">ผู้ป่วย</div>
            </div>
          </div>
        </div>
        <q-space></q-space>
        <div class="col" align="center">
          <div v-ripple class="relative-position no-border-radius fit q-py-xs" @click="goToWard()">
            <div align="center">
              <q-icon
                size="33px"
                name="hotel"
                :color="$route.name == 'room' || $route.name == 'roomdetails' ? 'color-white' : 'grey'"
              />
              <div
                :class="$route.name == 'room' || $route.name == 'roomdetails' ? 'color-white' : 'text-grey'"
              >ห้องพัก</div>
            </div>
          </div>
        </div>
        <q-space></q-space>
        <div class="col" align="center">
          <div v-ripple class="relative-position no-border-radius fit q-py-xs" @click="goToUser()">
            <div align="center">
              <q-icon
                size="33px"
                name="contact_phone"
                :color="$route.name == 'userlist' ? 'white' : 'grey'"
              />
              <div :class="$route.name == 'userlist' ? 'text-white' : 'text-grey'">บุคลากร</div>
            </div>
          </div>
        </div>
        <q-space></q-space>
        <div class="col" align="center">
          <div v-ripple class="relative-position no-border-radius fit q-py-xs" @click="goToAbout()">
            <div align="center">
              <q-icon
                size="33px"
                name="settings"
                :color="$route.name == 'about' ? 'white' : 'grey'"
              />
              <div :class="$route.name == 'about' ? 'text-white' : 'text-grey'">เพิ่มเติม</div>
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
