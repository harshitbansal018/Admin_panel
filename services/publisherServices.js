const publisherModel = require('../models/publisherModel');

exports.getAllPublishers = async () => {
  return await publisherModel.getAllPublishers();
};