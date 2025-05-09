
const handler = async (m, { conn}) => {
    // Mensaje de procesamiento
    await conn.sendMessage(m.chat, { text: "🎲 *Procesando lanzamiento del dado...*"});

    // Simular una pequeña espera antes de mostrar el resultado
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generar número aleatorio del 1 al 6
    const resultado = Math.floor(Math.random() * 6) + 1;
    let mensaje = `🎲 *Has lanzado el dado y salió:* ${resultado}\n`;

    let xp = 0;

    if (resultado === 1 || resultado === 2) {
        mensaje += "😢 ¡Perdiste! Mejor suerte la próxima vez.\n❌ -10 XP";
        xp = -10;
} else if (resultado === 5 || resultado === 6) {
        mensaje += "🎉 ¡Ganaste! Felicidades.\n✅ +10 XP";
        xp = 10;
} else {
        mensaje += "🔄 No has ganado ni perdido, ¡intenta de nuevo!";
}

    await conn.sendMessage(m.chat, { text: mensaje});

    // Aquí puedes agregar el código para actualizar el XP del usuario en la base de datos
};

handler.command = ["dado"];
export default handler;