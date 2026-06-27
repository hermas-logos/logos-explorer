import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function compileData() {
  console.log('Starting data aggregation...');
  
  const episodesDir = path.join(__dirname, 'content', 'episodes');
  const rootOutputFile = path.join(__dirname, 'episodes.json');
  const publicOutputDir = path.join(__dirname, 'public');
  const publicOutputFile = path.join(publicOutputDir, 'episodes.json');

  if (!fs.existsSync(episodesDir)) {
    console.error(`Episodes directory not found at: ${episodesDir}`);
    process.exit(1);
  }

  // Ensure public directory exists
  if (!fs.existsSync(publicOutputDir)) {
    fs.mkdirSync(publicOutputDir, { recursive: true });
    console.log(`Created public directory: ${publicOutputDir}`);
  }

  const files = fs.readdirSync(episodesDir);
  const jsonFiles = files.filter(file => file.endsWith('.json'));

  const episodes = [];

  for (const file of jsonFiles) {
    const filePath = path.join(episodesDir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      episodes.push(data);
      console.log(`Successfully loaded episode: ${data.id || file}`);
    } catch (err) {
      console.error(`Error parsing file ${file}:`, err);
    }
  }

  // Sort episodes chronologically (by id or publish_date)
  episodes.sort((a, b) => {
    // Attempt sorting by ID first
    const idA = parseInt(a.id, 10);
    const idB = parseInt(b.id, 10);
    if (!isNaN(idA) && !isNaN(idB)) {
      return idA - idB;
    }
    // Fallback to publish_date
    return new Date(a.publish_date) - new Date(b.publish_date);
  });

  const outputContent = JSON.stringify(episodes, null, 2);

  // Write to root
  fs.writeFileSync(rootOutputFile, outputContent, 'utf8');
  console.log(`Successfully wrote consolidated data to root: ${rootOutputFile}`);

  // Write to public folder for Vite frontend accessibility
  fs.writeFileSync(publicOutputFile, outputContent, 'utf8');
  console.log(`Successfully wrote consolidated data to public: ${publicOutputFile}`);

  console.log(`Aggregated ${episodes.length} episodes successfully.`);
}

compileData();
