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
- `Fragments on unions and interfaces`: Heuristic fragment matcher works in most cases, but it also means that `Apollo Client cannot check the server response for you`, and it cannot tell you when `you're manually writing invalid data` into the store using update, updateQuery, writeQuery, etc. Also, `the heuristic fragment matcher will not work accurately when using fragments with unions or interfaces`. Apollo Client will let you know this with a console warning (in development), if it attempts to use the default heuristic fragment matcher with unions/interfaces. The `IntrospectionFragmentMatcher` is the solution for working with unions/interfaces.

- `Error handling`: By default, the error policy treats any GraphQL Errors as network errors and ends the request chain.

- `Afterware` is very similar to a middleware, except that an afterware `runs after a request has been made`, that is when a response is going to get processed. It's perfect for responding to the situation where a user becomes logged out during their session.
- `Query deduplication`: can be useful if many components `display the same data`, but `you don't want to fetch that data from the server many times.`
- After an user logs out, you needs to clear token [here](https://www.apollographql.com/docs/react/networking/authentication/)
- [Introspection - fragment-mater reference on Medium](https://medium.com/commutatus/whats-going-on-with-the-heuristic-fragment-matcher-in-graphql-apollo-client-e721075e92be)
- [Apollo Client docs ref `IntrospectionFragmentMatcher`](https://www.apollographql.com/docs/react/data/fragments/)
- [jwt nestjs implementation example](https://tea.ch/article/authentication-with-passport-jwt/)
- [jwt Node.js/Express example - シェルスクリプトマガジン](https://shell-mag.com/nodejs-59/)
- [JWT Authentication Node.js Tuto with GraphQL and react - Ben](https://www.youtube.com/watch?v=25GS0MLT8JU)
- [detect if an attribute like password has changed](https://github.com/typeorm/typeorm/issues/2624): use `@BeforeInsert()` `@BeforeUpdate()`
- [Authorization TypeGraphQl - Ben](Authorization TypeGraphQL)

### v3

#### Custom normalization feature

- apollo client generates unique key with `__typename` and `id`(or `_id`) by default. if you want to change this, define keyFields with whichever you want to define as a key.
  - you can use `composite key` like sql. (check below Person type)
  - you can also use `subfield` as part of its primary key. (for example, `author's name`, shown in the below.)

```javascript
typePolicies: {
    Product: {
      // In most inventory management systems, a single UPC code uniquely
      // identifies any product.
      keyFields: ["upc"],
    },
    Person: {
      // In some user account systems, names or emails alone do not have to
      // be unique, but the combination of a person's name and email is
      // uniquely identifying.
      keyFields: ["name", "email"],
    },
    Book: {
      // If one of the keyFields is an object with fields of its own, you can
      // include those nested keyFields by using a nested array of strings:
      keyFields: ["title", "author", ["name"]], //  the name field of the previous field in the array (author) is part of the primary key
    },
}
```

- Calculating an object's identifier challenging, so to help with this, you can use the `cache.identify` method to calculate the identifier for any normalized object you fetch from your cache. [See Obtaining an object's custom ID.](https://www.apollographql.com/docs/react/caching/cache-interaction/#obtaining-an-objects-custom-id)
- If `__typename` is not specific, then you can use the `dataIdFromObject` function that was introduced in Apollo Client 2.x: Deprecated in favor of the `keyFields` option of the `TypePolicy` object.

#### cache.modify

- the way to make a change to an existing object with a variety of useful methods.
- The cache utility object that's passed into `modifier functions` as their second parameter contains several useful utilities, like `fieldName`, `canRead` and `isReference`.
- It also contains a `DELETE sentinel object` that can be returned to delete a field from the entity object.

```javascript
cache.modify({
  id: cache.identify(thread),
  fields: {
    comments(_, { DELETE }) {
      return DELETE;
    },
  },
});
```

- cache.identity には 次のような物を渡して、特定の Type の primary key を作成させる。
  - isbn を primary key とするため `TypePolicy` で事前に行っておく。

```javascript
const invisibleManBook = {
  __typename: "Book",
  isbn: "9780679601395", // This type's custom identifier
  title: "Invisible Man",
  author: {
    __typename: "Author",
    name: "Ralph Ellison",
  },
};
```

- これで Book の isbn が "9780679601395"のデータを更新できる。

```javascript
const bookYearFragment = gql`
  fragment BookYear on Book {
    publicationYear
  }
`;

const fragmentResult = cache.writeFragment({
  id: cache.identify(invisibleManBook),
  fragment: bookYearFragment,
  data: {
    publicationYear: "1952",
  },
});
```

### Garbage collection and cache eviction

- The `gc` method removes all objects from the normalized cache that are `not reachable`: `cache.gc();`
  - Any normalized objects that are not visited during this process are removed. [ref](https://www.apollographql.com/docs/react/caching/garbage-collection/#cachegc)
- you can remove any normalized object from the cache (`Reachable as well!`) with `evict` method: `cache.evict()`
  - You can also remove a single field from a cached object by providing the name of the field to remove: `cache.evict({ id: 'my-object-id' })`
  - `Evicting an object often makes other cached objects unreachable`. Because of this, you should call `cache.gc` after `evicting` one or more objects from the cache.

#### Dangling references

- When an object is evicted from the cache, references to that object might remain in other cached objects. Apollo Client preserves these dangling references by default, because the referenced object might be written back to the cache at a later time. This means the reference might still be useful.
- you can use `canRead` to determine if the cache is dangling references or not. there is `toReference` method to return cache in case there is not cache.

```javascript
fields: {
        ruler(existingRuler, { canRead, toReference }) {
          // If there is no existing ruler, Apollo becomes the ruling deity
          return canRead(existingRuler) ? existingRuler : toReference({
            __typename: "Deity",
            name: "Apollo",
          });
        },
      },
```
