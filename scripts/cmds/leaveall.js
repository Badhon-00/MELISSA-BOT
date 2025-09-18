module.exports = {
    config: {
        name: "kickall",
        aliases: ["leaveall", "botoutall", "outall"],
        version: "2.0",
        author: "✦ BADHON ✦",
        countDown: 5,
        role: 2, // Only bot admin can use this command
        shortDescription: "Make bot leave all groups",
        longDescription: "Make the bot leave all groups it's currently in (works with both prefix and no-prefix)",
        category: "owner",
        guide: {
            en: "{pn} or just 'kickall' or 'outall'"
        }
    },

    onStart: async function ({ message, event, api, args }) {
        if (args[0]?.toLowerCase() === "help") {
            return showHelp(message);
        }
        await handleKickAll({ message, event, api, args });
    },

    onChat: async function ({ event, message, api }) {
        // Handle no-prefix command
        const command = event.body && event.body.toLowerCase();
        if (command === "kickall" || command === "outall") {
            if (command.includes("help")) {
                return showHelp(message);
            }
            await handleKickAll({ message, event, api });
        }
    }
};

async function showHelp(message) {
    const helpMessage = `
╭───「 KICKALL COMMAND HELP 」───⦿
│ 
│ ✦ Command Name: kickall
│ ✦ Author: BADHON
│ ✦ Version: 2.0
│ ✦ User Role: Bot Admin Only (2)
│ ✦ Category: Owner
│ 
│ ✦ Aliases: 
│   → leaveall
│   → botoutall
│   → outall
│ 
│ ✦ Description: 
│   Makes the bot leave all groups it's currently in
│ 
│ ✦ Usage:
│   → With prefix: [prefix]kickall
│   → Without prefix: just type "kickall" or "outall"
│ 
│ ✦ Confirmation:
│   The command requires confirmation before executing
│ 
╰───────────────────────────────⦿
`;
    await message.reply(helpMessage);
}

async function handleKickAll({ message, event, api, args }) {
    try {
        // Get all thread lists the bot is in
        const list = await api.getThreadList(100, null, ["INBOX"]);
        
        // Filter out only group threads (not personal messages)
        const groups = list.filter(thread => thread.isGroup);
        
        if (groups.length === 0) {
            return message.reply("🤖 The bot is not in any groups currently.");
        }

        // Check if confirmation is already in args
        if (args[0]?.toLowerCase() === "confirm") {
            return processGroupLeaving({ message, groups, api });
        }

        // Send confirmation message
        const replyMsg = await message.reply(`⚠️ The bot will leave ${groups.length} groups. Please confirm by typing "${event.body.toLowerCase().startsWith(global.GoatBot.config.prefix) ? global.GoatBot.config.prefix : ''}kickall confirm" or "outall confirm" within 30 seconds.`);

        // Wait for confirmation
        global.GoatBot.onReply.set(replyMsg.messageID, {
            commandName: "kickall",
            author: event.senderID,
            messageID: replyMsg.messageID,
            groups: groups
        });

        // Set timeout to auto-delete the confirmation request
        setTimeout(() => {
            global.GoatBot.onReply.delete(replyMsg.messageID);
            api.unsendMessage(replyMsg.messageID);
        }, 30000);

    } catch (error) {
        console.error(error);
        message.reply("❌ An error occurred while processing the command.");
    }
}

async function processGroupLeaving({ message, groups, api }) {
    try {
        let leftCount = 0;
        let failedCount = 0;
        
        // Send initial processing message
        const processingMsg = await message.reply(`🚀 Starting to leave ${groups.length} groups...`);
        
        // Process each group
        for (const group of groups) {
            try {
                await api.removeUserFromGroup(api.getCurrentUserID(), group.threadID);
                leftCount++;
                
                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`Failed to leave group ${group.threadID}:`, error);
                failedCount++;
            }
        }
        
        // Unsend the processing message
        await api.unsendMessage(processingMsg.messageID);
        
        // Send final report
        await message.reply(
            `✅ Bot has left ${leftCount} groups successfully.\n` +
            (failedCount > 0 ? `❌ Failed to leave ${failedCount} groups.` : "")
        );
    } catch (error) {
        console.error(error);
        message.reply("❌ An error occurred while leaving groups.");
    }
}
