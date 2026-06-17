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

function renderCampaignCommandCenter(
  campaign
) {

    const projectedRevenue =
  campaign.revenueProjection
    ?.projectedMonthlyRevenue || 0;

const revenueGoal =
  campaign.revenueGoal || 0;

document.getElementById(
  "workspaceLoading"
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

<div class="mission-panel">

  <div class="mission-header">

    Current Mission

  </div>

  <div class="mission-title">

    Build A Dominant
    ${campaign.name}
    Affiliate Business

  </div>

  <div class="mission-description">

    The AI workforce is actively building,
    operating and optimizing a long-term
    affiliate business around
    ${campaign.name}.

    Current focus:

    • Audience Growth

    • Content Production

    • Lead Capture

    • Conversion Optimization

    • Recurring Revenue Expansion

  </div>

  <div class="mission-grid">

    <div class="mission-stat">

      <div class="mission-stat-label">

        Revenue Target

      </div>

      <div class="mission-stat-value">

        $${Number(
          revenueGoal
        ).toLocaleString()}

      </div>

    </div>

    <div class="mission-stat">

      <div class="mission-stat-label">

        Projected Revenue

      </div>

      <div class="mission-stat-value">

        $${Number(
          projectedRevenue
        ).toLocaleString()}

      </div>

    </div>

    <div class="mission-stat">

      <div class="mission-stat-label">

        Confidence

      </div>

      <div class="mission-stat-value">

        97%

      </div>

    </div>

    <div class="mission-stat">

      <div class="mission-stat-label">

        AI Status

      </div>

      <div class="mission-stat-value">

        Operational

      </div>

    </div>

  </div>

</div>

<div class="timeline-panel">

  <div class="timeline-title">

    AI Mission Timeline

  </div>

  <div class="timeline-item">

    <div class="timeline-icon">
      ✓
    </div>

    <div class="timeline-content">

      <div class="timeline-step">

        Market Intelligence Acquired

      </div>

      <div class="timeline-agent">

        AI Researcher

      </div>

    </div>

  </div>

  <div class="timeline-item">

    <div class="timeline-icon">
      ✓
    </div>

    <div class="timeline-content">

      <div class="timeline-step">

        Audience Model Generated

      </div>

      <div class="timeline-agent">

        Campaign Intelligence Engine

      </div>

    </div>

  </div>

  <div class="timeline-item">

    <div class="timeline-icon">
      ✓
    </div>

    <div class="timeline-content">

      <div class="timeline-step">

        Revenue Roadmap Generated

      </div>

      <div class="timeline-agent">

        Business Strategist

      </div>

    </div>

  </div>

  <div class="timeline-item">

    <div class="timeline-icon">
      ✓
    </div>

    <div class="timeline-content">

      <div class="timeline-step">

        Content Engine Prepared

      </div>

      <div class="timeline-agent">

        Content Strategist

      </div>

    </div>

  </div>

  <div class="timeline-item">

    <div class="timeline-icon">
      ✓
    </div>

    <div class="timeline-content">

      <div class="timeline-step">

        Production Workforce Ready

      </div>

      <div class="timeline-agent">

        Production Director

      </div>

    </div>

  </div>

</div>

`;

}

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

renderCampaignCommandCenter(
  campaign
);

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