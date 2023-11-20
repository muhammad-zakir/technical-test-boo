const { profileIdentifierValidator } = require('../helpers/profileIdentifierValidator');

exports.createCommentHandler = async function (request, response) {
  if (isCommentBodyValid(request.body)) {
    const { comment, profileIdentifier, voterIdentifier, votes } = request.body;

    await request.app.get('databaseConnection').connect();
    const database = request.app.get('databaseConnection').db('');

    if (await profileIdentifierValidator(database, profileIdentifier) && await profileIdentifierValidator(database, voterIdentifier)) {
      const comments = database.collection('comments');
      const commentToInsert = {
        profileIdentifier: profileIdentifier,
        voterIdentifier: voterIdentifier,
        comment: comment,
        enneagram: votes.enneagram ?? null,
        mbti: votes.mbti ?? null,
        zodiac: votes.zodiac ?? null,
        likes: [],
        createdAt: new Date().getTime()
      };
      comments.insertOne(commentToInsert);

      response.json(commentToInsert); 
    } else {
      response.status(404).json({
        message: 'Invalid profile identifier'
      });
    }
  } else {
    response.status(422).json({
      message: 'Please validate the comment data first.'
    });
  }
};

function isCommentBodyValid(requestBody) {
  const {
    comment, profileIdentifier, voterIdentifier, votes
  } = requestBody;
  let result = false;
  
  if (comment && profileIdentifier && voterIdentifier && votes) {
    if (typeof votes === 'object') {
      result = true;

      if (typeof votes.enneagram === 'string') {
        const enneagrams = [
          '1w2',
          '2w3',
          '3w2',
          '3w4',
          '4w3',
          '4w5',
          '5w4',
          '5w6',
          '6w5',
          '6w7',
          '7w6',
          '7w8',
          '8w7',
          '8w9',
          '9w8',
          '9w1'
        ];
        if (enneagrams.includes(votes.enneagram) === false) {
          result = false;
        }
      }
      
      if (typeof votes.mbti === 'string') {
        const mbtis = [
          'INFP',
          'INFJ',
          'ENFP',
          'ENFJ',
          'INTJ',
          'INTP',
          'ENTP',
          'ENTJ',
          'ISFP',
          'ISFJ',
          'ESFP',
          'ESFJ',
          'ISTP',
          'ISTJ',
          'ESTP',
          'ESTJ'
        ];
        if (mbtis.includes(votes.mbti) === false) {
          result = false;
        }
      }

      if (typeof votes.zodiac === 'string') {
        const zodiacs = [
          'Aries',
          'Taurus',
          'Gemini',
          'Cancer',
          'Leo',
          'Virgo',
          'Libra',
          'Scorpio',
          'Sagittarius',
          'Capricorn',
          'Aquarius',
          'Pisces'
        ];
        if (zodiacs.includes(votes.zodiac) === false) {
          result = false;
        }
      }
    }
  }

  return result;
}