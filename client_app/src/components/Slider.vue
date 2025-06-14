<template>
  <div class="slider-container">
    <div 
      class="slide" 
      v-for="(slide, index) in slides" 
      :key="index"
      :class="{ active: currentIndex === index }"
    >
      <img :src="getImageUrl(slide.image)" :alt="slide.title">
      <div class="slide-content">
        <h2 v-html="slide.title"></h2>
        <p v-html="slide.description"></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainSlider',
  data() {
    return {
      currentIndex: 0,
      slides: [
        {
          image: '1.jpg',
          title: 'Standard sea freight <br> services',
          description: 'If low costs matter for your shipment, try our sea freight<br>services.'
        },
        {
          image: '2.jpg',
          title: 'International road<br>transport',
          description: 'The road transport industry is the backbone of strong<br>economies and dynamic societies.'
        },
        {
          image: '3.jpg',
          title: 'Warehousing and<br>storage',
          description: 'Warehouse services can be offered as a single service or<br>combined with transportation.'
        }
      ]
    }
  },
  mounted() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    }, 3000);
  },
  methods: {
    getImageUrl(imageName) {
      try {
        return new URL(`/src/assets/images/slides/${imageName}`, import.meta.url).href;
      } catch {
        return new URL('/src/assets/images/slides/default.jpg', import.meta.url).href;
      }
    }
  }
}
</script>

<style scoped>
.slider-container {
  width: 100%;
  height: 600px; 
  position: relative;
  overflow: hidden;
}

.slide {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1s ease;
}

.slide.active {
  opacity: 1;
  z-index: 1;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover; 
}

.slide-content {
  position: absolute;
  top: 20%;
  left: 300px;
  max-width: 50%;
}

.slide-content h2 {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  transform: translateX(-100%);
  transition: transform 0.8s ease;
}

.slide-content p {
  font-size: 1.2rem;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  transform: translateX(100%);
  transition: transform 0.8s ease 0.2s;
}

.slide.active .slide-content h2,
.slide.active .slide-content p {
  transform: translateX(0);
}

.slide:not(.active) .slide-content h2 {
  transform: translateX(-100%);
}

.slide:not(.active) .slide-content p {
  transform: translateX(100%);
}
</style>