const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    members: [{ type: String }], // Use String for Firebase UID
    company: { type: Schema.Types.ObjectId, ref: 'Company' },
});

module.exports = mongoose.model('Team', teamSchema);
