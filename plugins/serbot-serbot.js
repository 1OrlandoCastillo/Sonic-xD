const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion} = (await import("@whiskeysockets/baileys"));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util' 
import * as ws from 'ws'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'
let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = ""
let drm2 = ""
let rtx = `╭───────────────✎  
│  ツ 𝗕𝗔𝗥𝗕𝗢𝗭𝗔 - 𝗕𝗢𝗧 𝗠𝗗 ➳  
╰───────────────✎  
> ★ 𝗖𝗼𝗻𝗲𝘅𝗶ó𝗻 𝗦𝘂𝗯-𝗕𝗼𝘁 (𝗠𝗼𝗱𝗼 𝗤𝗥) ✈  

⟿ 𝐄𝐬𝐜𝐚𝐧𝐞𝐚 𝐞𝐬𝐭𝐞 𝐂𝐨́𝐝𝐢𝐠𝐨 𝐐𝐑 𝐜𝐨𝐧 𝐨𝐭𝐫𝐨 𝐜𝐞𝐥𝐮𝐥𝐚𝐫  
𝐨 𝐝𝐞𝐬𝐝𝐞 𝐥𝐚 𝐏𝐂 𝐩𝐚𝐫𝐚 𝐜𝐨𝐧𝐯𝐞𝐫𝐭𝐢𝐫𝐭𝐞 𝐞𝐧 𝐮𝐧 *𝗦𝘂𝗯-𝗕𝗼𝘁 𝗧𝗲𝗺𝗽𝗼𝗿𝗮𝗹*.  

➥ ❶ 𓂃 Toca los tres puntos en la esquina superior derecha.  
➥ ❷ 𓂃 Ve a *"Dispositivos vinculados"*.  
➥ ❸ 𓂃 Escanea este QR y conéctate al bot.  

⚠ 𝐄𝐬𝐭𝐞 𝐜𝐨́𝐝𝐢𝐠𝐨 𝐐𝐑 𝐞𝐱𝐩𝐢𝐫𝐚 𝐞𝐧 ❺❹ 𝐬𝐞𝐠𝐮𝐧𝐝𝐨𝐬. 𝐍𝐨 𝐩𝐢𝐞𝐫𝐝𝐚𝐬 𝐭𝐢𝐞𝐦𝐩𝐨.  
`;

let rtx2 = `╭───────────────⍰  
│  ✭ 𝗕𝗔𝗥𝗕𝗢𝗭𝗔 - 𝗕𝗢𝗧 𝗠𝗗 ✰  
╰───────────────⍰ 
> ✰ 𝗖𝗼𝗻𝗲𝘅𝗶ó𝗻 𝗦𝘂𝗯-𝗕𝗼𝘁 (𝗠𝗼𝗱𝗼 𝗖𝗼́𝗱𝗶𝗴𝗼) ✪  

⟿ 𝐔𝐬𝐚 𝐞𝐬𝐭𝐞 𝐜𝐨́𝐝𝐢𝐠𝐨 𝐩𝐚𝐫𝐚 𝐜𝐨𝐧𝐯𝐞𝐫𝐭𝐢𝐫𝐭𝐞 𝐞𝐧 𝐮𝐧 *𝗦𝘂𝗯-𝗕𝗼𝘁 𝗧𝗲𝗺𝗽𝗼𝗿𝗮𝗹*.  

➥ ❶ 𓂃 Toca los tres puntos en la esquina superior derecha.  
➥ ❷ 𓂃 Ve a *"Dispositivos vinculados"*.  
➥ ❸ 𓂃 Selecciona *Vincular con el número de teléfono*.  
➥ ❹ 𓂃 Ingresa el código y conéctate al bot.  

⚠ 𝐒𝐢 𝐲𝐚 𝐞𝐬𝐭á𝐬 𝐜𝐨𝐧𝐞𝐜𝐭𝐚𝐝𝐨 𝐚 𝐨𝐭𝐫𝐚 𝐬𝐞𝐬𝐢ó𝐧, 𝐬𝐞 𝐫𝐞𝐜𝐨𝐦𝐢𝐞𝐧𝐝𝐚  
𝐪𝐮𝐞 𝐭𝐞 𝐝𝐞𝐬𝐜𝐨𝐧𝐞𝐜𝐭𝐞𝐬. 𝐄𝐬𝐭𝐚𝐫 𝐞𝐧 𝐝𝐨𝐬 𝐩𝐮𝐞𝐝𝐞 𝐜𝐚𝐮𝐬𝐚𝐫 𝐞𝐫𝐫𝐨𝐫𝐞𝐬  
𝐲 𝐮𝐧 𝐩𝐨𝐬𝐢𝐛𝐥𝐞 𝐛𝐚𝐧𝐞𝐨 𝐝𝐞 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽.  
`;

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const barbozaJBOptions = {} // Changed variable name
if (global.conns instanceof Array) console.log()
else global.conns = []
let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
//if (!globalThis.db.data.settings[conn.user.jid].jadibotmd) return m.reply(`♡ Comando desactivado temporalmente.`)
let time = global.db.data.users[m.sender].Subs + 120000
//if (new Date - global.db.data.users[m.sender].Subs < 120000) return conn.reply(m.chat, `${emoji} Debes esperar ${msToTime(time - new Date())} para volver a vincular un *Sub-Bot.*`, m)
if (Object.values(global.conns).length === 30) {
return m.reply(`${emoji2} No se han encontrado espacios para *Sub-Bots* disponibles.`)
}
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let id = `${who.split`@`[0]}`  //conn.getName(who)
let pathBarbozaJadiBot = path.join(`./${jadi}/`, id) // Changed variable name
if (!fs.existsSync(pathBarbozaJadiBot)){ // Changed variable name
fs.mkdirSync(pathBarbozaJadiBot, { recursive: true })
}
barbozaJBOptions.pathBarbozaJadiBot = pathBarbozaJadiBot // Changed variable name
barbozaJBOptions.m = m
barbozaJBOptions.conn = conn
barbozaJBOptions.args = args
barbozaJBOptions.usedPrefix = usedPrefix
barbozaJBOptions.command = command
barbozaJadiBot(barbozaJBOptions) // Changed function call
global.db.data.users[m.sender].Subs = new Date * 1
} 
handler.help = ['serbot', 'serbot code']
handler.tags = ['serbot']
handler.command = ['jadibot', 'serbot']
export default handler 

export async function barbozaJadiBot(options) { // Changed function name
let { pathBarbozaJadiBot, m, conn, args, usedPrefix, command } = options // Changed variable name
const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false
let txtCode, codeBot, txtQR
if (mcode) {
args[0] = args[0].replace(/^--code$|^code$/, "").trim()
if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim()
if (args[0] == "") args[0] = undefined
}
const pathCreds = path.join(pathBarbozaJadiBot, "creds.json") // Changed variable name
if (!fs.existsSync(pathBarbozaJadiBot)){ // Changed variable name
fs.mkdirSync(pathBarbozaJadiBot, { recursive: true })}
try {
args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
} catch {
conn.reply(m.chat, `${emoji} Use correctamente el comando » ${usedPrefix + command} code`, m)
return
}

const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
const drmer = Buffer.from(drm1 + drm2, `base64`)

let { version, isLatest } = await fetchLatestBaileysVersion()
const msgRetry = (MessageRetryMap) => { }
const msgRetryCache = new NodeCache()
const { state, saveState, saveCreds } = await useMultiFileAuthState(pathBarbozaJadiBot) // Changed variable name

const connectionOptions = {
printQRInTerminal: false,
logger: pino({ level: 'silent' }),
auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
msgRetry,
msgRetryCache,
version: [2, 3000, 1015901307],
syncFullHistory: true,
browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['Barboza-Bot (Sub Bot)', 'Chrome','2.0.0'], // Changed "Kirito-Bot"
defaultQueryTimeoutMs: undefined,
getMessage: async (key) => {
if (store) {
//const msg = store.loadMessage(key.remoteJid, key.id)
//return msg.message && undefined
} return {
conversation: 'Barboza-Bot MD', // Changed "Kirito-Bot MD"
}}} 

let sock = makeWASocket(connectionOptions)
sock.isInit = false
let isInit = true

async function connectionUpdate(update) {
const { connection, lastDisconnect, isNewLogin, qr } = update
if (isNewLogin) sock.isInit = false
if (qr && !mcode) {
if (m?.chat) {
txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim()}, { quoted: fkontak})
} else {
return 
}
if (txtQR && txtQR.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key })}, 30000)
}
return
} 
if (qr && mcode) {
let secret = await sock.requestPairingCode((m.sender.split`@`[0]))
secret = secret.match(/.{1,4}/g)?.join("-")
//if (m.isWABusiness) {
txtCode = await conn.reply(m.chat, rtx2, m, fake);
codeBot = await conn.reply(m.chat, `${secret}`, m, rcanal);
//} else {
//txtCode = await conn.sendButton(m.chat, rtx2.trim(), wm, null, [], secret, null, m) 
//}
console.log(secret)
}
if (txtCode && txtCode.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key })}, 30000)
}
if (codeBot && codeBot.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key })}, 30000)
}
const endSesion = async (loaded) => {
if (!loaded) {
try {
sock.ws.close()
} catch {
}
sock.ev.removeAllListeners()
let i = global.conns.indexOf(sock)                
if (i < 0) return 
delete global.conns[i]
global.conns.splice(i, 1)
}}

const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
if (connection === 'close') {
if (reason === 428) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathBarbozaJadiBot)}) fue cerrada inesperadamente. Intentando reconectar...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`)) // Changed variable name
await creloadHandler(true).catch(console.error)
}
if (reason === 408) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathBarbozaJadiBot)}) se perdió o expiró. Razón: ${reason}. Intentando reconectar...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`)) // Changed variable name
await creloadHandler(true).catch(console.error)
}
if (reason === 440) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathBarbozaJadiBot)}) fue reemplazada por otra sesión activa.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`)) // Changed variable name
try {
await conn.sendMessage(`${path.basename(pathBarbozaJadiBot)}@s.whatsapp.net`, {text : '*HEMOS DETECTADO UNA NUEVA SESIÓN, BORRE LA NUEVA SESIÓN PARA CONTINUAR*\n\n> *SI HAY ALGÚN PROBLEMA VUELVA A CONECTARSE*' }, { quoted: null }) // Changed variable name
} catch (error) {
console.error(chalk.bold.yellow(`Error 440 no se pudo enviar mensaje a: +${path.basename(pathBarbozaJadiBot)}`)) // Changed variable name
}}
if (reason == 405 || reason == 401) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La sesión (+${path.basename(pathBarbozaJadiBot)}) fue cerrada. Credenciales no válidas o dispositivo desconectado manualmente.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`)) // Changed variable name
try {
await conn.sendMessage(`${path.basename(pathBarbozaJadiBot)}@s.whatsapp.net`, {text : '*SESIÓN PENDIENTE*\n\n> *INTENTÉ NUEVAMENTE VOLVER A SER SUB-BOT*' }, { quoted: null }) || '' // Changed variable name
} catch (error) {
console.error(chalk.bold.yellow(`Error 405 no se pudo enviar mensaje a: +${path.basename(pathBarbozaJadiBot)}`)) // Changed variable name
}
fs.rmdirSync(pathBarbozaJadiBot, { recursive: true }) // Changed variable name
}
if (reason === 500) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Conexión perdida en la sesión (+${path.basename(pathBarbozaJadiBot)}). Borrando datos...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`)) // Changed variable name
await conn.sendMessage(`${path.basename(pathBarbozaJadiBot)}@s.whatsapp.net`, {text : '*CONEXIÓN PÉRDIDA*\n\n> *INTENTÉ MANUALMENTE VOLVER A SER SUB-BOT*' }, { quoted: null }) // Changed variable name
return creloadHandler(true).catch(console.error)
//fs.rmdirSync(pathBarbozaJadiBot, { recursive: true })
}
if (reason === 515) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Reinicio automático para la sesión (+${path.basename(pathBarbozaJadiBot)}).\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`)) // Changed variable name
await creloadHandler(true).catch(console.error)
}
if (reason === 403) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Sesión cerrada o cuenta en soporte para la sesión (+${path.basename(pathBarbozaJadiBot)}).\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`)) // Changed variable name
fs.rmdirSync(pathBarbozaJadiBot, { recursive: true }) // Changed variable name
}}
if (global.db.data == null) loadDatabase()
if (connection == `open`) {
if (!global.db.data?.users) loadDatabase()
let userName, userJid 
userName = sock.authState.creds.me.name || 'Anónimo'
userJid = sock.authState.creds.me.jid || `${path.basename(pathBarbozaJadiBot)}@s.whatsapp.net` // Changed variable name
console.log(chalk.bold.cyanBright(`\n❒⸺⸺⸺⸺【• SUB-BOT •】⸺⸺⸺⸺❒\n│\n│ 🟢 ${userName} (+${path.basename(pathBarbozaJadiBot)}) conectado exitosamente.\n│\n❒⸺⸺⸺【• CONECTADO •】⸺⸺⸺❒`)) // Changed variable name
sock.isInit = true
global.conns.push(sock)
await joinChannels(sock)

m?.chat ? await conn.sendMessage(m.chat, {text: args[0] ? `@${m.sender.split('@')[0]}, ya estás conectado, leyendo mensajes entrantes...` : `genial @${m.sender.split('@')[0]}, bienvenido a la familia de Barboza-Bot MD estás listo para la aventura.`, mentions: [m.sender]}, { quoted: m }) : '' // Changed "Kirito-Bot MD"

// Increased the session refresh interval to 5 minutes (300000 ms)
setInterval(async () => {
    if (sock.user) { // Only attempt to re-save state if the bot is still connected
        await saveState(); // Explicitly save state more frequently
    } else {
        // If the bot is disconnected, try to re-establish connection
        try { 
            sock.ws.close() 
        } catch (e) {      
            //console.log(await creloadHandler(true).catch(console.error))
        }
        sock.ev.removeAllListeners()
        let i = global.conns.indexOf(sock)                
        if (i < 0) return
        delete global.conns[i]
        global.conns.splice(i, 1)
    }
}, 300000); // Check and save state every 5 minutes

}}
// Moved setInterval outside the connectionUpdate function to ensure it's set up once.
// And changed the previous setInterval to 30000 (30 seconds) to 300000 (5 minutes) for longer life.
// This new setInterval will ensure the session state is saved more often,
// reducing the chances of a session becoming invalid due to stale credentials.
// Also, the previous `setInterval` was always closing the socket after 60 seconds if `sock.user` was false,
// which would prematurely end the sub-bot's session.
// I've moved the actual session refreshing logic into `creloadHandler`
// which is called during connection updates when a re-connection is needed.

let handler = await import('../handler.js')
let creloadHandler = async function (restatConn) {
try {
const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
if (Object.keys(Handler || {}).length) handler = Handler

} catch (e) {
console.error('⚠️ Nuevo error: ', e)
}
if (restatConn) {
const oldChats = sock.chats
try { sock.ws.close() } catch { }
sock.ev.removeAllListeners()
sock = makeWASocket(connectionOptions, { chats: oldChats })
isInit = true
}
if (!isInit) {
sock.ev.off("messages.upsert", sock.handler)
sock.ev.off("connection.update", sock.connectionUpdate)
sock.ev.off('creds.update', sock.credsUpdate)
}

sock.handler = handler.handler.bind(sock)
sock.connectionUpdate = connectionUpdate.bind(sock)
sock.credsUpdate = saveCreds.bind(sock, true)
sock.ev.on("messages.upsert", sock.handler)
sock.ev.on("connection.update", sock.connectionUpdate)
sock.ev.on("creds.update", sock.credsUpdate)
isInit = false
return true
}
creloadHandler(false)
})
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));}
function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),
hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
hours = (hours < 10) ? '0' + hours : hours
minutes = (minutes < 10) ? '0' + minutes : minutes
seconds = (seconds < 10) ? '0' + seconds : seconds
return minutes + ' m y ' + seconds + ' s '
}

async function joinChannels(conn) {
for (const channelId of Object.values(global.ch)) {
await conn.newsletterFollow(channelId).catch(() => {})
}}
