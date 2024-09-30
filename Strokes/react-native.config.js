module.exports = {
  assets: [
    // Add the path to your fonts or other assets here. For example:
    "./assets/images/",
    "./assets/icons/"  // If you want to link icons or other static assets
  ],

  env: {
    development: '.env.development',
    staging: '.env.staging',
    production: '.env.production',
  },
  project: {
    android: {
      unstable_reactLegacyComponentNames: ["CellContainer", "AutoLayoutView"],
    },
    ios: {
      unstable_reactLegacyComponentNames: ["CellContainer", "AutoLayoutView"],
    },
  },
};

