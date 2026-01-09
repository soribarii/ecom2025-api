import { readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const loadRoutes = async (app) => {
  try {
    // get path ('D:\Basic_Web_Tutorial\E-commerce\server\routes')
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const routesPath = path.join(__dirname, "../routes");

    // read files in folder ./routes
    const files = await readdir(routesPath);

    // get only file .js
    const routeFiles = files.filter((file) => file.endsWith('.js'));

    const imports = routeFiles.map(async (file) => {
      const routeModule = await import(`../routes/${file}`);
      app.use("/api", routeModule.default);
    });

    await Promise.all(imports);
  } catch (error) {
    console.error("❌ Error loading routes:", error);
    throw error;
  }
}

export default loadRoutes;
