import * as React from "react";
import { Modal, Form, Button, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import authApi from "../../../api/models/auth";
import "./styles.scss";

interface PropsType {
  onClose: () => void;
}

interface StateType {
  username: string;
  password: string;
  confirmPassword: string;
  showErrorField: boolean;
  errorMessage: string;
}

class SignUp extends React.PureComponent<PropsType, StateType> {
  state: StateType = {
    username: "",
    password: "",
    confirmPassword: "",
    showErrorField: false,
    errorMessage: "",
  };

  isValidForm = (): boolean => {
    const { username, password, confirmPassword } = this.state;
    if (!username || !password || !confirmPassword) {
      this.setState({
        showErrorField: true,
        errorMessage: "Los datos ingresados son incorrectos.",
      });

      return false;
    }
    const regex = new RegExp(
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    if (!regex.test(username)) {
      this.setState({
        showErrorField: true,
        errorMessage: "Formato de email no valido.",
      });
      return false;
    }

    if (password !== confirmPassword) {
      this.setState({
        showErrorField: true,
        errorMessage: "Las passwords no coinciden",
      });
      return false;
    }

    this.setState({
      showErrorField: false,
    });

    return true;
  };

  handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (this.isValidForm()) {
      const { username, password, confirmPassword } = this.state;
      const { onClose } = this.props;
      const userCreated = await authApi.register(
        username,
        password,
        confirmPassword
      );
      if (userCreated) {
        toast.info(
          "Tu registro fue todo un exito! Recuerda que tu email es: " +
            username,
          {
            position: "top-center",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: { top: 50 },
          }
        );
        onClose();
        return;
      }

      this.setState({
        showErrorField: true,
        errorMessage:
          "Hubo un inconveniente al crear el usuario, por favor, vuelve a intentarlo.",
      });
    }
  };

  handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      username: event.target.value,
    });
  };

  handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: event.target.value,
    });
  };

  handleChangeConfirmPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({
      confirmPassword: event.target.value,
    });
  };

  render() {
    const { onClose } = this.props;
    const { showErrorField, errorMessage } = this.state;
    return (
      <div className="login">
        <Modal.Header closeButton>
          <Modal.Title>Registracion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="register-body">
          <Form onSubmit={this.handleSubmitForm}>
            <Form.Group controlId="formGroupEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                onChange={this.handleChangeEmail}
                type="email"
                value={this.state.username}
                placeholder="Ingresa tu email"
              />
            </Form.Group>
            <Form.Group controlId="formGroupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                onChange={this.handleChangePassword}
                type="password"
                value={this.state.password}
                placeholder="Password"
              />
            </Form.Group>
            <Form.Group controlId="formGroupRepeatPassword">
              <Form.Label>Repetir Password</Form.Label>
              <Form.Control
                onChange={this.handleChangeConfirmPassword}
                type="password"
                value={this.state.confirmPassword}
                placeholder="Password"
              />
            </Form.Group>
            {showErrorField && (
              <div className="registration-validation-block">
                <span className="register-validation">{errorMessage}</span>
              </div>
            )}
            <Form.Row>
              <Col xs={12} md={6}>
                <Button variant="primary" type="submit">
                  Registrarse
                </Button>
              </Col>
              <Col className="cancel-button-container" xs={12} md={6}>
                <Button variant="secondary" onClick={onClose}>
                  Cerrar
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Modal.Body>
      </div>
    );
  }
}

export default SignUp;
