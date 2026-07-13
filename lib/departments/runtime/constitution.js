"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Runtime Department

constitution.js

Constitutional Rule RTC-001

Department Constitution

--------------------------------------------------

The Constitution is the immutable contract that
defines how a department must be constructed.

It is consumed by:

• Bootstrap
• Engineering
• Future Tooling

==================================================
*/

module.exports =

Object.freeze({

    version:

        "1.0.0",

    /*
    ----------------------------------------------
    Required Department Files

    ----------------------------------------------
    */

    requiredFiles:

        Object.freeze([

            "constitution.js",

            "index.js",

            "manager.js",

            "input.js",

            "runtime-engine.js",

            "dispatcher.js",

            "execution-ledger.js",

            "registry.js",

            "bootstrap.js",

            "engineering.js",

            "artifact.js",

            "validator.js",

            "repair.js",

            "contracts.js",

            "output.js"

        ]),

    /*
    ----------------------------------------------
    Required Public API

    index.js

    ----------------------------------------------
    */

    requiredExports:

        Object.freeze([

            "identity",

            "execute"

        ]),

    /*
    ----------------------------------------------
    Engineering Policy

    ----------------------------------------------
    */

    engineering:

        Object.freeze({

            minimumHealth:

                95

        })

});