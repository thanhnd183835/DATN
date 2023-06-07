import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
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
import { logout } from "../../Redux/auth/auth.slice";
import PersonIcon from "@mui/icons-material/Person";

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

const NavBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const infoUser = useSelector((state) => state?.auth?.user?.data?.data);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
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

  const menuId = "primary-search-account-menu";
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

  const mobileMenuId = "primary-search-account-menu-mobile";
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
      <MenuItem onClick={handleCreatePost}>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <AddBoxIcon color="warning" />
        </IconButton>
        <p className="mt-3">Thêm Sản Phẩm</p>
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
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon color="success" />
          </Badge>
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
          <Avatar alt="anh dai dien" src={`${infoUser.avatar}`} />
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
              aria-label="show 17 new notifications"
              color="inherit"
              className="me-xxl-3 me-lg-3 me-md-2 me-sm-2"
            >
              <Badge badgeContent={17} color="error">
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
                src={`${infoUser.avatar}`}
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
    </Box>
  );
};
export default NavBar;
