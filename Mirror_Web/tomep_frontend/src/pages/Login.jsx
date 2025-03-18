import React, { useState } from "react";
import axios from "axios";
import { Link , useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Card,Container, Paper ,Checkbox,FormControlLabel, CardContent, InputAdornment} from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { Alert, Snackbar } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import Logo from "../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/api/user/login", {
        email,
        password
      });    
      console.log("Login successful", response.data);

      if (response.status === 200) {
        window.localStorage.setItem("token", response.data.token);
        window.localStorage.setItem("userId", response.data.userId);
        window.localStorage.setItem("role", response.data.role);
        window.localStorage.setItem("LoggedIn", true);
        setSuccess(true); 

        setTimeout(() => {
          window.location.href = "/";
        }, 1200);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      setError("Invalid credentials");
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
          Login successful!
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
            width: 400,
            margin: "auto",
            height: "540px",
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
                fontWeight: 400,
                textAlign: "center",
                fontSize: "27px",
                marginTop: "15px",
              }}
            >
              LOGIN
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
            onSubmit={handleLogin}
            sx={{ width: "100%", marginTop: "50px" }}
          >
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
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="end">
                    <EmailIcon sx={{ fontSize: "19px", marginLeft: "10px" }} />
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
                    <LockIcon sx={{ fontSize: "20px", marginLeft: "10px" }} />
                  </InputAdornment>
                ),
              }}
            />

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
              LogIn
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
                Don't Have An Account?
              </Typography>
              <Link to="/register" style={{ textDecoration: "none" }}>
                <Typography
                  sx={{ color: "blue", cursor: "pointer", fontSize: "13px" }}
                >
                  Register Now!
                </Typography>
              </Link>
            </Box>
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Remember Me"
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "13px",
                },
                paddingLeft: "1px",
                marginTop: "20px",
                fontWieght: 600,
                fontSize: "14px",
              }}
            />
          </Box>
        </CardContent>
      </Container>
    </div>
  );
};

export default Login;

