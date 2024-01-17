export const getUser = async (): Promise<{
  isAuthenticated: boolean;
  user: any;
}> => {
  const response = await fetch("/api/auth/me");
  const data = await response.json();
  return data;
};
