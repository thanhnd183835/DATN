import React, { useState } from "react";
import NavBar from "../../Component/NavBar/Navbar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import CardActions from "@mui/material/CardActions";
import ImageIcon from "@mui/icons-material/Image";
import { useDispatch } from "react-redux";
import axios from "axios";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import { BASE_URL } from "../../Ultils/constant";
import { showModalMessage } from "../../Redux/message/message.slice";
import { useNavigate } from "react-router-dom";
import Footer from "../../Component/Footer/Footer";
import CircularProgress from "@mui/material/CircularProgress";
import ButtonChat from "../../Component/Chat/ButtonChat";

const TypeItem = [
  {
    label: "Hải Sản",
    value: "HaiSan",
  },
  {
    label: "Rau Củ",
    value: "RauCu",
  },
  {
    label: "Hoa Quả",
    value: "HoaQua",
  },
  {
    label: "Bánh Kẹo",
    value: "BanhKeo",
  },
  {
    label: "Đồ Gia Dụng",
    value: "DoGiaDung",
  },
  {
    label: "Đồ Điện Tử",
    value: "DoDienTu",
  },
];

const defaultImageUrl =
  "https://res.cloudinary.com/dzjtdpc4h/image/upload/v1685680208/DATN/image_blank_ekzide.webp";

const CreatePost = (props) => {
  const [preview, setPreview] = useState("");
  const [urlImg, setUrlImg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { handleSubmit, control, setValue } = useForm({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    criteriaMode: "firstError",
    shouldFocusError: true,
    defaultValues: {},
  });
  const handleImageChange = async (e) => {
    const selected = e.target.files[0];
    setUrlImg(selected);

    const reader = new FileReader();
    reader.onloadend = () => {
      const imagePreview = reader.result;

      setPreview(imagePreview);
    };
    if (selected && selected.type.match("image.*")) {
      reader.readAsDataURL(selected);
    }
  };
 
  const handleCreatePost = async (data) => {
    setLoading(true);
    const body = {
      name: data.name,
      price: data.price,
      typeItem: data.typeItem,
      description: data.description,
      detailItem: data.detailItem,
    };
    const token = localStorage.getItem("token");
    const formData = new FormData();
    Object.keys(body).forEach((key) => formData.append(key, body[key]));
    formData.append("image", urlImg);
    if (!token) {
      navigate("/login");
    } else {
      axios({
        method: "post",
        url: `${BASE_URL}/api/post/create-post`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: formData,
      })
        .then((response) => {
          if (response.status === 201) {
            setLoading(false);
            alert("Thêm sản phẩm thành công!");
            navigate("/");
          } else {
            dispatch(
              showModalMessage({
                type: "ERROR",
                msg: "Thêm sản phẩm thất bại",
              })
            );
          }
        })
        .catch((err) => {
          if (err.response.status === 500) {
            dispatch(
              showModalMessage({
                type: "ERROR",
                msg: "lỗi không thể tạo bài đăng, bạn cần xem lại đã điền đầy đủ và đúng định dạng các trường chưa!",
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
      <div style={{ paddingTop: "6rem" }}>
        <Card className="mt-5 w-75 ms-auto me-auto border border-2">
          <CardContent>
            <Typography className="mb-3 fs-3 fw-bold">Thêm sản phẩm</Typography>
          </CardContent>
          <form className="row " onSubmit={handleSubmit(handleCreatePost)}>
            <div className="col-3">
              {/*  */}
              <div className="image-input image-input-empty image-input-outline image-input-placeholder mb-3">
                <div
                  className="ms-auto me-auto border-2 image-input-wrapper border border-dashed border-gray rounded  cursor-pointer bg-hover-light-primary"
                  style={{
                    width: "200px",
                    height: "200px",
                    backgroundImage: `url(${preview || defaultImageUrl})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div
                    className="float-end border px-0 pt-0 pb-0 rounded d-flex align-items-center justify-content-center btn btn-icon"
                    style={{
                      marginTop: "-20px",
                      marginRight: "-25px",
                      background: "#fff",
                    }}
                  >
                    <Controller
                      name="image"
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            className="d-none"
                            accept="image/*"
                            id="contained-button-file"
                            multiple
                            type="file"
                            onChange={handleImageChange}
                          />
                          <label
                            htmlFor="contained-button-file"
                            className="btn pt-0 px-1 py-1"
                          >
                            <div>
                              <AddAPhotoOutlinedIcon
                                fontSize="small"
                                color="primary"
                              />
                            </div>
                          </label>
                        </>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 y">
                <p className="d-flex flex-row justify-content-center">
                  <ImageIcon fontSize="medium" color="success" />
                  <span
                    className="ms-1 text-success"
                    style={{ fontFamily: "Arial" }}
                  >
                    Ảnh mô tả
                  </span>
                </p>
              </div>
            </div>
            <div className="col-9">
              <div className="w-75">
                <Controller
                  name="name"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      id="name"
                      label="Tên sản phẩm"
                      variant="outlined"
                      size="small"
                      className="form-control bg-transparent"
                      type="text"
                    />
                  )}
                  control={control}
                />
              </div>
              <div className="w-75 mt-4">
                <Controller
                  name="price"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      id="price"
                      label="Giá tiền"
                      variant="outlined"
                      size="small"
                      className="form-control bg-transparent"
                      type="text"
                    />
                  )}
                  control={control}
                />
                <p className="text-danger font-italic" style={{ fontSize: 14 }}>
                  Chú ý giá tiền nhập dạng số ví dụ 30.000 thì nhập 30000
                </p>
              </div>
              <div className="w-75 mt-3">
                <Controller
                  name="typeItem"
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label ">
                        Phân loại sản phẩm
                      </InputLabel>
                      <Select
                        required
                        {...field}
                        label={"Phân loại sản phẩm"}
                        variant="outlined"
                        size="small"
                      >
                        {TypeItem.map((gender, index) => {
                          return (
                            <MenuItem value={gender.value} key={index}>
                              {gender.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  )}
                  control={control}
                />
              </div>
              <div className="w-75 mt-4">
                <Controller
                  name="description"
                  render={({ field }) => (
                    <TextareaAutosize
                      required
                      {...field}
                      id="description"
                      variant="outlined"
                      size="small"
                      className="form-control bg-transparent"
                      type="text"
                      placeholder="Mô tả về thông tin sản phẩm này..."
                    />
                  )}
                  control={control}
                />
              </div>
              <div className="w-75 mt-4">
                <Controller
                  name="detailItem"
                  render={({ field }) => (
                    <TextareaAutosize
                      required
                      {...field}
                      id="detailItem"
                      variant="outlined"
                      size="small"
                      className="form-control bg-transparent"
                      type="text"
                      placeholder="Chi tiết sản phẩm ..."
                    />
                  )}
                  control={control}
                />
              </div>
            </div>
            <div>
              <CardActions className="float-end w-25">
                <button
                  type="submit"
                  className="btn btn-warning mt-3 py-1 px-2"
                >
                  <span
                    className="indicator-label d-flex flex-row "
                    style={{ fontFamily: "Arial", color: "#fff" }}
                  >
                    {loading && (
                      <span>
                        <CircularProgress size={20} set />
                      </span>
                    )}

                    <span className="ms-2"> Thêm Sản Phẩm</span>
                  </span>
                </button>
              </CardActions>
            </div>
          </form>
        </Card>
      </div>
      <div style={{ position: "fixed", bottom: "200px" }}>
        <ButtonChat />
      </div>
      <div className="pt-5">
        <Footer />
      </div>
    </div>
  );
};
export default CreatePost;
