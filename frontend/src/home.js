import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <div className="navBar">
            <div className="navLeft">
                <Link to="/" className="navItem">File De-Duplication Service</Link>
            </div>
            <div className="navRight">
                <Link to="/register" className="navItem">Register</Link>
                <Link to="/login" className="navItem">Login</Link>
            </div>
        </div>
    );
};

const Home = () => {
    return (
        <div className="mainContainer">
            <NavBar />
            <div className="titleContainer">
                <div>Welcome!</div>
            </div>
            <br/>
            <div>
                Please use the Register and Login on the top right to create and sign-in to your account.
            </div>
            <div className="textContainer">
                <p>
                    File de-duplication service is a specialized process used in managing data storage to eliminate redundant data. In essence, it involves scanning data for duplicate files or segments and ensuring that only one unique instance of the data is actually stored. When duplicates are found, the service replaces them with pointers to the single stored copy. This technique not only saves significant storage space but also enhances data retrieval efficiency and reduces the data footprint, making it an essential tool in data centers and cloud storage systems. By minimizing the amount of storage required, file de-duplication services can significantly reduce costs and improve data management efficiency in various IT environments.
                </p>
            </div>
        </div>
    );
}

export default Home;
