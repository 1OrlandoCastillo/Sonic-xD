
const handler = async (m, { isOwner, isAdmin, conn, text, participants, args }) => {
    let chat = global.db.data.chats[m.chat], emoji = chat.emojiTag || '💨';
    
    if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, rcanal, conn);
        throw false;
    }

    const pesan = args.join` `, groupMetadata = await conn.groupMetadata(m.chat), groupName = groupMetadata.subject;
    
    // Map de códigos de país y banderas
    const countryFlags = {
        '52': '🇲🇽', '57': '🇨🇴', '54': '🇦🇷', '34': '🇪🇸', '55': '🇧🇷', '1': '🇺🇸',
        '44': '🇬🇧', '91': '🇮🇳', '502': '🇬🇹', '56': '🇨🇱', '51': '🇵🇪', '58': '🇻🇪',
        '505': '🇳🇮', '593': '🇪🇨', '504': '🇭🇳', '591': '🇧🇴', '53': '🇨🇺', '503': '🇸🇻',
        '507': '🇵🇦', '595': '🇵🇾', 'XX': '🌍' // Código desconocido
    };

    const getCountryFlag = (id) => {
        const phoneNumber = id.split('@')[0];
        let phonePrefix = phoneNumber.slice(0, 3);
        if (phoneNumber.startsWith('1')) return '🇺🇸';
        if (!countryFlags[phonePrefix]) phonePrefix = phoneNumber.slice(0, 2);
        return countryFlags[phonePrefix] || '🌍';
    };

    let teks = `📢 *${groupName}*\n👥 *Integrantes: ${participants.length}*\n${pesan}\n`;
    teks += `┌──⭓ *Mención Global*\n`;

    for (const mem of participants) {
        teks += `${emoji} ${getCountryFlag(mem.id)} @${mem.id.split('@')[0]}\n`;
    }

    teks += `└───────⭓\n\n🚀 _Powered by Barboza Bot_ 🚀`;

    await conn.sendMessage(m.chat, { text: teks, mentions: participants.map((a) => a.id) });
};

handler.help = ['todos'];
handler.tags = ['group'];
handler.command = /^(tagall|invocar|marcar|todos|mencion)$/i;
handler.group = true;

export default handler;