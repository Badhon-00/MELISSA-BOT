const axios = require("axios");

module.exports = {
  config: {
    name: "badhon",
    version: "1.0",
    author: "💋𝗠𝗢𝗦𝗧𝗔𝗞𝗜𝗠 × 𝗕𝗔𝐃𝐇𝗢𝐍💀",
    countDown: 5,
    role: 0,
    shortDescription: "sarcasm",
    longDescription: "sarcasm",
    category: "reply",
  },
  onStart: async function () {},

  onChat: async function ({ event, message }) {
    const input = event.body?.toLowerCase();
    const triggers = ["badhon", "melisa tmr boss ke", "tmr boss ke", "badhon ke", "tomar boss ke"];

    const replies = [
`𝐌𝐘 𝐎𝐖𝐍𝐄𝐑: 𝐁𝐀𝐃𝐇𝐎𝐍
╔                            ╗  
《 ⚙️ 𝐀𝐃𝐌𝐈𝐍 𝐈𝐍𝐅𝐎 》
╚                            ╝
╔═ ══════════════ ═╗
     🛡️ 𝐁𝐎𝐓 𝐂𝐎𝐍𝐓𝐑𝐎𝐋 🛡️ 
  𝐎𝐏𝐄𝐑𝐀𝐓𝐎𝐑: 𝐁𝐀𝐃𝐇𝐎𝐍 
╚═ ══════════════ ═╝

═《 💬 𝐁𝐎𝐓 𝐈𝐍𝐓𝐑𝐎 💬 》═

✨𝗜 𝗔𝗠 𝗬𝗢𝗨𝗥 𝗙𝗔𝗩𝗢𝗨𝗥𝗜𝗧𝗘 𝗠𝗘𝗦𝗦𝗘𝗡𝗚𝗘𝗥 𝗖𝗛𝗔𝗧𝗕𝗢𝗧✨  

💙𝗠𝗬 𝗡𝗔𝗠𝗘 𝗜𝗦💙
— ღ´🦋𝗠𝗲𝗹𝗶𝘀𝗮🍒🥂

👑 𝐌𝐘 𝐎𝐖𝐍𝐄𝐑: 𝐁𝐀𝐃𝐇𝐎𝐍
📡 𝐎𝐧𝐥𝐢𝐧𝐞: ✅  𝐎𝐍𝐋𝐈𝐍𝐄
📛 𝐁𝐨𝐭 𝐍𝐚𝐦𝐞: ღ´🦋𝗠𝗲𝗹𝗶𝘀𝗮🍒🥂
🔖 𝐕𝐞𝐫𝐬𝐢𝐨𝐧: 1.0.0  
➤ 𝐏𝐫𝐞𝐟𝐢𝐱: ^  

📘 COMMANDS: 148 
🔐 ADMINS ONLINE: ∞ 
🌍 USERS: ∞

👑 𝐀𝐝𝐦𝐢𝐧 𝐍𝐚𝐦𝐞: 𝐁𝐀𝐃𝐇𝐎𝐍
🕌 𝐑𝐄𝐋𝐈𝐆𝐈𝐎𝐍: 𝐌𝐔𝐒𝐋𝐈𝐌
🎓 𝐒𝐓𝐔𝐃𝐘: 𝐂𝐋𝐀𝐒𝐒 10
🇧🇩 𝐍𝐀𝐓𝐈𝐎𝐍𝐀𝐋𝐈𝐓𝐘: 𝐁𝐀𝐍𝐆𝐋𝐀𝐃𝐄𝐒𝐇𝐈
🏠 𝐀𝐃𝐃𝐑𝐄𝐒𝐒: 𝐒𝐈𝐃𝐃𝐇𝐈𝐑𝐆𝐀𝐍𝐉, 𝐍𝐀𝐑𝐀𝐘𝐀𝐍𝐆𝐀𝐍𝐉

📎 𝐒𝐎𝐂𝐈𝐀𝐋𝐒 & 𝐂𝐎𝐍𝐓𝐀𝐂𝐓𝐒:
📸 IG: 𝐒𝐂𝐘𝐋4_𝐒𝐌0𝐊3
📘 FB: 𝐁𝐀𝐃𝐇𝐎𝐍 𝐄𝐗𝐈𝐒𝐓 / 𝐑𝐎𝐇𝐌𝐀𝐍 𝐒𝐇𝐀𝐍𝐓𝐎
📨 TG: +8801533048946
▶️ YT: 𝐁𝐑𝐒 𝐘𝐓
🎮 Discord: 𝐒𝐌𝐎𝐊𝐄𝐘𝐘𝐘_𝐁𝐀𝐃𝐇𝐎𝐍
📧 Email: SMOKEYYYBADHON1@GMAIL.COM
📱 Phone/WhatsApp: +8801533048946

📅 LAST RESTART: 2025-04-25
🌐 SERVER ID: #83472`
    ];

    if (triggers.includes(input)) {
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const fileUrl = "https://drive.google.com/uc?export=download&id=1Chgk8FX12BF4lgsPFCmh053qJqXOw4CN";

      try {
        const response = await axios.get(fileUrl, { responseType: "stream" });
        return message.reply({
          body: randomReply,
          attachment: response.data
        });
      } catch (err) {
        return message.reply(randomReply + "\n\n(Attachment failed to load)");
      }
    }
  }
};
