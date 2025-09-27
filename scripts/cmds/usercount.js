module.exports = {
 config: {
 name: "usercount",
 aliases: ["users", "uc"],
 version: "4.1",
 author: "BaYjid",
 role: 1,
 shortDescription: "Show total users",
 longDescription: "Show total users with compact stylish box",
 category: "📊 Info",
 guide: {
 en: "📍 Type {pn} to get total users"
 }
 },

 onStart: async function ({ message, usersData }) {
 try {
 const users = await usersData.getAll();
 const total = users.length;
 const time = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });

 const box =
 `╔═════════╗\n` +
 `║ 💎 𝐆𝐎𝐀𝐓𝐁𝐎𝐓 𝐑𝐄𝐏𝐎𝐑𝐓 💎 ║\n` +
 `╠════════╣\n` +
 `║ 👥 𝐓𝐨𝐭𝐚𝐥 𝐔𝐬𝐞𝐫𝐬: 〘 ${total} 〙 ║\n` +
 `║ 🕒 𝐓𝐢𝐦𝐞: ${time} ║\n` +
 `╠═════════╣\n` +
 `║ 👑 𝐁𝐲: 𝐁𝐚𝐘𝐣𝐢𝐝 ║\n` +
 `║ 🧾 𝐂𝐦𝐝: /usercount ║\n` +
 `╚════════╝`;

 message.reply(box);
 } catch (err) {
 console.error("❌ User count error:", err);
 message.reply("🚫 | 𝐄𝐫𝐫𝐨𝐫 𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐮𝐬𝐞𝐫 𝐝𝐚𝐭𝐚.");
 }
 }
};