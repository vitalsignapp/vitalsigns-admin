<template>
  <q-page>
    <div style="max-width:360px;margin:auto" class>
      <div align="center" class="font-h3 q-mt-md">
        <div
          class="bg-primary-500 text-white q-pa-md rounded-borders"
          style="width:90%;margin:auto"
        >
          <div>{{userData.name + " " + userData.surname}}</div>
          <div>{{userData.email}}</div>
        </div>
      </div>

      <div class="q-mt-lg q-px-md">
        <div
          v-if="isAdmin"
          class="font-body color-primary-500 relative-position cursor-pointer row items-center"
          v-ripple
          @click="isShowConfigVitalSigns = true"
        >
          <q-icon size="24px" name="gavel"></q-icon>
          <span class="q-pl-sm">เลือกข้อมูลที่ต้องการให้คนไข้กรอก</span>
        </div>

        <div class="row items-center q-pt-md">
          <div class="col-1 font-body q-pr-sm" style="width:fit-content">เปลี่ยนภาษา</div>
          <div style="width:70px;" class="col-2">
            <div class="row bg-placeholder q-pa-xs round" style="border-radius:15px;">
              <div class="col">
                <q-btn
                  flat
                  round
                  size="8px"
                  :class=" $i18n.locale != 'th-th' ? 'backdrop' : null"
                  @click="(isChangeLanguage = 'th-th'), changeLanguage('th-th')"
                >
                  <q-img src="../statics/pic/Thai.png"></q-img>
                </q-btn>
              </div>
              <div class="col" align="right">
                <q-btn
                  flat
                  round
                  size="8px"
                  :class=" $i18n.locale != 'en-us' ? 'backdrop' : null"
                  @click="(isChangeLanguage = 'en-us'), changeLanguage('en-us')"
                >
                  <q-img src="../statics/pic/english.png"></q-img>
                </q-btn>
              </div>
            </div>
          </div>
        </div>

        <div
          class="font-body color-primary-500 relative-position cursor-pointer q-mt-md row items-center"
          @click="isChangePassword = true"
        >
          <q-icon name="vpn_key" size="24px"></q-icon>
          <span class="q-pl-sm">เปลี่ยน Password</span>
        </div>

        <div
          v-ripple
          class="font-body color-primary-500 relative-position cursor-pointer q-mt-md row items-center"
          @click="logout()"
        >
          <q-icon name="no_meeting_room" size="24px"></q-icon>
          <span class="q-pl-sm">ออกจากระบบ</span>
        </div>

        <q-separator class="q-my-lg" />

        <div class="q-mb-sm font-h4">About project</div>
        <div
          class="font-body q-mb-sm"
        >VitalSign เป็นระบบส่งผลการตรวจร่างการ เบื้องต้นด้วยตนเอง เพื่อลดความเสี่ยงให้ บุคลากรทางการแพทย์และเพิ่มความสามารถในการรองรับผู้ป่วยให้กับโรงพยาบาล</div>

        <!-- <div class="q-mb-sm font-h4">Contributor</div>

        <div class="font-body q-mb-sm">@art @arm @neung</div>
        <div class="font-body q-mb-sm">
          @apirak
          <span class="color-light-gray">from UX Academy</span>
        </div>
        <div class="font-body q-mb-sm">
          @nuch @jay @noon @m @natt
          <span class="color-light-gray">from Ahancer</span>
        </div>

        <div class="q-mt-lg font-h4">Join the Project</div>

        <div class="q-mt-md row">
          <div class="q-pr-sm">
            <q-img style="width:40px" src="../statics/pic/sign-slack.png"></q-img>
          </div>
          <div class="q-pr-sm">
            <q-img style="width:40px" src="../statics/pic/sign-github.png"></q-img>
          </div>
          <div class="q-pr-sm">
            <q-img style="width:40px" src="../statics/pic/sign-figma.png"></q-img>
          </div>
        </div>-->

        <a href="https://vitalsignapp.com/" target="__blank" style="text-decoration:none">
          <span class="color-primary-500 font-body">
            <span>อ่านเพิ่มเติม</span>
          </span>
        </a>

        <a
          href="https://forms.gle/Sk3gq9EdGeM2R5j59"
          target="__blank"
          style="text-decoration:none"
          class="font-body color-primary-500 q-mt-md row items-center"
        >
          <q-icon name="fas fa-envelope" size="24px"></q-icon>
          <span class="q-pl-sm">ส่งข้อความถึงทีมพัฒนา</span>
        </a>
      </div>
    </div>
    <q-dialog v-model="isShowConfigVitalSigns" maximized>
      <q-card class="q-pa-md bg-surface">
        <div align="right">
          <q-btn dense round flat v-close-popup class="relative-position z-top color-black">
            <q-icon name="close" size="45px"></q-icon>
          </q-btn>
        </div>
        <q-card-section class="dialog-container" style="max-width:360px;width:95%;margin:auto">
          <div align="center" class="font-h4 q-pb-md">เลือกข้อมูลที่ต้องการให้คนไข้กรอก</div>
          <div>
            <q-toolbar
              class="q-pa-xs"
              v-for="(items,index) in vitalSignsArr"
              :key="index"
              @click="items.status = !items.status"
            >
              <div class="fit border-light-gray rounded-borders row">
                <div class="col-12">
                  <q-checkbox v-model="items.status" keep-color color="teal">
                    <span>{{ items.sym }}</span>
                  </q-checkbox>
                </div>
              </div>
            </q-toolbar>
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn @click="saveConfig()" label="บันทึก" style="min-width:80px;" class="button-action"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isChangePassword" maximized>
      <q-card class="q-pa-md bg-surface">
        <div align="right">
          <q-btn dense round flat v-close-popup class="relative-position z-top color-black">
            <q-icon name="close" size="45px"></q-icon>
          </q-btn>
        </div>
        <q-card-section style="max-width:360px;width:95%;margin:auto">
          <div>
            <div class="font-h3" align="center">ตั้งรหัสผ่านใหม่</div>
          </div>
          <div class="q-mt-md">
            <div class="col-12">
              <span class="font-body">รหัสผ่านใหม่</span>
            </div>
            <q-input outlined type="password" v-model="currentpass" placeholder="new password"></q-input>
          </div>
          <div class="q-mt-md">
            <span class="font-body">ยืนยันรหัสอีกครั้ง</span>
            <q-input outlined type="password" v-model="confirmpass" placeholder="confirm password"></q-input>
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            label="ยืนยันรหัสผ่านใหม่"
            :disable="isDisabled"
            @click="resetpass()"
            class="button-action font-body"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { db, auth } from "../router";
export default {
  data() {
    return {
      currentpass: "",
      confirmpass: "",
      isChangeLanguage: this.$i18n.locale,
      isAdmin: false,
      isShowConfigVitalSigns: false,
      isChangePassword: false,
      vitalSignsArr: [
        {
          sym: "อุณหภูมิร่างกาย",
          status: false
        },
        {
          sym: "ค่าออกซิเจนในเลือด",
          status: false
        },
        {
          sym: "ค่าความดันเลือด",
          status: false
        },
        {
          sym: "อัตราการเต้นของหัวใจ",
          status: false
        },
        {
          sym: "อาการตอนนี้",
          status: false
        }
      ],

      isDisabled: false
    };
  },
  methods: {
    resetpass() {
      if (this.currentpass == "" || this.confirmpass == "") {
        this.vnotify("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }

      if (this.currentpass != this.confirmpass) {
        this.vnotify("รหัสผ่านไม่ตรงกัน");
        return;
      }

      this.loadingShow();

      this.isDisabled = true;

      let refs = db
        .collection("userData")
        .doc(this.userData.key)
        .update({ password: this.confirmpass })
        .then(() => {
          setTimeout(() => {
            this.loadingHide();
            this.vnotify("เปลื่ยนรหัสผ่านแล้ว");
            this.isChangePassword = false;
            this.isDisabled = false;
          }, 1000);
        });
    },
    logout() {
      // TODO : message ต้องเปลี่ยน
      this.$q
        .dialog({
          title: "ออกจากระบบ",
          message: "คุณต้องการออกจากระบบใช่หรือไม่?",
          cancel: true,
          ok: { color: "orange-5" }
        })
        .onOk(() => {
          auth.signOut().then(() => {
            this.$router.push("/");
            this.$q.localStorage.clear();
          });
        });
    },
    saveConfig() {
      this.loadingShow();

      db.collection("hospital")
        .doc(this.$q.localStorage.getItem("hospitalKey"))
        .update({
          vitalSignsConfig: this.vitalSignsArr
        })
        .then(() => {
          this.loadingHide();
        });
    },
    loadUserData() {
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
    changeLanguage(lang) {
      this.$i18n.locale = lang;
      this.isChangeLanguage = lang;
    },
    loadCurrentConfig() {
      this.loadingShow();
      db.collection("hospital")
        .doc(this.$q.localStorage.getItem("hospitalKey"))
        .get()
        .then(doc => {
          if (doc.data().vitalSignsConfig) {
            this.vitalSignsArr = doc.data().vitalSignsConfig;
          }

          this.loadUserData();
        });
    }
  },
  mounted() {
    this.loadCurrentConfig();
  }
};
</script>

<style lang="scss" scoped>
.backdrop {
  opacity: 0.3;
}
</style>
