import RegisterForm from '@/components/auth/RegisterForm'
import { cookies } from 'next/headers';
import { verifyAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function registerPage() {
  const token = cookies().get("token")?.value;
  const user = token ? await verifyAuth(token) : null;

  if (user) redirect("/");

  return <RegisterForm />;
}
