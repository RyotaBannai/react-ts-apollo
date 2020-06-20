import React, {useEffect, useState} from "react";
import { gql } from "apollo-boost";
import { useQuery } from '@apollo/react-hooks';

interface Props {
    title: string
}

const EXCHANGE_RATES = gql`
  {
    rates(currency: "USD") {
      currency
      rate
    }
  }
`;

export const Apollo: React.FC<Props> = ({title}) => {
    const { loading, error, data } = useQuery(EXCHANGE_RATES);
    useEffect(()=>{

    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    return (
        <div>
            { data.rates.map((rate: any) => <p> {rate.currency} </p>)}
        </div>
    );
};