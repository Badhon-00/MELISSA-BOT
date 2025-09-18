const os = require('os');
const moment = require('moment');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "uptime2",
    aliases: ["up2", "upt2", " uptime2", "st2"],
    version: "1.1",
    author: "BADHON",
    role: "admin",
    shortDescription: "System Monitor with ",
    longDescription: "Displays system information ",
    category: "system",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    try {
      
      const uptime = process.uptime();
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const memoryUsage = (usedMem / totalMem * 100).toFixed(2);
      
      
      const formatTime = (seconds) => {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${days}d ${hours}h ${minutes}m ${secs}s`;
      };

      // Create progress bar
      const createBar = (percent) => {
        const filled = '█'.repeat(Math.round(percent / 5));
        const empty = '░'.repeat(20 - Math.round(percent / 5));
        return `[${filled}${empty}] ${percent}%`;
      };

      // Prepare the message
      const message = `🖥️ 𝗦𝗬𝗦𝗧𝗘𝗠 𝗠𝗢𝗡𝗜𝗧𝗢𝗥\n\n` +
        `⏳ 𝗨𝗣𝗧𝗜𝗠𝗘: ${formatTime(uptime)}\n` +
        `🧠 𝗠𝗘𝗠𝗢𝗥𝗬: ${memoryUsage}% ${createBar(memoryUsage)}\n` +
        `💾 𝗨𝗦𝗘𝗗: ${(usedMem / (1024 * 1024 * 1024)).toFixed(2)}GB\n` +
        `🆓 𝗙𝗥𝗘𝗘: ${(freeMem / (1024 * 1024 * 1024)).toFixed(2)}GB\n` +
        `📊 𝗧𝗢𝗧𝗔𝗟: ${(totalMem / (1024 * 1024 * 1024)).toFixed(2)}GB\n` +
        `🖥️ 𝗖𝗣𝗨: ${os.cpus()[0].model}\n` +
        `🏷️ 𝗢𝗦: ${os.platform()} ${os.arch()}`;

      // Download and attach the video
      const videoUrl = "https://files.catbox.moe/z38pzq.mp4";
      const videoPath = path.join(__dirname, 'uptime_video.mp4');
      
      if (!fs.existsSync(videoPath)) {
        const response = await axios({
          method: 'GET',
          url: videoUrl,
          responseType: 'stream'
        });
        
        const writer = fs.createWriteStream(videoPath);
        response.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });
      }

      // Send message with video attachment
      await api.sendMessage({
        body: message,
        attachment: fs.createReadStream(videoPath)
      }, event.threadID);

    } catch (error) {
      console.error("Uptime command failed:", error);
      await api.sendMessage("⚠️ Failed to get system information.", event.threadID);
    }
  }
};
