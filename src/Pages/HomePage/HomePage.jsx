import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./HomePage.css";
import { useSelector } from "react-redux";
import NavBar from "../../Component/NavBar/Navbar";
import Footer from "../../Component/Footer/Footer";
import axios from "axios";
import { BASE_URL } from "../../Ultils/constant";
import ShowPicture from "../../Component/ShowPicture/ShowPicture";
import ButtonChat from "../../Component/Chat/ButtonChat";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";
const HomePage = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState("all");
  const [subDiViSon, setSubDiViSon] = useState("");
  const infoUser = useSelector((state) => state?.auth?.user?.data?.data);
  const [listPost, setListPost] = useState([]);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const settings = {
    dots: true, // Hiển thị chấm tròn đại diện cho từng ảnh
    infinite: true, // Vô hạn trượt qua các ảnh
    speed: 500, // Tốc độ trượt ảnh (ms)
    slidesToShow: 1, // Số lượng ảnh được hiển thị cùng một lúc
    slidesToScroll: 1, // Số lượng ảnh được trượt khi di chuyển
    autoplay: true, // Tự động trượt ảnh
    autoplaySpeed: 2000, // Tốc độ trượt tự động (ms)
    arrows: true,
  };
  const handleChange = (event, newValue) => {
    navigate(`/profile/${newValue}`);
    setValue(newValue);
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token === null) {
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
  useEffect(() => {
    const fetchData = async (page) => {
      const token = localStorage.getItem("token");
      if (token === null) {
        navigate("/login");
      } else
        axios({
          method: "get",
          url: `${BASE_URL}/api/post/get-all-post`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          params: {
            limit: 18,
            page: page,
          },
        }).then((response) => {
          if (response.status === 200) {
            setListPost((prevData) => [...prevData, ...response.data.data]);
            setIsLastPage(response.data.isLastPage);
          }
        });
    };
    fetchData(page);
  }, [page]);

  const handleChangeSubdivision = (event) => {
    setSubDiViSon(event.target.value);
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token === null) {
        navigate("/login");
      } else {
        axios({
          method: "get",
          url: `${BASE_URL}/api/post/get-all-post-with-subdivision/${event.target.value}`,
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
  const handleChangePage = () => {
    setPage((prevPage) => prevPage + 1);
  };
  return (
    <>
      <div>
        <NavBar />
      </div>
      <div style={{ maxWidth: 1200, marginLeft: "auto", marginRight: "auto" }}>
        <div
          className=" border-2 mb-3 row gap-"
          style={{ paddingTop: "6.5rem" }}
        >
          <div className="py-0 col-7 ">
            <Slider {...settings}>
              <div>
                <img
                  src="https://res.cloudinary.com/dzjtdpc4h/image/upload/v1687365628/DATN/vn-50009109-a060947a544d3aab51f253c4af4d8169_xxhdpi_f09ndl.jpg"
                  alt="Image 1"
                  height={230}
                />
              </div>
              <div>
                <img
                  src="https://res.cloudinary.com/dzjtdpc4h/image/upload/v1687365625/DATN/vn-50009109-e40a45cc61b2783edfb17e8a5ca23cbc_xxhdpi_c3ur95.jpg"
                  height={230}
                />
              </div>
              <div>
                <img
                  src="https://res.cloudinary.com/dzjtdpc4h/image/upload/v1687367273/DATN/vn-50009109-8d6566586266b6f94149b8ce6b25877f_tajwoo.jpg"
                  alt="Image 2"
                  height={230}
                />
              </div>
              <div>
                <img
                  src="https://res.cloudinary.com/dzjtdpc4h/image/upload/v1687367448/DATN/vn-50009109-01423d4db88e42a387974ef390a6bcf5_artfag.png"
                  alt="Image 2"
                  height={230}
                />
              </div>
            </Slider>
          </div>
          <div className="col-4 px-0">
            <div>
              <img
                src="https://res.cloudinary.com/dzjtdpc4h/image/upload/v1687366532/DATN/cach-chon-trai-cay-nhap-khau-tuoi-sach-5_metw4g.jpg"
                alt="Image 3"
                style={{ width: 500, height: 120, objectFit: "cover" }}
              />
            </div>
            <div className="pt-2 pb-2">
              <img
                src="https://res.cloudinary.com/dzjtdpc4h/image/upload/v1685499523/DATN/do-gia-dung_ihtzld.webp"
                alt="Image 4"
                style={{ width: 500, height: 120, objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
        <div className="border px-0">
          <Box sx={{ bgcolor: "background.paper" }} className="row">
            <FormControl
              style={{ width: 150 }}
              size="small"
              className="mt-2 mb-2 col-2 ms-2"
            >
              <InputLabel id="demo-simple-select-label" className="fw-bold">
                Phân khu
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={subDiViSon}
                label="Phân khu"
                onChange={handleChangeSubdivision}
              >
                <MenuItem value={"A"}>Phân khu A</MenuItem>
                <MenuItem value={"B"}>Phân khu B</MenuItem>
              </Select>
            </FormControl>
            <Tabs
              onChange={handleChange}
              centered
              value={value}
              textColor="primary"
              indicatorColor="primary"
              aria-label="secondary tabs example"
              className="col-10"
            >
              <Tab
                className="px-4 fw-bold  "
                label="Tất Cả"
                value="all"
                component={Link}
                to="?typePost=all"
              />
              <Tab
                className="px-4 fw-bold  "
                label="Hải Sản"
                value="HaiSan"
                component={Link}
                to="?typePost=HaiSan"
              />

              <Tab
                className="px-4 fw-bold  "
                label="Rau Củ"
                value="RauCu"
                component={Link}
                to="?typePost=RauCu"
              />
              <Tab
                className="px-4 fw-bold "
                label="Hoa Quả"
                value="HoaQua"
                to="?typePost=HoaQua"
                component={Link}
              />
              <Tab
                className="px-4 fw-bold "
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
                className="px-4 fw-bold "
                label="Đồ Điện Tử"
                value="DoDienTu"
                to="?typePost=DoDienTu"
                component={Link}
              />
            </Tabs>
          </Box>
        </div>
        <div
          className="row pt-4 mx-auto mt-3"
          style={{ backgroundColor: "#e9ecef" }}
        >
          {listPost.reverse()?.map((item) => (
            <div
              className="mb-3 col-xll-2 col-xl-2 col-lg-2 col-md-4 col-sm-6 col-6 "
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
                  item.likes.find((i) => i.userId === infoUser?._id)
                    ? true
                    : false
                }
                postBy={item?.postBy}
              />
            </div>
          ))}
        </div>
        {isLastPage === false && (
          <Stack spacing={2} alignItems="center" className="mt-2">
            <Button
              color="warning"
              size="small"
              variant="contained"
              onClick={handleChangePage}
            >
              Xem Thêm sản phẩm
            </Button>
          </Stack>
        )}
      </div>
      <div>
        <div id="chatbox">
          <ButtonChat />
        </div>
      </div>

      <div className="pt-5">
        <Footer />
      </div>
    </>
  );
};
export default HomePage;
