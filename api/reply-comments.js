exports.default = async function handler(req, res) {
  console.log("Comment webhook:", req.body);
  return res.status(200).json({ success: true });
};