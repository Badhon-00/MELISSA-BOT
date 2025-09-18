const os = require('os');
const process = require('process');

module.exports = {
  config: {
    name: 'rtm',
    aliases: ['stats', 'status', 'system', 'rtm', 'info'],
    version: '3.0',
    usePrefix: true,
    author: 'BADHON',
    countDown: 15,
    role: 0,
    shortDescription: 'Display comprehensive system stats',
    longDescription: 'Shows detailed bot statistics and system hardware information',
    category: 'system',
    guide: '{pn}'
  },

  onStart: async function ({ message, event, usersData, threadsData, api }) {
    if (this.config.author !== 'BADHON') {
      return message.reply("⚠ Unauthorized command modification detected.");
    }

    const startTime = Date.now();
    try {
      const allUsers = await usersData.getAll();
      const allThreads = await threadsData.getAll();
      
      const uptime = process.uptime();
      const days = Math.floor(uptime / 86400);
      const hours = Math.floor((uptime % 86400) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      
      const bangladeshTime = this.getBangladeshTime();      
      const systemUptime = this.formatUptime(os.uptime());
      
      const memoryUsage = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
      const totalMemGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
      const freeMemGB = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
      const usedMemGB = (totalMemGB - freeMemGB).toFixed(2);
      const memoryUsagePercent = ((1 - (os.freemem() / os.totalmem())) * 100).toFixed(2);
      
      const ramLoad = ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2);
      
      const cpus = os.cpus();
      const cpuCores = cpus.length;
      const cpuThreads = cpuCores;
      const cpuModel = cpuCores > 0 ? cpus[0].model.split('@')[0].trim() : 'Unknown';
      const cpuSpeed = cpuCores > 0 ? (cpus[0].speed / 1000).toFixed(2) + ' GHz' : 'Unknown';
      
      const loadavg = os.loadavg();
      const cpuLoad1min = (loadavg[0] * 100 / cpuCores).toFixed(2);
      const cpuLoad5min = (loadavg[1] * 100 / cpuCores).toFixed(2);
      const cpuLoad15min = (loadavg[2] * 100 / cpuCores).toFixed(2);
      
      const arch = os.arch();
      const platform = os.platform();
      const release = os.release();
      const hostname = os.hostname();
      const nodeVersion = process.version;
      const v8Version = process.versions.v8;
      
      const pid = process.pid;
      const ppid = process.ppid;
      const uptimeProcess = (process.uptime() / 60).toFixed(2);
      
      const networks = os.networkInterfaces();
      const networkInfo = [];
      for (const [name, interfaces] of Object.entries(networks)) {
        for (const iface of interfaces) {
          if (!iface.internal && iface.family === 'IPv4') {
            networkInfo.push(`📡 ${name}: ${iface.address}`);
          }
        }
      }

      const totalStorage = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
      const freeStorage = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
      const storageUsage = ((totalStorage - freeStorage) / totalStorage * 100).toFixed(2);

      const totalMessages = allUsers.reduce((sum, user) => sum + (user.messageCount || 0), 0);
      const threadData = await threadsData.get(event.threadID);
      const mediaBan = threadData ? (threadData.mediaBan || false) : false;
      const botPing = Date.now() - startTime;

      const statsMessage = `
✨🦋✨ ─《 MELISSA V3 STAT 》─ ✨🦋✨

🏮 TIME INFO
───────────────────────────
📅 𝗗𝗮𝘁𝗲: ${bangladeshTime.date}
⏰ 𝗧𝗶𝗺𝗲: ${bangladeshTime.time} 
📆 𝗗𝗮𝘆: ${bangladeshTime.day}
🌍 𝗧𝗶𝗺𝗲𝘇𝗼𝗻𝗲: ${bangladeshTime.timezone}

⏱️ 𝗨𝗣𝗧𝗜𝗠𝗘 𝗦𝗧𝗔𝗧𝗨𝗦
───────────────────────────
🤖 𝗕𝗼𝘁 𝗨𝗽𝘁𝗶𝗺𝗲: ${days}d ${hours}h ${minutes}m ${seconds}s
🖥️ 𝗦𝘆𝘀𝘁𝗲𝗺 𝗨𝗽𝘁𝗶𝗺𝗲: ${systemUptime}

🤖 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡
───────────────────────────
👑 𝗔𝗱𝗺𝗶𝗻: 𝗕𝗔𝗗𝗛𝗢𝗡
🎀 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲: ღ´🦋𝗠𝗲𝗹𝗶𝘀𝘀𝗮🍒🥂
⚡ 𝗣𝗿𝗲𝗳𝗶𝘅: ${this.config.usePrefix ? '✅ Enabled' : '❌ Disabled'}
📦 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: 𝘃${this.config.version}
🏓 𝗣𝗶𝗻𝗴: ${botPing}𝗺𝘀

👥 𝗨𝗦𝗘𝗥 𝗦𝗧𝗔𝗧𝗜𝗦𝗧𝗜𝗖𝗦
───────────────────────────
👤 𝗧𝗼𝘁𝗮𝗹 𝗨𝘀𝗲𝗿𝘀: 𝗫 ${allUsers.length.toLocaleString()}
👥 𝗧𝗼𝘁𝗮𝗹 𝗚𝗿𝗼𝘂𝗽𝘀: 𝗫 ${allThreads.length.toLocaleString()}
💬 𝗠𝗲𝘀𝘀𝗮𝗴𝗲𝘀: 𝗫 ${totalMessages.toLocaleString()}
📸 𝗠𝗲𝗱𝗶𝗮 𝗦𝘁𝗮𝘁𝘂𝘀: ${mediaBan ? '🚫 𝗕𝗮𝗻𝗻𝗲𝗱' : '✅ 𝗔𝗹𝗹𝗼𝘄𝗲𝗱'}

💾 𝗠𝗘𝗠𝗢𝗥𝗬 𝗨𝗦𝗔𝗚𝗘
───────────────────────────
📊 𝗥𝗔𝗠 𝗧𝗼𝘁𝗮𝗹: ${totalMemGB} 𝗚𝗕
🔺 𝗥𝗔𝗠 𝗨𝘀𝗲𝗱: ${usedMemGB} 𝗚𝗕
🔻 𝗥𝗔𝗠 𝗙𝗿𝗲𝗲: ${freeMemGB} 𝗚𝗕
📈 𝗨𝘀𝗮𝗴𝗲: ${memoryUsagePercent}%
⚡ 𝗟𝗼𝗮𝗱: ${ramLoad}%
💻 𝗣𝗿𝗼𝗰𝗲𝘀𝘀 𝗠𝗲𝗺𝗼𝗿𝘆: ${memoryUsage} 𝗠𝗕

⚡ 𝗣𝗥𝗢𝗖𝗘𝗦𝗦𝗢𝗥 𝗜𝗡𝗙𝗢
───────────────────────────
🔧 𝗠𝗼𝗱𝗲𝗹: ${cpuModel}
🎯 𝗖𝗼𝗿𝗲𝘀: ${cpuCores} 𝗰𝗼𝗿𝗲𝘀
🧵 𝗧𝗵𝗿𝗲𝗮𝗱𝘀: ${cpuThreads} 𝘁𝗵𝗿𝗲𝗮𝗱𝘀
🚀 𝗦𝗽𝗲𝗲𝗱: ${cpuSpeed}
📊 𝗟𝗼𝗮𝗱: ${cpuLoad1min}% (𝟭𝗺) | ${cpuLoad5min}% (𝟱𝗺) | ${cpuLoad15min}% (𝟭𝟱𝗺)

🖥️ 𝗦𝗬𝗦𝗧𝗘𝗠 𝗔𝗥𝗖𝗛𝗜𝗧𝗘𝗖𝗧𝗨𝗥𝗘
───────────────────────────
🏗️ 𝗔𝗿𝗰𝗵𝗶𝘁𝗲𝗰𝘁𝘂𝗿𝗲: ${arch}
🖥️ 𝗣𝗹𝗮𝘁𝗳𝗼𝗿𝗺: ${platform}
🔖 𝗢𝗦 𝗥𝗲𝗹𝗲𝗮𝘀𝗲: ${release}
🏠 𝗛𝗼𝘀𝘁𝗻𝗮𝗺𝗲: ${hostname}
🔢 𝗣𝗜�𝗗: ${pid}
🔗 𝗣𝗮𝗿𝗲𝗻𝘁 𝗣𝗜𝗗: ${ppid}
⏱️ 𝗣𝗿𝗼𝗰𝗲𝘀𝘀 𝗨𝗽𝘁𝗶𝗺𝗲: ${uptimeProcess} 𝗺𝗶𝗻𝘀

📦 𝗦𝗢𝗙𝗧𝗪𝗔𝗥𝗘 𝗩𝗘𝗥𝗦𝗜𝗢𝗡𝗦
───────────────────────────
🟢 𝗡𝗼𝗱𝗲.𝗷𝘀: ${nodeVersion}
🔵 𝗩𝟴 𝗘𝗻𝗴𝗶𝗻𝗲: ${v8Version}

💿 𝗦𝗧𝗢𝗥𝗔𝗚𝗘 𝗜𝗡𝗙𝗢
───────────────────────────
💾 𝗧𝗼𝘁𝗮𝗹: ${totalStorage} 𝗚𝗕
🆓 𝗙𝗿𝗲𝗲: ${freeStorage} 𝗚𝗕
📊 𝗨𝘀𝗮𝗴𝗲: ${storageUsage}%

🌐 𝗡𝗘𝗧𝗪𝗢𝗥𝗞 𝗜𝗡𝗧𝗘𝗥𝗙𝗔𝗖𝗘𝗦
───────────────────────────
${networkInfo.length > 0 ? networkInfo.map(i => `${i}`).join('\n') : '📡 𝗡𝗼 𝗻𝗲𝘁𝘄𝗼𝗿𝗸 𝗶𝗻𝘁𝗲𝗿𝗳𝗮𝗰𝗲𝘀 𝗳𝗼𝘂𝗻𝗱'}

───────────────────────────
${totalMessages === 0 ? '🎯 𝗦𝘆𝘀𝘁𝗲𝗺 𝗥𝗲𝗮𝗱𝘆 - 𝗪𝗮𝗶𝘁𝗶𝗻𝗴 𝗳𝗼𝗿 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀!' : '⚡ 𝗠𝗲𝗹𝗶𝘀𝘀𝗮 𝗢𝗽𝗲𝗿𝗮𝘁𝗶𝗻𝗴 𝗮𝘁 𝗣𝗲𝗮𝗸 𝗣𝗲𝗿𝗳𝗼𝗿𝗺𝗮𝗻𝗰𝗲!'}
───────────────────────────
✨🦋✨ ── 《 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗩𝟯 》 ── ✨🦋✨
      `.trim();

      await message.reply(statsMessage);

    } catch (err) {
      console.error('Error in rtm command:', err);
      await message.reply("❌ Error fetching statistics. Please try again later.");
    }
  },

  getBangladeshTime: function() {
    try {

      const now = new Date();
      

      const bangladeshOffset = 6 * 60; 
      const localOffset = now.getTimezoneOffset();
      const bangladeshTime = new Date(now.getTime() + (localOffset + bangladeshOffset) * 60000);
      

      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      const date = `${bangladeshTime.getDate()} ${months[bangladeshTime.getMonth()]} ${bangladeshTime.getFullYear()}`;
      
   
      let hours = bangladeshTime.getHours();
      const minutes = bangladeshTime.getMinutes().toString().padStart(2, '0');
      const seconds = bangladeshTime.getSeconds().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      hours = hours % 12;
      hours = hours ? hours : 12; 
      const time = `${hours}:${minutes}:${seconds} ${ampm}`;
      

      const day = days[bangladeshTime.getDay()];
      
      return {
        date: date,
        time: time,
        day: day,
        timezone: 'Asia/Dhaka (UTC+6)',
        timestamp: bangladeshTime.getTime()
      };
    } catch (error) {
      console.error('Error getting Bangladesh time:', error);

      const now = new Date();
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      const date = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
      
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      hours = hours % 12;
      hours = hours ? hours : 12;
      const time = `${hours}:${minutes}:${seconds} ${ampm}`;
      
      const day = days[now.getDay()];
      
      return {
        date: date,
        time: time,
        day: day,
        timezone: 'Asia/Dhaka (UTC+6)',
        timestamp: now.getTime()
      };
    }
  },

  formatUptime: function(uptime) {
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
};
