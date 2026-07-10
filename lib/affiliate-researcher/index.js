"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Research Department

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

        "research",

    name:

        "Research Department",

    version:

        "1.0.0",

    registration:

        Object.freeze({

            consumes:

                null,

            produces: [

                "strategy"

            ],

            enabled:

                true,

            autoStart:

                false,

            concurrency:

                1

        })

});

/*
==================================================
Public Runtime

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