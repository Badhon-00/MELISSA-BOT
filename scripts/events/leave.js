const { getTime, drive } = global.utils;

module.exports = {
    config: {
        name: "leave",
        version: "2.0",
        author: "NTKhang",
        category: "events",
        description: "Sends a stylish notification when someone leaves the group"
    },

    langs: {
        vi: {
            session1: "sáng",
            session2: "trưa",
            session3: "chiều",
            session4: "tối",
            leaveType1: "tự rời",
            leaveType2: "bị kick",
            defaultLeaveMessage: "{userName} đã {type} khỏi nhóm"
        },
        en: {
            session1: "morning",
            session2: "noon",
            session3: "afternoon",
            session4: "evening",
            leaveType1: "left",
            leaveType2: "was kicked from",
            defaultLeaveMessage: "➤ {userName} has {type} the group",
            funnyMessages: [
                "🚪 {userName} sneaked out! Wife called maybe? 😜",
                "🚨 ALERT! {userName} escaped! 🏃‍♂️",
                "👋 Bye {userName}! We'll upgrade now! 😏",
                "😢 {userName} left! Our group bully is gone!",
                "💔 {userName} betrayed us! Never trusting again!",
                "👑 Badhon boss kicked {userName} with his royal lathi! 😂",
                "👢 {userName} got the boot from Badhon boss!",
                "☢️ {userName} was too toxic - Badhon boss removed them!",
                "🔥 {userName} couldn't handle the heat!"
            ]
        },
        bn: {
            session1: "সকাল",
            session2: "দুপুর",
            session3: "বিকাল",
            session4: "রাত",
            leaveType1: "চলে গেল",
            leaveType2: "কেkick দেওয়া হলো",
            defaultLeaveMessage: "➤ {userName} গ্রুপ {type} 😂",
            funnyMessages: [
                "🚪 {userName} পালালো! বউ ডাক দিয়েছে নাকি? 😜",
                "🏃‍♂️ ওরে {userName} পালাইছে! ধররে!",
                "👋 {userName} চলে গেল! এখন কাকে পিটাবো? 😈",
                "😢 {userName} ভাই, ফিরে আসো!",
                "💔 {userName} বিশ্বাসঘাতক!",
                "👑 বাঁধন বস লাথি মেরে {userName} কে বের করে দিল! 😂",
                "🦵 {userName} রে বাঁধন বসের লাথি খাইয়া উধাও!",
                "☢️ {userName} বেশি টক্সিক হয়ে গেছিল!",
                "🔥 {userName} পারলোনা, তাই পালালো!"
            ]
        }
    },

    onStart: async function(params) {
        try {
            const { threadsData, message, event, api, usersData, getLang } = params;

            if (event.logMessageType !== "log:unsubscribe") return;

            const threadID = event.threadID;
            const threadData = await threadsData.get(threadID);
            if (!threadData.settings || !threadData.settings.sendLeaveMessage) return;

            const leftParticipantFbId = event.logMessageData.leftParticipantFbId;
            if (leftParticipantFbId === api.getCurrentUserID()) return;

            const hours = getTime("HH");
            const threadName = threadData.threadName;
            const userName = await usersData.getName(leftParticipantFbId);
            const isSelfLeave = leftParticipantFbId === event.author;
            const leaveType = getLang(isSelfLeave ? "leaveType1" : "leaveType2");

            // Get message content
            let leaveMessage;
            const funnyMessages = getLang("funnyMessages");

            if (Array.isArray(funnyMessages)) {
                leaveMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
            } else {
                leaveMessage = threadData.data.leaveMessage || getLang("defaultLeaveMessage");
            }

            // Ensure leaveMessage is a string
            if (typeof leaveMessage !== "string") {
                leaveMessage = getLang("defaultLeaveMessage");
            }

            // Get session time
            let session;
            if (hours <= 10) session = getLang("session1");
            else if (hours <= 12) session = getLang("session2");
            else if (hours <= 18) session = getLang("session3");
            else session = getLang("session4");

            // Format the message
            const formattedMessage = `
━━━━━━━━━━━━━━━
  ✧ GROUP NOTIFICATION ✧
━━━━━━━━━━━━━━━

${leaveMessage
    .replace(/\{userName\}/g, userName)
    .replace(/\{type\}/g, leaveType)
    .replace(/\{threadName\}/g, threadName)
    .replace(/\{boxName\}/g, threadName)
    .replace(/\{time\}/g, hours)
    .replace(/\{session\}/g, session)}

━━━━━━━━━━━━━━━
⏰ Time: ${hours}:00 ${hours <= 12 ? getLang("session2") : getLang("session4")}
━━━━━━━━━━━━━━━
            `;

            // Prepare message form
            const form = {
                body: formattedMessage,
                mentions: [{
                    id: leftParticipantFbId,
                    tag: userName
                }]
            };

            // Add attachments if available
            if (threadData.data.leaveAttachment) {
                const files = threadData.data.leaveAttachment;
                const attachments = await Promise.all(
                    files.map(file => drive.getFile(file, "stream").catch(() => null))
                );
                form.attachment = attachments.filter(attachment => attachment !== null);
            }

            // Send the message
            await message.send(form);
        } catch (err) {
            console.error("Error in leave event handler:", err);
        }
    }
};
