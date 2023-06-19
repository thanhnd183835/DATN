import React from "react";
import "./FillTerContent.css";
import Card from "@mui/material/Card";
const FillTerContent = () => {
  return (
    <Card className="mt-3">
      <ul className="nav row justify-content-center g-xxl-1 g-1 mb-3 ">
        <li
          className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-4 col-6 text-center"
          key="HaiSan"
        >
          <a
            className="btn pt-2 border border-info border-2"
            style={{
              width: "100px",
              height: "100px",
            }}
            href="HaiSan"
          >
            <div className="nav-icon mb-3">
              <img
                src="https://res.cloudinary.com/dzjtdpc4h/image/upload/t_media_lib_thumb/v1685499550/DATN/hai-san-1_qeejsq.webp"
                alt="hai san"
                style={{
                  width: "80px",
                }}
              />
            </div>
            <div>
              <span
                className="text-gray fw-bold d-block "
                style={{ fontSize: 12 }}
              >
                Hải Sản
              </span>
            </div>
          </a>
        </li>
        <li
          className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-4 col-6  text-center"
          key="RauCu"
        >
          <a
            className="btn pt-2 border border-info border-2"
            style={{
              width: "100px",
              height: "100px",
            }}
            href="RauCu"
          >
            <div className="nav-icon mb-2">
              <img
                src="https://res.cloudinary.com/dzjtdpc4h/image/upload/t_media_lib_thumb/v1685463104/DATN/hinh-anh-mot-so-loai-rau_uo8bvn.png"
                alt="rau-cu"
                style={{
                  width: "80px",
                }}
              />
            </div>
            <div>
              <span
                className="text-gray fw-bold d-block"
                style={{ fontSize: 12 }}
              >
                Rau Củ
              </span>
            </div>
          </a>
        </li>
        <li
          className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-4 col-6  text-center"
          key="Hoa Qua"
        >
          <a
            className="btn pt-2 border border-info border-2"
            style={{
              width: "100px",
              height: "100px",
            }}
            href="HoaQua"
          >
            <div className="nav-icon mb-3">
              <img
                src="https://res.cloudinary.com/dzjtdpc4h/image/upload/t_media_lib_thumb/v1685463103/DATN/cac-loai-trai-cay_okl0kw.jpg"
                alt="hoa-qua"
                style={{
                  width: "80px",
                }}
              />
            </div>
            <div>
              <span
                className="text-gray fw-bold d-block"
                style={{ fontSize: 12 }}
              >
                Hoa Quả
              </span>
            </div>
          </a>
        </li>
        <li
          className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-4 col-6  text-center"
          key="BanhKeo"
        >
          <a
            className="btn pt-2 border border-info border-2"
            style={{
              width: "100px",
              height: "100px",
            }}
            href="BanhKeo"
          >
            <div className="nav-icon mb-3">
              <img
                src="https://res.cloudinary.com/dzjtdpc4h/image/upload/t_media_lib_thumb/v1685463104/DATN/foody-upload_quyqao.jpg"
                alt="banh-keo"
                style={{
                  width: "80px",
                }}
              />
            </div>
            <div>
              <span
                className="text-gray fw-bold d-block"
                style={{ fontSize: 12 }}
              >
                Bánh Kẹo
              </span>
            </div>
          </a>
        </li>
        <li
          className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-4 col-6  text-center"
          key="DoGiaDung"
        >
          <a
            className="btn pt-2 border border-info border-2"
            style={{
              width: "100px",
              height: "100px",
            }}
            href="DoGiaDung"
          >
            <div className="nav-icon mb-3">
              <img
                src="https://res.cloudinary.com/dzjtdpc4h/image/upload/t_media_lib_thumb/v1685499523/DATN/do-gia-dung_ihtzld.webp"
                alt="do-gia-dung"
                style={{
                  width: "80px",
                }}
              />
            </div>
            <div>
              <span
                className="text-gray fw-bold d-block"
                style={{ fontSize: 12 }}
              >
                Đồ Gia Dụng
              </span>
            </div>
          </a>
        </li>
        <li
          className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-4 col-6  text-center"
          key="DoDienTu"
        >
          <a
            className="btn pt-2 border border-info border-2"
            style={{
              width: "100px",
              height: "100px",
            }}
            href="DoDienTu"
          >
            <div className="nav-icon mb-4">
              <img
                src="https://res.cloudinary.com/dzjtdpc4h/image/upload/t_media_lib_thumb/v1685503365/DATN/do-dien-gia-dung-1_kswn23.webp"
                alt="do-dien-tu"
                style={{
                  width: "80px",
                }}
              />
            </div>
            <div>
              <span
                className="text-gray fw-bold d-block"
                style={{ fontSize: 12 }}
              >
                Đồ Điện Tử
              </span>
            </div>
          </a>
        </li>
      </ul>
    </Card>
  );
};
export default FillTerContent;
