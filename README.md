# react-ts-apollo

Builds on react + ts + apollo

### ApolloClient

- `clientState`: An object representing your `local state configuration`. This is useful if you would like to use the Apollo cache for local state management.
- Whenever Apollo Client fetches query results from your server, it `automatically caches those results locally`. This makes subsequent executions of the same query extremely fast.
- `Updating cached query results?`: Caching query results is handy and easy to do, but sometimes you want to make sure that cached data is `up to date` with your server. Apollo Client supports two strategies for this: `polling` and `refetching`.
  `pulling`: provides `near-real-time synchronization` with your server by causing a query to execute `periodically` at a specified interval.
  `refreshing`: enables you to refresh query results `in response to a particular user action`, as opposed to using a fixed interval. You can optionally provide a new variables object to the refetch function. If you don't, **the query uses the same variables that it used in its previous execution**.
- `notifyOnNetworkStatusChange: true`　にすると refetch した時も loading などの状態を際表示することができる。
- `Executing queries manually` -> `useLazyQuery`: ユーザーのボタンクリック時などに発火したい場合。
- Updating a single existing entity -> mutation does automatically because mutation returns its id. But if a mutation `modifies multiple entities`, or if it `creates or deletes entities`, the Apollo Client cache is `not` automatically updated to reflect the result of the mutation. To resolve this, your call to `useMutation` can include an `update function`.

- By leveraging `Apollo Client's local state functionality`, you can add `client-side only fields` to your remote data seamlessly and query them from your components.

### State Management

- It's important to note that `direct writes` are not implemented as `GraphQL mutations` under the hood, so `you shouldn't include them in your schema`. They also `do not validate that the data you're writing to the cache is in the shape of valid GraphQL data`.
- The `@client` directives here let `useQuery` component know that `todos` and `visibilityFilter` should be pulled from the `Apollo Client cache` **or** resolved using p`re-defined local resolvers` When mixture of remove and local query with `@client` directive:
  1. If a matching resolver function can be found, run and return the result from the resolver function
  2. If resolver function can't be found, then check the Apollo Client cache to see if a isInCart value can be found directly. If so, return that value.

```javascript
const MEMBER_DETAILS = gql`
  query Member {
    member {
      name
      role
      isLoggedIn @client
    }
  }
`;
```

- With the above example, first isLoggedIn field is stripped from the rest of the fields and query will be sent to server. and then isLoggedIn will be computed with the rest of the returned value from server. and finally the isLoggedIn will be merged to the rest of the returned value and returnd to client as complete response.

- If you would like to hit a REST endpoint from your resolver, we recommend checking out `apollo-link-rest` instead
- It's important to understand how `fetch policies` impact the running of resolver functions, since by default local resolver functions are **not** run on every request. This is because `the result of running a local resolver` is cached with the rest of the query result, and pulled from the cache on the next request.
- If we haven't specified a `fetchPolicy prop` in our `useQuery call`, we're using Apollo Client's default `cache-first fetchPolicy`. This means when the query is run, it checks `the cache first` to see if it can find a result.

  > But what if you're using local resolvers to run calculations that you need fired on every request? You can switch your query to use a fetchPolicy that forces your entire query to run on each request, like `no-cache` or `network-only`. This will make sure your local resolvers fire on every request, but it will also make sure your network based query components fire on every request. Depending on your use case this might be okay, but \*\*what if you want the network parts of your query to leverage the cache, and just want your @client parts to run on every request?\*\* We'll cover a more flexible option for this in the Forcing resolvers with `@client(always: true)` section.

  - `Using @client fields as variables`: use local cache as query toward remote.

```javascript
// get 'currentAuthorId' from cache and use this as variable, 'authorId' which is used in postCount field in the next, to query toward remote
const query = gql`
  query currentAuthorPostCount($authorId: Int!) {
    currentAuthorId @client @export(as: "authorId")
    postCount(authorId: $authorId)
  }
`;
// you can apply this idea into selection set as well.
const query = gql`
  query currentAuthorPostCount($authorId: Int!) {
    currentAuthor @client { // selection fields
      name
      authorId @export(as: "authorId")
    }
    postCount(authorId: $authorId)
  }
`;
// and more! @export variable use isn't limited to remote queries; it can also be used to define variables for other @client fields or selection sets:
const query = gql`
  query currentAuthorPostCount($authorId: Int!) {
    currentAuthorId @client @export(as: "authorId")
    postCount(authorId: $authorId) @client
  }
`;
```

- A few important notes about @export use:
  1. `the execution order of an operation` looks like it `could affect the result`. From the Normal and Serial Execution section of the GraphQL spec. It prepares `@export variables first` running through an operation that has `@client @export directives`, extracting the `specified @export variables`, **then** attempting to resolve the value of those variables from the local cache or local resolvers.
  2. If you define `multiple @export variables that use the same name`, in a single operation, the value of the `last` @export variable will be used as the variable value moving forward. When this happens Apollo Client will log a warning message (dev only).
- If you're using the `InMemoryCache and not overriding the dataIdFromObject config property`, your `cache key` should be `__typename:id`
- To write the data to the cache, you can use either `cache.writeFragment` or `cache.writeData`.

  - The only difference between the two is that `cache.writeFragment` requires that you pass in `a fragment to validate that the shape of the data you're writing to the cache node is the same as the shape of the data required by the fragment`. Under the hood, `cache.writeData` automatically constructs a fragment from the data object and id you pass in and calls cache.writeFragment.

- [Why react function component renders twice](https://mariosfakiolas.com/blog/my-react-components-render-twice-and-drive-me-crazy/)
- [Why Apollo render three times](https://github.com/trojanowski/react-apollo-hooks/issues/36#issuecomment-448055185)

  - Render with cache-data, render while loading, render with data-result = 3 times

- `Pagination`: By default, `fetchMore` will use **the original query**, so we just pass in new variables is enough to get new data from server. Once the new data is returned from the server, the `updateQuery` function is used to merge it with the existing data, which will cause a re-render of your UI component with an expanded list.
