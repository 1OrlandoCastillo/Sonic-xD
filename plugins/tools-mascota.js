import fs from 'fs';

const filePath = './mineria.json';

let mascotas = {
    "🐶 Perro": { precio: 50, felicidad: 10 },
    "🐱 Gato": { precio: 40, felicidad: 8 },
    "🦅 Águila": { precio: 80, felicidad: 15 },
    "🐺 Lobo": { precio: 100, felicidad: 20 },
    "🐹 Hámster": { precio: 60, felicidad: 12 },
    "🐻 Oso": { precio: 120, felicidad: 25 },
    "🦊 Zorro": { precio: 90, felicidad: 18 },
    "🐉 Dragón": { precio: 200, felicidad: 50 },
    "🦄 Unicornio": { precio: 150, felicidad: 30 },
    "🐢 Tortuga": { precio: 70, felicidad: 10 },
    "🐍 Serpiente": { precio: 85, felicidad: 14 },
    "🐸 Rana": { precio: 45, felicidad: 6 },
    "🐘 Elefante": { precio: 130, felicidad: 28 },
    "🦁 León": { precio: 140, felicidad: 35 }
};

// Función para leer datos del JSON
const leerDatos = () => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
    }
    return JSON.parse(fs.readFileSync(filePath));
};

// Función para guardar datos en el JSON
const guardarDatos = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

let handler = async (m, { command, args, usedPrefix }) => {
    let usuarios = leerDatos();
    let usuario = usuarios[m.sender] || { dulces: 100, mascota: null, comida: 0, tiempoUltimaComida: 0 };

    switch (command) {
        case 'mimascota':
            if (usuario.mascota) {
                return m.reply(`🐾 Ya tienes una mascota: *${usuario.mascota}*.\nUsa *${usedPrefix}mascota* para ver su estado.`);
            }
            let listaMascotas = Object.keys(mascotas).map(m => `${m} - ${mascotas[m].precio} 🍬`).join('\n');
            return m.reply(`🐾 *Mascotas disponibles:*\n${listaMascotas}\n\nUsa *${usedPrefix}comprar [nombre]* para adoptar una.`);

        case 'comprar':
            let nombreMascota = args.join(' ');
            if (!mascotas[nombreMascota]) return m.reply("❌ Mascota no encontrada. Usa *mimascota* para ver la lista.");
            if (usuario.dulces < mascotas[nombreMascota].precio) return m.reply("❌ No tienes suficientes 🍬 dulces.");

            usuario.dulces -= mascotas[nombreMascota].precio;
            usuario.mascota = nombreMascota;
            usuarios[m.sender] = usuario;
            guardarDatos(usuarios);

            return m.reply(`🎉 ¡Has adoptado a ${nombreMascota}! Usa *${usedPrefix}mascota* para ver su estado.`);

        case 'costos':
            let costos = Object.keys(mascotas).map(m => `${m} - ${mascotas[m].precio} 🍬`).join('\n');
            return m.reply(`📜 *Lista de precios de mascotas:*\n${costos}`);

        case 'comprarcomida':
            let cantidad = parseInt(args[0]);
            if (!cantidad || cantidad <= 0) return m.reply("❌ Ingresa una cantidad válida.");
            let costoComida = cantidad * 5;
            if (usuario.dulces < costoComida) return m.reply("❌ No tienes suficientes 🍬 dulces.");

            usuario.dulces -= costoComida;
            usuario.comida += cantidad;
            usuarios[m.sender] = usuario;
            guardarDatos(usuarios);

            return m.reply(`🍖 Compraste ${cantidad} comida. Ahora tienes ${usuario.comida} comida.`);

        case 'alimentar':
            let cantidadComida = parseInt(args[0]);
            if (!usuario.mascota) return m.reply("❌ No tienes una mascota. Usa *${usedPrefix}mimascota* para adoptar una.");
            if (!cantidadComida || cantidadComida <= 0) return m.reply("❌ Ingresa una cantidad válida.");
            if (usuario.comida < cantidadComida) return m.reply("❌ No tienes suficiente comida.");

            usuario.comida -= cantidadComida;
            usuario.tiempoUltimaComida = Date.now();
            usuarios[m.sender] = usuario;
            guardarDatos(usuarios);

            return m.reply(`🐾 Has alimentado a *${usuario.mascota}* con ${cantidadComida} comida. ¡Está más feliz!`);

        case 'mascota':
            if (!usuario.mascota) return m.reply("❌ No tienes una mascota.");
            let tiempoSinComer = ((Date.now() - usuario.tiempoUltimaComida) / 3600000).toFixed(1);
            let estadoMascota = "😊 Feliz";
            let tiempoRestante = 8 - (tiempoSinComer % 8);  // Para ver cuántas horas faltan para alimentarla nuevamente

            // Si han pasado más de 8 horas, se considera hambrienta
            if (tiempoSinComer > 8) {
                estadoMascota = "😢 Hambrienta";
            }

            return m.reply(
                `🐾 *Estado de ${usuario.mascota}:*\n` +
                `🍖 Comida restante: ${usuario.comida}\n` +
                `⏳ Última comida hace: ${tiempoSinComer} horas\n` +
                `💖 Estado: ${estadoMascota}\n` +
                `⏰ Recibirás un aviso en ${tiempoRestante} horas para alimentarla.`
            );

        default:
            return m.reply("❌ Comando no reconocido.");
    }
};

handler.command = /^(mimascota|comprar|costos|comprarcomida|alimentar|mascota)$/i;
export default handler;