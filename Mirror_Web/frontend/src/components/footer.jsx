import React from 'react';

const Footer = () => {
  return (
    <footer style={{ background: '#2c3e50', color: 'white', padding: '40px 20px', marginTop: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>MIRROR</h3>
          <p>Start your path to psychological wellness with our thoroughly selected specialists.</p>
          <div style={{ display: 'flex', marginTop: '10px' }}>
            <input
              type="email"
              placeholder="Email"
              style={{ padding: '10px', border: 'none', borderRadius: '5px 0 0 5px', flex: 1 }}
            />
            <button style={{ background: '#4a90e2', color: 'white', border: 'none', padding: '10px', borderRadius: '0 5px 5px 0', cursor: 'pointer' }}>
              →
            </button>
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>Pages</h4>
          <ul style={{ listStyle: 'none' }}>
            <li style={{ margin: '5px 0' }}><a href="#about" style={{ color: '#fff', textDecoration: 'none' }}>About Us</a></li>
            <li style={{ margin: '5px 0' }}><a href="#blog" style={{ color: '#fff', textDecoration: 'none' }}>Blog</a></li>
            <li style={{ margin: '5px 0' }}><a href="#contacts" style={{ color: '#fff', textDecoration: 'none' }}>Contacts</a></li>
            <li style={{ margin: '5px 0' }}><a href="#shop" style={{ color: '#fff', textDecoration: 'none' }}>Shop</a></li>
            <li style={{ margin: '5px 0' }}><a href="#credits" style={{ color: '#fff', textDecoration: 'none' }}>Image Credits</a></li>
          </ul>
        </div>
        <div>
          <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>Services</h4>
          <ul style={{ listStyle: 'none' }}>
            <li style={{ margin: '5px 0' }}>Anxiety</li>
            <li style={{ margin: '5px 0' }}>Relationships</li>
            <li style={{ margin: '5px 0' }}>Eating Disorders</li>
            <li style={{ margin: '5px 0' }}>Depression</li>
            <li style={{ margin: '5px 0' }}>ADHD</li>
            <li style={{ margin: '5px 0' }}>Childhood Abuse</li>
            <li style={{ margin: '5px 0' }}>OCD</li>
            <li style={{ margin: '5px 0' }}>Trauma</li>
          </ul>
        </div>
        <div>
          <h4 style={{ fontSize: '18px', marginBottom: '10px' }}>Therapists</h4>
          <ul style={{ listStyle: 'none' }}>
            <li style={{ margin: '5px 0' }}>Mark Hoffman</li>
            <li style={{ margin: '5px 0' }}>Anne Middleton</li>
            <li style={{ margin: '5px 0' }}>Whitney Pratt</li>
            <li style={{ margin: '5px 0' }}>Jane Goodman</li>
            <li style={{ margin: '5px 0' }}>Martha Ruz</li>
            <li style={{ margin: '5px 0' }}>Kate Adams</li>
          </ul>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px solid #444', paddingTop: '10px' }}>
        <p>This is a sample website - ©masters 2025 - All Rights Reserved</p>
        <div>
          <a href="#facebook" style={{ color: 'white', margin: '0 10px', fontSize: '20px' }}><i className="fab fa-facebook-f"></i></a>
          <a href="#twitter" style={{ color: 'white', margin: '0 10px', fontSize: '20px' }}><i className="fab fa-twitter"></i></a>
          <a href="#instagram" style={{ color: 'white', margin: '0 10px', fontSize: '20px' }}><i className="fab fa-instagram"></i></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;