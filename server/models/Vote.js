const mongoose = require('mongoose');
const { Schema } = mongoose;

const mongoSchema = new Schema({
    moduleName: {
        type: String,
        required: true,
    },    

    elementId: Schema.Types.ObjectId,

    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },

    authorId: {
        type: Schema.Types.ObjectId,
        required: true
    },

    voteType: String
});

class VoteClass {
    static async add(moduleName, elementId, authorId, voteType){
        return this.create({
            moduleName,
            elementId,
            authorId,
            voteType     
        });
    } 

    static async removeVote(moduleName, elementId, authorId, voteType){   
        return this.findOneAndRemove({ moduleName, elementId, authorId, voteType});
    } 
    
    static async getVotesByElementsIds(moduleName, authorId, elementsIds=[]){
        if(! moduleName || ! authorId){
            throw new Error('Undefined params');
        }
        
        const votes = await this.find({ elementId: { $in: elementsIds }, moduleName, authorId});

        return new Map(votes.map((vote) => {
            return [vote.elementId.toString(), vote.voteType.toString()];
        }));
    }
}

mongoSchema.index({ moduleName: 1, elementId: 1 , authorId: 1, voteType: 1 }, { unique: true } )

mongoSchema.loadClass(VoteClass);

mongoSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

mongoSchema.set('toJSON', {
    virtuals: true
});


const Vote = mongoose.model('Vote', mongoSchema);
module.exports = Vote;