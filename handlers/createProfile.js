exports.createProfileHandler = async function (request, response) {
  if (isProfileBodyValid(request.body) ) {
    const { name, description, mbti, enneagram, variant, tritype, socionics, sloan, psyche } = request.body;

    await request.app.get('databaseConnection').connect();
    const database = request.app.get('databaseConnection').db('');

    const profiles = database.collection('profiles');

    const profile = {
      _id: await profiles.estimatedDocumentCount() + 1,
      name: name,
      description: description,
      mbti: mbti,
      enneagram: enneagram,
      variant: variant,
      tritype: tritype,
      socionics: socionics,
      sloan: sloan,
      psyche: psyche,
      image: "https://soulverse.boo.world/images/1.png"
    };
    profiles.insertOne(profile);

    response.json(profile);
  } else {
    response.status(422).json({
      message: 'Please validate the profile data first.'
    });
  }
};

function isProfileBodyValid(requestBody) {
  const {
    name,
    description,
    mbti,
    enneagram,
    variant,
    tritype,
    socionics,
    sloan,
    psyche
  } = requestBody;

  return name && description && mbti &&  enneagram &&  variant && tritype && socionics && sloan && psyche;
}