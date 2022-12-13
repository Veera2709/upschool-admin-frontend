import React, { useState, useCallback } from 'react';
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
import JoditEditor from 'jodit-react';
import MESSAGES from '../../../../helper/messages';
import Swal from 'sweetalert2';
import useFullPageLoader from '../../../../helper/useFullPageLoader';
import withReactContent from 'sweetalert2-react-content';
import AddArticles from '../digicard/AddArticles'
import ArticleRTE from './ArticleRTE'
import { areFilesInvalid } from '../../../../util/utils';
import { useEffect } from 'react';
import logo from './img/logo.png'
import { useHistory } from 'react-router-dom';


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


  const [content, setContent] = useState('');
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [disableButton, setDisableButton] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const MySwal = withReactContent(Swal);
  const [isClientExists, setIsClientExists] = useState(false);
  const [invalidFile, setInvalidFile] = useState(false);
  const [currentFeature, setCurrentFeature] = useState("");
  const [title, setTitle] = useState("");

  const [category, setCategory] = useState("");
  const [categoryNameEdit, setCategoryNameEdit] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [device, setDevice] = useState(terminal);
  const [featured, setFeatured] = useState("No");
  const [categoryCollection, setCategoryCollection] = useState("");
  const [subCollection, setSubCollection] = useState("");
  const [currentStatus, setCurrentStatus] = useState("Draft");
  const [createdAt, setCreatedAt] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [modifiedAt, setModifiedAt] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [uniqueArticle, setUniqueArtricle] = useState("");
  const [terminalOption, setTerminalOption] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [views, setViews] = useState([]);
  const [upvotes, setUpvotes] = useState([]);
  const [downvotes, setDownvotes] = useState([]);
  const [submitAnchor, setSubmitAnchor] = useState(false);
  const [finalSequenceNo, setFinalSequenceNo] = useState("");
  const [articleSize, setArticleSize] = useState(20);
  const [imageCount, setImageCount] = useState(0);





  const [tags, setTags] = useState([]);
  const [imgFile, setImgFile] = useState([]);
  const [articleData, setArticleData] = useState("");
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

 
 const previewData =()=>{
  sessionStorage.setItem("data",articleData)
  history.push(`/admin-portal/preview`)
 }

  useEffect(() => {
    setImgFile(logo)
  }, [])

  return (
    <div>
      <Card>
        <Card.Body>
          <Card.Title>Add DigiCard</Card.Title>
          <Formik
            initialValues={{
              digicardname: '',
              digicardtitle: '',
              digicard_image: '',
              digicardcontent: ''
            }}
            validationSchema={Yup.object().shape({
              digicardname: Yup.string()
                .trim()
                .min(2, Constants.AddDigiCard.DigiCardNameTooShort)
                .max(50, Constants.AddDigiCard.DigiCardNameTooLong)
                .matches(Constants.AddDigiCard.DigiCardNameRegex, Constants.AddDigiCard.DigiCardNameValidation)
                .required(Constants.AddDigiCard.DigiCardNameRequired),
              digicardtitle: Yup.string()
                .trim()
                .min(2, Constants.AddDigiCard.DigiCardtitleTooShort)
                .max(50, Constants.AddDigiCard.DigiCardtitleTooLong)
                .matches(Constants.AddDigiCard.DigiCardtitleRegex, Constants.AddDigiCard.DigiCardtitleValidation)
                .required(Constants.AddDigiCard.DigiCardtitleRequired),
              digicard_image: Yup.string()
                .trim()
                .nullable(true, Constants.AddDigiCard.DigiCardFileNotNull)
                .required(Constants.AddDigiCard.DigiCardfileRequired),
            })}


            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

              console.log("on submit");
              var formData = {
                digi_card_name: values.digicardname,
                digi_card_title: values.digicardtitle,
                digi_card_files: [values.digicard_image],
                digicard_image: values.digicard_image,
                digi_card_content: articleData,
                digi_card_keywords: tags
              };



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

                        let blobField = document.getElementById('digicard_image').files[0];
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
                      sweetAlertHandler({ title: MESSAGES.TTTLES.Goodjob, type: 'success', text: MESSAGES.SUCCESS.AddingDigiCard });
                      hideLoader();
                      setDisableButton(false);
                      // fetchClientData();
                      setIsOpen(false);
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
                    if (error.response.status === 400) {
                      console.log();
                      hideLoader();
                      // setIsClientExists(true);
                      sweetAlertHandler({ title: 'Error', type: 'error', text: MESSAGES.ERROR.DigiCardNameExists });

                    } else {
                      sweetAlertHandler({ title: 'Error', type: 'error', text: error.response.data });
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
              // setSubmitting(true);
              console.log(formData);
              console.log('Submitting');

              // sla file validation
              let allFilesData = [];
              const fileNameArray = ['digicard_image'];

              fileNameArray.forEach((fileName) => {
                let selectedFile = document.getElementById(fileName).files[0];
                console.log('File is here!');
                console.log(selectedFile);
                if (selectedFile) {
                  allFilesData.push(selectedFile);
                }
              });

              console.log(allFilesData);

              if (allFilesData.length === 0) {
                showLoader();
                // if (contact === false) {
                setDisableButton(true);
                // _SubmitClient(formData);
                // }
              } else {
                if (areFilesInvalid(allFilesData) !== 0) {
                  setInvalidFile(true);
                } else {
                  showLoader();
                  // if (contact === false) {
                  setDisableButton(true);
                  // _SubmitClient(formData);
                  // }
                }
              }
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Row>
                  {/* {edit1Toggle && <Loader />} */}
                  <Col sm={6}>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="digicardname">
                        <small className="text-danger">* </small>DigiCard Name
                      </label>
                      <input
                        className="form-control"
                        error={touched.digicardname && errors.digicardname}
                        name="digicardname"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.digicardname}
                      />
                      {touched.digicardname && errors.digicardname && <small className="text-danger form-text">{errors.digicardname}</small>}
                      {/* {isClientExists && <small className="text-danger form-text">{MESSAGES.ERROR.ClientNameExists}</small>} */}
                    </div>
                    <div className="form-group fill">
                      <label className="floating-label" htmlFor="digicard_image">
                        <small className="text-danger">* </small>Choose File
                      </label>
                      <input
                        className="form-control"
                        error={touched.entityName && errors.entityName}
                        name="digicard_image"
                        id="digicard_image"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          previewImage(e);
                        }}
                        type="file"
                        value={values.digicard_image}
                        accept="image/*"
                      />
                      {touched.digicard_image && errors.digicard_image && (
                        <small className="text-danger form-text">{errors.digicard_image}</small>
                      )}
                    </div>
                    <div className='ReactTags'>
                      <label className="floating-label">
                        <small className="text-danger">* </small>KeyWords
                      </label>
                      <ReactTags
                        classNames={{ root: 'react-tags bootstrap-tagsinput', selectedTag: 'react-tags__selected-tag btn-primary' }}
                        allowNew={true}
                        tags={tags}
                        onDelete={handleDelete}
                        onAddition={(e) => handleAddition(e)}
                      />
                    </div>
                  </Col>
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
                      />
                      {touched.digicardtitle && errors.digicardtitle && <small className="text-danger form-text">{errors.digicardtitle}</small>}
                    </div>
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
                    <label className="floating-label" htmlFor="digicardtitle">
                      <small className="text-danger">* </small>DigiCard Content
                    </label>
                    {/* <JoditEditor className='form-control'
                      name='digicardcontent'
                      onBlur={(newContent) => setContent(newContent)}
                      onChange={handleChange}
                      value={values.digicardcontent}
                    /> */}
                    {/* <AddArticles /> */}
                    <ArticleRTE
                      setArticleSize={setArticleSize}
                      setImageCount={setImageCount}
                      imageCount={imageCount}
                      articleData={articleData}
                      setArticleData={setArticleData}
                    />
                  </Col>
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
                  <div className="form-group fill float-end" >
                    <Col sm={12} className="center">
                      <Button
                        className="btn-block"
                        color="success"
                        size="large"
                        type="submit"
                        variant="success"
                      // disabled={disableButton === true}
                      // onClick={(e) => {alert(`/auth/preview/${articleData}`); history.push(`/auth/preview/jklkjlk`)}}
                      onClick={previewData}
                      >
                        preview
                      </Button>
                    </Col>
                  </div>
                </Row>
          
        </Card.Body>

      </Card>

    </div>


  )

};

export default AddDigiCard;
