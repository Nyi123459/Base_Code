import cuid2 from "@paralleldrive/cuid2";

interface Cuid2 {
  (): string;
  isCuid(id: string): boolean;
}

const cuid2Typed = cuid2 as unknown as Cuid2;

const Id = Object.freeze({
  makeId: cuid2Typed,
  isValidId: cuid2Typed.isCuid,
});

export default Id;
