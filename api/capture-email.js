exports.default = async function handler(req, res) {
  const { email, campaignId } = req.body;
  console.log("Email captured:", email, campaignId);
  return res.redirect(`/api/landing?c=${campaignId}&success=1`);
};