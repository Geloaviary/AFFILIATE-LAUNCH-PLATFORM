"use strict";

const Ledger =

    require(

        "../lib/departments/runtime/execution-ledger"

    );

async function run() {

    const campaignId =

        `ledger-test-${Date.now()}`;

    const department =

        "research";

    const contracts = {};

    const fingerprint =

        Ledger.buildFingerprint({

            campaignId,

            department,

            contracts

        });

    console.log(

        "CAMPAIGN:",

        campaignId

    );

    console.log(

        "FINGERPRINT:",

        fingerprint

    );

    console.log(

        "CAN EXECUTE BEFORE:",

        await Ledger.canExecute({

            campaignId,

            department,

            fingerprint

        })

    );

    const first =

        await Ledger.reserve({

            campaignId,

            department,

            fingerprint

        });

    console.log(

        "FIRST RESERVATION:",

        first

    );

    console.log(

        "CAN EXECUTE RUNNING:",

        await Ledger.canExecute({

            campaignId,

            department,

            fingerprint

        })

    );

    try {

        await Ledger.reserve({

            campaignId,

            department,

            fingerprint

        });

        console.log(

            "DOUBLE RESERVATION: FAILED TEST"

        );

    } catch (

        error

    ) {

        console.log(

            "DOUBLE RESERVATION: BLOCKED",

            error.message

        );

    }

    const failed =

        await Ledger.fail({

            campaignId,

            department,

            fingerprint,

            error:

                new Error(

                    "Intentional ledger test failure."

                )

        });

    console.log(

        "FAILED STATE:",

        failed

    );

    console.log(

        "CAN EXECUTE FAILED:",

        await Ledger.canExecute({

            campaignId,

            department,

            fingerprint

        })

    );

    const retry =

        await Ledger.reserve({

            campaignId,

            department,

            fingerprint

        });

    console.log(

        "RETRY RESERVATION:",

        retry

    );

    const completed =

        await Ledger.complete({

            campaignId,

            department,

            fingerprint

        });

    console.log(

        "COMPLETED STATE:",

        completed

    );

    console.log(

        "CAN EXECUTE COMPLETED:",

        await Ledger.canExecute({

            campaignId,

            department,

            fingerprint

        })

    );

}

run()

    .catch(

        error => {

            console.error(

                error

            );

            process.exitCode = 1;

        }

    );