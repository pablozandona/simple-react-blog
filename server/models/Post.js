const mongoose = require('mongoose');
const {Schema} = mongoose;

const PostSchema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    sections: {type: Array},
    date: {type: Date, default: Date.now},
    blogId: {type: Schema.Types.ObjectId, required: true}
});

mongoose.model('Post', PostSchema);

