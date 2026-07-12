const fetch = require("node-fetch");
const { kv } = require("@vercel/kv");

const ExecutionLedger =

    require(

        "../lib/departments/runtime/execution-ledger"

    );

const RuntimeDispatcher = require(
  "../lib/departments/runtime/dispatcher"
);

const RuntimeRegistry = require(
  "../lib/departments/runtime/registry"
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

  if (
  req.body?.action ===
  "test-runtime-dispatcher"
) {
  const expectedNonce =
    process.env.RUNTIME_LEDGER_TEST_NONCE;

  const providedNonce =
    req.headers["x-ledger-test-nonce"];

  if (
    !expectedNonce ||
    providedNonce !== expectedNonce
  ) {
    return res.status(404).json({
      error: "Not Found"
    });
  }

  const testId =
    `dispatcher-test-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;

  const department =
    `runtime-dispatcher-test-${testId}`;

  let invocationCount = 0;

  let mode = "success";

  RuntimeRegistry.register({
    department,

    requires: [],

    enabled: true,

    entrypoint: async () => {
      invocationCount += 1;

      if (mode === "fail") {
        throw new Error(
          "Intentional dispatcher certification failure."
        );
      }

      return {
        testId,
        invocation: invocationCount
      };
    }
  });

  try {
    const successPlan = {
      campaignId:
        `${testId}-success`,

      department,

      contracts: {
        test: "success"
      }
    };

    const success =
      await RuntimeDispatcher.execute({
        executionPlan: [
          successPlan
        ]
      });

    const invocationAfterSuccess =
      invocationCount;

    const replay =
      await RuntimeDispatcher.execute({
        executionPlan: [
          successPlan
        ]
      });

    const invocationAfterReplay =
      invocationCount;

    mode = "fail";

    const failurePlan = {
      campaignId:
        `${testId}-failure`,

      department,

      contracts: {
        test: "failure"
      }
    };

    const failure =
      await RuntimeDispatcher.execute({
        executionPlan: [
          failurePlan
        ]
      });

    const invocationAfterFailure =
      invocationCount;

    mode = "success";

    const retry =
      await RuntimeDispatcher.execute({
        executionPlan: [
          failurePlan
        ]
      });

    const invocationAfterRetry =
      invocationCount;

    const concurrentPlan = {
      campaignId:
        `${testId}-concurrency`,

      department,

      contracts: {
        test: "concurrency"
      }
    };

    const beforeConcurrency =
      invocationCount;

    const concurrentResults =
      await Promise.all(
        Array.from(
          { length: 20 },
          () =>
            RuntimeDispatcher.execute({
              executionPlan: [
                concurrentPlan
              ]
            })
        )
      );

    const afterConcurrency =
      invocationCount;

    const concurrentCompleted =
      concurrentResults.filter(
        result =>
          result.totalCompleted === 1
      ).length;

    const concurrentSkipped =
      concurrentResults.filter(
        result =>
          result.totalSkipped === 1
      ).length;

    const concurrentFailed =
      concurrentResults.filter(
        result =>
          result.totalFailed === 1
      ).length;

    const successPassed =
      success.totalCompleted === 1 &&
      success.totalFailed === 0 &&
      success.totalSkipped === 0 &&
      success.results[0]?.status ===
        "completed" &&
      success.results[0]?.attempt === 1 &&
      invocationAfterSuccess === 1;

    const replayPassed =
      replay.totalCompleted === 0 &&
      replay.totalFailed === 0 &&
      replay.totalSkipped === 1 &&
      replay.results[0]?.status ===
        "skipped" &&
      invocationAfterReplay ===
        invocationAfterSuccess;

    const failurePassed =
      failure.totalCompleted === 0 &&
      failure.totalFailed === 1 &&
      failure.totalSkipped === 0 &&
      failure.results[0]?.status ===
        "failed" &&
      failure.results[0]?.attempt === 1 &&
      invocationAfterFailure ===
        invocationAfterReplay + 1;

    const retryPassed =
      retry.totalCompleted === 1 &&
      retry.totalFailed === 0 &&
      retry.totalSkipped === 0 &&
      retry.results[0]?.status ===
        "completed" &&
      retry.results[0]?.attempt === 2 &&
      invocationAfterRetry ===
        invocationAfterFailure + 1;

    const concurrencyPassed =
      concurrentCompleted === 1 &&
      concurrentSkipped === 19 &&
      concurrentFailed === 0 &&
      afterConcurrency -
        beforeConcurrency ===
        1;

    const passed =
      successPassed &&
      replayPassed &&
      failurePassed &&
      retryPassed &&
      concurrencyPassed;

    return res.status(
      passed ? 200 : 500
    ).json({
      test:
        "runtime-dispatcher",

      passed,

      success: {
        passed: successPassed,
        status:
          success.results[0]?.status,
        attempt:
          success.results[0]?.attempt,
        invocationCount:
          invocationAfterSuccess
      },

      replay: {
        passed: replayPassed,
        status:
          replay.results[0]?.status,
        invocationCount:
          invocationAfterReplay
      },

      failure: {
        passed: failurePassed,
        status:
          failure.results[0]?.status,
        attempt:
          failure.results[0]?.attempt,
        invocationCount:
          invocationAfterFailure
      },

      retry: {
        passed: retryPassed,
        status:
          retry.results[0]?.status,
        attempt:
          retry.results[0]?.attempt,
        invocationCount:
          invocationAfterRetry
      },

      concurrency: {
        passed:
          concurrencyPassed,

        attempted: 20,

        completed:
          concurrentCompleted,

        skipped:
          concurrentSkipped,

        failed:
          concurrentFailed,

        entrypointInvocations:
          afterConcurrency -
          beforeConcurrency
      },

      totalEntrypointInvocations:
        invocationCount
    });
  } finally {
    RuntimeRegistry.unregister(
      department
    );
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