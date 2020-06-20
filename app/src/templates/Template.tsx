import React from "react";
import Nav from '../organisms/Nav';
import { Link } from "react-router-dom";

interface Props {
    
}

export const Template: React.FC<Props> = props => {
    return (<div>
            <Nav/>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        {props.children}
                    </div>
                </div>
            </div>
        </div>)
 };
