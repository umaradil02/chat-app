import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Avatar,
  Typography,
  Paper,
  List,
  ListItem,
  TextField,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  addDoc,
  collection,
  query,
  getDocs,
  onSnapshot,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../pages/confic";
import { Authcontext } from "../context/Authcontext";

const Home = () => {
  const { loginuser, loadinguser } = useContext(Authcontext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [editMessageId, setEditMessageId] = useState(null);
  const userRef = useRef([]);

  useEffect(() => {
    (async () => {
      const userQuery = query(collection(db, "users"));
      const querySnapshot = await getDocs(userQuery);
      querySnapshot.forEach((doc) => {
        userRef.current = { ...userRef.current, [doc.id]: doc.data() };
      });
      const q = query(collection(db, "messages"), orderBy("sendAt", "asc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            setMessages((prev) => [
              ...prev,
              {
                id: change.doc.id,
                ...change.doc.data(),
                user: userRef.current[change.doc.data().sendBy],
              },
            ]);
          }
          if (change.type === "removed") {
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== change.doc.id)
            );
          }
        });
      });
      return () => unsubscribe();
    })();
  }, []);

  const sendMessage = async () => {
    if (editMessageId) {
      await updateDoc(doc(db, "messages", editMessageId), {
        text: message,
        sendAt: serverTimestamp(),
      });
      setEditMessageId(null);
    } else {
      await addDoc(collection(db, "messages"), {
        text: message,
        sendBy: loginuser.uid,
        sendAt: serverTimestamp(),
      });
    }
    setMessage("");
  };

  const deleteMessage = async (messageId) => {
    await deleteDoc(doc(db, "messages", messageId));
  };

  const editMessage = (msg) => {
    setMessage(msg.text);
    setEditMessageId(msg.id);
  };

  return (
    <Box
      sx={{
        maxWidth: "600px",
        margin: "auto",
        height: "70vh",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
      }}
    >
      <AppBar
        position="static"
        sx={{ borderRadius: "8px 8px 0 0", bgcolor: "green" }}
      >
        <Toolbar>
          <Avatar sx={{ bgcolor: "white", marginRight: 2 }}>
            <ChatIcon color="primary" />
          </Avatar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Group chat
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          padding: 2,
          overflowY: "auto",
          bgcolor: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <List sx={{ padding: 0 }}>
          {messages.map((data, index) => (
            <React.Fragment key={index}>
              {data.sendBy !== loginuser.uid ? (
                <ListItem sx={{ justifyContent: "flex-start" }}>
                  {data.sendBy !== loginuser.uid && (
                    <Avatar sx={{ marginRight: "5px" }}>
                      {data.user.firstName[0]}
                    </Avatar>
                  )}
                  <Box
                    sx={{
                      maxWidth: "75%",
                      bgcolor: "#e0e0e0",
                      color: "black",
                      borderRadius: "16px 16px 16px 0",
                      padding: "10px 15px",
                      boxShadow: 1,
                      wordWrap: "break-word",
                    }}
                  >
                    <Tooltip
                      title={`${data.user.firstName} ${data.user.lastname}`}
                    >
                      <Typography variant="body1">{data.text}</Typography>
                    </Tooltip>
                  </Box>
                </ListItem>
              ) : (
                <ListItem sx={{ justifyContent: "flex-end" }}>
                  <Box
                    sx={{
                      maxWidth: "75%",
                      bgcolor: "green",
                      color: "white",
                      borderRadius: "16px 16px 0 16px",
                      padding: "10px 15px",
                      boxShadow: 1,
                      wordWrap: "break-word",
                    }}
                  >
                    <Tooltip title="You">
                      <Typography variant="body1">{data.text}</Typography>
                    </Tooltip>
                  </Box>
                  {data.sendBy === loginuser.uid && (
                    <>
                      <Tooltip title="Edit message">
                        <IconButton
                          size="small"
                          onClick={() => editMessage(data)}
                        >
                          {loadinguser ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            <EditIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete message">
                        <IconButton
                          size="small"
                          onClick={() => deleteMessage(data.id)}
                        >
                          {loadinguser ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            <DeleteIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </ListItem>
              )}
            </React.Fragment>
          ))}
        </List>
      </Paper>
      <Box
        sx={{
          display: "flex",
          padding: 2,
          bgcolor: "white",
          borderTop: "1px solid #e0e0e0",
          borderRadius: "0 0 8px 8px",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <TextField
          variant="outlined"
          label={
            editMessageId ? "Edit your message..." : "Type your message..."
          }
          fullWidth
          sx={{
            marginRight: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
            },
          }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <IconButton
          onClick={sendMessage}
          disabled={!message || loadinguser}
          color="primary"
          sx={{
            bgcolor: "green",
            color: "white",
            borderRadius: "50%",
            "&:hover": { bgcolor: "green" },
          }}
        >
          {loadinguser ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <SendIcon />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default Home;
