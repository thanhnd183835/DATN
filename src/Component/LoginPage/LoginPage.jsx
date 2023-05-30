import React from "react";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import icon_google from "../../Assets/Images/icons/google.svg";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { useDispatch } from "react-redux";
import {
  signIn,
  signInFacebook,
  signInGoogle,
} from "../../Redux/auth/auth.slice";
import { useNavigate } from "react-router-dom";
import { showModalMessage } from "../../Redux/message/message.slice";
import FacebookLogin from "react-facebook-login";
import { useGoogleLogin } from "@react-oauth/google";
const LoginPage = () => {
  const [logined, setLogined] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    criteriaMode: "firstError",
    shouldFocusError: true,
    defaultValues: {},
  });

  const handleLogin = async (body) => {
    localStorage.clear();
    const res = await dispatch(signIn(body));
    if (res?.payload?.data?.code === 0) {
      await localStorage.setItem("token", res?.payload?.data?.token);
      navigate("/homePage");
    } else if (res.error.message === "Request failed with status code 404") {
      dispatch(
        showModalMessage({
          type: "ERROR",
          msg: "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại",
        })
      );
    }
  };
  const responseFacebook = async (response) => {
    console.log(response);
    const res = await dispatch(
      signInFacebook({
        access_token: response.accessToken,
      })
    );
    if (res) {
      navigate("/homePage");
    }
  };

  const loginGoogle = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
      const res = await dispatch(
        signInGoogle({
          access_token: codeResponse.access_token,
        })
      );
      if (res) {
        navigate("/register");
      }
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return (
    <div
      className="d-flex flex-column flex-grow-1 flex w-100"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dzjtdpc4h/image/upload/v1684258183/DATN/agrsdnhdaxfjnawqtxga.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <div className="d-flex flex-row h-100 w-100">
        <div className="d-flex d-lg-flex flex-lg-column flex-wrap w-100">
          <div className="d-flex flex-column justify-content-center pb-0 pb-lg-5 p-5 w-100">
            <img
              className="mx-auto mw-100 w-150px w-lg-300px mb-5 mb-lg-5"
              src="https://res.cloudinary.com/dzjtdpc4h/image/upload/v1684258216/DATN/jxsgkbhlugpg21kfnzqc.png"
              alt=""
              style={{
                width: "300px",
                height: "328px",
              }}
            />
            <p
              className="h1 me-5 ms-3 text-center"
              style={{
                fontFamily: "Algerian",
                fontStyle: "italic",
                color: "red",
              }}
            >
              <span
                style={{
                  color: "#5d85c7",
                }}
              >
                TH
              </span>
              <br />
              <span className="text-center ms-3">market</span>
            </p>
            <div className="text-gray-600 fs-base text-center fw-semibold">
              <a href="#" className="opacity-75-hover text-primary me-1">
                the blogger
              </a>
            </div>
          </div>
        </div>
        <div className="d-flex flex-lg-row justify-content-lg-end p-5 w-100">
          <div className="bg-body d-flex justify-content-center rounded-4 w-md-600px p-5">
            <div className="w-md-400px">
              <form
                className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
                onSubmit={handleSubmit(handleLogin)}
              >
                <div className="text-center mb-5">
                  <h1 className="text-dark fw-bolder mb-3">Đăng Nhập</h1>
                  <div className="text-gray-500 fw-semibold fs-6 mb-3">
                    Đăng Nhập Bằng
                  </div>
                  <div className="d-xxl-flex d-xl-inline-flex d-lg-flex gap-2 ">
                    <div className="d-xxl-flex d-xl-inline-flex d-lg-flex mb-xxl-0 mb-xl-0 mb-lg-0 mb-sm-2">
                      <button
                        onClick={() => loginGoogle()}
                        style={{
                          borderColor: "#2c79e8",
                          borderRadius: "30px",
                          color: "#000000",
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={icon_google}
                          alt="logo_google"
                          style={{
                            width: "18px",
                            height: "18px",
                            textAlign: "center",
                            marginRight: "10px",
                          }}
                        />
                        Đăng nhập bằng Google
                      </button>
                    </div>
                    <div className="">
                      <FacebookLogin
                        appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID}
                        autoLoad={false}
                        fields="name,email,picture"
                        scope="public_profile"
                        callback={responseFacebook}
                        icon="fa-facebook"
                        size="small"
                        textButton="Đăng nhập bằng Facebook"
                        buttonStyle={{
                          fontSize: "14px",
                          background: "#2c79e8",
                          border: "none",
                          borderRadius: "30px",
                          color: "#ffffff",
                          fontWeight: "500",
                          textTransform: "none",
                          display: "inline",
                        }}
                      />
                    </div>
                  </div>
                  <div className="separator separator-content my-3 d-flex justify-content-center">
                    <hr className="w-25" />
                    <span className="text-gray-500 fw-semibold fs-7">
                      Hoặc với email
                    </span>
                    <hr className="w-25" />
                  </div>
                  <div className="fv-row mb-4 fv-plugins-icon-container">
                    <Controller
                      name="email"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="email"
                          label="Email"
                          variant="outlined"
                          size="small"
                          className="form-control bg-transparent"
                          type="email"
                        />
                      )}
                      control={control}
                    />
                  </div>
                  <div className="fv-row mb-4 fv-plugins-icon-container">
                    <Controller
                      name="password"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="password"
                          label="Password"
                          variant="outlined"
                          size="small"
                          className="form-control bg-transparent"
                          type="password"
                        />
                      )}
                      control={control}
                    />
                  </div>
                  <div className="d-flex flex-row-reverse flex-wrap fs-base fw-semibold mb-3">
                    {/*<div></div>*/}
                    <a href="" className="link-primary float-end">
                      Quên Mật Khẩu ?
                    </a>
                  </div>
                  <div className="d-grid mb-3">
                    <button
                      type="submit"
                      id="kt_sign_in_submit"
                      className="btn btn-primary"
                    >
                      <span className="indicator-label">ĐĂNG NHẬP</span>
                    </button>
                  </div>
                  <div className="text-gray-500 text-center fw-semibold fs-6">
                    Chưa có tài khoản? {""}
                    <a href="/register" className="link-primary">
                      Đăng Ký
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
