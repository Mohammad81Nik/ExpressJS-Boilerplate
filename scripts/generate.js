#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const moduleName = process.argv[2];

if (!moduleName) {
  console.error('❌ Error: Provide a module name');
  console.error('Usage: npm run generate <module-name>');
  process.exit(1);
}

const name = moduleName.toLowerCase();
const pascalName = name.charAt(0).toUpperCase() + name.slice(1);
const baseDir = path.join(__dirname, '..', 'src');
const testDir = path.join(__dirname, '..', 'tests');

const templates = {
  controller: `import { ${name}Service } from '../services/${name}.service.js';
import type { RequestHandler } from 'express';

export const create${pascalName}: RequestHandler = async (req, res) => {
  const result = await ${name}Service.create(req.validated.body);
  res.status(201).json({ data: result });
};
`,

  service: `import { ${name}Repository } from '../repositories/${name}.repository.js';
import { NotFoundError } from '../utils/errors.js';
import { Create${pascalName}DTO } from '../validation/${name}.schema.js';


export const ${name}Service = {
  async getAll() {
    return ${name}Repository.findMany();
  },

  async getById(id: number) {
    const item = await ${name}Repository.findById(id);
    if (!item) throw new NotFoundError('${pascalName} not found');
    return item;
  },

  async create(data: Create${pascalName}DTO) {
    return ${name}Repository.create(data);
  },
};
`,

  repository: `import { prisma } from '../lib/prisma.js';
import { Create${pascalName}DTO } from '../validation/${name}.schema.js';

export const ${name}Repository = {
  findMany() {
    return prisma.${name}.findMany();
  },

  findById(id: number) {
    return prisma.${name}.findUnique({ where: { id } });
  },

  create(data: Create${pascalName}DTO) {
    return prisma.${name}.create({ data: data.body });
  },
};
`,

  router: `import { Router } from 'express';
import { validateMiddleware } from '../middleware/validation.middleware.js';
import { create${pascalName}Schema } from '../validation/${name}.schema.js';
import { create${pascalName} } from '../controllers/${name}.controller.js';

const router = Router();

router.post('/', validateMiddleware(create${pascalName}Schema), create${pascalName});

export default router;
`,

  schema: `import { z } from 'zod';

export const create${pascalName}Schema = z.object({
  body: z.object({
    // Add your fields here
    foo: z.string()
  }),
});

export type Create${pascalName}DTO = z.infer<typeof create${pascalName}Schema>;
`,

  controllerTest: `import { describe, it, expect, vi, beforeEach } from 'vitest';
import { create${pascalName} } from '../../../src/controllers/${name}.controller.js';
import { prisma } from '../../../src/lib/prisma.js';

describe('${name}.controller', () => {
  beforeEach(async () => {
    await prisma.${name}.deleteMany();
  });

  it('should create ${name} and return 201', async () => {
    const req: any = { validated: { body: { /* add fields */ } } };
    const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next: any = vi.fn();

    await create${pascalName}(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      data: expect.objectContaining({ id: expect.any(Number) }),
    });
  });
});
`,

  serviceTest: `import { describe, it, expect, beforeEach } from 'vitest';
import { ${name}Service } from '../../../src/services/${name}.service.js';
import { prisma } from '../../../src/lib/prisma.js';
import { NotFoundError } from '../../../src/utils/errors.js';

describe('${name}.service', () => {
  beforeEach(async () => {
    await prisma.${name}.deleteMany();
  });

  it('should create ${name}', async () => {
    const data = { 
      /* add fields */ 
      foo: "bar",
    };
    const result = await ${name}Service.create({body: data});

    expect(result).toMatchObject(data);
  });

  it('should get all ${name}s', async () => {
    await ${name}Service.create({ 
      /* fields */ 
      body: {
        foo: "bar",
      }
    });
    await ${name}Service.create({ 
      /* fields */ 
      body: {
        foo: "bar",
      }
    });

    const result = await ${name}Service.getAll();

    expect(result).toHaveLength(2);
  });

  it('should throw NotFoundError when ${name} not found', async () => {
    await expect(${name}Service.getById(999)).rejects.toThrow(NotFoundError);
  });
});
`,

  repositoryTest: `import { describe, it, expect, beforeEach } from 'vitest';
import { ${name}Repository } from '../../../src/repositories/${name}.repository.js';
import { prisma } from '../../../src/lib/prisma.js';

describe('${name}.repository', () => {
  beforeEach(async () => {
    await prisma.${name}.deleteMany();
  });

  it('should create ${name}', async () => {
    const data = { 
      /* add fields */
      foo: "bar"
    };
    const result = await ${name}Repository.create({ body: data });

    expect(result).toMatchObject(data);
  });

  it('should find ${name} by id', async () => {
    const created = await ${name}Repository.create({ 
      /* fields */ 
      body: {
        foo: "bar"
      }
    });
    const found = await ${name}Repository.findById(created.id);

    expect(found).toEqual(created);
  });

  it('should return null when ${name} not found', async () => {
    const result = await ${name}Repository.findById(999);
    expect(result).toBeNull();
  });
});
`,

  integrationTest: `import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../src/app/index.js';
import { prisma } from '../../../src/lib/prisma.js';

describe('POST /${name}', () => {
  beforeEach(async () => {
    await prisma.${name}.deleteMany();
  });

  it('should create ${name}', async () => {
    const res = await request(app)
      .post('/${name}')
      .send({ /* add fields */ })
      .expect(201);

    expect(res.body.data).toMatchObject({ id: expect.any(Number) });
  });

  it('should return 422 for invalid data', async () => {
    const res = await request(app)
      .post('/${name}')
      .send({})
      .expect(422);

    expect(res.body.message).toBe('validation error');
  });
});
`,
};

const files = {
  controller: path.join(baseDir, 'controllers', `${name}.controller.ts`),
  service: path.join(baseDir, 'services', `${name}.service.ts`),
  repository: path.join(baseDir, 'repositories', `${name}.repository.ts`),
  router: path.join(baseDir, 'routes', `${name}.router.ts`),
  schema: path.join(baseDir, 'validation', `${name}.schema.ts`),
  controllerTest: path.join(testDir, 'unit', name, `${name}.controller.test.ts`),
  serviceTest: path.join(testDir, 'unit', name, `${name}.service.test.ts`),
  repositoryTest: path.join(testDir, 'unit', name, `${name}.repository.test.ts`),
  integrationTest: path.join(testDir, 'integration', name, `${name}.test.ts`),
};

Object.entries(files).forEach(([type, filePath]) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (fs.existsSync(filePath)) {
    console.log(`⚠️  Skipped: ${filePath}`);
    return;
  }

  fs.writeFileSync(filePath, templates[type]);
  console.log(`✅ Created: ${filePath}`);
});

console.log(`\n🎉 Module '${name}' created! Now:\n`);
console.log(`1. Add model to prisma/schema.prisma`);
console.log(`2. Run: npx prisma migrate dev`);
console.log(`3. Define fields in src/validation/${name}.schema.ts`);
console.log(`4. Update test data in tests/unit/${name}/ and tests/integration/${name}/`);
console.log(`5. Register route in src/app/index.ts\n`);
