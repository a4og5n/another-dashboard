import { generatePageFromConfig } from "./scripts/generators/api/generate-from-config.js";
import { getPageConfig } from "./src/generation/page-configs.js";

const config = getPageConfig("list-activity");
const result = await generatePageFromConfig(config, "list-activity");

console.log(JSON.stringify(result, null, 2));
