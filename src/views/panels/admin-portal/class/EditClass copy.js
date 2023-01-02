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
import Select from "react-select";
import { isEmptyArray } from "../../../../util/utils";
import Multiselect from "multiselect-react-dropdown";

// import { Button,Container,Row ,Col  } from 'react-bootstrap';

const EditStandard = (
  setTabChange,
  categoryAPI,
  added,
  setAdded,
  articlesList,
  currentArticle,
  setEditArticle,
  editMode,
  currentSubCategory,
  terminal,
  setCurrentSubCategory
) => {
  const colourOptions = [];
  const DefaultisLockedOption = [];

  const isLocked = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const [content, setContent] = useState("");
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [disableButton, setDisableButton] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const MySwal = withReactContent(Swal);
  const [isClientExists, setIsClientExists] = useState(false);
  const [invalidFile, setInvalidFile] = useState(false);
  const [currentFeature, setCurrentFeature] = useState("");
  const [title, setTitle] = useState("");

  const [subjectOption, setSubjectOption] = useState([]);
  const [defaultPrelearning, setDefaultPrelearning] = useState([]);
  const [prelearningOptions, setPrelearningOptions] = useState([]);
  const [defaultSubjects, setDefaultSubjects] = useState([]);
  const [topicDigiCardIds, setTopicDigiCardIds] = useState([]);

  const [isLockedOption, setValue] = useState();
  const [defaulIslocked, setDefaulIslocked] = useState([]);
  const [description, setDescription] = useState();
  const [defauleDescription, setDefauleDescription] = useState();

  // console.log('defaulIslocked', defaulIslocked);
  // console.log("description", description);

  const [tags, setTags] = useState([]);
  const [ImgURL, setImgURL] = useState([]);
  const [display, setDisplay] = useState("none");
  const [imgFile, setImgFile] = useState([]);
  const [articleData, setArticleData] = useState("");
  const [articleDataTitle, setArticleDataTtitle] = useState("");
  const [digitalTitles, setDigitalTitles] = useState(0);
  const [topicTitles, setTopicTitles] = useState([]);

  const [isShown, setIsShown] = useState(true);

  const [individualChapterdata, setIndividualChapterdata] = useState([]);

  const [previousDigicards, setPreviousDigicards] = useState([]);
  const [dropdownDigicards, setDropdownDigicards] = useState([]);
  const [selectedDigicards, setSelectedDigicards] = useState([]);
  const [showDigicardErr, setShowDigicardErr] = useState(false);
  const [previousData, setPreviousData] = useState([]);

  const { class_id } = useParams();
  console.log("");
  // const subjectOption = (e) => {
  //     setSubjectOption(e);
  // }

  // const PrelearningOptions = (e) => {
  //     setPrelearningOptions(e);
  // }

  const sweetAlertHandler = (alert) => {
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      icon: alert.type,
    });
  };

  

  const fetchIndividualSubject = () => {
    axios
      .post(
        dynamicUrl.fetchIndividualClass,
        {
          data: {
            class_id: class_id,
          },
        },
        {
          headers: { Authorization: sessionStorage.getItem("user_jwt") },
        }
      )
      .then((response) => {
        console.log({ response });
        console.log(response.data.Items[0]);
        console.log(response.status === 200);
        let result = response.status === 200;
        hideLoader();
        if (result) {
          console.log("inside res initial data");

          let individual_class_data = response.data.Items[0];
          console.log("individual_class_data", individual_class_data);
          setIndividualChapterdata(individual_class_data);
          // setDefaultPrelearning(individual_class_data.prelearning_class_id);

          var tempArr = [];
          individual_class_data.class_subject_id.forEach(function (
            classSubjectID
          ) {
            colourOptions.forEach(function (Option) {
              console.log("classSubjectID-", classSubjectID);

              if (classSubjectID === Option.subject_id) {
                console.log("Option : ", Option);
                tempArr.push(Option);
              }
            });
            // setDefaultConceptOption(tempArr)
            console.log("dddd", tempArr);

            setDefaultSubjects(tempArr);
            setSubjectOption(tempArr);
          });

          ////////////////////////////////
          let previousDigicardsArr = [];
          let getData;
        } else {
          console.log("else res");
          hideLoader();
        }
      })
      .catch((error) => {
        if (error.response) {
          hideLoader();
          console.log(error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
          hideLoader();
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
          hideLoader();
        }
      });
  };

  useEffect(() => {
    axios
      .post(
        dynamicUrl.fetchSubjectIdName,
        {},
        {
          headers: { Authorization: sessionStorage.getItem("user_jwt") },
        }
      )
      .then((response) => {
        console.log(response.data);
        let resultData = response.data;
        console.log("response.data", response.data);

        resultData.forEach((item, index) => {
          colourOptions.push({
            value: item.subject_title,
            label: item.subject_title,
            subject_id: item.subject_id,
          });
        });
        console.log("colourOptions", colourOptions);
        setTopicTitles(colourOptions);

        fetchIndividualSubject();
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleOnSelect = (selectedList, selectedItem) => {
    setSubjectOption(selectedList);
  };

  // const handleOnSelectPre = ((selectedList, selectedItem) => {
  //     setPrelearningOptions(selectedList)
  // })
  const handleOnRemove = (selectedList, selectedItem) =>
    setTopicDigiCardIds(selectedList.map((skillId) => skillId.id));

  const handleDigicardChange = (event) => {
    setShowDigicardErr(false);
    console.log("event- ", event);

    let valuesArr = [];
    for (let i = 0; i < event.length; i++) {
      valuesArr.push(event[i].subject_id);
    }

    console.log(valuesArr);
    setSelectedDigicards(valuesArr);
    setSubjectOption(valuesArr);
  };

  console.log("gggggg", defaultSubjects);
  return isEmptyObject(individualChapterdata) && defaultSubjects.length === 0 ? null : (
    <div>
      <Card>
        <Card.Body>
          <Card.Title>Edit Class</Card.Title>
          <Formik
            initialValues={{
              classTitle: individualChapterdata.class_name,
              class_subject_id: "",
            }}
            validationSchema={Yup.object().shape({
              classTitle: Yup.string()
                .trim()
                .min(2, Constants.AddStandards.ClasstitleTooShort)
                .max(30, Constants.AddStandards.ClasstitleTooLong)
                .required(Constants.AddStandards.ClasstitleRequired),
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
                  class_id: class_id,
                  class_name: values.classTitle,
                  class_subject_id: subjectOption,
                };

                console.log("formdata", formData);

                axios
                  .post(
                    dynamicUrl.editClass,
                    { data: formData },
                    {
                      headers: {
                        Authorization: sessionStorage.getItem("user_jwt"),
                      },
                    }
                  )
                  .then(async (response) => {
                    console.log({ response });
                    if (response.Error) {
                      console.log("Error");
                      hideLoader();
                      setDisableButton(false);
                    } else {
                      sweetAlertHandler({
                        title: MESSAGES.TTTLES.Goodjob,
                        type: "success",
                        text: MESSAGES.SUCCESS.EditClass,
                      });
                      hideLoader();
                      setDisableButton(false);
                      // fetchClientData();
                      setIsOpen(false);
                    }
                  })
                  .catch((error) => {
                    if (error.response) {
                      // Request made and server responded
                      console.log(error.response.data);

                      console.log(error.response.data);
                      if (error.response.status === 400) {
                        console.log();
                        hideLoader();
                        // setIsClientExists(true);
                        sweetAlertHandler({
                          title: "Error",
                          type: "error",
                          text: MESSAGES.ERROR.ClassNameExists,
                        });
                      } else {
                        sweetAlertHandler({
                          title: "Error",
                          type: "error",
                          text: error.response.data,
                        });
                      }
                    } else if (error.request) {
                      // The request was made but no response was received
                      console.log(error.request);
                      setDisableButton(false);
                      hideLoader();
                    } else {
                      // Something happened in setting up the request that triggered an Error
                      console.log("Error", error.message);
                      setDisableButton(false);
                      hideLoader();
                    }
                  });
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
                        id="title"
                      />
                      {touched.classTitle && errors.classTitle && (
                        <small className="text-danger form-text">
                          {errors.classTitle}
                        </small>
                      )}
                    </div>
                    <br />
                    {defaultSubjects && (
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
                      
                        {/* <Select
                                // defaultValue={defaultSubjects}
                                defaultValue={defaultSubjects}
                                isMulti
                                name="digicards"
                                options={topicTitles}
                                className="basic-multi-select"
                                classNamePrefix="Select"
                                onChange={(event) =>
                                  handleDigicardChange(event)
                                }
                              /> */}

                        {defaultSubjects.length === 0 ? (
                          <Select
                            isMulti
                            name="digicards"
                            options={topicTitles}
                            className="basic-multi-select"
                            classNamePrefix="Select"
                            onChange={(event) => handleDigicardChange(event)}
                          />
                        ) : (
                          <>
                            {defaultSubjects && (
                              <Select
                                // defaultValue={defaultSubjects}
                                defaultValue={defaultSubjects}
                                isMulti
                                name="digicards"
                                options={topicTitles}
                                className="basic-multi-select"
                                classNamePrefix="Select"
                                onChange={(event) =>
                                  handleDigicardChange(event)
                                }
                              />
                            )}
                          </>
                        )}

                        {/* <Select
                      // defaultValue={defaultSubjects}
                      selectedValues={defaultSubjects}
                      isMulti
                      name="digicards"
                      options={topicTitles}
                      className="basic-multi-select"
                      classNamePrefix="Select"
                      onChange={(event) => handleDigicardChange(event)}
                    /> */}
                        {/* {showDigicardErr && <small className="text-danger form-text">{'Please select a Subject'}</small>} */}

                        <small
                          className="text-danger form-text"
                          style={{ display: isShown ? "none" : "block" }}
                        >
                          Please select a Subject
                        </small>
                      </div>
                    )}
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
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditStandard;
