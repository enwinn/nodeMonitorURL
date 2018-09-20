/*
 * Create and export configuration variables
 *
 */

// Container for all the environments
const environmnets = {};

// Staging (default) environment
environmnets.staging = {
  'port' : 3000,
  'envName' : 'staging'
};

// Production environment
environmnets.production = {
  'port' : 5000,
  'envName' : 'production'
};

// Determine whhich environment was passed as a commandline argument
const currentEnvironment = typeof(process.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLocaleLowerCase() : '';

// Check that the current environment is one of the environments above. If not, default to staging
const environmentToExport = typeof(environmnets[currentEnvironment]) == 'object' ? environmnets[currentEnvironment] : environmnets.staging;

// Export the module
module.exports = environmentToExport;
