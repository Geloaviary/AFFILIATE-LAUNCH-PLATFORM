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

if (!campaignId) {

  document.getElementById(
    "workspaceLoading"
  ).innerHTML = `

<div class="card">

  No campaign selected.

</div>

`;

}