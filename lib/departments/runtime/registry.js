"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Runtime Department

registry.js

Constitutional Rule RTR-001

Department Registry

        │
        ▼

Department Registration

        │
        ▼

Runtime Directory

--------------------------------------------------

Constitutional Responsibility

The Runtime Registry is the sole authority
responsible for maintaining the Runtime
Department Directory.

The Registry NEVER

• Discovers departments
• Executes departments
• Reads Platform Memory
• Makes scheduling decisions
• Builds execution plans

The Registry ONLY

• Registers department runtime declarations
• Validates registration structure
• Resolves department registrations
• Maintains the Runtime Directory

==================================================
*/

const Errors =

    require(

        "../../quality-assurance-director/errors"

    );

/*
==================================================
Registry Identity

==================================================
*/

const REGISTRY =

Object.freeze({

    department:

        "runtime",

    component:

        "registry",

    version:

        "2.0.0"

});

/*
==================================================
Runtime Directory

Runtime Department Directory.

Bootstrap is the ONLY component allowed
to populate this registry.

==================================================
*/

const departments =

    new Map();

/*
==================================================
Internal Utilities

==================================================
*/

function isObject(

    value

) {

    return (

        value !== null &&

        typeof value ===

            "object"

    );

}

function deepFreeze(

    target,

    visited = new WeakSet()

) {

    if (

        !isObject(

            target

        )

    ) {

        return target;

    }

    if (

        visited.has(

            target

        )

    ) {

        return target;

    }

    visited.add(

        target

    );

    Object.freeze(

        target

    );

    for (

        const key of Object.keys(

            target

        )

    ) {

        deepFreeze(

            target[key],

            visited

        );

    }

    return target;

}

/*
==================================================
Normalize Department Identity

==================================================
*/

function normalizeDepartment(

    department

) {

    if (

        typeof department !== "string" ||

        department.trim().length === 0

    ) {

        throw new Errors.ValidationError(

            "Department identity is required."

        );

    }

    return department.trim();

}

function normalizeRequires(

    requires

) {

    if (

        requires === undefined

    ) {

        return [];

    }

    if (

        !Array.isArray(

            requires

        )

    ) {

        throw new Errors.ValidationError(

            "Department requires must be an array."

        );

    }

    const normalized = [];

    const seen = new Set();

    for (

        const contractName of requires

    ) {

        if (

            typeof contractName !== "string" ||

            contractName.trim().length === 0

        ) {

            throw new Errors.ValidationError(

                "Required contract names must be non-empty strings."

            );

        }

        const normalizedName =

            contractName.trim();

        if (

            !seen.has(

                normalizedName

            )

        ) {

            seen.add(

                normalizedName

            );

            normalized.push(

                normalizedName

            );

        }

    }

    return normalized;

}

/*
==================================================
Register Department

Bootstrap

        │

        ▼

Department Registration

        │

        ▼

Runtime Directory

==================================================
*/

function register(

    registration

) {

    if (

        !isObject(

            registration

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid department registration."

        );

    }

    const department =

    normalizeDepartment(

        registration.department

    );

    if (

        typeof registration.entrypoint !== "function"

    ) {

        throw new Errors.ValidationError(

            `Department "${registration.department}" is missing entrypoint.`

        );

    }

    if (

        registration.enabled !== undefined &&

        typeof registration.enabled !== "boolean"

    ) {

        throw new Errors.ValidationError(

            `Department "${registration.department}" enabled must be boolean.`

        );

    }

    if (

        departments.has(

        department

      )

    ) {

       throw new Errors.ValidationError(

          `Department already registered: ${department}`

        );

   }

    const normalized =

        deepFreeze({

            department,

            requires:

                normalizeRequires(

                    registration.requires

                ),

            entrypoint:

                registration.entrypoint,

            enabled:

                registration.enabled !== false

        });

    departments.set(

        normalized.department,

        normalized

    );

    return normalized;

}

/*
==================================================
Unregister Department

==================================================
*/

function unregister(

    department

) {

    department =

        normalizeDepartment(

            department

        );

    departments.delete(

        department

    );

}

/*
==================================================
Resolve Department

==================================================
*/

function resolve(

    department

) {

    department =

        normalizeDepartment(

            department

        );

    const registration =

        departments.get(

            department

        );

    if (

        !registration

    ) {

        throw new Errors.ValidationError(

            `Unknown department: ${department}`

        );

    }

    return registration;

}

/*
==================================================
Registry Utilities

==================================================
*/

function has(

    department

) {

    department =

        normalizeDepartment(

            department

        );

    return departments.has(

        department

    );

}

function list() {

    return deepFreeze(

        Array.from(

            departments.values()

        )

    );

}

function clear() {

    departments.clear();

}

/*
==================================================
Public Runtime Registry

==================================================
*/

module.exports =

Object.freeze({

    identity:

        REGISTRY,

    register,

    unregister,

    resolve,

    has,

    list,

    clear

});

