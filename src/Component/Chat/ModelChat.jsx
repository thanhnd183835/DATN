import * as React from "react";
import IconButton from "@mui/material/IconButton";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import {
  addMessage,
  getListMessage,
  getRooms,
  updateCountMess,
} from "../../Redux/chat/chat.slice";
import "./Chat.css";
import { Button } from "@mui/material";
import { getProfileFriend } from "../../Redux/user/user.slice";
import { showModalMessage } from "../../Redux/message/message.slice";
import { format, register } from "timeago.js";
import moment from "moment/moment";
import { localeFunc } from "../../Ultils/constant";

const ModelChat = ({ open, close }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputText, setInputText] = React.useState("");
  const [openChat, setOpenChat] = React.useState(true);
  const [active, setActive] = React.useState(0);

  const socket = useSelector((state) => state.socket.socket.payload);
  const listMessage = useSelector(
    (state) => state.chat?.listMessage?.data?.data?.room
  );
  const infoUser = useSelector((state) => state.auth?.user?.data?.data);
  const infoFriend = useSelector((state) => state.user.profileFriend.data.data);
  const rooms = useSelector((state) => state.chat?.rooms?.data?.data);
  register("my-locale", localeFunc);

  const handleChangeInput = (e) => {
    setInputText(e.target.value);
  };
  const keyPress = async (e) => {
    if (inputText === "" || inputText.trim() === "") {
      return;
    }

    if (e.keyCode === 13) {
      const response = await dispatch(
        addMessage({
          receiver: infoFriend?._id,
          content: inputText.trim(),
        })
      );

      if (response?.payload?.status === 200) {
        const data = {
          idFriend: infoFriend?._id,
          idMe: infoUser._id,
        };
        socket?.emit("inbox_user", data);
      } else {
        console.log("ERRR");
        dispatch(
          showModalMessage({
            type: "ERROR",
            msg: "Đã có lỗi xảy ra, có thể tài khoản của bạn hoặc người gửi đã bị khóa!",
          })
        );
      }
      dispatch(getListMessage(infoFriend._id));

      setInputText("");
    }
  };
  React.useEffect(() => {
    socket?.on("get_message", async (data) => {
      if (infoUser._id === data.idFriend) {
        await dispatch(getListMessage(infoFriend._id));
      }
    });
  }, [socket]);
  React.useEffect(() => {
    dispatch(getProfileFriend(infoFriend?._id));
    dispatch(getRooms());
  }, [infoFriend?._id]);
  return (
    <>
      {open && (
        <div className="chat-container">
          <div className="row border-bottom">
            <div className="col-3 fs-4 text-warning fw-bold">Chat</div>
            <div className="col-9">
              <IconButton className="float-end" onClick={close}>
                <DisabledByDefaultIcon color="warning" />
              </IconButton>
            </div>
          </div>
          <div className="row gap-0">
            <div className="col-4 border-end">
              {rooms &&
                rooms?.length > 0 &&
                rooms.map((room, index) => (
                  <div
                    onClick={() => {
                      if (room?.users[0].user._id === infoUser._id) {
                        dispatch(getListMessage(room?.users[1].user._id));
                        dispatch(getProfileFriend(room?.users[1].user._id));
                        dispatch(
                          updateCountMess({
                            userId: room?.users[1].user._id,
                            action: "DELETE",
                          })
                        );
                      } else {
                        dispatch(getListMessage(room?.users[0].user._id));
                        dispatch(getProfileFriend(room?.users[0].user._id));
                        dispatch(
                          updateCountMess({
                            userId: room?.users[0].user._id,
                            action: "DELETE",
                          })
                        );
                      }
                      setActive(index);
                    }}
                    className={
                      index === active ? "room_active" : "room_element"
                    }
                  >
                    <Avatar
                      src={
                        room?.users[0].user?._id === infoUser?._id
                          ? room?.users[1].user?.avatar
                          : room?.users[0].user?.avatar
                      }
                      style={{ width: 40, height: 40 }}
                    />
                    <div>
                      <div>
                        <p>
                          {room?.users[0].user?._id === infoUser?._id
                            ? room?.users[1].user?.userName
                            : room?.users[0].user?.userName}
                        </p>
                        <div>
                          {room?.users[1].user?._id !== infoUser._id ? (
                            room?.users[1].user?.active ? (
                              <ul
                                className="active_user text-success"
                                style={{ fontSize: "10px" }}
                              >
                                <li>Đang hoạt động</li>
                              </ul>
                            ) : (
                              <div
                                style={{
                                  color: "silver",
                                  fontSize: "10px",
                                }}
                              >
                                Hoạt động{" "}
                                {format(
                                  room?.users[1]?.user?.updatedAt,
                                  "my-locale"
                                )}
                              </div>
                            )
                          ) : room?.users[0].user?.active ? (
                            <ul
                              className="active_user text-success"
                              style={{ fontSize: "10px" }}
                            >
                              <li>Đang hoạt động</li>
                            </ul>
                          ) : (
                            <div style={{ color: "silver", fontSize: "10px" }}>
                              Hoạt động{" "}
                              {format(
                                room?.users[0].user?.updatedAt,
                                "my-locale"
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="col-8 border-start ">
              <div>
                <ul className="message-list">
                  {listMessage &&
                    listMessage.length > 0 &&
                    listMessage.map((item) =>
                      infoUser._id === item.sender ? (
                        <li className="message-item outgoing">
                          <div className="message-content">
                            <span>{item.content}</span>
                            <br />
                            <span className="message-time px-0">
                              {moment(item.createdAt).format(
                                "DD-MM-YYYY,hh:mm:ss"
                              )}
                            </span>
                          </div>
                        </li>
                      ) : (
                        <li className="message-item incoming">
                          <div className="message-content ">
                            <span>{item.content}</span>
                            <br />
                            <span className="message-time">
                              {moment(item.createdAt).format(
                                "DD-MM-YYYY,hh:mm:ss"
                              )}
                            </span>
                          </div>
                        </li>
                      )
                    )}
                </ul>
                <div className="input-container">
                  <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={inputText}
                    onChange={handleChangeInput}
                    onKeyDown={keyPress}
                  />
                  <Button>Gửi</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ModelChat;
