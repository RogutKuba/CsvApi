import { LimitService } from './packages/backend-common/src/services/Limit/Limit.service';
import { DbClient } from '@billing/database/db';
import { AuthResponse } from './packages/backend-common/src/services/Auth/auth.types';

// Mock user account and database client
const mockAccount: AuthResponse['account'] = {
  id: 'user-123',
  numRequests: 0,
  numRequestsExpiryDate: new Date().toISOString(),
  subscriptionPlan: {
    allowedRequests: 1000,
  },
};
const mockDb: DbClient = {
  // Mock implementation of DbClient methods
};

// Simulate a user request and update request count
LimitService.assertRequests({ account: mockAccount, db: mockDb })
  .then(() => {
    console.log('Request count updated. Current count:', mockAccount.numRequests);
    if (mockAccount.numRequests === 1) {
      console.log('Test passed: Request count is incremented.');
    } else {
      console.error('Test failed: Request count is not incremented.');
    }
  })
  .catch((error) => {
    console.error('Test failed with error:', error);
  });

