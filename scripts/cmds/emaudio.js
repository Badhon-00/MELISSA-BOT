const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "emaudio",
    version: 2.2,
    author: "BADHON",
    longDescription: "Emoji reaction system with different audio responses",
    category: "Special",
    guide: {
      en: "Just type 😆, 😂,😭, 😒 etc."
    },
    usePrefix: false
  },

  onStart: async function (context) {
    await module.exports.sendDefaultResponse(context);
  },

  onChat: async function ({ event, message, usersData }) {
    const prefix = global.GoatBot.config.prefix;
    const body = (event.body || "").trim(); // Removed toLowerCase() to preserve emoji case

    // Define all triggers and their corresponding audio URLs
    const triggerMap = {
      "😆": "https://files.catbox.moe/q4vxo1.mp3",
      "😂": "https://files.catbox.moe/q4vxo1.mp3",
      "🤣": "https://files.catbox.moe/q4vxo1.mp3",
      "😹": "https://files.catbox.moe/q4vxo1.mp3",
      "😁": "https://files.catbox.moe/q4vxo1.mp3",
      "😒": "https://files.catbox.moe/07bw5k.mp3",
      "😭": "https://files.catbox.moe/gsfpnj.mp3",
      "🥹": "https://files.catbox.moe/gsfpnj.mp3",
      [prefix + "owner"]: "https://files.catbox.moe/q4vxo1.mp3"
    };

    // Check if the message is one of our triggers
    if (!triggerMap.hasOwnProperty(body)) return;

    // Get the corresponding audio URL
    const audioURL = triggerMap[body];
    
    // Send the response
    await module.exports.sendAudioResponse({ 
      event, 
      message, 
      usersData, 
      audioURL 
    });
  },

  sendDefaultResponse: async function ({ message }) {
    await message.reply("Type 😆, 😂,😭 or 😒 to hear different sounds!");
  },

  sendAudioResponse: async function ({ event, message, usersData, audioURL }) {
    const attachment = await getStreamFromURL(audioURL);
    const id = event.senderID;
    const userData = await usersData.get(id);
    const name = userData.name;
    const mentions = [{ id, tag: name }];

    message.reply({ 
      body: `${name} reacted with ${event.body}!`,
      attachment,
      mentions 
    });
  }
};
