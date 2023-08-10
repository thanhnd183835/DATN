import * as React from "react";
import { useEffect, useState, useRef } from "react";
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
import { BASE_URL, localeFunc } from "../../Ultils/constant";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

const ModelChat = ({ open, close, idFriend }) => {
  const dispatch = useDispatch();
  const [idReceiver, setIdReceiver] = useState("");
  const [inputText, setInputText] = useState("");
  const [active, setActive] = useState(0);
  const [urlImg, setUrlImg] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const socket = useSelector((state) => state.socket.socket.payload);
  const listMessage = useSelector(
    (state) => state.chat?.listMessage?.data?.data?.room
  );
  const infoUser = useSelector((state) => state.auth?.user?.data?.data);

  const infoFriend = useSelector(
    (state) => state.user.profileFriend?.data.data
  );
  const [rooms, setRooms] = useState([]);
  register("my-locale", localeFunc);
  const messagesEnd = useRef(null);

  const scrollToBottom = () => {
    const scroll =
      messagesEnd?.current?.scrollHeight - messagesEnd?.current?.clientHeight;
    messagesEnd.current?.scrollTo(0, scroll);
  };

  const handleImageChange = async (e) => {
    const selected = e.target.files[0];
    setUrlImg(selected);

    const reader = new FileReader();
    reader.onloadend = () => {
      const imagePreview = reader.result;

      setPreviewImage(imagePreview);
    };
    if (selected && selected.type.match("image.*")) {
      reader.readAsDataURL(selected);
    }
  };
  const handleChangeInput = (e) => {
    setInputText(e.target.value);
  };

  const keyPress = async (e) => {
    if (inputText === "" || inputText.trim() === "") {
      return;
    }

    if (e.keyCode === 13) {
      const body = {
        receiver: idReceiver || idFriend,
        content: inputText.trim(),
      };
      const formData = new FormData();
      Object.keys(body).forEach((key) => formData.append(key, body[key]));
      formData.append("image", urlImg);
      if (body.receiver) {
        axios({
          method: "post",
          url: `${BASE_URL}/api/chat/inbox`,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          data: formData,
        }).then((response) => {
          if (response?.status === 200) {
            const data = {
              idFriend: idReceiver || idFriend,
              idMe: infoUser?._id,
            };
            socket?.emit("inbox_user", data);
          } else {
            dispatch(
              showModalMessage({
                type: "ERROR",
                msg: "Đã có lỗi xảy ra, có thể tài khoản của bạn hoặc người gửi đã bị khóa!",
              })
            );
          }
          axios({
            method: "get",
            url: `${BASE_URL}/api/chat/get-rooms`,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }).then((response) => {
            if (response.status === 200) {
              setRooms(response?.data?.data);
            }
          });
          dispatch(getListMessage(idReceiver || idFriend));
          scrollToBottom();
          setInputText("");
          setPreviewImage("");
          setUrlImg("");
        });
      } else {
        dispatch(
          showModalMessage({
            type: "ERROR",
            msg: "Bạn chưa chọn người liên hệ!",
          })
        );
      }
    }
  };

  const sendMessage = async () => {
    const body = {
      receiver: idReceiver || idFriend,
      content: inputText.trim(),
    };

    const formData = new FormData();
    Object.keys(body).forEach((key) => formData.append(key, body[key]));
    formData.append("image", urlImg);
    if (body.receiver) {
      axios({
        method: "post",
        url: `${BASE_URL}/api/chat/inbox`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: formData,
      }).then((response) => {
        if (response?.status === 200) {
          const data = {
            idFriend: idReceiver || idFriend,
            idMe: infoUser?._id,
          };

          socket?.emit("inbox_user", data);
        } else {
          dispatch(
            showModalMessage({
              type: "ERROR",
              msg: "Đã có lỗi xảy ra, có thể tài khoản của bạn hoặc người gửi đã bị khóa!",
            })
          );
        }

        axios({
          method: "get",
          url: `${BASE_URL}/api/chat/get-rooms`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }).then((response) => {
          if (response.status === 200) {
            setRooms(response?.data?.data);
          }
        });
        dispatch(getListMessage(idReceiver || idFriend));
        scrollToBottom();
        setInputText("");
        setPreviewImage("");
        setUrlImg("");
      });
    } else {
      dispatch(
        showModalMessage({
          type: "ERROR",
          msg: "Bạn chưa chọn người liên hệ!",
        })
      );
    }
  };

  useEffect(() => {
    socket?.on("get_message", async (data) => {
      if (infoUser._id === data.idFriend) {
        await dispatch(getListMessage(idReceiver || data.idMe));
        await dispatch(updateCountMess({ userId: data.idMe, action: "PUSH" }));
        scrollToBottom();
      }
    });
  }, [socket]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      scrollToBottom();
      axios({
        method: "get",
        url: `${BASE_URL}/api/chat/get-rooms`,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }).then((response) => {
        if (response.status === 200) {
          setRooms(response?.data?.data);
        }
      });
    }
  }, []);
  const componentStyle = {
    height: previewImage ? "37vh" : "43vh",
  };
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
          <div className="row gap-0 bodyChat">
            {/* room */}
            <div className="col-4 border-end mt-2 roomChat">
              {rooms &&
                rooms?.length > 0 &&
                rooms.map((room, index) => (
                  <>
                    <div
                      onClick={() => {
                        if (room?.users[0].user._id === infoUser._id) {
                          dispatch(getListMessage(room?.users[1].user._id));
                          scrollToBottom();
                          setIdReceiver(room?.users[1].user._id);
                          dispatch(
                            updateCountMess({
                              userId: room?.users[1].user._id,
                              action: "DELETE",
                            })
                          );
                        } else {
                          dispatch(getListMessage(room?.users[0].user._id));
                          scrollToBottom();
                          setIdReceiver(room?.users[0].user._id);
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
                              <div
                                style={{
                                  color: "silver",
                                  fontSize: "10px",
                                }}
                              >
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
                  </>
                ))}
            </div>
            {/* message */}
            <div className="col-8 border-start mt-2 messageAndInput">
              <div>
                <ul
                  className="message-list "
                  style={componentStyle}
                  ref={messagesEnd}
                >
                  {listMessage &&
                    listMessage.length > 0 &&
                    listMessage.map((item) =>
                      infoUser._id === item.sender ? (
                        <>
                          {item.content && (
                            <li className="message-item outgoing">
                              <div className="message-content">
                                <span>{item.content}</span>
                                <br />
                                <span className="message-time px-0">
                                  {moment(item.createdAt).format(
                                    "DD-MM-YYYY,HH:mm:ss"
                                  )}
                                </span>
                              </div>
                            </li>
                          )}
                          {item.image && (
                            <li className="message-item outgoing">
                              <span>
                                <img
                                  src={item.image}
                                  style={{ width: 150, height: 150 }}
                                />
                              </span>
                            </li>
                          )}
                        </>
                      ) : (
                        <>
                          {item.content && (
                            <li className="message-item incoming">
                              <div className="message-content">
                                <span>{item.content}</span>
                                <br />
                                <span className="message-time px-0">
                                  {moment(item.createdAt).format(
                                    "DD-MM-YYYY,HH:mm:ss"
                                  )}
                                </span>
                              </div>
                            </li>
                          )}
                          {item.image && (
                            <li className="message-item incoming">
                              <span>
                                <img
                                  src={item.image}
                                  style={{ width: 150, height: 150 }}
                                />
                              </span>
                            </li>
                          )}
                        </>
                      )
                    )}
                </ul>
                <div className="row border-top" style={{ height: "5vh" }}>
                  {previewImage && (
                    <div
                      style={{
                        width: "45px",
                        height: "45px",
                        backgroundImage: `url(${previewImage})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        marginLeft: "55px",
                        border: "1px solid ",
                        marginTop: "5px",
                        borderColor: "#d8d3d3",
                        borderRadius: "12px",
                      }}
                    />
                  )}
                  <div className="input-container mt-1">
                    <div className="mt-auto mb-auto me-2">
                      <input
                        className="d-none"
                        accept="image/*"
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={handleImageChange}
                      />
                      <label
                        htmlFor="contained-button-file"
                        className="btn pt-0 px-1 py-1"
                      >
                        <div>
                          <AddAPhotoOutlinedIcon
                            fontSize="small"
                            color="primary"
                          />
                        </div>
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="Nhập tin nhắn..."
                      value={inputText}
                      onChange={handleChangeInput}
                      onKeyDown={keyPress}
                    />
                    <Button
                      endIcon={<SendIcon />}
                      onClick={sendMessage}
                      size="small"
                    >
                      Gửi
                    </Button>
                  </div>
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
