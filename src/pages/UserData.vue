<template>
  <q-page>
    <q-header class="color-white">
      <q-toolbar class="bg-primary-500 no-padding shadow-1">
        <q-toolbar-title>
          <q-btn dense flat icon="chevron_left" to="/userlist"></q-btn>
          <span class="q-pl-md">รายละเอียดบุคลากร</span>
        </q-toolbar-title>
        <q-btn dense icon="more_vert" flat></q-btn>
      </q-toolbar>
    </q-header>

    <div class="q-pa-md" v-if="!isLoading">
      <div class="font-h4">
        {{ userData.prefix }} {{ userData.displayName }}
      </div>
      <div class="font-body">
        <div class="q-pt-md">
          <span class="color-light-gray">รหัส</span>
          {{ userData.userAccount }}
        </div>
        <div class="q-pt-md">
          <span class="color-light-gray">email</span>
          {{ userData.email }}
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { $db } from '@/api/firebase';
export default {
  data() {
    return {
      userData: '',
      isLoading: true,
    };
  },
  methods: {
    loadUserData() {
      this.loadingShow();
      $db
        .collection('userData')
        .doc(this.$route.params.key)
        .get()
        .then(doc => {
          this.userData = doc.data();
          this.loadingHide();
          this.isLoading = false;
        });
    },
  },
  mounted() {
    this.loadUserData();
  },
};
</script>

<style lang="scss" scoped></style>
