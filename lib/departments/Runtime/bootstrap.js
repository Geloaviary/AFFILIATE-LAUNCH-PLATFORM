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

Constitution Verification

        │
        ▼

Engineering Certification

        │
        ▼

Department Registration

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

• Discovers departments
• Verifies constitutional compliance
• Certifies engineering health
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

        "../quality-assurance-director/errors"

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
Constitution Verification

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

    return department;

}

/*
==================================================
Engineering Certification

Department

        │

        ▼

engineering.js

        │

        ▼

Certification

==================================================
*/

async function certifyDepartment(

    departmentRoot

) {

    const engineering =

        require(

            path.join(

                departmentRoot,

                "engineering.js"

            )

        );

    const result =

        await engineering.execute({

            departmentRoot

        });

    if (

        !result.certification.healthy

    ) {

        throw new Errors.ValidationError(

            `${path.basename(

                departmentRoot

            )} engineering certification failed.`

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

Constitution Verification

        │

        ▼

Engineering Certification

        │

        ▼

Department Registration

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
        Engineering Certification

        Broken departments are NOT allowed
        to join the Operating System.

        ------------------------------------------
        */

        await certifyDepartment(

            departmentRoot

        );

        /*
        ------------------------------------------
        Register Department

        ------------------------------------------
        */

        Registry.register({

            ...department.registration,

            identity:

                department.identity,

            execute:

                department.execute

        });

        registered.push(

            department.registration.name

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