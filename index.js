const { Client, GatewayIntentBits, ChannelType } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once("clientReady", async () => {
  const channel = await client.channels.fetch(process.env.CHANNEL_ID);

  console.log("Nama:", channel.name);
  console.log("ID:", channel.id);
  console.log("Type:", channel.type);
  console.log("Guild:", channel.guild?.name);
});

client.login(process.env.TOKEN);
