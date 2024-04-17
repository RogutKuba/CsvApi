import { LimitService } from './packages/backend-common/src/services/Limit/Limit.service';
import { DbClient } from '@billing/database/db';
import { AuthResponse } from './packages/backend-common/src/services/Auth/auth.types';

// Mock user account object
const mockAccount: AuthResponse['account'] = {
  id: 'user-123',
  numRequests: 0,
  numRequestsExpiryDate: new Date().toISOString(),
  subscriptionPlan: {
    allowedRequests: 100,
    allowedApis: 10,
  },
};

// Mock DbClient
const mockDb: DbClient = {
  // Mock implementation of DbClient methods
};

async function simulateRequestAndUpdateCount() {
  try {
    console.log(`Current request count: ${mockAccount.numRequests}`);
    await LimitService.updateRequestsCount({ account: mockAccount, db: mockDb });
    console.log(`Updated request count: ${mockAccount.numRequests}`);
  } catch (error) {
    console.error('Error updating request count:', error);
  }
}

async function main() {
  for (let i = 0; i < 5; i++) {
    await simulateRequestAndUpdateCount();
  }
  console.log('Script completed successfully, no errors.');
}

main();
        // Update request count on every request
        await LimitService.updateRequestsCount({
            account,
            db,
        });
