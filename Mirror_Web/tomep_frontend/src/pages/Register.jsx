import React, { useState } from "react";
import axios from "axios";
import { useNavigate ,Link} from "react-router-dom";
import { TextField, Button, Box, Typography, Grid, Container, FormControl,InputLabel,Select ,MenuItem , CardContent, InputAdornment} from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import CallIcon from '@mui/icons-material/Call';
import AttributionIcon from '@mui/icons-material/Attribution';
import { Alert, Snackbar } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import Logo from "../assets/logo.png";


const Register = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/api/user/insertuser", {
        username,
        email,
        password,
        role,
        phone
      });    
      console.log("Registration successful", response.data);

      if (response.status === 200) {        
        setSuccess(true); 
        setTimeout(() => {
          window.location.href = "/login";
        }, 1200);
      } else {
        setError(data.message || "Failed Registartion!");
      }
    } catch (error) {
      setError("Failed Registartion!");
    }
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(to right, rgba(243, 232, 222, 0.5), rgba(231, 245, 247, 0.5))",
        height: "90vh",
      }}
    >
      <Snackbar
        open={success}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
      >
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          Registration successful!
        </Alert>
      </Snackbar>
      <Container
        sx={{
          paddingTop: "40px",
        }}
      >
        <CardContent
          sx={{
            padding: "70px 35px 80px 35px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            background: "#fff",
            width: 700,
            margin: "auto",
            height: "555px",
            border: "2px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={Logo}
              alt="Mirror Logo"
              style={{ width: "55px", height: "55px", marginRight: "15px" }}
            />
            <Typography
              variant="h5"
              sx={{
                color: "black",
                marginBottom: 2,
                fontWeight: 500,
                textAlign: "center",
                fontSize: "20px",
                marginTop: 2,
              }}
            >
              CREATE ACCOUNT
            </Typography>
          </Box>

          {error && (
            <Typography
              sx={{
                color: "red",
                marginBottom: 2,
                fontSize: "0.875rem",
              }}
            >
              {error}
            </Typography>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: "100%", marginTop: "50px" }}
          >
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  sx={{
                    marginBottom: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "30px",
                    },
                    "& .MuiOutlinedInput-input": {
                      backgroundColor: "#fff",
                      borderRadius: "30px",
                      paddingLeft: "10px",
                      fontSize: "14px",
                      marginLeft: "12px",
                    },
                    "& .MuiInputLabel-root": {
                      paddingLeft: "10px",
                    },
                    "& .MuiOutlinedInput-input::placeholder": {
                      paddingLeft: "10px",
                    },
                  }}
                  fullWidth
                  required
                  label="User Name"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <PersonIcon
                          sx={{ fontSize: "21px", marginLeft: "10px" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  sx={{
                    marginBottom: 2,
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
                  fullWidth
                  required
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <LockIcon
                          sx={{ fontSize: "20px", marginLeft: "10px" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  sx={{
                    marginBottom: 2,
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
                  fullWidth
                  required
                  label="Mobile Phone"
                  variant="outlined"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <CallIcon
                          sx={{ fontSize: "20px", marginLeft: "10px" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  sx={{
                    marginBottom: 2,
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
                  fullWidth
                  required
                  label="Email Address"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <EmailIcon
                          sx={{ fontSize: "20px", marginLeft: "10px" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    label="Role"
                    sx={{
                      borderRadius: "30px",
                      backgroundColor: "#fff",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "30px",
                      },
                      "& .MuiOutlinedInput-input": {
                        backgroundColor: "#fff",
                        borderRadius: "30px",
                        paddingLeft: "10px",
                        fontSize: "14px",
                        marginLeft: "0px",
                        fontWeight: 500,
                      },
                    }}
                    startAdornment={
                      <InputAdornment position="start">
                        <AttributionIcon
                          sx={{ fontSize: "20px", marginLeft: "20px" }}
                        />
                      </InputAdornment>
                    }
                  >
                    <MenuItem sx={{ fontSize: "13px" }} value="patient">
                      Pateint
                    </MenuItem>
                    <MenuItem sx={{ fontSize: "13px" }} value="caregiver">
                      Care Giver
                    </MenuItem>
                  </Select>
                </FormControl>
                ;
              </Grid>
            </Grid>

            <Button
              sx={{
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#45a049",
                },
                marginTop: 4,
                width: "100%",
              }}
              type="submit"
              variant="contained"
            >
              Register
            </Button>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: 2,
                fontSize: "12px",
                marginLeft: 2,
              }}
            >
              <Typography sx={{ marginRight: 1, fontSize: "13px" }}>
                Already Have An Account?
              </Typography>
               <Link to="/login" style={{ textDecoration: "none" }}>
              <Typography
                sx={{ color: "blue", cursor: "pointer", fontSize: "13px" }}
              >
                Login To System!
              </Typography>
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Container>
    </div>
  );
};

export default Register;

