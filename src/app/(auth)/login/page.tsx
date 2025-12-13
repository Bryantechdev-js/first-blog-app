import LoginForm from '@/components/auth/LoginForm'
import { cookies } from 'next/headers';
import { verifyAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function loginPage() {
  const cookiestore = await cookies()
  const token = cookiestore.get("token")?.value;
  const user = token ? await verifyAuth(token) : null;

  if (user) redirect("/");

  return <LoginForm />;
}
