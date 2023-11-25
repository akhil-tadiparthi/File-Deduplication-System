import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const ViewFiles = () => {
    const { user, logout } = useContext(AuthContext);
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();    

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchFiles = async () => {
            const url = new URL('http://192.168.1.10:30010/viewFiles');
            url.search = new URLSearchParams({username: user}).toString();

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (response.ok) {
                    const filesData = await response.json();
                    setFiles(filesData);
                } else {
                    alert('Failed to fetch files:', await response.text());
                }
            } catch (error) {
                alert('Error:', error);
            }
        };

        fetchFiles();
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="mainContainer">
            <nav className="navBar">
                <div className="navLeft">
                    <Link to="/dashboard" className="navItem">Home</Link>
                    <Link to="/viewFiles" className="navItem">View Files</Link>
                </div>
                <button onClick={handleLogout}>Logout</button>
            </nav>
            <div className="titleContainer">
                <div>Welcome, {user ? user : ''}!</div>
            </div>
            <div>
                View your uploaded files below:
            </div>
            <br />
            <br />
            <br />
            <br />
            <table className="filesTable">
                    <thead>
                        <tr>
                            <th>File Name</th>
                            {/* <th>Checksum</th> */}
                            <th>Upload Time</th>
                            <th>Download</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.length > 0 ? (
                            files.map((file, index) => (
                                <tr key={index}>
                                    <td>{file.fileName}</td>
                                    {/* <td>{file.checkSum}</td> */}
                                    <td>{file.uploadTime}</td>
                                    <td>
                                        <a href={file.url} target="_blank" rel="noopener noreferrer">Download</a>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No files available to display.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
        </div>
    );
};

export default ViewFiles;
