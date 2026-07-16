const { Client, GatewayIntentBits } = require("discord.js");
const {
  joinVoiceChannel,
  VoiceConnectionStatus,
  entersState,
} = require("@discordjs/voice");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

let connection;

async function connectVoice() {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);

    connection = joinVoiceChannel({
      channelId: CHANNEL_ID,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    });

    await entersState(connection, VoiceConnectionStatus.Ready, 30000);

    console.log("✅ Bot berhasil masuk voice channel.");

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      console.log("⚠️ Terputus. Mencoba reconnect...");

      try {
        await entersState(connection, VoiceConnectionStatus.Connecting, 5000);
        console.log("✅ Berhasil reconnect.");
      } catch {
        console.log("🔄 Rejoin voice channel...");
        connectVoice();
      }
    });

  } catch (err) {
    console.error("❌ Gagal join voice:", err);
    setTimeout(connectVoice, 10000);
  }
}

client.once("ready", async () => {
  console.log(`Login sebagai ${client.user.tag}`);
  connectVoice();
});

client.on("error", console.error);

process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

client.login(TOKEN);
