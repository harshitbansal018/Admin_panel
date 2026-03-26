const fs = require('fs');

exports.readJSON = (path) => {
  return JSON.parse(fs.readFileSync(path, 'utf-8'));
};

exports.writeJSON = (path, data) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};