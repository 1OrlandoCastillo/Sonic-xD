import { xpRange } from '../lib/levelling.js';

const clockString = ms => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
};

let img = 'https://files.catbox.moe/6dewf4.jpg';

function saludarSegunHora() {
  const hora = new Date().getHours();
  if (hora>= 5 && hora < 12) return '🌄 Buenos días';
  if (hora>= 12 && hora < 19) return '🌞 Buenas tardes';
  return '🌙 Buenas noches';
}

let menuText = `
╭─❒ 「 sᥲsᥙkᥱ ᑲ᥆𝗍 mძ 🌀 」
│ 👤 *Nombre:* %name
│ 🎖 *Nivel:* %level | *XP:* %exp/%max
│ 🔓 *Límite:* %limit | *Modo:* %mode
│ ⏱️ *Uptime:* %uptime
│ 🌍 *Usuarios:* %total
│ 🤖 *Bot optimizado para mejor rendimiento.*
╰❒
`.trim();

const sectionDivider = '╰─────────────────╯';

const menuFooter = `
╭─❒ 「 *📌 INFO FINAL* 」
│ ⚠️ *Usa los comandos con el prefijo correspondiente.*

> Creado por Barboza-Team
╰❒
`.trim();

let handler = async (m, { conn, usedPrefix: _p }) => {
  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  };

  try {
    if (!global.db || !global.db.data || !global.db.data.users) {
      console.error("Error: global.db.data.users no está inicializado o no es accesible.");
      return conn.reply(m.chat, '⚠️ El bot no tiene acceso a la base de datos de usuarios. Por favor, reporta esto al desarrollador.', m);
    }

    const user = global.db.data.users[m.sender] || { level: 1, exp: 0, limit: 5 };
    const { exp, level, limit } = user;

    const { min, xp } = xpRange(level, global.multiplier || 1);

    const totalreg = Object.keys(global.db.data.users).length;

    const mode = global.opts?.self ? 'Privado 🔒' : 'Público 🌐';

    const uptime = clockString(process.uptime() * 1000);

    let userName = "Usuario";
    try {
      userName = await conn.getName(m.sender);
    } catch (e) {
      console.error("Error al obtener el nombre del usuario:", e);
    }

    let categorizedCommands = {};

    if (!global.plugins) {
      console.error("Error: global.plugins no está inicializado. No se pueden cargar los comandos.");
      return conn.reply(m.chat, '⚠️ Los comandos del bot no están cargados. Por favor, reporta esto al desarrollador.', m);
    }

    Object.values(global.plugins)
      .filter(p => p?.help && !p.disabled)
      .forEach(p => {
        const tags = Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? [p.tags] : ['Otros']);
        const tag = tags[0] || 'Otros';

        const commands = Array.isArray(p.help) ? p.help : (typeof p.help === 'string' ? [p.help] : []);

        if (commands.length > 0) {
          categorizedCommands[tag] = categorizedCommands[tag] || new Set();
          commands.forEach(cmd => categorizedCommands[tag].add((_p === '' ? '' : _p) + cmd));
        }
      });

    const categoryEmojis = {
      anime: "🎭",
      info: "ℹ️",
      search: "🔎",
      diversión: "🎉",
      subbots: "🤖",
      rpg: "🌀",
      registro: "📝",
      sticker: "🎨",
      imagen: "🖼️",
      logo: "🖌️",
      premium: "🎖️",
      configuración: "⚙️",
      descargas: "📥",
      herramientas: "🛠️",
      nsfw: "🔞",
      "base de datos": "📀",
      audios: "🔊",
      "free fire": "🔥",
      otros: "🪪"
    };

    const menuBody = Object.entries(categorizedCommands).map(([title, cmds]) => {
      const cleanTitle = title.toLowerCase().trim();
      const emoji = categoryEmojis[cleanTitle] || "📁";
      const commandEntries = [...cmds].map(cmd => `│ ◦ _${cmd}_`).join('\n');
      return `╭─「 ${emoji} *${title.toUpperCase()}* 」\n${commandEntries}\n${sectionDivider}`;
    }).join('\n\n');

    const finalHeader = menuText
      .replace('%name', userName)
      .replace('%level', level)
      .replace('%exp', exp - min)
      .replace('%max', xp)
      .replace('%limit', limit)
      .replace('%mode', mode)
      .replace('%uptime', uptime)
      .replace('%total', totalreg);

    const fullMenu = `${finalHeader}\n\n${menuBody}\n\n${menuFooter}`;

    try {
      await conn.sendMessage(m.chat, {
        image: { url: img },
        caption: fullMenu,
        mentions: [m.sender]
      }, { quoted: m });
    } catch (sendError) {
      console.error("Error al enviar la imagen del menú, enviando como texto:", sendError);
      await conn.reply(m.chat, fullMenu, m);
    }

  } catch (e) {
    console.error("Error general al generar el menú:", e);
    conn.reply(m.chat, '⚠️ Ocurrió un error al generar el menú. Por favor, inténtalo de nuevo más tarde o contacta al soporte.', m);
  }
};

handler.command = ['menu', 'help', 'menú'];

export default handler;