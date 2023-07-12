import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import { Button, CardActions } from "@mui/material";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import { reactApi } from "../../Redux/post/post.slice";
import { likeNotification } from "../../Redux/notification/notification.slice";
import { showModalMessage } from "../../Redux/message/message.slice";
import { addCart } from "../../Redux/cart/cart.slice";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { NumberForMatter } from "../../Ultils/functions";
const useStyles = makeStyles({
  card: {
    borderRadius: "4px",
    transition: "transform 0.3s ease",
    "&:hover": {
      boxShadow: "0 0 2px #ed6c02",
      transform: "scale(1.03)",
    },
    margin: "auto",
  },
});
const style = {
  position: "absolute",
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
const ShowPicture = (props) => {
  const classes = useStyles();
  const [liked, setLiked] = useState(props.liked);
  const [numberLikes, setNumberLikes] = useState(props.likes);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openError, setOpenError] = useState(false);
  const [open, setOpen] = React.useState(false);
  const infoUser = useSelector((state) => state?.auth?.user?.data?.data);
  const socket = useSelector((state) => state.socket.socket.payload);

  const handleReact = async () => {
    const res = await dispatch(reactApi(props.id));
    if (res.payload?.response?.status === 404) {
      dispatch(
        showModalMessage({
          type: "ERROR",
          msg: "Sản phẩm không khả dụng!",
        })
      );
      return;
    }
    setNumberLikes(liked ? numberLikes - 1 : numberLikes + 1);
    setLiked(!liked);
    if (!liked && props?.userId !== infoUser._id) {
      await dispatch(likeNotification(props.id));
      const data = {
        idPost: props.id,
        userNameCreatePost: props.userName,
      };
      socket?.emit("like_post", data);
    }
  };
  const addToCart = async (data) => {
    const body = {
      UrlImage: data.picture,
      name: data.name,
      quantity: 1,
      price: data.price,
      postId: data.id,
      postBy: data.postBy,
      statusCart: 0,
      orderId: "",
    };

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      const res = await dispatch(addCart(body));
      if (res?.error?.message === "Request failed with status code 404") {
        setOpenError(true);
        setTimeout(() => {
          setOpenError(false);
        }, 1000);
      } else if (res?.payload?.status === 201) {
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 800);
        socket?.emit("add_cart", body);
      }
    }
  };
  return (
    <>
      <div>
        <Card
          key={props._id}
          sx={{ maxWidth: 200, maxHeight: 350, borderRadius: 3 }}
          className={classes.card}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "200px",
              height: "200px",
              maxHeight: "100%",
              overflow: "hidden",
            }}
            className="bg-image"
          >
            <CardMedia
              onClick={() => {
                navigate(`/post/${props.id}`, {
                  state: {
                    postId: props.id,
                    liked: props.liked,
                    numberLikes: props.likes,
                    userName: props.userName,
                  },
                });
              }}
              className="btn hover-image"
              component="img"
              image={props.picture}
              alt="image"
              style={{
                maxWidth: "100%",
                height: "auto",
                maxHeight: "100%",
                width: "auto",
              }}
            />
          </div>
          <CardContent style={{ paddingTop: "0px", paddingBottom: "0px" }}>
            <Typography
              className="overflow-text fw-bold pt-2"
              style={{ fontSize: 13 }}
            >
              {props.name}
            </Typography>
            <Typography variant="body2">
              <p className=" f-3 mb-0">
                Giá:
                <span
                  style={{
                    color: "red",
                    marginLeft: "3px",
                    fontWeight: "600",
                  }}
                >
                  {NumberForMatter(props.price)}.đ
                </span>
              </p>
            </Typography>
          </CardContent>
          <Typography className="ps-1">
            {liked ? (
              <IconButton onClick={handleReact}>
                <FavoriteIcon fontSize="small" color="error" />
              </IconButton>
            ) : (
              <IconButton onClick={handleReact}>
                <FavoriteIcon fontSize="small" />
              </IconButton>
            )}

            <span style={{ fontSize: "12px", color: "#8e8ea0" }}>
              {numberLikes} Lượt thích
            </span>
          </Typography>
          <CardActions>
            <Button
              className="ms-auto me-auto"
              variant="contained"
              color="warning"
              startIcon={<LocalGroceryStoreIcon />}
              style={{ fontSize: "10px" }}
              onClick={() => {
                addToCart(props);
              }}
            >
              Thêm vào giỏ
            </Button>
            <div className="cart"></div>
          </CardActions>
        </Card>
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
                <CheckCircleIcon color="success" style={{ fontSize: "80px" }} />
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
    </>
  );
};
export default ShowPicture;
