import React from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Button from "@material-ui/core/Button";

interface Props {}

const GET_ITEMS = gql`
  query GetItems($skip: Int, $take: Int, $current: Int) {
    getItems(skip: $skip, take: $take, current: $current) {
      id
      data
      type
      list {
        id
        name
      }
    }
  }
`;

const resolvers = {
  Resolvers: {
    addTodo: (_root: any, variables: any, { cache, getCacheKey }: any) => {
      console.log("called");
      const query = gql`
        query TodoQuery {
          todos @client {
            id
            completed
            text
          }
        }
      `;
      const data = cache.readQuery({ query });
      const myNewTodo = {
        ...variables,
        __typename: "Todo",
      };
      cache.writeQuery({
        query,
        data: { todos: [...data.todos, myNewTodo] },
      });
      return null;
    },
  },
};

export const Pagination: React.FC<Props> = () => {
  const { called, loading, data } = useQuery(GET_ITEMS, {
    variables: { skip: 0, take: 2, current: 0 },
  });
  const client = useApolloClient();
  client.addResolvers(resolvers);
  if (called && loading) return <p>Loading ...</p>;
  if (!called) {
    return <div>Press button to fetch next chunk</div>;
  }
  return (
    <div style={{ margin: "10px" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={(e: any) => {
          e.preventDefault();
        }}
      >
        Fetch Next
      </Button>
      <div>
        <h4>Item List</h4>
        {data.getItems.map((item: any) => (
          <p key={item.id}>{item.data}</p>
        ))}
      </div>
    </div>
  );
};
