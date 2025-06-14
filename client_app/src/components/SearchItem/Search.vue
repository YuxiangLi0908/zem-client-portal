<template>
    <div class="login-wrapper">
        <MainHeader />
    </div>
</template>

<script>
import MainHeader from '@/components/layout/Header.vue'
export default {
  name: 'App',
  components: {
    MainHeader,
  },
  methods: {
    
  }
}
</script>

<style>
.login-wrapper, .login-wrapper * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-wrapper {
  width: 99.5vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -49.75vw;
  margin-right: -49.75vw;
  overflow-x: hidden;
}
</style>