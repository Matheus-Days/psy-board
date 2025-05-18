import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { createRequire } from 'module';
import { firestore} from 'firebase-admin'

const require = createRequire(import.meta.url);
const admin = require('firebase-admin');

let db: firestore.Firestore | undefined;

try {
  const creds = process.env['FIREBASE_ADMIN'];

  if (creds) {
    try {
      // Verifica se já existe uma instância do Firebase inicializada
      if (!admin.apps.length) {
        const credential = admin.credential.cert(JSON.parse(creds));
        admin.initializeApp({
          credential,
          projectId: JSON.parse(creds).project_id,
          databaseURL: `https://${JSON.parse(creds).project_id}.firebaseio.com`,
        });
      }
    } catch (error) {
      console.error('Erro ao inicializar Firebase Admin:', error);
    }
  }

  db = admin.firestore();
} catch (error) {
  console.error('Não foi possível carregar firebase-admin:', error);
}

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

// Inicialize Cloudinary
cloudinary.config({
  cloud_name: process.env['CLOUD_NAME']!,
  api_key: process.env['CLOUD_API_KEY']!,
  api_secret: process.env['CLOUD_API_SECRET']!,
});

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

// Endpoint de upload
app.post('/api/upload', upload.single('file') as any, async (req, res) => {
  try {
    const buffer = req.file!.buffer;
    // Envia via stream para Cloudinary
    const streamUpload = (buf: Buffer) => {
      return new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(buf);
      });
    };
    const result = await streamUpload(buffer);
    return res.json({ url: result.secure_url });
  } catch (err) {
    return res.status(500).json({ error: (err as any).message });
  }
});

app.get('/api/users', async (_, res) => {
  try {
    if (!db) {
      throw new Error('Firebase Admin não foi inicializado corretamente');
    }
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then(response =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
