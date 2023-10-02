require('dotenv').config()

const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: "test/e2e/*.js",
    defaultCommandTimeout: 30000
  },
})

