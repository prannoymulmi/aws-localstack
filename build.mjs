import * as esbuild from "esbuild";
import fs from "fs";

const Reset = "\x1b[0m";
const FgBlue = "\x1b[34m";

const lambdas = fs
    .readdirSync("./src/entryPoints")
    .filter((file) => fs.statSync(`./src/entryPoints/${file}`).isFile())
    .map((file) => ({
        name: file.replace(".ts", ""),
        path: `entryPoints/${file.replace(".ts", ".js")}`,
    }));

console.log(
    `${FgBlue}Building ${lambdas.length} lambdas${Reset} (${lambdas.map((lambda) => lambda.name).join(", ")})`,
);

for (const lambdaInfo of lambdas) {
    const outputPath = `deployment/${lambdaInfo.name}/lambda.js`;
    await esbuild.build({
        entryPoints: [`dist/${lambdaInfo.path}`],
        bundle: true,
        platform: "node",
        outfile: outputPath,
        external: [
            "@aws-sdk/client-cloudwatch-logs",
        ],
    });
    const stats = fs.statSync(outputPath);
    console.log(
        ` - Build lambda ${FgBlue}${lambdaInfo.name}${Reset} (${new Intl.NumberFormat("en").format(stats.size / (1024 * 1024))} MiB)`,
    );
}