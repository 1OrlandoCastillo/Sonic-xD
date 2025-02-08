
var handler = async (m, { conn, text }) => {
    // Verificamos si se mencionó a alguien
    if (!text) throw '🍭 *ESCRIBE EL NOMBRE DE UN USUARIO PARA CALCULAR SU PORCENTAJE DE SAPA.*';

    // Obtenemos el ID del usuario mencionado
    let userMentioned = m.mentionedJid[0]; // Esto obtiene el ID del usuario mencionado

    // Verificamos si se mencionó un usuario válido
    if (!userMentioned) throw '🍭 *NO SE PUDO ENCONTRAR EL USUARIO MENCIONADO.*';

    // Generamos un porcentaje aleatorio de sapo entre 0 y 100
    let sapoPercentage = Math.floor(Math.random() * 101);

    // Creamos el mensaje mencionando al usuario y mostrando el porcentaje
    let sapaMessage = `
━━━━━━━━━━━━━━━
🐸 *${conn.getName(userMentioned)}*, eres un ${sapaPercentage}% sapa! 
━━━━━━━━━━━━━━━
`.trim();

    // Enviamos la respuesta mencionando al usuario
    m.reply(sapoMessage, null, { mentions: [userMentioned] });
}

handler.help = ['sapa']
handler.tags = ['fun']
handler.command = /^(sapa)$/i

export default handler;