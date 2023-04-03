import React, { useState, useEffect, useRef } from 'react';
// import { InputGroup, FormControl, Button } from 'react-bootstrap';
// import './style.css'
import { InputGroup, Row, Col, Card, Button, Modal } from 'react-bootstrap';
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
import Select from 'react-draggable-multi-select';

import { fetchDigiCardsBasedonStatus } from '../../../api/CommonApi'
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
  const [selectedFile, setSelectedFile] = useState(null);//doc selected
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [disableButton, setDisableButton] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const MySwal = withReactContent(Swal);
  const [articleSize, setArticleSize] = useState(20);
  const [imageCount, setImageCount] = useState(0);
  const [multiOptions, setMultiOptions] = useState([]);
  const [tags, setTags] = useState([]);
  const [ImgURL, setImgURL] = useState([]);
  const [imgFile, setImgFile] = useState([]);
  const [articleData, setArticleData] = useState('');
  const [articleDataTitle, setArticleDataTtitle] = useState('');
  const [digitalTitles, setDigitalTitles] = useState([]);
  const [imgValidation, setImgValidation] = useState(true);
  const [voiceError, setVoiceError] = useState(true);
  const [docError, setDocError] = useState(true);//upload doc
  const [displayHeading, setDisplayHeading] = useState(sessionStorage.getItem('digicard_type'));
  const [displayHeader, setDisplayHeader] = useState(true);
  const [imagePre, setImage] = useState();
  const [voiceNotePre, setVoiceNote] = useState("");

  const threadLinks = document.getElementsByClassName('page-header');

  let history = useHistory();

  const allowedFileTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif'];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

    if (!allowedFileTypes.includes(fileExtension)) {

      MySwal.fire('Sorry', 'Invalid file type. Only PDF, DOC, DOCX, JPG, JPEG, PNG, and GIF files are allowed.', 'warning')
      event.target.value = null;
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };





  const handleDelete = (i, states) => {
    const newTags = tags.slice(0);
    newTags.splice(i, 1);
    setTags(newTags);
  };

  const handleAddition = (tag, state) => {
    const newTags = [].concat(tags, tag);
    setTags(newTags);
  };

  const previewVoiceNote = (e) => {
    setVoiceNote(URL.createObjectURL(e.target.files[0]));
  }

  function encodeImageFileAsURL(e) {
    let FileLength = e.target.files.length
    if (FileLength === 1) {
      var file = document.getElementById('digicard_image').files[0];
      var reader = new FileReader();
      reader.onloadend = function () {
        // console.log('RESULT', reader.result)
        setImgURL(reader.result)
      }
      reader.readAsDataURL(file);
    }
  }
  const sweetAlertHandler = (alert) => {
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      icon: alert.type
    });
  };

  const previewImage = (e) => {
    let FileLength = e.target.files.length
    setImage(e.target)
    console.log("FileLength", FileLength);
    FileLength === 1 ? setImgFile(URL.createObjectURL(e.target.files[0])) : setImgFile()
  }






  const fetchAllData = async () => {
    if (threadLinks.length === 2) {
      setDisplayHeader(false);
    } else {
      setDisplayHeader(true);
    }
    const allDigicardData = await fetchDigiCardsBasedonStatus("Active");
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
        colourOptions.push({ value: item.digi_card_id, label: item.digi_card_title })
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
    if (event) {
      for (let i = 0; i < event.length; i++) {
        valuesArr.push(event[i].value)
      }
    }
    setMultiOptions(valuesArr);
  }

  //doc
  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  //button 
  // const handleUpload = () => {
  //   const formData = new FormData();
  //   formData.append("file", selectedFile);

  //   // Call the API to upload the file
  //   // ...

  //   setSelectedFile(null);
  // };



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
                displayname: '',
                digicard_image: '',
                digicardcontent: '',
                digicardtitleExcerpt: '',
                digicard_voice_note: '',
                digicard_document: '',
                clientComponents: multiOptions
              }}
              validationSchema={Yup.object().shape({
                digicardtitle: Yup.string()
                  .trim()
                  .min(2, Constants.AddDigiCard.DigiCardtitleTooShort)
                  .max(32, Constants.AddDigiCard.DigiCardtitleTooLong)
                  .matches(Constants.AddDigiCard.DigiCardtitleRegex, Constants.AddDigiCard.DigiCardtitleValidation)
                  .required(Constants.AddDigiCard.DigiCardtitleRequired),
                digicard_image: Yup.string()
                  .trim()
                  .nullable(true, Constants.AddDigiCard.DigiCardImageNotNull)
                  .required(Constants.AddDigiCard.DigiCardImageRequired),

                displayname: Yup.string()
                  .trim()
                  .min(2, Constants.AddDigiCard.DisplayNameTooShort)
                  .max(32, Constants.AddDigiCard.DisplayNameTooLong)
                  .required(Constants.AddDigiCard.DisplayNameRequired),
              })}

              onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                showLoader()
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
                    digi_card_title: values.digicardtitle,
                    display_name: values.displayname,
                    digi_card_files: [values.digicard_image],
                    digicard_image: values.digicard_image,
                    digi_card_excerpt: articleDataTitle,
                    digi_card_content: articleData,
                    digi_card_keywords: tags,
                    digicard_document: values.digicard_document,//upload doc
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
                          MySwal.fire({
                            title: 'Digicard added successfully!',
                            icon: 'success',
                          }).then((willDelete) => {
                            history.push('/admin-portal/active-digiCard');
                            window.location.reload();

                          })
                        } else {
                          console.log('No files uploaded');
                          sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.AddingDigiCard });
                          hideLoader();
                          history.push('/admin-portal/active-digiCard');
                          window.location.reload();
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

                      <Row>
                        <Col>
                          <div className="form-group fill">
                            <label className="floating-label" htmlFor="displayname">
                              <small className="text-danger">* </small>Display Name
                            </label>
                            <input
                              className="form-control"
                              error={touched.displayname && errors.displayname}
                              name="displayname"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              type="text"
                              value={values.displayname}
                              id='title'
                            />
                            {touched.displayname && errors.displayname && <small className="text-danger form-text">{errors.displayname}</small>}
                          </div>
                        </Col>


                      </Row>






                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="digicard_image">
                          <small className="text-danger">* </small>DigiCard Logo
                        </label>
                        <input
                          className="form-control"
                          name="digicard_image"
                          id="digicard_image"
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handleChange(e);
                            encodeImageFileAsURL(e);
                            setImgValidation(true);
                            previewImage(e);
                          }}
                          type="file"
                          value={values.digicard_image}
                          accept="image/*"
                        />
                        {touched.digicard_image && errors.digicard_image && (
                          <small className="text-danger form-text">{errors.digicard_image}</small>
                        )}

                        <small className="text-danger form-text" style={{ display: imgValidation ? 'none' : 'block' }}>Invalid File Type or File size is Exceed More Than 2MB</small>
                      </div>




                      <div
                        className="form-group fill"
                      >
                        <label className="floating-label" htmlFor="digicard_voice_note">
                          <small className="text-danger"> </small>Voice Note
                        </label>
                        <input
                          className="form-control"
                          error={touched.digicard_voice_note && errors.digicard_voice_note}
                          name="digicard_voice_note"
                          id="digicard_voice_note"
                          onBlur={handleBlur}
                          onClick={(e) => {
                            setVoiceNote('');
                          }}
                          onChange={(e) => {
                            previewVoiceNote(e)
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




                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="digicard_document">
                          <small className="text-danger"> </small> Upload Document
                        </label>
                        <InputGroup>
                          <input
                            className="form-control"
                            error={touched.digicard_document && errors.digicard_document}
                            name="digicard_document"
                            id="digicard_document"
                            onBlur={handleBlur}
                            onChange={(e) => { handleFileInput(e); handleChange(e); handleFileChange(e) }}
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                          />

                          {/* <button onClick={handleUpload} className="btn btn-primary btn-msg-send" type="button">
                            Upload
                          </button> */}
                        </InputGroup>


                        {selectedFile && <p style={{ color: "blue" }}>Selected file: {selectedFile.name}</p>}

                        {/* {selectedFile && (
                          <small className="text-muted form-text">
                            Selected file: {selectedFile.name}
                          </small>
                        )} */}

                        {touched.digicard_document && errors.digicard_document && (
                          <small className="text-danger form-text">{errors.digicard_document}</small>
                        )}
                        <small className="text-danger form-text" style={{ display: docError ? 'none' : 'block' }}>Invalid File Type or File size is Exceed More Than 10MB</small>
                      </div>






                      <div className='ReactTags'>
                        <label className="floating-label">
                          <small className="text-danger"> </small>KeyWords
                        </label>
                        <ReactTags
                          classNames={{ root: 'react-tags bootstrap-tagsinput', selectedTag: 'react-tags__selected-tag btn-primary' }}
                          allowNew={true}
                          addOnBlur={true}
                          tags={tags}
                          onDelete={handleDelete}
                          onAddition={(e) => handleAddition(e)}
                          name='digicardKeywords'
                        />
                      </div><br />
                      <div className="form-group fill">
                        <label className="floating-label" htmlFor="clientComponents">
                          <small className="text-danger"> </small>Related DigiCard Titles
                        </label>
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          name="color"
                          isMulti
                          closeMenuOnSelect={false}
                          onChange={getMultiOptions}
                          options={digitalTitles}
                          placeholder="Select"
                          menuPortalTarget={document.body}
                          styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                        />
                        <br />
                        {touched.clientComponents && errors.clientComponents && (
                          <small className="text-danger form-text">{errors.clientComponents}</small>
                        )}
                      </div>
                    </Col>
                    <Col sm={6}><br />
                      <div className="form-group fill" style={{ marginTop: '60px' }}>
                        <label className="floating-label" htmlFor="digicardtitle">
                          <small className="text-danger">* </small>Logo preview
                        </label><br />
                        <img width={100} src={imgFile} alt="" className="img-fluid mb-3" />
                      </div>
                      {voiceNotePre && (
                        <div>
                          <label className="floating-label" htmlFor="digicardtitle">
                            <small className="text-danger">* </small>Voice Note preview
                          </label><br />
                          <audio controls>
                            <source src={voiceNotePre} alt="Audio" type="audio/mp3" />
                          </audio>
                        </div>
                      )}


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
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
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
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                      />
                    </Col>
                    {loader}
                  </Row><br></br>
                  <Row >
                    <Col sm={8}>
                    </Col>
                    <Col>
                      <Row>
                        <Col></Col>
                        <Col>
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
                      </Row>
                    </Col>
                  </Row>
                </form>
              )}

            </Formik>
          </Card.Body>

        </Card>
      </React.Fragment>
    </>
  )

};

export default AddDigiCard;
