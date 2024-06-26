import { NextResponse } from 'next/server';
import { WorkOS } from '@workos-inc/node';
import { env } from '@billing/web/env.mjs';

const workos = new WorkOS(env.WORKOS_API_KEY);
const clientId = env.WORKOS_CLIENT_ID;

export function GET() {
  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    // Specify that we'd like AuthKit to handle the authentication flow
    provider: 'authkit',
    // The callback URI AuthKit will redirect to after authentication
    redirectUri: `${env.NEXT_PUBLIC_URL}/api/auth/callback`,
    clientId,
  });

  // Redirect the user to the AuthKit sign-in page
  return NextResponse.json(
    {
      redirect: authorizationUrl,
    },
    {
      status: 302,
    }
  );
}
