module.exports = {
  config: {
    name: "antiout",
    version: "1.0",
    author: "BADHON",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "🛡️ 𝗣𝗥𝗘𝗩𝗘𝗡𝗧 𝗨𝗦𝗘𝗥𝗦 𝗙𝗥𝗢𝗠 𝗟𝗘𝗔𝗩𝗜𝗡𝗚 𝗕𝗔𝗗𝗛𝗢𝗡'𝗦 𝗚𝗥𝗢𝗨𝗣"
    },
    longDescription: {
      en: "✨ 𝗘𝗡𝗔𝗕𝗟𝗘/𝗗𝗜𝗦𝗔𝗕𝗟𝗘 𝗔𝗡𝗧𝗜-𝗢𝗨𝗧 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗧𝗢 𝗔𝗨𝗧𝗢-𝗥𝗘𝗔𝗗𝗗 𝗨𝗦𝗘𝗥𝗦 𝗜𝗡 𝗕𝗔𝗗𝗛𝗢𝗡'𝗦 𝗚𝗥𝗢𝗨𝗣"
    },
    category: "system",
    guide: {
      en: "💡 𝗨𝗦𝗔𝗚𝗘: {𝗽𝗻} [𝗼𝗻|𝗼𝗳𝗳] - 𝗧𝗨𝗥𝗡 𝗔𝗡𝗧𝗜-𝗢𝗨𝗧 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗢𝗡/𝗢𝗙𝗙"
    }
  },

  langs: {
    en: {
      turnedOn: "✅ 𝗔𝗡𝗧𝗜-𝗢𝗨𝗧 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗛𝗔𝗦 𝗕𝗘𝗘𝗡 𝗘𝗡𝗔𝗕𝗟𝗘𝗗 𝗙𝗢𝗥 𝗕𝗔𝗗𝗛𝗢𝗡'𝗦 𝗚𝗥𝗢𝗨𝗣!",
      turnedOff: "❌ 𝗔𝗡𝗧𝗜-𝗢𝗨𝗧 𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗛𝗔𝗦 𝗕𝗘𝗘𝗡 𝗗𝗜𝗦𝗔𝗕𝗟𝗘𝗗 𝗙𝗢𝗥 𝗕𝗔𝗗𝗛𝗢𝗡'𝗦 𝗚𝗥𝗢𝗨𝗣!",
      missingPermission: "⚠️  𝗦𝗢𝗥𝗥𝗬 𝗕𝗔𝗗𝗛𝗢𝗡! 𝗜 𝗖𝗢𝗨𝗟𝗗𝗡'𝗧 𝗔𝗗𝗗 %1 𝗕𝗔𝗖𝗞.\n𝗧𝗛𝗘𝗬 𝗠𝗔𝗬 𝗛𝗔𝗩𝗘 𝗕𝗟𝗢𝗖𝗞𝗘𝗗 𝗠𝗘 𝗢𝗥 𝗗𝗜𝗦𝗔𝗕𝗟𝗘𝗗 𝗠𝗘𝗦𝗦𝗘𝗡𝗚𝗘𝗥.",
      addedBack: "🔁  𝗛𝗘𝗬 %1!\n𝗬𝗢𝗨'𝗥𝗘 𝗡𝗢𝗧 𝗔𝗟𝗟𝗢𝗪𝗘𝗗 𝗧𝗢 𝗟𝗘𝗔𝗩𝗘 𝗕𝗔𝗗𝗛𝗢𝗡'𝗦 𝗚𝗥𝗢𝗨𝗣!\n𝗢𝗡𝗟𝗬 𝗕𝗔𝗗𝗛𝗢𝗡 𝗖𝗔𝗡 𝗚𝗜𝗩𝗘 𝗣𝗘𝗥𝗠𝗜𝗦𝗦𝗜𝗢𝗡 𝗧𝗢 𝗟𝗘𝗔𝗩𝗘!"
    }
  },

  onStart: async function ({ args, message, event, threadsData, getLang }) {
    if (args[0] === "on") {
      await threadsData.set(event.threadID, true, "data.antiout");
      return message.reply(getLang("turnedOn"));
    } 
    if (args[0] === "off") {
      await threadsData.set(event.threadID, false, "data.antiout");
      return message.reply(getLang("turnedOff"));
    }
    return message.reply("❓  𝗣𝗟𝗘𝗔𝗦𝗘 𝗦𝗣𝗘𝗖𝗜𝗙𝗬 '𝗢𝗡' 𝗢𝗥 '𝗢𝗙𝗙' 𝗧𝗢 𝗖𝗢𝗡𝗧𝗥𝗢𝗟 𝗕𝗔𝗗𝗛𝗢𝗡'𝗦 𝗔𝗡𝗧𝗜-𝗢𝗨𝗧 𝗦𝗬𝗦𝗧𝗘𝗠.");
  },

  onEvent: async function ({ event, api, threadsData, usersData, getLang }) {
    if (event.logMessageType !== "log:unsubscribe") return;

    const antiout = await threadsData.get(event.threadID, "data.antiout");
    if (!antiout) return;

    if (event.logMessageData.leftParticipantFbId === api.getCurrentUserID()) return;

    const name = await usersData.getName(event.logMessageData.leftParticipantFbId);

    try {
      await api.addUserToGroup(event.logMessageData.leftParticipantFbId, event.threadID);
      api.sendMessage(getLang("addedBack", name), event.threadID);
    } catch (err) {
      api.sendMessage(getLang("missingPermission", name), event.threadID);
    }
  }
};
