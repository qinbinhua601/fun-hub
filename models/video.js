var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var videoSchema = new Schema({
    aid: { type: Number },
    title: { type: String, default: '' },
    desc: { type: String, default: '' },
    img: { type: String, default: '' },
    updated: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now },
    page: { type: Number },
    cate: { type: Number }
});

var Video = mongoose.model('Video', videoSchema);

module.exports = Video;
