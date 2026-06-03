const { Configuration, OpenAIApi } = require("openai");

exports.default = async function handler(req, res) {
  const { campaignId, winningStyle, userId } = req.body;
  try {
    const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Generate 5 new video concepts in "${winningStyle}" style. Return JSON array with: style, hook, script, visuals, captions, hashtags, musicSuggestion, duration.` }],
      temperature: 0.9,
    });
    const content = completion.data.choices[0].message.content;
    const jsonStr = content.replace(/```json/g, "").replace(/```/g, "").trim();
    const clones = JSON.parse(jsonStr);
    return res.status(200).json({ success: true, clones: Array.isArray(clones) ? clones : clones.videos || [] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};