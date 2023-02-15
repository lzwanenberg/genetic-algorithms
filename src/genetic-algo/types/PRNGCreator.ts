import PRNG from "./PRNG";

type PRNGCreator = (seed: string) => PRNG;

export default PRNGCreator;
