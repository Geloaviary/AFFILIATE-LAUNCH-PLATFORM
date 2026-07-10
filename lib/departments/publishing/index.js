"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Strategy Department

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

        "strategy",

    name:

        "Strategy Department",

    version:

        "1.0.0",

    registration:

        Object.freeze({

            consumes:

                "research",

            produces: [

                "production",

                "publishing"

            ],

            enabled:

                true,

            autoStart:

                true,

            concurrency:

                1

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