import React, {useEffect} from "react";

interface Props {
    title: string
}


export const Apollo: React.FC<Props> = ({title}) => {
    useEffect(()=>{ }, []);
    return (
        <div>
            <h2>{title}</h2>
        </div>
    );
};