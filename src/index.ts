import createGeneticAlgorithm from "./genetic-algo/createGeneticAlgorithm";
import alternatingSequenceAlgo, {
  ASInput,
} from "./sample-algo/alternatingSequenceAlgo";

const input: ASInput = {
  length: 12,
  max1s: 5,
};

const runAlgo = createGeneticAlgorithm(alternatingSequenceAlgo);

runAlgo(input);

export default 2;
