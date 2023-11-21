exports.fetchProfileHandler = async function (request, response) {
    const { profileIdentifier } = request.params;
    const database = request.app.get('database');
    const profiles = database.collection('profiles');
    const profile = await profiles.findOne({ _id: Number(profileIdentifier) });

    if (profile === null) {
        response.status(404).send("Sorry, the profile that you're looking for can't be found.").end()
    } else {
        response.render('profile_template', { profile: profile });
    }
};