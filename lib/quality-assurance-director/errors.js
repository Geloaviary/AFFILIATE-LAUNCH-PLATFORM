/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Enterprise Error Runtime

Responsible for

• Base QA Error
• Infrastructure Errors
• Configuration Errors
• Registry Errors
• Service Errors
• Runtime Errors

Constitution:
QA-001

========================================
*/

const crypto = require("crypto");

/*
========================================
VERSION

========================================
*/

const VERSION = Object.freeze({

    runtime: "3.0.0",

    constitution: "QA-001"

});

/*
========================================
SEVERITY

========================================
*/

const SEVERITY = Object.freeze({

    LOW: "low",

    MEDIUM: "medium",

    HIGH: "high",

    CRITICAL: "critical"

});

/*
========================================
CATEGORY

========================================
*/

const CATEGORY = Object.freeze({

    /*
    ================================
    Infrastructure
    ================================
    */

    INFRASTRUCTURE:

        "infrastructure",

    CONFIGURATION:

        "configuration",

    REGISTRY:

        "registry",

    SERVICE:

        "service",

    RUNTIME:

        "runtime",

    /*
    ================================
    QA Pipeline
    ================================
    */

    VALIDATION:

        "validation",

    REPAIR:

        "repair",

    APPROVAL:

        "approval",

    METRICS:

        "metrics",

    HISTORIAN:

        "historian",

    PREDICTION:

        "prediction",

    LEARNING:

        "learning",

    /*
    ================================
    Platform Integration
    ================================
    */

    INTEGRATION:

        "integration",

    MIDDLEWARE:

        "middleware",

    HOOK:

        "hook",

    DIRECTOR:

        "director",

    EVENT:

        "event",

    /*
    ================================
    Operational
    ================================
    */

    ANALYTICS:

        "analytics",

    DIAGNOSTICS:

        "diagnostics",

    EXECUTIVE:

        "executive"

});

/*
========================================
BASE ERROR

========================================
*/

class QAError extends Error {

    constructor({

        code,

        message,

        category,

        severity = SEVERITY.MEDIUM,

        context = {}

    }) {

        super(message);

        this.name = this.constructor.name;

        this.id = crypto.randomUUID();

        this.code = code;

        this.category = category;

        this.severity = severity;

        this.context = structuredClone(

            context

        );

        this.version = VERSION.runtime;

        this.constitution = VERSION.constitution;

        this.timestamp =

            new Date()

                .toISOString();

        Error.captureStackTrace(

            this,

            this.constructor

        );

        Object.freeze(

            this.context

        );

    }

}

/*
========================================
REGISTRY ERROR

========================================
*/

class RegistryError extends QAError {

    constructor(

        message,

        context = {}

    ) {

        super({

            code:

                "QA_REGISTRY_ERROR",

            message,

            category:

                CATEGORY.REGISTRY,

            severity:

                SEVERITY.HIGH,

            context

        });

    }

}

/*
========================================
SERVICE ERROR

========================================
*/

class ServiceError extends QAError {

    constructor(

        message,

        context = {}

    ) {

        super({

            code:

                "QA_SERVICE_ERROR",

            message,

            category:

                CATEGORY.SERVICE,

            severity:

                SEVERITY.HIGH,

            context

        });

    }

}

/*
========================================
CONFIGURATION ERROR

========================================
*/

class ConfigurationError extends QAError {

    constructor(

        message,

        context = {}

    ) {

        super({

            code:

                "QA_CONFIGURATION_ERROR",

            message,

            category:

                CATEGORY.CONFIGURATION,

            severity:

                SEVERITY.HIGH,

            context

        });

    }

}

/*
========================================
RUNTIME ERROR

========================================
*/

class RuntimeError extends QAError {

    constructor(

        message,

        context = {}

    ) {

        super({

            code:

                "QA_RUNTIME_ERROR",

            message,

            category:

                CATEGORY.RUNTIME,

            severity:

                SEVERITY.CRITICAL,

            context

        });

    }

}

/*
========================================
VALIDATION

========================================
*/

function validate() {

    return {

        valid: true,

        runtime:

            VERSION.runtime,

        constitution:

            VERSION.constitution,

        categories:

            Object.keys(

                CATEGORY

            ).length,

        severities:

            Object.keys(

                SEVERITY

            ).length

    };

}

/*
========================================
VALIDATION ERROR

========================================
*/

class ValidationError extends QAError {

    constructor(

        message,

        context = {}

    ) {

        super({

            code:

                "QA_VALIDATION_ERROR",

            message,

            category:

                CATEGORY.VALIDATION,

            severity:

                SEVERITY.HIGH,

            context

        });

    }

}

/*
========================================
REPAIR ERROR

========================================
*/

class RepairError extends QAError {

    constructor(

        message,

        context = {}

    ) {

        super({

            code:

                "QA_REPAIR_ERROR",

            message,

            category:

                CATEGORY.REPAIR,

            severity:

                SEVERITY.HIGH,

            context

        });

    }

}

/*
========================================
APPROVAL ERROR

========================================
*/

class ApprovalError extends QAError {

    constructor(

        message,

        context = {}

    ) {

        super({

            code:

                "QA_APPROVAL_ERROR",

            message,

            category:

                CATEGORY.APPROVAL,

            severity:

                SEVERITY.HIGH,

            context

        });

    }

}

/*
========================================
METRICS ERROR

========================================
*/

class MetricsError extends QAError {

    constructor(

        message,

        context = {}

    ) {

        super({

            code:

                "QA_METRICS_ERROR",

            message,

            category:

                CATEGORY.METRICS,

            severity:

                SEVERITY.MEDIUM,

            context

        });

    }

}

/*
========================================
HISTORIAN ERROR

========================================
*/

class HistorianError extends QAError {

    constructor(

        message,

        context = {}

    ) {

        super({

            code:

                "QA_HISTORIAN_ERROR",

            message,

            category:

                CATEGORY.HISTORIAN,

            severity:

                SEVERITY.MEDIUM,

            context

        });

    }

}

/*
========================================
PREDICTION ERROR

========================================
*/

class PredictionError extends QAError {

    constructor(

        message,

        context = {}

    ) {

        super({

            code:

                "QA_PREDICTION_ERROR",

            message,

            category:

                CATEGORY.PREDICTION,

            severity:

                SEVERITY.MEDIUM,

            context

        });

    }

}

/*
========================================
LEARNING ERROR

========================================
*/

class LearningError extends QAError {

    constructor(

        message,

        context = {}

    ) {

        super({

            code:

                "QA_LEARNING_ERROR",

            message,

            category:

                CATEGORY.LEARNING,

            severity:

                SEVERITY.MEDIUM,

            context

        });

    }

}

/*
========================================
PIPELINE ERROR SUMMARY

========================================
*/

function pipelineSummary() {

    return {

        validation:

            ValidationError.name,

        repair:

            RepairError.name,

        approval:

            ApprovalError.name,

        metrics:

            MetricsError.name,

        historian:

            HistorianError.name,

        prediction:

            PredictionError.name,

        learning:

            LearningError.name

    };

}

/*
========================================
PIPELINE VALIDATION

========================================
*/

function pipelineValidation() {

    return {

        valid: true,

        errors: 7,

        categories: [

            CATEGORY.VALIDATION,

            CATEGORY.REPAIR,

            CATEGORY.APPROVAL,

            CATEGORY.METRICS,

            CATEGORY.HISTORIAN,

            CATEGORY.PREDICTION,

            CATEGORY.LEARNING

        ],

        generatedAt:

            new Date()

                .toISOString()

    };

}

/*
========================================
INTEGRATION ERROR

========================================
*/

class IntegrationError extends QAError {

    constructor(

        message,

        context = {}

    ) {

        super({

            code:

                "QA_INTEGRATION_ERROR",

            message,

            category:

                CATEGORY.INTEGRATION,

            severity:

                SEVERITY.HIGH,

            context

        });

    }

}

/*
========================================
MIDDLEWARE ERROR

========================================
*/

class MiddlewareError extends QAError {

    constructor(

        message,

        context = {}

    ) {

        super({

            code:

                "QA_MIDDLEWARE_ERROR",

            message,

            category:

                CATEGORY.MIDDLEWARE,

            severity:

                SEVERITY.HIGH,

            context

        });

    }

}

/*
========================================
HOOK ERROR

========================================
*/

class HookError extends QAError {

    constructor(

        message,

        context = {}

    ) {

        super({

            code:

                "QA_HOOK_ERROR",

            message,

            category:

                CATEGORY.HOOK,

            severity:

                SEVERITY.MEDIUM,

            context

        });

    }

}

/*
========================================
EVENT ERROR

========================================
*/

class EventError extends QAError {

    constructor(

        message,

        context = {}

    ) {

        super({

            code:

                "QA_EVENT_ERROR",

            message,

            category:

                CATEGORY.EVENT,

            severity:

                SEVERITY.MEDIUM,

            context

        });

    }

}

/*
========================================
DIRECTOR ERROR

========================================
*/

class DirectorError extends QAError {

    constructor(

        message,

        context = {}

    ) {

        super({

            code:

                "QA_DIRECTOR_ERROR",

            message,

            category:

                CATEGORY.DIRECTOR,

            severity:

                SEVERITY.CRITICAL,

            context

        });

    }

}

/*
========================================
ERROR ANALYTICS

========================================
*/

function analytics() {

    return {

        runtime:

            VERSION.runtime,

        constitution:

            VERSION.constitution,

        categories:

            Object.keys(

                CATEGORY

            ).length,

        severities:

            Object.keys(

                SEVERITY

            ).length,

        infrastructureErrors: 4,

        pipelineErrors: 7,

        integrationErrors: 5,

        totalErrorTypes: 16

    };

}

/*
========================================
DIAGNOSTICS

========================================
*/

function diagnostics() {

    return {

        runtime:

            VERSION.runtime,

        constitution:

            VERSION.constitution,

        validation:

            validate(),

        pipeline:

            pipelineValidation(),

        analytics:

            analytics(),

        generatedAt:

            new Date()

                .toISOString()

    };

}

/*
========================================
METADATA

========================================
*/

function metadata() {

    return {

        module:

            "Enterprise Error Runtime",

        runtime:

            VERSION.runtime,

        constitution:

            VERSION.constitution,

        supports: [

            "infrastructure-errors",

            "pipeline-errors",

            "integration-errors",

            "middleware-errors",

            "hook-errors",

            "event-errors",

            "director-errors",

            "immutable-context",

            "analytics",

            "diagnostics"

        ],

        generatedAt:

            new Date()

                .toISOString()

    };

}

/*
========================================
ERROR SUMMARY

========================================
*/

function summary() {

    return {

        infrastructure: [

            RegistryError.name,

            ServiceError.name,

            ConfigurationError.name,

            RuntimeError.name

        ],

        pipeline: [

            ValidationError.name,

            RepairError.name,

            ApprovalError.name,

            MetricsError.name,

            HistorianError.name,

            PredictionError.name,

            LearningError.name

        ],

        platform: [

            IntegrationError.name,

            MiddlewareError.name,

            HookError.name,

            EventError.name,

            DirectorError.name

        ]

    };

}

/*
========================================
EXECUTIVE REPORT

========================================
*/

function executiveReport() {

    return {

        runtime:

            VERSION.runtime,

        constitution:

            VERSION.constitution,

        validation:

            validate(),

        pipeline:

            pipelineValidation(),

        analytics:

            analytics(),

        summary:

            summary(),

        metadata:

            metadata(),

        generatedAt:

            new Date()

                .toISOString()

    };

}

/*
========================================
ERROR FACTORY

========================================
*/

function createError(

    ErrorType,

    message,

    context = {}

) {

    if (

        typeof ErrorType !==

        "function"

    ) {

        throw new TypeError(

            "ErrorType must be a constructor."

        );

    }

    return new ErrorType(

        message,

        context

    );

}

/*
========================================
CLONE

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

const BOOTSTRAP = freeze({

    initialized:

        true,

    runtime:

        VERSION.runtime,

    constitution:

        VERSION.constitution,

    validated:

        validate().valid,

    pipelineValidated:

        pipelineValidation().valid,

    generatedAt:

        new Date()

            .toISOString()

});

/*
========================================
PUBLIC API

========================================
*/

const Errors = freeze({

    VERSION,

    SEVERITY,

    CATEGORY,

    BOOTSTRAP,

    QAError,

    RegistryError,

    ServiceError,

    ConfigurationError,

    RuntimeError,

    ValidationError,

    RepairError,

    ApprovalError,

    MetricsError,

    HistorianError,

    PredictionError,

    LearningError,

    IntegrationError,

    MiddlewareError,

    HookError,

    EventError,

    DirectorError,

    createError,

    clone,

    freeze,

    validate,

    pipelineValidation,

    analytics,

    diagnostics,

    metadata,

    summary,

    executiveReport

});

/*
========================================
EXPORTS

Enterprise Error Runtime

QA-001

========================================
*/

module.exports =

    Errors;