var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var videoSchema = new Schema({
    title: { type: String, default: '' },
    desc: { type: String, default: '' },
    img: { type: String, default: '' },
    updated: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now },
});

var Video = mongoose.model('Video', videoSchema);

module.exports = Video;
