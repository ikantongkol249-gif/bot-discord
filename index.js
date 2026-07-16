const {
  Client,
  GatewayIntentBits,
  ChannelType,
} = require("discord.js");

const {
  joinVoiceChannel,
  entersState,
  VoiceConnectionStatus,
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

client.once("clientReady", async () => {
  console.log(`✅ Login sebagai ${client.user.tag}`);

  try {
    const guild = await client.guilds.fetch(GUILD_ID);

    const channel = await client.channels.fetch(CHANNEL_ID);

    if (!channel) {
      throw new Error("Channel tidak ditemukan.");
    }

    if (
      channel.type !== ChannelType.GuildVoice &&
      channel.type !== ChannelType.GuildStageVoice
    ) {
      throw new Error("CHANNEL_ID bukan voice channel.");
    }

    connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    });

    await entersState(
      connection,
      VoiceConnectionStatus.Ready,
      30000
    );

    console.log("✅ Bot berhasil masuk VC.");

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      console.log("🔄 Reconnecting...");

      try {
        await entersState(
          connection,
          VoiceConnectionStatus.Connecting,
          5000
        );
      } catch {
        connection.destroy();
        process.exit(1);
      }
    });

  } catch (err) {
    console.error(err);
  }
});

client.login(TOKEN);
