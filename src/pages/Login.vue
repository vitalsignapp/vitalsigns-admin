<template>
  <div>
    <!-- TODO : Container Header -->
    <q-toolbar class="bg-primary-500 shadow-1">
      <q-toolbar-title class="col">
        <q-img src="../statics/pic/logo-admin.png" width="250px"></q-img>
      </q-toolbar-title>
      <q-space />
      <div style="width:70px;">
        <div class="row bg-primary-600 q-pa-xs round" style="border-radius:15px;">
          <div class="col">
            <q-btn
              flat
              round
              size="8px"
              :class="isChangeLanguage != 'th' ? 'backdrop' : null"
              @click="(isChangeLanguage = 'th'), changeLanguage('th')"
            >
              <q-img src="../statics/pic/Thai.png"></q-img>
            </q-btn>
          </div>
          <div class="col" align="right">
            <q-btn
              flat
              round
              size="8px"
              :class="isChangeLanguage != 'en' ? 'backdrop' : null"
              @click="(isChangeLanguage = 'en'), changeLanguage('en')"
            >
              <q-img src="../statics/pic/English.png"></q-img>
            </q-btn>
          </div>
        </div>
      </div>
    </q-toolbar>

    <div class="q-pa-xl" align="center">
      <q-btn class="button-action" dense label="เข้าสู่ระบบ" to="/patient"></q-btn>
    </div>
  </div>
</template>

<script>
import { auth } from "../router";
export default {
  name: "PageIndex",
  data() {
    return {
      isChangeLanguage: "th"
    };
  },
  mounted() {
    auth.onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        console.log("SIGNIN");
      } else {
        // No user is signed in.
        console.log("NOT");
      }
    });
  }
};
</script>
