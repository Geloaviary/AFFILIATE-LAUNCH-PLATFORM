"use strict";

const process = require("process");

const BASE_URL =
    String(
        process.env.RUNTIME_DEPLOYED_BASE_URL ||
        ""
    )
        .trim()
        .replace(
            /\/+$/,
            ""
        );

const USER_ID =
    String(
        process.env.RUNTIME_CERTIFICATION_USER_ID ||
        "runtime-stage-7-certification"
    )
        .trim();

const EXECUTIVE_PATH =
    "/api/manage-campaigns";

const OBSERVATION_PATH =
    "/api/utils?action=runtime-observation";

const EXIT = Object.freeze({
    PASS: 0,
    CONFIGURATION: 10,
    EXECUTIVE: 20,
    OBSERVATION: 30,
    AUTHORITY: 40,
    UNEXPECTED: 50
});

function section(title) {

    console.log("");
    console.log(
        "========================================"
    );
    console.log(title);
    console.log(
        "========================================"
    );
    console.log("");

}

function printJson(value) {

    console.log(
        JSON.stringify(
            value,
            null,
            2
        )
    );

}

function fail(
    exitCode,
    message
) {

    const error =
        new Error(message);

    error.certificationExitCode =
        exitCode;

    throw error;

}

function isObject(value) {

    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    );

}

function normalizeStatus(value) {

    return String(
        value || ""
    )
        .trim()
        .toUpperCase();

}

function findStrategyDepartment(
    observation
) {

    const candidates = [];

    if (
        Array.isArray(
            observation?.departments
        )
    ) {

        candidates.push(
            ...observation.departments
        );

    }

    if (
        Array.isArray(
            observation?.report?.departments
        )
    ) {

        candidates.push(
            ...observation.report.departments
        );

    }

    if (
        Array.isArray(
            observation?.runtime?.departments
        )
    ) {

        candidates.push(
            ...observation.runtime.departments
        );

    }

    if (
        Array.isArray(
            observation?.runtime?.report?.departments
        )
    ) {

        candidates.push(
            ...observation.runtime.report.departments
        );

    }

    return (
        candidates.find(
            department => {

                const identity =
                    String(
                        department?.department ||
                        department?.name ||
                        department?.id ||
                        ""
                    )
                        .trim()
                        .toLowerCase();

                return (
                    identity === "strategy"
                );

            }
        ) ||
        null
    );

}

function getReason(
    department
) {

    const reason =
        department?.reason ||
        department?.message ||
        department?.waitingReason ||
        null;

    if (
        typeof reason === "string" &&
        reason.trim()
    ) {

        return reason.trim();

    }

    if (
        isObject(reason)
    ) {

        return reason;

    }

    return null;

}

async function readResponse(
    response
) {

    const text =
        await response.text();

    if (!text) {

        return {
            text: "",
            json: null
        };

    }

    try {

        return {
            text,
            json:
                JSON.parse(text)
        };

    } catch {

        return {
            text,
            json: null
        };

    }

}

async function request(
    url,
    options
) {

    const startedAt =
        Date.now();

    const response =
        await fetch(
            url,
            options
        );

    const body =
        await readResponse(
            response
        );

    return {
        status:
            response.status,

        ok:
            response.ok,

        statusText:
            response.statusText,

        durationMs:
            Date.now() -
            startedAt,

        headers:
            Object.fromEntries(
                response.headers.entries()
            ),

        text:
            body.text,

        json:
            body.json
    };

}

(async () => {

    let exitCode =
        EXIT.UNEXPECTED;

    try {

        section(
            "STAGE 7 LIVE DEPLOYED RUNTIME WAITING PATH CERTIFICATION"
        );

        console.log(
            "AUDIT MODE: DEPLOYED EXECUTION PATH"
        );

        console.log(
            "DIRECT KV ACCESS: NONE"
        );

        console.log(
            "CONTRACT INJECTION: NONE"
        );

        console.log(
            "RESEARCH MOCKING: NONE"
        );

        console.log(
            "DIRECT STRATEGY EXECUTION: NONE"
        );

        console.log(
            "STATUS CALCULATION AUTHORITY: RUNTIME"
        );

        section(
            "DEPLOYED TARGET CONFIGURATION"
        );

        console.log(
            "BASE URL:",
            BASE_URL || "[MISSING]"
        );

        console.log(
            "CERTIFICATION USER:",
            USER_ID
        );

        if (!BASE_URL) {

            fail(
                EXIT.CONFIGURATION,
                (
                    "RUNTIME_DEPLOYED_BASE_URL " +
                    "environment variable is required."
                )
            );

        }

        let parsedBaseUrl;

        try {

            parsedBaseUrl =
                new URL(BASE_URL);

        } catch {

            fail(
                EXIT.CONFIGURATION,
                (
                    "RUNTIME_DEPLOYED_BASE_URL " +
                    "is not a valid absolute URL."
                )
            );

        }

        if (
            parsedBaseUrl.protocol !==
                "https:" &&
            parsedBaseUrl.protocol !==
                "http:"
        ) {

            fail(
                EXIT.CONFIGURATION,
                (
                    "Deployed base URL must use " +
                    "HTTP or HTTPS."
                )
            );

        }

        const campaignId =
            (
                "runtime-stage-7-" +
                Date.now().toString(36)
            );

        const launchPayload = {

            userId:
                USER_ID,

            name:
                "Runtime Stage 7 Waiting Certification",

            niche:
                "runtime-certification",

            productUrl:
                (
                    "https://example.invalid/" +
                    "runtime-stage-7-product"
                ),

            affiliateUrl:
                (
                    "https://example.invalid/" +
                    "runtime-stage-7-affiliate"
                ),

            revenueGoal:
                "1000",

            research:
                null,

            runtimeCertification: {

                stage:
                    7,

                expectedDepartment:
                    "strategy",

                expectedStatus:
                    "WAITING",

                requestedCampaignId:
                    campaignId

            }

        };

        const executiveUrl =
            (
                BASE_URL +
                EXECUTIVE_PATH
            );

        section(
            "STEP 1 EXECUTIVE LAUNCH PATH"
        );

        console.log(
            "METHOD: POST"
        );

        console.log(
            "TARGET:",
            executiveUrl
        );

        console.log(
            "REQUEST PAYLOAD:"
        );

        printJson(
            launchPayload
        );

        const executiveResponse =
            await request(
                executiveUrl,
                {
                    method:
                        "POST",

                    headers: {
                        "content-type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            launchPayload
                        )
                }
            );

        console.log("");
        console.log(
            "EXECUTIVE HTTP STATUS:",
            executiveResponse.status
        );

        console.log(
            "EXECUTIVE DURATION MS:",
            executiveResponse.durationMs
        );

        console.log("");
        console.log(
            "EXECUTIVE RESPONSE:"
        );

        if (
            executiveResponse.json !==
                null
        ) {

            printJson(
                executiveResponse.json
            );

        } else {

            console.log(
                executiveResponse.text
            );

        }

        if (
            executiveResponse.status !==
                202
        ) {

            fail(
                EXIT.EXECUTIVE,
                (
                    "Executive edge did not return " +
                    "HTTP 202 WAITING boundary. " +
                    "Received HTTP " +
                    executiveResponse.status +
                    "."
                )
            );

        }

        const executiveBody =
            executiveResponse.json;

        if (
            !isObject(
                executiveBody
            )
        ) {

            fail(
                EXIT.EXECUTIVE,
                (
                    "Executive HTTP 202 response " +
                    "did not contain a JSON object."
                )
            );

        }

        const executiveStatus =
            normalizeStatus(
                executiveBody.status
            );

        const executiveDepartment =
            String(
                executiveBody.department ||
                ""
            )
                .trim()
                .toLowerCase();

        console.log("");
        console.log(
            "EXECUTIVE STATUS:",
            executiveStatus ||
            "[MISSING]"
        );

        console.log(
            "EXECUTIVE DEPARTMENT:",
            executiveDepartment ||
            "[MISSING]"
        );

        console.log(
            "EXECUTIVE REASON PRESENT:",
            Boolean(
                executiveBody.reason
            )
        );

        if (
            executiveStatus !==
                "WAITING"
        ) {

            fail(
                EXIT.EXECUTIVE,
                (
                    "Executive edge returned HTTP 202 " +
                    "without Runtime WAITING status."
                )
            );

        }

        if (
            executiveDepartment !==
                "strategy"
        ) {

            fail(
                EXIT.EXECUTIVE,
                (
                    "Executive waiting boundary is not " +
                    "owned by Strategy Department."
                )
            );

        }

        if (
            !executiveBody.reason
        ) {

            fail(
                EXIT.AUTHORITY,
                (
                    "Executive waiting response has no " +
                    "Runtime-provided reason."
                )
            );

        }

        const actualCampaignId =
            String(
                executiveBody.campaignId ||
                campaignId
            )
                .trim();

        console.log("");
        console.log(
            "EXECUTIVE WAITING BOUNDARY: PASS"
        );

        console.log(
            "OBSERVATION CAMPAIGN ID:",
            actualCampaignId
        );

        const observationUrl =
            (
                BASE_URL +
                OBSERVATION_PATH +
                "&campaignId=" +
                encodeURIComponent(
                    actualCampaignId
                )
            );

        section(
            "STEP 2 RUNTIME OBSERVATION TRANSPORT"
        );

        console.log(
            "METHOD: GET"
        );

        console.log(
            "TARGET:",
            observationUrl
        );

        const observationResponse =
            await request(
                observationUrl,
                {
                    method:
                        "GET",

                    headers: {
                        accept:
                            "application/json"
                    }
                }
            );

        console.log("");
        console.log(
            "OBSERVATION HTTP STATUS:",
            observationResponse.status
        );

        console.log(
            "OBSERVATION DURATION MS:",
            observationResponse.durationMs
        );

        console.log("");
        console.log(
            "OBSERVATION RESPONSE:"
        );

        if (
            observationResponse.json !==
                null
        ) {

            printJson(
                observationResponse.json
            );

        } else {

            console.log(
                observationResponse.text
            );

        }

        if (
            observationResponse.status !==
                200
        ) {

            fail(
                EXIT.OBSERVATION,
                (
                    "Runtime observation transport " +
                    "did not return HTTP 200. " +
                    "Received HTTP " +
                    observationResponse.status +
                    "."
                )
            );

        }

        const observation =
            observationResponse.json;

        if (
            !isObject(
                observation
            )
        ) {

            fail(
                EXIT.OBSERVATION,
                (
                    "Runtime observation transport " +
                    "did not return a JSON object."
                )
            );

        }

        const strategyDepartment =
            findStrategyDepartment(
                observation
            );

        console.log("");
        console.log(
            "STRATEGY DEPARTMENT PRESENT:",
            Boolean(
                strategyDepartment
            )
        );

        if (
            !strategyDepartment
        ) {

            fail(
                EXIT.OBSERVATION,
                (
                    "Runtime observation does not expose " +
                    "Strategy Department."
                )
            );

        }

        const strategyStatus =
            normalizeStatus(
                strategyDepartment.status
            );

        const strategyReason =
            getReason(
                strategyDepartment
            );

        console.log(
            "STRATEGY STATUS:",
            strategyStatus ||
            "[MISSING]"
        );

        console.log(
            "STRATEGY REASON PRESENT:",
            Boolean(
                strategyReason
            )
        );

        console.log("");
        console.log(
            "STRATEGY REASON:"
        );

        printJson(
            strategyReason
        );

        if (
            strategyStatus !==
                "WAITING"
        ) {

            fail(
                EXIT.AUTHORITY,
                (
                    "Runtime observation does not report " +
                    "Strategy as WAITING. Received: " +
                    (
                        strategyStatus ||
                        "[MISSING]"
                    )
                )
            );

        }

        if (
            !strategyReason
        ) {

            fail(
                EXIT.AUTHORITY,
                (
                    "Runtime observation reports WAITING " +
                    "without a Runtime-provided reason."
                )
            );

        }

        console.log("");
        console.log(
            "RUNTIME OBSERVATION WAITING PATH: PASS"
        );

        section(
            "STEP 3 DASHBOARD TRANSPORT AVAILABILITY"
        );

        const dashboardTransportUrl =
            (
                BASE_URL +
                OBSERVATION_PATH
            );

        console.log(
            "METHOD: GET"
        );

        console.log(
            "TARGET:",
            dashboardTransportUrl
        );

        const dashboardTransportResponse =
            await request(
                dashboardTransportUrl,
                {
                    method:
                        "GET",

                    headers: {
                        accept:
                            "application/json"
                    }
                }
            );

        console.log("");
        console.log(
            "DASHBOARD TRANSPORT HTTP STATUS:",
            dashboardTransportResponse.status
        );

        console.log(
            "DASHBOARD TRANSPORT DURATION MS:",
            dashboardTransportResponse.durationMs
        );

        if (
            dashboardTransportResponse.status !==
                200
        ) {

            fail(
                EXIT.OBSERVATION,
                (
                    "Dashboard Runtime observation " +
                    "transport is not available. " +
                    "Received HTTP " +
                    dashboardTransportResponse.status +
                    "."
                )
            );

        }

        if (
            !isObject(
                dashboardTransportResponse.json
            )
        ) {

            fail(
                EXIT.OBSERVATION,
                (
                    "Dashboard Runtime observation " +
                    "transport did not return JSON."
                )
            );

        }

        console.log("");
        console.log(
            "DASHBOARD OBSERVATION TRANSPORT: PASS"
        );

        section(
            "STAGE 7 CERTIFICATION RESULT"
        );

        console.log(
            "EXECUTIVE WAITING BOUNDARY: PASS"
        );

        console.log(
            "HTTP 202 WAITING RESPONSE: PASS"
        );

        console.log(
            "STRATEGY WAITING STATUS: PASS"
        );

        console.log(
            "RUNTIME REASON AUTHORITY: PASS"
        );

        console.log(
            "RUNTIME OBSERVATION TRANSPORT: PASS"
        );

        console.log(
            "DASHBOARD TRANSPORT AVAILABILITY: PASS"
        );

        console.log("");
        console.log(
            "DIRECT KV ACCESS: NONE"
        );

        console.log(
            "CONTRACT INJECTION: NONE"
        );

        console.log(
            "RESEARCH MOCKING: NONE"
        );

        console.log(
            "DIRECT STRATEGY EXECUTION: NONE"
        );

        console.log("");
        console.log(
            "STAGE 7 LIVE DEPLOYED WAITING PATH: PASS"
        );

        exitCode =
            EXIT.PASS;

    } catch (error) {

        exitCode =
            Number.isInteger(
                error?.certificationExitCode
            )
                ? error.certificationExitCode
                : EXIT.UNEXPECTED;

        section(
            "STAGE 7 CERTIFICATION FAILURE"
        );

        console.log(
            "ERROR NAME:",
            error?.name
        );

        console.log(
            "ERROR MESSAGE:",
            error?.message
        );

        console.log(
            "CERTIFICATION EXIT CODE:",
            exitCode
        );

        console.log("");
        console.log(
            "ERROR STACK:"
        );

        console.log(
            error?.stack
        );

        console.log("");
        console.log(
            "STAGE 7 LIVE DEPLOYED WAITING PATH: FAIL"
        );

    } finally {

        process.exitCode =
            exitCode;

    }

})();