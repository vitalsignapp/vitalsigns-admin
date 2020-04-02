import Vue from "vue";
import VueRouter from "vue-router";

import routes from "./routes";
import VueAxios from "vue-axios";
import axios from "axios";
import VueCryptojs from "vue-cryptojs";
import VueQRCodeComponent from "vue-qrcode-component";
Vue.use(VueRouter);
Vue.use(VueAxios, axios);
Vue.use(VueCryptojs);
Vue.component("qr-code", VueQRCodeComponent);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

var firebaseConfig = {
  apiKey: "AIzaSyDkfuz9optU8t14BZJBgJ9JNYdH4Omdh6A",
  authDomain: "vitalsign-2bc48.firebaseapp.com",
  databaseURL: "https://vitalsign-2bc48.firebaseio.com",
  projectId: "vitalsign-2bc48",
  storageBucket: "vitalsign-2bc48.appspot.com",
  messagingSenderId: "67633726727",
  appId: "1:67633726727:web:b535d92a91ec80695bb1a2",
  measurementId: "G-MEX9V112SR"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const auth = firebase.auth();

Vue.mixin({
  data() {
    return {
      month: [],
      userData: this.$q.localStorage.getItem("userData")
    };
  },
  methods: {
    async getDate() {
      let apiLink = "https://api.winner-english.com/data/api/gettime.php";
      const res = await axios.get(apiLink);
      return res.data[0];
    },
    loadingShow() {
      this.$q.loading.show({
        delay: 400
      });
    },
    loadingHide() {
      this.$q.loading.hide();
    },
    encrypt(data, type) {
      // ฟังก์ชันการเข้ารหัส AES
      // type 1.OBJ 2.String / boolean / number
      let result;
      if (type == 1) {
        // object TYPE
        result = this.CryptoJS.AES.encrypt(
          JSON.stringify(data),
          "chomart12"
        ).toString();
      } else if (type == 2) {
        // STRING TYPE
        data = data.toString();
        result = this.CryptoJS.AES.encrypt(data, "chomart12").toString();
      }
      return result;
    },
    decrypt(data, type) {
      // ฟังก์ชันการถอดรหัส AES
      // type 1.OBJ 2.String 3.Number 4.boolean
      if (!data) {
        return data;
      }
      let result = this.CryptoJS.AES.decrypt(data, "chomart12").toString(
        this.CryptoJS.enc.Utf8
      );
      if (type == 1) {
        // object type
        // แปลงJSON กลับ
        result = JSON.parse(result.toString(this.CryptoJS.enc.Utf8));
      } else if (type == 3) {
        // number type
        result = Number(result);
      } else if (type == 4) {
        // JSON TYPE
        result = JSON.parse(result);
      }
      return result;
    },
    popUpDialog(title, message) {
      this.$q.dialog({
        title: title,
        message: message,
        ok: {
          color: "orange-5"
        }
      });
    },
    vnotify(message) {
      this.$q.notify({
        message: message,
        classes: "notifyBg"
      });
    },
    showMonthName(index) {
      console.log(this.$i18n.locale);
      let m = index;
      let month;
      if (this.$i18n.locale != "th-th") {
        if (m == "01") {
          month = "January";
        } else if (m == "02") {
          month = "February";
        } else if (m == "03") {
          month = "March";
        } else if (m == "04") {
          month = "April";
        } else if (m == "05") {
          month = "May";
        } else if (m == "06") {
          month = "June";
        } else if (m == "07") {
          month = "July";
        } else if (m == "08") {
          month = "August";
        } else if (m == "09") {
          month = "September";
        } else if (m == "10") {
          month = "October";
        } else if (m == "11") {
          month = "November";
        } else if (m == "12") {
          month = "December";
        }
      } else {
        if (m == "01") {
          month = "มกราคม";
        } else if (m == "02") {
          month = "กุมภาพันธ์";
        } else if (m == "03") {
          month = "มีนาคม";
        } else if (m == "04") {
          month = "เมษายน";
        } else if (m == "05") {
          month = "พฤษภาคม";
        } else if (m == "06") {
          month = "มิถุนายน";
        } else if (m == "07") {
          month = "กรกฎาคม";
        } else if (m == "08") {
          month = "สิงหาคม";
        } else if (m == "09") {
          month = "กันยายน";
        } else if (m == "10") {
          month = "ตุลาคม";
        } else if (m == "11") {
          month = "พฤศจิกายน";
        } else if (m == "12") {
          month = "ธันวาคม";
        }
      }

      return month;
    }
  }
});

export default function(/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({
      x: 0,
      y: 0
    }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });

  return Router;
}
