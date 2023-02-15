import * as seedrandom from "seedrandom";
import createGeneticAlgorithm from "./genetic-algo/createGeneticAlgorithm";
import alternatingSequenceAlgo from "./sample-algo/alternatingSequenceAlgo";

const createRunner = createGeneticAlgorithm(alternatingSequenceAlgo);

const runAlgo = createRunner({
  createPrng: seedrandom,
  populationSize: 10,
  mutation: {
    probability: 0.05,
  },
  generations: 100,
});

runAlgo({
  length: 40,
});

export default 2;
