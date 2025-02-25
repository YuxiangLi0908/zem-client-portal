const { defineConfig } = require('@vue/cli-service')
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://zemclientaca.kindmoss-a5050a64.eastus.azurecontainerapps.io', // Replace with your FastAPI backend URL
        changeOrigin: true,  // For virtual hosted sites
        secure: true,       // Disable SSL validation if necessary (for local dev)
        pathRewrite: {
          '^/api': '',       // Rewrites the `/api` part, so the backend sees `/data`
        },
      },
    },
  },
};