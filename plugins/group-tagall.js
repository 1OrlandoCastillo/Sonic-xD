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
    const phoneNumber = id.split('@')[0];
    let prefix = phoneNumber.substring(0, 3);
    if (!countryFlags[prefix]) prefix = phoneNumber.substring(0, 2);
    return countryFlags[prefix] || '🏳️‍🌈';
};

  let messageText = `*${groupName}*\n\n*Integrantes: ${participants.length}*\n${customMessage}\n┌──⭓ *Despierten*\n`;
  for (const mem of participants) {
    messageText += `${emoji} ${getCountryFlag(mem.id)} @${mem.id.split('@')[0]}\n`;
}
  messageText += `└───────⭓\n\n👁️ *Sasuke Bot MD* ha ejecutado la invocación grupal.`;

  const imageUrl = 'https://files.catbox.moe/1j784p.jpg'; // Imagen estilo oscuro
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
        name: "⛩️ *Sasuke Bot MD | Invocación Masiva* 🌀",
        jpegThumbnail: await (await fetch(imageUrl)).buffer(),
        vcard:
          "BEGIN:VCARD\n" +
          "VERSION:3.0\n" +
          "N:;Sasuke;;;\n" +
          "FN:Sasuke Summoner\n" +
          "ORG:Barboza Developers\n" +
          "TITLE:Comandante Dimensional\n" +
          "item1.TEL;waid=19709001746:+1 (970) 900-1746\n" +
          "item1.X-ABLabel:⚡ Sasuke\n" +
          "X-WA-BIZ-DESCRIPTION:🛸 Ejecutando etiquetas a nivel global. Poder y elegancia al servicio del grupo.\n" +
          "X-WA-BIZ-NAME:Sasuke Bot MD\n" +
          "END:VCARD"
}
},
    participant: "0@s.whatsapp.net"
};

  // Imagen de encabezado visual
  await conn.sendMessage(m.chat, {
    image: { url: imageUrl},
    caption: "🔮 *Invocación grupal ejecutada por Sasuke Bot MD* 🛸",
    mentions: participants.map(a => a.id)
}, { quoted: fkontak});

  // Mensaje con menciones
  await conn.sendMessage(m.chat, {
    text: messageText,
    mentions: participants.map(a => a.id)
}, { quoted: fkontak});

  // Audio tipo PTT de ambientación
  await conn.sendMessage(m.chat, {
    audio: { url: audioUrl},
    mimetype: 'audio/mp4',
    ptt: true
}, { quoted: fkontak});
};

handler.help = ['todos'];
handler.tags = ['group'];
handler.command = /^(tagall|invocar|marcar|todos|invocación)$/i;
handler.admin = false;
handler.group = true;

export default handler;