import React from "react";
import { useNavigate } from "react-router-dom";
import FillTerContent from "../../Component/FillTerContent/FillTerContent";
import Card from "@mui/material/Card";
import "./HomePage.css";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import { useSelector } from "react-redux";
import NavBar from "../../Component/NavBar/Navbar";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles({
  card: {
    border: "1px solid #ccc",
    borderRadius: "4px",
    transition: "box-shadow 0.3s",
    "&:hover": {
      boxShadow: "0 0 5px #ed6c02",
    },
    margin: "auto",
  },
});
const HomePage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const listPostForMe = useSelector((state) => state.post?.postOfMe?.data);
  const infoUser = useSelector((state) => state?.auth?.user?.data?.data);
  const ShowPicture = (props) => {
    return (
      <div>
        <Card sx={{ maxWidth: 200, maxHeight: 350 }} className={classes.card}>
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
            <Typography variant="body2">
              <p className="text-uppercase f-3 ">
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
          <Typography className="ps-1">
            <IconButton>
              <FavoriteIcon color="error" />
            </IconButton>
            <span className="fs-6 ms-1 fw-bolder">
              Lượt thích {props.likes}
            </span>
          </Typography>
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
        {listPostForMe.map((item) => (
          <div className="pt-2 col-3 ">
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
    </div>
  );
};
export default HomePage;
