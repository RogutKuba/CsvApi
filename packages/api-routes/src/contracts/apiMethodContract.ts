import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { ApiModel } from '../models/Api.model';

const c = initContract();

export const apiMethodsContract = c.router({
  getApis: {
    method: 'GET',
    path: '/api',
    responses: {
      200: z.array(ApiModel),
    },
    summary: 'Returns list of apis owned by account',
  },
  createApi: {
    method: 'POST',
    path: '/api/new',
    contentType: 'multipart/form-data',
    body: z.object({
      file: z.instanceof(Blob).or(z.instanceof(File)),
      fileName: z.string(),
      fieldDelimeterSpace: z.literal('true').or(z.literal('false')),
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
      file: z.instanceof(Blob).or(z.instanceof(File)),
      fileName: z.string(),
      fieldDelimeterSpace: z.literal('true').or(z.literal('false')),
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
    body: null,
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
    query: z.object({
      where: z.string().optional(),
      raw: z.literal('true').or(z.literal('false')).optional(),
    }),
    responses: {
      200: z.any(),
    },
    summary: 'Query api',
  },
});
