import { ApiModel } from '@billing/database/schemas/api.db';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const apiMethodsCntract = c.router({
  createApi: {
    method: 'POST',
    path: '/api/new',
    contentType: 'multipart/form-data',
    body: z.object({
      file: z.instanceof(File).or(z.instanceof(Blob)),
    }),
    responses: {
      200: ApiModel,
    },
    summary: 'Create new api from csv or excel file',
  },
  updateApi: {
    method: 'PATCH',
    path: '/api/:id',
    pathParams: z.object({
      id: z.string(),
    }),
    body: z.object({
      name: z.string(),
    }),
    responses: {
      200: ApiModel,
    },
    summary: 'Update api metadata',
  },
  updateApiData: {
    method: 'PATCH',
    path: '/api/:id/data',
    contentType: 'multipart/form-data',
    pathParams: z.object({
      id: z.string(),
    }),
    body: z.object({
      file: z.instanceof(File).or(z.instanceof(Blob)),
    }),
    responses: {
      200: ApiModel,
    },
    summary: 'Update api to use new csv or excel file',
  },
  deleteApi: {
    method: 'DELETE',
    path: '/api/:id',
    pathParams: z.object({
      id: z.string(),
    }),
    body: z.object({}),
    responses: {
      200: z.literal('removed'),
    },
    summary: 'Delete api',
  },
  queryApi: {
    method: 'GET',
    path: '/api/:id',
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: z.any(),
    },
    summary: 'Query api',
  },
});
