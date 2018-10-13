/*
 * Library for storing and editing data (CRUD)
 *  Create
 *  Read
 *  Update
 *  Delete
*
 */

 // Dependencies
 const fs = require('fs');
 const path = require('path');

 // Container for the module (to be exported)
const lib = {};

// Base directory of the data folder
// E.g. /.data/users
//            /tokens
//            /checks
// etc.
lib.baseDir = path.join(__dirname,'/../.data/');


// Write data to a file
lib.create = (dir, file, data, callback) => {

  // Open the file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json','wx', (err,fileDescriptor) => {
    if (!err && fileDescriptor) {

      // Convert data to string
      const stringData = JSON.stringify(data);

      // Write to file and close it
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              // Closed successfully
              callback(false);
            } else {
              callback('Error closing new file');
            }
          });
        } else {
          // Should never get caleld...
          callback('Error writing to new file');
        }
       });
    } else {
      callback('Could not create new file, it may already exist');
    }
  });
};

// Read data from a file
lib.read = (dir, file, callback) => {
  fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8', (err, data) => {
    callback(err, data);
  });
};

// Update data inside a file
lib.update = (dir, file, data, callback) => {

  // Open the file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json','r+',(err, fileDescriptor) => {
    if (!err && fileDescriptor) {

      // Convert data to string
      const stringData = JSON.stringify(data);

      // Truncate any existing content
      fs.truncate(fileDescriptor, (err) => {
        if (!err) {
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if (!err) {
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  // Succesful file close
                  callback(false);
                } else {
                  callback('Error closing the file');
                }
              })
            } else {
              callback('Error wrinting to existing file');
            }
          })
        } else {
          callback('Error truncating file');
        }
      })

    } else {
      callback('Could not open the file for updating, it may not exist yet');
    }
  })
};

// Delete a file
lib.delete = (dir, file, callback) => {
  // Unlink the file
  fs.unlink(lib.baseDir+dir+'/'+file+'.json', (err) => {
    if (!err) {
      // Successful file delete
      callback(false);
    } else {
      callback('Error deleting the file');
    }
  });
};


// Export the module
module.exports = lib;
