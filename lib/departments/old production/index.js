"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Production Department

index.js

Constitutional Public Interface

==================================================
*/

const Manager =

    require(

        "./manager"

    );

/*
==================================================
Department Identity

==================================================
*/

const IDENTITY =

Object.freeze({

    department:

        "production",

    name:

        "Production Department",

    version:

        "1.0.0",

    registration:

        Object.freeze({

            consumes:

                "production",

            produces: [

                "publishing"

            ],

            enabled:

                true,

            autoStart:

                true,

            concurrency:

                2

        })

});

/*
==================================================
Department Runtime

==================================================
*/

async function execute(

    options = {}

) {

    return Manager.execute(

        options

    );

}

/*
==================================================
Public Constitutional Interface

==================================================
*/

module.exports =

Object.freeze({

    identity:

        IDENTITY,

    execute

});