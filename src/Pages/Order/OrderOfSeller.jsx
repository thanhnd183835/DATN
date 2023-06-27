import * as React from "react";
import { useState, useEffect } from "react";
import NavBar from "../../Component/NavBar/Navbar";
import Footer from "../../Component/Footer/Footer";
import { useNavigate } from "react-router-dom";
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

const OrderOfSeller = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [listOrder, setListOrder] = useState([]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      axios({
        method: "get",
        url: `${BASE_URL}/api/order/get-order-placed`,
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
  const handleConFirm = async (data) => {
    const body = {
      idItemCart: data._id,
      idOrder: data.orderId,
    };
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      const res = await dispatch(agreeItemOrder(body));
      if (res.payload.status === 200) {
        fetchData();
      }
    }
  };
  const handleRefuse = async (data) => {
    const body = {
      idItemCart: data._id,
      idOrder: data.orderId,
    };
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      const res = await dispatch(refuseItemOrder(body));
      if (res.payload.status === 200) {
        fetchData();
      }
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
          {listOrder.length > 0 ? (
            listOrder?.map((items) => (
              <>
                <div className="row ms-2 mt-2 mb-2 " key={items._id}>
                  <div className="btn col-1">
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
                  <div className="my-auto col-2">
                    <span className="text-danger">Ngày Đặt: </span>
                    {moment(items.createdAt).format("DD/MM/YYYY, hh:mm:ss A")}
                  </div>
                  {items.statusCart === 0 ? (
                    <div className="my-auto mx-auto text-danger col-1 px-0">
                      <Chip
                        label="Xác Nhận"
                        color="error"
                        variant="outlined"
                        onClick={() => handleConFirm(items)}
                      />
                    </div>
                  ) : items.statusCart === 2 ? (
                    <div className="my-auto mx-auto text-danger col-1 px-0">
                      <Chip label="Đã Từ chối" color="error" />
                    </div>
                  ) : (
                    <div className="my-auto mx-auto text-danger col-1 px-0">
                      <Chip label="Đã Nhận" color="success" />
                    </div>
                  )}
                  <div className="my-auto mx-auto text-danger col-1 px-0">
                    <Chip
                      variant="outlined"
                      color="error"
                      onClick={() => handleRefuse(items)}
                      label="Từ Chối"
                    />
                  </div>
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
export default OrderOfSeller;
