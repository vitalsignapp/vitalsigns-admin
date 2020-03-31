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
              @click="(isChangeLanguage = 'th'), changeLanguage('th-th')"
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
              @click="(isChangeLanguage = 'en'), changeLanguage('en-us')"
            >
              <q-img src="../statics/pic/English.png"></q-img>
            </q-btn>
          </div>
        </div>
      </div>
    </q-toolbar>

    <div align="center" class="font-h3 q-pt-lg">โรงพยาบาลศิริราช</div>
    <div style="max-width:330px;margin:auto;width:90%" class="q-pt-md">
      <div>
        <q-input
          outlined
          :label="$t('emailLabel')"
          placeholder="example@vitalsign.com"
          v-model="email"
        ></q-input>
      </div>
      <div class="q-pt-md">
        <q-input
          v-model="password"
          @keyup.enter="signIn()"
          outlined
          :type="isPwd ? 'password' : 'text'"
          :label="$t('passwordLabel')"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </div>

      <div class="q-pa-xl" align="center">
        <q-btn @click="signIn()" class="button-action" dense label="เข้าสู่ระบบ"></q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from "../router";
export default {
  name: "PageIndex",
  data() {
    return {
      isPwd: true,
      email: "",
      password: "",
      isChangeLanguage: "th",
      user: {
        userNo: "",
        prefix: "",
        name: "",
        surname: "",
        email: "",
        password: ""
      }
    };
  },
  methods: {
    signIn() {
      let _this = this;
      this.loadingShow();
      auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          auth.onAuthStateChanged(user => {
            this.loadingHide();
            if (user) {
              console.log(user);
              // this.$router.push("/patient");
            }
          });
        })
        .catch(error => {
          var errorCode = error.code;
          var errorMessage = error.message;
          if (error) {
            _this.popUpDialog("ผิดพลาด", "ไม่พบข้อมูลผู้ใช้งานนี้ในระบบ");
            _this.loadingHide();
          }
        });
    },
    changeLanguage(lang) {
      this.$i18n.locale = lang;
      console.log(this.$i18n.locale);
    }
  },
  beforeCreate() {
    let _this = this;
    auth.onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        _this.$router.push("/patient");
      }
    });
  }
};
</script>
<style lang="scss" scoped>
.backdrop {
  opacity: 0.3;
}
</style>