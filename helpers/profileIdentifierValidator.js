exports.profileIdentifierValidator = async function (database, profileIdentifier) {
  const profiles = database.collection('profiles');
  const profile = await profiles.findOne({ _id: Number(profileIdentifier) });

  return profile !== null;
};