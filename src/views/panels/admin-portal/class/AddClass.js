import React, { useState, useCallback } from "react";
// import './style.css'
import { Row, Col, Card, Button, Modal, Dropdown, Form } from "react-bootstrap";
// import CkDecoupledEditor from '../../../components/CK-Editor/CkDecoupledEditor';
import * as Constants from "../../../../helper/constants";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import dynamicUrl from "../../../../helper/dynamicUrls";
import ReactTags from "react-tag-autocomplete";
import "jodit";
import "jodit/build/jodit.min.css";
import MESSAGES from "../../../../helper/messages";
import Swal from "sweetalert2";
import useFullPageLoader from "../../../../helper/useFullPageLoader";
import withReactContent from "sweetalert2-react-content";
import { areFilesInvalid, isEmptyObject } from "../../../../util/utils";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import Multiselect from "multiselect-react-dropdown";
import {
  addClass,
  fetchSubjectIdName,
} from "../../../api/CommonApi";

// import { Button,Container,Row ,Col  } from 'react-bootstrap';

const AddClass = ({ setOpenAddClass }) => {
  const colourOptions = [];
  const isLocked = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const MySwal = withReactContent(Swal);

  const [subjectOption, setSubjectOption] = useState([]);
  const [isShown, setIsShown] = useState(true);

  const [reloadAllData, setReloadAllData] = useState("Fetched");

  const [topicSubjects, setSubjectTitles] = useState([]);

  const [showDigicardErr, setShowDigicardErr] = useState(false);

  let history = useHistory();

  const sweetAlertHandler = (alert) => {
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      icon: alert.type,
    });
  };

  const fetchSubjectIdNameList = async () => {
    const fetchSubjectIdNameRes = await fetchSubjectIdName();
    console.log("fetchSubjectIdNameRes : ", fetchSubjectIdNameRes);

    if (fetchSubjectIdNameRes.Error) {
      if (fetchSubjectIdNameRes.Error.response.data === "Invalid Token") {
        sessionStorage.clear();
        localStorage.clear();
        history.push('/auth/signin-1');
        window.location.reload();
      } else {
        let errStatus = fetchSubjectIdNameRes.Error.response.status;
        console.log("errStatus", errStatus);
        errStatus === 400
          ? sweetAlertHandler({
            title: "Error",
            type: "error",
            text: MESSAGES.ERROR.ClassNameExists,
          })
          : errStatus === 502
            ? sweetAlertHandler({
              title: "Error",
              type: "error",
              text: MESSAGES.ERROR.InvalidClassName,
            })
            : sweetAlertHandler({
              title: "Error",
              type: "error",
              text: fetchSubjectIdNameRes.Error,
            });
      }
    } else {
      let resultData = fetchSubjectIdNameRes;
      console.log("resultData : ", resultData);

      resultData.forEach((item, index) => {
        colourOptions.push({
          value: item.subject_title,
          label: item.subject_title,
          subject_id: item.subject_id,
        });
      });
      console.log("colourOptions", colourOptions);
      setSubjectTitles(colourOptions);
    }
  }


  useEffect(() => {
    fetchSubjectIdNameList();
  }, [reloadAllData]);


  const handleDigicardChange = (event) => {

    console.log("event : ", event);
    let valuesArr = [];
    for (let i = 0; i < event.length; i++) {
      valuesArr.push(event[i].subject_id);
    }
    console.log(valuesArr);
    setSubjectOption(valuesArr);
  };

  return (

    <React.Fragment>
      <Formik
        initialValues={{
          classTitle: "",
          standard_subject_id: "",
        }}
        validationSchema={Yup.object().shape({
          classTitle: Yup.string()
            .trim()
            .min(2, Constants.AddClasses.ClasstitleTooShort)
            .max(32, Constants.AddClasses.ClasstitleTooLong)
            .required(Constants.AddClasses.ClasstitleRequired),
        })}
        onSubmit={async (
          values,
          { setErrors, setStatus, setSubmitting }
        ) => {
          if (subjectOption == '') {
            setIsShown(false)
          } else {
            console.log("on submit");
            var formData = {
              class_name: values.classTitle,
              class_subject_id: subjectOption,
            };
            setOpenAddClass(false)
            console.log("formdata", formData);

            const addClassRes = await addClass(formData);
            console.log("addClassRes : ", addClassRes);

            if (addClassRes.Error) {
              if (addClassRes.Error.response.data == "Invalid Token") {
                sessionStorage.clear();
                localStorage.clear();
                history.push('/auth/signin-1');
                window.location.reload();
              } else {
                let errStatus = addClassRes.Error.response.status;
                console.log("errStatus", errStatus);
                errStatus === 400
                  ? sweetAlertHandler({
                    title: "Error",
                    type: "error",
                    text: MESSAGES.ERROR.ClassNameExists,
                  })
                  : errStatus === 502
                    ? sweetAlertHandler({
                      title: "Error",
                      type: "error",
                      text: MESSAGES.ERROR.InvalidClassName,
                    })
                    : sweetAlertHandler({
                      title: "Error",
                      type: "error",
                      text: addClassRes.Error,
                    });
              }

            } else {
              MySwal.fire({
                title: "Class is Created",
                icon: "success",
              }).then((willDelete) => {
                window.location.reload();
              });
            }
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Row>
              {/* {edit1Toggle && <Loader />} */}
              <Col sm={6}>
                <div className="form-group fill">
                  <label className="floating-label" htmlFor="classTitle">
                    <small className="text-danger">* </small>Class Name
                  </label>
                  <input
                    className="form-control"
                    error={touched.classTitle && errors.classTitle}
                    name="classTitle"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    value={values.classTitle}
                    placeholder="Enter Class Name"
                    id="title"
                  />
                  {touched.classTitle && errors.classTitle && (
                    <small className="text-danger form-text">
                      {errors.classTitle}
                    </small>
                  )}
                </div>
                <br />
                <div
                  className="form-group fill"
                  style={{ position: "relative", zIndex: 20 }}
                >
                  <label
                    className="floating-label"
                    htmlFor="standard_subject_id"
                  >
                    <small className="text-danger">* </small> Subjects
                  </label>

                  <Select
                    isMulti
                    name="digicards"
                    options={topicSubjects}
                    className="basic-multi-select"
                    classNamePrefix="Select"
                    onChange={(event) => {handleDigicardChange(event);setIsShown(true)}}
                  />
                  <br />
                  <small
                    className="text-danger form-text"
                    style={{ display: isShown ? "none" : "block" }}
                  >
                    Please select a Subject
                  </small>
                </div>

              </Col>
            </Row>
            <br></br>
            <Row>
              <Col sm={10}></Col>
              <div className="form-group fill float-end">
                <Col sm={12} className="center">
                  <Button
                    className="btn-block"
                    color="success"
                    size="large"
                    type="submit"
                    variant="success"
                  >
                    Submit
                  </Button>
                </Col>
              </div>
            </Row>
          </form>
        )}
      </Formik>
    </React.Fragment>


  );
};

export default AddClass;
