// import React from 'react';
// import Contacts from "../assets/contact.jpg";

// const Contact = () => {
//   return (
//     <div style={{  background:
//       "linear-gradient(to right, rgba(243, 232, 222, 0.5), rgba(231, 245, 247, 0.5))", minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
//       <main>
//         <section style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '50px 20px' }}>
//           <div style={{ background: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', textAlign: 'center', maxWidth: '600px', width: '100%' }}>
//             <h1 style={{ fontSize: '32px', color: '#2c3e50', marginBottom: '20px' }}>Contact us</h1>
//             <img
//               src={Contacts}
//               alt="Therapy Illustration"
//               style={{ width: '100%', maxWidth: '300px', marginBottom: '20px' }}
//             />
//             <form>
//               <input
//                 type="text"
//                 placeholder="Name"
//                 required
//                 style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }}
//               />
//               <input
//                 type="email"
//                 placeholder="E-mail"
//                 required
//                 style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }}
//               />
//               <textarea
//                 placeholder="Your message"
//                 required
//                 style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px', height: '100px', resize: 'none' }}
//               ></textarea>
//               <button
//                 type="submit"
//                 style={{ background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)", color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}
//               >
//                 Send Message
//               </button>
//             </form>
//           </div>
//         </section>
//       </main>

      
//     </div>
//   );
// };

// export default Contact;


import React from 'react';
import { Box, Typography, TextField, Button, Container, Paper } from '@mui/material';
import Contacts from '../assets/contact.jpg';

const Contact = () => {
  return (
    <Box sx={{
      background: "linear-gradient(to right, rgba(243, 232, 222, 0.5), rgba(231, 245, 247, 0.5))",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      py: 5
    }}>
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
          <Typography 
           sx={{
            fontSize:"25px",
            fontWeight:400,
           }}
           gutterBottom>
            Contact Us
          </Typography>
          <img
            src={Contacts}
            alt="Therapy Illustration"
            style={{ width: "100%", maxWidth: "250px", marginBottom: "20px" }}
          />
          <form>
            <Box
              sx={{padding:"0px 50px"}}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              margin="normal"
              required
              sx={{
                marginBottom: 1,
               "& .MuiOutlinedInput-root": {
                 borderRadius: "30px",
               },
               "& .MuiOutlinedInput-input": {
                 backgroundColor: "#fff",
                 borderRadius: "30px",
                 paddingLeft: "10px",
                 fontSize: "14px",
                 marginLeft: "12px",
                 fontWeight: 500,
               },
               "& .MuiInputLabel-root": {
                 paddingLeft: "10px",
               },
               "& .MuiOutlinedInput-input::placeholder": {
                 paddingLeft: "10px",
               },
             }}
            />
            <TextField
              fullWidth
              label="E-mail"
              type="email"
              variant="outlined"
              margin="normal"
              required
              sx={{
                 marginBottom: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "30px",
                },
                "& .MuiOutlinedInput-input": {
                  backgroundColor: "#fff",
                  borderRadius: "30px",
                  paddingLeft: "10px",
                  fontSize: "14px",
                  marginLeft: "12px",
                  fontWeight: 500,
                },
                "& .MuiInputLabel-root": {
                  paddingLeft: "10px",
                },
                "& .MuiOutlinedInput-input::placeholder": {
                  paddingLeft: "10px",
                },
              }}
            />
            <TextField
              fullWidth
              label="Your message"
              multiline
              rows={4}
              variant="outlined"
              margin="normal"
              required
              sx={{
                marginBottom: 1,
               "& .MuiOutlinedInput-root": {
                 borderRadius: "30px",
               },
               "& .MuiOutlinedInput-input": {
                 backgroundColor: "#fff",
                 borderRadius: "30px",
                 paddingLeft: "10px",
                 fontSize: "14px",
                 marginLeft: "12px",
                 fontWeight: 500,
               },
               "& .MuiInputLabel-root": {
                 paddingLeft: "10px",
               },
               "& .MuiOutlinedInput-input::placeholder": {
                 paddingLeft: "10px",
               },
             }}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2, background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)", '&:hover': { backgroundColor: "#e76f51" },marginBottom: 1, }}
              type="submit"
            >
              Send Message
            </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Contact;
