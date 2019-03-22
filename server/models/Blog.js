const mongoose = require('mongoose');
const {Schema} = mongoose;

const BlogSchema = new Schema({
    title: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    owner: {type: Schema.Types.ObjectId, required: true},
    lastUpdate: {type: Date, default: Date.now}
});

mongoose.model('Blog', BlogSchema);

