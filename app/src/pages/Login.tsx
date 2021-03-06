import React from "react";
import { useLazyQuery, useApolloClient } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
import { Button, InputLabel, OutlinedInput, Grid } from "@material-ui/core";

const LOGIN = gql`
  query LOGIN($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ... on LoginFails {
        message
      }
      ... on TokenEntity {
        token
        expires_in
      }
    }
  }
`;

interface Props {}

export const Login: React.FC<Props> = () => {
  let email: any = "";
  let password: any = "";
  const client: ApolloClient<any> = useApolloClient();
  const [login, { called, loading, data }] = useLazyQuery(LOGIN);

  return (
    <div>
      <div style={{ margin: "10px" }}>
        <h2>Login</h2>
        <Grid
          container
          justify="center"
          alignItems="center"
          direction="column"
          spacing={1}
        >
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
                  email: email.value,
                  password: password.value,
                };
                login({
                  variables,
                });
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
