import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// DatoCMS API config
const API_URL = 'https://graphql.datocms.com/';
const API_TOKEN = '3fe2bbeef4b29e5444a911555d3ca8';

const query = `
  query {
    allProducts {
      id
      title
      slug
      description
      price
      onsale
      category { slug }
      img { url }
      _createdAt
    }
  }
`;

// Path to store backup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKUP_DIR = path.join(__dirname, '../backups');
const BACKUP_PATH = path.join(BACKUP_DIR, 'products.json');

async function fetchFromDatoCMS() {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch from DatoCMS: ${response.status}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(JSON.stringify(result.errors));
  }

  return result.data.allProducts;
}

async function saveBackup(products) {
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    await fs.writeFile(BACKUP_PATH, JSON.stringify(products, null, 2));
    console.log('✅ Backup saved successfully.');
  } catch (error) {
    console.error('❌ Failed to save backup:', error.message);
  }
}

async function loadBackup() {
  try {
    const data = await fs.readFile(BACKUP_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error('⚠️ Backup file could not be read.', error);
  }
}

export async function fetchProducts({ forceUpdate = false } = {}) {
  if (forceUpdate) {
    try {
      const products = await fetchFromDatoCMS();
      await saveBackup(products);
      return products;
    } catch (error) {
      console.error('❌ Error fetching from DatoCMS:', error.message);
      return [];
    }
  }

  try {
    const backup = await loadBackup();
    return backup;
  } catch (backupError) {
    console.warn('⚠️ Backup failed or missing. Fetching from DatoCMS...', backupError);

    try {
      const products = await fetchFromDatoCMS();
      await saveBackup(products);
      return products;
    } catch (datoError) {
      console.error('❌ Complete failure: DatoCMS also failed.', datoError.message);
      return [];
    }
  }
}

// await fetchProducts({ forceUpdate: true });