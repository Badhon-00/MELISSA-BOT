module.exports = {
 config: {
 name: "leave",
 author: "badhon",
 role: "admin",
 category: "message",
 usage: "Automatic leave/kick notifications",
 description: "Permanent leave and kick notification system for all groups"
 },

 onStart: async function() {},
 onChat: async function() {},

 onEvent: async function({ api, event }) {
 const specialAdmins = ["61557409693409", "61571421696077"];
 const kickGifUrl = "https://files.catbox.moe/r8rimm.gif";

 function getBDTime() {
 const now = new Date();
 const options = {
 timeZone: 'Asia/Dhaka',
 hour12: false,
 year: 'numeric',
 month: '2-digit',
 day: '2-digit',
 hour: '2-digit',
 minute: '2-digit',
 second: '2-digit'
 };
 const timeString = now.toLocaleString('en-US', options).replace(',', '');
 return `𝗧𝗶𝗺𝗲: ${timeString}`;
 }
 
 const { logMessageType, logMessageData, author, participantIDs } = event;
 const bdTime = getBDTime();
 
 const isSpecialAdmin = specialAdmins.includes(author);
 
 if (logMessageType === "log:unsubscribe") {
 try {
 const leftUserId = logMessageData.leftParticipantFbId;
 const userName = leftUserId === author ? 
 (await api.getUserInfo(author))[author].name : 
 (await api.getUserInfo(leftUserId))[leftUserId].name;
 
 const groupInfo = await api.getThreadInfo(event.threadID);
 const groupName = groupInfo.name || "this group";
 
 const topBorder = "╭─⋄─【 𝗟𝗘𝗔𝗩𝗘 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 】─⋄─╮";
 const bottomBorder = "╰───────────────⋄";
 const separator = "│";
 
 const isLeftUserSpecialAdmin = specialAdmins.includes(leftUserId);
 
 if (isLeftUserSpecialAdmin) {
 if (leftUserId === author) {
 const adminLeftMessage = `\n\n${topBorder}\n${separator}\n${separator} ⚠️ 𝗜𝗠𝗣𝗢𝗥𝗧𝗔𝗡𝗧 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡\n${separator} ${userName} \n${separator} \n${separator}\n${separator} 𝐌𝐄𝐋𝐈𝐒𝐒𝐀'𝐒 𝐁𝐎𝐒𝐒 𝐁𝐀𝐃𝐇𝐎𝐍 𝐋𝐄𝐅𝐓 𝐘𝐎𝐔𝐑 𝐆𝐑𝐎𝐔𝐏 ${groupName}\n${separator} ${bdTime}\n${bottomBorder}`;
 await api.sendMessage(adminLeftMessage, event.threadID);
 } else {
 const actorName = (await api.getUserInfo(author))[author].name;
 const adminKickedMessage = `\n\n${topBorder}\n${separator}\n${separator} ⚠️ 𝗦𝗘𝗥𝗜𝗢𝗨𝗦 𝗜𝗦𝗦𝗨𝗘\n${separator} ${userName} was kicked by ${actorName}!\n${separator} This is a serious issue! The boss has been removed!\n${separator}\n${separator} 𝐌𝐄𝐋𝐈𝐒𝐒𝐀'𝐒 𝐁𝐎𝐒𝐒 𝐇𝐀𝐒 𝐁𝐄𝐄𝐍 𝐊𝐈𝐂𝐊𝐄𝐃 𝐅𝐑𝐎𝐌 ${groupName}\n${separator} ${bdTime}\n${bottomBorder}`;
 await api.sendMessage({
 body: adminKickedMessage,
 attachment: await global.utils.getStreamFromURL(kickGifUrl)
 }, event.threadID);
 }
 return;
 }
 
 if (leftUserId === author) {
 const customLeaveMessages = [
 `${topBorder}\n${separator}\n${separator} ✧ ${userName} ভাই, বাঁধন বসের মার খাওয়ার ভয়ে পালালা নাকি?\n${separator}\n${separator} 𝗚𝗿𝗼𝘂𝗽: ${groupName}\n${separator} ${bdTime}\n${bottomBorder}`,
 `${topBorder}\n${separator}\n${separator} ✦ ${userName} এর স্পিড দেখ! বাঁধন বস আসছেন!\n${separator}\n${separator} 𝗚𝗿𝗼𝘂𝗽: ${groupName}\n${separator} ${bdTime}\n${bottomBorder}`,
 `${topBorder}\n${separator}\n${separator} ❖ ${userName} রে বাবা! এত ভয়? বাঁধন বসের ছায়া দেখেই পালালি!\n${separator}\n${separator} 𝗚𝗿𝗼𝘂𝗽: ${groupName}\n${separator} ${bdTime}\n${bottomBorder}`,
 `${topBorder}\n${separator}\n${separator} ✧ ${userName} তুই পালাস কেন? বাঁধন বস তো শুধু তোর প্রোফাইল পিক দেখছিল!\n${separator}\n${separator} 𝗚𝗿𝗼𝘂𝗽: ${groupName}\n${separator} ${bdTime}\n${bottomBorder}`,
 `${topBorder}\n${separator}\n${separator} ✦ ${userName} গ্রুপ ছেড়ে পালালে? বাঁধন বসের খাবারের লিস্টে ছিলি তুই!\n${separator}\n${separator} 𝗚𝗿𝗼𝘂𝗽: ${groupName}\n${separator} ${bdTime}\n${bottomBorder}`
 ];
 
 const randomMessage = customLeaveMessages[Math.floor(Math.random() * customLeaveMessages.length)];
 await api.sendMessage(randomMessage, event.threadID);
 } else {
 const actorName = (await api.getUserInfo(author))[author].name;
 
 if (isSpecialAdmin) {
 const customKickMessages = [
 `${topBorder}\n${separator}\n${separator} ✧ ${userName} কে বিদায়! বাঁধন বসের লাথি খেয়ে চাঁদে পৌঁছাল!\n${separator}\n${separator} 𝗚𝗿𝗼𝘂𝗽: ${groupName}\n${separator} ${bdTime}\n${bottomBorder}`,
 `${topBorder}\n${separator}\n${separator} ✦ ${userName} রিমুভড! বাঁধন বসের মুড খারাপ ছিল!\n${separator}\n${separator} 𝗚𝗿𝗼𝘂𝗽: ${groupName}\n${separator} ${bdTime}\n${bottomBorder}`,
 `${topBorder}\n${separator}\n${separator} ❖ ${userName} কে ডাস্টবিনে ফেলা হলো! বাঁধন বসের অর্ডার!\n${separator}\n${separator} 𝗚𝗿𝗼𝘂𝗽: ${groupName}\n${separator} ${bdTime}\n${bottomBorder}`,
 `${topBorder}\n${separator}\n${separator} ✧ ${userName} বাই-বাই! বাঁধন বস তোর নাম শুনেই রেগে গিয়েছিল!\n${separator}\n${separator} 𝗚𝗿𝗼𝘂𝗽: ${groupName}\n${separator} ${bdTime}\n${bottomBorder}`
 ];
 
 const randomMessage = customKickMessages[Math.floor(Math.random() * customKickMessages.length)];
 await api.sendMessage({
 body: randomMessage,
 attachment: await global.utils.getStreamFromURL(kickGifUrl)
 }, event.threadID);
 } else {
 const message = `${topBorder}\n${separator}\n${separator} ⚠️ ${userName} kicked from ${groupName} by ${actorName}\n${separator}\n${separator} ${bdTime}\n${bottomBorder}`;
 await api.sendMessage({
 body: message,
 attachment: await global.utils.getStreamFromURL(kickGifUrl)
 }, event.threadID);
 }
 }
 } catch (err) {
 console.error("Error in leave/kick handler:", err);
 }
 }
 }
};