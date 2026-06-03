exports.default = async function handler(req, res) {
  return res.status(200).json({ time: "11:00 AM", hour: 11 });
};