import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// DatoCMS API config
const API_URL = 'https://graphql.datocms.com/';
const API_TOKEN = '3fe2bbeef4b29e5444a911555d3ca8';

const query = `
  query {
    allCategories {
      id
      title
      slug
      _createdAt
    }
  }
`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKUP_DIR = path.join(__dirname, '../backups');
const BACKUP_PATH = path.join(BACKUP_DIR, 'categories.json');

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
        throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
        throw new Error(JSON.stringify(result.errors));
    }

    return result.data.allCategories;
}

async function saveBackup(categories) {
    try {
        await fs.mkdir(BACKUP_DIR, { recursive: true });
        await fs.writeFile(BACKUP_PATH, JSON.stringify(categories, null, 2));
        console.log('✅ Categories backup saved successfully.');
    } catch (error) {
        console.error('❌ Failed to save categories backup:', error.message);
    }
}

async function loadBackup() {
    try {
        const data = await fs.readFile(BACKUP_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error('⚠️ Categories backup file could not be read.', error);
    }
}

// use this to force backup updatade
// await fetchCategories({ forceUpdate: true });
export async function fetchCategories({ forceUpdate = false } = {}) {
    if (forceUpdate) {
        try {
            const categories = await fetchFromDatoCMS();
            await saveBackup(categories);
            return categories;
        } catch (error) {
            console.error('❌ Error fetching categories from DatoCMS:', error.message);
            return [];
        }
    }

    try {
        const categories = await fetchFromDatoCMS();
        return categories;
    } catch (datoError) {
        console.error('❌ Complete failure: Categories fetch also failed.', datoError.message);

        try {
            const backup = await loadBackup();
            return backup;
        } catch (backupError) {
            console.warn('⚠️ Categories backup missing or failed. Fetching from DatoCMS...', backupError);
            return [];
        }
    }
}