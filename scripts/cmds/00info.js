const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "info",
    aliases: ["info"],
    version: "1.0",
    author: "BADHON",
    role: 0,
    shortDescription: {
      en: "Get the Bot information such as uptime, ping, and group info."
    },
    longDescription: {
      en: "Displays bot uptime, ping, and information about the current group."
    },
    category: "Info",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      // Download image from Google Drive (direct download link)
      const fileId = "1gkpMollzPqSrRByClg58EV8LBh-Cj0jH";
      const fileUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      const imgPath = path.join(__dirname, "botinfo.jpg");

      const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, Buffer.from(response.data, "binary"));

      // Get thread info
      const threadInfo = await api.getThreadInfo(event.threadID);
      const threadMem = threadInfo.participantIDs.length;
      const messageCount = threadInfo.messageCount || 0;
      const threadName = threadInfo.threadName || "Unnamed Group";
      const threadID = threadInfo.threadID;
      const adminIDs = threadInfo.adminIDs || [];

      // Count gender
      let maleCount = 0, femaleCount = 0;
      for (const user of threadInfo.userInfo) {
        if (user.gender === "MALE") maleCount++;
        else if (user.gender === "FEMALE") femaleCount++;
      }

      // Fetch admin names concurrently
      let adminNames = "";
      if (adminIDs.length > 0) {
        const adminInfo = await api.getUserInfo(adminIDs.map(a => a.id));
        for (const admin of adminIDs) {
          const name = adminInfo[admin.id]?.name || "Unknown";
          adminNames += `• ${name}\n`;
        }
      }

      // Bot uptime
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      const uptimeString = `${hours}Hrs ${minutes}min ${seconds}sec`;

      // Ping
      const timeStart = Date.now();
      await api.sendMessage("𝗖𝗵𝗲𝗰𝗸𝗶𝗻𝗴 𝗕𝗼𝘁'𝘀 𝗜𝗻𝗳𝗼...", event.threadID);
      const ping = Date.now() - timeStart;

      // Info message
      const message = `╭───── 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢 ─────⭓
├─「𝐔𝐏𝐓𝐈𝐌𝐄」
│» ${uptimeString}
├─「𝐏𝐈𝐍𝐆」
│» ${ping}ms
├─「𝐆𝐑𝐎𝐔𝐏 𝐈𝐍𝐅𝐎」
│» Name: ${threadName}
│» ID: ${threadID}
│» Members: ${threadMem}
│» Male: ${maleCount} | Female: ${femaleCount}
│» Admins: ${adminIDs.length}
│» Messages: ${messageCount}
╰────────────────────⭓`;

      // Send message with image attachment
      api.sendMessage(
        {
          body: message,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => {
          if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }
      );

    } catch (error) {
      console.error("ERROR in info.js:", error);
      api.sendMessage(`An error occurred: ${error.message}`, event.threadID);
    }
  }
};
