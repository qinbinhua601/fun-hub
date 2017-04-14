var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var indexSchema = new Schema({
    name: { type: String, default: '' },
    updated: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now },
    list: { type: String, default: '[]' }
});

var Index = mongoose.model('Index', indexSchema);

module.exports = Index;
