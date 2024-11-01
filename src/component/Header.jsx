import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../pages/confic";

const Header = () => {
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <AppBar
      position="fixed"
      sx={{
        background: "#666666",
        boxShadow: "10px 0px 0px 10px rgba(0,0,0,0.2)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" component="div">
          My Website
        </Typography>

        <Box sx={{ display: "flex" }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
          <Button color="inherit" component={Link} to="/contact">
            Contact
          </Button>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
