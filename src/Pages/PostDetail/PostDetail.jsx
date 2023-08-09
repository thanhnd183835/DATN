import * as React from "react";
import "./PostDetail.css";
import NavBar from "../../Component/NavBar/Navbar";
import { useEffect, useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Avatar } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "@mui/material/Card";
import { followApi, unFollowApi } from "../../Redux/user/user.slice";
import { register } from "timeago.js";
import { BASE_URL, localeFunc } from "../../Ultils/constant";
import TextField from "@mui/material/TextField";
import axios from "axios";
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
import { Button, CardActions } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Footer from "../../Component/Footer/Footer";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { addCart } from "../../Redux/cart/cart.slice";
import ButtonChat from "../../Component/Chat/ButtonChat";
import { NumberForMatter } from "../../Ultils/functions";
import CommentIcon from "@mui/icons-material/Comment";
const style = {
  position: "relative",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#0000006b",
  boxShadow: 24,
  border: "none",
  p: 4,
  color: "#fff",
};
const PostDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [openError, setOpenError] = useState(false);
  const [post, setPost] = useState([]);
  const [showModal, setShowModal] = useState(0);
  const [commentChange, setCommentChange] = useState(0);
  const [listUserLiked, setListUserLiked] = useState([]);
  const [showListUser, setShowListUser] = useState(false);
  const [commentId, setCommentId] = useState("");
  const [commentUserId, setCommentUserId] = useState("");
  const [commentValue, setCommentValue] = useState("");
  const [active, setActive] = useState(false);
  const [numberLikes, setNumberLikes] = useState(location?.state?.numberLikes);
  const [liked, setLiked] = useState(location?.state?.liked);
  const socket = useSelector((state) => state?.socket?.socket?.payload);
  const [followed, setFollowed] = useState(location?.state?.followed);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = useState(1);
  const infoUser = useSelector((state) => state?.auth?.user?.data?.data);

  useEffect(() => {
    axios({
      method: "get",
      url: `${BASE_URL}/api/post/get-post/${location?.state?.postId}`,
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

  useEffect(() => {
    setActive(commentValue !== "");
  }, [commentValue]);
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const addToCart = async (data) => {
    const token = localStorage.getItem("token");
    const body = {
      UrlImage: data.UrlImg,
      name: data.name,
      quantity: value,
      price: data.price,
      postId: data._id,
      postBy: data.postBy,
      statusCart: 0,
      orderId: "",
    };

    if (token === null) {
      navigate("/login");
    } else {
      const res = await dispatch(addCart(body));
      if (res?.error?.message === "Request failed with status code 404") {
        setOpenError(true);
        setTimeout(() => {
          setOpenError(false);
        }, 2000);
      } else if (res?.payload?.status === 201) {
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 1000);
      }
      socket?.emit("add_cart", body);
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
              paddingTop: "15rem",
              paddingBottom: "15rem",
            }}
          >
            <CircularProgress color="warning" />
          </div>

          <div className="pt-5">
            <Footer />
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
                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm col">
                  <div
                    style={{
                      height: "auto",
                      width: "350px",
                      paddingLeft: "10px",
                      paddingTop: "1.5rem",
                    }}
                    className="ms-auto me-auto ms-xxl-0 ms-xl-0 ms-md-2 ms-sm-auto me-sm-auto"
                  >
                    <CardMedia
                      component="img"
                      image={post.UrlImg}
                      alt="green iguana"
                    />
                  </div>
                  <div className="pt-2 ps-xxl-1 ps-xl-1 ps-lg-1 ps-md-2 ps-sm-4 ps-4 ms-sm-5 ms-5 ms-xxl-0 ms-xl-0 ms-md-2">
                    <FavoriteIcon color="error" />
                    <span
                      className="ms-1"
                      style={{ fontSize: "12px", color: "#8e8ea0" }}
                    >
                      {post.likes.length} Lượt thích
                    </span>
                  </div>
                </div>
                <div className="col-xxl-8 col-xl-8 col-lg-8 col-md-6 col-sm col ps-5 pt-1">
                  <div className="d-flex gap-2 pt-3 ms-3">
                    <Chip
                      size="medium"
                      label={post.postBy.userName}
                      avatar={
                        <Avatar
                          alt="avatar"
                          style={{ width: 30, height: 30 }}
                          src={post.postBy.avatar}
                        />
                      }
                    />
                    <Chip
                      onClick={() =>
                        navigate(
                          `/profile-friend/${post.postBy._id}?typePost=all`
                        )
                      }
                      label="Xem trang"
                      color="warning"
                      icon={<NavigateNextIcon />}
                      // style={{ marginLeft: "200px" }}
                      variant="outlined"
                      className="ps-0"
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
                      <div className="mt-4 fs-6 text-primary">
                        Giá niêm yết:
                        <span className="ms-3 text-danger fw-bold">
                          {NumberForMatter(post.price)}đ.
                        </span>
                      </div>
                      <div className="mt-4 fs-6 text-primary">
                        Vận chuyển:
                        <span className="ms-4 text-danger">
                          Miễn phí giao hàng cho đơn từ 300.000đ. Giao hàng
                          trong 2 giờ.
                        </span>
                      </div>
                      <div>
                        <hr />
                      </div>
                      <div className="mt-4 d-flex flex-row fs-6 text-primary">
                        <span className=" pt-2">Số Lượng:</span>
                        <div>
                          <TextField
                            id="quantity"
                            variant="outlined"
                            color="warning"
                            size="small"
                            className="form-control bg-transparent ms-4 border border-danger"
                            defaultValue={1}
                            inputProps={{
                              max: 100,
                              min: 1,
                            }}
                            type="number"
                            style={{ width: "100px" }}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      className="ms-2"
                      variant="contained"
                      color="warning"
                      startIcon={<LocalGroceryStoreIcon />}
                      onClick={() => {
                        addToCart(post);
                      }}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                    {/* <Button className="ms-3" variant="contained" color="error">
                      Mua Ngay
                    </Button> */}
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
          <div className="pt-3">
            <Card sx={{ maxWidth: 1200, margin: "auto" }} className="border">
              <div className="pt-2 d-flex gap-2 ">
                <input
                  className="input_comment ms-5"
                  placeholder="Bình luận..."
                  onChange={(e) => {
                    setCommentValue(e.target.value);
                  }}
                  value={commentValue}
                />
                <Button
                  variant="contained"
                  color="warning"
                  className=" my-auto"
                  startIcon={<CommentIcon />}
                  onClick={handleAddComment}
                  style={{ borderRadius: 20 }}
                >
                  Đăng
                </Button>
              </div>
              <div className="box_comments">
                <ul className="list-group mt-4" style={{ listStyle: "none" }}>
                  {post.comments?.length > 0 &&
                    post.comments.map((comment, index) => (
                      <li
                        className="d-flex  ms-3 mb-3 list_comments"
                        key={index}
                      >
                        <Avatar
                          src={comment?.userId.avatar}
                          className="my-auto border "
                        />
                        <span className="d-flex flex-column ms-3 list_comments_text">
                          <span
                            className="my-auto fw-bold"
                            style={{
                              fontStyle: "italic",
                            }}
                          >
                            {comment?.userId.userName}
                          </span>

                          <span
                            className="my-auto"
                            style={{
                              fontStyle: "italic",
                            }}
                          >
                            {comment?.content}
                          </span>
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            </Card>
          </div>
          <div>
            <hr style={{ color: "red", borderWidth: "5px" }} />
          </div>
          <div>
            <Modal
              open={open}
              closeAfterTransition
              slots={{ backdrop: Backdrop }}
              slotProps={{
                backdrop: {},
              }}
            >
              <Fade in={open}>
                <Box sx={style}>
                  <Typography id="title" className="text-center">
                    <CheckCircleIcon
                      color="success"
                      style={{ fontSize: "80px" }}
                    />
                  </Typography>
                  <Typography
                    id="description"
                    className="text-center"
                    sx={{ mt: 2 }}
                  >
                    Sản phẩm đã được thêm vào giỏ hàng.
                  </Typography>
                </Box>
              </Fade>
            </Modal>
          </div>
          <div>
            <Modal
              open={openError}
              closeAfterTransition
              slots={{ backdrop: Backdrop }}
              slotProps={{
                backdrop: {},
              }}
            >
              <Fade in={openError}>
                <Box sx={style}>
                  <Typography id="title" className="text-center">
                    <ErrorIcon color="error" style={{ fontSize: "80px" }} />
                  </Typography>
                  <Typography
                    id="description"
                    className="text-center"
                    sx={{ mt: 2 }}
                  >
                    Sản phẩm đã có trong giỏ hàng .
                  </Typography>
                </Box>
              </Fade>
            </Modal>
          </div>

          <div style={{ position: "fixed", bottom: "60px" }}>
            <ButtonChat />
          </div>
          <div className="pt-5">
            <Footer />
          </div>
        </>
      )}
    </>
  );
};
export default PostDetail;
