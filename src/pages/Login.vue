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
    <div style="max-width:330px;margin:auto" class="q-gutter-md q-pt-md">
      <div>
        <q-input
          outlined
          :label="$t('emailLabel')"
          placeholder="example@vitalsign.com"
          v-model="email"
        ></q-input>
      </div>
      <div>
        <q-input outlined :label="$t('passwordLabel')" v-model="password"></q-input>
      </div>

      <div class="q-pa-xl" align="center">
        <q-btn @click="signIn()" class="button-action" dense label="เข้าสู่ระบบ"></q-btn>
      </div>
    </div>

    <!-- REGISTER TEMPORARY -->

    <q-dialog
      maximized
      v-model="isShowAddRoomDialog"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-white">
        <q-card-section align="right">
          <q-btn v-close-popup icon="fas fa-times" flat></q-btn>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-h6" align="center">เพิ่มบุคลากร</div>
        </q-card-section>

        <q-card-section class="q-pt-none" align="center">
          <q-input
            v-model="user.userNo"
            style="max-width:330px;min-height:80px"
            outlined
            label="รหัสบุคลากร"
          ></q-input>
          <q-input
            v-model="user.prefix"
            style="max-width:330px;min-height:80px"
            outlined
            label="คำนำหน้า"
          ></q-input>
          <q-input
            v-model="user.name"
            style="max-width:330px;min-height:80px"
            outlined
            label="ชื่อ"
          ></q-input>
          <q-input
            v-model="user.surname"
            style="max-width:330px;min-height:80px"
            outlined
            label="นามสกุล"
          ></q-input>
          <q-input
            v-model="user.email"
            style="max-width:330px;min-height:80px"
            outlined
            label="email"
          ></q-input>
          <q-input
            v-model="user.password"
            style="max-width:330px;min-height:80px"
            outlined
            label="password"
          ></q-input>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn @click="register()" label="บันทึก" class="button-action" style="min-width:80px"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { auth } from "../router";
export default {
  name: "PageIndex",
  data() {
    return {
      email: "",
      password: "",
      isChangeLanguage: "th",
      isShowAddRoomDialog: true,
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
      auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          auth.onAuthStateChanged(user => {
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
            console.log(errorCode);
            console.log(errorMessage);
            if (errorCode == "auth/invalid-email") {
              // กรณีรูปแบบอีเมลผิดพลาด
            } else {
              // code auth/wrong-password
              // กรณี invalid user and password
            }
          }
        });
    },
    changeLanguage(lang) {
      this.$i18n.locale = lang;
      console.log(this.$i18n.locale);
    },
    register(email, password) {
      let _this = this;
      auth
        .createUserWithEmailAndPassword(_this.user.email, _this.user.password)
        .then(() => {
          let user = auth.currentUser;
          user.updateProfile({
            displayName: "testDisplayName"
          });
        })
        .catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == "auth/invalid-email") {
            // รูปแบบ Email ผิดพลาด
          }
        });
    },
    changeDisplayName() {
      let user = auth.currentUser;
    }
  },
  mounted() {
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
