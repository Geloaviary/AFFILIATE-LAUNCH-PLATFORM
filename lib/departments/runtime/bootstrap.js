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

const RuntimeEngine =

    require(

        "./runtime-engine"

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

    const departmentsRoot = path.resolve(__dirname, "..");

    console.log("========== RUNTIME DISCOVERY ==========");
    console.log("__dirname:", __dirname);
    console.log("departmentsRoot:", departmentsRoot);
    console.log("exists:", fs.existsSync(departmentsRoot));

    if (fs.existsSync(departmentsRoot)) {
        const entries = fs.readdirSync(departmentsRoot, {
            withFileTypes: true
        });

        console.log(
            "entries:",
            entries.map(e => ({
                name: e.name,
                dir: e.isDirectory()
            }))
        );
    }

    return fs
        .readdirSync(departmentsRoot, {
            withFileTypes: true
        })
        .filter(
            entry =>
                entry.isDirectory() &&
                entry.name !== "runtime"
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
    !department.engineering ||
    typeof department.engineering.execute !== "function"
) {
    throw new Errors.ValidationError(
        `${path.basename(
            departmentRoot
        )} missing engineering.execute().`
    );
}

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

    department,

    departmentRoot

) {

    const result =
    await department.engineering.execute({
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

    const departmentsRoot = path.resolve(__dirname, "..");

    console.log(
    "FULL DIRECTORY:",
    fs.readdirSync(departmentsRoot)
);

console.log("DIRNAME:", __dirname);
console.log("ROOT:", departmentsRoot);

const entries = fs.readdirSync(departmentsRoot, {
    withFileTypes: true
});

console.log("ENTRY COUNT:", entries.length);

for (const entry of entries) {
    console.log(
        "ENTRY NAME:",
        JSON.stringify(entry.name),
        "DIR:",
        entry.isDirectory()
    );
}

const departmentRoots = entries
    .filter(
        e =>
            e.isDirectory() &&
            e.name !== "runtime"
    )
    .map(
        e =>
            path.join(
                departmentsRoot,
                e.name
            )
    );

console.log("BOOTSTRAP ROOTS:", departmentRoots);
console.log("BOOTSTRAP COUNT:", departmentRoots.length);

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
                    department,
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

    const discovered = [];

const registered = [];

const updated = [];

const unchanged = [];

const removed = [];

for (

    const registration of

    registrations

) {

    discovered.push(

        registration.department

    );

    const existing =

        Registry.get(

            registration.department

        );

    if (

        !existing

    ) {

        Registry.register(

            registration

        );

        registered.push(

            registration.department

        );

        continue;

    }

    if (

        Registry.fingerprint(

            existing

        ) !==

        Registry.fingerprint(

            registration

        )

    ) {

        Registry.update(

            registration

        );

        updated.push(

            registration.department

        );

    } else {

        unchanged.push(

            registration.department

        );

    }

}

for (

    const existing of

    Registry.list()

) {

    if (

        !discovered.includes(

            existing.department

        )

    ) {

        Registry.unregister(

            existing.department

        );

        removed.push(

            existing.department

        );

    }

}

RuntimeEngine.initialize();

return deepFreeze({

    runtime:

        BOOTSTRAP,

    discovered,

    registered,

    updated,

    unchanged,

    removed,

    totalDepartments:

        Registry.size(),

    synchronizedAt:

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