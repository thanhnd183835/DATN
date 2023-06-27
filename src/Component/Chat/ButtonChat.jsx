import * as React from "react";
import Fab from "@mui/material/Fab";
import "./Chat.css";
import MessageIcon from "@mui/icons-material/Message";
import ModelChat from "./ModelChat";

const ButtonChat = () => {
  const [openChat, setOpenChat] = React.useState(false);
  const [openIcon, setOpenIcon] = React.useState(true);

  const handleShowBoxChat = () => {
    setOpenChat(true);
    setOpenIcon(false);
  };
  const handCloseModelChat = () => {
    setOpenChat(false);
    setOpenIcon(true);
  };
  return (
    <>
      <div>
        <ModelChat open={openChat} close={handCloseModelChat} />
      </div>
      {openIcon && (
        <div>
          <Fab
            color="warning"
            aria-label="add"
            style={{ position: "fixed", right: 30, width: 100 }}
            onClick={handleShowBoxChat}
            variant="extended"
          >
            <MessageIcon className="me-2" />
            Chat
          </Fab>
        </div>
      )}
    </>
  );
};
export default ButtonChat;
