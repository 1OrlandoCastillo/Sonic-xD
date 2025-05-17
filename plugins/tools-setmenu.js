
import { downloadContentFromMessage} from '@whiskeysockets/baileys';
import fs from 'fs';

const handler = async (m, { conn}) => {
    try {
        // Verificar si el mensaje citado es una imagen
        if (!m.quoted ||!m.quoted.mimetype ||!m.quoted.mimetype.startsWith('image/')) {
            return m.reply('❌ *Error:* Responde a una imagen con el comando `.setmenu` para cambiar la imagen del menú.');
}

        // Descargar la imagen adjunta
        const media = await downloadContentFromMessage(m.quoted, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of media) {
            buffer = Buffer.concat([buffer, chunk]);
}

        // Guardar la imagen temporalmente
        const path = './menu.jpg';
        fs.writeFileSync(path, buffer);

        // Confirmar el cambio con emojis
        m.reply('✅ *¡Imagen del menú cambiada con éxito!* 😃📸');

} catch (error) {
        console.error(error);
        m.reply('⚠️ *Error:* No se pudo cambiar la imagen del menú. 🛑\n' + error.message);
}
};

handler.command = /^setmenu$/i;
export default handler;