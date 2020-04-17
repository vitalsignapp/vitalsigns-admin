<template>
  <div class="q-pa-md">
    <div class="q-gutter-md" v-show="false">
      <h1>GET DATA</h1>
      <div>
        <q-btn @click="getHospital()" label="getHospital"></q-btn>
      </div>
      <div>
        <q-btn @click="getPatientData()" label="getPatientData"></q-btn>
      </div>
      <div>
        <q-btn @click="getPatientLog()" label="getPatientLog"></q-btn>
      </div>
      <div>
        <q-btn @click="getPatientRoom()" label="getPatientRoom"></q-btn>
      </div>
      <div>
        <q-btn @click="getUserData()" label="getUserData"></q-btn>
      </div>
      <div>
        <q-btn @click="getVersion()" label="getVersion"></q-btn>
      </div>
    </div>
    <div v-show="false">
      <h1>SET DATA</h1>
      <div class="q-gutter-md">
        <div>
          <q-btn @click="setHospital()" label="setHospital"></q-btn>
        </div>
        <div>
          <q-btn @click="setPatientData()" label="setPatientData"></q-btn>
        </div>
        <div>
          <q-btn @click="setPatientLog()" label="setPatientLog"></q-btn>
        </div>
        <div>
          <q-btn @click="setPatientRoom()" label="setPatientRoom"></q-btn>
        </div>
        <div>
          <q-btn @click="setUserData()" label="setUserData"></q-btn>
        </div>
        <div>
          <q-btn @click="setVersion()" label="setVersion"></q-btn>
        </div>
      </div>
    </div>

    <q-btn @click="setPatientData()" label="setPatientData"></q-btn>
  </div>
</template>

<script>
import { $db } from "@/api/firebase";
export default {
  data() {
    return {};
  },
  methods: {
    testConnect() {
      $db.collection("testConnect").add({
        test: true
      });
    },
    getHospital() {
      $db.collection("hospital")
        .get()
        .then(doc => {
          let temp = [];
          doc.forEach(element => {
            temp.push({ ...element.data(), ...{ key: element.id } });
          });
          this.$q.localStorage.set("hospital", temp);
        });
    },
    getPatientData() {
      $db.collection("patientData")
        .get()
        .then(doc => {
          let temp = [];
          doc.forEach(element => {
            temp.push({ ...element.data(), ...{ key: element.id } });
          });
          this.$q.localStorage.set("patientData", temp);
        });
    },
    getPatientLog() {
      $db.collection("patientLog")
        .get()
        .then(doc => {
          let temp = [];
          doc.forEach(element => {
            temp.push({ ...element.data(), ...{ key: element.id } });
          });
          this.$q.localStorage.set("patientLog", temp);
        });
    },
    getPatientRoom() {
      $db.collection("patientRoom")
        .get()
        .then(doc => {
          let temp = [];
          doc.forEach(element => {
            temp.push({ ...element.data(), ...{ key: element.id } });
          });
          this.$q.localStorage.set("patientRoom", temp);
        });
    },
    getUserData() {
      $db.collection("userData")
        .get()
        .then(doc => {
          let temp = [];
          doc.forEach(element => {
            temp.push({ ...element.data(), ...{ key: element.id } });
          });
          this.$q.localStorage.set("userData", temp);
        });
    },
    getVersion() {
      $db.collection("version")
        .get()
        .then(doc => {
          let temp = [];
          doc.forEach(element => {
            temp.push({ ...element.data(), ...{ key: element.id } });
          });
          this.$q.localStorage.set("version", temp);
        });
    },
    setHospital() {
      let getData = this.$q.localStorage.getItem("hospital");

      getData.forEach(element => {
        let eleKey = element.key;
        delete element.key;
        $db.collection("hospital")
          .doc(eleKey)
          .set(element)
          .then(() => {
            console.log("FINISH");
          });
      });
    },
    setPatientData() {
      let getData = this.$q.localStorage.getItem("patientData");

      getData.forEach(element => {
        let eleKey = element.key;
        delete element.key;
        $db.collection("patientData")
          .doc(eleKey)
          .set(element)
          .then(() => {
            console.log("FINISH");
          });
      });
    },
    setPatientLog() {
      let getData = this.$q.localStorage.getItem("patientLog");

      getData.forEach(element => {
        let eleKey = element.key;
        delete element.key;
        $db.collection("patientLog")
          .doc(eleKey)
          .set(element)
          .then(() => {
            console.log("FINISH");
          });
      });
    },
    setPatientRoom() {
      let getData = this.$q.localStorage.getItem("patientRoom");

      getData.forEach(element => {
        let eleKey = element.key;
        delete element.key;
        $db.collection("patientRoom")
          .doc(eleKey)
          .set(element)
          .then(() => {
            console.log("FINISH");
          });
      });
    },
    setUserData() {
      let getData = this.$q.localStorage.getItem("userData");

      getData.forEach(element => {
        let eleKey = element.key;
        delete element.key;
        $db.collection("userData")
          .doc(eleKey)
          .set(element)
          .then(() => {
            console.log("FINISH");
          });
      });
    },
    setVersion() {
      let getData = this.$q.localStorage.getItem("version");

      getData.forEach(element => {
        let eleKey = element.key;
        delete element.key;
        $db.collection("version")
          .doc(eleKey)
          .set(element)
          .then(() => {
            console.log("FINISH");
          });
      });
    },
    setPatientData() {
      let getData = this.$q.localStorage.getItem("patientData");
      getData.forEach(element => {
        let eKey = element.key;
        element.username = element.HN;
        delete element.HN;
        $db.collection("patientData")
          .doc(eKey)
          .set(element)
          .then(() => {
            console.log("FINISH");
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
