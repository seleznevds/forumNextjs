const mongoose = require('mongoose');
const escape =  require('escape-html');
const { Schema } = mongoose;

// Duplicate the ID field.


const mongoSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    preview: {
        type: String
    },

    text: {
        type: String,
        required: true
    },

    commentsQuantity: {
        type: Number,
        default: 0
    },

    votes: {
        likes: {
            type: Number,
            default: 0
        },

        dislikes: {
            type: Number,
            default: 0
        }
    },

    createdAt: {
        type: Date,
        default: Date.now(),
        
    },

    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },

    image: String
});

class PostClass {
    static async list({offset = 0, limit = 10} = {}) {
        const posts = await this.find({})
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit);

        const postsQuantity = await this.estimatedDocumentCount();
        
        return  { posts, postsQuantity };
    }

    static async add({title, preview, text, image, userId}){
        return this.create({
            title: escape(title.trim()),
            preview: escape(preview.trim().slice(0, 100)),
            text: escape(text.trim()),
            image, 
            userId   
        });
    }


    static async update({title, preview, text, image, id}){
        
    }
}



mongoSchema.loadClass(PostClass);

mongoSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
mongoSchema.set('toJSON', {
    virtuals: true
});

mongoSchema.set('toObject', {
    virtuals: true
});


const Post = mongoose.model('Post', mongoSchema);
module.exports = Post;