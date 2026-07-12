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

let runtimeBootstrapped =

    false;

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

    if (

         !runtimeBootstrapped

    ) {

         await Bootstrap.execute();

         runtimeBootstrapped = true;

    }

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

        executionPlan:

            runtime.executionPlan

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

    const validation =

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