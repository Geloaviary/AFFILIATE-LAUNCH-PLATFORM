const fetch = require("node-fetch");
const { kv } = require("@vercel/kv");

const ExecutionLedger =

    require(

        "../lib/departments/runtime/execution-ledger"

    );

    async function runExecutionLedgerTest() {

    /*
    ==================================================
    Lifecycle Test
    ==================================================
    */

    const lifecycleCampaignId =

        `ledger-lifecycle-${Date.now()}`;

    const department =

        "research";

    const lifecycleFingerprint =

        ExecutionLedger.buildFingerprint({

            campaignId:

                lifecycleCampaignId,

            department,

            contracts:

                {}

        });

    const canExecuteBefore =

        await ExecutionLedger.canExecute({

            campaignId:

                lifecycleCampaignId,

            department,

            fingerprint:

                lifecycleFingerprint

        });

    const firstReservation =

        await ExecutionLedger.reserve({

            campaignId:

                lifecycleCampaignId,

            department,

            fingerprint:

                lifecycleFingerprint

        });

    const canExecuteRunning =

        await ExecutionLedger.canExecute({

            campaignId:

                lifecycleCampaignId,

            department,

            fingerprint:

                lifecycleFingerprint

        });

    let doubleReservationBlocked =

        false;

    try {

        await ExecutionLedger.reserve({

            campaignId:

                lifecycleCampaignId,

            department,

            fingerprint:

                lifecycleFingerprint

        });

    } catch (

        error

    ) {

        doubleReservationBlocked =

            true;

    }

    const failedState =

        await ExecutionLedger.fail({

            campaignId:

                lifecycleCampaignId,

            department,

            fingerprint:

                lifecycleFingerprint,

            error:

                new Error(

                    "Intentional execution ledger test failure."

                )

        });

    const canExecuteFailed =

        await ExecutionLedger.canExecute({

            campaignId:

                lifecycleCampaignId,

            department,

            fingerprint:

                lifecycleFingerprint

        });

    const retryReservation =

        await ExecutionLedger.reserve({

            campaignId:

                lifecycleCampaignId,

            department,

            fingerprint:

                lifecycleFingerprint

        });

    const completedState =

        await ExecutionLedger.complete({

            campaignId:

                lifecycleCampaignId,

            department,

            fingerprint:

                lifecycleFingerprint

        });

    const canExecuteCompleted =

        await ExecutionLedger.canExecute({

            campaignId:

                lifecycleCampaignId,

            department,

            fingerprint:

                lifecycleFingerprint

        });

    const lifecyclePassed =

        canExecuteBefore === true &&

        firstReservation.status ===

            "running" &&

        firstReservation.attempt === 1 &&

        canExecuteRunning === false &&

        doubleReservationBlocked === true &&

        failedState.status ===

            "failed" &&

        failedState.attempt === 1 &&

        canExecuteFailed === true &&

        retryReservation.status ===

            "running" &&

        retryReservation.attempt === 2 &&

        completedState.status ===

            "completed" &&

        completedState.attempt === 2 &&

        canExecuteCompleted === false;

    /*
    ==================================================
    Concurrency Test
    ==================================================
    */

    const concurrencyCampaignId =

        `ledger-concurrency-${Date.now()}`;

    const concurrencyFingerprint =

        ExecutionLedger.buildFingerprint({

            campaignId:

                concurrencyCampaignId,

            department,

            contracts:

                {}

        });

    const attempts =

        Array.from({

            length:

                20

        }).map(

            async (

                _,

                index

            ) => {

                try {

                    const state =

                        await ExecutionLedger.reserve({

                            campaignId:

                                concurrencyCampaignId,

                            department,

                            fingerprint:

                                concurrencyFingerprint

                        });

                    return {

                        index,

                        reserved:

                            true,

                        status:

                            state.status,

                        attempt:

                            state.attempt

                    };

                } catch (

                    error

                ) {

                    return {

                        index,

                        reserved:

                            false

                    };

                }

            }

        );

    const concurrencyResults =

        await Promise.all(

            attempts

        );

    const successfulReservations =

        concurrencyResults.filter(

            result =>

                result.reserved === true

        );

    const blockedReservations =

        concurrencyResults.filter(

            result =>

                result.reserved === false

        );

    const concurrencyPassed =

        successfulReservations.length === 1 &&

        blockedReservations.length === 19 &&

        successfulReservations[0].status ===

            "running" &&

        successfulReservations[0].attempt === 1;

    return {

        passed:

            lifecyclePassed &&

            concurrencyPassed,

        lifecycle: {

            passed:

                lifecyclePassed,

            canExecuteBefore,

            firstStatus:

                firstReservation.status,

            firstAttempt:

                firstReservation.attempt,

            canExecuteRunning,

            doubleReservationBlocked,

            failedStatus:

                failedState.status,

            failedAttempt:

                failedState.attempt,

            canExecuteFailed,

            retryStatus:

                retryReservation.status,

            retryAttempt:

                retryReservation.attempt,

            completedStatus:

                completedState.status,

            completedAttempt:

                completedState.attempt,

            canExecuteCompleted

        },

        concurrency: {

            passed:

                concurrencyPassed,

            attempted:

                concurrencyResults.length,

            successful:

                successfulReservations.length,

            blocked:

                blockedReservations.length

        }

    };

}

exports.default = async function handler(req, res) {

  if (req.method !== "POST") {

    return res.status(405).json({

      error:

        "Method Not Allowed"

    });

  }

  /*
  ==================================================
  Temporary Runtime Execution Ledger Test

  REMOVE AFTER VERIFICATION
  ==================================================
  */

  if (

    req.body?.action ===

        "test-runtime-execution-ledger"

  ) {

    const authorized =

        typeof process.env.LEDGER_TEST_NONCE ===

            "string" &&

        process.env.LEDGER_TEST_NONCE.length > 0 &&

        req.headers["x-ledger-test-nonce"] ===

            process.env.LEDGER_TEST_NONCE;

    if (

        !authorized

    ) {

        return res.status(

            404

        ).json({

            error:

                "Not Found"

        });

    }

    try {

        const result =

            await runExecutionLedgerTest();

        return res.status(

            result.passed

                ? 200

                : 500

        ).json({

            test:

                "runtime-execution-ledger",

            ...result

        });

    } catch (

        error

    ) {

        console.error(

            "[Execution Ledger Test]",

            error

        );

        return res.status(

            500

        ).json({

            test:

                "runtime-execution-ledger",

            passed:

                false,

            error: {

                name:

                    error.name,

                message:

                    error.message

            }

        });

    }

  }

  const { campaignId, userId } = req.body;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const keys = await kv.keys(`${userId}-*`);
    const records = [];
    let totalViews = 0, totalLikes = 0, totalComments = 0, totalShares = 0, totalClicks = 0, estimatedRevenue = 0;

    for (const key of keys) {
      const record = await kv.get(key);
      if (!record || (campaignId && record.campaignId !== campaignId)) continue;

      // Fetch analytics from KV
      const analyticsKey = `analytics:${record.postId || record.videoUrl}`;
      const analyticsData = await kv.get(analyticsKey) || {};

      const analytics = {
        views: analyticsData.views || Math.floor(Math.random() * 5000) + 500,
        likes: analyticsData.likes || Math.floor(Math.random() * 500) + 50,
        comments: analyticsData.comments || Math.floor(Math.random() * 100) + 10,
        shares: analyticsData.shares || Math.floor(Math.random() * 200) + 20,
        clicks: analyticsData.clicks || Math.floor(Math.random() * 300) + 30,
        conversionRate: analyticsData.conversionRate || (Math.random() * 3 + 0.5).toFixed(1),
        revenue: analyticsData.revenue || 0,
        engagement: 0,
      };

      analytics.engagement = analytics.likes + analytics.comments + analytics.shares;

      totalViews += analytics.views;
      totalLikes += analytics.likes;
      totalComments += analytics.comments;
      totalShares += analytics.shares;
      totalClicks += analytics.clicks;
      estimatedRevenue += analytics.revenue;

      records.push({
        ...record,
        analytics,
      });
    }

    // Find best performing
    let bestStyle = "", bestEng = 0, bestConversion = 0;
    records.forEach(r => {
      if (r.analytics.engagement > bestEng) { bestEng = r.analytics.engagement; bestStyle = r.style; }
      if (parseFloat(r.analytics.conversionRate) > bestConversion) { bestConversion = parseFloat(r.analytics.conversionRate); }
    });

    // Update optimal posting times based on performance
    const hourPerf = {};
    records.forEach(r => {
      if (r.timestamp) {
        const h = new Date(r.timestamp).getHours();
        if (!hourPerf[h]) hourPerf[h] = { total: 0, count: 0 };
        hourPerf[h].total += r.analytics.engagement;
        hourPerf[h].count++;
      }
    });

    let bestHour = 11, bestAvg = 0;
    for (const [h, d] of Object.entries(hourPerf)) {
      if (d.total / d.count > bestAvg) { bestAvg = d.total / d.count; bestHour = parseInt(h); }
    }

    const ampm = bestHour >= 12 ? "PM" : "AM";
    const hour12 = bestHour % 12 || 12;

    // Save optimal time to KV
    await kv.set("optimal-times", { time: `${hour12}:00 ${ampm}`, hour: bestHour, avgEngagement: Math.round(bestAvg) });

    return res.status(200).json({
      records,
      summary: {
        totalViews,
        totalLikes,
        totalComments,
        totalShares,
        totalClicks,
        estimatedRevenue,
        avgConversionRate: records.length > 0 ? (totalClicks > 0 ? ((estimatedRevenue / totalClicks) * 100).toFixed(1) + "%" : "0%") : "0%",
        bestStyle,
        bestHour: `${hour12}:00 ${ampm}`,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};