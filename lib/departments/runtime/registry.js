"use strict";

/*
==================================================

AFFILIATE LAUNCH PLATFORM V4

Runtime Department

registry.js

Constitutional Rule RTR-001

Department Registry

        |
        v

Canonical Registration Validation

        |
        v

Runtime Directory

--------------------------------------------------

Constitutional Responsibility

The Runtime Registry is the sole authority
responsible for maintaining the Runtime
Department Directory.

The Registry NEVER

- Discovers departments
- Executes departments
- Reads Platform Memory
- Makes scheduling decisions
- Builds execution plans

The Registry ONLY

- Registers canonical runtime declarations
- Validates registration structure
- Normalizes registration declarations
- Resolves department registrations
- Maintains the Runtime Directory

Canonical Runtime Registration

{
    department,
    requires,
    publishes,
    entrypoint,
    enabled,
    autoStart,
    concurrency
}

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

        "3.0.0"

});

/*
==================================================
Runtime Directory

Bootstrap is the ONLY component allowed
to populate this registry during Runtime
bootstrap.

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

/*
==================================================
Normalize Contract Capability Catalog

==================================================
*/

function normalizeContracts(

    contracts,

    label

) {

    if (

        contracts === undefined

    ) {

        return [];

    }

    if (

        !Array.isArray(

            contracts

        )

    ) {

        throw new Errors.ValidationError(

            `Department ${label} must be an array.`

        );

    }

    const normalized = [];

    const seen = new Set();

    for (

        const contractName of contracts

    ) {

        if (

            typeof contractName !== "string" ||

            contractName.trim().length === 0

        ) {

            throw new Errors.ValidationError(

                `${label} contract names must be non-empty strings.`

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

function normalizeRequires(

    requires

) {

    return normalizeContracts(

        requires,

        "requires"

    );

}

function normalizePublishes(

    publishes

) {

    return normalizeContracts(

        publishes,

        "publishes"

    );

}

function normalizeRegistration(

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

        typeof registration.entrypoint !==

            "function"

    ) {

        throw new Errors.ValidationError(

            `Department "${registration.department}" is missing entrypoint.`

        );

    }

    if (

        registration.enabled !== undefined &&

        typeof registration.enabled !==

            "boolean"

    ) {

        throw new Errors.ValidationError(

            `Department "${registration.department}" enabled must be boolean.`

        );

    }

    if (

        registration.autoStart !== undefined &&

        typeof registration.autoStart !==

            "boolean"

    ) {

        throw new Errors.ValidationError(

            `Department "${registration.department}" autoStart must be boolean.`

        );

    }

    if (

        registration.concurrency !== undefined &&

        (

            !Number.isInteger(

                registration.concurrency

            ) ||

            registration.concurrency < 1

        )

    ) {

        throw new Errors.ValidationError(

            `Department "${registration.department}" concurrency must be a positive integer.`

        );

    }

    return deepFreeze({

        department,

        requires:

            normalizeRequires(

                registration.requires

            ),

        publishes:

            normalizePublishes(

                registration.publishes

            ),

        entrypoint:

            registration.entrypoint,

        enabled:

            registration.enabled !== false,

        autoStart:

            registration.autoStart !== false,

        concurrency:

            registration.concurrency === undefined

                ? 1

                : registration.concurrency

    });

}

/*
==================================================
Register Department

Bootstrap

        |
        v

Canonical Registration

        |
        v

Validation + Normalization

        |
        v

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

    const normalized =

    normalizeRegistration(

        registration

    );

if (

    departments.has(

        department

    )

) {

    throw new Errors.ValidationError(

        `Department already registered: ${department}`

    );

}

departments.set(

    department,

    normalized

);

return normalized;
}

function update(

    registration

) {

    const department =

    normalizeDepartment(

        registration.department

    );

if (

    !departments.has(

        department

    )

) {

    throw new Errors.ValidationError(

        `Department not registered: ${department}`

    );

}

const normalized =

    normalizeRegistration(

        registration

    );

departments.set(

    department,

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

function get(

    department

) {

    department =

        normalizeDepartment(

            department

        );

    return (

        departments.get(

            department

        ) ||

        null

    );

}

function list() {

    return deepFreeze(

        Array.from(

            departments.values()

        )

    );

}

function size() {

    return departments.size;

}

function fingerprint(

    registration

) {

    return JSON.stringify({

        department:

            registration.department,

        requires:

            registration.requires,

        publishes:

            registration.publishes,

        enabled:

            registration.enabled,

        autoStart:

            registration.autoStart,

        concurrency:

            registration.concurrency

    });

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

    update,

    unregister,

    resolve,

    has,

    get,

    list,

    size,

    fingerprint,

    clear

});