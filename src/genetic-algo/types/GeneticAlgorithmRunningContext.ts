import PRNGCreator from "./PRNGCreator";

type GeneticAlgorithmRunningContext = {
  populationSize: number;
  mutation: {
    probability: number;
  };
  generations: number;
  createPrng: PRNGCreator;
};

export default GeneticAlgorithmRunningContext;
