
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    // _id: ObjectId,
    user_id: {
        type: Number,
        unique: true
    },
    keywords: [String],
    channels: [String],
    notify: {
        type: Boolean,
        default: false
    },
});

const User = mongoose.model('User', userSchema);
export default User