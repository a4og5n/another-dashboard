import { generatePageFromConfig } from "./scripts/generators/api/generate-from-config.ts";
import { getPageConfig } from "./src/generation/page-configs.ts";

async function main() {
  try {
    const config = getPageConfig("list-members");
    const result = await generatePageFromConfig(config, "list-members");

    console.log("\n✅ Generation Complete!\n");
    console.log("Files created:");
    result.files.forEach((file) => console.log(`  - ${file}`));

    if (result.warnings.length > 0) {
      console.log("\n⚠️  Warnings:");
      result.warnings.forEach((warning) => console.log(`  - ${warning}`));
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Generation failed:", error);
    process.exit(1);
  }
}

main();
