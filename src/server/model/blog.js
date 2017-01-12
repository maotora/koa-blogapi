import mongoose, { Schema } from 'mongoose';

const blogSchema = new Schema({
    title: String,
    author: String,
    content: String,
    media: Buffer,
    updated: {type: Date, default: Date.now},
    comments: [{body: String, date: Date}],
    date: {type: Date, default: Date.now},
    hidden: Boolean,
    categories: [{type: String}],
    meta: {
        favs: Number,
        votes: Number,
        tags: [{type: String, index: true}],
    },
});

let blog;

try {
    blog = mongoose.model('blog');
}catch(err) {
    blog = mongoose.model('blog', blogSchema);
}

export default blog;
