/*
 * Create and export configuration variables
 *
 */

// Container for all the environments
const environmnets = {};

// Staging (default) environment
environmnets.staging = {
  'httpPort' : 3000,
  'httpsPort' : 3001,
  'envName' : 'staging'
};

// Production environment
environmnets.production = {
  'httpPort' : 5000,
  'httpsPort' : 5001,
  'envName' : 'production'
};

// Determine whhich environment was passed as a commandline argument
const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLocaleLowerCase() : '';

// Check that the current environment is one of the environments above. If not, default to staging
const environmentToExport = typeof(environmnets[currentEnvironment]) == 'object' ? environmnets[currentEnvironment] : environmnets.staging;

// Export the module
module.exports = environmentToExport;
