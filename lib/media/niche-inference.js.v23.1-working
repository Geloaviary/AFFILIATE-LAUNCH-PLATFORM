const OPENAI_KEY =
  (process.env.OPENAI_API_KEY || "")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();

async function inferNiche({
  brand,
  url,
  title,
  description
}) {

  const prompt = `
Analyze this affiliate product.

Brand:
${brand}

URL:
${url}

Title:
${title || ""}

Description:
${description || ""}

Return JSON only:

{
  "niche": "",
  "audience": "",
  "keywords": []
}
`;

  const response = await fetch(
  "https://api.openai.com/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization":
        "Bearer " + OPENAI_KEY
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3
    })
  }
);

const data =
  await response.json();

if (data.error) {
  throw new Error(
    data.error.message
  );
}

const content =
  data.choices[0]
      .message.content;

const jsonStr =
  content
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

const json =
  JSON.parse(jsonStr);

return {
  brand,
  ...json
};

}

module.exports = {
  inferNiche
};