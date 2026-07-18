"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Runtime Department

manager.js

Constitutional Rule RTM-001

Runtime Manager

The Runtime Manager is the constitutional
coordinator of the Runtime Department.

Responsibilities

• Receive Executive Commands
• Build Runtime Input
• Execute Department Engineering
• Execute Runtime Engine
• Validate Runtime Artifact
• Repair Runtime State
• Publish Runtime Output

Runtime Manager NEVER

• Executes Business Departments
• Performs Business Logic
• Reads Platform Memory Directly
• Modifies Department Artifacts

==================================================
*/

let bootstrapPromise =

    null;

const buildInput =

    require(

        "./input"

    );

const RuntimeEngineering =

    require(

        "./engineering"

    );

const Bootstrap =

    require(

        "./bootstrap"

    );

const Dispatcher =

    require(

        "./dispatcher"

    );

const RuntimeEngine =

    require(

        "./runtime-engine"

    );

const Artifact =

    require(

        "./artifact"

    );

const Validator =

    require(

        "./validator"

    );

const Repair =

    require(

        "./repair"

    );

const Output =

    require(

        "./output"

    );

const Errors =

    require(

        "../../quality-assurance-director/errors"

    );

/*
==================================================
Runtime Identity

==================================================
*/

const MANAGER =

Object.freeze({

    department:

        "runtime",

    component:

        "manager",

    version:

        "1.0.0"

});

/*
==================================================
Ensure Runtime Bootstrap

Runtime Manager is the sole owner of the
Runtime Bootstrap lifecycle.

Concurrent Runtime commands must share one
Bootstrap execution.

A failed Bootstrap execution resets the
single-flight state so a future command may
retry initialization.

==================================================
*/

async function ensureBootstrap() {

    if (

        bootstrapPromise

    ) {

        return bootstrapPromise;

    }

    bootstrapPromise =

        Bootstrap.execute();

    try {

        return await bootstrapPromise;

    } catch (

        error

    ) {

        bootstrapPromise =

            null;

        throw error;

    }

}

/*
==================================================
Runtime Manager

Executive Command

        │
        ▼

Runtime Input

        │
        ▼

Engineering

        │
        ▼

Runtime Engine

==================================================
*/

async function execute(

    request = {}

) {

    if (

        request === null ||

        typeof request !==

            "object"

    ) {

        throw new Errors.ValidationError(

            "Invalid runtime request."

        );

    }

    /*
    ----------------------------------
    Runtime Input
    ----------------------------------
    */

    const input =

        await buildInput(

            request

        );

    /*
    ----------------------------------
    Department Engineering
    ----------------------------------
    */

    const engineering =

        await RuntimeEngineering.execute({

            departmentRoot:

                __dirname

        });

    if (

        !engineering.certification.healthy

    ) {

        throw new Errors.ValidationError(

            "Runtime Department engineering certification failed."

        );

    }

    /*
   ----------------------------------
    Bootstrap Runtime
   ----------------------------------
  */

    const bootstrap = await ensureBootstrap();

    /*
    ----------------------------------
    Runtime Engine
    ----------------------------------
    */

    const runtime =

        await RuntimeEngine.execute({

            input

        });

    const dispatcher =

         await Dispatcher.execute({

             observations:

                 runtime.observation.departments

        });

    /*
    ----------------------------------
    Runtime Artifact
    ----------------------------------
    */

    let artifact =

        await Artifact.build({

            input,

            runtime,

            dispatcher,

            engineering

        });

    /*
    ----------------------------------
    Validation
    ----------------------------------
    */

        let validation =

        await Validator.execute({

            artifact

        });

    /*
    ----------------------------------
    Automatic Repair
    ----------------------------------
    */

    if (

        !validation.valid

    ) {

        artifact =

            await Repair.execute({

                artifact,

                validation

            });

        /*
        ----------------------------------
        Repair Validation

        Repair is an attempted correction.

        Repaired Runtime Artifacts must pass
        the same validation authority before
        publication.

        ----------------------------------
        */

        validation =

            await Validator.execute({

                artifact

            });

    }

    /*
    ----------------------------------
    Publication Gate
    ----------------------------------
    */

    if (

        !validation.valid

    ) {

        throw new Errors.ValidationError(

            "Runtime Artifact validation failed after repair."

        );

    }

    /*
    ----------------------------------
    Runtime Output
    ----------------------------------
    */

    return Output.publish({ 

             artifact

      });

}

/*
==================================================
Public Runtime Manager

==================================================
*/

module.exports =

Object.freeze({

    identity:

        MANAGER,

    execute

});