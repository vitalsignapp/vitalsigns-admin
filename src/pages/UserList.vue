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
          <!-- <q-btn dense flat icon="chevron_left" to="/room"></q-btn> -->
          <span class="q-pl-md">บุคลากร</span>
        </q-toolbar-title>
        <div class="q-pa-sm">
          <!-- TODO ปุ่มเพิ่มผู้ป่วยมีเฉพาะใน Super Admin -->
          <q-btn @click="showAddUserDialog()" flat dense icon="add" label="เพิ่มบุคลากร" />
          <q-btn icon="search" flat></q-btn>
        </div>
      </q-toolbar>
      <q-toolbar class="col bg-primary-500 shadow-1" v-if="$q.platform.is.desktop">
        <q-toolbar-title>รายละเอียดบุคลากร</q-toolbar-title>
        <q-btn flat icon="more_vert" class="no-border-radius">
          <q-menu auto-close>
            <q-list style="min-width: 100px">
              <q-item clickable>
                <q-item-section>พิมพ์ QR Code ทั้งห้อง</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <div class="row">
      <div
        class="container-list-data"
        :class="$q.platform.is.desktop ? 'col-4' : 'col-12'"
        :style="
          $q.platform.is.desktop ? 'max-width:360px;width:100%;' : 'width:100%;'
        "
      >
        <div>
          <div
            v-for="(items,index) in userData"
            :key="index"
            class="relative-position container cursor-pointer"
            v-ripple
            @click="showUserData(index)"
          >
            <div class="row q-py-sm font-body full-width" style="padding-left:30px">
              <div class="col" align="left">
                <span class="no-padding">{{ items.prefix }} {{ items.name }} {{ items.surname }}</span>
                <br />
                <span class="color-light-gray">{{ items.userAccount }}</span>
              </div>
              <div class="col-1 self-center" style="width:30px;">
                <q-icon name="chevron_right" size="24px"></q-icon>
              </div>
            </div>
            <q-separator />
          </div>
        </div>
      </div>

      <!-- COLUMN ขวา -->

      <div class="col relative-position desktop-only" align="center">
        <div
          class="q-px-xs q-pt-md"
          style="max-width:330px;width:90%;margin:auto;"
          v-if="isClickedUserData"
        >
          <div class="q-pt-md">
            <div
              align="left"
              class="font-h3"
            >{{ currentUserData.prefix }} {{ currentUserData.name }} {{ currentUserData.surname }}</div>
            <div class="font-body q-py-sm q-pt-md" align="left">
              <span class="color-light-gray">รหัสบุคลากร</span>
              <span>&nbsp;{{ currentUserData.userAccount }}</span>
            </div>
            <div class="font-body q-py-sm" align="left">
              <span class="color-light-gray">email</span>
              <span>&nbsp;{{ currentUserData.email }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-dialog
      maximized
      v-model="isShowAddRoomDialog"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-white font-body" align="center">
        <q-card-section align="right">
          <q-btn v-close-popup icon="fas fa-times" flat></q-btn>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-h6" align="center">เพิ่มบุคลากร</div>
        </q-card-section>

        <q-card-section class="q-pt-none row" style="max-width:360px;margin:auto">
          <div class="col-12 q-px-sm" align="left">
            <span class="positionLabel">รหัสบุคลากร</span>
            <q-input
              v-model="user.userNo"
              style="max-width:330px;min-height:80px"
              outlined
              label="รหัสบุคลากร"
            ></q-input>
          </div>
          <div class="col-12 q-px-sm" align="left">
            <span class="positionLabel">คำนำหน้า</span>

            <q-input
              v-model="user.prefix"
              style="max-width:147px;min-height:80px"
              outlined
              label="คำนำหน้า"
            ></q-input>
          </div>
          <div class="col-6 q-px-sm" align="left">
            <span class="positionLabel">ชื่อและนามสกุล</span>

            <q-input
              v-model="user.name"
              style="max-width:330px;min-height:80px"
              outlined
              label="ชื่อจริง"
            ></q-input>
          </div>
          <div class="col-6 q-px-sm">
            &nbsp;
            <q-input
              v-model="user.surname"
              style="max-width:330px;min-height:80px"
              outlined
              label="นามสกุล"
            ></q-input>
          </div>
          <div class="col-12 q-px-sm" align="left">
            <span class="positionLabel">Email</span>

            <q-input
              v-model="user.email"
              style="max-width:330px;min-height:80px"
              outlined
              label="email"
            ></q-input>
          </div>
          <div class="col-12 q-px-sm" align="left">
            <span class="positionLabel">ตั้งพาสเวิร์ด</span>

            <q-input
              v-model="user.password"
              style="max-width:330px;min-height:80px"
              outlined
              label="password"
            ></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn @click="addUser()" label="บันทึก" class="button-action" style="min-width:80px"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { auth } from "../router";
import { db } from "../router";
export default {
  data() {
    return {
      isClickedUserData: false,
      user: {},
      isShowAddRoomDialog: false,
      userData: "",
      currentUserData: "",
      platform: this.$q.platform.is
    };
  },
  methods: {
    showUserData(index) {
      if (this.platform.desktop) {
        console.log("DESKTOP");
        this.isClickedUserData = true;
        this.currentUserData = this.userData[index];
      } else {
        console.log("MOBILE");
        this.$router.push("/userdata/" + this.userData[index].key);
      }
    },
    showAddUserDialog() {
      this.user = {};
      this.isShowAddRoomDialog = true;
    },
    loadUserData() {
      db.collection("userData")
        .where("hospitalKey", "==", this.$q.localStorage.getItem("hospitalKey"))
        .onSnapshot(doc => {
          let dataTemp = [];
          doc.forEach(element => {
            dataTemp.push({ ...element.data(), ...{ key: element.id } });
          });
          dataTemp.sort((a, b) => {
            return a.name > b.name ? 1 : -1;
          });
          this.userData = dataTemp;
        });
    },
    addUser(email, password) {
      this.loadingShow();
      let _this = this;
      auth
        .createUserWithEmailAndPassword(_this.user.email, _this.user.password)
        .then(() => {
          let user = auth.currentUser;

          user
            .updateProfile({
              displayName: this.user.name + " " + this.user.password
            })
            .then(() => {
              let userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                name: this.user.name,
                surname: this.user.surname,
                userAccount: this.user.userNo,
                prefix: this.user.prefix,
                password: this.user.password
              };
              db.collection("userData")
                .add(userData)
                .then(() => {
                  this.loadingHide();
                  this.$q.notify({
                    message: "สร้างบุคลากรเรียบร้อย",
                    classes: "notifyBg"
                  });
                  this.isShowAddRoomDialog = false;
                });
            });
        })
        .catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorMessage);
          if (errorCode == "auth/invalid-email") {
            // รูปแบบ Email ผิดพลาด
          }
        });
    }
  },
  mounted() {
    this.loadUserData();
  }
};
</script>

<style lang="scss" scoped>
.positionLabel {
  position: relative;
  top: 8px;
}
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