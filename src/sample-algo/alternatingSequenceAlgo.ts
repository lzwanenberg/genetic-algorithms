import { range } from "ramda";
import Chromosome from "../genetic-algo/types/Chromosome";
import GeneticAlgorithm from "../genetic-algo/types/GeneticAlgorithm";

export type ASInput = {
  length: number;
  // max1s: number;
};

export type ASGene = 0 | 1;

const calculateTotal = (chromosome: Chromosome<ASGene>) =>
  chromosome.reduce<number>((total, gene) => total + gene, 0);

const rewards: ((chromesome: Chromosome<ASGene>) => number)[] = [
  (c) => (c[1] === 0 ? 20 : 0),
  (c) => (c[0] === c[1] ? 20 : 0),
  (c) => calculateTotal(c),
  (c) =>
    c.reduce<number>(
      (score, gene, i) =>
        i >= 3
          ? c[i - 3] === 0 && c[i - 2] === 0 && c[i - 1] === 1 && c[i] === 1
            ? score + 500
            : score
          : score,
      0
    ),
];

const alternatingSequenceAlgo: GeneticAlgorithm<ASInput, ASGene> = {
  createChromosome: (input, prng) =>
    range(0, input.length).map((g) => (prng() < 0.5 ? 0 : 1)),

  calculateFitness: (input: ASInput, chromosome: ASGene[]): number => {
    return rewards.reduce((score, reward) => score + reward(chromosome), 0);
  },
  // chromosome.reduce<number>((fitness, gene, index) => {
  //   if (index === 0) return fitness;
  //   const previousGene = chromosome[index - 1];

  //   return gene !== previousGene ? fitness + 1 : fitness;
  // }, 0),

  mutate: (gene: ASGene): ASGene => (gene === 0 ? 1 : 0),
  getId: (gene: ASGene) => gene,
};

export default alternatingSequenceAlgo;
