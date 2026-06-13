function buildContentStrategy({
  winner = {},
  campaignIntelligence = {},
  productIntelligence = {},
  videos = []
} = {}) {

  const recommendations = [];

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

    videos:

      recommendations

  };

}

module.exports = {
  buildContentStrategy
};