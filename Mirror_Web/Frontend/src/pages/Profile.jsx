import React from 'react';

const Profile = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f4f8',
      padding: '40px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        padding: '30px'
      }}>
        {/* Profile Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '25px',
          borderBottom: '2px solid #eee',
          paddingBottom: '20px',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#e0e0e0',
            overflow: 'hidden',
            border: '4px solid #4a90e2'
          }}>
            {/* Placeholder for profile image */}
            <img 
              src="https://via.placeholder.com/120" 
              alt="Profile" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <h1 style={{
              margin: '0',
              color: '#333',
              fontSize: '32px',
              fontWeight: 'bold'
            }}></h1>
            <p style={{
              margin: '5px 0 0',
              color: '#666',
              fontSize: '18px'
            }}>Senior Software Developer</p>
            <p style={{
              color: '#4a90e2',
              fontSize: '16px',
              margin: '5px 0 0'
            }}>john.doe@example.com</p>
          </div>
        </div>

        {/* Profile Content */}
        <div style={{
          display: 'grid',
          gap: '20px'
        }}>
          {/* About Section */}
          <div>
            <h2 style={{
              color: '#333',
              fontSize: '24px',
              margin: '0 0 10px'
            }}>About Me</h2>
            <p style={{
              color: '#666',
              lineHeight: '1.6',
              fontSize: '16px'
            }}>
              Passionate software developer with 8+ years of experience in building 
              scalable web applications. Skilled in React, Node.js, and cloud technologies.
            </p>
          </div>

          {/* Skills Section */}
          <div>
           
          </div>

          {/* Contact Button */}
          <div style={{ textAlign: 'center' }}>
            <button style={{
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '25px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              ':hover': {
                backgroundColor: '#357abd'
              }
            }}>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;