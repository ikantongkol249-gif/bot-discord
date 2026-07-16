const { Client, GatewayIntentBits } = require("discord.js");
const voice = require("@discordjs/voice");

console.log("discord.js version:", require("discord.js").version);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once("clientReady", async () => {
  console.log("Login:", client.user.tag);

  const guild = await client.guilds.fetch(process.env.GUILD_ID);
  console.log("Guild:", guild.name);
  console.log("Guild ID:", guild.id);
  console.log("voiceAdapterCreator:", typeof guild.voiceAdapterCreator);

  const channel = await client.channels.fetch(process.env.CHANNEL_ID);
  console.log("Channel:", channel.name);
  console.log("Channel Type:", channel.type);

  try {
    const connection = voice.joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    });

    console.log("Join berhasil.");

    await voice.entersState(
      connection,
      voice.VoiceConnectionStatus.Ready,
      30000
    );

    console.log("Voice Ready.");
  } catch (e) {
    console.error(e);
  }
});

client.login(process.env.TOKEN);
