import React from "react";
import "./FillTerContent.css";
import Card from "@mui/material/Card";
const FillTerContent = () => {
  return (
    <Card className="mt-3">
      <ul className="nav row justify-content-center g-xxl-1 g-1 mb-3 ">
        <li className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-4 col-6 text-center">
          <a
            className="btn pt-4 border border-info border-2"
            style={{
              width: "138px",
              height: "140px",
            }}
            href="#"
          >
            <div className="nav-icon mb-3">
              <img
                src="https://res.cloudinary.com/dzjtdpc4h/image/upload/t_media_lib_thumb/v1685499550/DATN/hai-san-1_qeejsq.webp"
                alt="hai san"
                style={{
                  width: "100px",
                }}
              />
            </div>
            <div>
              <span className="text-gray fw-bold fs-6 d-block ">Hải Sản</span>
            </div>
          </a>
        </li>
        <li className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-4 col-6  text-center">
          <a
            className="btn pt-4 border border-info border-2"
            style={{
              width: "138px",
              height: "140px",
            }}
            href="#"
          >
            <div className="nav-icon mb-2">
              <img
                src="https://res.cloudinary.com/dzjtdpc4h/image/upload/t_media_lib_thumb/v1685463104/DATN/hinh-anh-mot-so-loai-rau_uo8bvn.png"
                alt="rau-cu"
                style={{
                  width: "100px",
                }}
              />
            </div>
            <div>
              <span className="text-gray fw-bold fs-6 d-block">Rau Củ</span>
            </div>
          </a>
        </li>
        <li className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-4 col-6  text-center">
          <a
            className="btn pt-4 border border-info border-2"
            style={{
              width: "138px",
              height: "140px",
            }}
            href="#"
          >
            <div className="nav-icon mb-3">
              <img
                src="https://res.cloudinary.com/dzjtdpc4h/image/upload/t_media_lib_thumb/v1685463103/DATN/cac-loai-trai-cay_okl0kw.jpg"
                alt="hoa-qua"
                style={{
                  width: "100px",
                }}
              />
            </div>
            <div>
              <span className="text-gray fw-bold fs-6 d-block">Hoa Quả</span>
            </div>
          </a>
        </li>
        <li className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-4 col-6  text-center">
          <a
            className="btn pt-4 border border-info border-2"
            style={{
              width: "138px",
              height: "140px",
            }}
            href="#"
          >
            <div className="nav-icon mb-3">
              <img
                src="https://res.cloudinary.com/dzjtdpc4h/image/upload/t_media_lib_thumb/v1685463104/DATN/foody-upload_quyqao.jpg"
                alt="banh-keo"
                style={{
                  width: "100px",
                }}
              />
            </div>
            <div>
              <span className="text-gray fw-bold fs-6 d-block">Bánh Kẹo</span>
            </div>
          </a>
        </li>
        <li className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-4 col-6  text-center">
          <a
            className="btn pt-4 border border-info border-2"
            style={{
              width: "138px",
              height: "140px",
            }}
            href="#"
          >
            <div className="nav-icon mb-3">
              <img
                src="https://res.cloudinary.com/dzjtdpc4h/image/upload/t_media_lib_thumb/v1685499523/DATN/do-gia-dung_ihtzld.webp"
                alt="do-gia-dung"
                style={{
                  width: "100px",
                }}
              />
            </div>
            <div>
              <span className="text-gray fw-bold fs-6 d-block">
                Đồ Gia Dụng
              </span>
            </div>
          </a>
        </li>
        <li className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-4 col-6  text-center">
          <a
            className="btn pt-4 border border-info border-2"
            style={{
              width: "138px",
              height: "140px",
            }}
            href="#"
          >
            <div className="nav-icon mb-4">
              <img
                src="https://res.cloudinary.com/dzjtdpc4h/image/upload/t_media_lib_thumb/v1685503365/DATN/do-dien-gia-dung-1_kswn23.webp"
                alt="do-dien-tu"
                style={{
                  width: "100px",
                }}
              />
            </div>
            <div>
              <span className="text-gray fw-bold fs-6 d-block">Đồ Điện Tử</span>
            </div>
          </a>
        </li>
      </ul>
    </Card>
  );
};
export default FillTerContent;
