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

      container.innerHTML = `

<div class="card">

  <h2>
    Production Workspace
  </h2>

  <p>
    Production queue ready.
  </p>

</div>

`;

      break;

    case "publishing":

      container.innerHTML = `

<div class="card">

  <h2>
    Publishing Workspace
  </h2>

  <p>
    Distribution center ready.
  </p>

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

loadCampaign();