import * as React from "react";
import "./Profile.css";
import { useNavigate, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Popup from "../../Component/Popup/Popup";
import Avatar from "react-avatar-edit";
import { Button } from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../../Ultils/constant";
import { getMe } from "../../Redux/auth/auth.slice";
import { showModalMessage } from "../../Redux/message/message.slice";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { deletePost, getPostMe } from "../../Redux/post/post.slice";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SettingsIcon from "@mui/icons-material/Settings";
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
import Footer from "../../Component/Footer/Footer";
import DeleteIcon from "@mui/icons-material/Delete";
import ButtonChat from "../../Component/Chat/ButtonChat";
import { NumberForMatter } from "../../Ultils/functions";

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
  const [openDialog, setOpenDialog] = useState(false);
  const [idPost, setIdPost] = useState();

  const infoUser = useSelector((state) => state?.auth?.user?.data?.data);
  const listFollower = useSelector(
    (state) => state?.user?.followers?.data?.data
  );
  const listFollowing = useSelector(
    (state) => state?.user?.following?.data?.data
  );

  const listPostForMe = useSelector((state) => state.post?.postOfMe?.data);
  const [value, setValue] = React.useState("all");
  const [listPost, setListPost] = useState([]);

  const handleChange = (event, newValue) => {
    navigate(`/profile/${newValue}`);
    setValue(newValue);
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
      } else {
        axios({
          method: "get",
          url: `${BASE_URL}/api/post/get-post-for-me/${newValue}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }).then((response) => {
          if (response.status === 200) {
            setListPost(response.data.data);
          }
        });
      }
    };
    fetchData();
  };
  const handleDeletePost = (id) => {
    setOpenDialog(true);
    setIdPost(id);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      axios({
        method: "get",
        url: `${BASE_URL}/api/post/get-post-for-me`,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }).then((response) => {
        if (response.status === 200) {
          setListPost(response.data.data);
        }
      });
    }
  };
  const handleOpenDialog = async () => {
    const res = dispatch(deletePost(idPost));
    if (res.payload.status === 200) {
      setOpenDialog(false);
    }
    fetchData();
  };
  useEffect(() => {
    fetchData();
  }, []);
  const onClose = () => {
    setPreview(null);
  };
  const onCrop = (preview) => {
    setPreview(preview);
  };

  const ShowPicture = (props) => {
    return (
      <Card
        sx={{ maxWidth: 345, borderRadius: 3 }}
        className="border ms-auto me-auto pb-sm-0"
      >
        <CardHeader
          className="py-0"
          action={
            <div className="d-flex flex-row text-danger">
              <IconButton onClick={() => handleDeletePost(props.id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </div>
          }
        />

        <div style={{ overflow: "hidden", maxHeight: "250px" }}>
          <CardMedia
            className="btn"
            component="img"
            image={props.picture}
            alt="Paella dish"
            onClick={() => {
              navigate(`/post/${props.id}`, {
                state: {
                  postId: props.id,
                  liked: props.liked,
                  numberLikes: props.likes,
                },
              });
            }}
          />
        </div>
        <CardContent style={{ paddingTop: "10px", paddingBottom: "0px" }}>
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
                {NumberForMatter(props.price)}
              </span>
            </p>
          </Typography>
          <Typography
            className="overflow-text fw-bold "
            style={{ width: "250px" }}
          >
            {props.name}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
            <span className="fs-6 ms-1 fw-bolder">
              {props.likes} Lượt thích
            </span>
          </IconButton>
        </CardActions>
      </Card>
    );
  };

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
    <>
      <div>
        <div>
          <NavBar />
        </div>
        <div
          className={classes.profileContainer}
          style={{ paddingTop: "3rem" }}
        >
          <div className="profile-header">
            <div className="profile-avatar-box">
              <img
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "100%",
                }}
                className="profile-avatar"
                src={`${infoUser?.avatar}`}
                alt="anh dai dien "
              />
              <div
                className="icon_picture"
                onClick={() => {
                  setIsChangeAvatar(true);
                  setPreview(null);
                }}
              >
                <CameraAltIcon color="warning" />
              </div>
            </div>
            <div className="profile-info">
              <div className="profile-title">
                <div className="profile-user-name">{infoUser?.userName}</div>
                <Button
                  className="mt-2 ms-3"
                  variant="contained"
                  onClick={() => {
                    navigate({
                      pathname: `/edit-profile`,
                    });
                  }}
                  color="error"
                  startIcon={<SettingsIcon />}
                  size="small"
                  style={{ height: 30 }}
                >
                  Chỉnh sửa trang cá nhân
                </Button>
                {infoUser?.role === 1 ? (
                  <Button
                    className="ms-2 mt-2 "
                    onClick={() => {
                      navigate({
                        pathname: `/order`,
                      });
                    }}
                    variant="contained"
                    color="warning"
                    startIcon={<ShoppingCartIcon />}
                    size="small"
                    style={{ height: 30 }}
                  >
                    Quản Lý Đơn Hàng
                  </Button>
                ) : (
                  <Button
                    className="ms-2 mt-2 "
                    onClick={() => {
                      navigate({
                        pathname: `/order-by`,
                      });
                    }}
                    variant="contained"
                    color="warning"
                    startIcon={<ShoppingCartIcon />}
                    size="small"
                    style={{ height: 30 }}
                  >
                    Đơn Mua
                  </Button>
                )}
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
              <Tabs onChange={handleChange} centered value={value}>
                <Tab
                  className="px-4 fw-bold"
                  label="Tất Cả"
                  value="all"
                  component={Link}
                  to="?typePost=all"
                />
                <Tab
                  className="px-4 fw-bold"
                  label="Hải Sản"
                  value="HaiSan"
                  component={Link}
                  to="?typePost=HaiSan"
                />

                <Tab
                  className="px-4 fw-bold"
                  label="Rau Củ"
                  value="RauCu"
                  component={Link}
                  to="?typePost=RauCu"
                />
                <Tab
                  className="px-4 fw-bold"
                  label="Hoa Quả"
                  value="HoaQua"
                  to="?typePost=HoaQua"
                  component={Link}
                />
                <Tab
                  className="px-4 fw-bold"
                  label="Bánh Kẹo"
                  value="BanhKeo"
                  to="?typePost=BanhKeo"
                  component={Link}
                />
                <Tab
                  className="px-4 fw-bold"
                  label="Đồ Gia Dụng"
                  value="DoGiaDung"
                  to="?typePost=DoGiaDung"
                  component={Link}
                />
                <Tab
                  className="px-4 fw-bold"
                  label="Đồ Điện Tử"
                  value="DoDienTu"
                  to="?typePost=DoDienTu"
                  component={Link}
                />
              </Tabs>
            </Box>
          </div>

          {listPost && listPost?.length > 0 ? (
            <div className="profile-body">
              {listPost.map((item) => (
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
        <div style={{ position: "fixed", bottom: "80px" }}>
          <ButtonChat />
        </div>
        <div className="pt-5">
          <Footer />
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
        <div>
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth={"sm"}
            fullWidth={true}
          >
            <DialogTitle id="alert-dialog-title" className="text-center">
              <HelpOutlineIcon color="error" style={{ fontSize: 50 }} />
            </DialogTitle>
            <DialogContent>
              <DialogContentText
                id="alert-dialog-description"
                className="text-uppercase fs-5 text-center"
              >
                Bạn có chắc chắn muốn xóa mặt hàng này?
              </DialogContentText>
            </DialogContent>
            <DialogActions className="justify-content-center">
              <Button
                variant="outlined"
                color="error"
                onClick={handleCloseDialog}
              >
                Hủy
              </Button>
              <Button
                variant="outlined"
                color="success"
                onClick={handleOpenDialog}
                autoFocus
              >
                Đồng ý
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  );
};
export default Profile;
