import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentBase = path.join(process.cwd(), 'public/content');
const outputBase = path.join(process.cwd(), 'src/data');

// Ensure output directory exists
if (!fs.existsSync(outputBase)) {
  fs.mkdirSync(outputBase, { recursive: true });
}

const generateIndex = (folder, outputFileName) => {
  const dirPath = path.join(contentBase, folder);
  
  if (!fs.existsSync(dirPath)) {
    console.warn(`Warning: Directory ${dirPath} does not exist. Skipping ${outputFileName}.`);
    return [];
  }

  const files = fs.readdirSync(dirPath);
  const dataList = [];
  const errors = [];

  files.forEach(file => {
    if (file.endsWith('.md')) {
      const filePath = path.join(dirPath, file);
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        
        // Validate required fields
        const requiredFields = folder === 'authors' ? ['id', 'name'] : ['id', 'title'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
          errors.push(`File ${file}: Missing required fields: ${missingFields.join(', ')}`);
        }
        
        // No ID format validation for portfolio (allowing any ID length)
        
        // Validate title/name has translations
        const mainField = folder === 'authors' ? 'name' : 'title';
        if (data[mainField]) {
          if (typeof data[mainField] === 'object') {
            const langs = Object.keys(data[mainField]);
            if (langs.length === 0) {
              errors.push(`File ${file}: ${mainField} object is empty`);
            }
          }
        }
        
        // Check content is not empty
        if (!content || content.trim().length === 0) {
          errors.push(`File ${file}: Empty content`);
        }

        // Add leading slash to image paths for issues (if not external URL)
        if (folder === 'issues' && data.cover) {
          const isExternal = data.cover.startsWith('http');
          data.cover = isExternal || data.cover.startsWith('/') ? data.cover : `/${data.cover}`;
        }

        // Add leading slash to image paths for authors (if not external URL)
        if (folder === 'authors' && data.image) {
          const isExternal = data.image.startsWith('http');
          data.image = isExternal || data.image.startsWith('/') ? data.image : `/${data.image}`;
        }

        dataList.push(data);
      } catch (error) {
        errors.push(`File ${file}: ${error.message}`);
      }
    }
  });

  // Log errors
  if (errors.length > 0) {
    console.error(`\n❌ Validation errors in ${folder}:`);
    errors.forEach(err => console.error(`  - ${err}`));
    console.error('');
  }

  try {
    fs.writeFileSync(path.join(outputBase, outputFileName), JSON.stringify(dataList, null, 2));
    console.log(`✓ Successfully generated ${outputFileName} with ${dataList.length} items.`);
  } catch (error) {
    console.error(`❌ Failed to write ${outputFileName}: ${error.message}`);
  }
  
  return dataList;
};

// Generate all indexes
console.log('📝 Generating content indexes...\n');
generateIndex('articles', 'search-index.json');
generateIndex('authors', 'authors-index.json');
generateIndex('issues', 'issues-index.json');
console.log('\n✅ Index generation complete.');
