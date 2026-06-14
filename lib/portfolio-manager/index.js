const {
  getProduct
} = require(
  "./get-product"
);

const {
  upsertProduct
} = require(
  "./upsert-product"
);

const {
  markCampaignCreated
} = require(
  "./mark-campaign-created"
);

const {
  getNextWinner
} = require(
  "./get-next-winner"
);

module.exports = {

  getProduct,

  upsertProduct,

  markCampaignCreated,

  getNextWinner

};