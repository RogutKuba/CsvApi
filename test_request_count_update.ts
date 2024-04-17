import { LimitService } from './packages/backend-common/src/services/Limit/Limit.service';
import { DbClient } from '@billing/database/db';
import { AuthResponse } from './packages/backend-common/src/services/Auth/auth.types';

// Mock account and database client
const mockAccount: AuthResponse['account'] = {
  id: 'test-account-id',
  numRequests: 0,
  numRequestsExpiryDate: new Date().toISOString(),
  subscriptionPlan: {
    allowedRequests: 1000,
    allowedApis: 10,
  },
};
const mockDb: DbClient = {
  // Mock implementation of DbClient methods
};

// Function to simulate a request and check the request count
async function simulateRequestAndUpdateCount() {
  try {
    await LimitService.assertRequests({
      account: mockAccount,
      db: mockDb,
    });
    console.log('Request count updated successfully.');
  } catch (error) {
    console.error('Error updating request count:', error);
  }
}

// Run the test
simulateRequestAndUpdateCount();
