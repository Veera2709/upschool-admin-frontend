import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import parse from "html-react-parser";
import $ from "jquery";
import "./Styles/preview.css";
import Logo from "./Assets/Images/a.png";
import {useHistory} from 'react-router-dom'
const PreviewModal = (props) => {
  const [heightT, setHeight] = useState("440");
  const [widthT, setWidth] = useState("200");
  const { device, articleData, title } = props;
  let navigate = useHistory();
  useEffect(() => {
    const formData = {
      session_id: sessionStorage.getItem("token"),
      login_user_id:sessionStorage.getItem("user_id"),
      login_user_role:sessionStorage.getItem("user_role")
    };
    $.post(
      sessionStorage.getItem("connection_url") + "/get_terminal",
      formData,
      function (data) {
        const activeTerminal =
          data &&
          data.filter((ele) => {
            return ele.terminal_id == device;
          });
        if (activeTerminal[0]) {
          setWidth(activeTerminal[0].terminal_width);
          setHeight(activeTerminal[0].terminal_height);
        }
      }
    ).fail(function (xhr) {
      if (xhr.status == 401) {
        sessionStorage.removeItem("token");
        navigate("/");
        window.location.reload();
      }
    });
  }, [device]);
  return (
    <Modal {...props} dialogClassName="main-device" centered>
      <div className="close-button">
        <button className="close-button-child " onClick={props.onHide}>
          <i className="fas fa-times"></i>
        </button>
        <div className="logo-preview">
          <img src={Logo} alt="logo Image" />
        </div>
      </div>

      <div className="parent">
        <div
          style={{
            width: `${Number(widthT) }mm`,
            height: `${Number(heightT) }mm`,
          }}
          id="main-device"
        >
          <p className="headline">{title}</p>
          <div classname="preview-body">
            <div className="bodytext"> {parse(articleData)}</div>
            <div className="didyou">Did you find this help centre helpful?</div>
          </div>
          <div className="like-dislike">
            <div className="like-dislike-child">
              <i className="far fa-thumbs-up"></i>
              <div className="like-text"> Yes, Absolutely!</div>
            </div>{" "}
            <div className="like-dislike-child">
              <i className="far fa-thumbs-down"></i>
              <div className="like-text">No, I still need help </div>
            </div>
          </div>
          <br />
          <hr />
          <div className="could">Couldn’t find what you’re looking for?</div>
          <div className="please">Please call our Maya Business Support at</div>
          <div className="phone">(+632) 8845-77-00</div>
          <div className="please">or Toll Free</div>
          <div className="phone">1-800-1-888-6571</div>
          <br />
          <hr />
        </div>
      </div>
    </Modal>
  );
};

export default PreviewModal;
