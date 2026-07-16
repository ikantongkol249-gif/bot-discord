const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("clientReady", () => {
  console.log("Login:", client.user.tag);

  console.log(
    "Guilds:",
    client.guilds.cache.map(g => `${g.name} | ${g.id}`)
  );
});

client.login(process.env.TOKEN);
