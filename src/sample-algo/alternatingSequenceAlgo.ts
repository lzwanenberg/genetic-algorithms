import { range } from "ramda";
import GeneticAlgorithm from "../genetic-algo/types/GeneticAlgorithm";

export type ASInput = {
  length: number;
  max1s: number;
};

export type ASGene = 0 | 1;

const alternatingSequenceAlgo: GeneticAlgorithm<ASInput, ASGene> = {
  createInitialPopulation: (input) =>
    range(0, 10).map(() =>
      range(0, input.length).map(() => (Math.random() < 0.5 ? 0 : 1))
    ),
  calculateFitness: (input: ASInput, chromosome: ASGene[]): number => {
    const numberOf1s = chromosome.filter((gene) => gene === 1).length;
    if (numberOf1s > input.max1s) return 0;

    return chromosome.reduce<number>((fitness, gene, index) => {
      if (index === 0) return fitness;
      const previousGene = chromosome[index - 1];

      return gene !== previousGene ? fitness + 1 : fitness;
    }, 0);
  },
  mutate: (gene: ASGene): ASGene => (gene === 0 ? 1 : 0),
};

export default alternatingSequenceAlgo;
