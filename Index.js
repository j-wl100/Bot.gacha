require('dotenv').config();
const { Telegraf } = require('telegraf');
const axios = require('axios');

// Tokens que pondrás en las variables de entorno de Render
const bot = new Telegraf(process.env.BOT_TOKEN);
const TENOR_API_KEY = process.env.TENOR_API_KEY;

// Función para buscar un GIF en Tenor
async function buscarGif(query) {
    try {
        // Buscamos GIFs animados (usamos "anime" antes de la acción para que pegue con la estética de rol)
        const response = await axios.get(`https://tenor.googleapis.com/v2/search?q=anime ${query}&key=${TENOR_API_KEY}&client_key=my_test_app&limit=15`);
        const gifs = response.data.results;
        if (gifs && gifs.length > 0) {
            // Elige uno aleatorio entre los 15 primeros resultados
            const gifAleatorio = gifs[Math.floor(Math.random() * gifs.length)].media_formats.gif.url;
            return gifAleatorio;
        }
        return null;
    } catch (error) {
        console.error("Error buscando GIF:", error);
        return null;
    }
}

// ---------------------------------------------------------
// DICCIONARIO DE ACCIONES (El bot crea los comandos solos)
// ---------------------------------------------------------
const accionesRol = {
    atacar: { query: "attack", text: "ataca con fuerza" },
    esquivar: { query: "dodge", text: "esquiva ágilmente" },
    bloquear: { query: "block attack", text: "bloquea el impacto" },
    cubrir: { query: "cover protect", text: "se cubre para protegerse" },
    golpear: { query: "punch", text: "da un golpe directo" },
    patear: { query: "kick", text: "lanza una patada" },
    disparar: { query: "shoot gun", text: "dispara su arma" },
    apuntar: { query: "aim gun", text: "apunta fijamente" },
    espadazo: { query: "sword slash", text: "da un espadazo" },
    cortar: { query: "slice sword", text: "realiza un corte" },
    empujar: { query: "push", text: "empuja con fuerza" },
    agarrar: { query: "grab", text: "agarra firmemente" },
    lanzar: { query: "throw", text: "lanza algo por el aire" },
    esconderse: { query: "hide", text: "se esconde entre las sombras" },
    huir: { query: "run away", text: "huye rápidamente" },
    perseguir: { query: "chase", text: "comienza a perseguir" },
    mirar: { query: "stare", text: "mira fijamente" },
    observar: { query: "observe", text: "observa detenidamente" },
    analizar: { query: "analyze", text: "analiza la situación" },
    espiar: { query: "spy", text: "espía en silencio" },
    escuchar: { query: "listen", text: "agudiza el oído para escuchar" },
    llamar: { query: "call phone", text: "hace una llamada" },
    gritar: { query: "scream", text: "pega un grito ensordecedor" },
    susurrar: { query: "whisper", text: "susurra algo inaudible" },
    silenciar: { query: "shush", text: "pide silencio total" },
    acercarse: { query: "walk closer", text: "se acerca lentamente" },
    alejarse: { query: "walk away", text: "se aleja del lugar" },
    cruzar: { query: "cross arms", text: "se cruza de brazos" },
    entrar: { query: "enter door", text: "entra al lugar" },
    salir: { query: "leave door", text: "sale del lugar" },
    abrir: { query: "open door", text: "abre con cuidado" },
    cerrar: { query: "close door", text: "cierra de golpe" },
    romper: { query: "break", text: "rompe algo" },
    destruir: { query: "destroy", text: "destruye todo a su paso" },
    reparar: { query: "fix", text: "intenta reparar el daño" },
    buscar: { query: "search", text: "busca desesperadamente" },
    encontrar: { query: "find", text: "encuentra algo interesante" },
    recoger: { query: "pick up", text: "recoge algo del suelo" },
    dar: { query: "give", text: "da un objeto" },
    entregar: { query: "hand over", text: "hace una entrega" },
    robar: { query: "steal", text: "roba sigilosamente" },
    esposar: { query: "handcuffs", text: "coloca unas esposas" },
    liberar: { query: "free", text: "libera de las ataduras" },
    atar: { query: "tie up", text: "ata con fuerza" },
    desatar: { query: "untie", text: "desata los nudos" },
    curar: { query: "heal magic", text: "usa magia curativa" },
    vendar: { query: "bandage", text: "coloca un vendaje" },
    revivir: { query: "revive", text: "vuelve a la vida" },
    desmayar: { query: "faint", text: "cae inconsciente" },
    dormir: { query: "sleep", text: "se queda dormido/a" },
    despertar: { query: "wake up", text: "despierta de golpe" },
    sentarse: { query: "sit down", text: "toma asiento" },
    levantarse: { query: "stand up", text: "se pone de pie" },
    pararse: { query: "stand still", text: "se detiene en seco" },
    arrodillarse: { query: "kneel", text: "se arrodilla" },
    caer: { query: "fall down", text: "cae al suelo" },
    rodar: { query: "roll", text: "rueda por el piso" },
    saltar: { query: "jump", text: "da un gran salto" },
    escalar: { query: "climb", text: "comienza a escalar" },
    nadar: { query: "swim", text: "nada en el agua" },
    volar: { query: "fly", text: "alza el vuelo" },
    aterrizar: { query: "land hero", text: "aterriza con estilo" },
    firmar: { query: "sign paper", text: "firma el documento" },
    escribir: { query: "write", text: "escribe rápidamente" },
    leer: { query: "read book", text: "lee con atención" },
    mostrar: { query: "show", text: "muestra algo" },
    ocultar: { query: "hide object", text: "oculta algo en su ropa" },
    reir: { query: "laugh", text: "se ríe a carcajadas" },
    llorar: { query: "cry", text: "comienza a llorar" },
    enojarse: { query: "angry", text: "se enoja muchísimo" },
    calmarse: { query: "calm down", text: "intenta calmarse" },
    sonreir: { query: "smile", text: "sonríe dulcemente" },
    suspirar: { query: "sigh", text: "suelta un suspiro" },
    asentir: { query: "nod", text: "asiente con la cabeza" },
    negar: { query: "shake head", text: "niega rotundamente" },
    saludar: { query: "wave hello", text: "saluda con la mano" },
    despedirse: { query: "wave goodbye", text: "se despide" },
    abrazar: { query: "hug", text: "da un cálido abrazo" },
    agarrar_de_la_mano: { query: "hold hands", text: "toma de la mano" },
    tocar: { query: "touch", text: "toca suavemente" },
    empujar_fuera: { query: "push away", text: "empuja lejos" },
    interceptar: { query: "intercept", text: "intercepta el movimiento" },
    escanear: { query: "scan", text: "escanea el área" },
    hackear: { query: "typing hack", text: "hackea el sistema" }
};

// Generador automático de los comandos de arriba
Object.keys(accionesRol).forEach(comando => {
    bot.command(comando, async (ctx) => {
        const nombre = ctx.from.first_name;
        const datos = accionesRol[comando];
        
        // Busca el GIF
        const gifUrl = await buscarGif(datos.query);
        
        if (gifUrl) {
            await ctx.replyWithAnimation(gifUrl, {
                caption: `🎬 *${nombre}* ${datos.text}.`,
                parse_mode: 'Markdown'
            });
        } else {
            ctx.reply(`🎬 *${nombre}* ${datos.text}. (Sin imagen)`);
        }
    });
});

// ---------------------------------------------------------
// COMANDOS DE TEXTO LIBRE (Plantillas de Rol)
// ---------------------------------------------------------

// Comando /roltext (Para acciones libres)
bot.command('roltext', (ctx) => {
    // Separa el texto que el usuario escribió después del comando
    const texto = ctx.message.text.replace('/roltext', '').trim();
    const nombre = ctx.from.first_name;

    if (!texto) {
        return ctx.reply('⚠️ Formato incorrecto. Uso: `/roltext "Texto que digo" *acción que hago*`', { parse_mode: 'Markdown' });
    }

    ctx.reply(`*[ ${nombre} ]*\n\n${texto}`, { parse_mode: 'Markdown' });
});

// Comando /rolsusurrar
bot.command('rolsusurrar', (ctx) => {
    const texto = ctx.message.text.replace('/rolsusurrar', '').trim();
    const nombre = ctx.from.first_name;

    if (!texto) return ctx.reply('⚠️ ¿Qué quieres susurrar? Ejemplo: `/rolsusurrar "no hagas ruido"`', { parse_mode: 'Markdown' });

    ctx.reply(`*[ ${nombre} ] susurra:*\n\n_${texto}_`, { parse_mode: 'Markdown' });
});

// Comando /rolpensar
bot.command('rolpensar', (ctx) => {
    const texto = ctx.message.text.replace('/rolpensar', '').trim();
    const nombre = ctx.from.first_name;

    if (!texto) return ctx.reply('⚠️️ ¿Qué estás pensando? Ejemplo: `/rolpensar esto es extraño...`', { parse_mode: 'Markdown' });

    ctx.reply(`💭 *[ ${nombre} ] piensa:*\n\n( _${texto}_ )`, { parse_mode: 'Markdown' });
});

// Iniciar el bot
bot.launch().then(() => console.log('El bot está encendido y listo.'));

// Detener el bot de forma segura (buenas prácticas)
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
