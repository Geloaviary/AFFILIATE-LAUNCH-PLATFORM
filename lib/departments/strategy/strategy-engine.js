const StrategyEngine = {

    async execute({

        context,

        options = {}

    }) {

        const {

            winner,

            top5,

            research,

            marketIntelligence,

            productIntelligence,

            audienceIntelligence,

            competitiveIntelligence,

            metadata

        } = context;

        return Object.freeze({

            winner,

            top5,

            marketIntelligence,

            productIntelligence,

            audienceIntelligence,

            competitiveIntelligence,

            metadata,

            strategy: {}

        });

    }

};

module.exports =

    Object.freeze(

        StrategyEngine

    );