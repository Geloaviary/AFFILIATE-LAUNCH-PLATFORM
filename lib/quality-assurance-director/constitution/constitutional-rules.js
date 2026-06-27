/*
========================================
QUALITY ASSURANCE DIRECTOR

Platform Constitution

Single Source of Truth

Defines every constitutional
rule enforced by the platform.

Consumed by

• Constitutional Validator
• Rule Engine
• Repair Modules
• Learning Engine
• Prediction Engine
• Engineering Director

Constitution QA-001

========================================
*/

/*
========================================
CONSTITUTION
========================================
*/

const CONSTITUTION = {

  id:

    "affiliate-launch-platform",

  title:

    "Affiliate Launch Platform Constitution",

  version:

    "1.0.0",

  status:

    "active",

  createdAt:

    "2026-06-26",

  updatedAt:

    "2026-06-26"

};

/*
========================================
RULE CATEGORIES
========================================
*/

const RULE_CATEGORY = {

  QUALITY:

    "quality",

  BUSINESS:

    "business",

  DATA:

    "data",

  WORKFLOW:

    "workflow",

  CONTENT:

    "content",

  ASSET:

    "asset",

  PRODUCTION:

    "production",

  RENDER:

    "render",

  SECURITY:

    "security",

  COMPLIANCE:

    "compliance"

};

/*
========================================
DEPARTMENTS
========================================
*/

const DEPARTMENT = {

  RESEARCH:

    "research",

  STRATEGY:

    "strategy",

  CONTENT:

    "content",

  ASSET_INTELLIGENCE:

    "asset-intelligence",

  PRODUCTION:

    "production",

  RENDERING:

    "rendering",

  PLATFORM:

    "platform"

};

/*
========================================
RULE BUILDER
========================================
*/

function rule({

  id,

  title,

  description,

  department,

  category,

  severity,

  workflowStages = [],

  autoRepair = false,

  repairPriority = 5,

  constitutionalArticle = 1,

  constitutionalSection = 1,

  dependencies = [],

  prerequisites = [],

  conflictsWith = [],

  evidenceRequired = [],

  repairStrategy = null,

  repairModule = null,

  validationFunction = null,

  engineeringOwner = null,

  learningEnabled = true,

  predictionWeight = 1,

  confidence = 100,

  active = true,

  version = 1

}) {

  return {

    id,

    title,

    description,

    department,

    category,

    severity,

    workflowStages,

    autoRepair,

    repairPriority,

    constitutionalArticle,

    constitutionalSection,

    dependencies,

    prerequisites,

    conflictsWith,

    evidenceRequired,

    repairStrategy,

    repairModule,

    validationFunction,

    engineeringOwner,

    learningEnabled,

    predictionWeight,

    confidence,

    active,

    version,

    createdAt:

      new Date()

        .toISOString(),

    updatedAt:

      new Date()

        .toISOString()

  };

}

/*
========================================
RESEARCH RULES
========================================
*/

const RESEARCH_RULES = [

  rule({

    id:

      "RES-001",

    title:

      "Research Must Contain Target Market",

    description:

      "Every research submission must identify a target market.",

    department:

      DEPARTMENT.RESEARCH,

    category:

      RULE_CATEGORY.DATA,

    severity:

      "critical",

    workflowStages:

      [

        "research"

      ],

    autoRepair:

      true,

    repairModule:

      "research",

    repairStrategy:

      "discover-target-market",

    validationFunction:

      "validateTargetMarket",

    engineeringOwner:

      "research-director"

  }),

  rule({

    id:

      "RES-002",

    title:

      "Research Must Define Audience",

    description:

      "Audience profile is mandatory.",

    department:

      DEPARTMENT.RESEARCH,

    category:

      RULE_CATEGORY.QUALITY,

    severity:

      "high",

    workflowStages:

      [

        "research"

      ],

    autoRepair:

      true,

    repairModule:

      "research",

    repairStrategy:

      "generate-audience-profile",

    validationFunction:

      "validateAudience"

  })

];

/*
========================================
STRATEGY RULES
========================================
*/

const STRATEGY_RULES = [

  rule({

    id:

      "STR-001",

    title:

      "Strategy Requires Offer",

    description:

      "A monetization offer must exist.",

    department:

      DEPARTMENT.STRATEGY,

    category:

      RULE_CATEGORY.BUSINESS,

    severity:

      "critical",

    workflowStages:

      [

        "strategy"

      ],

    autoRepair:

      true,

    repairModule:

      "strategy",

    repairStrategy:

      "generate-offer",

    validationFunction:

      "validateOffer"

  }),

  rule({

    id:

      "STR-002",

    title:

      "Strategy Requires CTA",

    description:

      "Call-to-action must be defined.",

    department:

      DEPARTMENT.STRATEGY,

    category:

      RULE_CATEGORY.BUSINESS,

    severity:

      "high",

    workflowStages:

      [

        "strategy"

      ],

    autoRepair:

      true,

    repairModule:

      "strategy",

    repairStrategy:

      "generate-cta",

    validationFunction:

      "validateCTA"

  })

];

/*
========================================
CONTENT RULES
========================================
*/

const CONTENT_RULES = [

  rule({

    id:

      "CNT-001",

    title:

      "Content Must Have Headline",

    description:

      "Every content asset requires a primary headline.",

    department:

      DEPARTMENT.CONTENT,

    category:

      RULE_CATEGORY.CONTENT,

    severity:

      "critical",

    workflowStages: [

      "content"

    ],

    autoRepair: true,

    repairModule:

      "content",

    repairStrategy:

      "generate-headline",

    validationFunction:

      "validateHeadline"

  }),

  rule({

    id:

      "CNT-002",

    title:

      "Content Must Include CTA",

    description:

      "Content must contain a clear call-to-action.",

    department:

      DEPARTMENT.CONTENT,

    category:

      RULE_CATEGORY.BUSINESS,

    severity:

      "high",

    workflowStages: [

      "content"

    ],

    autoRepair: true,

    repairModule:

      "content",

    repairStrategy:

      "generate-cta",

    validationFunction:

      "validateCTA"

  }),

  rule({

    id:

      "CNT-003",

    title:

      "Content Must Be Original",

    description:

      "Generated content must not contain duplicated or placeholder text.",

    department:

      DEPARTMENT.CONTENT,

    category:

      RULE_CATEGORY.QUALITY,

    severity:

      "critical",

    workflowStages: [

      "content"

    ],

    autoRepair: true,

    repairModule:

      "content",

    repairStrategy:

      "rewrite-content",

    validationFunction:

      "validateOriginality"

  })

];

/*
========================================
ASSET INTELLIGENCE RULES
========================================
*/

const ASSET_RULES = [

  rule({

    id:

      "AST-001",

    title:

      "Assets Must Exist",

    description:

      "Referenced assets must exist before production.",

    department:

      DEPARTMENT.ASSET_INTELLIGENCE,

    category:

      RULE_CATEGORY.ASSET,

    severity:

      "critical",

    workflowStages: [

      "asset-intelligence"

    ],

    autoRepair: true,

    repairModule:

      "asset-intelligence",

    repairStrategy:

      "regenerate-assets",

    validationFunction:

      "validateAssets"

  }),

  rule({

    id:

      "AST-002",

    title:

      "Assets Must Match Campaign",

    description:

      "Images, videos and graphics must belong to the campaign.",

    department:

      DEPARTMENT.ASSET_INTELLIGENCE,

    category:

      RULE_CATEGORY.ASSET,

    severity:

      "high",

    workflowStages: [

      "asset-intelligence"

    ],

    autoRepair: true,

    repairModule:

      "asset-intelligence",

    repairStrategy:

      "match-assets",

    validationFunction:

      "validateAssetOwnership"

  })

];

/*
========================================
PRODUCTION RULES
========================================
*/

const PRODUCTION_RULES = [

  rule({

    id:

      "PRD-001",

    title:

      "Production Package Complete",

    description:

      "All required production assets must exist.",

    department:

      DEPARTMENT.PRODUCTION,

    category:

      RULE_CATEGORY.PRODUCTION,

    severity:

      "critical",

    workflowStages: [

      "production"

    ],

    autoRepair: true,

    repairModule:

      "production",

    repairStrategy:

      "complete-package",

    validationFunction:

      "validateProductionPackage"

  }),

  rule({

    id:

      "PRD-002",

    title:

      "Production Configuration Valid",

    description:

      "Production configuration must pass validation.",

    department:

      DEPARTMENT.PRODUCTION,

    category:

      RULE_CATEGORY.PRODUCTION,

    severity:

      "high",

    workflowStages: [

      "production"

    ],

    autoRepair: true,

    repairModule:

      "production",

    repairStrategy:

      "repair-configuration",

    validationFunction:

      "validateProductionConfiguration"

  })

];

/*
========================================
RENDERING RULES
========================================
*/

const RENDERING_RULES = [

  rule({

    id:

      "RND-001",

    title:

      "Rendering Configuration Valid",

    description:

      "Rendering configuration must be valid.",

    department:

      DEPARTMENT.RENDERING,

    category:

      RULE_CATEGORY.RENDER,

    severity:

      "critical",

    workflowStages: [

      "rendering"

    ],

    autoRepair: true,

    repairModule:

      "rendering",

    repairStrategy:

      "repair-render-settings",

    validationFunction:

      "validateRenderConfiguration"

  }),

  rule({

    id:

      "RND-002",

    title:

      "Rendered Output Verified",

    description:

      "Rendered output must pass post-render verification.",

    department:

      DEPARTMENT.RENDERING,

    category:

      RULE_CATEGORY.RENDER,

    severity:

      "high",

    workflowStages: [

      "rendering"

    ],

    autoRepair: false,

    repairModule:

      "rendering",

    repairStrategy:

      "re-render",

    validationFunction:

      "validateRenderOutput"

  })

];

/*
========================================
PLATFORM SHARED RULES

Applies to ALL departments.

========================================
*/

const PLATFORM_RULES = [

  rule({

    id:

      "SYS-001",

    title:

      "No Placeholder Values",

    description:

      "Platform data must not contain placeholders.",

    department:

      DEPARTMENT.PLATFORM,

    category:

      RULE_CATEGORY.QUALITY,

    severity:

      "critical",

    workflowStages: [

      "*"

    ],

    autoRepair: true,

    repairStrategy:

      "replace-placeholders",

    validationFunction:

      "validatePlaceholders"

  }),

  rule({

    id:

      "SYS-002",

    title:

      "Required Fields Complete",

    description:

      "All required fields must contain valid values.",

    department:

      DEPARTMENT.PLATFORM,

    category:

      RULE_CATEGORY.DATA,

    severity:

      "critical",

    workflowStages: [

      "*"

    ],

    autoRepair: true,

    repairStrategy:

      "populate-required-fields",

    validationFunction:

      "validateRequiredFields"

  }),

  rule({

    id:

      "SYS-003",

    title:

      "Constitution Compliance",

    description:

      "Every workflow must comply with the platform constitution.",

    department:

      DEPARTMENT.PLATFORM,

    category:

      RULE_CATEGORY.COMPLIANCE,

    severity:

      "critical",

    workflowStages: [

      "*"

    ],

    autoRepair: false,

    validationFunction:

      "validateConstitution"

  })

];

/*
========================================
ALL RULES

Single Constitution Database

========================================
*/

const ALL_RULES = [

  ...RESEARCH_RULES,

  ...STRATEGY_RULES,

  ...CONTENT_RULES,

  ...ASSET_RULES,

  ...PRODUCTION_RULES,

  ...RENDERING_RULES,

  ...PLATFORM_RULES

];

/*
========================================
RULE INDEX

O(1) Lookup

ruleId
↓

Rule

========================================
*/

const RULE_INDEX =

  new Map();

ALL_RULES.forEach(

  rule => {

    RULE_INDEX.set(

      rule.id,

      rule

    );

  }

);

/*
========================================
DEPARTMENT INDEX

department
↓

Rules[]

========================================
*/

const DEPARTMENT_INDEX =

  new Map();

ALL_RULES.forEach(

  rule => {

    if (

      !DEPARTMENT_INDEX.has(

        rule.department

      )

    ) {

      DEPARTMENT_INDEX.set(

        rule.department,

        []

      );

    }

    DEPARTMENT_INDEX

      .get(

        rule.department

      )

      .push(

        rule

      );

  }

);

/*
========================================
CATEGORY INDEX

category
↓

Rules[]

========================================
*/

const CATEGORY_INDEX =

  new Map();

ALL_RULES.forEach(

  rule => {

    if (

      !CATEGORY_INDEX.has(

        rule.category

      )

    ) {

      CATEGORY_INDEX.set(

        rule.category,

        []

      );

    }

    CATEGORY_INDEX

      .get(

        rule.category

      )

      .push(

        rule

      );

  }

);

/*
========================================
WORKFLOW INDEX

workflow stage
↓

Rules[]

========================================
*/

const WORKFLOW_INDEX =

  new Map();

ALL_RULES.forEach(

  rule => {

    rule.workflowStages

      .forEach(

        stage => {

          if (

            !WORKFLOW_INDEX.has(

              stage

            )

          ) {

            WORKFLOW_INDEX.set(

              stage,

              []

            );

          }

          WORKFLOW_INDEX

            .get(

              stage

            )

            .push(

              rule

            );

        }

      );

  }

/*
========================================
AUTO REPAIR INDEX

Only repairable rules

========================================
*/

);

const AUTO_REPAIR_RULES =

  ALL_RULES.filter(

    rule =>

      rule.autoRepair

  );

/*
========================================
ENGINEERING INDEX

Rules requiring
Engineering ownership

========================================
*/

const ENGINEERING_RULES =

  ALL_RULES.filter(

    rule =>

      rule.engineeringOwner

  );

/*
========================================
ACTIVE RULES

========================================
*/

const ACTIVE_RULES =

  ALL_RULES.filter(

    rule =>

      rule.active

  );

/*
========================================
VERSION INDEX

Future Constitution
Versioning

========================================
*/

const VERSION_INDEX =

  new Map();

ACTIVE_RULES.forEach(

  rule => {

    if (

      !VERSION_INDEX.has(

        rule.version

      )

    ) {

      VERSION_INDEX.set(

        rule.version,

        []

      );

    }

    VERSION_INDEX

      .get(

        rule.version

      )

      .push(

        rule

      );

  }

);

/*
========================================
LOOKUP

========================================
*/

function getRule(

  ruleId

) {

  return (

    RULE_INDEX.get(

      ruleId

    )

    ||

    null

  );

}

/*
========================================
DEPARTMENT RULES

========================================
*/

function getDepartmentRules(

  department

) {

  return

    DEPARTMENT_INDEX.get(

      department

    )

    ||

    [];

}

/*
========================================
CATEGORY RULES

========================================
*/

function getCategoryRules(

  category

) {

  return

    CATEGORY_INDEX.get(

      category

    )

    ||

    [];

}

/*
========================================
WORKFLOW RULES

========================================
*/

function getWorkflowRules(

  workflowStage

) {

  const rules =

    [

      ...(WORKFLOW_INDEX.get(

        workflowStage

      ) || []),

      ...(WORKFLOW_INDEX.get(

        "*"

      ) || [])

    ];

  return [

    ...new Map(

      rules.map(

        rule =>

          [

            rule.id,

            rule

          ]

      )

    ).values()

  ];

}

/*
========================================
SEARCH

Supports:

id

title

description

repair

department

category

========================================
*/

function search(

  query = ""

) {

  const keyword =

    query

      .toLowerCase();

  return ACTIVE_RULES.filter(

    rule =>

      rule.id

        .toLowerCase()

        .includes(

          keyword

        )

      ||

      rule.title

        .toLowerCase()

        .includes(

          keyword

        )

      ||

      rule.description

        .toLowerCase()

        .includes(

          keyword

        )

      ||

      (

        rule.repairStrategy ||

        ""

      )

      .toLowerCase()

      .includes(

        keyword

      )

  );

}

/*
========================================
RELATIONSHIP VALIDATION

Verifies that every rule
references valid rules.

========================================
*/

function validateRelationships() {

  const errors = [];

  ACTIVE_RULES.forEach(rule => {

    [

      ...(rule.dependencies || []),

      ...(rule.prerequisites || []),

      ...(rule.conflictsWith || [])

    ].forEach(ruleId => {

      if (

        !RULE_INDEX.has(ruleId)

      ) {

        errors.push({

          rule:

            rule.id,

          missingRule:

            ruleId

        });

      }

    });

  });

  return {

    valid:

      errors.length === 0,

    errors

  };

}

/*
========================================
CONSTITUTION VALIDATION

========================================
*/

function validate() {

  const relationshipValidation =

    validateRelationships();

  return {

    valid:

      relationshipValidation.valid,

    constitution:

      CONSTITUTION.id,

    version:

      CONSTITUTION.version,

    totalRules:

      ACTIVE_RULES.length,

    relationshipErrors:

      relationshipValidation.errors

  };

}

/*
========================================
STATISTICS

========================================
*/

function statistics() {

  return {

    constitution:

      CONSTITUTION.title,

    version:

      CONSTITUTION.version,

    totalRules:

      ALL_RULES.length,

    activeRules:

      ACTIVE_RULES.length,

    departments:

      DEPARTMENT_INDEX.size,

    categories:

      CATEGORY_INDEX.size,

    workflowStages:

      WORKFLOW_INDEX.size,

    autoRepairRules:

      AUTO_REPAIR_RULES.length,

    engineeringRules:

      ENGINEERING_RULES.length,

    versions:

      VERSION_INDEX.size

  };

}

/*
========================================
METADATA

========================================
*/

function metadata() {

  return {

    id:

      CONSTITUTION.id,

    title:

      CONSTITUTION.title,

    version:

      CONSTITUTION.version,

    status:

      CONSTITUTION.status,

    createdAt:

      CONSTITUTION.createdAt,

    updatedAt:

      CONSTITUTION.updatedAt

  };

}

/*
========================================
HELPERS

========================================
*/

function getAllRules() {

  return [

    ...ACTIVE_RULES

  ];

}

function getAutoRepairRules() {

  return [

    ...AUTO_REPAIR_RULES

  ];

}

function getEngineeringRules() {

  return [

    ...ENGINEERING_RULES

  ];

}

function getVersion(

  version

) {

  return

    VERSION_INDEX.get(

      version

    )

    ||

    [];

}

function exists(

  ruleId

) {

  return RULE_INDEX.has(

    ruleId

  );

}

function count() {

  return ACTIVE_RULES.length;

}

/*
========================================
EXPORTS

Universal Module Contract

QA-001

========================================
*/

module.exports = {

  CONSTITUTION,

  RULE_CATEGORY,

  DEPARTMENT,

  ALL_RULES,

  ACTIVE_RULES,

  AUTO_REPAIR_RULES,

  ENGINEERING_RULES,

  RULE_INDEX,

  DEPARTMENT_INDEX,

  CATEGORY_INDEX,

  WORKFLOW_INDEX,

  VERSION_INDEX,

  getRule,

  getAllRules,

  getDepartmentRules,

  getCategoryRules,

  getWorkflowRules,

  getAutoRepairRules,

  getEngineeringRules,

  getVersion,

  search,

  exists,

  count,

  validate,

  statistics,

  metadata

};