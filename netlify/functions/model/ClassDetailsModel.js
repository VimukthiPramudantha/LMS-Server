const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const classDetailsSchema = new Schema({
   studentId: {
      type: String,
      required: true
   },
   subject: {
      type: String,
      required: true
   },
   studentName: {
      type: String,
      required: true
   },
   startAt: {
      type: String,
      required: true
   },
   endAt: {
      type: String,
      required: true
   },
   classDay: {
      type: String,
      required: true
   }
});

module.exports = mongoose.model('ClassDetails', classDetailsSchema);
classDetailsSchema.set('timestamps', true);