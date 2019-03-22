const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    name: {type: String, required: true},
    user: {type: String, unique: true, required: true},
    password: {type: String, required: true}
});

mongoose.model('User', UserSchema);
