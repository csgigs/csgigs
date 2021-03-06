import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import withMobileDialog from "@material-ui/core/withMobileDialog";

// @material-ui/icons
import Close from "@material-ui/icons/Close";
import Success from "@material-ui/icons/CheckCircle";

// core components
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import CustomInput from "components/Gigs/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button";
import { add } from "components/Gigs/API/Tasks";

// dependencies
import Loader from "react-loader-spinner";

// style sheets
import notificationsStyle from "assets/jss/material-dashboard-pro-react/views/notificationsStyle.jsx";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class AddTask extends React.Component {
  state = {
    taskName: "",
    taskDescription: "",
    taskNameState: "",
    taskCategory: "",
    taskCategoryState: "",
    status: "working"
  };

  componentWillReceiveProps() {
    this.setState({
      taskName: "",
      taskDescription: "",
      taskNameState: "",
      taskCategory: "",
      taskCategoryState: "",
      status: "working"
    });
  }

  onChangeTaskCategory = event => {
    const category = event.target.value;
    this.setState({
      taskCategory: category,
      taskCategoryState: category ? "success" : "error"
    });
  };

  onChangeTaskDescription = event => {
    this.setState({
      taskDescription: event.target.value
    });
  };

  onChangeTaskName = event => {
    const name = event.target.value;
    this.setState({
      taskName: name,
      taskNameState: name ? "success" : "error"
    });
  };

  isValidated() {
    const { taskNameState, taskCategoryState } = this.state;
    if (taskNameState === "success" && taskCategoryState === "success") {
      return true;
    } else {
      if (taskNameState !== "success") {
        this.setState({ taskNameState: "error" });
      }
      if (taskCategoryState !== "success") {
        this.setState({ taskCategoryState: "error" });
      }
    }
    return false;
  }

  setStatusState = status => {
    this.setState({
      status: status
    });
  };

  confirmTaskAdd = () => {
    const { gigRoomId, gigId } = this.props;
    const { status } = this.state;
    if (status !== "success") {
      if (this.isValidated()) {
        add(gigRoomId, gigId, this.state, this.setStatusState);
      }
    }
  };

  closeModal = () => {
    const { hideTask } = this.props;
    hideTask("addTask");
  };

  render() {
    const { classes, modalOpen, fullScreen } = this.props;
    const {
      taskName,
      taskDescription,
      taskCategory,
      taskNameState,
      taskCategoryState,
      status
    } = this.state;

    return (
      <Dialog
        open={modalOpen}
        fullScreen={fullScreen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => {
          if (status !== "loading") {
            this.closeModal();
          }
        }}
        aria-labelledby="classic-modal-slide-title"
        aria-describedby="classic-modal-slide-description"
        maxWidth="xs"
      >
        <DialogTitle id="classic-modal-slide-title" disableTypography>
          <GridContainer className={classes.modalHeader}>
            <GridItem
              xs={6}
              sm={6}
              md={6}
              lg={6}
              style={{ textAlign: "left", paddingLeft: 3 }}
            >
              <h4 className={classes.modalTitle} style={{ fontWeight: "bold" }}>
                Add New Task
              </h4>
            </GridItem>
            <GridItem xs={6} sm={6} md={6} lg={6} style={{ paddingRight: 0 }}>
              <Button
                justIcon
                className={classes.modalCloseButton}
                key="close"
                aria-label="Close"
                color="transparent"
                onClick={() => {
                  if (status !== "loading") {
                    this.closeModal();
                  }
                }}
              >
                <Close className={classes.modalClose} />
              </Button>
            </GridItem>
          </GridContainer>
        </DialogTitle>
        <DialogContent
          id="classic-modal-slide-description"
          className={classes.modalBody}
          style={{ paddingBottom: 35, paddingTop: 0 }}
        >
          <GridContainer justify="center">
            <GridItem xs={10} sm={10} md={10} lg={10}>
              <p
                style={{
                  textAlign: "justify",
                  paddingBottom: 9,
                  borderBottom: "1px solid grey",
                  fontSize: 13
                }}
              >
                Create your task here
              </p>
            </GridItem>

            {status === "loading" ? (
              <GridItem
                xs={10}
                sm={10}
                md={10}
                lg={10}
                style={{ textAlign: "center" }}
              >
                <div style={{ paddingTop: 25 }}>
                  <Loader
                    type="ThreeDots"
                    color="black"
                    height="100"
                    width="100"
                  />
                </div>
              </GridItem>
            ) : null}
            {status === "working" && (
              <React.Fragment>
                <GridItem xs={10} sm={10} md={10} lg={10}>
                  <CustomInput
                    success={taskNameState === "success"}
                    error={taskNameState === "error"}
                    labelText={
                      <span>
                        Task Name <small>(required)</small>
                      </span>
                    }
                    id="taskname"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: taskName,
                      onChange: this.onChangeTaskName
                    }}
                    inputType="text"
                  />
                </GridItem>
                <GridItem xs={10} sm={10} md={10} lg={10}>
                  <CustomInput
                    labelText={<span>Task Description</span>}
                    id="taskdescription"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: taskDescription,
                      multiline: true,
                      onChange: this.onChangeTaskDescription
                    }}
                    inputType="text"
                  />
                </GridItem>
                <GridItem xs={10} sm={10} md={10} lg={10}>
                  <CustomInput
                    success={taskCategoryState === "success"}
                    error={taskCategoryState === "error"}
                    labelText={
                      <span>
                        Task Category <small>(required)</small>
                      </span>
                    }
                    id="taskcategory"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: taskCategory,
                      onChange: this.onChangeTaskCategory
                    }}
                    inputType="text"
                  />
                </GridItem>
              </React.Fragment>
            )}
            {status === "success" && (
              <GridItem
                xs={10}
                sm={10}
                md={10}
                lg={10}
                style={{ textAlign: "center" }}
              >
                <div style={{ paddingTop: 25 }}>
                  <Success
                    className={classes.icon}
                    style={{ height: 100, width: 100, fill: "green" }}
                  />
                  <h4
                    className={classes.modalTitle}
                    style={{ fontWeight: "bold" }}
                  >
                    Task Added
                  </h4>
                </div>
              </GridItem>
            )}
          </GridContainer>
        </DialogContent>
        {status === "working" ? (
          <DialogActions
            className={classes.modalFooter}
            style={{ padding: 24 }}
          >
            <Button
              onClick={this.confirmTaskAdd}
              className={classes.button + " " + classes.success}
              color="success"
            >
              Add
            </Button>
            <Button
              onClick={this.closeModal}
              className={classes.button + " " + classes.danger}
              color="danger"
            >
              Cancel
            </Button>
          </DialogActions>
        ) : null}
      </Dialog>
    );
  }
}

export default withMobileDialog()(withStyles(notificationsStyle)(AddTask));
