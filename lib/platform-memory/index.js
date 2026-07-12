"use strict";

const Manager =

    require(

        "./manager"

    );

const MEMORY =

Object.freeze({

    component:

        "platform-memory",

    version:

        "1.0.0"

});

module.exports =

Object.freeze({

    identity:

        MEMORY,

    loadContracts:

        Manager.loadContracts,

    loadContract:

        Manager.loadContract,

    hasContracts:

        Manager.hasContracts

});