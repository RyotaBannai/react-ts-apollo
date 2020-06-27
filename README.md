# react-ts-apollo
Builds on react + ts + apollo
### ApolloClient
- `clientState`: An object representing your `local state configuration`. This is useful if you would like to use the Apollo cache for local state management.
- Whenever Apollo Client fetches query results from your server, it `automatically caches those results locally`. This makes subsequent executions of the same query extremely fast. 
- `Updating cached query results?`: Caching query results is handy and easy to do, but sometimes you want to make sure that cached data is `up to date` with your server. Apollo Client supports two strategies for this: `polling` and `refetching`.
    `pulling`: provides `near-real-time synchronization` with your server by causing a query to execute `periodically` at a specified interval.
    `refreshing`: enables you to refresh query results `in response to a particular user action`, as opposed to using a fixed interval. You can optionally provide a new variables object to the refetch function. If you don't, **the query uses the same variables that it used in its previous execution**.
- `Executing queries manually` -> `useLazyQuery`
- Updating a single existing entity -> mutation does automatically because mutation returns its id. But if a mutation `modifies multiple entities`, or if it `creates or deletes entities`, the Apollo Client cache is `not` automatically updated to reflect the result of the mutation. To resolve this, your call to `useMutation` can include an `update function`.