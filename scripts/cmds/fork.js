module.exports = {
  config: {
    name: "fork",
    aliases: ["Ayanesan", "ayane"],
    version: "1.0",
    author: "Badhon",
    role: 0,
    shortDescription: "Get Ayane San V3 fork link",
    longDescription: "Sends the GitHub fork link for Ayane San V3 by Badhon",
    category: "utility",
    guide: "^{prefix}fork or ^{prefix}Ayanesan"
  },
  
  onStart: async function ({ api, event, args, message }) {
    try {
      const forkLink = "https://github.com/Badhon-00/MELISSA-BOT-V2-GIFT.git";
      
      const response = `
┌───────────────
│  AYANE SAN V3
├───────────────
│
│ DEAR BBY HERE IS YOUR FORK 😗
│ 
│ 🔗 ${forkLink}
│
│ - CREATED BY BADHON -
└───────────────
      `;
      
      await message.reply(response);
      
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while sending the fork link.");
    }
  }
};
