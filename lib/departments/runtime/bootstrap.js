"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Runtime Department

bootstrap.js

Constitutional Rule RTB-001

Department Discovery

        â”‚
        â–¼

Runtime Interface Verification

        â”‚
        â–¼

Engineering Health Verification

        â”‚
        â–¼

Runtime Registration

--------------------------------------------------

Constitutional Responsibility

Bootstrap is the sole authority responsible
for discovering, verifying and registering
departments into the Runtime Registry.

Bootstrap NEVER

â€¢ Executes departments
â€¢ Builds execution plans
â€¢ Reads Platform Memory
â€¢ Dispatches work

Bootstrap ONLY

â€¢ Discovers department modules
â€¢ Verifies department runtime interfaces
â€¢ Verifies engineering health
â€¢ Translates runtime declarations
â€¢ Registers healthy departments

==================================================
*/

const fs =

    require(

        "fs"

    );

const path =

    require(

        "path"

    );

const Registry =

    require(

        "./registry"

    );

const Errors =

    require(

        "../../quality-assurance-director/errors"

    );

/*
==================================================
Bootstrap Identity

==================================================
*/

const BOOTSTRAP =

Object.freeze({

    department:

        "runtime",

    component:

        "bootstrap",

    version:

        "1.0.0"

});

/*
==================================================
Internal Utilities

==================================================
*/

function deepFreeze(

    object,

    visited = new WeakSet()

) {

    if (

        object === null ||

        typeof object !==

        "object"

    ) {

        return object;

    }

    if (

        visited.has(

            object

        )

    ) {

        return object;

    }

    visited.add(

        object

    );

    Object.freeze(

        object

    );

    for (

        const key of Object.keys(

            object

        )

    ) {

        deepFreeze(

            object[key],

            visited

        );

    }

    return object;

}

/*
==================================================
Department Discovery

departments/

        â”‚

        â–¼

Department Folders

==================================================
*/

function discoverDepartments() {

    const departmentsRoot =

        path.resolve(

            __dirname,

            ".."

        );

    return fs

        .readdirSync(

            departmentsRoot,

            {

                withFileTypes: true

            }

        )

        .filter(

            entry =>

                entry.isDirectory() &&

                entry.name !==

                "runtime"

        )

        .map(

            entry =>

                path.join(

                    departmentsRoot,

                    entry.name

                )

        );

}

/*
==================================================
Runtime Interface Verification

Department Folder

        â”‚

        â–¼

index.js

        â”‚

        â–¼

identity

registration

execute()

==================================================
*/

function verifyDepartment(

    departmentRoot

) {

    const indexFile =

        path.join(

            departmentRoot,

            "index.js"

        );

    if (

        !fs.existsSync(

            indexFile

        )

    ) {

        throw new Errors.ValidationError(

            `Missing index.js: ${departmentRoot}`

        );

    }

    const department =

        require(

            indexFile

        );

    if (

        !department.identity

    ) {

        throw new Errors.ValidationError(

            `${path.basename(

                departmentRoot

            )} missing identity.`

        );

    }

    if (

        !department.registration

    ) {

        throw new Errors.ValidationError(

            `${path.basename(

                departmentRoot

            )} missing registration.`

        );

    }

    if (

        typeof department.execute !==

        "function"

    ) {

        throw new Errors.ValidationError(

            `${path.basename(

                departmentRoot

            )} missing execute().`

        );

    }

    const departmentName =

         department.identity.department;

    if (

         typeof departmentName !== "string" ||

         departmentName.length === 0

    ) {

          throw new Errors.ValidationError(

              `${path.basename(

                  departmentRoot

              )} missing department identity.`

    );

}

   if (

        department.registration.department !== undefined &&

        department.registration.department !== departmentName

   ) {

        throw new Errors.ValidationError(

             `${departmentName} registration identity mismatch.`

        );

    }

    return department;

}

/*
==================================================
Build Runtime Registration

Department Public Interface

        â”‚

        â–¼

Canonical Runtime Registration

==================================================
*/

function buildRuntimeRegistration(

    department

) {

    const departmentName =

        department.identity.department;

    const registration =

        department.registration;

    return deepFreeze({

        department:

            departmentName,

        requires:

            registration.requires === undefined

                ? []

                : registration.requires,

        publishes:

            registration.publishes === undefined

                ? []

                : registration.publishes,

        entrypoint:

            department.execute,

        enabled:

            registration.enabled === undefined

                ? true

                : registration.enabled,

        autoStart:

            registration.autoStart === undefined

                ? true

                : registration.autoStart,

        concurrency:

            registration.concurrency === undefined

                ? 1

                : registration.concurrency

    });

}

/*
==================================================
Engineering Health Verification

Department

        â”‚

        â–¼

engineering.js

        â”‚

        â–¼

Engineering Health Result

==================================================
*/

async function verifyEngineeringHealth(

    departmentRoot

) {

    const engineeringFile =

        path.join(

            departmentRoot,

            "engineering.js"

        );

    if (

        !fs.existsSync(

            engineeringFile

        )

    ) {

        throw new Errors.ValidationError(

            `Missing engineering.js: ${departmentRoot}`

        );

    }

    const engineering =

        require(

            engineeringFile

        );

    if (

        !engineering ||

        typeof engineering.execute !== "function"

    ) {

        throw new Errors.ValidationError(

            `${path.basename(

                departmentRoot

            )} engineering interface is invalid.`

        );

    }

    const result =

        await engineering.execute({

            departmentRoot

        });

    if (

        !result ||

        !result.certification ||

        result.certification.healthy !== true

    ) {

        throw new Errors.ValidationError(

            `${path.basename(

                departmentRoot

            )} engineering health verification failed.`

        );

    }

    return result;

}

/*
==================================================
Bootstrap Runtime

Department Discovery

        â”‚

        â–¼

Runtime Interface Verification

        â”‚

        â–¼

Engineering Health Verification

        â”‚

        â–¼

Runtime Registration

==================================================
*/

async function execute() {

    const departmentRoots =

        discoverDepartments();

    const registrations = [];

    /*
    ==============================================
    Phase 1

    Prepare Runtime Directory

    No Registry mutation is permitted until every
    discovered department has passed Runtime
    interface and engineering health verification.

    ==============================================
    */

    for (

        const departmentRoot of

        departmentRoots

    ) {

        /*
        ------------------------------------------
        Verify Constitutional Interface
        ------------------------------------------
        */

        const department =

            verifyDepartment(

                departmentRoot

            );

        /*
        ------------------------------------------
        Engineering Health Verification

        Broken departments are NOT allowed
        to join the Operating System.

        ------------------------------------------
        */

        await verifyEngineeringHealth(

            departmentRoot

        );

        /*
        ------------------------------------------
        Prepare Canonical Registration
        ------------------------------------------
        */

        const registration =

            buildRuntimeRegistration(

                department

            );

        registrations.push(

            registration

        );

    }

    /*
    ==============================================
    Phase 2

    Commit Runtime Directory

    Registry mutation begins only after the full
    registration set has been prepared.

    ==============================================
    */

    Registry.clear();

    const registered = [];

    for (

        const registration of

        registrations

    ) {

        Registry.register(

            registration

        );

        registered.push(

            registration.department

        );

    }

    return deepFreeze({

        runtime:

            BOOTSTRAP,

        registered,

        totalDepartments:

            registered.length,

        bootstrappedAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Public Bootstrap

==================================================
*/

module.exports =

Object.freeze({

    identity:

        BOOTSTRAP,

    execute

});