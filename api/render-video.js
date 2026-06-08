const fetch = require("node-fetch");

module.exports = async (req, res) => {
try {
const { narration, scenes } = req.body;

const response = await fetch(
  "http://140.245.95.15:3000/render-scenes",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      narration,
      scenes
    })
  }
);

const data = await response.json();

return res.status(200).json(data);

} catch (error) {
return res.status(500).json({
success: false,
error: error.message
});
}
};
