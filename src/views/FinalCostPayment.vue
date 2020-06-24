<template>
  <div id="projectPayment">
    <br />
    <h1 id="projectCost" v-if="finalCost > 0" >
      {{ projectName + " 작업의 추가 비용은 " + finalCost + "원 입니다." }}
    </h1>
    <h1 id="projectCost" v-if="finalCost < 0" >
      {{ projectName + " 작업에서 돌려받을 비용은 " + (-finalCost) + "원 입니다." }}
    </h1>
    <p id="progressMSG" v-if="pointPay">결제 진행 중입니다.</p>
    <b-progress
      id="paymentProgress"
      v-if="pointPay"
      :value="value"
      :max="max"
      show-progress
      animated
    ></b-progress>
    <p id="paymentMSG" v-if="!pointPaySuccess">
      포인트가 부족하여 결제를 실패하였습니다. 계좌이체로 결제를 진행해주세요!
    </p>
    <img
      id="point"
      v-if="finalCost > 0"
      v-on:click="pointPayment"
      src="../assets/pointPayment.png"
    />
    <img
      id="finalPoint"
      v-if="finalCost < 0"
      v-on:click="pointPayment"
      src="../assets/pointPayment.png"
    />
    <img id="account" v-if="finalCost > 0" v-on:click="accountPay" src="../assets/account.png" />
  </div>
</template>
<script>
import axios from "axios";
var pointPaySuccess = "";
var accountSuccess = "";
export default {
  name: "ProjectPayment",
  data() {
    return {
      finalCost: 0,
      projectName: null,
      max: 100,
      value: 0,
      pointPay: false,
      pointPaySuccess: true,
      projectId: "",
    };
  },
  async beforeCreate() {
    axios.defaults.headers.common["authorization"] = await localStorage.getItem(
      "token"
    );
    this.finalCost = this.$route.params.finalCost;
    this.projectName = this.$route.params.projectName;
    this.projectId = this.$route.params.projectId;
  },
  beforeMount() {
    window.addEventListener("beforeunload", this.preventNav);
    this.$once("hook:beforeDestroy", () => {
      window.removeEventListener("beforeunload", this.preventNav);
    });
  },
  beforeRouteLeave(to, from, next) {
    if (pointPaySuccess != "success" && accountSuccess != true) {
      if (
        !window.confirm(
          "결제 페이지를 벗어나는 경우 프로젝트이 생성되지 않습니다. 그래도 이동하시겠습니까?"
        )
      ) {
        return;
      }
    }
    next();
  },
  methods: {
    preventNav(event) {
      if (pointPaySuccess == "success" || accountSuccess == true) return;
      event.preventDefault();
      // Chrome requires returnValue to be set.
      event.returnValue = "";
    },
    pointPayment() {
      this.pointPay = true;
      var startProgess = setInterval(() => {
        if (this.value >= 100) {
          this.pointPay = false;
          clearInterval(startProgess);
        }
        this.value += 20;
      }, 1000);
      setTimeout(() => {
        const pointPayRes = axios
          .get("/api/project/terminate/point", {
            params: {
              projectId: this.projectId,
            },
          })
          .then((res) => {
            pointPaySuccess = res.headers.payment;
            if (res.headers.payment == "success") {
              alert("결제가 완료되었습니다! 결과물 압축이 완료되면 문자로 알려드리겠습니다!");
              this.$router.push("/");
            } else {
              this.pointPaySuccess = false;
            }
          }).catch(function(error){
              alert("포인트 결제를 실패하였습니다.");
          });
      }, 6000);
    },
    accountPay() {
      accountSuccess = true;
      this.$router.push({
        name: "AccountPayment",
        params: {
          state : "terminateProject",   
          cost: this.finalCost,
          name: this.projectName,
          projectId: this.projectId,
        },
      });
    },
  },
};
</script>
<style>
@import url(//fonts.googleapis.com/earlyaccess/hanna.css);
h1 {
  font-family: "Hanna", sans-serif;
}

#point {
  width: 400px;
  height: 310px;
  float: left;
  margin-left: 500px;
  margin-top: 100px;
}
#account {
  width: 400px;
  height: 310px;
  float: left;
  margin-left: 300px;
  margin-top: 110px;
}
#paymentProgress {
  max-width: 700px;
  margin: auto;
}
#progressMSG {
  font-family: "Hanna", sans-serif;
  font-size: 25px;
}
#paymentMSG {
  font-family: "Hanna", sans-serif;
  font-size: 25px;
  color: tomato;
}
#finalPoint {
    margin : auto;
}
</style>
