import { createDefaultEsmPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultEsmPreset({
    tsconfig: "tsconfig.jest.json",
}).transform;

export default {
    testEnvironment: "node",

    extensionsToTreatAsEsm: [".ts"],

    transform: {
        ...tsJestTransformCfg,
    },
};
