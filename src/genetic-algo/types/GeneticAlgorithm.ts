export type Chromosome<Gene> = Gene[];
export type Population<Gene> = Chromosome<Gene>[];

type GeneticAlgorithm<Input, Gene> = {
  createInitialPopulation: (input: Input) => Population<Gene>;
  calculateFitness: (input: Input, chromosome: Chromosome<Gene>) => number;
  mutate: (gene: Gene) => Gene;
};

export default GeneticAlgorithm;
