const { kv } = require("@vercel/kv");

exports.default = async function handler(req, res) {
  const { userId } = req.query;
  const keys = await kv.get(`keys-${userId}`);
  return res.status(200).json(keys || {});
};