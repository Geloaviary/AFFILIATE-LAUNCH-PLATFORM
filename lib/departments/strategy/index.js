"use strict";

const Manager =

    require(

        "./manager"

    );

const IDENTITY =

Object.freeze({

    department:

        "strategy",

    name:

        "Strategy Department",

    version:

        1,

    runtimeVersion:

        "1.0.0"

});

async function execute(

    options = {}

) {

    return Manager.execute(

        options

    );

}

module.exports =

Object.freeze({

    identity:

        IDENTITY,

    execute

});