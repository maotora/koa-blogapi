import mongoose, { Schema } from 'mongoose';

const PageSchema = new Schema({
    creator: String,
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
        viewers: Number
    },
});

let page;

try{
    page = mongoose.model('page');
}catch(err) {
    page = mongoose.model('page', PageSchema);
}

export default page;
