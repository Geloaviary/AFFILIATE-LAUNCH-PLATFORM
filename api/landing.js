const { kv } = require("@vercel/kv");

exports.default = async function handler(req, res) {
  const { c } = req.query;
  const record = await kv.get(`landing-${c}`);
  if (!record) return res.status(404).send("Not found");
  res.setHeader("Content-Type", "text/html");
  return res.send(record.html);
};