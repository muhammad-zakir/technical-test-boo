exports.fetchProfileHandler = async function (request, response) {
    const { userIdentifier } = request.params;

    await request.app.get('databaseConnection').connect();
    const database = request.app.get('databaseConnection').db('');
    const profiles = database.collection('profiles');
    const profile = await profiles.findOne({ _id: Number(userIdentifier) });

    if (profile === null) {
      response.status(404).send("Sorry, the profile that you're looking for can't be found.")
    }

    response.render('profile_template', {
    profile: profile,
  });
};