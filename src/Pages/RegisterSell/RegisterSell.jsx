import * as React from "react";
import NavBar from "../../Component/NavBar/Navbar";
import ButtonChat from "../../Component/Chat/ButtonChat";
import Footer from "../../Component/Footer/Footer";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import { useForm, Controller } from "react-hook-form";
import CardActions from "@mui/material/CardActions";
import { useDispatch } from "react-redux";
import { sendEmail } from "../../Redux/user/user.slice";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
const RegisterSell = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const preFilledData = `
  Tên Shop: 
  Địa chỉ: 
  Số điện thoại: 
  Mặt hàng kinh doanh: `;
  const { handleSubmit, control, setValue } = useForm({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    criteriaMode: "firstError",
    shouldFocusError: true,
    defaultValues: {},
  });
  const handleRegisterSell = (data) => {
    const res = dispatch(sendEmail(data));
    if (res) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 2000);
    }
  };
  return (
    <>
      <div>
        <NavBar />
      </div>
      <div style={{ paddingTop: "6rem" }}>
        <Card className="mt-5 w-75 ms-auto me-auto border border-2">
          <CardContent>
            <Typography className="mb-3 fs-4 fw-bold">
              Đăng ký làm đại lý Bán Hàng
            </Typography>
          </CardContent>
          <form onSubmit={handleSubmit(handleRegisterSell)}>
            <div>
              <div className="ms-5 me-5">
                <Controller
                  name="email"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      id="email"
                      label="Tên email"
                      variant="outlined"
                      size="small"
                      className="form-control bg-transparent"
                      type="text"
                    />
                  )}
                  control={control}
                />
              </div>
              <div className="ms-5 me-5 mt-4">
                <Controller
                  name="content"
                  render={({ field }) => (
                    <>
                      <TextareaAutosize
                        required
                        {...field}
                        id="content"
                        variant="outlined"
                        size="small"
                        className="form-control bg-transparent"
                        type="text"
                        defaultValue={preFilledData}
                      />
                    </>
                  )}
                  control={control}
                />
              </div>
            </div>
            <div>
              <CardActions className="float-end w-25">
                <button
                  type="submit"
                  className="btn mt-3 py-1 px-2 ms-5"
                  style={{ backgroundColor: "#fd7e14" }}
                >
                  <span
                    className="indicator-label d-flex flex-row "
                    style={{ fontFamily: "Arial", color: "#fff" }}
                  >
                    <span className=" text-uppercase" style={{ fontSize: 14 }}>
                      Gửi đơn đăng ký
                    </span>
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
      <Modal
        open={open}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {},
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="title" className="text-center">
              <CheckCircleIcon color="success" style={{ fontSize: "80px" }} />
            </Typography>
            <Typography id="description" className="text-center" sx={{ mt: 2 }}>
              Đã gửi đơn đăng ký thành công
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};
export default RegisterSell;
