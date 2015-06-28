// schema types mongoose: http://mongoosejs.com/docs/schematypes.html

var mongoose = require('mongoose');

var CalendarSchema = new mongoose.Schema({
    date: Date,
    year: Number,
    event: String,
    message: String, // all users can see this message
    note: String // note only for me
});

module.exports = Calendar = mongoose.model('Calendar', CalendarSchema);
