import * as React from "react";
import "./HomePageWithFilter.css";
import NavBar from "../../Component/NavBar/Navbar";
import Footer from "../../Component/Footer/Footer";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../Ultils/constant";
import FillTerContent from "../../Component/FillTerContent/FillTerContent";
import { useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import { Button, CardActions } from "@mui/material";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import Chat from "../../Component/Chat/Chat";

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
const HomePageWithFilter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [listPost, setListPost] = useState([]);
  const classes = useStyles();
  const infoUser = useSelector((state) => state?.auth?.user?.data?.data);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
      } else {
        axios({
          method: "get",
          url: `${BASE_URL}/api/post/get-list-typeItem${location.pathname}`,
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
  }, []);
  const ShowPicture = (props) => {
    return (
      <div>
        <Card
          key={props._id}
          sx={{ maxWidth: 200, maxHeight: 350 }}
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
            <Typography className="overflow-text fw-bold">
              {props.name}
            </Typography>
            <Typography variant="body2">
              <p className="text-uppercase f-3 mb-0">
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
          </CardContent>
          <Typography className="ps-1">
            <IconButton>
              <FavoriteIcon fontSize="small" />
            </IconButton>
            <span style={{ fontSize: "12px", color: "#8e8ea0" }}>
              Lượt thích {props.likes}
            </span>
          </Typography>
          <CardActions>
            <Button
              className="ms-2"
              variant="contained"
              color="warning"
              startIcon={<LocalGroceryStoreIcon />}
              style={{ fontSize: "10px" }}
            >
              Thêm vào giỏ hàng
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  };
  return (
    <div>
      <div>
        <NavBar />
      </div>
      <div className="border border-2 " style={{ paddingTop: "6rem" }}>
        <FillTerContent />
      </div>
      <div className="row">
        {listPost?.map((item) => (
          <div
            className="pt-4 col-xll-2 col-xl-2 col-lg-2 col-md-4 col-sm-6 col-6 "
            key={item._id}
          >
            <ShowPicture
              type={item.typeItem}
              price={item.price}
              name={item.name}
              likes={item.likes.length}
              comments={item.comments.length}
              picture={item.UrlImg}
              id={item?._id}
              liked={
                item.likes.find((i) => i.userId === infoUser._id) ? true : false
              }
              userId={item?.postBy}
            />
          </div>
        ))}
      </div>
      <div>
        <Chat />
      </div>
      <div className="pt-5">
        <Footer />
      </div>
    </div>
  );
};
export default HomePageWithFilter;
