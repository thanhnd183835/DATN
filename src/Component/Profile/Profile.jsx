import * as React from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar/Navbar";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Popup from "../Popup/Popup";
import Avatar from "react-avatar-edit";
import axios from "axios";
import { BASE_URL } from "../../Ultils/constant";
import { getMe } from "../../Redux/auth/auth.slice";
import { showModalMessage } from "../../Redux/message/message.slice";
import { getFollowers, getFollowing } from "../../Redux/user/user.slice";
import { getPostMe } from "../../Redux/post/post.slice";
const useStyles = makeStyles(() => ({
  profileContainer: {
    width: "100%",
    maxWidth: "950px",
    margin: "auto",
  },
  popup_follower: {
    display: "flex",
    justifyContent: "space-between",
    margin: "20px 20px 0 20px",
    "& .pop_btn": {
      marginLeft: "100px",
      height: "30px",
      fontWeight: 600,
      marginTop: "6px",
    },
    "& .pop_name": {
      marginLeft: "10px",
      "& .pop_fullName": {
        fontWeight: 600,
      },
    },
  },
}));
const Profile = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isChangeAvatar, setIsChangeAvatar] = useState(false);
  const [isShowFollowers, setIsShowFollowers] = useState(false);
  const [isShowFollowing, setIsShowFollowing] = useState(false);
  const [src, setSrc] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editorRef, setEditorRef] = useState(null);
  const infoUser = useSelector((state) => state?.auth?.user?.data?.data);
  const listFollower = useSelector(
    (state) => state?.user?.followers?.data?.data
  );
  const listFollowing = useSelector(
    (state) => state?.user?.following?.data?.data
  );
  const listPostForMe = useSelector((state) => state.post?.postOfMe?.data);

  const onClose = () => {
    setPreview(null);
  };
  const onCrop = (preview) => {
    setPreview(preview);
  };

  const ShowPicture = (props) => {
    return (
      <>
        <div
          className="profile_picture_container"
          onClick={() => {
            navigate({
              pathname: `/post/${props.id}`,
              state: {
                postId: props.id,
                liked: props.liked,
                numberLikes: props.likes,
                followed: listFollowing?.find((i) => i._id === props?.userId)
                  ? true
                  : false,
              },
            });
          }}
        >
          <img
            className="profile_picture"
            style={{ width: "300px", height: "300px" }}
            src={props.picture}
            alt="san pham"
          />

          <div className="profile_icon_in_picture">
            <span
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: "6px",
              }}
            >
              {/* <FavoriteIcon style={{ color: "white" }} /> */}
              <span style={{ color: "white", fontWeight: "bold" }}>
                {props.likes}
              </span>
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: "6px",
              }}
            >
              {/* <ChatBubbleIcon style={{ color: "white" }} /> */}
              <span style={{ color: "white", fontWeight: "bold" }}>
                {props.comments}
              </span>
            </span>
          </div>
        </div>
      </>
    );
  };
  React.useEffect(() => {
    dispatch(getFollowers());
    dispatch(getFollowing());
    dispatch(getPostMe());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleChangeAvatar = () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    const infoImage = editorRef.state?.file;
    formData.append("image", infoImage);
    if (!token) {
      navigate("/login");
    } else {
      axios({
        method: "post",
        url: `${BASE_URL}/api/users/change-avatar`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: formData,
      })
        .then((response) => {
          if (response.status === 200) {
            setIsChangeAvatar(false);
            dispatch(getMe());
            dispatch(
              showModalMessage({
                type: "SUCCESS",
                msg: "Thay đổi anh đại diện thành công!",
              })
            );
          }
        })
        .catch((err) => {
          if (err.response.status === 500) {
            dispatch(
              showModalMessage({
                type: "ERROR",
                msg: "Thay đổi ảnh đại diện Thất bại!",
              })
            );
          }
        });
    }
  };
  return (
    <div>
      <div>
        <NavBar />
      </div>
      <div className={classes.profileContainer} style={{ paddingTop: "6rem" }}>
        <div className="profile-header">
          <div className="profile-avatar-box">
            <img
              style={{ width: "100px", height: "100px", borderRadius: "50%" }}
              className="profile-avatar"
              src={`${infoUser.avatar}`}
              alt="anh dai dien"
            />
            <div
              className="icon_picture"
              onClick={() => {
                setIsChangeAvatar(true);
                setPreview(null);
              }}
            >
              <CameraAltIcon color="success" />
            </div>
          </div>
          <div className="profile-info">
            <div className="profile-title">
              <div className="profile-user-name">{infoUser?.userName}</div>
              <button
                className="profile__button__edit mt-2"
                onClick={() => {
                  navigate({
                    pathname: `/edit-profile`,
                  });
                }}
              >
                Chỉnh sửa trang cá nhân
              </button>
            </div>
            <div className="profile-info-detail">
              <div style={{ cursor: "pointer" }} className="profile-post">
                <b>{listPostForMe?.length}</b> bài viết
              </div>
              <div
                onClick={() => {
                  setIsShowFollowers(true);
                }}
                style={{ cursor: "pointer" }}
                className="profile-followers"
              >
                <b>{listFollower?.length}</b> người theo dõi
              </div>
              <div
                onClick={() => {
                  setIsShowFollowing(true);
                }}
                style={{ cursor: "pointer" }}
                className="profile-following"
              >
                Đang theo dõi <b>{listFollowing?.length}</b> người dùng
              </div>
            </div>
          </div>
        </div>
        {listPostForMe && listPostForMe?.length > 0 ? (
          <div className="profile-body">
            {/* <ShowPicture
              likes={listPostForMe.map((item) => item.likes.length)}
              comments={listPostForMe.map((item) => item.comments.length)}
              picture={listPostForMe.map((item) => item.UrlImg)}
              id={listPostForMe.map((item) => item._id)}
              liked={
                listPostForMe.map((item) =>
                  item.likes.find((i) => i.userId === infoUser._id)
                )
                  ? true
                  : false
              }
              userId={listPostForMe.map((item) => item?.postBy)}
            /> */}
            {listPostForMe.map((item) => (
              <ShowPicture
                likes={item.likes.length}
                comments={item.comments.length}
                picture={item.UrlImg}
                id={item?._id}
                liked={
                  item.likes.find((i) => i.userId === infoUser._id)
                    ? true
                    : false
                }
                userId={item?.postBy}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "50vh",
              fontSize: "28px",
            }}
          >
            <p>Chưa có bài viết</p>
          </div>
        )}
      </div>

      <Popup
        isOpen={isChangeAvatar}
        handleClose={() => {
          setIsChangeAvatar(false);
        }}
        title={"Cập nhật ảnh đại diện"}
        isIconClose={true}
        minWidth="500px"
      >
        <div className="mt-4">
          <Avatar
            width={500}
            height={250}
            onCrop={onCrop}
            onClose={onClose}
            src={src}
            ref={(ref) => setEditorRef(ref)}
            cropRadius={100}
          />
          <img src={preview} className="mt-2" alt="Preview" />
        </div>

        <button
          onClick={handleChangeAvatar}
          className="profile_btn_save ms-auto me-auto"
        >
          Lưu Lại
        </button>
      </Popup>
    </div>
  );
};
export default Profile;
