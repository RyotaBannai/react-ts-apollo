import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Button from "@material-ui/core/Button";

interface Props {}

const GET_TODOS = gql`
  {
    todos @client {
      id
      completed
      text
    }
    visibilityFilter @client
  }
`;

const ADD_TODO = gql`
  mutation AddTodo($id: Float!, $completed: Boolean!, $text: String!) {
    addTodo(id: $id, completed: $completed, text: $text) @client
  }
`;

class Counter {
  constructor(private _uuid: number = 0) {}
  get uuid() {
    return this._uuid++;
  }
}
const counter = new Counter();

export const Sub: React.FC<Props> = () => {
  let input: any = "";
  const { data } = useQuery(GET_TODOS);
  const [addTodo] = useMutation(ADD_TODO);

  return (
    <div style={{ margin: "10px" }}>
      <input
        ref={(node) => {
          input = node;
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={(e: any) => {
          e.preventDefault();
          let variables: any = {
            id: counter.uuid,
            completed: false,
            text: input.value,
          };
          addTodo({
            variables,
          });
          input.value = "";
        }}
      >
        Default
      </Button>
      {data.todos.map((todo: any) => (
        <p key={todo.id}>{todo.text}</p>
      ))}
    </div>
  );
};
