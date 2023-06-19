import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Avatar from "@mui/material/Avatar";
import { useSelector, useDispatch } from "react-redux";
import LockIcon from "@mui/icons-material/Lock";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { getMe, logout } from "../../Redux/auth/auth.slice";
import PersonIcon from "@mui/icons-material/Person";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import axios from "axios";
import { BASE_URL } from "../../Ultils/constant";
import { makeStyles } from "@material-ui/core/styles";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "15px",
  backgroundColor: "#fff",
  "&:hover": {
    backgroundColor: "#e9ecef",
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderTopLeftRadius: "15px",
  borderBottomLeftRadius: "15px",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "75ch",
    },
  },
}));
const useStyles = makeStyles((theme) => ({
  root: {
    whiteSpace: "unset",
    wordBreak: "break-all",
  },
}));
const NavBar = () => {
  const classes = useStyles();
  const infoUser = useSelector((state) => state?.auth?.user?.data?.data);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const socket = useSelector((state) => state.socket.socket.payload);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openCart, setOpenCart] = useState(null);
  const [openNoti, setOpenNoti] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [hasNewNoti, setHasNewNoti] = useState(false);
  const isMenuOpen = Boolean(anchorEl);
  const isCartOpen = Boolean(openCart);
  const isNotiOpen = Boolean(openNoti);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [listCart, setListCart] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleOpenCart = (event) => {
    setOpenCart(event.currentTarget);
    fetchData();
  };
  const handleOpenNoti = (event) => {
    setOpenNoti(event.currentTarget);
  };
  const handleCloseCart = () => {
    setOpenCart(null);
  };
  const handleCloseNoti = () => {
    setOpenNoti(null);
  };
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const handleGoToProfile = () => {
    navigate("/profile");
  };
  const handleCreatePost = () => {
    navigate("/createPost");
  };
  const handleLogOut = () => {
    dispatch(logout());
    localStorage.removeItem("persist:root");
    localStorage.removeItem("token");

    navigate("/login");
  };
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const showNumberNotification = () => {
    return notifications?.filter((item) => {
      return item.statusNotification === "not seen";
    }).length;
  };
  const showNumberCart = () => {
    return listCart.length;
  };
  useEffect(() => {
    socket?.on("getNoti", async (data) => {
      if (infoUser?.userName === data?.userNameCreatePost) {
        await fetchNotification();
      }
    });
    socket?.on("getNoti", async (data) => {
      if (infoUser?.userName === data?.userAddCart) {
        await fetchData();
      }
    });
  }, [socket]);

  useEffect(() => {
    if (showNumberNotification() > 0) {
      setHasNewNoti(true);
    }
  }, [notifications]);
  const fetchNotification = async () => {
    axios({
      method: "get",
      url: `${BASE_URL}/api/notification/get-all`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((response) => {
      if (response.status === 200) {
        setNotifications(response.data.data);
      }
    });
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
    fetchNotification();
    fetchData();
  }, []);

  const menuId = "primary-search-account-menu";
  const cartId = "Cart ID";
  const notiId = "Notifications ID";
  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleGoToProfile}>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <PersonIcon color="success" />
        </IconButton>
        <p className="mt-3">Thông tin tài khoản</p>
      </MenuItem>
      <MenuItem onClick={handleLogOut}>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <LockIcon color="error" />
        </IconButton>
        <p className="mt-3">Đăng xuất </p>
      </MenuItem>
    </Menu>
  );
  const OpenMenuCart = (
    <div>
      <Menu
        anchorEl={openCart}
        id={cartId}
        open={isCartOpen}
        onClose={handleCloseCart}
        PaperProps={{
          elevation: 0,
          sx: {
            width: 500,
            height: 450,
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 230,
              width: 20,
              height: 20,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
      >
        {listCart
          .slice(-5)
          .reverse()
          ?.map((item) => (
            <div key={item._id}>
              <MenuItem onClick={() => navigate("/cart-detail")}>
                <div className="d-flex">
                  <div>
                    <img src={item.UrlImage} style={{ width: 60 }} />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 15,
                        width: 320,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginLeft: 10,
                      }}
                    >
                      {item.name}
                    </p>
                  </div>
                  <div>
                    <p className="ms-2 text-danger">{item.price}</p>
                  </div>
                </div>
              </MenuItem>
            </div>
          ))}
        {listCart.length <= 5 ? (
          <div className="py-0"></div>
        ) : (
          <div>
            <div style={{ marginTop: 20, marginLeft: 20 }}>
              <p className="text-danger">
                còn {listCart.length - 5} sản phẩm trong giỏ hàng
              </p>
            </div>
            <div className="py-0">
              <Button
                variant="contained"
                size="small"
                color="warning"
                className="float-end me-4 "
                style={{ marginTop: -40 }}
                onClick={() => navigate("/cart-detail")}
              >
                Xem giỏ Hàng
              </Button>
            </div>
          </div>
        )}
      </Menu>
    </div>
  );
  const renderNotifications = (
    <Menu
      anchorEl={openNoti}
      id={notiId}
      open={isNotiOpen}
      onClose={handleCloseNoti}
      PaperProps={{
        elevation: 0,
        sx: {
          width: 360,
          height: 450,
          overflow: "scroll",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 0,
        },
      }}
    >
      {notifications?.length ? (
        notifications.reverse()?.map((item) => (
          <div key={item._id}>
            <MenuItem
              onClick={() =>
                navigate(`post/${item?.post?._id}`, {
                  state: {
                    postId: item?.post?._id,
                    liked: item.liked,
                    numberLikes: item.likes,
                  },
                })
              }
              sx={[{ "&:hover": { backgroundColor: "#dee2e6" } }]}
              className="px-1"
            >
              <div className="d-flex align-items-center">
                <div>
                  <Avatar
                    src={item?.otherUser?.avatar}
                    style={{ width: 40, height: 40 }}
                  />
                </div>

                <div
                  className="d-flex align-items-center ms-2"
                  style={{ height: 50 }}
                >
                  <div>
                    <p
                      className="fw-bold mb-0"
                      style={{ fontFamily: "revert-layer" }}
                    >
                      {item?.otherUser?.userName}
                    </p>
                  </div>
                  <div className="mt-1">
                    <p
                      classes={{ root: classes.root }}
                      style={{
                        fontFamily: "revert-layer",
                        fontSize: 14,
                      }}
                      className="mb-0 ms-2"
                    >
                      {item.content}
                    </p>
                  </div>
                </div>
              </div>
            </MenuItem>
          </div>
        ))
      ) : (
        <div>
          <p style={{ textAlign: "center", fontWeight: "600" }}>
            No notification
          </p>
        </div>
      )}
    </Menu>
  );
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {infoUser.role === 1 && (
        <MenuItem onClick={handleCreatePost}>
          <IconButton
            size="large"
            aria-label="show 4 new mails"
            color="inherit"
          >
            <AddBoxIcon color="warning" />
          </IconButton>
          <p className="mt-3">Thêm Sản Phẩm</p>
        </MenuItem>
      )}
      <MenuItem onClick={() => navigate("/cart-detail")}>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <LocalGroceryStoreIcon color="primary" />
          </Badge>
        </IconButton>
        <p className="mt-3">Giỏ hàng</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon color="primary" />
          </Badge>
        </IconButton>
        <p className="mt-3">Tin Nhắn</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show new notifications"
          color="inherit"
        >
          {hasNewNoti && (
            <Badge badgeContent={showNumberNotification()} color="error">
              <NotificationsIcon color="success" />
            </Badge>
          )}
        </IconButton>
        <p className="mt-3">Thông Báo</p>
      </MenuItem>
      <MenuItem onClick={handleGoToProfile}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar alt="anh dai dien" src={`${infoUser?.avatar}`} />
        </IconButton>
        <p className="mt-3">Thông tin tài khoản</p>
      </MenuItem>
      <MenuItem onClick={handleLogOut}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <LockIcon color="error" />
        </IconButton>
        <p className="mt-3">Đăng Xuất</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          style={{ height: "6rem", backgroundColor: "#ffba00" }}
        >
          <Toolbar>
            <p
              className=" me-5 ms-3 text-center btn "
              style={{
                fontFamily: "Algerian",
                fontStyle: "italic",
                color: "red",
                border: "none",
              }}
              onClick={() => {
                navigate("/");
              }}
            >
              <span
                style={{
                  color: "#5d85c7",
                }}
                className="h2"
              >
                TH
              </span>
              <br />
              <span className="h2 text-center ms-3">market</span>
            </p>
            <Search className="ms-xxl-5 ms-xl-5 ms-md-3 ms-sm-2 w-50">
              <SearchIconWrapper style={{ backgroundColor: "#fd7e14" }}>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                className="ms-3"
                placeholder="Tìm kiếm…"
                inputProps={{ "aria-label": "search" }}
                style={{ color: "#212529" }}
              />
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {infoUser.role === 1 && (
                <Button
                  className="mt-2 me-3 "
                  variant="contained"
                  style={{ height: "30px" }}
                  size="small"
                  startIcon={<AddBoxIcon />}
                  color="warning"
                  onClick={() => {
                    navigate("/createPost");
                  }}
                >
                  Thêm Sản Phẩm
                </Button>
              )}
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
                className="me-xxl-3 me-lg-3 me-md-2 me-sm-2"
                onClick={handleOpenCart}
              >
                <Badge badgeContent={showNumberCart()} color="error">
                  <LocalGroceryStoreIcon color="primary" fontSize="medium" />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
                className="me-xxl-3 me-lg-3 me-md-2 me-sm-2"
              >
                <Badge badgeContent={4} color="error">
                  <MailIcon color="primary" fontSize="medium" />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show  new notifications"
                color="inherit"
                className="me-xxl-3 me-lg-3 me-md-2 me-sm-2"
                onClick={handleOpenNoti}
              >
                <Badge badgeContent={showNumberNotification()} color="error">
                  <NotificationsIcon color="success" fontSize="medium" />
                </Badge>
              </IconButton>
              <IconButton
                size="small"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar
                  alt="anh dai dien"
                  src={`${infoUser?.avatar}`}
                  sx={{
                    width: 40,
                    height: 40,
                  }}
                />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
        {OpenMenuCart}
        {renderNotifications}
      </Box>
    </>
  );
};
export default NavBar;
