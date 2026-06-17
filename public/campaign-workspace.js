const params =
  new URLSearchParams(
    window.location.search
  );

const campaignId =
  params.get("id");

console.log(
  "Campaign ID:",
  campaignId
);

async function loadCampaign(){

  if (!campaignId) {

    document.getElementById(
      "workspaceLoading"
    ).innerHTML = `

<div class="card">

  No campaign selected.

</div>

`;

    return;

  }

  try {

    const response =
      await fetch(
        "/api/manage-campaigns?userId=admin"
      );

    const data =
      await response.json();

    console.log(
      "Campaigns:",
      data.campaigns
    );

    const campaign =
      (data.campaigns || [])
        .find(
          item =>
            item.id ===
            campaignId
        );

    if (!campaign) {

      document.getElementById(
        "workspaceLoading"
      ).innerHTML = `

<div class="card">

  Campaign not found.

</div>

`;

      return;

    }

    console.log(
      "Campaign Loaded:",
      campaign
    );

    document.getElementById(
      "workspaceLoading"
    ).innerHTML = `

<div class="card">

  Campaign Loaded:

  <br><br>

  ${campaign.name}

</div>

`;

  } catch (e) {

    console.error(
      e
    );

    document.getElementById(
      "workspaceLoading"
    ).innerHTML = `

<div class="card">

  Failed to load campaign.

</div>

`;

  }

}

loadCampaign();