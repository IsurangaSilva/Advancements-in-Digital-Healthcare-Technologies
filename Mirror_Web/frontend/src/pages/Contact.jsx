import React from 'react';
import Contacts from "../assets/contact.jpg";

const Contact = () => {
  return (
    <div style={{  background:
      "linear-gradient(to right, rgba(243, 232, 222, 0.5), rgba(231, 245, 247, 0.5))", minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main>
        <section style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '50px 20px' }}>
          <div style={{ background: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', textAlign: 'center', maxWidth: '600px', width: '100%' }}>
            <h1 style={{ fontSize: '32px', color: '#2c3e50', marginBottom: '20px' }}>Contact us</h1>
            <img
              src={Contacts}
              alt="Therapy Illustration"
              style={{ width: '100%', maxWidth: '300px', marginBottom: '20px' }}
            />
            <form>
              <input
                type="text"
                placeholder="Name"
                required
                style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }}
              />
              <input
                type="email"
                placeholder="E-mail"
                required
                style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }}
              />
              <textarea
                placeholder="Your message"
                required
                style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px', height: '100px', resize: 'none' }}
              ></textarea>
              <button
                type="submit"
                style={{ background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)", color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>

      
    </div>
  );
};

export default Contact;