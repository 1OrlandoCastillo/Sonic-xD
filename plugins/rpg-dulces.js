
import fs from 'fs';

const filePath = './mineria.json';

let handler = async (m, { conn }) => {
    let who = m.mentionedJid[0] 
        ? m.mentionedJid[0] 
        : m.quoted 
        ? m.quoted.sender 
        : m.sender;

    if (!fs.existsSync(filePath)) {
        return conn.reply(m.chat, '🚫 No hay datos de minería disponibles.', m);
    }

    let data = JSON.parse(fs.readFileSync(filePath));

    // Inicializa el usuario si no existe
    if (!data[who]) {
        data[who] = { dulces: 0 };
    }

    // Define cuántos dulces se ganan (puedes personalizar esto)
    let cantidadGanada = 10; // Cambia este valor según lo necesario
    data[who].dulces += cantidadGanada; // Suma los dulces ganados

    // Guarda los datos actualizados de vuelta al archivo
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    let dulces = data[who].dulces;

    let mensaje = (who === m.sender)
        ? `🎉 *Tu Cartera de Dulces* 🎉\n\n🍬 Dulces: *${dulces}*\n\n📌 Usa el comando nuevamente mencionando a otro usuario para ver su saldo.`
        : `🎈 *Cartera de @${who.split('@')[0]}* 🎈\n\n🍬 Dulces: *${dulces}*`;

    await conn.sendMessage(m.chat, { text: mensaje, mentions: [who] }, { quoted: m });
};

handler.help = ['dulces'];
handler.tags = ['rpg'];
handler.command = ['wallet', 'cartera', 'dulces', 'bal', 'coins'];

export default handler;