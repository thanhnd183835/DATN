import * as React from "react";
import { useState, useEffect } from "react";
import NavBar from "../../Component/NavBar/Navbar";
import Footer from "../../Component/Footer/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CartDetail.css";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../../Ultils/constant";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteItemCart,
  getCartForMe,
  updateQuantity,
} from "../../Redux/cart/cart.slice";
import { makeStyles } from "@material-ui/core/styles";
import ButtonChat from "../../Component/Chat/ButtonChat";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { NumberForMatter } from "../../Ultils/functions";
import { createOrder } from "../../Redux/order/order.slice";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import ErrorIcon from "@mui/icons-material/Error";
import Typography from "@mui/material/Typography";
import moment from "moment/moment";

const useStyles = makeStyles((theme) => ({
  input: {
    textAlign: "center",
  },
  label: {},
}));
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
const CartDetail = () => {
  const navigate = useNavigate();
  const [listCart, setListCart] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [value, setValue] = React.useState("live");
  const listMoney = listCart.map((items) => items.quantity * items.price);
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const date = moment(new Date()).format("DD-MM-YYYY,HH:mm:ss");
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (token === null) {
      navigate("/login");
    } else {
      axios({
        method: "get",
        url: `${BASE_URL}/api/cart/get-list-cart`,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }).then((response) => {
        if (response.status === 200) {
          setListCart(response.data.data);
        }
      });
    }
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleDeleteItemCart = async (idItemCart) => {
    const res = await dispatch(deleteItemCart(idItemCart));
    if (res.payload.status === 200) {
      fetchData();
    }
  };
  const totalMoney = listMoney.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const QuantitySelector = (props) => {
    const [quantity, setQuantity] = useState(props.quantity);

    const decreaseQuantity = async () => {
      if (props.quantity > 1) {
        setQuantity(quantity - 1);
        const body = {
          quantity: quantity - 1,
          CartId: props.CartId,
        };
        const res = await dispatch(updateQuantity(body));
        if (res?.payload?.status === 200) {
          fetchData();
        }
      }
    };

    const increaseQuantity = async () => {
      if (props.quantity < 100) {
        setQuantity(quantity + 1);
        const body = {
          quantity: quantity + 1,
          CartId: props.CartId,
        };
        const res = await dispatch(updateQuantity(body));
        if (res?.payload?.status === 200) {
          fetchData();
        }
      }
    };

    return (
      <div className="buttons_added">
        <input
          className="minus is-form"
          type="button"
          value="-"
          onClick={decreaseQuantity}
        />
        <input
          aria-label="quantity"
          className="input-qty"
          max="100"
          min={1}
          type="number"
          value={quantity}
          readOnly
        />
        <input
          className="plus is-form"
          type="button"
          value="+"
          onClick={increaseQuantity}
        />
      </div>
    );
  };

  const handleOrder = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else if (phoneNumber === "" || address === "") {
      setOpenModel(true);
      setTimeout(() => {
        setOpenModel(false);
      }, 1200);
    } else {
      setOpenDialog(true);
    }
  };
  const handlePayment = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else if (phoneNumber === "" || address === "") {
      setOpenModel(true);
      setTimeout(() => {
        setOpenModel(false);
      }, 1200);
    } else {
      setOpenDialog(true);
    }
  };
  const handleOpenDialog = async () => {
    const body = {
      phoneNumber: phoneNumber,
      address: address,
      totalMoney: totalMoney > 300000 ? totalMoney : totalMoney + 15000,
      order: listCart,
    };
    if (value === "live") {
      setOpenDialog(true);
      const res = await dispatch(createOrder(body));
      if (res.payload.status === 201) {
        setOpenDialog(false);
        navigate("/order-by");
      }
    } else {
      const res = await dispatch(createOrder(body));
      if (res.payload.status === 201) {
        setOpenDialog(false);
        axios({
          method: "POST",
          url: `${BASE_URL}/api/transaction/create_payment_url`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          data: {
            orderType: 250000,
            bankCode: "NCB",
            totalMoney: totalMoney > 300000 ? totalMoney : totalMoney + 15000,
            orderInfo: "Thanh toan don hang luc:" + `${date}`,
            orderId: res.payload.data.data._id,
            language: "vn",
          },
        }).then((response) => {
          if (response) {
            // @ts-ignore1
            window.open(response.data.data, "_self");
          }
        });
      }
    }
  };
  return (
    <>
      <div>
        <NavBar />
      </div>
      <div style={{ paddingTop: "7rem" }}>
        <Card sx={{ maxWidth: 1300, margin: "auto" }} className="border">
          <div className="row">
            <div className="col-8">
              {listCart?.map((items) => (
                <div className="d-flex ms-2 mt-2 mb-2" key={items._id}>
                  <div className="btn">
                    <img
                      alt="image_post"
                      src={items.UrlImage}
                      style={{ width: 60 }}
                      onClick={() =>
                        navigate(`/post/${items.postId}`, {
                          state: {
                            postId: items.postId,
                            liked: items.liked,
                            numberLikes: items.likes,
                          },
                        })
                      }
                    />
                  </div>
                  <div
                    style={{ fontSize: 15, width: 350 }}
                    className="my-auto py-auto ms-3"
                  >
                    {items.name}
                  </div>
                  <div
                    className="my-auto ms-3 text-danger"
                    style={{ width: 150 }}
                  >
                    {NumberForMatter(items.price)}.đ
                  </div>
                  <div className="my-auto ms-3">
                    <QuantitySelector
                      quantity={items.quantity}
                      CartId={items._id}
                    />
                  </div>
                  <div className="my-auto ms-2">
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      size="small"
                      onClick={() => handleDeleteItemCart(items._id)}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-4 mt-4 ">
              <div className="row fw-bold">
                <p className="col-7 ">Tạm Tính giỏ hàng</p>
                <p className="col-5 text-danger text-end ">
                  {NumberForMatter(totalMoney)}.đ
                </p>
              </div>
              <TextField
                name="discountCode"
                id="discountCode"
                variant="outlined"
                size="small"
                className="form-control bg-transparent mt-2"
                type="text"
                placeholder="Nhập Mã Giảm Giá"
                InputProps={{
                  classes: {
                    input: classes.input,
                    root: classes.label,
                  },
                }}
              />
              <div className="row mt-4">
                <p className="fw-bold col-8">Phí vận chuyển</p>
                <>
                  {totalMoney > 300000 === true ? (
                    <p className="col-4 text-end ">0.đ</p>
                  ) : (
                    <p className="col-4 text-end ">15.000.đ</p>
                  )}
                </>
              </div>
              <div>
                <p className="text-danger font-italic" style={{ fontSize: 14 }}>
                  Lưu ý: Miễn phí vận chuyển cho đơn hàng từ 300.000đ
                </p>
              </div>
              <TextField
                name="discountCode"
                id="discountCode"
                variant="outlined"
                size="small"
                className="form-control bg-transparent mt-2"
                type="text"
                placeholder="Địa chỉ giao hàng"
                InputProps={{
                  classes: {
                    input: classes.input,
                    root: classes.label,
                  },
                }}
                onChange={(e) => setAddress(e.target.value)}
              />
              <TextField
                name="phoneNumber"
                id="discountCode"
                variant="outlined"
                size="small"
                className="form-control bg-transparent mt-2"
                type="text"
                placeholder="Số điện thoại người nhận"
                InputProps={{
                  classes: {
                    input: classes.input,
                    root: classes.label,
                  },
                }}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />

              <div className="row pt-3">
                <p className="fw-bold col-7">Thành tiền</p>
                <>
                  {totalMoney > 300000 === true ? (
                    <div className="col-5 fw-bold text-danger text-end">
                      {NumberForMatter(totalMoney)}.đ
                    </div>
                  ) : (
                    <div className="col-4 fw-bold text-danger text-end">
                      {NumberForMatter(totalMoney + 15000)}.đ
                    </div>
                  )}
                </>
              </div>
              <div className="pt-4">
                <FormControl>
                  <FormLabel
                    id="demo-controlled-radio-buttons-group"
                    className="fw-bold text-primary"
                  >
                    Chọn hương thức thanh toán
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={value}
                    onChange={handleChange}
                    className="pt-3"
                  >
                    <FormControlLabel
                      value="live"
                      control={<Radio />}
                      label="Thanh toán khi nhận hàng"
                    />
                    <div>
                      <img
                        src="https://res.cloudinary.com/dzjtdpc4h/image/upload/v1687085163/DATN/vnpay_jeldb3.png"
                        style={{ width: 50, height: 50 }}
                      />
                    </div>
                    <>
                      <FormControlLabel
                        value="VNPAYQR"
                        control={<Radio />}
                        label="VNPAY QR"
                      />
                    </>
                  </RadioGroup>
                </FormControl>
              </div>
              {value === "live" ? (
                <div className="pt-5 mb-5">
                  <Button
                    variant="contained"
                    color="warning"
                    fullWidth
                    onClick={handleOrder}
                  >
                    Đặt Hàng
                  </Button>
                </div>
              ) : (
                <div className="pt-5 mb-5">
                  <Button
                    variant="contained"
                    color="warning"
                    fullWidth
                    onClick={handlePayment}
                  >
                    Thanh Toán
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      <div style={{ position: "fixed", bottom: "60px" }}>
        <ButtonChat />
      </div>
      <div className="pt-5">
        <Footer />
      </div>
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
              Bạn có đồng ý đặt Hàng?
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
      <div>
        <Modal
          open={openModel}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {},
          }}
        >
          <Fade in={openModel}>
            <Box sx={style}>
              <Typography id="title" className="text-center">
                <ErrorIcon color="error" style={{ fontSize: "80px" }} />
              </Typography>
              <Typography
                id="description"
                className="text-center"
                sx={{ mt: 2 }}
              >
                Địa chỉ và số điện thoại không được bỏ trống.
              </Typography>
            </Box>
          </Fade>
        </Modal>
      </div>
    </>
  );
};
export default CartDetail;
