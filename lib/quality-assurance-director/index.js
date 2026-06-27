/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Enterprise Composition Root

This module is the ONLY public
entry point into the Quality
Assurance Director.

Responsibilities

• Runtime Bootstrap
• Service Composition
• Platform Integration
• Runtime Lifecycle
• Public API

Business logic belongs to the
Director services.

Constitution:
QA-001

========================================
*/

"use strict";

const crypto = require(

    "crypto"

);

/*
========================================
VERSION

========================================
*/

const VERSION = Object.freeze({

    runtime:

        "4.0.0",

    architecture:

        "1.0.0",

    constitution:

        "QA-001",

    module:

        "Quality Assurance Director"

});

/*
========================================
PLATFORM

========================================
*/

const PLATFORM = Object.freeze({

    name:

        "Affiliate Launch Platform",

    version:

        "3.0.0",

    director:

        "Quality Assurance Director"

});

/*
========================================
ENTERPRISE INFRASTRUCTURE

========================================
*/

const Registry =

    require(

        "./registry"

    );

const ServiceContainer =

    require(

        "./service"

    );

/*
========================================
DIRECTOR SERVICES

========================================
*/

const QualityService =

    require(

        "./quality-service"

    );

const WorkflowController =

    require(

        "./workflow-controller"

    );

const ValidationSession =

    require(

        "./validation-session"

    );

/*
========================================
QUALITY ENGINES

========================================
*/

const RuleEngine =

    require(

        "./constitution/rule-engine"

    );

const ConstitutionalRules =

    require(

        "./constitution/constitutional-rules"

    );

const Severity =

    require(

        "./constitution/severity"

    );

const RepairCoordinator =

    require(

        "./repair-coordinator"

    );

const MetricsManager =

    require(

        "./metrics-manager"

    );

const QualityHistorian =

    require(

        "./quality-historian"

    );

const PredictionEngine =

    require(

        "./prediction-engine"

    );

const LearningEngine =

    require(

        "./learning-engine"

    );

/*
========================================
EXECUTIVE SERVICES

========================================
*/

const DashboardSnapshot =

    require(

        "./metrics/dashboard/dashboard-snapshot"

    );

const ExecutiveSummary =

    require(

        "./metrics/executive/executive-summary"

    );

/*
========================================
ENTERPRISE RUNTIME

Single runtime owned by the
Quality Assurance Director.

========================================
*/

const runtime = {

    state: {

        id:

            crypto.randomUUID(),

        initialized:

            false,

        bootstrapped:

            false,

        createdAt:

            new Date()

                .toISOString(),

        statistics: {

            bootstraps: 0,

            shutdowns: 0,

            restarts: 0,

            executions: 0,

            validations: 0

        }

    },

    metadata:

        Object.freeze({

            runtimeVersion:

                VERSION.runtime,

            architectureVersion:

                VERSION.architecture,

            constitution:

                VERSION.constitution,

            module:

                VERSION.module

        }),

    platform:

        PLATFORM,

    registry:

        Registry,

    container:

        ServiceContainer,

    services:

        new Map(),

    director:

        null

};

/*
========================================
COMPOSE SERVICES

Registers all Quality Assurance
services with the Enterprise
Service Container.

Registry publication is handled
internally by the Service
Container.

========================================
*/

function composeServices() {

    /*
    ------------------------------------
    Core Services
    ------------------------------------
    */

    ServiceContainer.singleton({

        type: "service",

        name: "quality-service",

        factory: () =>

            QualityService

    });

    ServiceContainer.singleton({

        type: "controller",

        name: "workflow-controller",

        factory: () =>

            WorkflowController

    });

    ServiceContainer.singleton({

        type: "service",

        name: "validation-session",

        factory: () =>

            ValidationSession

    });

    /*
    ------------------------------------
    Constitution
    ------------------------------------
    */

    ServiceContainer.singleton({

        type: "engine",

        name: "rule-engine",

        factory: () =>

            RuleEngine

    });

    ServiceContainer.singleton({

        type: "engine",

        name: "constitutional-rules",

        factory: () =>

            ConstitutionalRules

    });

    ServiceContainer.singleton({

        type: "service",

        name: "severity",

        factory: () =>

            Severity

    });

    /*
    ------------------------------------
    Quality Management
    ------------------------------------
    */

    ServiceContainer.singleton({

        type: "manager",

        name: "repair-coordinator",

        factory: () =>

            RepairCoordinator

    });

    ServiceContainer.singleton({

        type: "manager",

        name: "metrics-manager",

        factory: () =>

            MetricsManager

    });

    ServiceContainer.singleton({

        type: "manager",

        name: "quality-historian",

        factory: () =>

            QualityHistorian

    });

    /*
    ------------------------------------
    Intelligence
    ------------------------------------
    */

    ServiceContainer.singleton({

        type: "engine",

        name: "prediction-engine",

        factory: () =>

            PredictionEngine

    });

    ServiceContainer.singleton({

        type: "engine",

        name: "learning-engine",

        factory: () =>

            LearningEngine

    });

    /*
    ------------------------------------
    Executive
    ------------------------------------
    */

    ServiceContainer.singleton({

        type: "service",

        name: "dashboard-snapshot",

        factory: () =>

            DashboardSnapshot

    });

    ServiceContainer.singleton({

        type: "service",

        name: "executive-summary",

        factory: () =>

            ExecutiveSummary

    });

}

/*
========================================
COMPOSE DIRECTOR

Creates the Quality Assurance
Director runtime composition.

========================================
*/

function composeDirector() {

    runtime.director =

        Object.freeze({

            runtime:

                runtime,

            platform:

                PLATFORM,

            registry:

                Registry,

            container:

                ServiceContainer

        });

}

/*
========================================
VALIDATE RUNTIME

Performs runtime validation
before startup is committed.

========================================
*/

function validateRuntime() {

    if (

        !runtime.director

    ) {

        throw new Error(

            "Director runtime has not been composed."

        );

    }

    if (

        typeof ConstitutionalRules.validate ===

        "function"

    ) {

        const result =

            ConstitutionalRules.validate();

        if (

            result.valid === false

        ) {

            throw new Error(

                "Constitution validation failed."

            );

        }

    }

    if (

        typeof RuleEngine.validate ===

        "function"

    ) {

        const result =

            RuleEngine.validate();

        if (

            result.valid === false

        ) {

            throw new Error(

                "Rule Engine validation failed."

            );

        }

    }

    return true;

}

/*
========================================
SELF TEST

Runs startup diagnostics.

========================================
*/

function selfTest() {

    const checks = [

        MetricsManager,

        QualityHistorian,

        PredictionEngine,

        LearningEngine,

        RepairCoordinator

    ];

    for (

        const component of

        checks

    ) {

        if (

            component &&

            typeof component.validate ===

            "function"

        ) {

            const report =

                component.validate();

            if (

                report.valid === false

            ) {

                throw new Error(

                    "Startup self-test failed."

                );

            }

        }

    }

    return true;

}

/*
========================================
BOOTSTRAP

Enterprise startup sequence.

========================================
*/

function bootstrap() {

    if (

        runtime.state.bootstrapped

    ) {

        return runtime.director;

    }

    /*
    ------------------------------------
    Compose Runtime
    ------------------------------------
    */

    composeServices();

    composeDirector();

    /*
    ------------------------------------
    Bootstrap Infrastructure
    ------------------------------------
    */

    ServiceContainer.bootstrap();

    /*
    ------------------------------------
    Runtime Validation
    ------------------------------------
    */

    validateRuntime();

    selfTest();

    /*
    ------------------------------------
    Commit Runtime
    ------------------------------------
    */

    runtime.state.initialized =

        true;

    runtime.state.bootstrapped =

        true;

    runtime.state.statistics
        .bootstraps++;

    return runtime.director;

}

/*
========================================
RESOLVE SERVICE

Internal runtime resolver.

========================================
*/

function resolveService(

    type,

    name

) {

    return ServiceContainer.resolve(

        type,

        name

    );

}

/*
========================================
EXECUTE

Complete Quality Assurance
workflow.

========================================
*/

async function execute({

    department,

    workflow,

    submission,

    campaign,

    options = {}

} = {}) {

    runtime.state.statistics
        .executions++;

    const service =

        resolveService(

            "service",

            "quality-service"

        );

    return service.execute({

        department,

        workflow,

        submission,

        campaign,

        options

    });

}

/*
========================================
VALIDATE

Validation only.

========================================
*/

async function validate({

    department,

    workflow,

    submission,

    campaign,

    options = {}

} = {}) {

    runtime.state.statistics
        .validations++;

    const service =

        resolveService(

            "service",

            "quality-service"

        );

    return service.validate({

        department,

        workflow,

        submission,

        campaign,

        options

    });

}

/*
========================================
REPAIR

========================================
*/

async function repair({

    department,

    violation,

    submission,

    options = {}

} = {}) {

    const coordinator =

        resolveService(

            "manager",

            "repair-coordinator"

        );

    return coordinator.repair({

        department,

        violation,

        submission,

        options

    });

}

/*
========================================
APPROVE

========================================
*/

async function approve({

    report,

    options = {}

} = {}) {

    const workflow =

        resolveService(

            "controller",

            "workflow-controller"

        );

    return workflow.approve({

        report,

        options

    });

}

/*
========================================
SHUTDOWN

========================================
*/

function shutdown() {

    ServiceContainer.reset();

    runtime.state.initialized =

        false;

    runtime.state.bootstrapped =

        false;

    runtime.state.statistics
        .shutdowns++;

    return true;

}

/*
========================================
RESTART

========================================
*/

function restart() {

    shutdown();

    runtime.state.statistics
        .restarts++;

    return bootstrap();

}

/*
========================================
RUNTIME SNAPSHOT

Internal immutable runtime view.

========================================
*/

function runtimeSnapshot() {

    return Object.freeze({

        runtimeId:

            runtime.state.id,

        initialized:

            runtime.state.initialized,

        bootstrapped:

            runtime.state.bootstrapped,

        createdAt:

            runtime.state.createdAt,

        services:

            runtime.services.size,

        platform:

            PLATFORM.name

    });

}

/*
========================================
HEALTH

Enterprise runtime health.

========================================
*/

function health() {

    const snapshot =

        runtimeSnapshot();

    return Object.freeze({

        healthy:

            snapshot.initialized &&

            snapshot.bootstrapped,

        runtime:

            snapshot,

        registry:

            Registry.health(),

        container:

            ServiceContainer.health(),

        checkedAt:

            new Date()

                .toISOString()

    });

}

/*
========================================
STATUS

========================================
*/

function status() {

    return Object.freeze({

        runtime:

            runtimeSnapshot(),

        statistics:

            statistics()

    });

}

/*
========================================
STATISTICS

========================================
*/

function statistics() {

    return Object.freeze({

        runtime:

            Object.freeze({

                ...runtime.state.statistics

            }),

        registry:

            Registry.statistics(),

        container:

            ServiceContainer.statistics()

    });

}

/*
========================================
METADATA

========================================
*/

function metadata() {

    return Object.freeze({

        runtime:

            runtime.metadata,

        platform:

            PLATFORM,

        registry:

            Registry.metadata(),

        container:

            ServiceContainer.metadata()

    });

}

/*
========================================
VERSION

========================================
*/

function version() {

    return Object.freeze({

        runtime:

            VERSION.runtime,

        architecture:

            VERSION.architecture,

        constitution:

            VERSION.constitution,

        platform:

            PLATFORM.version,

        registry:

            Registry.metadata()

                .runtimeVersion,

        container:

            ServiceContainer

                .metadata()

                .runtimeVersion

    });

}

/*
========================================
RUNTIME

========================================
*/

function runtimeInfo() {

    return runtimeSnapshot();

}

/*
========================================
DEEP FREEZE

Recursively freezes objects.

========================================
*/

function deepFreeze(

    value

) {

    if (

        value === null ||

        typeof value !==

        "object" ||

        Object.isFrozen(

            value

        )

    ) {

        return value;

    }

    for (

        const property of

        Object.getOwnPropertyNames(

            value

        )

    ) {

        deepFreeze(

            value[

                property

            ]

        );

    }

    return Object.freeze(

        value

    );

}

/*
========================================
QUALITY ASSURANCE DIRECTOR

Enterprise Runtime

========================================
*/

const QualityDirector = {

    /*
    ------------------------------------
    Lifecycle
    ------------------------------------
    */

    bootstrap,

    shutdown,

    restart,

    /*
    ------------------------------------
    Runtime Operations
    ------------------------------------
    */

    execute,

    validate,

    repair,

    approve,

    /*
    ------------------------------------
    Runtime Analytics
    ------------------------------------
    */

    health,

    status,

    statistics,

    metadata,

    version,

    runtime:

        runtimeInfo

};

/*
========================================
BOOTSTRAP RUNTIME

========================================
*/

bootstrap();

/*
========================================
FREEZE PUBLIC API

========================================
*/

deepFreeze(

    QualityDirector

);

/*
========================================
MODULE EXPORT

QA-001

Single public entry point.

========================================
*/

module.exports =

    QualityDirector;