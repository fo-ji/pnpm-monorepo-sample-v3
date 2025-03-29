import { getUser } from '@/features/users';

type UserPageProps = {
  params: Promise<{ uid: string }>;
};

export default async function UserPage({ params }: UserPageProps) {
  const { uid } = await params;
  // const { data, success } = paramsUserSchema.safeParse({ uid });
  // if (!data || !success) notFound();

  const { user } = await getUser({
    param: {
      id: uid,
    },
  });

  return <div className="p-10">{user.name}</div>;
}
