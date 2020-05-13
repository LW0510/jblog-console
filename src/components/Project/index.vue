<template>
  <div>
    <svg-icon icon-class="download" @click="handleDownload"/>
  </div>
</template>

<script>
export default {
  name: 'ghc',
  data() {
    return {
      url: 'https://gitee.com/perfectjoey/framework.git'
    }
  },
  methods: {
    handleDownload() {
      window.open(this.url)
    }
  }
}
</script>
