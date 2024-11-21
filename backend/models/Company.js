const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
    name: { type: String, required: true },
    owner: { type: String, required: true }, // Use String for Firebase UID
    members: [{ type: String }], // Use String for Firebase UID
    teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
});

module.exports = mongoose.model('Company', companySchema);
