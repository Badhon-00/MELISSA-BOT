const axios = require("axios");
module.exports.config = {
  'name': "cmdstore",
  'aliases': ['cs', "cmds"],
  'author': "ArYAN",
  'role': 0x0,
  'version': "0.0.1",
  'description': {
    'en': "use the cmdstore for goatbot"
  },
  'countDown': 0x3,
  'category': "public",
  'guide': {
    'en': "{pn} [command name | single character | page number]"
  }
};
module.exports.onStart = async function ({
  api: _0x271b0d,
  event: _0x4e7a72,
  args: _0x1b93f6
}) {
  const _0x19bc44 = _0x1b93f6.join(" ").trim().toLowerCase();
  try {
    const _0x20d4b6 = await axios.get("https://raw.githubusercontent.com/ROMADAN-MUBAKAK/Apis/refs/heads/main/CMDSRUL.json");
    let _0x197ad4 = _0x20d4b6.data.cmdName;
    let _0x14aaeb = _0x197ad4;
    let _0x4361c2 = 0x1;
    if (_0x19bc44) {
      if (!isNaN(_0x19bc44)) {
        _0x4361c2 = parseInt(_0x19bc44);
      } else {
        if (_0x19bc44.length === 0x1) {
          _0x14aaeb = _0x197ad4.filter(_0x511544 => _0x511544.cmd.startsWith(_0x19bc44));
          if (_0x14aaeb.length === 0x0) {
            return _0x271b0d.sendMessage("〖 𝗖𝗠𝗗 𝗦𝗧𝗢𝗥𝗘 〗\n━━━━━━━━━━━━━━━\n⚠️ No commands found starting with \"" + _0x19bc44 + "\".", _0x4e7a72.threadID, _0x4e7a72.messageID);
          }
        } else {
          _0x14aaeb = _0x197ad4.filter(_0x3dc663 => _0x3dc663.cmd.includes(_0x19bc44));
          if (_0x14aaeb.length === 0x0) {
            return _0x271b0d.sendMessage("〖 𝗖𝗠𝗗 𝗦𝗧𝗢𝗥𝗘 〗\n━━━━━━━━━━━━━━━\n⚠️You cannot find this command \"" + _0x19bc44 + "\" not found.", _0x4e7a72.threadID, _0x4e7a72.messageID);
          }
        }
      }
    }
    const _0x3ce8d9 = Math.ceil(_0x14aaeb.length / 0x5);
    if (_0x4361c2 < 0x1 || _0x4361c2 > _0x3ce8d9) {
      return _0x271b0d.sendMessage("〖 𝗖𝗠𝗗 𝗦𝗧𝗢𝗥𝗘 〗\n━━━━━━━━━━━━━━━\n⚠️ Invalid page number. Please enter a number between 1 and " + _0x3ce8d9 + '.', _0x4e7a72.threadID, _0x4e7a72.messageID);
    }
    const _0x568c6e = (_0x4361c2 - 0x1) * 0x5;
    const _0x58c99c = _0x568c6e + 0x5;
    const _0x59c8ef = _0x14aaeb.slice(_0x568c6e, _0x58c99c);
    let _0x768ccf = "〖 𝗖𝗠𝗗 𝗦𝗧𝗢𝗥𝗘 〗\n━━━━━━━━━━━━━━━\n🛒 Items Page (" + _0x4361c2 + '/' + _0x3ce8d9 + ")\n\n";
    _0x59c8ef.forEach((_0x5698b5, _0x35dc63) => {
      _0x768ccf += "👑 𝗜𝘁𝗲𝗺 𝗡𝗮𝗺𝗲: cmdstore\n🆔 𝗜𝗗: " + (_0x568c6e + _0x35dc63 + 0x1) + "\n⚙️ 𝗧𝘆𝗽𝗲: " + _0x5698b5.cmd + "\n📝 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: NO\n💻 𝗔𝘂𝘁𝗵𝗼𝗿: " + _0x5698b5.author + "\n⏰ 𝗗𝗮𝘁𝗲:" + (_0x5698b5.update || null) + "\n━━━━━━━━━━━━━━━\n";
    });
    _0x271b0d.sendMessage(_0x768ccf, _0x4e7a72.threadID, (_0x3fb89, _0x46757c) => {
      global.GoatBot.onReply.set(_0x46757c.messageID, {
        'commandName': this.config.name,
        'type': "reply",
        'messageID': _0x46757c.messageID,
        'author': _0x4e7a72.senderID,
        'cmdName': _0x14aaeb,
        'page': _0x4361c2
      });
    }, _0x4e7a72.messageID);
    console.log(_0x14aaeb);
  } catch (_0x368da9) {
    _0x271b0d.sendMessage("〖 𝗖𝗠𝗗 𝗦𝗧𝗢𝗥𝗘 〗\n━━━━━━━━━━━━━━━\n⚠️Failed to retrieve commands.", _0x4e7a72.threadID, _0x4e7a72.messageID);
  }
};
module.exports.onReply = async function ({
  api: _0x292836,
  event: _0x3bb858,
  Reply: _0x28ccd1
}) {
  if (_0x28ccd1.author != _0x3bb858.senderID) {
    return _0x292836.sendMessage("〖 𝗖𝗠𝗗 𝗦𝗧𝗢𝗥𝗘 〗\n━━━━━━━━━━━━━━━\n⚠️ I write you by writing", _0x3bb858.threadID, _0x3bb858.messageID);
  }
  const _0x213bea = parseInt(_0x3bb858.body);
  const _0x368331 = (_0x28ccd1.page - 0x1) * 0x5;
  const _0x589cc7 = _0x368331 + 0x5;
  if (isNaN(_0x213bea) || _0x213bea < _0x368331 + 0x1 || _0x213bea > _0x589cc7) {
    return _0x292836.sendMessage("〖 𝗖𝗠𝗗 𝗦𝗧𝗢𝗥𝗘 〗\n━━━━━━━━━━━━━━━\n⚠️Please reply with a number between " + (_0x368331 + 0x1) + " and " + Math.min(_0x589cc7, _0x28ccd1.cmdName.length) + '.', _0x3bb858.threadID, _0x3bb858.messageID);
  }
  try {
    const _0x72b1f4 = _0x28ccd1.cmdName[_0x213bea - 0x1].cmd;
    const _0x58df7d = await axios.get("https://raw.githubusercontent.com/ROMADAN-MUBAKAK/Apis/refs/heads/main/CMDS.json");
    const _0x483ce1 = _0x58df7d.data[_0x72b1f4];
    if (!_0x483ce1) {
      return _0x292836.sendMessage("〖 𝗖𝗠𝗗 𝗦𝗧𝗢𝗥𝗘 〗\n━━━━━━━━━━━━━━━\n⚠️Command URL not found.", _0x3bb858.threadID, _0x3bb858.messageID);
    }
    _0x292836.unsendMessage(_0x28ccd1.messageID);
    const _0x1f9a91 = "〖 𝗖𝗠𝗗 𝗦𝗧𝗢𝗥𝗘 〗\n━━━━━━━━━━━━━━━\n📎 𝗖𝗠𝗗 𝗟𝗶𝗻𝗸: " + _0x483ce1;
    _0x292836.sendMessage(_0x1f9a91, _0x3bb858.threadID, _0x3bb858.messageID);
  } catch (_0x2cc38e) {
    _0x292836.sendMessage("〖 𝗖𝗠𝗗 𝗦𝗧𝗢𝗥𝗘 〗\n━━━━━━━━━━━━━━━\n⚠️ Failed to retrieve the command URL.", _0x3bb858.threadID, _0x3bb858.messageID);
  }
};