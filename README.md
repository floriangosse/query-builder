# query-builder

**NOTE: This a not a production ready library. It's only an experiment.**

> Allows to create query builders like many data management layer libraries (ORM, ...) use and match data with these queries.

## Usage

```ts
type User = {
  id: string;
  email: string;
  createdAt: string;
  lastSeenAt: string | null;
};

type UserFilter = {
    id: IdFilter;
    email: StringFilter;
    createdAt: StringFilter;
    lastSeenAt: StringNullableFilter;
};

type UserWhere = Partial<UserFilter>;

const createUserFilter = createEntityFilterDefinition<User, UserFilter>({
    id: createIdFilter(),
    email: createStringFilter(),
    createdAt: createStringFilter(),
    lastSeenAt: createStringNullableFilter()
});

export type UserFindManyArgs = {
    where?: UserWhere;
};

export async function findMany(args: UserFindManyArgs = {}): Promise<User[]> {
    const filterUser = createUserFilter(args.where ?? {});

    return myData.users.filter((user) => filterUser(user));
}
```
