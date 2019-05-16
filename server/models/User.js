const mongoose = require('mongoose');
const _ = require('lodash');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  displayName: String,
  avatarUrl: String

});

class UserClass {
  static publicFields() {
    return [
      'id',
      'displayName',
      'email',
      'avatarUrl',
      'isAdmin'
    ];
  }

  static async signInOrSignUp({ googleId, email, displayName, avatarUrl }) {
    const user = await this.findOne({ googleId }).select(UserClass.publicFields().join(' '));

    if (user) {
      return user;
    }



    const newUser = await this.create({
      createdAt: new Date(),
      googleId,
      email,
      displayName,
      avatarUrl
    });

    return _.pick(newUser, UserClass.publicFields());
  }

  static async getUsersByIds(idList = []) {
    if (!idList.length) {
      return [];
    }

    let users;
    
    try{
      users = await this.find({ _id: { $in: idList } }).select(UserClass.publicFields().join(' '));
    } catch(err){
      users = [];
      console.log(err);
    }

    return users;
  }
}

mongoSchema.loadClass(UserClass);

mongoSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
mongoSchema.set('toJSON', {
  virtuals: true
});
mongoSchema.set('toObject', {
  virtuals: true
});


const User = mongoose.model('User', mongoSchema);

module.exports = User;