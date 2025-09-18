const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "emaudio2",
    version: "2.4",
    author: "BADHON",
    longDescription: "Audio response system for Badhon-related phrases",
    category: "entertainment",
    guide: {
      en: "Simply type any of these phrases:\n"
        + "• Badhon single\n"
        + "• badhoner kew nai\n"
        + "• badhon aka"
    },
    usePrefix: false
  },

  onStart: async function ({ message }) {
    await message.reply("🔄 Badhon Audio Bot is ready!\n\n"
      + "Available triggers:\n"
      + "• Badhon single\n"
      + "• badhoner kew nai\n"
      + "• badhon aka\n\n"
      + "Try typing any of these to get audio responses!");
  },

  onChat: async function ({ event, message, usersData }) {
    try {
      const body = (event.body || "").trim().toLowerCase();
      
      const triggerMap = {
        "badhon single": "https://files.catbox.moe/4cdp4x.mp3",
        "badhoner kew nai": "https://files.catbox.moe/4cdp4x.mp3",
        "badhon aka": "https://files.catbox.moe/4cdp4x.mp3"
      };

      if (!triggerMap[body]) return;

      const audioURL = triggerMap[body];
      const attachment = await getStreamFromURL(audioURL);
      
      if (!attachment) {
        throw new Error("Failed to get audio stream");
      }

      const userData = await usersData.get(event.senderID);
      const name = userData.name;

      await message.reply({
        body: `🎧 ${name} said: "${body}"`,
        attachment: attachment,
        mentions: [{
          id: event.senderID,
          tag: name
        }]
      });

    } catch (error) {
      console.error("Error in emaudio2 command:", error);
      await message.reply("❌ Error playing audio. Please try again later.");
    }
  }
};
