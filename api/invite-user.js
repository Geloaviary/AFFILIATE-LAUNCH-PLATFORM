exports.default = async function handler(req, res) {
  return res.status(200).json({ success: true, message: "Invite sent (Clerk handles this)" });
};