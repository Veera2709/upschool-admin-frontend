import React, { useState, useEffect } from 'react';
// import './style.css'
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
// import CkDecoupledEditor from '../../../components/CK-Editor/CkDecoupledEditor';
import * as Constants from '../../../../helper/constants';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import dynamicUrl from '../../../../helper/dynamicUrls';
import ReactTags from 'react-tag-autocomplete';
import 'jodit';
import 'jodit/build/jodit.min.css';
import MESSAGES from '../../../../helper/messages';
import Swal from 'sweetalert2';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import withReactContent from 'sweetalert2-react-content';
import ArticleRTE from './ArticleRTE'
import { areFilesInvalid, voiceInvalid } from '../../../../util/utils';
import logo from './img/logo.png'
import Multiselect from 'multiselect-react-dropdown';
import Select from 'react-select';

import { fetchAllDigiCards } from '../../../api/CommonApi'
import { Link, useHistory } from 'react-router-dom';






// import { Button,Container,Row ,Col  } from 'react-bootstrap';

const AddDigiCard = (
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


  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [disableButton, setDisableButton] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const MySwal = withReactContent(Swal);
  const [articleSize, setArticleSize] = useState(20);
  const [imageCount, setImageCount] = useState(0);
  const [multiOptions, setMultiOptions] = useState([]);
  const [tags, setTags] = useState([]);
  const [index, setIndex] = useState(0);
  const [ImgURL, setImgURL] = useState([]);
  const [display, setDisplay] = useState('none');
  const [imgFile, setImgFile] = useState([]);
  const [articleData, setArticleData] = useState("");
  const [articleDataTitle, setArticleDataTtitle] = useState("");
  const [digitalTitles, setDigitalTitles] = useState([]);
  const [imgValidation, setImgValidation] = useState(true);
  const [voiceError, setVoiceError] = useState(true);
  const [topicDigiCardIds, setTopicDigiCardIds] = useState([]);
  const [displayHeading, setDisplayHeading] = useState(sessionStorage.getItem('digicard_type'));
  const [displayHeader, setDisplayHeader] = useState(true);
  const threadLinks = document.getElementsByClassName('page-header');

  let history = useHistory();









  const handleDelete = (i, states) => {
    const newTags = tags.slice(0);
    newTags.splice(i, 1);
    setTags(newTags);
  };

  const handleAddition = (tag, state) => {
    const newTags = [].concat(tags, tag);

    setTags(newTags);
  };


  function encodeImageFileAsURL() {
    var file = document.getElementById('digicard_image').files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      console.log('RESULT', reader.result)
      setImgURL(reader.result)
    }
    reader.readAsDataURL(file);
  }
  const sweetAlertHandler = (alert) => {
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      icon: alert.type
    });
  };


  const previewImage = (e) => {
    setImgFile(URL.createObjectURL(e.target.files[0]));
  }



  // const previewData = () => {
  //   var data = {
  //     imgUrl: ImgURL,
  //     articleData: articleData,
  //     digi_card_name: document.getElementById('name').value,
  //     digi_card_title: document.getElementById('title').value
  //   }

  //   sessionStorage.setItem("data", JSON.stringify(data))
  //   history.push(`/admin-portal/preview`)
  // }


  const fetchAllData = async () => {
    if (threadLinks.length === 2) {
      setDisplayHeader(false);
    } else {
      setDisplayHeader(true);
    }
    const allDigicardData = await fetchAllDigiCards(dynamicUrl.fetchAllDigiCards);
    if (allDigicardData.error) {
      console.log(allDigicardData.error);
      if (allDigicardData.Error.response.data == 'Invalid Token') {
        sessionStorage.clear();
        localStorage.clear();
        history.push('/auth/signin-1');
        window.location.reload();
      }
    } else {
      console.log("allDigicardData", allDigicardData.Items);
      let resultData = allDigicardData.Items;
      resultData.forEach((item, index) => {
        if (item.digicard_status === 'Active') {
          colourOptions.push({ value: item.digi_card_id, label: item.digi_card_title })
        }
      })
      setDigitalTitles(colourOptions);
    }
  }

  useEffect(() => {

    let userJWT = sessionStorage.getItem('user_jwt');
    console.log("jwt", userJWT);

    if (userJWT === "" || userJWT === undefined || userJWT === "undefined" || userJWT === null) {

      sessionStorage.clear();
      localStorage.clear();
      history.push('/auth/signin-1');
      window.location.reload();
    } else {

      setImgFile(logo)
      fetchAllData();

    }


  }, [])




  const getMultiOptions = (event) => {
    let valuesArr = [];
    for (let i = 0; i < event.length; i++) {
      valuesArr.push(event[i].value)
    }
    setMultiOptions(valuesArr);
  }


  return (
    <>
      <React.Fragment>
        {
          displayHeader && (
            <div className="page-header">
              <div className="page-block">
                <div className="row align-items-center">
                  <div className="col-md-12">
                    <div className="page-header-title">
                      <h5 className="m-b-10">{displayHeading}</h5>
                    </div><ul className="breadcrumb  ">
                      <li className="breadcrumb-item  ">
                        <a href="/upschool/admin-portal/admin-dashboard">
                          <i className="feather icon-home">
                          </i>
                        </a>
                      </li>
                      <li className="breadcrumb-item  ">Digicard</li>
                      <li className="breadcrumb-item  ">{displayHeading}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )
        }
        <Card>
          <Card.Body>
            <Card.Title>Add DigiCard</Card.Title>
            <Formik
              initialValues={{
                digicardname: '',
                digicardtitle: '',
                digicard_image: '',
                digicardcontent: '',
                digicardtitleExcerpt: '',
                digicard_voice_note: '',
                clientComponents: multiOptions
              }}
              validationSchema={Yup.object().shape({
                digicardtitle: Yup.string()
                  .trim()
                  .min(2, Constants.AddDigiCard.DigiCardtitleTooShort)
                  .max(50, Constants.AddDigiCard.DigiCardtitleTooLong)
                  .matches(Constants.AddDigiCard.DigiCardtitleRegex, Constants.AddDigiCard.DigiCardtitleValidation)
                  .required(Constants.AddDigiCard.DigiCardtitleRequired),
                digicard_image: Yup.string()
                  .trim()
                  .nullable(true, Constants.AddDigiCard.DigiCardImageNotNull)
                  .required(Constants.AddDigiCard.DigiCardImageRequired),
              })}

              onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                console.log("multiOptions", multiOptions);
                console.log("on submit");
                let allFilesData = [];
                let voiceData = [];
                const fileNameArray = ['digicard_image'];
                let voiceNote = document.getElementById('digicard_voice_note').files[0];
                // voiceData.push(voiceNote)
                console.log("voicenote", voiceNote);

                if (voiceNote == undefined) {
                  voiceData.push({ values: 'false' })
                } else {
                  voiceData.push(voiceNote)
                }


                fileNameArray.forEach((fileName) => {
                  let selectedFile = document.getElementById(fileName).files[0];
                  console.log('File is here!');
                  console.log(selectedFile);
                  if (selectedFile) {
                    allFilesData.push(selectedFile);
                  }
                });

                if (areFilesInvalid(allFilesData) !== 0) {
                  setImgValidation(false)
                  hideLoader();
                } else if (voiceInvalid(voiceData) !== 0) {
                  setVoiceError(false)
                  console.log("voice note not a mp3");
                } else {

                  var formData = {
                    // digi_card_name: values.digicardname,
                    digi_card_title: values.digicardtitle,
                    digi_card_files: [values.digicard_image],
                    digicard_image: values.digicard_image,
                    digi_card_excerpt: articleDataTitle,
                    digi_card_content: articleData,
                    digi_card_keywords: tags,
                    digicard_voice_note: values.digicard_voice_note === undefined ? "" : values.digicard_voice_note,
                    related_digi_cards: multiOptions,
                  };
                  console.log("formData", formData);

                  axios
                    .post(dynamicUrl.insertDigicard, { data: formData }, { headers: { Authorization: sessionStorage.getItem('user_jwt') } })
                    .then(async (response) => {
                      console.log({ response });
                      if (response.Error) {
                        console.log('Error');
                        hideLoader();
                        setDisableButton(false);
                      } else {
                        let uploadParams = response.data;
                        hideLoader();
                        setDisableButton(false);
                        console.log('Proceeding with file upload');

                        if (Array.isArray(uploadParams)) {
                          for (let index = 0; index < uploadParams.length; index++) {
                            let keyNameArr = Object.keys(uploadParams[index]);
                            let keyName = keyNameArr[0];
                            console.log('KeyName', keyName);


                            let blobField = document.getElementById(keyName).files[0];
                            console.log({
                              blobField
                            });

                            let tempObj = uploadParams[index];

                            let result = await fetch(tempObj[keyName], {
                              method: 'PUT',
                              body: blobField
                            });

                            console.log({
                              result
                            });
                          }
                          // sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.AddingDigiCard });
                          hideLoader();
                          setDisableButton(false);
                          // fetchClientData();
                          setIsOpen(false);

                          MySwal.fire({

                            title: 'Digicard added successfully!',
                            icon: 'success',
                          }).then((willDelete) => {

                            window.location.reload();

                          })
                        } else {
                          console.log('No files uploaded');
                          sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.AddingDigiCard });
                          hideLoader();
                          setDisableButton(false);
                          // fetchClientData();
                          setIsOpen(false);
                        }
                      }
                    })
                    .catch((error) => {
                      if (error.response) {
                        // Request made and server responded
                        console.log(error.response.data);

                        console.log(error.response.data);
                        if (error.response.status === 401) {
                          console.log();
                          hideLoader();
                          // setIsClientExists(true);
                          sweetAlertHandler({ title: 'Error', type: 'error', text: MESSAGES.ERROR.DigiCardNameExists });

                        } else if (error.response.data === 'Invalid Token') {

                          sessionStorage.clear();
                          localStorage.clear();
                          history.push('/auth/signin-1');
                          window.location.reload();
                        } else {
                          console.log("err", error);
                        }

                      } else if (error.request) {
                        // The request was made but no response was received
                        console.log(error.request);
                        setDisableButton(false);
                        hideLoader();
                      } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                        setDisableButton(false);
                        hideLoader();
                      }
                    });
                }
              }
              }
            >
              {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Row>
                    {/* {edit1Toggle && <Loader />} */}
                    <Col sm={6}>
                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="digicardtitle">
                          <small className="text-danger">* </small>DigiCard Title
                        </label>
                        <input
                          className="form-control"
                          error={touched.digicardtitle && errors.digicardtitle}
                          name="digicardtitle"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="text"
                          value={values.digicardtitle}
                          id='title'
                        />
                        {touched.digicardtitle && errors.digicardtitle && <small className="text-danger form-text">{errors.digicardtitle}</small>}
                      </div>
                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="digicard_image">
                          <small className="text-danger">* </small>DigiCard Logo
                        </label>
                        <input
                          className="form-control"
                          error={touched.digicard_image && errors.digicard_image}
                          name="digicard_image"
                          id="digicard_image"
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handleChange(e);
                            previewImage(e);
                            encodeImageFileAsURL(e);
                            setImgValidation(true)
                          }}
                          type="file"
                          value={values.digicard_image}
                          accept="image/*"
                        />
                        {touched.digicard_image && errors.digicard_image && (
                          <small className="text-danger form-text">{errors.digicard_image}</small>
                        )}
                        <small className="text-danger form-text" style={{ display: imgValidation ? 'none' : 'block' }}>Invalid File Type or File size is Exceed More Than 1MB</small>
                      </div>
                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="digicard_voice_note">
                          <small className="text-danger"> </small>Voice Note
                        </label>
                        <input
                          className="form-control"
                          error={touched.digicard_voice_note && errors.digicard_voice_note}
                          name="digicard_voice_note"
                          id="digicard_voice_note"
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handleChange(e);
                            setVoiceError(true)
                          }
                          }
                          type="file"
                          value={values.digicard_voice_note}
                          accept=".mp3,audio/*"
                        />
                        {touched.digicard_voice_note && errors.digicard_voice_note && (
                          <small className="text-danger form-text">{errors.digicard_voice_note}</small>
                        )}
                        <small className="text-danger form-text" style={{ display: voiceError ? 'none' : 'block' }}>Invalid File Type or File size is Exceed More Than 10MB</small>
                      </div>

                      <div className='ReactTags'>
                        <label className="floating-label">
                          <small className="text-danger"> </small>KeyWords
                        </label>
                        <ReactTags
                          // error={touched.digicardKeywords && errors.digicardKeywords}
                          classNames={{ root: 'react-tags bootstrap-tagsinput', selectedTag: 'react-tags__selected-tag btn-primary' }}
                          allowNew={true}
                          addOnBlur={true}
                          tags={tags}
                          onDelete={handleDelete}
                          onAddition={(e) => handleAddition(e)}
                          name='digicardKeywords'
                        />
                        {/* {touched.digicardKeywords && errors.digicardKeywords && (<small className="text-danger form-text">{errors.digicardKeywords}</small>)} */}
                      </div><br />
                      <div className="form-group fill" style={{ position: "relative", zIndex: 10 }}>
                        <label className="floating-label" htmlFor="clientComponents">
                          <small className="text-danger"> </small>Related DigiCard Titles
                        </label>
                        {/* <Multiselect
                        options={digitalTitles}
                        displayValue="value"
                        selectionLimit="25"
                        // selectedValues={defaultOptions}
                        onSelect={(e) => { handleOnSelect(e) }}
                        onRemove={handleOnRemove}
                      /> */}
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          name="color"
                          isMulti
                          closeMenuOnSelect={false}
                          onChange={getMultiOptions}
                          options={digitalTitles}
                          placeholder="Select"
                        />
                        <br />
                        {touched.clientComponents && errors.clientComponents && (
                          <small className="text-danger form-text">{errors.clientComponents}</small>
                        )}
                      </div>
                    </Col>
                    <Col sm={6}><br />

                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="digicardtitle">
                          <small className="text-danger">* </small>Logo preview
                        </label><br />
                        <img width={150} src={imgFile} alt="" className="img-fluid mb-3" />
                      </div>

                    </Col>
                  </Row>
                  <Row>
                    <Col sm='12'>
                      <label className="floating-label" htmlFor="digicardtitleExcerpt">
                        <small className="text-danger"> </small>DigiCard Excerpt
                      </label>
                      <ArticleRTE
                        setArticleSize={setArticleSize}
                        setImageCount={setImageCount}
                        imageCount={imageCount}
                        articleData={articleDataTitle}
                        setArticleData={setArticleDataTtitle}

                      />
                    </Col>
                    <br />
                  </Row><br></br>
                  <Row>
                    <Col sm='12'>
                      <label className="floating-label" htmlFor="digicardtitle">
                        <small className="text-danger"> </small>DigiCard Content
                      </label>
                      <ArticleRTE
                        setArticleSize={setArticleSize}
                        setImageCount={setImageCount}
                        imageCount={imageCount}
                        articleData={articleData}
                        setArticleData={setArticleData}
                        onChange={handleChange}
                        name="digicardcontent"

                      />
                    </Col>
                    {/* {touched.digicardcontent && errors.digicardcontent && <small className="text-danger form-text">{errors.digicardcontent}</small>} */}

                    <br />
                    {/* <small className="text-danger form-text" >Select DigiCard Titles</small> */}
                  </Row><br></br>
                  <Row>
                    <Col sm={10}>
                    </Col>
                    <div className="form-group fill float-end" >
                      <Col sm={12} className="center">
                        <Button
                          className="btn-block"
                          color="success"
                          size="large"
                          type="submit"
                          variant="success"
                        // disabled={disableButton === true}
                        >
                          Submit
                        </Button>
                      </Col>
                    </div>
                  </Row>
                </form>
              )}

            </Formik>
            <Row>
              <Col sm={10}>
              </Col>
              {/* <div className="form-group fill float-end" >
              <Col sm={12} className="center">
                <Button
                  className="btn-block"
                  color="success"
                  size="large"
                  type="submit"
                  variant="success"
                  onClick={previewData}
                >
                  preview
                </Button>
              </Col>
            </div> */}
            </Row>
          </Card.Body>

        </Card>
      </React.Fragment>
    </>





  )

};

export default AddDigiCard;
