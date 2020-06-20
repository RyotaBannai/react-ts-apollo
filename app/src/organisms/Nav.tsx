import React from "react";
import { NavLink } from "react-router-dom";

export default function Layout () {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <a className="navbar-brand" href="#">
                <img src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg" width="30" height="30"
                     className="d-inline-block align-top" alt="" />
                Bootstrap</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"/>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <NavLink exact to="/" activeClassName="active" >
                            <div className="nav-link">Main <span className="sr-only">(current)</span></div>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    )

}