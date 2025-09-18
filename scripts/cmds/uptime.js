const os = require("os");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function formatTime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

function createProgressBar(percentage, length = 8) {
  const filledBars = Math.round((length * percentage) / 100);
  const emptyBars = length - filledBars;
  return "█".repeat(filledBars) + "░".repeat(emptyBars);
}

function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function getCpuModel() {
  const cpus = os.cpus();
  return cpus[0]?.model.split('@')[0] || "Unknown CPU";
}

function getStatusEmoji(value, type = 'percent') {
  if (type === 'ping') {
    return value < 150 ? "🟢" : value < 300 ? "🟡" : "🔴";
  }
  return value >= 75 ? "🟢" : value >= 40 ? "🟡" : "🔴";
}

function getUptimeStatus(uptimeSeconds) {
  const days = uptimeSeconds / (3600 * 24);
  if (days > 7) return "🌟 Excellent";
  if (days > 3) return "✅ Good";
  if (days > 1) return "⚠️ Average";
  return "🔧 Needs Attention";
}

function getRandomFact() {
  const facts = [
    "Did you know? Melissa means 'honey bee' in Greek!",
    "Fun fact: Bees can recognize human faces!",
    "Buzz! Bees communicate through dance!",
    "Honey never spoils - archaeologists found 3000-year-old honey!",
    "Bees have 5 eyes and 6 legs!",
    "A bee's wings beat 200 times per second!",
    "Bees are vital for pollinating 1/3 of our food!",
    "Melissa is also the name of a fragrant herb!"
  ];
  return facts[Math.floor(Math.random() * facts.length)];
}


function getDhakaTime() {
  const options = {
    timeZone: 'Asia/Dhaka',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  
  const dateOptions = {
    timeZone: 'Asia/Dhaka',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', options);
  const date = now.toLocaleDateString('en-US', dateOptions);
  
  return { time, date };
}

module.exports = {
  config: {
    name: "uptime",
    aliases: ["up", "upt", "ut"],
    version: "7.0",
    author: "𝗕𝗔𝗗𝗛𝗢𝗡 𝗥𝗢𝗛𝗠𝗔𝗡",
    role: 0,
    shortDescription: {
      en: "Melissa System Uptime & Performance Stats"
    },
    longDescription: {
      en: "Comprehensive system performance metrics with Melissa-themed design"
    },
    category: "tools",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event, threadsData, usersData }) {
    try {
      const start = Date.now();

      // Get basic system info
      const uptimeInSeconds = process.uptime();
      const formattedUptime = formatTime(uptimeInSeconds);
      const platform = os.platform();
      const arch = os.arch();
      const cpuModel = getCpuModel();
      const cpuCores = os.cpus().length;
      const osType = os.type();
      const osRelease = os.release();
      

      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const usedMemPercent = ((usedMem / totalMem) * 100).toFixed(1);
      const memProgressBar = createProgressBar(usedMemPercent);
      

      const cpuLoad = (os.loadavg()[0] / cpuCores * 100).toFixed(1);
      const cpuProgressBar = createProgressBar(cpuLoad);
      

      const ping = Date.now() - start;
      const pingQuality = ping < 150 ? "Excellent" : ping < 300 ? "Good" : "Slow";
      

      const networkInterfaces = os.networkInterfaces();
      let ipAddress = "Not Available";
      let macAddress = "Not Available";
      
      for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];
        for (const iface of interfaces) {
          if (iface.family === 'IPv4' && !iface.internal) {
            ipAddress = iface.address;
            macAddress = iface.mac || "Not Available";
            break;
          }
        }
        if (ipAddress !== "Not Available") break;
      }
      

      let threadsCount = 0;
      let usersCount = 0;
      let totalMessages = 0;
      
      try {
        const allThreads = await threadsData.getAll();
        threadsCount = allThreads.length;
        usersCount = (await usersData.getAll()).length;
        

        for (const thread of allThreads) {
          if (thread.messageCount) {
            totalMessages += parseInt(thread.messageCount);
          }
        }
      } catch (error) {
        console.log("Could not fetch bot statistics:", error.message);
      }
      

      const dhakaTime = getDhakaTime();
      const uptimeStatus = getUptimeStatus(uptimeInSeconds);
      const randomFact = getRandomFact();
      

      const loadAvg = os.loadavg();
      

      const homedir = os.homedir();
      const username = os.userInfo().username;
      

      const uptimeMessage = `♡ ∩__∩  
   („• ‧̫ •„)   ～
╭ (uu)────────────────⟡
│   🐝 𝐌𝐄𝐋𝐈𝐒𝐒𝐀 𝐔𝐏𝐓𝐈𝐌𝐄 𝐒𝐓𝐀𝐓𝐔𝐒 🐝
├─────────────────────⟡
│ 
│ ⏰ 𝗨𝗽𝘁𝗶𝗺𝗲: ${formattedUptime}
│ 📊 𝗦𝘁𝗮𝘁𝘂𝘀: ${uptimeStatus}
│ 📅 𝗗𝗮𝘁𝗲: ${dhakaTime.date}
│ ⏱️  𝗧𝗶𝗺𝗲: ${dhakaTime.time} 
│ 
├ ✦ 𝐏𝐄𝐑𝐅𝐎𝐑𝐌𝐀𝐍𝐂𝐄 𝐌𝐀𝐓𝐑𝐈𝐗 ✦ ─⟡
│
│   ${getStatusEmoji(ping, 'ping')} 𝗣𝗶𝗻𝗴: ${ping}ms (${pingQuality})
│   ${getStatusEmoji(cpuLoad)} 𝗖𝗣𝗨: ${cpuLoad}% ${cpuProgressBar}
│   ${getStatusEmoji(usedMemPercent)} 𝗥𝗔𝗠: ${usedMemPercent}% ${memProgressBar}
│   📈 𝗟𝗼𝗮𝗱 𝗔𝘃𝗴: ${loadAvg[0].toFixed(2)}, ${loadAvg[1].toFixed(2)}, ${loadAvg[2].toFixed(2)}
│
├─── ✦ 𝐌𝐄𝐌𝐎𝐑𝐘 𝐔𝐒𝐀𝐆𝐄 ✦ ──⟡
│
│   📦 𝗧𝗼𝘁𝗮𝗹: ${formatBytes(totalMem)}
│   💿 𝗨𝘀𝗲𝗱: ${formatBytes(usedMem)}
│   📥 𝗙𝗿𝗲𝗲: ${formatBytes(freeMem)}
│   🔄 𝗖𝗮𝗰𝗵𝗲𝗱: ${formatBytes(usedMem - (totalMem - freeMem))}
│
├──── ✦ 𝐁𝐎𝐓 𝐒𝐓𝐀𝐓𝐒 ✦ ───⟡
│ 
│   👥 𝗧𝗵𝗿𝗲𝗮𝗱𝘀: ${threadsCount}
│   👤 𝗨𝘀𝗲𝗿𝘀: ${usersCount}
│   💬 𝗧𝗼𝘁𝗮𝗹 𝗠𝘀𝗴𝘀: ${totalMessages.toLocaleString()}
│
├──── ✦ 𝐒𝐘𝐒𝐓𝐄𝐌 𝐈𝐍𝐅𝐎 ✦ ───⟡
│
│   🖥️  𝗢𝗦: ${osType} ${osRelease} (${platform}/${arch})
│   🧠 𝗖𝗣𝗨: ${cpuModel} (${cpuCores} cores)
│   🌐 𝗜𝗣: ${ipAddress}
│   🔗 𝗠𝗔𝗖: ${macAddress}
│   👤 𝗨𝘀𝗲𝗿: ${username}
│   📁 𝗛𝗼𝗺𝗲: ${homedir}
│
├───── ✦ 𝐅𝐔𝐍 𝐅𝐀𝐂𝐓 ✦ ────⟡
│
│   ${randomFact}
│
├────────────────────⟡
│
│ ✦ 𝐁𝐀𝐃𝐇𝐎𝐍 𝐑𝐀𝐇𝐌𝐀𝐍 ✦
│ 🐝 𝐌𝐄𝐋𝐈𝐒𝐒𝐀 𝐁𝐎𝐓 𝐕𝟑
╰────────────────────⟡
`;

      await delay(300);
      await api.sendMessage(uptimeMessage, event.threadID);
      
    } catch (err) {
      console.error("Uptime command error:", err);
      return api.sendMessage("❌ Error fetching system data", event.threadID);
    }
  }
};
