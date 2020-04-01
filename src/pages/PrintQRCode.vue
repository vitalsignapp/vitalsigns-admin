<template>
  <div style="background-color:#E5E5E5;">
    <div class="pageA4 shadow-2" v-if="$route.params.key != 'null' && isLoadData">
      <div class="row">
        <div
          class="col-6"
          :class="[i == 1 || i == 2 ? 'rotate-qr' : null,i == 3 ? 'border-tr' : null,i == 1 ? 'border-l' : null,i == 4 ? 'border-t' : null]"
          style="padding:50px 0px;height:561px;"
          v-for="i in 4"
          :key="i"
        >
          <div
            class="row justify-center items-center"
            align="center"
            style="height:255px;padding-top:0px;"
          >
            <div class="q-pa-lg bg-white">
              <qr-code :text="patientData.path" :size="220" color="#000" error-level="H"></qr-code>
            </div>
          </div>
          <div class="font-h3 q-mt-lg" style="font-size:24px;">
            <div align="center">
              <span class>{{"รหัส: " + patientData.HN}}</span>
            </div>
            <div class="q-mt-md q-px-md" align="center">
              <span class="font-h1">{{patientData.name + " " + patientData.surname}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="pageA4 shadow-2"
      v-show="$route.params.key == 'null' && isLoadData"
      v-for="(list,index) in patientDataList"
      :key="index"
    >
      <div class="row">
        <!-- v-show="item.name != ''" -->
        <div
          class="col-4"
          style="padding:35px 0px;height:374px;"
          :class="[index2 == 0 || index2 == 1 || index2 == 3 || index2 == 4 ? 'border-b border-r' : null,index2 == 2 || index2 == 5 ? 'border-b ' : null,index2 == 6 || index2 == 7 ? 'border-r' : null]"
          v-for="(item,index2) in list"
          :key="index2"
          v-show="item.name != ''"
        >
          <div
            class="row justify-center items-center"
            align="center"
            style="height:200px;padding-top:0px;"
          >
            <div class="q-pa-lg bg-white">
              <qr-code :text="item.path" :size="170" color="#000" bg-color="#fff" error-level="H"></qr-code>
            </div>
          </div>
          <div align="center" class="font-body q-mt-lg">
            <span class>{{"รหัส: " + item.HN}}</span>
            <br />
            <div class="q-mt-sm q-px-sm">
              <span class="font-h4" style="font-size:21px;">{{item.name + " " + item.surname}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../router/index.js";
export default {
  data() {
    return {
      patientData: "",
      patientDataList: [],
      isLoadData: false
    };
  },
  methods: {
    loadPatient() {
      let patientKey = this.$route.params.key;
      let refs = db.collection("patientData").doc(patientKey);

      this.loadingShow();

      refs.get().then(result => {
        let newPath = "https://www.vitalsign-2bc48.web.app/" + result.id;

        let setData = {
          key: result.id,
          path: newPath,
          ...result.data()
        };

        this.patientData = setData;

        this.loadingHide();

        this.isLoadData = true;
      });
    },
    loadPatientAll() {
      let refs = db.collection("patientData").get();

      this.loadingShow();

      refs.then(doc => {
        if (doc.size) {
          let temp = [];
          let setCount = 9;

          setTimeout(() => {
            doc.forEach(result => {
              let newPath = "https://www.vitalsign-2bc48.web.app/" + result.id;

              let setData = {
                key: result.id,
                path: newPath,
                ...result.data()
              };
              temp.push(setData);
            });

            let count = Math.ceil(temp.length / setCount);
            let start = 0;
            let end = setCount;
            let setNewArr = [];

            for (let i = 0; i < count; i++) {
              let newSlice = temp.slice(start, end);

              setNewArr.push(newSlice);

              start += setCount;
              end += setCount;

              if (setNewArr[i].length != 9) {
                for (let ii = 0; ii < 9; ii++) {
                  let setData = {
                    name: "",
                    surname: "",
                    path: "",
                    HN: ""
                  };

                  setNewArr[i].push(setData);

                  if (setNewArr[i].length == 9) {
                    break;
                  }
                }
              }
            }

            this.patientDataList = setNewArr;

            this.isLoadData = true;

            this.loadingHide();
          }, 1200);
        } else {
          this.loadingHide();
        }
      });
    }
  },
  mounted() {
    if (this.$route.params.key != "null") {
      this.loadPatient();
    } else {
      this.loadPatientAll();
    }
  }
};
</script>

<style lang="scss" scoped>
.rotate-qr {
  transform: rotate(180deg);
}

.pageA4 {
  width: 210mm;
  height: 297mm;
  margin: auto;
  background-color: #fafafa;
}

.border-tb {
  border-bottom: 1px dashed rgb(161, 161, 161);
  border-top: 1px dashed rgb(161, 161, 161);
}

.border-lr {
  border-left: 1px dashed rgb(161, 161, 161);
  border-right: 1px dashed rgb(161, 161, 161);
}

.border-tr {
  border-top: 1px dashed rgb(161, 161, 161);
  border-right: 1px dashed rgb(161, 161, 161);
}

.border-t {
  border-top: 1px dashed rgb(161, 161, 161);
}

.border-b {
  border-bottom: 1px dashed rgb(161, 161, 161);
}

.border-r {
  border-right: 1px dashed rgb(161, 161, 161);
}

.border-l {
  border-left: 1px dashed rgb(161, 161, 161);
}

@media print {
  .pageA4 {
    width: 210mm;
    height: 297mm;
    margin: auto;
    background-color: #fafafa;
  }

  @page {
    margin: 0cm;
  }
}
</style>
