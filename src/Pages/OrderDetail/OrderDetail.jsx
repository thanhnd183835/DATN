import * as React from "react";
import { useState, useEffect } from "react";
import NavBar from "../../Component/NavBar/Navbar";
import Footer from "../../Component/Footer/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../../Ultils/constant";
import { NumberForMatter } from "../../Ultils/functions";
import ButtonChat from "../../Component/Chat/ButtonChat";
import Chip from "@mui/material/Chip";
import { agreeItemOrder, refuseItemOrder } from "../../Redux/order/order.slice";

const OrderDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [order, setOrder] = useState();
  const location = useLocation();
  const orderDetail = location?.state;

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (token === null) {
      navigate("/login");
    } else {
      axios({
        method: "get",
        url: `${BASE_URL}/api/order/order-detail/${orderDetail.orderId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }).then((response) => {
        if (response.status === 200) {
          setOrder(response.data.data);
        }
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div>
        <NavBar />
      </div>
      <div style={{ paddingTop: "7rem" }}>
        <Card
          sx={{ maxWidth: 1300, margin: "auto", minHeight: 500 }}
          className="border"
        >
          <span className="text-center">
            <p className="mt-2 fs-4" style={{ fontStyle: "italic" }}>
              Chi tiết đơn hàng
            </p>
          </span>
          <div className="row ms-2">
            <div className="col-1">
              <img
                alt="image_post"
                src={orderDetail.UrlImage}
                style={{ width: 100 }}
              />
            </div>
            <div style={{ fontSize: 15 }} className="fw-bold col-2 my-auto">
              {orderDetail.name}
            </div>
            <div className="text-danger col-2 my-auto">
              Giá: {NumberForMatter(orderDetail.price)}.đ
            </div>
            <div className="col-1 my-auto">
              Số lượng: {orderDetail.quantity}
            </div>
            <div className="col-2 my-auto">
              <span className="text-danger">Ngày Đặt: </span>
              {moment(orderDetail.createdAt).format("DD/MM/YYYY, HH:mm:ss ")}
            </div>
            {order?.paymentStatus === 0 ? (
              <div className="my-auto col-2 text-center">
                <span>
                  <Chip label="Chưa Thanh toán" color="error" />
                </span>
              </div>
            ) : order?.paymentStatus === 1 ? (
              <div className="my-auto col-2 text-center">
                <span>
                  <Chip label="Đã Thanh Toán" color="success" />
                </span>
              </div>
            ) : (
              <div className="my-auto col-2 text-center">
                <span>
                  <Chip label="Thanh Toán Thất Bại" color="error" />
                </span>
              </div>
            )}
            {orderDetail.statusCart === 0 ? (
              <div className="my-auto text-center text-danger col-2 ">
                <Chip label="Chờ xác nhận" color="warning" />
              </div>
            ) : orderDetail.statusCart === 2 ? (
              <div className="my-auto text-center text-danger col-2 ">
                <Chip label="Đã bị từ chối" color="error" />
              </div>
            ) : (
              <div className="my-auto text-center text-danger col-2 ">
                <Chip label="Đã được nhận" color="success" />
              </div>
            )}
          </div>
          <div className="ms-4" style={{ fontSize: 17 }}>
            Địa chỉ giao hàng:{" "}
            <span className="text-danger">{order?.address}</span>
          </div>
          <div className="ms-4" style={{ fontSize: 17 }}>
            <span></span>
            Số điện thoại người nhận:{" "}
            <span className="text-danger">{order?.phoneNumber}</span>
          </div>
        </Card>
      </div>
      <div style={{ position: "fixed", bottom: "60px" }}>
        <ButtonChat />
      </div>
      <div className="pt-4">
        <Footer />
      </div>
    </div>
  );
};
export default OrderDetail;
