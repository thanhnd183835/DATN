import * as React from "react";
import { useState, useEffect } from "react";
import NavBar from "../../Component/NavBar/Navbar";
import Footer from "../../Component/Footer/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../../Ultils/constant";

import Chip from "@mui/material/Chip";
import { NumberForMatter } from "../../Ultils/functions";
import ButtonChat from "../../Component/Chat/ButtonChat";

const BuyOrder = () => {
  const navigate = useNavigate();

  const [listOrder, setListOrder] = useState([]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (token === null) {
      navigate("/login");
    } else {
      axios({
        method: "get",
        url: `${BASE_URL}/api/order/get-order-for-me`,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }).then((response) => {
        if (response.status === 200) {
          setListOrder(response.data.data);
        }
      });
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const payment = listOrder
    .filter((item) => item.paymentStatus === 1)
    .map((product) => product.order)
    .flat();
  const notPayment = listOrder
    .filter((item) => item.paymentStatus === 0)
    .map((product) => product.order)
    .flat();

  return (
    <div>
      <div>
        <NavBar />
      </div>
      <div style={{ paddingTop: "7rem" }}>
        <Card
          sx={{
            maxWidth: 1300,
            margin: "auto",
            maxHeight: 600,
            height: 400,
            overflowY: "auto",
          }}
          className="border"
        >
          {payment.length > 0 &&
            payment?.map((items) => (
              <>
                <div className="row ms-2 mt-2 mb-2" key={items._id}>
                  <div className="col-1 ">
                    <img
                      alt="image post"
                      src={items.UrlImage}
                      style={{ width: 60 }}
                    />
                  </div>

                  <div
                    style={{ fontSize: 15 }}
                    className="my-auto py-auto col-3 fw-bold"
                  >
                    {items.name}
                  </div>
                  {items.price < 300000 ? (
                    <div className="my-auto text-danger col-2">
                      Giá: {NumberForMatter(items.price + 15000)}.đ
                    </div>
                  ) : (
                    <div className="my-auto text-danger col-2">
                      Giá: {NumberForMatter(items.price)}.đ
                    </div>
                  )}
                  <div className="my-auto col-1">
                    <span className="text-danger">số lượng:</span>
                    {items.quantity}
                  </div>
                  <div className="my-auto col-1">
                    <span className="text-danger">Ngày Đặt: </span>
                    {moment(items.createdAt).format("DD/MM/YYYY, HH:mm:ss")}
                  </div>
                  <div className="my-auto col-2 text-center">
                    <span>
                      <Chip label="đã thanh toán" color="success" />
                    </span>
                  </div>
                  {items.statusCart === 0 ? (
                    <div className="my-auto text-center text-danger col-2 ">
                      <Chip label="Chờ xác nhận" color="warning" />
                    </div>
                  ) : items.statusCart === 2 ? (
                    <div className="my-auto text-center text-danger col-2 ">
                      <Chip label="Đã bị từ chối" color="error" />
                    </div>
                  ) : (
                    <div className="my-auto text-center text-danger col-2 ">
                      <Chip label="Đã được nhận" color="success" />
                    </div>
                  )}
                </div>
              </>
            ))}
          {notPayment.length > 0 ? (
            notPayment?.map((items) => (
              <>
                <div className="row ms-2 mt-2 mb-2" key={items._id}>
                  <div className="col-1 ">
                    <img
                      alt="image post"
                      src={items.UrlImage}
                      style={{ width: 60 }}
                    />
                  </div>

                  <div
                    style={{ fontSize: 15 }}
                    className="my-auto py-auto col-3 fw-bold"
                  >
                    {items.name}
                  </div>
                  {items.price < 300000 ? (
                    <div className="my-auto text-danger col-2">
                      Giá: {NumberForMatter(items.price + 15000)}.đ
                    </div>
                  ) : (
                    <div className="my-auto text-danger col-2">
                      Giá: {NumberForMatter(items.price)}.đ
                    </div>
                  )}
                  <div className="my-auto col-1">
                    <span className="text-danger">số lượng:</span>
                    {items.quantity}
                  </div>
                  <div className="my-auto col-1">
                    <span className="text-danger">Ngày Đặt: </span>
                    {moment(items.createdAt).format("DD/MM/YYYY, HH:mm:ss")}
                  </div>
                  <div className="my-auto col-2 text-center">
                    <span>
                      <Chip label="Chưa thanh toán" color="error" />
                    </span>
                  </div>
                  {items.statusCart === 0 ? (
                    <div className="my-auto text-center text-danger col-2 ">
                      <Chip label="Chờ xác nhận" color="warning" />
                    </div>
                  ) : items.statusCart === 2 ? (
                    <div className="my-auto text-center text-danger col-2 ">
                      <Chip label="Đã bị từ chối" color="error" />
                    </div>
                  ) : (
                    <div className="my-auto text-center text-danger col-2 ">
                      <Chip label="Đã được nhận" color="success" />
                    </div>
                  )}
                </div>
              </>
            ))
          ) : (
            <div className="text-center pt-4 fs-4">
              <p>Chưa có đơn hàng nào!</p>
            </div>
          )}
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
export default BuyOrder;
