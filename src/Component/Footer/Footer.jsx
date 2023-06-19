import * as React from "react";
import { useNavigate } from "react-router-dom";
const services = [
  {
    title: "Giới thiệu về THMarket",
  },
  {
    title: "Danh sách cửa hàng",
  },
  {
    title: "Quản lý chất lượng",
  },
  {
    title: "Chính sách bảo mật và chia sẻ thông tin",
  },
  {
    title: "Điều khoản và điều kiện giao dịch",
  },
];
const about = [
  { id: 1, title: "Về chúng tôi" },
  { id: 4, title: "Blog" },
];
const Footer = () => {
  const navigate = useNavigate();
  const handleClick = (item) => {
    navigate(item.path);
  };
  return (
    <div
      className="py-4  relative "
      style={{
        backgroundColor: "#8b8b8b",
      }}
    >
      <div className="px-5 text-white">
        <div className="row">
          <div className="col-4 ">
            <p className="ms-auto me-auto text-uppercase text-warning">
              Về chúng tôi
            </p>
            <ul className="list-unstyled">
              {services.map((item) => (
                <li
                  key={item.id}
                  className={"mb-4 cursor-pointer text-backgroundGray"}
                  onClick={() => handleClick(item)}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-4 px-5">
            <p className="text-uppercase text-warning">Về THMarket</p>
            <ul className="list-unstyled">
              {about.map((item) => (
                <li
                  className={"mb-4 cursor-pointer text-backgroundGray"}
                  key={item.id}
                  onClick={() => handleClick(item)}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-4 px-5 float-end">
            <div>
              <p className="text-uppercase text-warning">
                Theo dõi chúng tôi trên
              </p>
              <ul className="list-unstyled d-flex gap-3">
                <li key="facebook">
                  <img
                    src="https://res.cloudinary.com/dzjtdpc4h/image/upload/v1686125966/DATN/facebook_z8ahon.svg"
                    width={32}
                    height={32}
                    alt={"facebook-icon"}
                  />
                </li>
                <li className={"cursor-pointer"} key="youtube">
                  <img
                    src="https://res.cloudinary.com/dzjtdpc4h/image/upload/v1686125986/DATN/youtube_s6eh4r.svg"
                    width={32}
                    height={32}
                    alt={"youtube-icon"}
                  />
                </li>
                <li className={"cursor-pointer"} key="instagram">
                  <img
                    src="https://res.cloudinary.com/dzjtdpc4h/image/upload/v1686125985/DATN/instagram_xqjzf9.svg"
                    width={32}
                    height={32}
                    alt={"instagram-icon"}
                  />
                </li>
                <li className={"cursor-pointer"} key="twitter">
                  <img
                    src="https://res.cloudinary.com/dzjtdpc4h/image/upload/v1686125985/DATN/twitter_e7nzj0.svg"
                    width={32}
                    height={32}
                    alt={"twitter-icon"}
                  />
                </li>
              </ul>
              <p>Email:ducthanhbk1998@gmail.com.</p>
              <p>Điện thoại: 0335155111.</p>
            </div>
          </div>
        </div>

        <div className="my-8">
          <p className="text-justify leading-8 text-center">
            THMarket là một website chuyên cung cấp các sản phẩm đa dạng và chất
            lượng cho khu dân cư. Với sự đa dạng về mặt hàng từ thực phẩm, đồ
            gia dụng đến thiết bị điện tử..., THMarket mang đến cho khách hàng
            sự tiện lợi và lựa chọn phong phú. Với chất lượng phục vụ tận tâm và
            dịch vụ giao hàng nhanh chóng, THMarket đã trở thành địa chỉ tin cậy
            của nhiều gia đình trong khu vực.
          </p>
        </div>
        <hr className="text-primary" style={{ borderWidth: "5px" }} />
        <div className="text-center ">
          <span>
            Bản quyền © 2023{" "}
            <span className="font-bold text-primary uppercase">THMarket</span>
          </span>
        </div>
      </div>
    </div>
  );
};
export default Footer;
