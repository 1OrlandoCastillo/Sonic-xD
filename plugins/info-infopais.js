
const handler = async (m, { conn }) => {
  const args = m.text.split(" ");
  const pais = args[1]; // Obtener el nombre del país del mensaje

  // Base de datos simple de información de países
  const infoPaises = {
    Argentina: {
      capital: "Buenos Aires",
      poblacion: "45 millones",
      idioma: "Español",
      moneda: "Peso Argentino",
    },
    Brasil: {
      capital: "Brasilia",
      poblacion: "211 millones",
      idioma: "Portugués",
      moneda: "Real Brasileño",
    },
    México: {
      capital: "Ciudad de México",
      poblacion: "126 millones",
      idioma: "Español",
      moneda: "Peso Mexicano",
    },
    // Agrega más países aquí...
  };

  // Verificar si el país está en la base de datos
  if (infoPaises[pais]) {
    const info = infoPaises[pais];
    const mensaje = `🌍 *Información sobre ${pais}:*\n` +
                    `🏛️ Capital: ${info.capital}\n` +
                    `👥 Población: ${info.poblacion}\n` +
                    `🗣️ Idioma: ${info.idioma}\n` +
                    `💰 Moneda: ${info.moneda}`;
    
    await conn.sendMessage(m.chat, mensaje, { quoted: m });
  } else {
    await conn.sendMessage(m.chat, `❌ *País no encontrado.*`, { quoted: m });
  }
};

handler.help = ['infopais <nombre del país>'];
handler.tags = ['info'];
handler.command = /^(infopais)$/i;

export default handler;