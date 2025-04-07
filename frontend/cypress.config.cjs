const { defineConfig } = require("cypress");

const codeCoverageTask = require("@cypress/code-coverage/task");

module.exports = {
  ...(on, config) => {
    codeCoverageTask(on, config); 
    return config;
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
};
