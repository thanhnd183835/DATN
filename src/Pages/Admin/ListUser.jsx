import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { BASE_URL } from "../../Ultils/constant";
import axios from "axios";
import { Avatar, Button, Input } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { cancelSell, confirmSalePoint } from "../../Redux/user/user.slice";
import { useNavigate } from "react-router-dom";

const columns = [
  { id: "avatar", label: "Avatar", align: "center" },
  {
    id: "userName",
    label: "User Name",
    align: "center",
  },
  {
    id: "email",
    label: "Email",
    align: "center",
  },
  {
    id: "role",
    label: "Role",
    align: "center",
  },
  {
    id: "status",
    label: "Status",
    align: "center",
  },
  {
    id: "actions",
    label: "Actions",
    align: "center",
  },
];

function createData(user) {
  return {
    id: user._id,
    avatar: user.avatar,
    fullName: user.fullName,
    userName: user.userName,
    email: user.email,
    followers: user.followers?.length,
    following: user.following?.length,
    status: user.status === 0 ? "Active" : "Blocked",
    role:
      user.role === 0 ? "Người dùng" : user.role === 1 ? "Người bán" : "Admin",
  };
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
  textTitle: {
    marginLeft: "10px",
  },
  btnBlock: {
    background: "blue",

    color: "#fff",
    textTransform: "capitalize",
    fontWeight: "500",
    "&:hover": {
      background: "#e5e5e5",
      color: "red",
    },
  },

  btnActive: {
    background: "blue",
    padding: "10px 20px",
    color: "#fff",
    textTransform: "capitalize",
    fontSize: "16px",
    fontWeight: "500",
    "&:hover": {
      background: "#e5e5e5",
      color: "green",
    },
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
  },
  inputSearch: {
    marginRight: "40px",
    width: "20%",
  },
});

export default function ListUser() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [userList, setUserList] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch = useDispatch();
  const [inputSearch, setInputSearch] = useState("");
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);

  const [idUser, setIdUser] = React.useState("");
  const [idUser1, setIdUser1] = React.useState("");

  const userBlock = useSelector((state) => state?.user?.blockUser);
  const userUnBlock = useSelector((state) => state?.user?.unBlockUser);
  const navigate = useNavigate();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      axios({
        method: "get",
        url: `${BASE_URL}/api/users/get-all-user`,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }).then((response) => {
        if (response.status === 200) {
          const users = response.data.data.map((user) => createData(user));
          setUserList(users);
        }
      });
    }
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleClickOpen = (id) => {
    setIdUser(id);
    setOpen(true);
  };
  const handleClickOpen1 = (id) => {
    setIdUser1(id);
    setOpen1(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClose1 = () => {
    setOpen1(false);
  };
  const handleConfirm = () => {
    dispatch(confirmSalePoint(idUser));
    setOpen(false);
    fetchData();
  };
  const handleConfirm1 = () => {
    dispatch(cancelSell(idUser1));
    setOpen1(false);
    fetchData();
  };
  // const handleBlockUser = (id) => {
  //   if (window.confirm("Are you sure block this account?")) {
  //     dispatch(blockApi(id));
  //   }
  // };

  // const handleUnBlockUser = (id) => {
  //   if (window.confirm("Are you sure  Un block this account?")) {
  //     dispatch(unBlockApi(id));
  //   }
  // };

  const searchUser = (name) => {
    axios({
      method: "get",
      url: `${BASE_URL}/api/users/search?name=${name}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((response) => {
      // console.log(response);
      if (response.status === 200) {
        const users = response.data.data.map((user) => createData(user));
        setUserList(users);
      }
    });
  };

  const handleChangeInput = (e) => {
    setInputSearch(e.target.value);
    searchUser(e.target.value);
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, userBlock, userUnBlock]);

  return (
    <>
      <Paper className={classes.root}>
        <div className={classes.header}>
          <h2 className={classes.textTitle}>List user</h2>
          <Input
            placeholder="Search..."
            className={classes.inputSearch}
            value={inputSearch}
            onChange={handleChangeInput}
          />
        </div>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {userList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        if (column.id === "avatar") {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <Avatar
                                src={row.avatar}
                                style={{ marginRight: "10px" }}
                              />
                            </TableCell>
                          );
                        }

                        if (column.id === "actions") {
                          return (
                            <>
                              <TableCell key={column.id} align={column.align}>
                                {row.status === "Blocked" ? (
                                  <Button
                                    className={classes.btnActive}
                                    // onClick={() => {
                                    //   handleUnBlockUser(row.id);
                                    // }}
                                  >
                                    Unblock
                                  </Button>
                                ) : (
                                  <Button
                                    className={classes.btnBlock}
                                    // onClick={() => {
                                    //   handleBlockUser(row.id);
                                    // }}
                                    size="small"
                                  >
                                    Block
                                  </Button>
                                )}
                              </TableCell>
                              <TableCell key={column.id} align={column.align}>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  size="small"
                                  onClick={() => handleClickOpen(row.id)}
                                >
                                  xác nhận điểm bán
                                </Button>
                              </TableCell>

                              <TableCell key={column.id} align={column.align}>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  size="small"
                                  onClick={() => handleClickOpen1(row.id)}
                                >
                                  hủy điểm bán
                                </Button>
                              </TableCell>
                            </>
                          );
                        }
                        if (column.id === "role") {
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{
                                color:
                                  value === "Người bán"
                                    ? "#082aeb"
                                    : value === "Người dùng"
                                    ? "green"
                                    : "red",
                              }}
                            >
                              {value}
                            </TableCell>
                          );
                        }
                        if (column.id === "status") {
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{
                                color: value === "Blocked" ? "red" : "green",
                              }}
                            >
                              {value}
                            </TableCell>
                          );
                        }

                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={userList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className="ms-auto me-auto text-danger">
          Xác nhận điểm bán
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Bạn có đồng ý cho Tài khoản này thành tài khoản bán hàng hay không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="secondary">
            Từ chối
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open1}
        keepMounted
        onClose={handleClose1}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className="ms-auto me-auto text-danger">
          Xác nhận hủy điểm bán
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Bạn có đồng ý hủy tài khoản bán hàng này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose1} variant="contained" color="secondary">
            Từ chối
          </Button>
          <Button onClick={handleConfirm1} variant="contained" color="primary">
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
