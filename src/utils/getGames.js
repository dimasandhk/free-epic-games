const axios = require("axios");

export const getFreeGames = async () => {
  const response = await axios.get(
    "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?country=ID"
  );
  const games = response.data.data.Catalog.searchStore.elements;
  const ruledGames = games.filter(
    (game) => game.promotions && game.offerType == "BASE_GAME"
  );

  const freeGames = ruledGames.filter((game) => {
    if (game.promotions.promotionalOffers.length > 0) {
      return game.promotions.promotionalOffers[0].promotionalOffers.find(
        (offer) => offer.discountSetting.discountPercentage === 0
      );
    } else if (game.promotions.upcomingPromotionalOffers.length > 0) {
      return game.promotions.upcomingPromotionalOffers[0].promotionalOffers.find(
        (offer) => offer.discountSetting.discountPercentage === 0
      );
    } else {
      return [];
    }
  });

  return freeGames;
};
