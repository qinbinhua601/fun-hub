var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var videoSchema = new Schema({
    aid: { type: String },
    title: { type: String, default: '' },
    desc: { type: String, default: '' },
    img: { type: String, default: '' },
    updated: { type: Date },
    created: { type: Date },
    page: { type: Number },
    cate: { type: Number },
    url: { type: String },
    view: { type: Number, defualt: 0 }
});

var Video = mongoose.model('Video', videoSchema);

module.exports = Video;
