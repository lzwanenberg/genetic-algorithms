import { inc, range } from "ramda";
import GeneticAlgorithm from "./types/GeneticAlgorithm";
import Chromosome from "./types/Chromosome";
import Population from "./types/Population";
import GeneticAlgorithmRunningContext from "./types/GeneticAlgorithmRunningContext";
import PRNGCreator from "./types/PRNGCreator";
import PRNG from "./types/PRNG";

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
  population: Population<Gene>,
  prng: PRNG,
  mutationProbability: number
): Population<Gene> =>
  population.map((chromosome, c) =>
    chromosome.map((gene, i) =>
      prng() < mutationProbability ? algo.mutate(gene, prng) : gene
    )
  );

const toString = <Gene>(chromosome: Chromosome<Gene>): string =>
  chromosome.reduce((s, current) => `${s}${current}`, "");

const removeDuplicates = <Gene>(
  population: Population<Gene>,
  getId: (gene: Gene) => number
): Population<Gene> =>
  population.reduce(
    (acc, curr) => {
      const id = curr.map(getId).join(".");
      return acc.includedIds.has(id)
        ? acc
        : (() => {
            acc.includedIds.add(id);

            return {
              ...acc,
              uniquePopulation: [...acc.uniquePopulation, curr],
            };
          })();
    },
    {
      includedIds: new Set<string>(),
      uniquePopulation: [] as Population<Gene>,
    }
  ).uniquePopulation;

const createOffspring = <Gene>(
  a: Chromosome<Gene>,
  b: Chromosome<Gene>,
  amount: number,
  prng: PRNG
): Chromosome<Gene>[] =>
  range(0, amount).flatMap((index) =>
    performOnePointCrossover(a, b, Math.floor(prng() * a.length))
  );

const createGeneticAlgorithm =
  <Input, Gene>(algo: GeneticAlgorithm<Input, Gene>) =>
  (context: GeneticAlgorithmRunningContext) =>
  (input: Input, seed = 1) => {
    const prng = context.createPrng(seed.toString());

    var population: Population<Gene> = range(0, context.populationSize).map(
      () => algo.createChromosome(input, prng)
    );

    var generation = 1;

    const getChromosomesSortedByFitness = () =>
      population
        .map((chromosome, i) => ({
          chromosome,
          fitness: algo.calculateFitness(input, chromosome),
        }))
        .sort((a, b) => b.fitness - a.fitness);

    while (generation <= context.generations) {
      const fitnessValues = getChromosomesSortedByFitness();

      const [parentA, parentB] = fitnessValues.map(
        (fitness) => fitness.chromosome
      );

      const offspring = createOffspring(
        parentA,
        parentB,
        context.populationSize,
        prng
      );

      const mutatedOffspring = mutatePopulation(
        algo,
        offspring,
        prng,
        context.mutation.probability
      );

      population = removeDuplicates(mutatedOffspring, algo.getId);

      console.log(
        `Generation ${generation} ${toString(parentA)}(${algo.calculateFitness(
          input,
          parentA
        )}) x ${toString(parentB)} (${algo.calculateFitness(input, parentB)})`
      );

      generation++;
    }

    const [result] = getChromosomesSortedByFitness();

    console.log("==================");
    console.log({
      chromosome: result.chromosome.join(""),
      fitness: result.fitness,
    });
  };

export default createGeneticAlgorithm;
