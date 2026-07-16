const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once("clientReady", async () => {
  console.log(`✅ Login sebagai ${client.user.tag}`);

  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);

    console.log("Guild:", guild.name);
    console.log("ID:", guild.id);

    const channel = await client.channels.fetch(process.env.CHANNEL_ID);

    console.log("Channel:", channel.name);
    console.log("Type:", channel.type);
    console.log("voiceAdapterCreator:", typeof guild.voiceAdapterCreator);
  } catch (err) {
    console.error(err);
  }
});

client.login(process.env.TOKEN);
