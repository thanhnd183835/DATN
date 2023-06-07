import * as React from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Popup from "../../Component/Popup/Popup";
import Avatar from "react-avatar-edit";
import axios from "axios";
import { BASE_URL } from "../../Ultils/constant";
import { getMe } from "../../Redux/auth/auth.slice";
import { showModalMessage } from "../../Redux/message/message.slice";
import { getFollowers, getFollowing } from "../../Redux/user/user.slice";
import { getPostMe } from "../../Redux/post/post.slice";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import NavBar from "../../Component/NavBar/Navbar";
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
  const [expanded, setExpanded] = React.useState(false);
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
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onClose = () => {
    setPreview(null);
  };
  const onCrop = (preview) => {
    setPreview(preview);
  };

  const ShowPicture = (props) => {
    return (
      <Card
        sx={{ maxWidth: 345 }}
        className="border"
        onClick={() => {
          navigate(`/post/${props.id}`, {
            state: {
              postId: props.id,
              liked: props.liked,
              numberLikes: props.likes,
            },
          });
        }}
      >
        <CardHeader
          style={{
            textAlign: "center",
            color: "#083697",
          }}
        />
        <div style={{ overflow: "hidden", maxHeight: "250px" }}>
          <CardMedia
            className="btn"
            component="img"
            image={props.picture}
            alt="Paella dish"
          />
        </div>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            <p className="text-uppercase f-3">
              Giá:
              <span
                style={{
                  color: "red",
                  marginLeft: "3px",
                  fontWeight: "600",
                }}
              >
                {props.price}
              </span>
            </p>
          </Typography>
          <Typography>{props.name}</Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon color="error" />
            <span className="fs-6 ms-1 fw-bolder">
              Lượt thích {props.likes}
            </span>
          </IconButton>
        </CardActions>
      </Card>
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
      <div className={classes.profileContainer} style={{ paddingTop: "5rem" }}>
        <div className="profile-header">
          <div className="profile-avatar-box">
            <img
              style={{ width: "100px", height: "100px", borderRadius: "100%" }}
              className="profile-avatar"
              src={`${infoUser.avatar}`}
              alt="anh dai dien "
            />
            <div
              className="icon_picture"
              onClick={() => {
                setIsChangeAvatar(true);
                setPreview(null);
              }}
            >
              <CameraAltIcon />
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
        <div className="border">
          <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
            <Tabs value={value} onChange={handleChange} centered>
              <Tab className="px-4 fw-bold" label="Hải Sản" />
              <Tab className="px-4 fw-bold" label="Rau Củ" />
              <Tab className="px-4 fw-bold" label="Hoa Quả" />
              <Tab className="px-4 fw-bold" label="Bánh Kẹo" />
              <Tab className="px-4 fw-bold" label="Đồ Gia Dụng" />
              <Tab className="px-4 fw-bold" label="Đồ Điện Tử" />
            </Tabs>
          </Box>
        </div>
        {listPostForMe && listPostForMe?.length > 0 ? (
          <div className="profile-body">
            {listPostForMe.map((item) => (
              <ShowPicture
                type={item.typeItem}
                price={item.price}
                name={item.name}
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
