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

let connection;

async function connectVoice() {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);

    console.log("===== GUILD =====");
    console.log("Nama:", guild.name);
    console.log("ID:", guild.id);
    console.log("Adapter:", typeof guild.voiceAdapterCreator);

    const channel = await client.channels.fetch(CHANNEL_ID);

    console.log("===== CHANNEL =====");
    console.log("Nama:", channel.name);
    console.log("ID:", channel.id);
    console.log("Type:", channel.type);

    connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    });

    await entersState(connection, VoiceConnectionStatus.Ready, 30000);

    console.log("✅ Bot berhasil masuk voice.");
  } catch (err) {
    console.error("❌ ERROR:");
    console.error(err);
  }
}

client.once("clientReady", async () => {
  console.log(`✅ Login sebagai ${client.user.tag}`);
  connectVoice();
});

client.on("error", console.error);
process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

client.login(TOKEN);
