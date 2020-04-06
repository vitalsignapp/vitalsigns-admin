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
        <div class="q-pa-sm" v-if="!isSearch">
          <q-btn
            v-show="isAdmin"
            @click="showAddUserDialog()"
            flat
            dense
            class="q-mx-sm"
            label="+ เพิ่มบุคลากร"
          />
          <q-btn flat round dense icon="search" @click="isSearch = true" />
        </div>
        <div class="col q-px-sm" v-if="isSearch">
          <q-input
            class="font-body"
            bg-color="white"
            rounded
            outlined
            dense
            v-model="search"
            label="ค้นหา"
            @keyup="filterData()"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>

            <template v-slot:after>
              <span
                class="font-body q-px-sm color-white cursor-pointer"
                @click="isSearch = false,displayUserData = userDataList"
              >ยกเลิก</span>
            </template>
          </q-input>
        </div>
      </q-toolbar>
      <q-toolbar class="col bg-primary-500 shadow-1" v-if="$q.platform.is.desktop">
        <q-toolbar-title>รายละเอียดบุคลากร</q-toolbar-title>
        <div v-if="isClickedUserData && isAdmin">
          <q-btn dense round flat class="q-ml-sm" size="14px">
            <q-img src="../statics/pic/Option.png" width="30px"></q-img>
            <q-menu square :offset="[5, 16]">
              <q-list style="min-width: 150px">
                <q-btn class="fit row no-border-radius" flat @click="editUser()">
                  <div class="col" align="left">แก้ไข้ข้อมูลบุคลากร</div>
                </q-btn>
                <q-btn class="fit row no-border-radius" flat @click="deleteUser()">
                  <div class="col text-red" align="left">ลบบุคลากร</div>
                </q-btn>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <div class="row">
      <div
        class="container-list-data bg-white"
        :class="$q.platform.is.desktop ? 'col-4' : 'col-12'"
        :style="
          $q.platform.is.desktop ? 'max-width:360px;width:100%;' : 'width:100%;'
        "
      >
        <div>
          <div
            v-for="(items,index) in displayUserData"
            :key="index"
            class="relative-position container cursor-pointer"
            v-ripple
            @click="showUserData(items.key)"
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
              <div class="col-12">
                <span class="color-light-gray">{{items.userId}}</span>
              </div>
            </div>
            <q-separator />
          </div>
        </div>
      </div>

      <!-- COLUMN ขวา -->

      <div class="col container-list-data relative-position" v-if="$q.platform.is.desktop">
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
            <div class="font-body q-py-sm q-pt-md" align="left" v-if="currentUserData.userId">
              <span class="color-light-gray">รหัสบุคลากร</span>
              <span>&nbsp;{{ currentUserData.userId }}</span>
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
          <div class="col-12 q-px-sm q-mt-md" align="left">
            <span class>รหัสบุคลากร</span>
            <q-input
              v-model="user.userId"
              style="max-width:330px;width:100%;"
              outlined
              label="รหัสบุคลากร"
              :rules="[val => !!val]"
              ref="userId"
              hide-bottom-space
            ></q-input>
          </div>
          <div class="col-12 q-px-sm q-mt-md" align="left">
            <span class>คำนำหน้า</span>
            <q-input v-model="user.prefix" style="max-width:147px;" outlined label="คำนำหน้า"></q-input>
          </div>
          <div class="col-6 q-px-sm q-mt-md" align="left">
            <span class>ชื่อและนามสกุล</span>
            <q-input
              v-model="user.name"
              style="max-width:330px;width:100%;"
              outlined
              label="ชื่อจริง"
              :rules="[val => !!val]"
              ref="name"
              hide-bottom-space
            ></q-input>
          </div>
          <div class="col-6 q-px-sm q-mt-md">
            &nbsp;
            <q-input
              v-model="user.surname"
              style="max-width:330px;width:100%;"
              outlined
              label="นามสกุล"
              :rules="[val => !!val]"
              ref="surname"
              hide-bottom-space
            ></q-input>
          </div>
          <div class="col-12 q-px-sm q-mt-md" align="left">
            <span class>Email</span>

            <q-input
              v-model="user.email"
              style="max-width:330px;width:100%;"
              outlined
              label="email"
              :rules="[val => !!val]"
              ref="email"
              hide-bottom-space
            ></q-input>
          </div>
          <div class="col-12 q-px-sm q-mt-md" align="left">
            <span class>ตั้งพาสเวิร์ด</span>

            <q-input
              v-model="user.password"
              style="max-width:330px;width:100%;"
              outlined
              label="password"
              :rules="[val => !!val]"
              ref="password"
              hide-bottom-space
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
      user: {
        dateCreated: "",
        email: "",
        hospitalKey: "",
        isAdmin: false,
        microtimeCreated: "",
        name: "",
        password: "",
        surname: "",
        userId: "",
        prefix: ""
      },
      isShowAddRoomDialog: false,
      userDataList: "",
      currentUserData: "",
      platform: this.$q.platform.is,
      isAdmin: false,
      isSearch: false,
      search: "",
      displayUserData: "",

      isAddMode: true
    };
  },
  methods: {
    editUser() {
      this.isAddMode = false;
      this.isShowAddRoomDialog = true;
      let selectUser = this.currentUserData;

      this.user = selectUser;
    },
    deleteUser() {},
    filterData() {
      if (this.search == "") {
        this.displayUserData = this.userDataList;
      }
      let filter = this.userDataList.filter(x => {
        return x.name.includes(this.search) || x.surname.includes(this.search);
      });
      this.displayUserData = filter;
    },
    showUserData(key) {
      if (this.platform.desktop) {
        this.isClickedUserData = true;
        this.currentUserData = this.userDataList.filter(x => x.key == key)[0];
      } else {
        this.$router.push("/userdata/" + this.userDataList[index].key);
      }
    },
    showAddUserDialog() {
      this.user = {
        dateCreated: "",
        email: "",
        hospitalKey: "",
        isAdmin: false,
        microtimeCreated: "",
        name: "",
        password: "",
        surname: "",
        userId: "",
        prefix: ""
      };
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

          this.userDataList = dataTemp;
          this.displayUserData = dataTemp;
        });
    },

    loadCurrentUser() {
      let userKey = this.$q.localStorage.getItem("userData").key;

      let refs = db
        .collection("userData")
        .doc(userKey)
        .get();

      refs.then(result => {
        this.isAdmin = result.data().isAdmin;

        this.loadingHide();
      });
    },

    async addUser() {
      let date = await this.getDate();

      this.$refs.userId.validate();
      this.$refs.name.validate();
      this.$refs.surname.validate();
      this.$refs.email.validate();
      this.$refs.password.validate();

      if (
        this.$refs.userId.hasError ||
        this.$refs.name.hasError ||
        this.$refs.surname.hasError ||
        this.$refs.email.hasError ||
        this.$refs.password.hasError
      ) {
        return;
      }

      this.loadingShow();

      // Add Mode
      if (this.isAddMode) {
        db.collection("userData")
          .where("email", "==", this.user.email)
          .get()
          .then(doc => {
            if (doc.size) {
              // กรณีตรวจพบ User ซ้ำ
              this.loadingHide();
              this.vnotify("Email นี้ถูกใช้งานแล้ว");
            } else {
              this.user.hospitalKey = this.$q.localStorage.getItem(
                "userData"
              ).hospitalKey;

              this.user.microtimeCreated = date.microtime;

              db.collection("userData")
                .add(this.user)
                .then(() => {
                  this.vnotify("สร้างบุคลากรเรียบร้อย");
                  this.loadingHide();
                  this.isShowAddRoomDialog = false;
                });
            }
          });
      }
      // Edit Mode
      else {
        let setData = { ...this.user };

        let userKey = setData.key;

        delete setData.key;

        db.collection("userData")
          .doc(userKey)
          .update(setData)
          .then(() => {
            this.vnotify("บันทึกข้อมูลแล้ว");
            this.loadingHide();
            this.isShowAddRoomDialog = false;
            this.isAddMode = true;
          });
      }

      // this.loadingShow();
      // let _this = this;
      // auth
      //   .createUserWithEmailAndPassword(_this.user.email, _this.user.password)
      //   .then(() => {
      //     let user = auth.currentUser;

      //     user
      //       .updateProfile({
      //         displayName: this.user.name + " " + this.user.password
      //       })
      //       .then(() => {
      //         let userData = {
      //           uid: user.uid,
      //           email: user.email,
      //           displayName: user.displayName,
      //           name: this.user.name,
      //           surname: this.user.surname,
      //           userAccount: this.user.userId,
      //           prefix: this.user.prefix,
      //           password: this.user.password
      //         };
      //         db.collection("userData")
      //           .add(userData)
      //           .then(() => {
      //             this.loadingHide();
      //             this.$q.notify({
      //               message: "สร้างบุคลากรเรียบร้อย",
      //               classes: "notifyBg"
      //             });
      //             this.isShowAddRoomDialog = false;
      //           });
      //       });
      //   })
      //   .catch(function(error) {
      //     var errorCode = error.code;
      //     var errorMessage = error.message;
      //     alert(errorMessage);
      //     if (errorCode == "auth/invalid-email") {
      //       // รูปแบบ Email ผิดพลาด
      //     }
      //   });
    }
  },
  mounted() {
    this.loadCurrentUser();
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