// ----------------------------------------------------------------------------
// requirements
const mongoose = require('mongoose');

// ----------------------------------------------------------------------------
// create schema

let domainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'You must give a domain name',
    unique: true,
    index: true
  }
});

// ----------------------------------------------------------------------------
// methods

// ----------------------------------------------------------------------------
// create model from schema
let domainModel = mongoose.model('Domain', domainSchema);

// ----------------------------------------------------------------------------
// exports
module.exports = domainModel;
