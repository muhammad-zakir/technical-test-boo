const { ObjectId } = require('mongodb');
const { commentIdentifierValidator } = require('../helpers/commentIdentifierValidator');
const { profileIdentifierValidator } = require('../helpers/profileIdentifierValidator');

exports.likeCommentHandler = async function (request, response) {
  if (isLikeBodyValid(request.body) ) {
    const { commentIdentifier, profileIdentifier } = request.body;
    const database = request.app.get('database');

    if (await commentIdentifierValidator(database, commentIdentifier) === false) {
      response.status(404).json({
        message: 'Invalid comment identifier'
      });
    } else if (await profileIdentifierValidator(database, profileIdentifier) === false) {
      response.status(404).json({
        message: 'Invalid profile identifier'
      });      
    } else {
      const comments = database.collection('comments');
      const comment = await comments.findOne({ _id: new ObjectId(commentIdentifier) });

      let updatedComment;

      if (comment.likes.includes(profileIdentifier)) {
        updatedComment = await comments.findOneAndUpdate(
          { _id: new ObjectId(commentIdentifier) },
          {
            $pull: {
              likes: profileIdentifier
            }
          },
          {
            returnDocument: 'after'
          }
          );
      } else {
        updatedComment = await comments.findOneAndUpdate(
          { _id: new ObjectId(commentIdentifier) },
          {
            $push: {
              likes: profileIdentifier
            }
          },
          {
            returnDocument: 'after'
          }
          ); 
      }

      response.json(updatedComment);
    }
  } else {
    response.status(422).json({
      message: 'Please validate the like data first.'
    });
  }
};

function isLikeBodyValid(requestBody) {
  const {
    commentIdentifier, profileIdentifier
  } = requestBody;
  return commentIdentifier && profileIdentifier;
}