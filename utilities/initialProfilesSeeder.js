exports.initialProfilesSeeder = async function seedInitialProfiles(database) {
  const profiles = database.collection('profiles');
  await profiles.insertMany([
    {
      "_id": 1,
      "name": "A Martinez",
      "description": "Adolph Larrue Martinez III.",
      "mbti": "ISFJ",
      "enneagram": "9w3",
      "variant": "sp/so",
      "tritype": 725,
      "socionics": "SEE",
      "sloan": "RCOEN",
      "psyche": "FEVL",
      "image": "https://soulverse.boo.world/images/1.png",
    },
    {
      "_id": 2,
      "name": "Superion Blowpipe",
      "description": "An Autobot from Earth, with an Fe- blood type.",
      "mbti": "ISTJ",
      "enneagram": "3w2",
      "variant": "sp/so",
      "tritype": 725,
      "socionics": "SEE",
      "sloan": "RCOEN",
      "psyche": "FEVL",
      "image": "https://soulverse.boo.world/images/1.png",
    },
    {
      "_id": 3,
      "name": "Rumble Ramjet",
      "description": "An Autobot from Cybertron, with an Au- blood type.",
      "mbti": "INFP",
      "enneagram": "2w3",
      "variant": "sp/so",
      "tritype": 725,
      "socionics": "SEE",
      "sloan": "RCOEN",
      "psyche": "FEVL",
      "image": "https://soulverse.boo.world/images/1.png",
    }
  ]);
}