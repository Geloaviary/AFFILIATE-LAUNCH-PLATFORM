"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Runtime Department

bootstrap.js

Constitutional Rule RTB-001

Department Discovery

        │
        ▼

Runtime Interface Verification

        │
        ▼

Engineering Health Verification

        │
        ▼

Runtime Registration

--------------------------------------------------

Constitutional Responsibility

Bootstrap is the sole authority responsible
for discovering, verifying and registering
departments into the Runtime Registry.

Bootstrap NEVER

• Executes departments
• Builds execution plans
• Reads Platform Memory
• Dispatches work

Bootstrap ONLY

• Discovers department modules
• Verifies department runtime interfaces
• Verifies engineering health
• Translates runtime declarations
• Registers healthy departments

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

        │

        ▼

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

        │

        ▼

index.js

        │

        ▼

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

        │

        ▼

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

            registration.requires ||

            [],

        entrypoint:

            department.execute,

        enabled:

            registration.enabled !== false

    });

}

/*
==================================================
Engineering Health Verification

Department

        │

        ▼

engineering.js

        │

        ▼

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

        │

        ▼

Runtime Interface Verification

        │

        ▼

Engineering Health Verification

        │

        ▼

Runtime Registration

==================================================
*/

async function execute() {

    Registry.clear();

    const departmentRoots =

        discoverDepartments();

    const registered = [];

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
        Register Department

        ------------------------------------------
        */

        const registration =

           buildRuntimeRegistration(

                  department

            );

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