import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const Dashboard = () => {
    const {logout} = useContext(AuthContext);
    const {user} = useContext(AuthContext); // Get user from AuthContext
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    useEffect(() => {
        if (!user) { // Check if user is not logged in
            navigate("/login");
        }
    }, [user, navigate]); // Depend on user and navigate

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) {
            alert("No file selected for upload.");
            return;
        }
        
            setUploadStatus('uploading');
            const formData = new FormData();
            formData.append('file', file);
            formData.append('username', user);
            formData.append('fileName', file.name);

            try {
                const response = await fetch('http://localhost:5000/fileUpload', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    setUploadStatus('success');
                    console.log('Upload successful!');
                } else {
                    const errorText = await response.text();
                    alert('Upload failed: File already exists in the database!');
                    setUploadStatus('failed');
                }
            } catch (error) {
                alert('Upload error:', error);
                setUploadStatus('failed');
            }
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
                <div>Welcome, {user ? user:''}!</div>
            </div>
            <div>
                Upload new files below or View your uploaded files in the top left:
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <div>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleFileUpload}>Upload File</button>
            </div>
            {uploadStatus === 'uploading' && <p>Uploading...</p>}
            {uploadStatus === 'success' && <p>Upload successful!</p>}
            {uploadStatus === 'failed' && <p>Upload failed. Please try again.</p>}
        </div>
    );
};

export default Dashboard;
