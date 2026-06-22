function buildBrandKit(
  winner = {}
) {

  const name =
    winner?.name ||
    "Brand";

  return {

    logoPrompt:

`Create a modern professional logo for a social media channel focused on ${name}. Clean typography, strong branding, highly readable profile icon, transparent background.`,

    bannerPrompt:

`Create a YouTube and Facebook banner for a channel focused on ${name}. Modern digital marketing style, clear value proposition, professional layout, optimized for social media headers.`,

    profileImagePrompt:

`Create a profile image for a content brand about ${name}. Circular composition, professional, recognizable at small sizes.`,

    channelTheme:
      "modern technology",

    toneOfVoice:
      "educational"

  };

}

module.exports = {
  buildBrandKit
};