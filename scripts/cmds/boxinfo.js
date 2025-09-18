const fs = require("fs-extra");
const fetch = require("node-fetch");
const path = require("path");

module.exports = {
  config: {
    name: "groupinfo",
    aliases: ['boxinfo'],
    version: "1.0",
    author: "BADHON",
    countDown: 5,
    role: 0,
    shortDescription: "View detailed group information",
    longDescription: "Displays comprehensive information about the current chat group",
    category: "group",
    guide: {
      en: "{p}groupinfo"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const threadInfo = await api.getThreadInfo(event.threadID);
      
     
      let maleCount = 0, femaleCount = 0, unknownCount = 0;
      for (const user of Object.values(threadInfo.userInfo)) {
        if (user.gender === "MALE") maleCount++;
        else if (user.gender === "FEMALE") femaleCount++;
        else unknownCount++;
      }

      
      const adminNames = [];
      if (threadInfo.adminIDs?.length > 0) {
        for (const admin of threadInfo.adminIDs) {
          try {
            const userInfo = await api.getUserInfo(admin.id);
            adminNames.push(userInfo[admin.id]?.name || 'Unknown');
          } catch {
            adminNames.push('[Hidden User]');
          }
        }
      }

      
      const messageBody = `
┌─── 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢 ───
│
├ 𝗡𝗮𝗺𝗲: ${threadInfo.threadName || 'Unnamed Group'}
├ 𝗜𝗗: ${threadInfo.threadID}
│
├─── 𝗠𝗘𝗠𝗕𝗘𝗥𝗦 ───
│
├ ➤ Total: ${threadInfo.participantIDs.length}
├ ➤ Male: ${maleCount}
├ ➤ Female: ${femaleCount}
├ ➤ Unknown: ${unknownCount}
│
├─── 𝗔𝗗𝗠𝗜𝗡𝗦 ───
│
${adminNames.length > 0 
  ? adminNames.map(name => `├ ➤ ${name}`).join('\n') 
  : '├ ➤ No admins'}
│
├─── 𝗢𝗧𝗛𝗘𝗥 𝗜𝗡𝗙𝗢 ───
│
├ ➤ Approval Mode: ${threadInfo.approvalMode ? '✅ ON' : '❌ OFF'}
├ ➤ Emoji: ${threadInfo.emoji || 'None'}
├ ➤ Messages: ${threadInfo.messageCount || 0}
│
└─── ✨ 𝗕𝗔𝗗𝗛𝗢𝗡 ✨ ───
      `.trim();

      
      if (threadInfo.imageSrc) {
        try {
          const cachePath = path.join(__dirname, 'cache', `group_${event.threadID}.png`);
          
          if (!fs.existsSync(path.dirname(cachePath))) {
            fs.mkdirSync(path.dirname(cachePath), { recursive: true });
          }

          await this.downloadImage(threadInfo.imageSrc, cachePath);
          
          await api.sendMessage({
            body: messageBody,
            attachment: fs.createReadStream(cachePath)
          }, event.threadID);
          
          fs.unlinkSync(cachePath);
          
        } catch (error) {
          console.error("Image error:", error);
          await api.sendMessage(messageBody, event.threadID);
        }
      } else {
        await api.sendMessage(messageBody, event.threadID);
      }

    } catch (error) {
      console.error("Groupinfo error:", error);
      await api.sendMessage("❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗳𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗴𝗿𝗼𝘂𝗽 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻.", event.threadID);
    }
  },

  downloadImage: async function(url, filePath) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
    const buffer = await res.buffer();
    await fs.writeFile(filePath, buffer);
  }
};
