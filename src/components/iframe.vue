<template>

  <div v-loading="iframeLoading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading">
    <iframe :src='iframeUrl' id="iframe" width="100%" style="height:calc(100vh - 60px);" frameborder="0"
            scrolling="auto" @load="loadFrame()">
    </iframe>
  </div>
</template>
<script>

  import Comm from '../components/Common.vue'
  export default {
    name: 'iframeMode',
    data() {
      return {
        permission: JSON.parse(sessionStorage.getItem('permission')) === null ?
          [
            'ADD',
            'SELECT',
            'CHECK',
            'PAGE',
            'SELECT',
            'CHECK',
            'ADD',
            'EDIT',
            'DELETE',
            'DISTRIBUTIONSTAFF',
            'ASSIGNPERMISSIONS',
            'FILTER',
            'RESETPWD',
            'SHIELDINGPERSONNEL'
          ] : JSON.parse(sessionStorage.getItem('permission')),
        iframeUrl: 'http://www.hao123.com/',
        iframeLoading: true
      }
    },
    created() {
//      el = this;
      this.iframeUrl = sessionStorage.getItem('url')
//      this.$nextTick(function () {
//        document.getElementById('iframe').onreadystatechange = function () {
//          if (this.readyState == "complete") {
//          }
//        }
//      });

    },
    mounted() {

      this.iframeUrl = sessionStorage.getItem('url')
    },
    update() {
      this.iframeUrl = sessionStorage.getItem('url')
//      this.iframeUrl = this.$route.query.url
    },
//    watch: {
//      '$route': 'fetchData'
//    },
    watch: {
      '$route'(to, from) {

        this.iframeUrl = sessionStorage.getItem('url')
      }
    },
    mounted() {
      let self = this;
//      this.$nextTick(function () {
//        $('#iframe').load = function () {
//          console.log('...')
//        };
//      });
    },
    methods: {
      loadFrame() {
        this.iframeLoading=false
      },
      fetchData() {

      }
    }
  }

</script>
<style>


</style>
