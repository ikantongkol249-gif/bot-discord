const { Client, GatewayIntentBits } = require("discord.js");
const {
  joinVoiceChannel,
  VoiceConnectionStatus,
  entersState,
} = require("@discordjs/voice");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

let connection = null;

async function connectVoice() {
  try {
    const guild = client.guilds.cache.get(GUILD_ID);

    if (!guild) {
      console.log("❌ Guild tidak ditemukan.");
      return;
    }

    connection = joinVoiceChannel({
      channelId: CHANNEL_ID,
      guildId: GUILD_ID,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    });

    await entersState(connection, VoiceConnectionStatus.Ready, 30000);

    console.log("✅ Bot berhasil masuk voice channel.");

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      console.log("⚠️ Terputus, mencoba reconnect...");

      try {
        await entersState(connection, VoiceConnectionStatus.Connecting, 5000);
        console.log("✅ Reconnect berhasil.");
      } catch {
        console.log("🔄 Rejoin voice...");
        connection.destroy();
        setTimeout(connectVoice, 5000);
      }
    });

  } catch (err) {
    console.error("❌ Gagal join voice:", err);
    setTimeout(connectVoice, 10000);
  }
}

client.once("ready", async () => {
  console.log(`✅ Login sebagai ${client.user.tag}`);

  await client.guilds.fetch();
  connectVoice();
});

client.on("error", console.error);

process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

client.login(TOKEN);
