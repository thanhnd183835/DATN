import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FillTerContent from "../../Component/FillTerContent/FillTerContent";
import "./HomePage.css";
import { useSelector } from "react-redux";
import NavBar from "../../Component/NavBar/Navbar";
import Footer from "../../Component/Footer/Footer";
import axios from "axios";
import { BASE_URL } from "../../Ultils/constant";
import ShowPicture from "../../Component/ShowPicture/ShowPicture";
import Chat from "../../Component/Chat/Chat";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const infoUser = useSelector((state) => state?.auth?.user?.data?.data);
  const [listPost, setListPost] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
      } else {
        axios({
          method: "get",
          url: `${BASE_URL}/api/post/get-all-post`,
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

  return (
    <div>
      <div>
        <NavBar />
      </div>
      <div className="border border-2 " style={{ paddingTop: "6rem" }}>
        <FillTerContent />
      </div>
      <div className="row">
        {listPost.reverse()?.map((item) => (
          <div
            className="pt-4 col-xll-2 col-xl-2 col-lg-2 col-md-4 col-sm-6 col-6 "
            key={item._id}
          >
            <ShowPicture
              type={item.typeItem}
              price={item.price}
              name={item.name}
              userName={item.postBy.userName}
              avatar={item.postBy.avatar}
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
        <div id="chatbox">
          <Chat />
        </div>
      </div>
      <div className="pt-5">
        <Footer />
      </div>
    </div>
  );
};
export default HomePage;
