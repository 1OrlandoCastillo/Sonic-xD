import fetch from "node-fetch";

const fetchWithRetries = async (url, maxRetries = 2) => {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.status === 200 && data.result && data.result.download && data.result.download.url) {
        return data.result;
      }
    } catch (error) {
      console.error(`Error en el intento ${attempt + 1}:`, error.message);
    }
    attempt++;
  }
  throw new Error("No se pudo obtener una respuesta válida después de varios intentos.");
};

const API_URL = "https://api.vreden.web.id/api/ytmp3";

let handler = async (m, { conn, text, usedPrefix }) => {
  if (!text || !/^https:\/\/(www\.)?youtube\.com\/watch\?v=/.test(text)) {
    return conn.sendMessage(m.chat, {
      text: `> Por favor ingresa un enlace de YouTube.*\n\n🍁 *Ejemplo:* ${usedPrefix}ytmp3 https://youtube.com/watch?v=f6KSlVffvQc`,
    });
  }

  const key = await conn.sendMessage(m.chat, {
    text: `> @ꜱɪꜱᴋᴇᴅ - ʟᴏᴄᴀʟ - 𝟢𝟨\n> 𝙱𝚞𝚜𝚌𝚊𝚗𝚍𝚘 🕐`,
  });

  try {
    const apiUrl = `${API_URL}?url=${encodeURIComponent(text)}`;
    const apiData = await fetchWithRetries(apiUrl);
    const { metadata, download } = apiData;
    const { title, duration, views, author, url: videoUrl } = metadata;
    const { url: downloadUrl } = download;
    const description = `🎵 *Título:* ${metadata.title}\n👤 *Autor:* ${metadata.author.name}\n🖇️ *URL:* ${metadata.url}\n\n> @ꜱɪꜱᴋᴇᴅ - ʟᴏᴄᴀʟ - 𝟢𝟨`;

    
    await conn.sendMessage(m.chat, { text: description, edit: key });
    await conn.sendMessage(
      m.chat,
      {
        audio: { url: downloadUrl },
        mimetype: "audio/mpeg",
        fileName: `${title}.mp3`,
        caption: `@ꜱɪꜱᴋᴇᴅ - ʟᴏᴄᴀʟ - 𝟢𝟨`,
      },
      { quoted: m }
    );
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    await conn.sendMessage(m.chat, {
      text: `❌ *Ocurrió un error al intentar procesar tu solicitud:*\n${error.message || "Error desconocido"}`,
      edit: key,
    });
  }
};

handler.command = /^ytmp3$/i;
handler.limit = 5;
export default handler;