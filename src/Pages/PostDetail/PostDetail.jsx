import * as React from "react";
import "./PostDetail.css";
import NavBar from "../../Component/NavBar/Navbar";
import { useEffect, useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Avatar, Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "@mui/material/Card";
import { followApi, unFollowApi } from "../../Redux/user/user.slice";
import { format, register } from "timeago.js";
import { BASE_URL, localeFunc } from "../../Ultils/constant";
import TextField from "@mui/material/TextField";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import {
  commentApi,
  getListUserLiked,
  reactApi,
} from "../../Redux/post/post.slice";
import {
  commentNotification,
  followNotification,
  likeNotification,
} from "../../Redux/notification/notification.slice";
import { showModalMessage } from "../../Redux/message/message.slice";
import { Button, CardActionArea, CardActions } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
const PostDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState({});
  const [showModal, setShowModal] = useState(0);
  const [commentChange, setCommentChange] = useState(0);
  const [listUserLiked, setListUserLiked] = useState([]);
  const [showListUser, setShowListUser] = useState(false);
  const [commentId, setCommentId] = useState("");
  const [commentUserId, setCommentUserId] = useState("");
  const [commentValue, setCommentValue] = useState("");
  const [active, setActive] = useState(false);
  console.log(post);
  const [numberLikes, setNumberLikes] = useState(location.state.numberLikes);
  const [liked, setLiked] = useState(location.state.liked);
  const socket = useSelector((state) => state.socket.socket.payload);
  const [followed, setFollowed] = useState(location.state.followed);

  const infoUser = useSelector((state) => state.auth.user.data.data);
  register("my-locale", localeFunc);
  useEffect(() => {
    axios({
      method: "get",
      url: `${BASE_URL}/api/post/get-post/${location.state.postId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((response) => {
      if (response.status === 200) {
        setPost(response.data.data);
        setLoading(false);
      }
    });
  }, [commentChange]);
  const goToProfile = (id) => {
    if (infoUser._id === id) {
      navigate("/profile");
    } else {
      navigate({
        pathname: `/profile-friend/${id}`,
      });
    }
  };
  const handleFollow = async () => {
    await dispatch(followApi(post?.postBy?._id));
    setFollowed(true);
    await dispatch(followNotification(post?.postBy?._id));
    const data = {
      idUser: post?.postBy?._id,
      userNameCreatePost: post?.postBy?.userName,
    };
    socket?.emit("follow_user", data);
  };
  const handleUnFollow = async () => {
    await dispatch(unFollowApi(post?.postBy?._id));
    setFollowed(false);
  };
  const handleReact = async () => {
    const res = await dispatch(reactApi(location.state.postId));
    if (res.payload.response?.status === 404) {
      dispatch(
        showModalMessage({
          type: "ERROR",
          msg: "Bài viết không khả dụng!",
        })
      );
      return;
    }
    setNumberLikes(liked ? numberLikes - 1 : numberLikes + 1);
    setLiked(!liked);
    if (!liked && post?.postBy?._id !== infoUser?._id) {
      await dispatch(likeNotification(location.state.postId));
      const data = {
        idPost: location.state.postId,
        userNameCreatePost: post?.postBy?.userName,
      };
      socket?.emit("like_post", data);
    }
  };
  const handleAddComment = async () => {
    setCommentValue("");
    const data = {
      postId: location.state.postId,
      userId: infoUser._id,
      content: commentValue,
    };
    const res = await dispatch(commentApi(data));
    if (res.payload.response?.status === 404) {
      dispatch(
        showModalMessage({
          type: "ERROR",
          msg: "Bài viết không khả dụng!",
        })
      );
      return;
    }

    if (res?.payload?.data?.code === 0) {
      if (post?.postBy?._id !== infoUser?._id) {
        await dispatch(commentNotification(location.state.postId));
        const dataPost = {
          idPost: location.state.postId,
          userNameCreatePost: post?.postBy?.userName,
        };
        socket?.emit("comment_post", dataPost);
      }
      setCommentChange(commentChange + 1);
    }
  };
  return (
    <>
      {loading ? (
        <>
          <NavBar />
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              paddingTop: "25rem",
            }}
          >
            <CircularProgress color="warning" />
          </div>
        </>
      ) : (
        <>
          <div>
            <NavBar />
          </div>
          <div className="row" style={{ paddingTop: "7rem" }}>
            <Card sx={{ maxWidth: 1200, margin: "auto" }} className="border">
              <div className="row pb-3">
                <div className="col-4">
                  <div
                    style={{
                      height: "auto",
                      width: "350px",
                      paddingLeft: "10px",
                      paddingTop: "1.5rem",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={post.UrlImg}
                      alt="green iguana"
                    />
                  </div>
                  <div className="pt-2 ps-2">
                    <FavoriteIcon color="error" />
                    <span className="fs-6 ms-1 fw-bolder ">
                      Lượt thích {post.likes.length}
                    </span>
                  </div>
                </div>
                <div className="col-8 ps-5 pt-1">
                  <div className="d-flex gap-5 pt-3 ms-3">
                    <Chip
                      size="medium"
                      label={infoUser.userName}
                      avatar={
                        <Avatar
                          alt="avatar"
                          style={{ width: 30, height: 30 }}
                          src={infoUser.avatar}
                        />
                      }
                    />
                    <Chip
                      label="Xem trang"
                      color="error"
                      icon={<NavigateNextIcon />}
                      style={{ marginLeft: "200px" }}
                      variant="outlined"
                    />
                  </div>
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      className="fw-bold"
                    >
                      {post.name}
                    </Typography>
                    <Typography variant="body2">
                      <p className="mt-4 fs-6 text-primary">
                        Giá niêm yết:
                        <span className="ms-3 text-danger fw-bold">
                          {post.price}.
                        </span>
                      </p>
                      <p className="mt-4 fs-6 text-primary">
                        Vận chuyển:
                        <span className="ms-4 text-danger">
                          Miễn phí giao hàng cho đơn từ 300.000đ. Giao hàng
                          trong 2 giờ.
                        </span>
                      </p>
                      <hr />
                      <p className="mt-4 d-flex flex-row fs-6 text-primary">
                        <span className=" pt-2">Số Lượng:</span>
                        <span>
                          <TextField
                            id="quantity"
                            variant="outlined"
                            color="warning"
                            size="small"
                            className="form-control bg-transparent ms-4 border border-danger"
                            defaultValue={1}
                            shrink
                            inputProps={{
                              max: 100,
                              min: 1,
                            }}
                            type="number"
                            style={{ width: "100px" }}
                          />
                        </span>
                      </p>
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      className="ms-2"
                      variant="contained"
                      color="warning"
                      startIcon={<LocalGroceryStoreIcon />}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </CardActions>
                </div>
              </div>
            </Card>
          </div>
          <div className="pt-3 ">
            <Card sx={{ maxWidth: 1200, margin: "auto" }} className="border">
              <CardContent>
                <Typography className="fw-bolder">CHI TIẾT SẢN PHẨM</Typography>
                <Typography className="pt-4">{post.detailItem}</Typography>
                <Typography className="pt-4 fw-bolder">
                  MÔ TẢ SẢN PHẨM
                </Typography>
                <Typography className="pt-4">{post.description}</Typography>
              </CardContent>
            </Card>
          </div>
          <div>
            <hr style={{ color: "red", borderWidth: "5px" }} />
          </div>
        </>
      )}
    </>
  );
};
export default PostDetail;
