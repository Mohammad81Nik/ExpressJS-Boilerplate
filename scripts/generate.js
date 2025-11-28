#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const moduleName = process.argv[2];

if (!moduleName) {
  console.error('❌ Error: You must provide a module name.');
  console.error('Usage: npm run make <module-name>');
  process.exit(1);
}

const name = moduleName.toLowerCase();
const pascalName = name.charAt(0).toUpperCase() + name.slice(1);
const baseDir = path.join(__dirname, '..', 'src');
const rootDir = path.join(__dirname, '..');

// --- Required directories ---
const dirs = {
  controllers: path.join(baseDir, 'controllers'),
  services: path.join(baseDir, 'services'),
  routes: path.join(baseDir, 'routes'),
  validation: path.join(baseDir, 'validation'),
  tests: path.join(rootDir, 'tests'),
};

const testDirs = {
  unit: path.join(rootDir, 'tests', 'unit'),
  integration: path.join(rootDir, 'tests', 'integration'),
};

// --- Ensure directories exist ---
Object.entries(dirs).forEach(([key, dirPath]) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created folder: ${dirPath}`);
  }
});

// --- Ensure test directories exist ---
Object.entries(testDirs).forEach(([key, path]) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
    console.log(`📁 Created folder: ${path}`);
  }
});

// --- Templates ---
const templates = {
  controller: `
import { ${name}Service } from "@services/${name}.service";
import type { Create${pascalName}DTO } from '@validation/${name}.schema';
import type { RequestHandler } from 'express';

export const create${pascalName}Controller: RequestHandler = (req, res) => {
  const data: Create${pascalName}DTO = req.validated;
  const result = ${name}Service.create(data.body);

  res.status(201).json({
    message: "${name} created",
    data: result
  });
};
`,

  service: `export const ${name}Service = {
  create(data: {name: string}) {
    return {
      id: Date.now(),
      ...data
    };
  }
};
`,

  router: `import { Router } from "express";
import { validateMiddleware } from "@middleware/validation.middleware";
import { create${pascalName}Schema } from "@validation/${name}.schema";
import { create${pascalName}Controller } from "@controllers/${name}.controller";

const router = Router();

router.post("/", validateMiddleware(create${pascalName}Schema), create${pascalName}Controller);

export default router;
`,

  schema: `import { z } from "zod";

export const create${pascalName}Schema = z.object({
  body: z.object({
    name: z.string().min(2),
  })
});

export type Create${pascalName}DTO = z.infer<typeof create${pascalName}Schema>;
`,
};

// --- Test templates ---
const testTemplates = {
  unit: {
    controller: `
import { describe, expect, it, vi } from 'vitest';
import {
  create${pascalName}Controller,
} from '../../src/controllers/${name}.controller';

describe('${name}.controller', () => {
  it('returns ${name} created json', () => {
    const res: any = { json: vi.fn(), status: vi.fn().mockReturnThis() };
    const req: any = {
      validated: {
        body: {
          name: '${name}',
        },
      },
    };
    const next: any = vi.fn();

    create${pascalName}Controller(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith({
      message: '${name} created',
      data: {
        id: expect.any(Number),
        name: req.validated.body.name,
      },
    });
  });
});
`,
    service: `
import { describe, expect, it } from 'vitest';
import { ${name}Service } from '../../src/services/${name}.service';

describe('${name}.service', () => {
  it('should create a ${name}', () => {
    const ${name} = ${name}Service.create({ name: 'bar' });

    expect(${name}).toEqual({
      id: expect.any(Number),
      name: 'bar',
    });
  });
});

`,
  },
  integration: `
import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../../src/app/index';

describe('POST /${name}', () => {
  it('should create ${name} data', async () => {
    const res = await request(app).post('/${name}').send({ name: '${name}' }).expect(201);

    expect(res.body).toEqual({
      message: '${name} created',
      data: {
        id: expect.any(Number),
        name: '${name}',
      },
    });
  });

  it('should return a 422 error response', async () => {
    const res1 = await request(app).post('/${name}').send({}).expect(422);
    const res2 = await request(app).post('/${name}').send({ ${name}: 'bar' }).expect(422);
    const res3 = await request(app).post('/${name}').send({ name: 1 }).expect(422);

    const jsonBody = {
      message: 'validation error',
      errors: {
        name: expect.any(Array),
      },
    };

    expect(res1.body).toEqual(jsonBody);
    expect(res2.body).toEqual(jsonBody);
    expect(res3.body).toEqual(jsonBody);
  });
});

`,
};

// --- File paths ---
const files = {
  controller: path.join(dirs.controllers, `${name}.controller.ts`),
  service: path.join(dirs.services, `${name}.service.ts`),
  router: path.join(dirs.routes, `${name}.router.ts`),
  schema: path.join(dirs.validation, `${name}.schema.ts`),
};

const testFiles = {
  unit: {
    controller: path.join(testDirs.unit, `${name}.controller.test.ts`),
    service: path.join(testDirs.unit, `${name}.service.test.ts`),
  },
  integration: path.join(testDirs.integration, `${name}.test.ts`),
};

// --- Generate files ---
Object.entries(files).forEach(([type, filePath]) => {
  if (fs.existsSync(filePath)) {
    console.log(`⚠️ Skipped (already exists): ${filePath}`);
    return;
  }

  fs.writeFileSync(filePath, templates[type]);
  console.log(`✔️ Created: ${filePath}`);
});

// --- Generate test files ---
Object.entries(testFiles).forEach(([type, data]) => {
  if (type === 'unit') {
    Object.entries(data).forEach(([type, filePath]) => {
      if (fs.existsSync(filePath)) {
        console.log(`⚠️ Skipped (already exists): ${filePath}`);
        return;
      }

      fs.writeFileSync(filePath, testTemplates.unit[type]);
      console.log(`✔️ Created: ${filePath}`);
    });
  } else {
    if (fs.existsSync(data)) {
      console.log(`⚠️ Skipped (already exists): ${data}`);
      return;
    }

    fs.writeFileSync(data, testTemplates[type]);
    console.log(`✔️ Created: ${data}`);
  }
});

console.log('\n🎉 Module generated successfully.\n');
