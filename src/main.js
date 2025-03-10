const {
  Client,
  GatewayIntentBits,
  Partials,
  ActivityType
} = require("discord.js");

const { getFreeGames } = require("./utils/getGames");

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});
require("dotenv").config();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity({
    name: "Free Games",
    type: ActivityType.Watching
  });
});

const formatDate = (date) => {
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
};

client.on("messageCreate", async (msg) => {
  if (msg.content === "!freegames") {
    const freeGames = await getFreeGames();

    if (freeGames.length > 0) {
      const games = freeGames.map((game) => {
        let tanggal = "";
        if (game.promotions.promotionalOffers[0]) {
          const start =
            game.promotions.promotionalOffers[0].promotionalOffers[0].startDate;
          const end =
            game.promotions.promotionalOffers[0].promotionalOffers[0].endDate;
          tanggal = `${formatDate(new Date(start))} - ${formatDate(
            new Date(end)
          )}`;
        } else {
          const start =
            game.promotions.upcomingPromotionalOffers[0].promotionalOffers[0]
              .startDate;
          const end =
            game.promotions.upcomingPromotionalOffers[0].promotionalOffers[0]
              .endDate;
          tanggal = `${formatDate(new Date(start))} - ${formatDate(
            new Date(end)
          )}`;
        }
        return `${game.title} - ${tanggal}`;
      });

      msg.channel.send(games.join("\n"));
    } else {
      msg.channel.send("No free games available.");
    }
  }
});

client.login(process.env.TOKEN);
