// netlify/functions/ssr.ts
import serverless from 'serverless-http';
// @ts-ignore
import { handler as angularHandler } from '../../dist/psy-board/server/server.mjs';

export const handler = serverless(angularHandler);
