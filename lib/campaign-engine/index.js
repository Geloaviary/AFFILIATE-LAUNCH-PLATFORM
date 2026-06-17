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

module.exports = {

  createCampaignJobs,

  createCampaignIndex,

  getCampaignIndex,

  deleteCampaignIndex

};