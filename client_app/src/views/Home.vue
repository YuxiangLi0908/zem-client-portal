<template>
  <div class="login-wrapper">
    <MainHeader />
    <Slider />
    

    <ServiceShowcase />
    <div class="flat-row bg-scheme pad-top0px pad-bottom0px" style="background-color: #32bfc0; color: white; width: 100%; padding: 20px 0;">
      <div class="container">
          <div class="row">
              <div class="col-md-12">
                  <div class="promobox style1 style2 clearfix" style="display: flex; align-items: center; justify-content: space-between; padding-left: 300px; padding-right: 300px;">
                      <h5 class="promobox-title" style="color: white; font-size: 1.5rem; margin: 0;">We are honored to be a leading and reliable partner in the field of transport in US</h5>
                      <a class="button black sm" href="contact.html" style="background-color: black; color: white; padding: 8px 16px; white-space: nowrap;">contact us<i class="fa fa-chevron-right"></i></a>
                  </div>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import MainHeader from '@/components/layout/Header.vue'
import Slider from '@/components/Slider.vue'

import ServiceShowcase from '@/components/layout/ServiceShowcase.vue'
export default {
  name: 'App',
  components: {
    MainHeader,
    Slider,
    
    ServiceShowcase,
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const menu = document.querySelector('.floating-menu');
      const header = this.$refs.header?.$el || document.querySelector('header');
      if (window.scrollY > header.offsetHeight * 0.5) {
        menu.classList.add('sticky');
      } else {
        menu.classList.remove('sticky');
      }
    }
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
html {
  overflow-x: hidden;
  width: 100%;
}
body {
  width: 100%;
  overflow-x: hidden;
}

.content {
  flex: 1;
  width: 100%;
  overflow-y: auto;   
  overflow-x: hidden;
}

</style>
