const { ObjectId } = require('mongodb');

exports.commentIdentifierValidator = async function (database, commentIdentifier) {
  const comments = database.collection('comments');
  const comment = await comments.findOne({ _id: new ObjectId(commentIdentifier) });

  return comment !== null;
};