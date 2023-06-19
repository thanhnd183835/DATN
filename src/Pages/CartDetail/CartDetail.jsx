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
import Chat from "../../Component/Chat/Chat";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
const useStyles = makeStyles((theme) => ({
  input: {
    textAlign: "center",
  },
  label: {},
}));
const CartDetail = () => {
  const navigate = useNavigate();
  const [listCart, setListCart] = useState([]);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [value, setValue] = React.useState("live");
  const listMoney = listCart.map((items) => items.quantity * items.price);
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
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

  useEffect(() => {
    fetchData();
    dispatch(getCartForMe());
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
        dispatch(updateQuantity(body));
        fetchData();
      }
    };

    const increaseQuantity = async () => {
      if (props.quantity < 100) {
        setQuantity(quantity + 1);
        const body = {
          quantity: quantity + 1,
          CartId: props.CartId,
        };
        dispatch(updateQuantity(body));
        fetchData();
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
                    style={{ fontSize: 15, width: 400 }}
                    className="my-auto py-auto ms-3"
                  >
                    {items.name}
                  </div>
                  <div
                    className="my-auto ms-3 text-danger"
                    style={{ width: 100 }}
                  >
                    {items.price}.đ
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
                <p className="col-8 ">Tạm Tính giỏ hàng</p>
                <p className="col-4 text-danger text-end ">{totalMoney}.đ</p>
              </div>
              <TextField
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
              <div className="row pt-3">
                <p className="fw-bold col-8">Thành tiền</p>
                <>
                  {totalMoney > 300000 === true ? (
                    <div className="col-4 fw-bold text-danger text-end">
                      {totalMoney}.đ
                    </div>
                  ) : (
                    <div className="col-4 fw-bold text-danger text-end">
                      {totalMoney + 15000}.đ
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
                        value="VNPAY"
                        control={<Radio />}
                        label="VNPAY"
                      />
                    </>
                  </RadioGroup>
                </FormControl>
              </div>
              {value === "live" ? (
                <div className="pt-5 mb-5">
                  <Button variant="contained" color="warning" fullWidth>
                    Đặt Hàng
                  </Button>
                </div>
              ) : (
                <div className="pt-5 mb-5">
                  <Button variant="contained" color="warning" fullWidth>
                    Thanh Toán
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      <div style={{ position: "fixed", bottom: "200px" }}>
        <Chat />
      </div>
      <div className="pt-5">
        <Footer />
      </div>
    </>
  );
};
export default CartDetail;
