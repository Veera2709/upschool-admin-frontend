import React, { useEffect, useState } from "react";
import $ from "jquery";
import "../digicard/Styles/article.css";
import ArticlePanel from "./ArticlePanel";
import toast, { Toaster } from "react-hot-toast";
import ArticleRTE from "./ArticleRTE";
// import { useNavigate } from "react-router-dom";
import { add } from "../digicard/Redux/actions/addAction";
import {useHistory} from 'react-router-dom'
import { useDispatch } from "react-redux";
import { confirmAlert } from "react-confirm-alert";
var striptags = require("striptags");
function AddArticles({
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
}) {
  const [currentFeature, setCurrentFeature] = useState("");
  const [title, setTitle] = useState("");
  const [articleData, setArticleData] = useState("");
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

  const dispatch = useDispatch();
  let navigate = useHistory();
  useEffect(() => {
    dispatch(add(true));
    return () => {
      dispatch(add(false));
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem("addState", true);
    const formData = {
      session_id: sessionStorage.getItem("token"),
      category_id: category,
      subcategory_id: subCategory,
      device_id: device,
      login_user_id: sessionStorage.getItem("user_id"),
      login_user_role: sessionStorage.getItem("user_role")
    };
    $.post(
      sessionStorage.getItem("connection_url") + "/get_articles",
      formData,
      function (data) {
        let gg = 0;
        const ss = data.filter((ele) => {
          return ele != null && ele.article_status == "Published";
        });
        ss.forEach((ele) => {
          if (ele.sequence_no) {
            if (gg < Number(ele.sequence_no)) {
              gg = Number(ele.sequence_no);
            }
          }
        });

        setFinalSequenceNo(gg + 1);
      }
    ).fail(function (xhr) {
      if (xhr.status == 401) {
        sessionStorage.removeItem("token");
        navigate("/");
        window.location.reload();
      }
    });
  }, [category, subCategory, device]);
  useEffect(() => {
    const formData = {
      session_id: sessionStorage.getItem("token"),
      login_user_id: sessionStorage.getItem("user_id"),
      login_user_role: sessionStorage.getItem("user_role")
    };
    $.post(
      sessionStorage.getItem("connection_url") + "/get_terminal",
      formData,
      function (data) {
        const activeTerminal =
          data &&
          data.filter((ele) => {
            return (
              ele.terminal_status == "Active" ||
              ele.terminal_status == undefined
            );
          });
        setTerminalOption(activeTerminal);
        if (activeTerminal[0]) {
          // setDevice(activeTerminal[0].terminal_id);
          setDevice(terminal)
        }
      }
    ).fail(function (xhr) {
      if (xhr.status == 401) {
        sessionStorage.removeItem("token");
        navigate("/");
        window.location.reload();
      }
    });
  }, []);

  useEffect(() => {
    const formData = {
      session_id: sessionStorage.getItem("token"),
      category_id: category,
      login_user_id: sessionStorage.getItem("user_id"),
      login_user_role: sessionStorage.getItem("user_role")
    };
    $.post(
      sessionStorage.getItem("connection_url") + "/get_merged_categories",
      formData,
      function (data) {
        const activeSubCategory =
          data.subCategory &&
          data.subCategory.filter((ele) => {
            return (
              ele.subcategory_status == "Active" ||
              ele.subcategory_status == undefined
            );
          });
        if (activeSubCategory.length > 0) {
          setSubCategories(activeSubCategory);
          if (currentSubCategory) {
            setSubCategory(currentSubCategory)
            setCurrentSubCategory("")
          } else {
            setSubCategory(activeSubCategory[0].subcategory_id)
            setCurrentSubCategory(activeSubCategory[0].subcategory_id)

          }
        } else {
          setSubCategories([]);
          setSubCategory(null);
        }
      }
    ).fail(function (xhr) {
      if (xhr.status == 401) {
        sessionStorage.removeItem("token");
        navigate("/");
        window.location.reload();
      }
    });
  }, [category]);

  useEffect(() => {
    let activeSub = true;
    let activeSubArray = [];
    const formData1 = {
      session_id: sessionStorage.getItem("token"),
      category_id: category,
      login_user_id: sessionStorage.getItem("user_id"),
      login_user_role: sessionStorage.getItem("user_role")
    };
    $.post(
      sessionStorage.getItem("connection_url") + "/get_merged_categories",
      formData1,
      function (data) {
        const activeSubCategory =
          data.subCategory &&
          data.subCategory.filter((ele) => {
            return (
              ele.subcategory_status == "Active" ||
              ele.subcategory_status == undefined
            );
          });
        activeSubCategory.forEach((ele) => {
          activeSubArray.push(ele.subcategory_id);
        });
        if (data.subCategory.length > 0) {
          setSubCategories(activeSubCategory);
          setSubCategory(currentSubCategory);
        }
      }
    ).fail(function (xhr) {
      if (xhr.status == 401) {
        sessionStorage.removeItem("token");
        navigate("/");
        window.location.reload();
      }
    }, []);

    if (editMode) {
      const formData = {
        session_id: sessionStorage.getItem("token"),
        ID: currentArticle,
        login_user_id: sessionStorage.getItem("user_id"),
        login_user_role: sessionStorage.getItem("user_role")
      };
      $.post(
        sessionStorage.getItem("connection_url") + "/get_individual_article",
        formData,
        function (data) {
          let flagAnchor = false;
          categoryAPI.forEach((ele) => {
            if (ele.category_id == data.Items[0].category_id) {
              flagAnchor = true;
            }
          });
          setTitle(data.Items[0].article_title);
          setArticleData(data.Items[0].article_data);
          if (flagAnchor) {
            setCategoryName(data.Items[0].category_name);
            setSubCategoryName(data.Items[0].subcategory_name);
            setCategory(data.Items[0].category_id);
            if (
              data.Items[0].subcategory_id) {
              setSubCategory(data.Items[0].subcategory_id);
            } else {
              setSubCategory("");
            }
          }
          setFeatured(data.Items[0].article_featured);
          setCurrentFeature(data.Items[0].article_featured);
          // setDevice(data.Items[0].device_id);
          setDevice(terminal)
          setSubCategoryName(data.Items[0].category_name);
          setCurrentStatus(data.Items[0].article_status);
          setUniqueArtricle(data.Items[0].article_id);
          setCreatedAt(data.Items[0].created_ts);
          setCreatedBy(data.Items[0].user_created);
          setModifiedAt(data.Items[0].updated_ts);
          setModifiedBy(data.Items[0].last_updated_by);
          setViews(data.Items[0].view_count);
          setUpvotes(data.Items[0].up_votes);
          setDownvotes(data.Items[0].down_votes);
        }
      ).fail(function (xhr) {
        if (xhr.status == 401) {
          sessionStorage.removeItem("token");
          navigate("/");
          window.location.reload();
        }
      });
    } else {
      setTitle("");
      setArticleData("");
    }
  }, [editMode]);

  const notifyError = (a) => {
    toast.error(a, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const notifySuccess = (a) => {
    toast.success(a, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const handleArticleSubmit = (status) => {
    const toastId = toast.loading("loading...", {
      position: "top-right",
    });
    setSubmitAnchor(true);
    if (!editMode) {
      if (
        category &&
        device &&
        Boolean(
          striptags(articleData)
            .replace(/\&nbsp;/g, "")
            .trimStart()
        ) &&
        Boolean(title.trimStart()) &&
        featured
      ) {
        let featuredNo = 0;
        const a = articlesList.filter((ele) => {
          return (
            ele.article_status == "Published" &&
            ele.article_featured == "Yes" &&
            ele.device_id == device
          );
        });
        a.forEach((ele) => {
          if (ele.featured_sequence_no) {
            if (featuredNo < Number(ele.featured_sequence_no)) {
              featuredNo = Number(ele.featured_sequence_no);
            }
          }
        });
        if (featuredNo == 0) {
          featuredNo = 1;
        } else {
          featuredNo = featuredNo + 1;
        }
        const formData = {
          user_id: sessionStorage.getItem("user_id"),
          category_id: category,
          device_id: device,
          article_data: articleData,
          subcategory_id: $("#sub_category").val(),
          session_id: sessionStorage.getItem("token"),
          article_title: title.trimStart(),
          article_featured:
            status == "UnPublished" || status == "Draft" || status == "Archived"
              ? "No"
              : featured,
          article_status: status,
          category_name: categoryName,
          subcategory_name: subCategoryName,
          user_name: sessionStorage.getItem("user_name"),
          up_votes: 0,
          down_votes: 0,
          view_count: 0,
          featured_sequence_no:
            featured == "Yes" && status == "Published" ? featuredNo : 0,
          sequence_no: finalSequenceNo,
          login_user_id: sessionStorage.getItem("user_id"),
          login_user_role: sessionStorage.getItem("user_role")
        };
        if (status == "Published") {
          if (a.length < 6) {
            if (a.length == 5 && featured == "Yes") {
              setSubmitAnchor(false);
              notifyError("Featured articles cannot be more than 5");
              toast.dismiss(toastId);
            } else {
              if (articleSize < 400) {
                $.post(
                  sessionStorage.getItem("connection_url") + "/save_articles",
                  formData,
                  function (data) {
                    toast.dismiss(toastId);
                    setTabChange(true);
                    notifySuccess("Article Added");
                    setEditArticle(true);
                    setAdded(!added);
                  }
                ).fail(function (xhr) {
                  toast.dismiss(toastId);
                  setSubmitAnchor(false);
                  if (xhr.status == 401) {
                    sessionStorage.removeItem("token");
                    navigate("/");
                    window.location.reload();
                  }
                  notifyError("Something Went wrong");
                  toast.dismiss(toastId);
                });
              } else {
                setSubmitAnchor(false);
                notifyError("Article size cannot be more than 400kb");
                toast.dismiss(toastId);
              }
            }
          } else {
            setSubmitAnchor(false);
            notifyError("Featured articles cannot be more than 5");
            toast.dismiss(toastId);
          }
        } else {
          if (articleSize < 400) {
            $.post(
              sessionStorage.getItem("connection_url") + "/save_articles",
              formData,
              function (data) {
                toast.dismiss(toastId);
                setTabChange(true);
                notifySuccess("Article Added");
                setEditArticle(true);
                setAdded(!added);
              }
            ).fail(function (xhr) {
              toast.dismiss(toastId);
              setSubmitAnchor(false);
              if (xhr.status == 401) {
                sessionStorage.removeItem("token");
                navigate("/");
                window.location.reload();
              }
              notifyError("Something Went wrong");
            });
          } else {
            setSubmitAnchor(false);
            notifyError("Article size cannot be more than 400kb");
          }
        }
      } else {
        setSubmitAnchor(false);
        if (category && device && Boolean(title.trimStart()) && featured) {
          setSubmitAnchor(false);
          notifyError(" Article body should contain text");
          toast.dismiss(toastId);
        } else {
          setSubmitAnchor(false);
          notifyError("Please fill in all the values");
          toast.dismiss(toastId);
        }
      }
    } else {
      if (
        category &&
        device &&
        Boolean(striptags(articleData).trimStart()) &&
        Boolean(title.trimStart()) &&
        featured
      ) {
        toast.dismiss(toastId)
        const a = articlesList.filter((ele) => {
          return (
            ele.article_status == "Published" &&
            ele.article_featured == "Yes" &&
            ele.device_id == device
          );
        });
        let featuredNoSecond = 0;
        a.forEach((ele) => {
          if (ele.featured_sequence_no) {
            if (featuredNoSecond < Number(ele.featured_sequence_no)) {
              featuredNoSecond = Number(ele.featured_sequence_no);
            }
          }
        });
        if (featuredNoSecond == 0) {
          featuredNoSecond = 1;
        } else {
          featuredNoSecond = featuredNoSecond + 1;
        }
        if (a.length == 5 && featured == "Yes" && status == "Published") {
          if (currentFeature != featured) {
            setSubmitAnchor(false);
            notifyError("Featured articles cannot be more than five");
          } else {
            // if (imageCount < 10) {
            if (articleSize < 400) {
              const formData = {
                login_user_id: sessionStorage.getItem("user_id"),
                login_user_role: sessionStorage.getItem("user_role"),
                ID: currentArticle,
                user_id: sessionStorage.getItem("user_id"),
                category_id: category,
                subcategory_id: subCategory,
                device_id: device,
                article_data: articleData,
                session_id: sessionStorage.getItem("token"),
                article_title: title.trimStart(),
                article_featured: status != "Published" ? "No" : featured,
                article_status: status,
                user_name: sessionStorage.getItem("user_name"),
                sequence_no: status == "Published" ? finalSequenceNo : 0,
                featured_sequence_no:
                  status == "Published" && featured == "Yes"
                    ? featuredNoSecond
                    : 0,
              };
              $.post(
                sessionStorage.getItem("connection_url") + "/update_article",
                formData,
                function (data) {
                  toast.dismiss(toastId);
                  setTabChange(true);
                  notifySuccess("Updated Article");
                  setEditArticle(true);
                  setAdded(!added);
                }
              ).fail(function (xhr) {
                toast.dismiss(toastId);
                setSubmitAnchor(false);
                if (xhr.status == 401) {
                  sessionStorage.removeItem("token");
                  navigate("/");
                  window.location.reload();
                }
                notifyError("Something went wrong");
              });
            } else {
              setSubmitAnchor(false);
              notifyError("Article size cannot be more than 400kb");
            }
          }
        } else {
          if (articleSize < 400) {
            const formData = {
              login_user_id: sessionStorage.getItem("user_id"),
              login_user_role: sessionStorage.getItem("user_role"),
              ID: currentArticle,
              user_id: sessionStorage.getItem("user_id"),
              category_id: category,
              subcategory_id: subCategory,
              device_id: device,
              article_data: articleData,
              session_id: sessionStorage.getItem("token"),
              article_title: title.trimStart(),
              article_featured: status != "Published" ? "No" : featured,
              article_status: status,
              user_name: sessionStorage.getItem("user_name"),
              sequence_no: status == "Published" ? finalSequenceNo : 0,
              featured_sequence_no:
                status == "Published" && featured == "Yes"
                  ? featuredNoSecond
                  : 0,
            };

            $.post(
              sessionStorage.getItem("connection_url") + "/update_article",
              formData,
              function (data) {
                setTabChange(true);
                notifySuccess("Updated Article");
                setEditArticle(true);
                setAdded(!added);
              }
            ).fail(function (xhr) {
              setSubmitAnchor(false);
              if (xhr.status == 401) {
                sessionStorage.removeItem("token");
                navigate("/");
                window.location.reload();
              }
              notifyError("Something went wrong");
            });
          } else {
            setSubmitAnchor(false);
            notifyError("Article size cannot be more than 400kb");
          }
        }
      } else {
        toast.dismiss(toastId)
        setSubmitAnchor(false);
        if (category && device && Boolean(title.trimStart()) && featured) {
          notifyError(" Article body should contain text");
        } else {
          notifyError("Please fill in all the values");
          toast.dismiss(toastId);
        }
      }
    }
  };

  const cancelArticle = () => {
    const submitOnAgain = () => {
      confirmAlert({
        title: "You have unsaved changes.",
        message: "Are you sure you want to leave this page?",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              setEditArticle(true);
              setTabChange(true);
            },
          },
          {
            label: "No",
          },
        ],
      });
    };
    submitOnAgain();
  };
  return (
    <div>
      {sessionStorage.getItem("user_role") == "Viewer" && (
        <button
          onClick={() => {
            setEditArticle(true);
            setTabChange(true);
          }}
          className="btn btn-primary m-3"
        >
          <i class="fas fa-long-arrow-alt-left"></i>
          &nbsp; Back to List
        </button>
      )}
      <div className="panel m-2 ">
        <div className="col-9">
          <div className="form-group">
            <label> Article Title*</label>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="How to set up a device?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              autoComplete="off"
              disabled={sessionStorage.getItem("user_role") == "Viewer"}
            />
          </div>
          <ArticleRTE
            setArticleSize={setArticleSize}
            setImageCount={setImageCount}
            imageCount={imageCount}
            articleData={articleData}
            setArticleData={setArticleData}
          />
          <div className="form-group footer-article">
            <div>Current Status: {currentStatus}</div>{" "}
            <div>Article Size: {articleSize && articleSize} kb </div>
          </div>
        </div>
        <div className="panel-inner  sc2">
          <br />
          <br />
          <br />
          <ArticlePanel
            currentSubCategory={currentSubCategory}
            setCurrentSubCategory={setCurrentSubCategory}
            title={title}
            articleData={articleData}
            subCategories={subCategories}
            setSubCategories={setSubCategories}
            terminalOption={terminalOption}
            modifiedAt={modifiedAt}
            modifiedBy={modifiedBy}
            createdAt={createdAt}
            createdBy={createdBy}
            setCategoryNameEdit={setCategoryNameEdit}
            categoryNameEdit={categoryNameEdit}
            subCategoryNameEdit={subCategoryName}
            categoryName={categoryName}
            setCategoryName={setCategoryName}
            subCategoryName={subCategoryName}
            setSubCategoryName={setSubCategoryName}
            categoryAPI={categoryAPI}
            category={category}
            setCategory={setCategory}
            categoryCollection={categoryCollection}
            setCategoryCollection={setCategoryCollection}
            subCategory={subCategory}
            setSubCategory={setSubCategory}
            subCollection={subCollection}
            setSubCollection={setSubCollection}
            device={device}
            setDevice={setDevice}
            featured={featured}
            setFeatured={setFeatured}
            editMode={editMode}
            uniqueArticle={uniqueArticle}
            views={views}
            upvotes={upvotes}
            downvotes={downvotes}
          />
        </div>
      </div>
      <div className="article-buttons">
        <button
          onClick={() => handleArticleSubmit("Published")}
          className="btn btn-primary"
          disabled={
            sessionStorage.getItem("user_role") == "Viewer" || submitAnchor
          }
        >
          Publish
        </button>
        &nbsp;
        {editMode && currentStatus != "Draft" && (
          <>
            {" "}
            {editMode && (
              <>
                <button
                  onClick={() => handleArticleSubmit("Unpublished")}
                  className="btn btn-primary"
                  disabled={
                    sessionStorage.getItem("user_role") == "Viewer" ||
                    submitAnchor ||
                    currentStatus == "Unpublished"
                  }
                >
                  Unpublish
                </button>{" "}
                &nbsp;
              </>
            )}
          </>
        )}
        <button
          onClick={cancelArticle}
          className="btn btn-primary"
          disabled={sessionStorage.getItem("user_role") == "Viewer"}
        >
          Cancel
        </button>
        &nbsp;
        <button
          onClick={() => handleArticleSubmit("Draft")}
          className="btn btn-primary"
          disabled={
            sessionStorage.getItem("user_role") == "Viewer" || submitAnchor
          }
        >
          Save as Draft
        </button>
        <Toaster />
      </div>
    </div>
  );
}

export default AddArticles;
