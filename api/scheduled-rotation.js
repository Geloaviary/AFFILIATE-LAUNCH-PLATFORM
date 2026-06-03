exports.default = async function handler(req, res) {
  console.log("Rotation check");
  return res.status(200).json({ success: true });
};