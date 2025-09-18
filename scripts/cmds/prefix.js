const fs = require("fs-extra");
const { utils } = global;

module.exports = {
	config: {
		name: "prefix",
		version: "1.6",
		author: "🔰 BADHON 🔰",
		countDown: 5,
		role: 0,
		description: "✨ Customize bot prefix for your chat or system-wide",
		category: "⚙️ Configuration",
		guide: {
			en: 
				`✧ 𝗖 𝗢 𝗠 𝗠 𝗔 𝗡 𝗗 𝗦 ✧

  ╭─⋄─【 𝗣𝗥𝗘𝗙𝗜𝗫 𝗠𝗘𝗡𝗨 】─⋄─╮
  │
  │ ✦ 𝗖𝗵𝗮𝗻𝗴𝗲 𝗽𝗿𝗲𝗳𝗶𝘅 𝗳𝗼𝗿 𝘆𝗼𝘂𝗿 𝗰𝗵𝗮𝘁:
  │   ➤ {pn} <new prefix>
  │
  │ ✦ 𝗘𝘅𝗮𝗺𝗽𝗹𝗲:
  │   ➤ {pn} #
  │
  │ ✦ 𝗖𝗵𝗮𝗻𝗴𝗲 𝗽𝗿𝗲𝗳𝗶𝘅 𝗳𝗼𝗿 𝗮𝗹𝗹 𝗰𝗵𝗮𝘁𝘀 (𝗔𝗱𝗺𝗶𝗻 𝗼𝗻𝗹𝘆):
  │   ➤ {pn} <new prefix> -g
  │
  │ ✦ 𝗘𝘅𝗮𝗺𝗽𝗹𝗲:
  │   ➤ {pn} # -g
  │
  │ ✦ 𝗥𝗲𝘀𝗲𝘁 𝘆𝗼𝘂𝗿 𝗰𝗵𝗮𝘁 𝗽𝗿𝗲𝗳𝗶𝘅:
  │   ➤ {pn} reset
  │
  ╰───────────────⋄`
		}
	},

	langs: {
		en: {
			reset: 
				`✧ 𝗦 𝗨 𝗖 𝗖 𝗘 𝗦 𝗦 ✧

  ╭─⋄─【 𝗣𝗥𝗘𝗙𝗜𝗫 𝗥𝗘𝗦𝗘𝗧 】─⋄─╮
  │
  │ ✅ 𝗬𝗼𝘂𝗿 𝗽𝗿𝗲𝗳𝗶𝘅 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝗿𝗲𝘀𝗲𝘁 𝘁𝗼: %1
  │
  ╰────────────────⋄`,
			onlyAdmin: 
				`✧ 𝗘 𝗥 𝗥 𝗢 𝗥 ✧

  ╭─⋄─【 𝗣𝗘𝗥𝗠𝗜𝗦𝗦𝗜𝗢𝗡 】─⋄─╮
  │
  │ ⚠️ 𝗦𝘆𝘀𝘁𝗲𝗺 𝗽𝗿𝗲𝗳𝗶𝘅 𝗰𝗮𝗻 𝗼𝗻𝗹𝘆 𝗯𝗲 𝗰𝗵𝗮𝗻𝗴𝗲𝗱 𝗯𝘆 𝗔𝗗𝗠𝗜𝗡𝗜𝗦𝗧𝗥𝗔𝗧𝗢𝗥
  │
  ╰────────────────⋄`,
			confirmGlobal: 
				`✧ 𝗖 𝗢 𝗡 𝗙 𝗜 𝗥 𝗠 ✧

  ╭─⋄─【 𝗦𝗬𝗦𝗧𝗘𝗠 𝗣𝗥𝗘𝗙𝗜𝗫 】─⋄─╮
  │
  │ 🔄 𝗥𝗲𝗮𝗰𝘁 𝘁𝗼 𝘁𝗵𝗶𝘀 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝘁𝗼 𝗰𝗼𝗻𝗳𝗶𝗿𝗺 𝘀𝘆𝘀𝘁𝗲𝗺-𝘄𝗶𝗱𝗲 𝗽𝗿𝗲𝗳𝗶𝘅 𝗰𝗵𝗮𝗻𝗴𝗲
  │
  ╰────────────────⋄`,
			confirmThisThread: 
				`✧ 𝗖 𝗢 𝗡 𝗙 𝗜 𝗥 𝗠 ✧

  ╭─⋄─【 𝗖𝗛𝗔𝗧 𝗣𝗥𝗘𝗙𝗜𝗫 】─⋄─╮
  │
  │ 🔄 𝗥𝗲𝗮𝗰𝘁 𝘁𝗼 𝘁𝗵𝗶𝘀 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝘁𝗼 𝗰𝗼𝗻𝗳𝗶𝗿𝗺 𝗰𝗵𝗮𝘁 𝗽𝗿𝗲𝗳𝗶𝘅 𝗰𝗵𝗮𝗻𝗴𝗲
  │
  ╰────────────────⋄`,
			successGlobal: 
				`✧ 𝗦 𝗨 𝗖 𝗖 𝗘 𝗦 𝗦 ✧

  ╭─⋄─【 𝗦𝗬𝗦𝗧𝗘𝗠 𝗣𝗥𝗘𝗙𝗜𝗫 】─⋄─╮
  │
  │ ✅ 𝗦𝘆𝘀𝘁𝗲𝗺 𝗽𝗿𝗲𝗳𝗶𝘅 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝘂𝗽𝗱𝗮𝘁𝗲𝗱 𝘁𝗼: %1
  │
  ╰────────────────⋄`,
			successThisThread: 
				`✧ 𝗦 𝗨 𝗖 𝗖 𝗘 𝗦 𝗦 ✧

  ╭─⋄─【 𝗖𝗛𝗔𝗧 𝗣𝗥𝗘𝗙𝗜𝗫 】─⋄─╮
  │
  │ ✅ 𝗖𝗵𝗮𝘁 𝗽𝗿𝗲𝗳𝗶𝘅 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝘂𝗽𝗱𝗮𝘁𝗲𝗱 𝘁𝗼: %1
  │
  ╰────────────────⋄`,
			myPrefix: 
				`✧ 𝗣 𝗥 𝗘 𝗙 𝗜 𝗫 ✧

  ╭─⋄─【 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡 】─⋄─╮
  │
  │ ✦ 𝗦𝘆𝘀𝘁𝗲𝗺 𝗣𝗿𝗲𝗳𝗶𝘅: 「 %1 」
  │ ✦ 𝗖𝗵𝗮𝘁 𝗣𝗿𝗲𝗳𝗶𝘅: 「 %2 」
  │ ✦ 𝗦𝗲𝗿𝘃𝗲𝗿 𝗧𝗶𝗺𝗲: 「 %3 」
  │
  │ ✦ 𝗧𝘆𝗽𝗲 %2𝗵𝗲𝗹𝗽 𝘁𝗼 𝘃𝗶𝗲𝘄 𝗮𝗹𝗹 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀
  │
  ╰────────────────⋄
  
  [ 🍁 𝗕𝗼𝘁 𝗣𝗿𝗲𝗳𝗶𝘅 𝗠𝗲𝗻𝘂 🍁 ]`
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
		if (!args[0]) {
			const serverTime = new Date().toLocaleString("en-US", { 
				timeZone: "Asia/Dhaka",
				hour: '2-digit',
				minute: '2-digit',
				hour12: true
			});
			return message.reply({
				body: getLang("myPrefix", 
					global.GoatBot.config.prefix, 
					utils.getPrefix(event.threadID), 
					serverTime
				),
				attachment: await global.utils.getStreamFromURL("https://files.catbox.moe/l0d6dc.png")
			});
		}

		if (args[0] === "reset") {
			await threadsData.set(event.threadID, null, "data.prefix");
			return message.reply(getLang("reset", global.GoatBot.config.prefix));
		}

		const newPrefix = args[0];
		const formSet = {
			commandName,
			author: event.senderID,
			newPrefix,
			setGlobal: args[1] === "-g"
		};

		if (formSet.setGlobal && role < 2) {
			return message.reply(getLang("onlyAdmin"));
		}

		const confirmMessage = formSet.setGlobal ? getLang("confirmGlobal") : getLang("confirmThisThread");
		return message.reply(confirmMessage, (err, info) => {
			formSet.messageID = info.messageID;
			global.GoatBot.onReaction.set(info.messageID, formSet);
		});
	},

	onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
		const { author, newPrefix, setGlobal } = Reaction;
		if (event.userID !== author) return;

		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			return message.reply(getLang("successGlobal", newPrefix));
		}

		await threadsData.set(event.threadID, newPrefix, "data.prefix");
		return message.reply(getLang("successThisThread", newPrefix));
	},

	onChat: async function ({ event, message, getLang }) {
		if (event.body && event.body.toLowerCase() === "prefix") {
			const serverTime = new Date().toLocaleString("en-US", { 
				timeZone: "Asia/Dhaka",
				hour: '2-digit',
				minute: '2-digit',
				hour12: true
			});
			return message.reply({
				body: getLang("myPrefix", 
					global.GoatBot.config.prefix, 
					utils.getPrefix(event.threadID), 
					serverTime
				),
				attachment: await global.utils.getStreamFromURL("https://files.catbox.moe/l0d6dc.png")
			});
		}
	}
};
