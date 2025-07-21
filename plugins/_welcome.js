import { WAMessageStubType} from "@whiskeysockets/baileys";
import fetch from "node-fetch";

export async function before(m, { conn, groupMetadata}) {
  try {
    if (!m.messageStubType ||!m.isGroup) return true;

    const fkontak = {
      key: {
        participants: "0@s.whatsapp.net",
        remoteJid: "status@broadcast",
        fromMe: false,
        id: "Halo"
},
      message: {
        contactMessage: {
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${conn.user.jid.split('@')[0]}:${conn.user.jid.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
}
},
      participant: "0@s.whatsapp.net"
};

    const chat = global.db?.data?.chats?.[m.chat];
    if (!chat) return true;

    const userJid = m.messageStubParameters[0];
    const user = `@${userJid.split("@")[0]}`;
    const groupName = groupMetadata.subject;
    const groupDesc = groupMetadata.desc || "📜 Sin descripción disponible";

    const ppUrl = await conn.profilePictureUrl(userJid, "image").catch(
      () => "https://files.catbox.moe/6dewf4.jpg"
);
    const imgBuffer = await fetch(ppUrl).then(res => res.buffer()).catch(() => null);

    // Bienvenida
    if (chat.bienvenida && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      const welcomeText = `🎉 *¡HOLA ${user}!* 🎉\n\nBienvenido/a a *${groupName}*.\n\n📚 *Sobre nosotros:*\n_${groupDesc}_\n\n🌟 ¡Esperamos que disfrutes tu estancia!`;

      await conn.sendMessage(m.chat, {
        image: imgBuffer,
        caption: welcomeText,
        mentions: [userJid]
}, { quoted: fkontak});

      await conn.sendMessage(m.chat, {
        audio: { url: "https://qu.ax/dvPOt.opus"},
        mimetype: "audio/ogg",
        ptt: false
}, { quoted: fkontak});
}

    // Salida voluntaria
    if (chat.bienvenida && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
      const goodbyeText = `🚶‍♂️ *¡Adiós ${user}!* 😔\n\nGracias por haber formado parte de *${groupName}*. ¡Vuelve cuando quieras!`;

      await conn.sendMessage(m.chat, {
        image: imgBuffer,
        caption: goodbyeText,
        mentions: [userJid]
}, { quoted: fkontak});

      await conn.sendMessage(m.chat, {
        audio: { url: "https://cdn.russellxz.click/98d99914.mp3"},
        mimetype: "audio/mpeg",
        ptt: false
}, { quoted: fkontak});
}

    // Expulsión del grupo
    if (chat.bienvenida && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE) {
      const kickText = `🚨 *${user} ha sido expulsado del grupo* 🚨\n\nMantengamos un ambiente respetuoso en *${groupName}*`;

      await conn.sendMessage(m.chat, {
        image: imgBuffer,
        caption: kickText,
        mentions: [userJid]
}, { quoted: fkontak});

      await conn.sendMessage(m.chat, {
        audio: { url: "https://qu.ax/AGEns.mp3"},
        mimetype: "audio/mpeg",
        ptt: false
}, { quoted: fkontak});
}
} catch (error) {
    console.error("❌ Error general en el sistema de bienvenida/despedida:", error);
}
}
