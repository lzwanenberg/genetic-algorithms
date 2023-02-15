import { range } from "ramda";
import GeneticAlgorithm, {
  Chromosome,
  Population,
} from "./types/GeneticAlgorithm";

const splitAtIndex = <T>(
  input: T[],
  index: number
): { left: T[]; right: T[] } => ({
  left: [...input].splice(0, index),
  right: [...input].splice(index),
});

const performOnePointCrossover = <T>(
  a: T[],
  b: T[],
  index: number
): [T[], T[]] => {
  const aSplit = splitAtIndex(a, index);
  const bSplit = splitAtIndex(b, index);

  return [
    [...aSplit.left, ...bSplit.right],
    [...bSplit.left, ...aSplit.right],
  ];
};

const mutatePopulation = <Input, Gene>(
  algo: GeneticAlgorithm<Input, Gene>,
  population: Population<Gene>
): Population<Gene> =>
  population.map((chromosome) =>
    chromosome.map((gene) => (Math.random() > 0.9 ? algo.mutate(gene) : gene))
  );

const toString = <Gene>(chromosome: Chromosome<Gene>): string =>
  chromosome.reduce((s, current) => `${s}${current}`, "");

const createOffspring = <Gene>(
  a: Chromosome<Gene>,
  b: Chromosome<Gene>
): Chromosome<Gene>[] =>
  range(0, a.length).flatMap((index) => performOnePointCrossover(a, b, index));

const createGeneticAlgorithm =
  <Input, Gene>(algo: GeneticAlgorithm<Input, Gene>) =>
  (input: Input) => {
    var population = algo.createInitialPopulation(input);
    var generation = 1;

    const getChromosomesSortedByFitness = () =>
      population
        .map((chromosome) => ({
          chromosome,
          fitness: algo.calculateFitness(input, chromosome),
        }))
        .sort((a, b) => b.fitness - a.fitness);

    while (generation < 100) {
      const fitnessValues = getChromosomesSortedByFitness();
      const [parentA, parentB] = fitnessValues.map(
        (fitness) => fitness.chromosome
      );
      population = createOffspring(parentA, parentB);
      population = mutatePopulation(algo, population);
      generation++;

      console.log(
        `Generation ${generation} ${toString(parentA)}(${algo.calculateFitness(
          input,
          parentA
        )}) x ${toString(parentB)} (${algo.calculateFitness(input, parentB)})`
      );
    }

    const [result] = getChromosomesSortedByFitness();

    console.log("==================");
    console.log({ result });
  };

export default createGeneticAlgorithm;
