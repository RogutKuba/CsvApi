import { NextRequest, NextResponse } from 'next/server';
import { WorkOS } from '@workos-inc/node';
import { SignJWT } from 'jose';
import { env } from '@billing/web/env.mjs';

// Get secret
const secret = new Uint8Array(Buffer.from(env.JWT_SECRET_KEY, 'base64'));

const workos = new WorkOS(env.WORKOS_API_KEY);
const clientId = env.WORKOS_CLIENT_ID;

export async function GET(req: NextRequest) {
  // The authorization code returned by AuthKit
  const code = req.nextUrl.searchParams.get('code') || '';

  const { user } = await workos.userManagement.authenticateWithCode({
    code,
    clientId,
  });

  // Cleanup params and redirect to homepage
  const url = req.nextUrl.clone();
  url.searchParams.delete('code');
  url.pathname = '/app';

  const response = NextResponse.redirect(url);

  // Create a JWT with the user's information
  const token = await new SignJWT({
    // Here you might lookup and retrieve user details from your database
    user,
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);

  // Store in a cookie
  response.cookies.set({
    name: 'x-auth-token',
    value: token,
    // httpOnly: true,
    // secure: true,
    // sameSite: 'lax',
  });

  return response;
}
