const { profileIdentifierValidator } = require('../helpers/profileIdentifierValidator');

exports.fetchCommentsHandler = async function (request, response) {
  const { profileIdentifier } = request.params;
  const { filter, sort } = request.query;
  const database = request.app.get('database');
  
  if (await profileIdentifierValidator(database, profileIdentifier)) {
    const comments = database.collection('comments');
    const fetchedComments = await comments
    .find({ profileIdentifier: Number(profileIdentifier) })
    .project({ _id: 0, profileIdentifier: 0 })
    .toArray();
    const profileIdentifiers = fetchedComments.map(comment => comment.voterIdentifier);
    const selectedProfiles = await database.collection('profiles')
    .find({ _id: { $in: profileIdentifiers } })
    .project({ image: 1, name: 1})
    .toArray()

    let mappedComments = fetchedComments.map((comment) => {
      comment.likes = comment.likes.length

      const voter = selectedProfiles.find((profile) => profile._id === comment.voterIdentifier );
      comment.voter = {
        image: voter.image,
        name: voter.name
      };
      delete(comment.voterIdentifier);

      return comment;
    });

    if (typeof filter !== 'undefined') {
      const filters = [
        'enneagram',
        'mbti',
        'zodiac'
      ];

      if (filters.includes(filter)) {
        mappedComments = mappedComments.filter((comment) => {
          if (filter === 'enneagram') {
            return comment.enneagram !== null;
          }

          if (filter === 'mbti') {
            return comment.mbti !== null;
          }

          if (filter === 'zodiac') {
            return comment.zodiac !== null;
          }
        });
      }
    }

    if (typeof sort !== 'undefined') {
      if (sort === 'best') {
        mappedComments = mappedComments.sort((first, second) => { return second.likes - first.likes })
      }

      if (sort === 'recent') {
        mappedComments = mappedComments.sort((first, second) => { return second.createdAt - first.createdAt })
      }
    }

    return response.json(mappedComments);
  } else {
    response.status(404).json({
      message: 'Invalid profile identifier'
    });
  }
};