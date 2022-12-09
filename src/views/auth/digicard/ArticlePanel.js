import React, { useEffect, useState } from "react";
// import "../digicard/Styles/article.css";
import "../digicard/Styles/article.css";
import PreviewModal from "./PreviewModal";

function ArticlePanel({
  uniqueArticle,
  title,
  articleData,
  subCategories,
  terminalOption,
  modifiedAt,
  modifiedBy,
  createdAt,
  createdBy,
  categoryAPI,
  subCategory,
  setSubCategory,
  setCurrentSubCategory,
  currentSubCategory,
  subCategoryName,
  setSubCategoryName,
  device,
  featured,
  setFeatured,
  setDevice,
  category,
  setCategory,
  editMode,
  views,
  upvotes,
  downvotes,
}) {
  const [modalShow, setModalShow] = useState(false);
  console.log("getting first",subCategories)
  useEffect(() => {
    if (!editMode) {
      if (categoryAPI[0]) {
        setCategory(categoryAPI[0].category_id);
      }
    }
  }, []);
  useEffect(() => {
    if (!editMode) {
      if (subCategories[0]) {
        setSubCategory(subCategories[0].subcategory_id);
      }
    }
  }, [subCategories]);

  useEffect(() => {
    if (!editMode) {
      if (subCategories[0]) {
        setSubCategory(subCategories[0].subcategory_id);
      }
    }
  }, [category]);

  useEffect(()=>{
    setSubCategory(currentSubCategory)
  },[])

  return (
    <div>
      <div className="publish-preview" onClick={() => setModalShow(true)}>
        <i class="far fa-eye"></i>&nbsp;
        <span>Preview</span>
      </div>
      <hr />
      <div className="form-group">
        <label>Terminal*</label>
        <select
          value={device}
          onChange={(e) => setDevice(e.target.value)}
          className="form-control"
          disabled={sessionStorage.getItem("user_role") == "Viewer"}
        >
          {terminalOption.map((ele) => {
            return <option value={ele.terminal_id}>{ele.terminal_name}</option>;
          })}
        </select>
      </div>
      <div className="form-group">
        <label>Category*</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-control"
          disabled={sessionStorage.getItem("user_role") == "Viewer"}
        >
          {categoryAPI.map((ele) => {
            return (
              <>
                <option value={ele.category_id}>{ele.category_name}</option>
              </>
            );
          })}
        </select>
      </div>
      <div className="form-group">
        <label>Sub-Category*</label>
        <select
          id="sub_category"
          value={subCategory}
          onChange={(e) => {
            setSubCategory(e.target.value)}}
          className="form-control"
          disabled={sessionStorage.getItem("user_role") == "Viewer"}
        >
          {subCategories &&
            subCategories.map((ele) => {
              return (
                <option value={ele.subcategory_id}>
                  {ele.subcategory_name}
                </option>
              );
            })}
        </select>
      </div>
      <div className="form-group">
        <label>Featured*</label>
        <div className="card-body ">
          <div
            className="btn-group btn-group-toggle inner-1"
            data-toggle="buttons"
          >
            <label
              className={
                featured == "No" ? "btn btn-primary" : "btn btn-secondary"
              }
            >
              <input
                value="No"
                type="radio"
                name="options"
                id="option_a1"
                autoComplete="off"
                checked={featured == "No"}
                disabled={sessionStorage.getItem("user_role") == "Viewer"}
                onChange={(e) => setFeatured(e.target.value)}
              />{" "}
              <i className="fas fa-ban"></i>
            </label>
            <label
              className={
                featured == "Yes" ? "btn btn-primary" : "btn btn-secondary"
              }
            >
              <input
                value="Yes"
                checked={featured == "Yes"}
                onChange={(e) => setFeatured(e.target.value)}
                type="radio"
                name="options"
                id="option_a2"
                autoComplete="off"
                disabled={sessionStorage.getItem("user_role") == "Viewer"}
              />{" "}
              <i class="fas fa-star"></i>
            </label>
          </div>
        </div>
      </div>
      {editMode && (
        <div className="panel-footer-child">
          <div>Article ID-{uniqueArticle}</div>
          <div>Published at - {createdAt}</div>
          <div>Published by - {createdBy} </div>
          <div>Modified at - {modifiedAt} </div>
          <div>Modified by - {modifiedBy} </div>
          <div>View Count - {views}</div>
          <div>Up Votes - {upvotes}</div>
          <div>Down Votes - {downvotes} </div>
          <br />
          <br />
        </div>
      )}
      <PreviewModal
        title={title}
        device={device}
        show={modalShow}
        onHide={() => setModalShow(false)}
        articleData={articleData}
      />
    </div>
  );
}

export default ArticlePanel;
