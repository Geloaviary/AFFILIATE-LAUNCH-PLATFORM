const params =
  new URLSearchParams(
    window.location.search
  );

const campaignId =
  params.get("id");

let currentCampaign =
  null;

let currentView =
  "overview";

console.log(
  "Campaign ID:",
  campaignId
);

function renderCampaignCommandCenter(
  campaign
) {

    const revenueGoal =
        campaign.revenueGoal || 0;

    const projectedRevenue =
        campaign.revenueProjection
         ?.projectedMonthlyRevenue || 0;

    const revenueGap =
         projectedRevenue -
         revenueGoal;

document.getElementById(
  "workspaceHeader"
).innerHTML = `

<div class="command-hero">

  <div class="hero-label">

    AI Affiliate Business
    Operating System

  </div>

  <div class="hero-title">

    ${campaign.name} Growth Hub

  </div>

  <div class="hero-subtitle">

    AI Campaign Command Center

  </div>

  <div class="metric-grid">

    <div class="metric-card">

      <div class="metric-label">

        Revenue Goal

      </div>

      <div class="metric-value">

        $${Number(
          revenueGoal
        ).toLocaleString()}

      </div>

    </div>

    <div class="metric-card">

      <div class="metric-label">

        Projected Revenue

      </div>

      <div class="metric-value">

        $${Number(
          projectedRevenue
        ).toLocaleString()}

      </div>

    </div>

    <div class="metric-card">

      <div class="metric-label">

        Campaign Status

      </div>

      <div class="metric-value">

        ${campaign.status}

      </div>

    </div>

    <div class="metric-card">

      <div class="metric-label">

        Niche

      </div>

      <div class="metric-value">

        ${campaign.niche}

      </div>

    </div>

  </div>

  <div class="ai-panel">

    <div class="ai-title">

      AI Workforce Status

    </div>

    <div class="agent-list">

      <div class="agent">
        ✓ Researcher Active
      </div>

      <div class="agent">
        ✓ Strategist Active
      </div>

      <div class="agent">
        ✓ Content Director Active
      </div>

      <div class="agent">
        ✓ Production Director Active
      </div>

      <div class="agent">
        ✓ Publisher Monitoring
      </div>

      <div class="agent">
        ✓ Revenue Optimizer Active
      </div>

        </div>

  </div>

</div>

</div>

`;

renderCurrentView();

}

function switchView(
  view
){

  currentView =
    view;

  renderCurrentView();

}

function renderCurrentView(){

  const container =
    document.getElementById(
      "workspaceView"
    );

  if (!container) {
    return;
  }

  switch(currentView){

    case "overview":

      container.innerHTML = `

<div class="card">

  <h2>
    Campaign Overview
  </h2>

  <p>
    Campaign ID:
    ${currentCampaign?.id}
  </p>

  <p>
    Product:
    ${currentCampaign?.name}
  </p>

</div>

`;

      break;

    case "tasks":

      container.innerHTML = `

<div class="card">

  <h2>
    Active Tasks
  </h2>

  <ul>

    <li>
      Generate Brand Assets
    </li>

    <li>
      Create Social Accounts
    </li>

    <li>
      Approve Content Strategy
    </li>

    <li>
      Launch Production Queue
    </li>

  </ul>

</div>

`;

      break;

    case "research":

      container.innerHTML = `

<div class="card">

  <h2>
    Research Workspace
  </h2>

  <p>
    Affiliate market intelligence available.
  </p>

</div>

`;

      break;

    case "intelligence":

      container.innerHTML = `

<div class="card">

  <h2>
    Campaign Intelligence
  </h2>

  <p>
    Audience model loaded.
  </p>

</div>

`;

      break;

    case "revenue":

      container.innerHTML = `

<div class="card">

  <h2>
    Revenue Command Center
  </h2>

  <p>
    Goal:
    $${Number(
      currentCampaign?.revenueGoal || 0
    ).toLocaleString()}
  </p>

</div>

`;

      break;

    case "strategy":

      container.innerHTML = `

<div class="card">

  <h2>
    Strategy Workspace
  </h2>

  <p>
    Campaign strategy loaded.
  </p>

</div>

`;

      break;

    case "production":

  const production =
    currentCampaign?.workspace
      ?.production || {};

  const queuedCount =

  currentCampaign
    ?.campaignPackage
    ?.productionQueue
    ?.filter(
      item =>
        item.status ===
        "queued"
    )
    .length || 0;

  const productionAssets =
    currentCampaign?.campaignPackage
      ?.productionAssets || [];

  const pendingApprovals =
    currentCampaign?.workspace
      ?.pendingApprovals || 0;

  container.innerHTML = `

<div class="card">

  <h2>
    Production Command Center
  </h2>

  <div class="health-grid">

    <div class="health-card">

      <div class="health-title">
        Queued
      </div>

      <div class="health-description">

         ${queuedCount}

      </div>

    </div>

    <div class="health-card">

      <div class="health-title">
        Processing
      </div>

      <div class="health-description">

       ${production.processing || 0}

      </div>

    </div>

    <div class="health-card">

      <div class="health-title">
        Completed
      </div>

      <div class="health-description">

        ${production.completed || 0}

      </div>

    </div>

    <div class="health-card">

      <div class="health-title">
        Failed
      </div>

      <div class="health-description">

        ${production.failed || 0}

      </div>

    </div>

  </div>

  <div class="system-health">

    <div class="system-item">

      <strong>
        Pending Approvals
      </strong>

      <span>
        ${pendingApprovals}
      </span>

    </div>

    <div class="system-item">

      <strong>
        Production Assets
      </strong>

      <span>
        ${productionAssets.length}
      </span>

    </div>

  </div>

</div>

<div class="card">

  <h2>
    Latest Production Assets
  </h2>

  ${

    productionAssets.length

      ? productionAssets
  .slice(-10)
  .reverse()
  .map(asset => `

<div class="task-card">

  <div class="task-title">

    ${asset.title || asset.type}

 <div class="task-description">

  ${
    asset.approvalStatus === "approved"

      ? "✅ Approved"

      : asset.approvalStatus === "rejected"

      ? "❌ Rejected"

      : "⏳ Pending Approval"
  }

</div>

  ${
  asset.approvalStatus !== "pending"

    ? ""

    : `

<div style="
  display:flex;
  gap:10px;
  margin-top:12px;
">

  <button
    class="primary-btn"
    onclick="
      approveAsset(
        '${asset.id}'
      )
    "
  >
    Approve
  </button>

  <button
    class="secondary-btn"
    onclick="
      rejectAsset(
        '${asset.id}'
      )
    "
  >
    Reject
  </button>

</div>

`
}

    <button
  class="primary-btn"
  onclick="
    approveAsset(
      '${asset.id}'
    )
  "
>
  Approve
</button>

    <button
  class="secondary-btn"
  onclick="
    rejectAsset(
      '${asset.id}'
    )
  "
>
  Reject
</button>

  </div>

</div>

`)
  .join("")
          

      : `

        <p>

          No production assets yet.

        </p>

      `

  }

</div>

`;

  break;

    case "publishing":

  const publishingQueue =
    currentCampaign?.campaignPackage
      ?.publishingQueue || [];

  container.innerHTML = `

<div class="card">

  <h2>
    Publishing Queue
  </h2>

  <p>

    Assets Ready For Distribution

  </p>

</div>

<div class="card">

  ${

    publishingQueue.length

      ? publishingQueue
          .slice()
          .reverse()
          .map(asset => `

<div class="task-card">

  <div class="task-title">

    ${asset.title || asset.type}

  </div>

  <div class="task-description">

    ${
      asset.publishingStatus ||
      "queued"
    }

  </div>

</div>

`)
          .join("")

      : `

<p>

No approved assets ready for publishing.

</p>

`

  }

</div>

`;

  break;

    case "analytics":

      container.innerHTML = `

<div class="card">

  <h2>
    Analytics Workspace
  </h2>

  <p>
    Performance metrics available.
  </p>

</div>

`;

      break;

  }

}

async function loadCampaign(){

  if (!campaignId) {

document.getElementById(
  "workspaceView"
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
      "workspaceView"
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

currentCampaign =
  campaign;

const revenueGoal =
  campaign.revenueGoal || 0;

const projectedRevenue =
  campaign.revenueProjection
    ?.projectedMonthlyRevenue || 0;

const revenueGap =
  projectedRevenue -
  revenueGoal;

document.getElementById(
  "rightPanel"
).innerHTML = `

<div class="side-card">

  <div class="section-title">

    Revenue Command Center

  </div>

  <div class="side-metric">

    <span>Target</span>

    <strong>
      $${Number(
        revenueGoal
      ).toLocaleString()}
    </strong>

  </div>

  <div class="side-metric">

    <span>Projected</span>

    <strong>
      $${Number(
        projectedRevenue
      ).toLocaleString()}
    </strong>

  </div>

  <div class="side-metric">

    <span>Gap</span>

    <strong>
      +$${Number(
        revenueGap
      ).toLocaleString()}
    </strong>

  </div>

  <div class="side-metric">

    <span>Confidence</span>

    <strong>
      97%
    </strong>

  </div>

</div>

<div class="side-card">

  <div class="section-title">

    AI Activity Feed

  </div>

  <div class="activity-item">

    🤖 Researcher completed market analysis

  </div>

  <div class="activity-item">

    🧠 Strategist generated revenue roadmap

  </div>

  <div class="activity-item">

    🎬 Content Director prepared hooks

  </div>

  <div class="activity-item">

    🚀 Production Director awaiting approval

  </div>

</div>

<div class="side-card">

  <div class="section-title">

    AI Workforce Monitor

  </div>

  <div class="activity-item">

    🟢 Researcher Online

  </div>

  <div class="activity-item">

    🟢 Strategist Online

  </div>

  <div class="activity-item">

    🟢 Content Director Online

  </div>

  <div class="activity-item">

    🟡 Production Director Idle

  </div>

</div>

`;

renderCampaignCommandCenter(
  campaign
);

} catch (e) {

    console.error(
      e
    );

    document.getElementById(
        "workspaceView"
    ).innerHTML = `

<div class="card">

  Failed to load campaign.

</div>

`;

  }

}

async function approveAsset(
  assetId
) {

  await fetch(
    "/api/manage-campaigns",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify({

        action:
          "update-production-asset",

        campaignId,

        assetId,

        status:
          "approved"

      })
    }
  );

  loadCampaign();

}

async function rejectAsset(
  assetId
) {

  await fetch(
    "/api/manage-campaigns",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify({

        action:
          "update-production-asset",

        campaignId,

        assetId,

        status:
          "rejected"

      })
    }
  );

  loadCampaign();

}

loadCampaign();