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
    const guild = client.guilds.cache.get(GUILD_ID);

    if (!guild) {
      console.log("Guild tidak ditemukan.");
      return;
    }

    const channel = guild.channels.cache.get(CHANNEL_ID);

    if (!channel) {
      console.log("Channel tidak ditemukan.");
      return;
    }

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
    console.error(err);
  }
}

client.once("clientReady", async () => {
  console.log(`Login: ${client.user.tag}`);

  await client.guilds.fetch();

  connectVoice();
});

client.login(TOKEN);
