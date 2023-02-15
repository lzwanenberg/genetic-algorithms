import Chromosome from "./Chromosome";
import PRNG from "./PRNG";

type GeneticAlgorithm<Input, Gene> = {
  createChromosome: (input: Input, prng: PRNG) => Chromosome<Gene>;
  calculateFitness: (input: Input, chromosome: Chromosome<Gene>) => number;
  mutate: (gene: Gene, prng: PRNG) => Gene;
  getId: (gene: Gene) => number;
};

export default GeneticAlgorithm;
