exports.default = async function handler(req, res) {
  return res.status(200).json({ bandwidthGB: 0, bandwidthPercent: 0, functionCalls: 0, functionPercent: 0, warning: false });
};