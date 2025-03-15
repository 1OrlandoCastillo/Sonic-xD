
import baileys from '@whiskeysockets/baileys'

let areJidsSameUser = baileys.default

let handler = async (m, { conn, participants, args, command }) => {
    let member = participants.map(u => u.id)
    let sum = args[0] ? args[0] : member.length
    let total = 0
    let sider = []

    for (let i = 0; i < sum; i++) {
        let users = m.isGroup ? participants.find(u => u.id == member[i]) : {}
        if ((typeof global.db.data.users[member[i]] === 'undefined' || global.db.data.users[member[i]].chat === 0) &&
            !users.isAdmin && !users.isSuperAdmin) {
            total++
            sider.push(member[i])
        }
    }

    const delay = (ms) => new Promise(res => setTimeout(res, ms))

    switch (command) {
        case "fantasmas":
            if (total === 0) return conn.reply(m.chat, "🟢 Este grupo es activo, no hay fantasmas.", m)
            await conn.reply(m.chat, `⚠️ Revisión de inactividad ⚠️\n\nGrupo: ${await conn.getName(m.chat)}\nMiembros: ${sum}\n\n👻 Lista de fantasmas:\n${sider.map(v => '👉 @' + v.replace(/@.+/, '')).join('\n')}`, null, { mentions: sider })
            break

        case "kickfantasmas":
            if (total === 0) return conn.reply(m.chat, "🟢 Este grupo es activo, no hay fantasmas.", m)
            await conn.reply(m.chat, `⚠️ Eliminación de inactivos ⚠️\n\nGrupo: ${await conn.getName(m.chat)}\nParticipantes: ${sum}\n\n👻 Fantasmas eliminados:\n${sider.map(v => '@' + v.replace(/@.+/, '')).join('\n')}`, null, { mentions: sider })
            await delay(20000)

            let chat = global.db.data.chats[m.chat]
            chat.welcome = false

            try {
                for (let user of sider) {
                    if (user.endsWith('@s.whatsapp.net') && !participants.find(v => areJidsSameUser(v.id, user))?.admin) {
                        await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
                        await delay(10000)
                    }
                }
            } finally {
                chat.welcome = true
            }
            break
    }
}

handler.command = /^(fantasmas|kickfantasmas)$/i
handler.group = true
handler.botAdmin = true
handler.admin = true
handler.fail = null

export default handler