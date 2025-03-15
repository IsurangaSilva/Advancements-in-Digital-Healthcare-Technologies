import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Container, Paper ,Checkbox,FormControlLabel} from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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

        window.location.href = "/";
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      setError("Invalid credentials");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper
        sx={{
          padding: "70px 35px 80px 35px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          background:
            "linear-gradient(to right, rgba(243, 232, 222, 0.5), rgba(231, 245, 247, 0.5))",
          width: 400,
          margin: "auto",
          marginTop: "40px",
          height: "540px",
          border: "2px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "black",
            marginBottom: 2,
            fontWeight: 400,
            textAlign: "center",
            fontSize: "30px",
          }}
        >
          LOGIN
        </Typography>
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
          />

          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="Remember Me"
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "13px",
              },
              paddingLeft: "5px",
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
            }}
          >
            <Typography sx={{ marginRight: 1, fontSize: "13px" }}>
              Don't Have An Account?
            </Typography>
            <Typography
              sx={{ color: "blue", cursor: "pointer", fontSize: "13px" }}
            >
              Register Now!
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;