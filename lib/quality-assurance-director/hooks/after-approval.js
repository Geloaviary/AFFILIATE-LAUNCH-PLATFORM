/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

After Approval Hook

Approval Completion Runtime

Responsible for

• Approval Completion
• Decision Verification
• Governance Assessment
• Hook Registration
• Validation
• Runtime Enrichment

Constitution:
QA-001

========================================
*/

const crypto = require("crypto");

/*
========================================
APPROVAL COMPLETION PHASES

========================================
*/

const PHASE = Object.freeze({

    VERIFICATION:
        "verification",

    METRICS:
        "metrics",

    HISTORIAN:
        "historian",

    PREDICTION:
        "prediction",

    LEARNING:
        "learning",

    GOVERNANCE:
        "governance",

    EXECUTIVE:
        "executive",

    EVENTS:
        "events"

});

/*
========================================
REGISTRY

========================================
*/

const registry = {

    hooks: [],

    policies:

        new Map(),

    statistics: {

        executions: 0,

        failures: 0

    },

    bootstrapped:

        false

};

/*
========================================
CREATE CONTEXT

========================================
*/

function createContext({

    session,

    workflow,

    campaign,

    asset,

    stage,

    department,

    approval = {},

    duration = 0,

    metadata = {}

} = {}) {

    const timestamp =

        new Date()

            .toISOString();

    return {

        approvalId:

            approval.approvalId ||

            crypto.randomUUID(),

        executionId:

            crypto.randomUUID(),

        traceId:

            session?.traceId ||

            crypto.randomUUID(),

        workflowId:

            workflow?.workflowId ||

            null,

        campaignId:

            campaign?.campaignId ||

            campaign?.id ||

            null,

        assetId:

            asset?.assetId ||

            asset?.id ||

            null,

        sessionId:

            session?.sessionId ||

            null,

        stageId:

            stage?.stageId ||

            stage?.id ||

            null,

        workflow,

        campaign,

        asset,

        stage,

        session,

        department,

        duration,

        approval: {

            decision:

                approval.decision ??

                "pending",

            reviewer:

                approval.reviewer ??

                "system",

            authority:

                approval.authority ??

                "system",

            level:

                approval.level ??

                "standard",

            comments:

                approval.comments ??

                "",

            completedAt:

                approval.completedAt ??

                timestamp

        },

        verification: {

            approved:

                false,

            constitutionalCompliance:

                false,

            policyCompliance:

                false,

            reviewerAuthorized:

                false,

            workflowEligible:

                false

        },

        governance: {

            score:

                100,

            confidence:

                100,

            compliance:

                100,

            trust:

                100,

            health:

                "healthy"

        },

        metrics: {},

        historian: {},

        prediction: {},

        learning: {},

        metadata: {

            runtime:

                "after-approval",

            constitution:

                "QA-001",

            version:

                "3.0.0",

            createdAt:

                timestamp,

            ...metadata

        },

        startedAt:

            timestamp,

        completedAt:

            null,

        events: [],

        warnings: [],

        errors: []

    };

}

/*
========================================
REGISTER HOOK

========================================
*/

function use({

    name,

    phase =

        PHASE.EVENTS,

    priority = 100,

    condition = () => true,

    handler

}) {

    if (

        typeof handler !==

        "function"

    ) {

        throw new TypeError(

            "After-approval hook handler must be a function."

        );

    }

    registry.hooks.push({

        name,

        phase,

        priority,

        condition,

        handler

    });

    registry.hooks.sort(

        (

            a,

            b

        ) =>

            a.priority -

            b.priority

    );

}

/*
========================================
REGISTER POLICY

========================================
*/

function registerPolicy(

    name,

    policy

) {

    registry.policies.set(

        name,

        Object.freeze({

            ...policy

        })

    );

}

/*
========================================
VALIDATE CONTEXT

========================================
*/

function validateContext(

    context

) {

    const errors = [];

    if (

        !context.workflow

    ) {

        errors.push(

            "Workflow missing."

        );

    }

    if (

        !context.stage

    ) {

        errors.push(

            "Stage missing."

        );

    }

    if (

        !context.department

    ) {

        errors.push(

            "Department missing."

        );

    }

    if (

        !context.approval

    ) {

        errors.push(

            "Approval decision missing."

        );

    }

    return {

        valid:

            errors.length === 0,

        errors

    };

}

/*
========================================
INJECT POLICY

========================================
*/

function injectPolicy(

    context

) {

    const globalPolicy =

        registry.policies.get(

            "default"

        ) ||

        {};

    const departmentPolicy =

        registry.policies.get(

            context.department

        ) ||

        {};

    const approvalPolicy =

        registry.policies.get(

            "approval"

        ) ||

        {};

    context.policy = {

        ...globalPolicy,

        ...departmentPolicy,

        ...approvalPolicy

    };

    return context.policy;

}

/*
========================================
ENRICH CONTEXT

========================================
*/

function enrich(

    context

) {

    context.metadata.approvalId =

        context.approvalId;

    context.metadata.executionId =

        context.executionId;

    context.metadata.traceId =

        context.traceId;

    context.metadata.workflowId =

        context.workflowId;

    context.metadata.stageId =

        context.stageId;

    context.metadata.department =

        context.department;

    context.metadata.decision =

        context.approval.decision;

    context.metadata.reviewer =

        context.approval.reviewer;

    context.metadata.authority =

        context.approval.authority;

    context.metadata.level =

        context.approval.level;

    context.metadata.duration =

        context.duration;

    return context;

}

/*
========================================
EXECUTE HOOKS

Priority + Phase

========================================
*/

async function executeHooks(

    context,

    phase

) {

    const hooks =

        registry.hooks

            .filter(

                hook =>

                    hook.phase ===

                    phase

            )

            .sort(

                (

                    a,

                    b

                ) =>

                    a.priority -

                    b.priority

            );

    for (

        const hook of hooks

    ) {

        if (

            !hook.condition(

                context

            )

        ) {

            continue;

        }

        const started =

            Date.now();

        try {

            await hook.handler(

                context

            );

            context.events.push({

                type:

                    "hook.executed",

                hook:

                    hook.name,

                phase,

                duration:

                    Date.now() -

                    started,

                timestamp:

                    new Date()

                        .toISOString()

            });

        }

        catch (

            error

        ) {

            registry.statistics.failures++;

            context.errors.push({

                hook:

                    hook.name,

                phase,

                message:

                    error.message

            });

            context.events.push({

                type:

                    "hook.failed",

                hook:

                    hook.name,

                phase,

                error:

                    error.message,

                timestamp:

                    new Date()

                        .toISOString()

            });

        }

    }

}

/*
========================================
EVENT EMITTER

========================================
*/

function emit(

    context,

    type,

    payload = {}

) {

    context.events.push({

        type,

        payload,

        timestamp:

            new Date()

                .toISOString()

    });

}

/*
========================================
DECISION VERIFICATION

========================================
*/

function verifyDecision(

    context

) {

    const decision =

        context.approval

            .decision;

    context.verification.approved =

        decision ===

        "approved";

    context.verification.constitutionalCompliance =

        context.errors.length ===

        0;

    context.verification.policyCompliance =

        context.errors.length ===

        0;

    context.verification.reviewerAuthorized =

        Boolean(

            context.approval

                .reviewer

        );

    context.verification.workflowEligible =

        context.verification

            .approved &&

        context.verification

            .constitutionalCompliance;

    return context.verification;

}

/*
========================================
FINALIZE METRICS

========================================
*/

function finalizeMetrics(

    context

) {

    context.metrics = {

        duration:

            context.duration,

        governanceEfficiency:

            context.verification

                .workflowEligible

                ? 100

                : 75,

        approvalSuccess:

            context.verification

                .approved,

        approvalLatency:

            context.duration,

        reviewer:

            context.approval

                .reviewer,

        authority:

            context.approval

                .authority

    };

    return context.metrics;

}

/*
========================================
HISTORIAN RECORD

========================================
*/

function recordHistorian(

    context

) {

    context.historian =

        Object.freeze(

            structuredClone({

                approvalId:

                    context.approvalId,

                executionId:

                    context.executionId,

                traceId:

                    context.traceId,

                workflowId:

                    context.workflowId,

                stageId:

                    context.stageId,

                state:

                    "after-approval",

                timestamp:

                    new Date()

                        .toISOString(),

                verification:

                    structuredClone(

                        context.verification

                    )

            })

        );

    return context.historian;

}

/*
========================================
PREDICTION FEEDBACK

========================================
*/

function updatePrediction(

    context

) {

    context.prediction = {

        predictedDecision:

            context.approval

                ?.predictedDecision ??

            null,

        actualDecision:

            context.approval

                .decision,

        accuracy:

            context.approval

                .predictedDecision ===

            context.approval

                .decision

                ? 100

                : 75

    };

    return context.prediction;

}

/*
========================================
LEARNING UPDATE

========================================
*/

function updateLearning(

    context

) {

    context.learning = {

        decision:

            context.approval

                .decision,

        reviewer:

            context.approval

                .reviewer,

        authority:

            context.approval

                .authority,

        outcome:

            context.verification

                .workflowEligible

                ? "accepted"

                : "rejected",

        recommendation:

            context.verification

                .workflowEligible

                ? "retain-governance"

                : "improve-governance"

    };

    return context.learning;

}

/*
========================================
EXECUTE

Universal Approval Completion

========================================
*/

async function execute(

    context,

    completionHandler

) {

    if (

        typeof completionHandler !==

        "function"

    ) {

        throw new TypeError(

            "Completion handler must be a function."

        );

    }

    enrich(

        context

    );

    const validation =

        validateContext(

            context

        );

    if (

        !validation.valid

    ) {

        throw new Error(

            validation.errors.join(

                ", "

            )

        );

    }

    injectPolicy(

        context

    );

    verifyDecision(

        context

    );

    finalizeMetrics(

        context

    );

    recordHistorian(

        context

    );

    updatePrediction(

        context

    );

    updateLearning(

        context

    );

    emit(

        context,

        "after-approval.started"

    );

    await executeHooks(

        context,

        PHASE.VERIFICATION

    );

    await executeHooks(

        context,

        PHASE.METRICS

    );

    await executeHooks(

        context,

        PHASE.HISTORIAN

    );

    await executeHooks(

        context,

        PHASE.PREDICTION

    );

    await executeHooks(

        context,

        PHASE.LEARNING

    );

    await executeHooks(

        context,

        PHASE.GOVERNANCE

    );

    await executeHooks(

        context,

        PHASE.EXECUTIVE

    );

    await executeHooks(

        context,

        PHASE.EVENTS

    );

    registry.statistics.executions++;

    context.completedAt =

        new Date()

            .toISOString();

    emit(

        context,

        "after-approval.completed"

    );

    return completionHandler(

        context

    );

}

/*
========================================
APPROVAL ANALYTICS

========================================
*/

function analytics() {

    return {

        totalHooks:

            registry.hooks.length,

        registeredPolicies:

            registry.policies.size,

        executions:

            registry.statistics.executions,

        failures:

            registry.statistics.failures,

        successRate:

            registry.statistics.executions === 0

                ? 100

                : Number(

                    (

                        (

                            registry.statistics.executions -

                            registry.statistics.failures

                        ) /

                        registry.statistics.executions *

                        100

                    ).toFixed(

                        2

                    )

                )

    };

}

/*
========================================
GOVERNANCE QUALITY

========================================
*/

function assessGovernance(

    context

) {

    let score =

        100;

    score -=

        context.errors.length * 15;

    score -=

        context.warnings.length * 5;

    if (

        !context.verification
            .approved

    ) {

        score -= 20;

    }

    if (

        !context.verification
            .constitutionalCompliance

    ) {

        score -= 15;

    }

    if (

        !context.verification
            .policyCompliance

    ) {

        score -= 10;

    }

    score =

        Math.max(

            0,

            score

        );

    context.governance.score =

        score;

    context.governance.confidence =

        Number(

            (

                score *

                0.95

            ).toFixed(

                2

            )

        );

    context.governance.compliance =

        context.verification
            .constitutionalCompliance &&

        context.verification
            .policyCompliance

            ? 100

            : score;

    context.governance.trust =

        Number(

            (

                (

                    context.governance
                        .score +

                    context.governance
                        .compliance

                ) / 2

            ).toFixed(

                2

            )

        );

    context.governance.health =

        score >= 95

            ? "excellent"

            : score >= 85

                ? "good"

                : score >= 70

                    ? "fair"

                    : "poor";

    return context.governance;

}

/*
========================================
DECISION EFFECTIVENESS

========================================
*/

function decisionEffectiveness(

    context

) {

    return {

        approved:

            context.verification
                .approved,

        workflowEligible:

            context.verification
                .workflowEligible,

        reviewerAuthorized:

            context.verification
                .reviewerAuthorized,

        governanceScore:

            context.governance
                .score,

        trustScore:

            context.governance
                .trust

    };

}

/*
========================================
HOOK PERFORMANCE

========================================
*/

function hookPerformance(

    context

) {

    const executed =

        context.events.filter(

            event =>

                event.type ===

                "hook.executed"

        );

    const failed =

        context.events.filter(

            event =>

                event.type ===

                "hook.failed"

        );

    const totalDuration =

        executed.reduce(

            (

                total,

                event

            ) =>

                total +

                event.duration,

            0

        );

    return {

        executed:

            executed.length,

        failed:

            failed.length,

        averageDuration:

            executed.length === 0

                ? 0

                : Number(

                    (

                        totalDuration /

                        executed.length

                    ).toFixed(

                        2

                    )

                ),

        totalDuration

    };

}

/*
========================================
APPROVAL REPORT

========================================
*/

function report(

    context

) {

    assessGovernance(

        context

    );

    return {

        approvalId:

            context.approvalId,

        executionId:

            context.executionId,

        workflowId:

            context.workflowId,

        campaignId:

            context.campaignId,

        assetId:

            context.assetId,

        stageId:

            context.stageId,

        department:

            context.department,

        verification:

            structuredClone(

                context.verification

            ),

        governance:

            structuredClone(

                context.governance

            ),

        metrics:

            structuredClone(

                context.metrics

            ),

        prediction:

            structuredClone(

                context.prediction

            ),

        learning:

            structuredClone(

                context.learning

            ),

        historian:

            structuredClone(

                context.historian

            ),

        effectiveness:

            decisionEffectiveness(

                context

            ),

        performance:

            hookPerformance(

                context

            ),

        generatedAt:

            new Date()

                .toISOString()

    };

}

/*
========================================
EXECUTIVE SUMMARY

========================================
*/

function executiveSummary(

    context

) {

    assessGovernance(

        context

    );

    return {

        approvalId:

            context.approvalId,

        department:

            context.department,

        decision:

            context.approval
                .decision,

        governanceScore:

            context.governance
                .score,

        compliance:

            context.governance
                .compliance,

        confidence:

            context.governance
                .confidence,

        trust:

            context.governance
                .trust,

        workflowEligible:

            context.verification
                .workflowEligible,

        health:

            context.governance
                .health,

        recommendation:

            context.verification
                .workflowEligible

                ? "Continue Workflow"

                : "Escalate Governance Review"

    };

}

/*
========================================
HEALTH

========================================
*/

function health() {

    const stats =

        analytics();

    return {

        healthy:

            stats.failures <=

            stats.executions,

        executions:

            stats.executions,

        failures:

            stats.failures,

        hooks:

            stats.totalHooks,

        policies:

            stats.registeredPolicies,

        timestamp:

            new Date()

                .toISOString()

    };

}

/*
========================================
VALIDATION

========================================
*/

function validate(

    context

) {

    return validateContext(

        context

    );

}

/*
========================================
METADATA

========================================
*/

function metadata() {

    return {

        module:

            "After Approval Hook",

        runtime:

            "Approval Completion Runtime",

        version:

            "3.0.0",

        constitution:

            "QA-001",

        supports: [

            "priority-hooks",

            "phase-execution",

            "decision-verification",

            "metrics-finalization",

            "historian-recording",

            "prediction-feedback",

            "learning-update",

            "governance-quality",

            "decision-effectiveness",

            "executive-summary"

        ],

        generatedAt:

            new Date()

                .toISOString()

    };

}

/*
========================================
BOOTSTRAP

Registers built-in hooks
and default approval completion policies.

========================================
*/

function bootstrap() {

    if (

        registry.bootstrapped

    ) {

        return;

    }

    registry.bootstrapped = true;

    registerPolicy(

        "default",

        {

            verifyDecision: true,

            finalizeMetrics: true,

            recordHistorian: true,

            updatePrediction: true,

            updateLearning: true,

            assessGovernance: true,

            emitEvents: true

        }

    );

    registerPolicy(

        "approval",

        {

            requireDecisionVerification: true,

            requireHistorianRecord: true,

            requirePredictionFeedback: true,

            requireLearningUpdate: true,

            requireGovernanceAssessment: true,

            allowWorkflowContinuation: true,

            requireExecutiveReporting: true

        }

    );

    use({

        name:

            "core-after-approval",

        phase:

            PHASE.VERIFICATION,

        priority:

            0,

        handler:

            async context => {

                context.metadata.core = {

                    initialized: true,

                    version: "3.0.0",

                    timestamp:

                        new Date()

                            .toISOString()

                };

            }

    });

}

/*
========================================
RESET

Development / Testing

========================================
*/

function reset() {

    registry.hooks.length = 0;

    registry.policies.clear();

    registry.statistics.executions = 0;

    registry.statistics.failures = 0;

    registry.bootstrapped = false;

    bootstrap();

}

/*
========================================
CLONE

Uses native structuredClone.

========================================
*/

function clone(

    value

) {

    return structuredClone(

        value

    );

}

/*
========================================
FREEZE

Deep immutable object.

========================================
*/

function freeze(

    value

) {

    function deepFreeze(

        object

    ) {

        if (

            object &&

            typeof object ===

            "object" &&

            !Object.isFrozen(

                object

            )

        ) {

            Reflect.ownKeys(

                object

            ).forEach(

                key =>

                    deepFreeze(

                        object[key]

                    )

            );

            Object.freeze(

                object

            );

        }

        return object;

    }

    return deepFreeze(

        value

    );

}

/*
========================================
BOOTSTRAP

========================================
*/

bootstrap();

/*
========================================
PUBLIC API

========================================
*/

const AfterApproval =

    freeze({

        PHASE,

        createContext,

        use,

        registerPolicy,

        validateContext,

        injectPolicy,

        enrich,

        executeHooks,

        emit,

        verifyDecision,

        finalizeMetrics,

        recordHistorian,

        updatePrediction,

        updateLearning,

        execute,

        analytics,

        assessGovernance,

        decisionEffectiveness,

        hookPerformance,

        report,

        executiveSummary,

        health,

        validate,

        metadata,

        bootstrap,

        reset,

        clone,

        freeze

    });

/*
========================================
EXPORTS

Universal Module Contract

QA-001

========================================
*/

module.exports =

    AfterApproval;