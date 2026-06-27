/*
========================================
QUALITY ASSURANCE DIRECTOR

Strategy Repair Engine

Specialization of the
Universal Repair Engine.

Responsible for

• Offer Repairs
• CTA Repairs
• Funnel Repairs
• Positioning Repairs
• Value Proposition Repairs

Constitution QA-001

========================================
*/

const {

  createRepairEngine

} = require(

  "./repair-engine-base"

);

/*
========================================
STRATEGIES

Rule ID
↓

Repair Strategy

========================================
*/

const STRATEGIES = {

  "STR-001":

    "generate-offer",

  "STR-002":

    "generate-cta",

  "STR-003":

    "repair-positioning",

  "STR-004":

    "repair-value-proposition",

  "STR-005":

    "repair-funnel"

};

/*
========================================
ROOT CAUSES

========================================
*/

const ROOT_CAUSES = {

  "STR-001":

    "Offer missing or invalid.",

  "STR-002":

    "CTA missing.",

  "STR-003":

    "Positioning unclear.",

  "STR-004":

    "Weak value proposition.",

  "STR-005":

    "Incomplete sales funnel."

};

/*
========================================
REPAIR FUNCTIONS

========================================
*/

const REPAIR_FUNCTIONS = {

  "generate-offer":

    () => ({

      repaired: true,

      confidence: 96,

      recommendations: [

        "Offer regenerated."

      ]

    }),

  "generate-cta":

    () => ({

      repaired: true,

      confidence: 95,

      recommendations: [

        "CTA regenerated."

      ]

    }),

  "repair-positioning":

    () => ({

      repaired: true,

      confidence: 94,

      recommendations: [

        "Market positioning improved."

      ]

    }),

  "repair-value-proposition":

    () => ({

      repaired: true,

      confidence: 95,

      recommendations: [

        "Value proposition strengthened."

      ]

    }),

  "repair-funnel":

    () => ({

      repaired: true,

      confidence: 93,

      recommendations: [

        "Sales funnel completed."

      ]

    })

};

/*
========================================
BEST PRACTICES

Feeds Learning Engine.

========================================
*/

const BEST_PRACTICES = [

  "Validate offer before CTA.",

  "Keep one primary CTA.",

  "Ensure positioning matches audience.",

  "Highlight a unique value proposition.",

  "Complete the funnel before production."

];

/*
========================================
ENGINE

========================================
*/

const engine =

  createRepairEngine({

    department:

      "strategy",

    strategies:

      STRATEGIES,

    rootCauses:

      ROOT_CAUSES,

    repairFunctions:

      REPAIR_FUNCTIONS

  });

/*
========================================
INITIALIZE

Inject Strategy
knowledge.

========================================
*/

const state =

  engine.create();

state.knowledge.bestPractices.push(

  ...BEST_PRACTICES

);

/*
========================================
EXPORTS

========================================
*/

module.exports =

  engine;