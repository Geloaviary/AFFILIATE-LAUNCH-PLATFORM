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

• Registers departments
• Unregisters departments
• Resolves department runtimes
• Maintains the Runtime Directory

==================================================
*/

const Errors =

    require(

        "../quality-assurance-director/errors"

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

Self-registering Runtime Directory.

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

    if (

        typeof registration.name !==

        "string"

    ) {

        throw new Errors.ValidationError(

            "Department name is required."

        );

    }

    if (

        typeof registration.execute !==

        "function"

    ) {

        throw new Errors.ValidationError(

            `Department "${registration.name}" is missing execute().`

        );

    }

    if (

        departments.has(

            registration.name

        )

    ) {

        throw new Errors.ValidationError(

            `Department already registered: ${registration.name}`

        );

    }

    departments.set(

        registration.name,

        deepFreeze(

            registration

        )

    );

}

/*
==================================================
Unregister Department

==================================================
*/

function unregister(

    departmentName

) {

    departments.delete(

        departmentName

    );

}

/*
==================================================
Resolve Department

==================================================
*/

function resolve(

    departmentName

) {

    const registration =

        departments.get(

            departmentName

        );

    if (

        !registration

    ) {

        throw new Errors.ValidationError(

            `Unknown department: ${departmentName}`

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

    departmentName

) {

    return departments.has(

        departmentName

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

