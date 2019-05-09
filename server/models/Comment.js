const mongoose = require('mongoose');

const { Schema } = mongoose;

const mongoSchema = new Schema({
    authorId: {
        type: Number,
        default: 1
    },

    postId: {
        type: Schema.Types.ObjectId,
    },

    text: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },

    editedAt: {
        type: Date
    },

    parentId: {
        type: Schema.Types.ObjectId,
    },

    ancestorId: {
        type: Schema.Types.ObjectId,
    },

    childrensIds: [Schema.Types.ObjectId],

    descendantsIds: [Schema.Types.ObjectId],

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

});

class CommentClass {
    static async add({
        postId,
        text,
        parentId = null,
        ancestorId = null
    }) {            
        
        let newComment = await this.create({
            postId,
            text,
            parentId,
            ancestorId
        });

        if(parentId && ancestorId){
            this.findById(ancestorId).then((ancestor) => {
                let descendantsIds = Array.isArray(ancestor.descendantsIds) ? [...ancestor.descendantsIds, newComment.id]  : [newComment.id];
                
                Comment.updateOne({ _id: ancestorId}, {
                    descendantsIds,
                    childrensIds: descendantsIds                
                }).catch((err) => {
                    console.log(err);
                });   
            }).catch((err) => {
                console.log(err);
            });

            if(parentId !== ancestorId){
               
                this.findById(parentId).then((parent) => {
                    let childrensIds = Array.isArray(parent.childrensIds) ? [...parent.childrensIds, newComment.id] : [newComment.id];

                    Comment.updateOne({_id: parentId}, {childrensIds}).catch((err) => {
                        console.log(err);
                    });
                }).catch((err) => {
                    console.log(err);
                });
            }
        }
       
        return newComment;
    }

    static async list(offset = 0, limit = 10, ancestorId = null, sort = { createdAt: -1 }) {
        const comments = await this.find({ ancestorId })
            .sort(sort)
            .skip(offset)
            .limit(limit);

        return comments;
    }
}

mongoSchema.loadClass(CommentClass);

mongoSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
mongoSchema.set('toJSON', {
    virtuals: true
});

const Comment = mongoose.model('Comment', mongoSchema);


module.exports = Comment;