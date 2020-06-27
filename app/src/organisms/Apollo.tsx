import React, { useEffect, useState } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

interface Props {
  title: string;
}

const ITEM = gql`
  {
    getOneItem(id: 1) {
      id
      list {
        id
        name
      }
    }
  }
`;

export const Apollo: React.FC<Props> = ({ title }) => {
  const { loading, error, data, refetch, networkStatus } = useQuery(ITEM, {
    notifyOnNetworkStatusChange: true, //  Includes information about refetching and polling status.
  });
  useEffect(() => {}, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <div>
      <p> {JSON.stringify(data)} </p>
    </div>
  );
};
