import * as React from "react";
import Fab from "@mui/material/Fab";
import MessageIcon from "@mui/icons-material/Message";
const Chat = () => {
  return (
    <Fab
      color="warning"
      aria-label="add"
      style={{ position: "fixed", right: 30 }}
    >
      <MessageIcon />
    </Fab>
  );
};
export default Chat;
