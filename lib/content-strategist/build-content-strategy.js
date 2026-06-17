function buildContentStrategy({
  winner = {},
  campaignIntelligence = {},
  productIntelligence = {},
  videos = []
} = {}) {

  const recommendations = [];

  const brandIdentity = {

  brandName:
    `${winner.name} Growth Hub`,

  slogan:
    `Helping users succeed with ${winner.name}`,

  logoPrompt:
    `Create a professional logo for ${winner.name} Growth Hub.

Niche:
${winner.category || ""}

Style:
Modern, trustworthy, premium, clean.

Requirements:

- Flat design
- Transparent background
- Social media friendly
- Icon + text version
- Suitable for TikTok, YouTube, Facebook, Instagram
- Highly recognizable
`,

  bannerPrompt:
    `Create a social media banner for ${winner.name} Growth Hub.

Audience:
${campaignIntelligence.audience || ""}

Focus:

- authority
- trust
- results
- education

Include:

- niche relevant visuals
- modern design
- premium look
- call to action

Formats:

- YouTube Banner
- Facebook Cover
- X Header
`,

tiktokBio:
  `Helping users discover the best ${winner.category || winner.name} tools, tips and strategies.`,

instagramBio:
  `Reviews, tutorials and growth strategies for ${winner.name}. Follow for actionable insights.`,

youtubeDescription:
  `Welcome to ${winner.name} Growth Hub.

We publish reviews, tutorials, comparisons and case studies to help users achieve better results with ${winner.name}.

Subscribe for new content and resources.`,

facebookDescription:
  `${winner.name} Growth Hub helps users learn, compare and succeed using the best tools, strategies and resources in this niche.`,

profileKeywords: [

  winner.name,

  winner.category || "",

  "reviews",

  "tutorials",

  "comparisons",

  "case studies",

  "affiliate marketing"

]

};

const hooks = [

  `Nobody talks about this ${winner.name} strategy`,

  `I wish I knew this before using ${winner.name}`,

  `The biggest mistake beginners make`,

  `How people are getting results with ${winner.name}`,

  `Before you buy ${winner.name}, watch this`

];

const ctas = [

  `Comment INFO for the guide`,

  `Link in bio to learn more`,

  `DM START to get access`,

  `Check the resource below`,

  `Try ${winner.name} using the link provided`

];

const leadMagnets = [

  `${winner.name} Starter Guide`,

  `${winner.name} Checklist`,

  `${winner.name} Setup Blueprint`

];

const commentKeywords = [

  "info",

  "guide",

  "start",

  "checklist",

  "tutorial"

];

  for (const video of videos) {

    let platform = "TikTok";
    let score = 70;
    let bestPostTime = "19:00";

    switch (video.type) {

      case "short":

        platform =
          "TikTok";

        score =
          95;

        bestPostTime =
          "19:00";

        break;

      case "tutorial":

        platform =
          "YouTube Shorts";

        score =
          92;

        bestPostTime =
          "12:00";

        break;

      case "review":

        platform =
          "YouTube";

        score =
          90;

        bestPostTime =
          "18:00";

        break;

      case "comparison":

        platform =
          "YouTube";

        score =
          94;

        bestPostTime =
          "20:00";

        break;

      case "listicle":

        platform =
          "Facebook Reels";

        score =
          88;

        bestPostTime =
          "17:00";

        break;

    }

    recommendations.push({

      ...video,

      platform,

      score,

      bestPostTime

    });

  }

  const sortedVideos =
    [...recommendations]
      .sort(
        (a, b) =>
          b.score - a.score
      );

  return {

    brandIdentity,

    recommendedPostingOrder:

      sortedVideos.map(
        video => video.type
      ),

    platformRecommendations:

      sortedVideos.map(
        video => ({

          video:
            video.type,

          platform:
            video.platform,

          score:
            video.score

        })
      ),

    dailySchedule:

      sortedVideos
        .slice(0, 3)
        .map(
          (video, index) => ({

            time:

              [
                "09:00",
                "13:00",
                "19:00"
              ][index],

            video:
              video.type,

            platform:
              video.platform

          })
        ),

        contentPillars: [

          winner.category ||

          campaignIntelligence.audience ||

          "Education",

          "Reviews",

          "Tutorials",

          "Comparisons",

          "Case Studies"

        ],

           hooks,

           ctas,

           leadMagnets,

           commentKeywords,

           videos:

             recommendations

  };

}

module.exports = {
  buildContentStrategy
};