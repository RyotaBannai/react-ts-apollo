import React from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/react-hooks";
import { ApolloClient, ApolloError } from "apollo-client";
import gql from "graphql-tag";
import {
  Button,
  Input,
  InputLabel,
  OutlinedInput,
  Grid,
} from "@material-ui/core";

const ADD_USER = gql`
  mutation CREATE($name: String, $email: String, $password: String) {
    createUser(data: { name: $name, email: $email, password: $password }) {
      token
      expires_in
    }
  }
`;

interface Props {}

export const Signin: React.FC<Props> = () => {
  let name: any = "";
  let email: any = "";
  let password: any = "";
  const client: ApolloClient<any> = useApolloClient();
  const [addUser, { data, loading, called }] = useMutation(ADD_USER, {
    onCompleted({ createUser: { token } }) {
      localStorage.setItem("token", token as string);
      client.writeData({ data: { isLoggedIn: true } });
    },
    onError(error: ApolloError) {
      console.log(error);
    },
  });
  return (
    <div>
      <div style={{ margin: "10px" }}>
        <Grid
          container
          justify="center"
          alignItems="center"
          direction="column"
          spacing={1}
        >
          <Grid item>
            <InputLabel htmlFor="name">Name</InputLabel>
            <OutlinedInput
              id="name"
              required
              inputRef={(node) => {
                name = node;
              }}
            />
          </Grid>
          <Grid item>
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput
              id="email"
              required
              inputRef={(node) => {
                email = node;
              }}
            />
          </Grid>
          <Grid item>
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              required
              inputRef={(node) => {
                password = node;
              }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={(e: any) => {
                console.log("clicked");
                e.preventDefault();
                let variables: any = {
                  name: name.value,
                  email: email.value,
                  password: password.value,
                };
                addUser({
                  variables,
                });
                name.value = "";
                email.value = "";
                password.value = "";
              }}
            >
              Add Todo
            </Button>
          </Grid>
          <Grid item>{JSON.stringify(data)}</Grid>
        </Grid>
      </div>
    </div>
  );
};
