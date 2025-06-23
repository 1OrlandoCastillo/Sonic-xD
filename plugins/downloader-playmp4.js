
import yts from "yt-search";

const LIMIT_MB = 100;
const API_KEY = "Sylphiette's";

const countryCodes = {
  '+54': { country: 'Argentina', timeZone: 'America/Argentina/Buenos_Aires'},
  '+591': { country: 'Bolivia', timeZone: 'America/La_Paz'},
  '+56': { country: 'Chile', timeZone: 'America/Santiago'},
  '+57': { country: 'Colombia', timeZone: 'America/Bogota'},
  '+506': { country: 'Costa Rica', timeZone: 'America/Costa_Rica'},
  '+53': { country: 'Cuba', timeZone: 'America/Havana'},
  '+593': { country: 'Ecuador', timeZone: 'America/Guayaquil'},
  '+503': { country: 'El Salvador', timeZone: 'America/El_Salvador'},
  '+34': { country: 'España', timeZone: 'Europe/Madrid'},
  '+502': { country: 'Guatemala', timeZone: 'America/Guatemala'},
  '+504': { country: 'Honduras', timeZone: 'America/Tegucigalpa'},
  '+52': { country: 'México', timeZone: 'America/Mexico_City'},
  '+505': { country: 'Nicaragua', timeZone: 'America/Managua'},
  '+507': { country: 'Panamá', timeZone: 'America/Panama'},
  '+595': { country: 'Paraguay', timeZone: 'America/Asuncion'},
  '+51': { country: 'Perú', timeZone: 'America/Lima'},
  '+1': { country: 'Puerto Rico', timeZone: 'America/Puerto_Rico'},
  '+1-809': { country: 'República Dominicana', timeZone: 'America/Santo_Domingo'},
  '+1-829': { country: 'República Dominicana', timeZone: 'America/Santo_Domingo'},
  '+1-849': { country: 'República Dominicana', timeZone: 'America/Santo_Domingo'},
  '+598': { country: 'Uruguay', timeZone: 'America/Montevideo'},
  '+58': { country: 'Venezuela', timeZone: 'America/Caracas'}
};

const getGreeting = (hour) => {
  return hour < 12? 'Buenos días 🌅': hour < 18? 'Buenas tardes 🌄': 'Buenas noches 🌃';
};

const getUserGreeting = (userNumber) => {
  const phoneCode = userNumber.startsWith('+')? userNumber.split('@')[0].split('-')[0]: null;
  const countryInfo = phoneCode? countryCodes[phoneCode]: null;
  const now = new Date();

  if (countryInfo) {
    try {
      const localTime = new Date(now.toLocaleString('en-US', { timeZone: countryInfo.timeZone}));
      const hour = localTime.getHours();
      return `${getGreeting(hour)} @${userNumber}, (${countryInfo.country})`;
} catch {
      return `${getGreeting(now.getHours())} @${userNumber}, (${countryInfo.country})`;
}
}
  return `${getGreeting(now.getHours())} @${userNumber}`;
};

const fetchVideoInfo = async (query) => {
  const res = await yts(query);
  return res?.all?.[0] || null;
};

const getDownloadLinks = (url) => ({
  audio: `https://api.sylphy.xyz/download/ytmp3?url=${encodeURIComponent(url)}&apikey=${API_KEY}`,
  video: `https://api.sylphy.xyz/download/ytmp4?url=${encodeURIComponent(url)}&apikey=${API_KEY}`,
});

const handler = async (m, { conn, text, command}) => {
  if (!text) return m.reply("✨ Ingresa el nombre de un video o una URL de YouTube.");
  await m.react("🔎");

  const userNumber = m.sender.split('@')[0];
  const saludo = getUserGreeting(userNumber);
  const intro = `${saludo}, ¿cómo estás? 🎧 Tu pedido será procesado...`;

  const greetMsg = await conn.reply(m.chat, intro, m, { mentions: [m.sender]});

  const video = await fetchVideoInfo(text);
  if (!video) return m.reply("🚫 No encontré ningún resultado.");

  const caption = `
┌─「🎬 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗥𝗲𝘀𝘂𝗹𝘁𝗮𝗱𝗼」─┐
📌 *Título:* ${video.title}
👤 *Autor:* ${video.author.name}
⏰ *Duración:* ${video.duration.timestamp}
👁️‍🗨️ *Vistas:* ${video.views.toLocaleString()}
🔗 *Enlace:* ${video.url}
└────────────────────────┘
`;

  await conn.sendFile(m.chat, await (await fetch(video.thumbnail)).buffer(), "thumb.jpg", caption, m);

  const { audio, video: videoLink} = getDownloadLinks(video.url);

  try {
    if (command === "play") {
      const res = await (await fetch(audio)).json();
if (!res.status) return m.reply("😢 No pude obtener el audio.");
      await conn.sendFile(m.chat, res.res.downloadURL, res.res.title + ".mp3", "", m);
} else if (["play2", "playvid"].includes(command)) {
      const res = await (await fetch(videoLink)).json();
      if (!res.status) return m.reply("😢 No pude obtener el video.");

      const head = await fetch(res.res.url, { method: "HEAD"});
      const sizeMB = parseInt(head.headers.get("content-length"), 10) / (1024 * 1024);
      const asDoc = sizeMB>= LIMIT_MB;

      await conn.sendFile(m.chat, res.res.url, res.res.title + ".mp4", "", m, null, {
        asDocument: asDoc,
        mimetype: "video/mp4",
});
}
    await m.react("✅");
} catch (err) {
    m.reply("💥 Ocurrió un error: " + err.message);
}
};

handler.help = ["play", "play2"];
handler.tags = ["download"];
handler.command = ["play", "play2", "playvid"];

export default handler;