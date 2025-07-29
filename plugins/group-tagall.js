
import fetch from "node-fetch";

const handler = async (m, { isOwner, isAdmin, conn, text, participants, args}) => {
  const chat = global.db.data.chats[m.chat] || {};
  const emoji = chat.emojiTag || '🤖';

  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw new Error('No tienes permisos para usar este comando.');
}

  const customMessage = args.join(' ');
  const groupMetadata = await conn.groupMetadata(m.chat);
  const groupName = groupMetadata.subject;

  const countryFlags = {
    '1': '🇺🇸', '44': '🇬🇧', '33': '🇫🇷', '49': '🇩🇪', '39': '🇮🇹', '81': '🇯🇵',
    '82': '🇰🇷', '86': '🇨🇳', '7': '🇷🇺', '91': '🇮🇳', '61': '🇦🇺', '64': '🇳🇿',
    '34': '🇪🇸', '55': '🇧🇷', '52': '🇲🇽', '54': '🇦🇷', '57': '🇨🇴', '51': '🇵🇪',
    '56': '🇨🇱', '58': '🇻🇪', '502': '🇬🇹', '503': '🇸🇻', '504': '🇭🇳', '505': '🇳🇮',
    '506': '🇨🇷', '507': '🇵🇦', '591': '🇧🇴', '592': '🇬🇾', '593': '🇪🇨', '595': '🇵🇾',
    '596': '🇲🇶', '597': '🇸🇷', '598': '🇺🇾', '53': '🇨🇺', '20': '🇪🇬', '972': '🇮🇱',
    '90': '🇹🇷', '63': '🇵🇭', '62': '🇮🇩', '60': '🇲🇾', '65': '🇸🇬', '66': '🇹🇭',
    '31': '🇳🇱', '32': '🇧🇪', '30': '🇬🇷', '36': '🇭🇺', '46': '🇸🇪', '47': '🇳🇴',
    '48': '🇵🇱', '421': '🇸🇰', '420': '🇨🇿', '40': '🇷🇴', '43': '🇦🇹', '373': '🇲🇩'
};

  const getCountryFlag = (id) => {
    const phone = id.split('@')[0];
    let prefix = phone.substring(0, 3);
    if (!countryFlags[prefix]) prefix = phone.substring(0, 2);
    return countryFlags[prefix] || '🏳️‍🌈';
};

  let messageText = `⛩️ *Sasuke Bot MD*\n\n*Grupo:* ${groupName}\n*Integrantes:* ${participants.length}\n${customMessage}\n┌──⭓ *Invocación Global*\n`;
  for (const mem of participants) {
    messageText += `${emoji} ${getCountryFlag(mem.id)} @${mem.id.split('@')[0]}\n`;
}
  messageText += `└───────⭓\n\n🔮 *Ejecutado por Sasuke Bot MD* ⚡`;

  const imageUrl = 'https://files.catbox.moe/1j784p.jpg';
  const audioUrl = 'https://cdn.russellxz.click/a8f5df5a.mp3';

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "SasukeSummon"
},
    message: {
      locationMessage: {
        name: "💮 Sasuke Bot MD | Llamado Universal",
        jpegThumbnail: await (await fetch(imageUrl)).buffer(),
        vcard:
          "BEGIN:VCARD\n" +
          "VERSION:3.0\n" +
          "N:;Sasuke;;;\n" +
          "FN:Sasuke Bot MD\n" +
          "ORG:Barboza Developers\n" +
          "TITLE:Invocador Shinobi\n" +
          "item1.TEL;waid=19709001746:+1 (970) 900-1746\n" +
          "item1.X-ABLabel:Sasuke\n" +
          "X-WA-BIZ-DESCRIPTION:⚡ Ejecución mística de menciones masivas con arte y estilo.\n" +
          "X-WA-BIZ-NAME:Sasuke Bot MD\n" +
          "END:VCARD"
}
},
    participant: "0@s.whatsapp.net"
};

  await conn.sendMessage(m.chat, {
    image: { url: imageUrl},
    caption: messageText,
    mentions: participants.map(a => a.id),
    ptt: true,
    audio: { url: audioUrl},
    mimetype: 'audio/mp4'
}, { quoted: fkontak});
};

handler.help = ['todos'];
handler.tags = ['group'];
handler.command = /^(tagall|invocar|marcar|todos|invocación)$/i;
handler.admin = false;
handler.group = true;

export default handler;