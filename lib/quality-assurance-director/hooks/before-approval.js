/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Before Approval Hook

Approval Preparation Runtime

Responsible for

• Approval Preparation
• Governance Readiness
• Constitutional Verification
• Policy Injection
• Hook Registration
• Runtime Enrichment

Constitution:
QA-001

========================================
*/

const crypto = require("crypto");

/*
========================================
APPROVAL PHASES

========================================
*/

const PHASE = Object.freeze({

    VALIDATION:
        "validation",

    CONSTITUTION:
        "constitution",

    POLICY:
        "policy",

    RISK:
        "risk",

    HISTORIAN:
        "historian",

    PREDICTION:
        "prediction",

    LEARNING:
        "learning",

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

    metadata = {}

} = {}) {

    const timestamp =

        new Date()

            .toISOString();

    return {

        approvalId:

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

        approval: {

            level:

                approval.level ??

                "standard",

            authority:

                approval.authority ??

                "system",

            requestedBy:

                approval.requestedBy ??

                "workflow",

            requiredApprovals:

                structuredClone(

                    approval.requiredApprovals ??

                    []

                )

        },

        governance: {

            constitutional:

                false,

            departmental:

                false,

            executive:

                false,

            readiness:

                100

        },

        risk: {

            operational:

                0,

            compliance:

                0,

            financial:

                0,

            quality:

                0,

            execution:

                0

        },

        prediction: {},

        learning: {},

        historian: {},

        metadata: {

            runtime:

                "before-approval",

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

            "Before-approval hook handler must be a function."

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

            "Approval request missing."

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

    context.metadata.approvalLevel =

        context.approval.level;

    context.metadata.approvalAuthority =

        context.approval.authority;

    context.metadata.requiredApprovals =

        context.approval
            .requiredApprovals
            .length;

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
APPROVAL READINESS

========================================
*/

function evaluateReadiness(

    context

) {

    const required =

        context.approval

            .requiredApprovals

            .length;

    context.governance.readiness =

        Math.max(

            0,

            100 -

            (

                required *

                5

            ) -

            (

                context.errors

                    .length *

                10

            ) -

            (

                context.warnings

                    .length *

                5

            )

        );

    return context.governance;

}

/*
========================================
CONSTITUTION VERIFICATION

========================================
*/

function verifyConstitution(

    context

) {

    context.governance.constitutional =

        context.errors.length === 0;

    context.governance.departmental =

        context.errors.length === 0;

    context.governance.executive =

        context.governance

            .readiness >= 80;

    return context.governance;

}

/*
========================================
RISK ASSESSMENT

========================================
*/

function assessRisk(

    context

) {

    context.risk = {

        operational:

            context.errors.length *

            10,

        compliance:

            context.governance

                .constitutional

                ? 0

                : 50,

        financial:

            0,

        quality:

            context.warnings.length *

            5,

        execution:

            context.governance

                .readiness < 80

                ? 40

                : 10

    };

    return context.risk;

}

/*
========================================
HISTORIAN SNAPSHOT

========================================
*/

function initializeHistorian(

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

                    "before-approval",

                timestamp:

                    new Date()

                        .toISOString(),

                governance:

                    structuredClone(

                        context.governance

                    )

            })

        );

    return context.historian;

}

/*
========================================
PREDICTION WARMUP

========================================
*/

function warmPrediction(

    context

) {

    context.prediction = {

        approvalProbability:

            context.governance

                .readiness,

        rejectionProbability:

            100 -

            context.governance

                .readiness,

        escalationProbability:

            context.risk

                .execution,

        repairProbability:

            context.errors.length >

            0

                ? 100

                : 0

    };

    return context.prediction;

}

/*
========================================
LEARNING CONTEXT

========================================
*/

function loadLearning(

    context

) {

    context.learning = {

        previousApprovals:

            0,

        previousRejections:

            0,

        approvalPatterns: [],

        confidence:

            context.governance

                .readiness

    };

    return context.learning;

}

/*
========================================
EXECUTE

Universal Approval Preparation

========================================
*/

async function execute(

    context,

    approvalHandler

) {

    if (

        typeof approvalHandler !==

        "function"

    ) {

        throw new TypeError(

            "Approval handler must be a function."

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

    evaluateReadiness(

        context

    );

    verifyConstitution(

        context

    );

    assessRisk(

        context

    );

    initializeHistorian(

        context

    );

    warmPrediction(

        context

    );

    loadLearning(

        context

    );

    emit(

        context,

        "before-approval.started"

    );

    await executeHooks(

        context,

        PHASE.VALIDATION

    );

    await executeHooks(

        context,

        PHASE.CONSTITUTION

    );

    await executeHooks(

        context,

        PHASE.POLICY

    );

    await executeHooks(

        context,

        PHASE.RISK

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

        "before-approval.completed"

    );

    return approvalHandler(

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
APPROVAL READINESS SCORE

========================================
*/

function readinessScore(

    context

) {

    let score =

        context.governance

            .readiness;

    score -=

        context.errors.length * 10;

    score -=

        context.warnings.length * 5;

    score -=

        context.approval
            .requiredApprovals
            .length;

    score =

        Math.max(

            0,

            score

        );

    context.governance.readiness =

        score;

    context.governance.confidence =

        Number(

            (

                score * 0.95

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
RISK ANALYTICS

========================================
*/

function riskAnalytics(

    context

) {

    const totalRisk =

        context.risk.operational +

        context.risk.compliance +

        context.risk.financial +

        context.risk.quality +

        context.risk.execution;

    return {

        totalRisk,

        averageRisk:

            Number(

                (

                    totalRisk / 5

                ).toFixed(

                    2

                )

            ),

        highestRisk:

            Math.max(

                context.risk.operational,

                context.risk.compliance,

                context.risk.financial,

                context.risk.quality,

                context.risk.execution

            )

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

    readinessScore(

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

        governance:

            structuredClone(

                context.governance

            ),

        risk:

            structuredClone(

                context.risk

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

        riskAnalytics:

            riskAnalytics(

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

    readinessScore(

        context

    );

    const risks =

        riskAnalytics(

            context

        );

    return {

        approvalId:

            context.approvalId,

        department:

            context.department,

        readiness:

            context.governance
                .readiness,

        confidence:

            context.governance
                .confidence,

        governanceHealth:

            context.governance
                .health,

        constitutional:

            context.governance
                .constitutional,

        departmental:

            context.governance
                .departmental,

        executive:

            context.governance
                .executive,

        averageRisk:

            risks.averageRisk,

        recommendation:

            context.governance
                .readiness >= 90

                ? "Proceed to Approval"

                : context.governance
                    .readiness >= 75

                    ? "Approval with Monitoring"

                    : "Review Before Approval"

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

            "Before Approval Hook",

        runtime:

            "Approval Preparation Runtime",

        version:

            "3.0.0",

        constitution:

            "QA-001",

        supports: [

            "priority-hooks",

            "phase-execution",

            "approval-readiness",

            "constitutional-verification",

            "risk-assessment",

            "historian-snapshot",

            "prediction-warmup",

            "learning-context",

            "governance-analytics",

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
and default approval policies.

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

            evaluateReadiness: true,

            verifyConstitution: true,

            assessRisk: true,

            initializeHistorian: true,

            warmPrediction: true,

            loadLearning: true,

            emitEvents: true

        }

    );

    registerPolicy(

        "approval",

        {

            requireConstitutionalCompliance: true,

            requireDepartmentCompliance: true,

            requireExecutiveReview: false,

            minimumReadiness: 80,

            maximumAverageRisk: 40,

            requireHistorianSnapshot: true,

            requirePrediction: true,

            requireLearningContext: true

        }

    );

    use({

        name:

            "core-before-approval",

        phase:

            PHASE.VALIDATION,

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

const BeforeApproval =

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

        evaluateReadiness,

        verifyConstitution,

        assessRisk,

        initializeHistorian,

        warmPrediction,

        loadLearning,

        execute,

        analytics,

        readinessScore,

        riskAnalytics,

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

    BeforeApproval;