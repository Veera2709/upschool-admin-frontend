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
import { useHistory, useParams } from "react-router-dom";
import Select from "react-draggable-multi-select";
import BasicSpinner from "../../../../helper/BasicSpinner";


import {
  fetchSubjectIdName,
  fetchIndividualClass,
  editClass,
} from "../../../api/CommonApi";

const EditClass = ({ setOpenEditClass, classId }) => {
  const colourOptions = [];

  const isLocked = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const MySwal = withReactContent(Swal);
  const history = useHistory();

  const [subjectOption, setSubjectOption] = useState([]);
  const [defaultSubjects, setDefaultSubjects] = useState([]);
  const [topicTitles, setTopicTitles] = useState([]);
  const [isShown, setIsShown] = useState(true);
  const [individualClassdata, setIndividualClassdata] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  console.log("classId", classId);

  const sweetAlertHandler = (alert) => {
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      icon: alert.type,
    });
  };
  const storeAllData = (individual_class_data) => {
    setIndividualClassdata(individual_class_data);
    setToggle(true);
  };
  const fetchAllData = async () => {
    setIsLoading(true)
    const allSubjectData = await fetchSubjectIdName();
    if (allSubjectData.Error) {
      console.log("allSubjectData", allSubjectData.Error);
      if (allSubjectData.Error.response.data == 'Invalid Token') {
        sessionStorage.clear();
        localStorage.clear();
        history.push('/auth/signin-1');
        window.location.reload();
      }
    } else {
      let resultData = allSubjectData;
      console.log("resultData", resultData);
      resultData.forEach((item, index) => {
        colourOptions.push({
          value: item.subject_title,
          label: item.subject_title,
          subject_id: item.subject_id,
        });
      });
      console.log("colourOptions", colourOptions);
      setTopicTitles(colourOptions);

      const classData = await fetchIndividualClass(classId);
      console.log("classData", classData);
      if (classData.ERROR) {
        console.log("classData.ERROR", classData.ERROR);
        if (classData.Error.response.data == 'Invalid Token') {
          sessionStorage.clear();
          localStorage.clear();
          history.push('/auth/signin-1');
          window.location.reload();
        }
      } else {
        let individual_class_data = classData.Items[0];
        console.log("individual_class_data", individual_class_data);

        var tempArr = [];
        individual_class_data.class_subject_id.forEach(function (
          classSubjectID
        ) {
          colourOptions.forEach(function (Option) {
            if (classSubjectID === Option.subject_id) {
              tempArr.push(Option);
            }
          });
        });

        setDefaultSubjects(tempArr);
        setSubjectOption(individual_class_data.class_subject_id);
        storeAllData(individual_class_data);
      }
    }
    setIsLoading(false)
  };
  useEffect(() => {
    fetchAllData();
  }, []);

  const handleDigicardChange = (event) => {
    console.log("event- ", event);
    let valuesArr = [];
    if (event) {
      for (let i = 0; i < event.length; i++) {
        valuesArr.push(event[i].subject_id);
      }
    }
    console.log(valuesArr);
    setSubjectOption(valuesArr);
  };

  return  (
    <div>
      {isLoading === true ? (
        <>
          <BasicSpinner />
        </>
      ) : (
        <div>
          {toggle && (
            <>
              <React.Fragment>
                <Formik
                  enableReinitialize
                  initialValues={{
                    classTitle: individualClassdata.class_name,
                    // class_subject_id: subjectOption,
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

                    if (subjectOption == "") {
                      setIsShown(false);
                    } else {
                      console.log("on submit");
                      var formData = {
                        class_id: classId,
                        class_name: values.classTitle,
                        class_subject_id: subjectOption,
                      };
                      setOpenEditClass(false)

                      console.log("formdata", formData);

                      const editClassRes = await editClass(formData);
                      console.log("editClassRes : ", editClassRes);

                      if (editClassRes.Error) {
                        let errStatus = editClassRes.Error.response.status;
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
                              text: editClassRes.Error,
                            });
                      } else {
                        MySwal.fire({
                          title: "Class " + formData.class_name + " is Edited",
                          icon: "success",
                        }).then((willDelete) => {
                          history.push('/admin-portal/classes/active-classes')
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
                            <label
                              className="floating-label"
                              htmlFor="classTitle"
                            >
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
                          {
                            <div
                              className="form-group fill"
                              style={{ position: "relative", zIndex: 20 }}
                            >
                              <label
                                className="floating-label"
                                htmlFor="class_subject_id"
                              >
                                <small className="text-danger">* </small> Subjects
                              </label>

                              {defaultSubjects.length === 0 ? (
                                <Select
                                  isMulti
                                  name="color"
                                  options={topicTitles}
                                  // className="basic-multi-select"
                                  className="basic-single"
                                  classNamePrefix="Select"
                                  onChange={(event) => {
                                    handleDigicardChange(event);
                                    setIsShown(true);
                                  }}
                                />
                              ) : (
                                <>
                                  {defaultSubjects && (
                                    <>
                                      {console.log(defaultSubjects)}
                                      <Select
                                        defaultValue={defaultSubjects}
                                        isMulti
                                        name="color"
                                        options={topicTitles}
                                        // className="basic-multi-select"
                                        className="basic-single"
                                        classNamePrefix="Select"
                                        closeMenuOnSelect={false}
                                        onChange={(event) => {
                                          handleDigicardChange(event);
                                          setIsShown(true);
                                        }}
                                      />
                                    </>
                                  )}
                                </>
                              )}
                              <small
                                className="text-danger form-text"
                                style={{ display: isShown ? "none" : "block" }}
                              >
                                Please select a Subject
                              </small>
                            </div>
                          }
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
            </>
          )}
        </div>
      )}
    </div>

  );
};

export default EditClass;
