<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>

  <div id="app">
    <h1>{{ message }}</h1>
    <button @click="fetchData">Get Data from FastAPI</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      message: 'Welcome to Vue.js!',
    };
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get('https://zemclientaca.kindmoss-a5050a64.eastus.azurecontainerapps.io/api/data');
        this.message = response.data.message; // Update Vue state with data from FastAPI
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
