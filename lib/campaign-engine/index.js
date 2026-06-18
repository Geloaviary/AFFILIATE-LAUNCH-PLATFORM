const {
  createCampaignJobs
} = require(
  "./create-campaign-jobs"
);

const {
  createCampaignIndex,
  getCampaignIndex,
  deleteCampaignIndex
} = require(
  "./campaign-index"
);

const {
  getCampaignProduction
} = require(
  "./get-campaign-production"
);

module.exports = {

  createCampaignJobs,

  createCampaignIndex,

  getCampaignIndex,

  deleteCampaignIndex,

  getCampaignProduction

};