var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var indexSchema = new Schema({
    name: { type: String, defualt: '' },
    updated: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now }
});

var Index = mongoose.model('Index', indexSchema);

module.exports = Index;
