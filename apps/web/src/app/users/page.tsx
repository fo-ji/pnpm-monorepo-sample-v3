import { getUsers } from '@/features/users';
import Link from 'next/link';

export default async function UsersPage() {
  const { users } = await getUsers({
    query: {
      name: 'user',
    },
  });

  return (
    <ul className="space-y-4">
      {users.map((user) => (
        <li key={user.id}>
          <Link href={`/users/${user.id}`}>{user.name}</Link>
        </li>
      ))}
    </ul>
  );
}
