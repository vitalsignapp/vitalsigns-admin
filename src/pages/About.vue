<template>
  <q-page>
    <div style="max-width:360px;margin:auto" class>
      <div align="center" class="font-h3 q-mt-md">
        <div class="bg-primary-500 text-white q-pa-md rounded-borders">
          <div>ธานินทร์ สังข์โพธิ์</div>
          <div>EMAIL@hotmail.com</div>
        </div>
      </div>

      <div class="q-mt-lg q-px-md">
        <div
          v-if="isAdmin"
          class="font-body color-primary-500 relative-position cursor-pointer row items-center"
          v-ripple
          @click="configVitalSigns()"
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
                  <q-img src="../statics/pic/English.png"></q-img>
                </q-btn>
              </div>
            </div>
          </div>
        </div>

        <div
          v-ripple
          class="font-body color-primary-500 relative-position cursor-pointer q-mt-md row items-center"
        >
          <q-icon name="vpn_key" size="24px"></q-icon>
          <span class="q-pl-sm">เปลี่ยน Password</span>
        </div>

        <div
          v-ripple
          class="font-body color-primary-500 relative-position cursor-pointer q-mt-md row items-center"
        >
          <q-icon name="no_meeting_room" size="24px"></q-icon>
          <span class="q-pl-sm">ออกจากระบบ</span>
        </div>

        <q-separator class="q-my-lg" />

        <div class="q-mb-sm" style="font-size:18px;font-weight:600">About project</div>
        <div
          class="font-body q-mb-sm"
        >VitalSign เป็นระบบส่งผลการตรวจร่างการ เบื้องต้นด้วยตนเอง เพื่อลดความเสี่ยงให้ บุคลากรทางการแพทย์และเพิ่มความสามารถในการรองรับผู้ป่วยให้กับโรงพยาบาล</div>

        <div style="font-size:18px;font-weight:600" class="q-mb-sm">Contributor</div>

        <div class="font-body q-mb-sm">@art @arm @neung</div>
        <div class="font-body q-mb-sm">
          @apirak
          <span class="color-light-gray">from UX Academy</span>
        </div>
        <div class="font-body q-mb-sm">
          @nuch @jay @noon @m @natt
          <span class="color-light-gray">from Ahancer</span>
        </div>

        <div class="q-mt-lg" style="font-size:18px;font-weight:600">Join the Project</div>

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
        </div>

        <div
          v-ripple
          class="font-body color-primary-500 relative-position cursor-pointer q-mt-md row items-center"
        >
          <q-icon name="vpn_key" size="24px"></q-icon>
          <span class="q-pl-sm">ส่งข้อความถึงทีมพัฒนา</span>
        </div>
      </div>
    </div>
    <q-dialog v-model="isShowConfigVitalSigns" maximized></q-dialog>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      isChangeLanguage: this.$i18n.locale,
      userData: "",
      isAdmin: true,
      isShowConfigVitalSigns: true
    };
  },
  methods: {
    configVitalSigns() {},
    loadUserData() {},
    changeLanguage(lang) {
      this.$i18n.locale = lang;
      this.isChangeLanguage = lang;
    }
  }
};
</script>

<style lang="scss" scoped>
.backdrop {
  opacity: 0.3;
}
</style>