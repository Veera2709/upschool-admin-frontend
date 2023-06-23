import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Row, Col, Card, Pagination, Button, Modal } from "react-bootstrap";
import BTable from "react-bootstrap/Table";
import axios from "axios";
import { SessionStorage } from "../../../../util/SessionStorage";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import MESSAGES from "../../../../helper/messages";
import { useHistory } from "react-router-dom";

import { GlobalFilter } from "../../../common-ui-components/tables/GlobalFilter";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
  useRowSelect,
} from "react-table";
import dynamicUrl from "../../../../helper/dynamicUrls";
import useFullPageLoader from "../../../../helper/useFullPageLoader";
import AddConcepts from "./AddConcepts";
import EditConcepts from "./EditConcepts";
import BasicSpinner from "../../../../helper/BasicSpinner";
import { getAllworkSheetQuestions } from '../../../api/CommonApi';


function Table({ columns, data, _workSheetQuestions }) {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [conceptData, setConceptData] = useState([]);
  const [_conceptID, _setConceptID] = useState("");
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [pageLocation, setPageLocation] = useState(
    useLocation().pathname.split("/")[2]
  );
  const [digicardsAndConcepts, setDigicardsAndConcepts] = useState(false);
  const [fetchAllGroups, setFetchAllGroups] = useState(false);
  const [_relatedConcepts, _setRelatedConcepts] = useState([]);
  const [_digicards, _setDigicards] = useState([]);
  const [_basicGroups, _setBasicGroups] = useState([]);
  const [_intermediateGroups, _setIntermediateGroups] = useState([]);
  const [_advancedGroups, _setAdvancedGroups] = useState([]);
  const [editConceptID, setEditConceptID] = useState("");

  const [isOpenAddConcept, setIsOpenAddConcept] = useState(false);
  const [isEditAddConcept, setIsOpenEditConcept] = useState(false);

  const concept_status =
    pageLocation === "active-concepts" ? "Active" : "Archived";

  const MySwal = withReactContent(Swal);

  const sweetAlertHandler = (alert) => {
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      icon: alert.type,
    });
  };



  useEffect(() => {
    fetchAllConceptsData();
  }, []);

  useEffect(() => {
    axios
      .post(
        dynamicUrl.fetchDigicardAndConcept,
        {},
        {
          headers: { Authorization: sessionStorage.getItem("user_jwt") },
        }
      )
      .then((response) => {
        let result = response.status === 200;
        hideLoader();

        if (result) {
          console.log("inside res fetchDigicardAndConcept");

          let responseData = response.data;
          console.log(responseData);
          // setDisableButton(false);
          hideLoader();
          _setRelatedConcepts(responseData.conceptList);
          _setDigicards(responseData.digicardList);
        } else {
          console.log("else res");

          hideLoader();
        }
      })
      .catch((error) => {
        if (error.response) {
          hideLoader();
          // Request made and server responded
          console.log(error.response.data);

          if (error.response.data === "Invalid Token") {
            sessionStorage.clear();
            localStorage.clear();

            history.push("/auth/signin-1");
            window.location.reload();
          } else {
            sweetAlertHandler({
              title: "Error",
              type: "error",
              text: error.response.data,
            });
            fetchAllConceptsData();
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
          hideLoader();
          fetchAllConceptsData();
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
          hideLoader();
          fetchAllConceptsData();
        }
      });
  }, [digicardsAndConcepts]);

  useEffect(() => {
    axios
      .post(
        dynamicUrl.fetchAllTypesOfGroups,
        {},
        {
          headers: { Authorization: sessionStorage.getItem("user_jwt") },
        }
      )
      .then((response) => {
        let result = response.status === 200;
        hideLoader();

        if (result) {
          console.log("inside res fetchAllTypesOfGroups");

          let responseData = response.data;
          console.log(responseData);
          // setDisableButton(false);
          hideLoader();
          _setBasicGroups(responseData.Basic);
          _setIntermediateGroups(responseData.Intermediate);
          _setAdvancedGroups(responseData.Advanced);
        } else {
          console.log("else res");

          hideLoader();
        }
      })
      .catch((error) => {
        if (error.response) {
          hideLoader();
          // Request made and server responded
          console.log(error.response.data);

          if (error.response.data === "Invalid Token") {
            sessionStorage.clear();
            localStorage.clear();

            history.push("/auth/signin-1");
            window.location.reload();
          } else {
            sweetAlertHandler({
              title: "Error",
              type: "error",
              text: error.response.data,
            });
            fetchAllConceptsData();
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
          hideLoader();
          fetchAllConceptsData();
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
          hideLoader();
          fetchAllConceptsData();
        }
      });
  }, [fetchAllGroups]);



  const sweetConfirmHandler = (alert, concept_id, updateStatus) => {
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      type: alert.type,
      showCloseButton: true,
      showCancelButton: true,
    }).then((willDelete) => {
      if (willDelete.value) {
        showLoader();
        deleteConcept(concept_id, updateStatus);
      } else {
        // const returnValue = pageLocation === 'active-concepts' ? (
        //     MySwal.fire('', MESSAGES.INFO.DATA_SAFE, 'success')
        // ) : (
        //     MySwal.fire('', MESSAGES.INFO.FAILED_TO_RESTORE, 'error')
        // )
        // return returnValue;
      }
    });
  };

  const saveConceptIdDelete = (e, concept_id, updateStatus) => {
    e.preventDefault();

    pageLocation === "active-concepts"
      ? sweetConfirmHandler(
        {
          title: MESSAGES.TTTLES.AreYouSure,
          type: "warning",
          text: MESSAGES.INFO.ABLE_TO_RECOVER,
        },
        concept_id,
        updateStatus
      )
      : sweetConfirmHandler(
        {
          title: MESSAGES.TTTLES.AreYouSure,
          type: "warning",
          text: "This will restore the concept!",
        },
        concept_id,
        updateStatus
      );
  };

  const fetchAllConceptsData = () => {
    setIsLoading(true);
    showLoader();
    console.log(pageLocation);

    const conceptStatus =
      pageLocation === "active-concepts" ? "Active" : "Archived";

    axios
      .post(
        dynamicUrl.fetchAllConcepts,
        {
          data: {
            concept_status: conceptStatus,
          },
        },
        { headers: { Authorization: SessionStorage.getItem("user_jwt") } }
      )

      .then(async (response) => {
        console.log(response.data);
        console.log(response.data.Items);
        hideLoader();

        setDigicardsAndConcepts(true);
        setFetchAllGroups(true);

        if (response.data.Items) {
          const responseData = response.data.Items;

          console.log("responseData", responseData);

          let finalDataArray = [];

          for (let index = 0; index < responseData.length; index++) {
            responseData[index].id = index + 1;

            responseData[index]["action"] = (
              <>
                {console.log(pageLocation)}
                {pageLocation === "active-concepts" ? (
                  <>
                    <Button
                      size="sm"
                      className="btn btn-icon btn-rounded btn-info"
                      onClick={(e) => {
                        setEditConceptID(responseData[index].concept_id);
                        setIsOpenEditConcept(true);
                      }}
                    >
                      <i className="feather icon-edit" /> &nbsp; Edit
                    </Button>{" "}
                    &nbsp;
                    <Button
                      size="sm"
                      className="btn btn-icon btn-rounded btn-danger"
                      onClick={(e) =>
                        saveConceptIdDelete(
                          e,
                          responseData[index].concept_id,
                          "Archived"
                        )
                      }
                    >
                      <i className="feather icon-trash-2" /> &nbsp;Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      className="btn btn-icon btn-rounded btn-primary"
                      onClick={(e) =>
                        saveConceptIdDelete(
                          e,
                          responseData[index].concept_id,
                          "Active"
                        )
                      }
                    >
                      <i className="feather icon-plus" /> &nbsp;Restore
                    </Button>
                  </>
                )}
              </>
            );
            finalDataArray.push(responseData[index]);
          }

          console.log(finalDataArray);
          setConceptData([...finalDataArray]);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (error.response) {
          // Request made and server responded
          hideLoader();
          console.log(error.response.data);

          if (error.response.data === "Invalid Token") {
            sessionStorage.clear();
            localStorage.clear();

            history.push("/auth/signin-1");
            window.location.reload();
          } else {
            sweetAlertHandler({
              title: "Error",
              type: "error",
              text: error.response.data,
            });
            fetchAllConceptsData();
          }
        } else if (error.request) {
          // The request was made but no response was received
          hideLoader();
          console.log(error.request);
          fetchAllConceptsData();
        } else {
          // Something happened in setting up the request that triggered an Error
          hideLoader();
          console.log("Error", error.message);
          fetchAllConceptsData();
        }
      });
  };

  const handleAddConcepts = (e) => {
    console.log("No concepts, add concepts");
    e.preventDefault();
    setIsOpenAddConcept(true);
  };

  const deleteConcept = (concept_id, updateStatus) => {
    const values = {
      concept_id: concept_id,
      concept_status: updateStatus,
    };

    console.log(values);

    axios
      .post(
        dynamicUrl.toggleConceptStatus,
        {
          data: {
            concept_id: concept_id,
            concept_status: updateStatus,
          },
        },
        { headers: { Authorization: SessionStorage.getItem("user_jwt") } }
      )
      .then(async (response) => {
        if (response.Error) {
          hideLoader();

          if (response.Error.data === "Invalid Token") {
            sessionStorage.clear();
            localStorage.clear();

            history.push("/auth/signin-1");
            window.location.reload();
          } else {
            sweetAlertHandler({
              title: MESSAGES.TTTLES.Sorry,
              type: "warning",
              text: MESSAGES.ERROR.DeletingConcept,
            });
            fetchAllConceptsData();
          }
        } else {
          hideLoader();
          updateStatus === "Active"
            ? MySwal.fire("", MESSAGES.INFO.CONCEPT_RESTORED, "success")
            : MySwal.fire("", MESSAGES.INFO.CONCEPT_DELETED, "success");
          fetchAllConceptsData();
        }
      })
      .catch((error) => {
        if (error.response) {
          // Request made and server responded
          hideLoader();
          console.log(error.response.data);

          if (error.response.data === "Invalid Token") {
            sessionStorage.clear();
            localStorage.clear();

            history.push("/auth/signin-1");
            window.location.reload();
          } else {
            sweetAlertHandler({
              title: "Sorry",
              type: "warning",
              text: error.response.data,
            });
            fetchAllConceptsData();
          }
        } else if (error.request) {
          // The request was made but no response was received
          hideLoader();
          console.log(error.request);
          fetchAllConceptsData();
        } else {
          // Something happened in setting up the request that triggered an Error
          hideLoader();
          console.log("Error", error.message);
          fetchAllConceptsData();
        }
      });
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,

    globalFilter,
    setGlobalFilter,

    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );

  const toggleFunction = () => {
    let arrayWithConcepts = [];
    page.map((e) => {
      e.isSelected === true && arrayWithConcepts.push(e.original.concept_id);
    });

    console.log("arrayWithConcepts.length", arrayWithConcepts.length);
    console.log("CHECKED IDS : ", arrayWithConcepts);

    if (arrayWithConcepts.length === 0) {
      const MySwal = withReactContent(Swal);
      return MySwal.fire("Sorry", "No Concepts Selected!", "warning").then(
        () => {
          window.location.reload();
        }
      );
    }

    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "Are you sure?",
      text:
        pageLocation === "active-concepts"
          ? "Confirm deleting"
          : "Confirm restoring",
      type: "warning",
      showCloseButton: true,
      showCancelButton: true,
    }).then((willDelete) => {
      if (willDelete.value) {
        console.log("api calling");
        // changeStatus(digi_card_id, digi_card_title);
        console.log("Request : ", {
          concept_status: concept_status === "Active" ? "Archived" : "Active",
          concept_array: arrayWithConcepts,
        });

        axios
          .post(
            dynamicUrl.bulkToggleConceptStatus,
            {
              data: {
                concept_status:
                  concept_status === "Active" ? "Archived" : "Active",
                concept_array: arrayWithConcepts,
              },
            },
            {
              headers: { Authorization: sessionStorage.getItem("user_jwt") },
            }
          )
          .then(async (response) => {
            console.log("response : ", response);
            if (response.Error) {
              console.log("Error");
              hideLoader();
              // sweetAlertHandler({ title: MESSAGES.TTTLES.Sorry, type: 'error', text: MESSAGES.ERROR.DeletingUser });
              pageLocation === "active-concepts"
                ? sweetAlertHandler({
                  title: MESSAGES.TTTLES.Sorry,
                  type: "error",
                  text: MESSAGES.ERROR.DeletingConcept,
                })
                : sweetAlertHandler({
                  title: MESSAGES.TTTLES.Sorry,
                  type: "error",
                  text: MESSAGES.ERROR.RestoringConcept,
                });
              history.push("/admin-portal/" + pageLocation);
            } else {
              console.log("response : ", response);
              if (response.data === 200) {
                MySwal.fire({
                  title:
                    pageLocation === "active-concepts"
                      ? "Concepts Deleted"
                      : "Concepts Restored",
                  icon: "success",
                  // text: (pageLocation === 'active-concepts') ? 'Unit Deleted' : 'Unit Restored',
                  // type: 'success',
                }).then((willDelete) => {
                  window.location.reload();
                });
              }
            }
            //new
          })
          .catch(async (errorResponse) => {
            console.log("errorResponse : ", errorResponse);
            if (errorResponse.response.data) {
              MySwal.fire({
                title: MESSAGES.TTTLES.Sorry,
                icon: "error",
                text: errorResponse.response.data,
                // type: 'success',
              }).then((willDelete) => {
                window.location.reload();
              });
            }
          });
      }
    });
  };
  return (
    <>
      {conceptData && data && (
        <>
          <Row className="mb-3">
            <Col className="d-flex align-items-center">
              Show
              <select
                className="form-control w-auto mx-2"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              Entries
            </Col>
            <Col className="d-flex justify-content-end">
              <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />

              {pageLocation === "active-concepts" ? (
                <>
                  <Button
                    variant="success"
                    className="btn-sm btn-round has-ripple ml-2"
                    onClick={(e) => {
                      handleAddConcepts(e);
                    }}
                  >
                    <i className="feather icon-plus" /> Add Concepts
                  </Button>
                  <Button
                    // variant="danger"
                    className="btn-sm btn-round has-ripple ml-2 btn btn-danger"
                    style={{ whiteSpace: "no-wrap" }}
                    onClick={(e) => {
                      // handleAddConcepts(e);
                      toggleFunction();
                    }}
                  >
                    <i className="feather icon-trash-2" /> Multi Delete
                  </Button>
                </>
              ) : (
                <Button
                  // variant="success"
                  className="btn-sm btn-round has-ripple ml-2 btn btn-primary"
                  style={{ whiteSpace: "no-wrap" }}
                  onClick={(e) => {
                    // handleAddConcepts(e);
                    toggleFunction();
                  }}
                >
                  <i className="feather icon-plus" /> Multi Restore
                </Button>
              )}
            </Col>
          </Row>

          <BTable striped bordered hover responsive {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    // Add the sorting props to control sorting. For this example
                    // we can add them into the header props
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      {
                        // Add a sort direction indicator //
                      }
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <span className="feather icon-arrow-down text-muted float-right" />
                          ) : (
                            <span className="feather icon-arrow-up text-muted float-right" />
                          )
                        ) : (
                          ""
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </BTable>

          <Row className="justify-content-between">
            <Col>
              <span className="d-flex align-items-center">
                Page{" "}
                <strong>
                  {" "}
                  {pageIndex + 1} of {pageOptions.length}{" "}
                </strong>{" "}
                | Go to page:{" "}
                <input
                  className="form-control ml-2"
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  defaultValue={pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    gotoPage(page);
                  }}

                  style={{ width: "100px" }}
                />
              </span>
            </Col>
            <Col>
              <Pagination className="justify-content-end">
                <Pagination.First
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                />
                <Pagination.Prev
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                />
                <Pagination.Next
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                />
                <Pagination.Last
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                />
              </Pagination>
            </Col>
          </Row>

          <Modal
            dialogClassName="my-modal"
            show={isOpenAddConcept}
            onHide={() => setIsOpenAddConcept(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title as="h5">Add Concept</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <AddConcepts
                _digicards={_digicards}
                _relatedConcepts={_relatedConcepts}
                setIsOpenAddConcept={setIsOpenAddConcept}
                fetchAllConceptsData={fetchAllConceptsData}
                setDigicardsAndConcepts={setDigicardsAndConcepts}
                setFetchAllGroups={setFetchAllGroups}
                _basicGroups={_basicGroups}
                _intermediateGroups={_intermediateGroups}
                _advancedGroups={_advancedGroups}
                _workSheetQuestions={_workSheetQuestions}
              />
            </Modal.Body>
          </Modal>

          <Modal
            dialogClassName="my-modal"
            show={isEditAddConcept}
            onHide={() => setIsOpenEditConcept(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title as="h5">Edit Concept</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <EditConcepts
                _digicards={_digicards}
                _relatedConcepts={_relatedConcepts}
                editConceptID={editConceptID}
                setIsOpenEditConcept={setIsOpenEditConcept}
                fetchAllConceptsData={fetchAllConceptsData}
                _basicGroups={_basicGroups}
                _intermediateGroups={_intermediateGroups}
                _advancedGroups={_advancedGroups}
              />
            </Modal.Body>
          </Modal>
        </>
      )}
    </>
  );
}

const ConceptTableView = ({ userStatus }) => {
  const columns = React.useMemo(
    () => [
      {
        id: "selection",

        Header: ({ getToggleAllRowsSelectedProps }) => (
          <div>
            <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
          </div>
        ),
        Cell: ({ row }) => (
          <div>
            <input type="checkbox" {...row.getToggleRowSelectedProps()} />
          </div>
        ),
      },
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "Concept Name",
        accessor: "concept_title",
      },
      {
        Header: "Options",
        accessor: "action",
      },
    ],
    []
  );

  // const data = React.useMemo(() => makeData(50), []);

  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [conceptData, setConceptData] = useState([]);
  const [_conceptID, _setConceptID] = useState("");
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [pageLocation, setPageLocation] = useState(
    useLocation().pathname.split("/")[2]
  );
  const [digicardsAndConcepts, setDigicardsAndConcepts] = useState(false);
  const [fetchAllGroups, setFetchAllGroups] = useState(false);
  const [_relatedConcepts, _setRelatedConcepts] = useState([]);
  const [_digicards, _setDigicards] = useState([]);
  const [_basicGroups, _setBasicGroups] = useState([]);
  const [_intermediateGroups, _setIntermediateGroups] = useState([]);
  const [_advancedGroups, _setAdvancedGroups] = useState([]);

  const [isOpenAddConcept, setIsOpenAddConcept] = useState(false);
  const [isEditAddConcept, setIsOpenEditConcept] = useState(false);
  const [editConceptID, setEditConceptID] = useState("");
  const [_workSheetQuestions, _setWorkSheetQuestions] = useState([])


  const MySwal = withReactContent(Swal);

  const sweetAlertHandler = (alert) => {
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      icon: alert.type,
    });
  };

  const getAllQuestions = async () => {
    let data = {
      question_active_status: "Active",
      question_status: "Publish",
      questions_type: "worksheetOrTest"
    }
    const allQuestionsData = await getAllworkSheetQuestions(data);
    if (allQuestionsData.Error) {
      if (allQuestionsData.Error.response.data === 'Invalid Token') {
        sessionStorage.clear();
        localStorage.clear();
        history.push('/auth/signin-1');
      } else {
        console.log("allQuestionsData.Error:", allQuestionsData.Error);
      }
    } else {
      let data = allQuestionsData.Items;
      console.log("allQuestionsData.Items", data);
      data.map((item) => {
        _workSheetQuestions.push({ value: item.question_id, label: item.question_label })
      })
    }
  }

  useEffect(() => {
    fetchAllConceptsData();
  }, []);

  useEffect(() => {
    axios
      .post(
        dynamicUrl.fetchDigicardAndConcept,
        {},
        {
          headers: { Authorization: sessionStorage.getItem("user_jwt") },
        }
      )
      .then((response) => {
        let result = response.status === 200;
        hideLoader();

        if (result) {
          console.log("inside res fetchDigicardAndConcept");

          let responseData = response.data;
          console.log(responseData);
          // setDisableButton(false);
          hideLoader();
          _setRelatedConcepts(responseData.conceptList);
          _setDigicards(responseData.digicardList);
        } else {
          console.log("else res");

          hideLoader();
        }
      })
      .catch((error) => {
        if (error.response) {
          hideLoader();
          // Request made and server responded
          console.log(error.response.data);

          if (error.response.data === "Invalid Token") {
            sessionStorage.clear();
            localStorage.clear();

            history.push("/auth/signin-1");
            window.location.reload();
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
          hideLoader();
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
          hideLoader();
        }
      });
  }, [digicardsAndConcepts]);

  useEffect(() => {
    axios
      .post(
        dynamicUrl.fetchAllTypesOfGroups,
        {},
        {
          headers: { Authorization: sessionStorage.getItem("user_jwt") },
        }
      )
      .then((response) => {
        let result = response.status === 200;
        hideLoader();

        if (result) {
          console.log("inside res fetchAllTypesOfGroups");

          let responseData = response.data;
          console.log(responseData);
          // setDisableButton(false);
          hideLoader();
          _setBasicGroups(responseData.Basic);
          _setIntermediateGroups(responseData.Intermediate);
          _setAdvancedGroups(responseData.Advanced);
        } else {
          console.log("else res");

          hideLoader();
        }
      })
      .catch((error) => {
        if (error.response) {
          hideLoader();
          // Request made and server responded
          console.log(error.response.data);

          if (error.response.data === "Invalid Token") {
            sessionStorage.clear();
            localStorage.clear();

            history.push("/auth/signin-1");
            window.location.reload();
          } else {
            sweetAlertHandler({
              title: "Error",
              type: "error",
              text: error.response.data,
            });
            fetchAllConceptsData();
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
          hideLoader();
          fetchAllConceptsData();
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
          hideLoader();
          fetchAllConceptsData();
        }
      });
  }, [fetchAllGroups]);

  useEffect(() => {
    getAllQuestions()
  }, [])

  const sweetConfirmHandler = (alert, concept_id, updateStatus) => {
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      type: alert.type,
      showCloseButton: true,
      showCancelButton: true,
    }).then((willDelete) => {
      if (willDelete.value) {
        showLoader();
        deleteConcept(concept_id, updateStatus);
      } else {
        // const returnValue = pageLocation === 'active-concepts' ? (
        //     MySwal.fire('', MESSAGES.INFO.DATA_SAFE, 'success')
        // ) : (
        //     MySwal.fire('', MESSAGES.INFO.FAILED_TO_RESTORE, 'error')
        // )
        // return returnValue;
      }
    });
  };

  const saveConceptIdDelete = (e, concept_id, updateStatus) => {
    e.preventDefault();

    pageLocation === "active-concepts"
      ? sweetConfirmHandler(
        {
          title: MESSAGES.TTTLES.AreYouSure,
          type: "warning",
          text: MESSAGES.INFO.ABLE_TO_RECOVER,
        },
        concept_id,
        updateStatus
      )
      : sweetConfirmHandler(
        {
          title: MESSAGES.TTTLES.AreYouSure,
          type: "warning",
          text: "This will restore the concept!",
        },
        concept_id,
        updateStatus
      );
  };

  const fetchAllConceptsData = () => {
    setIsLoading(true);
    showLoader();
    console.log(pageLocation);

    const conceptStatus =
      pageLocation === "active-concepts" ? "Active" : "Archived";

    axios
      .post(
        dynamicUrl.fetchAllConcepts,
        {
          data: {
            concept_status: conceptStatus,
          },
        },
        { headers: { Authorization: SessionStorage.getItem("user_jwt") } }
      )

      .then(async (response) => {
        console.log(response.data);
        console.log(response.data.Items);
        hideLoader();

        setDigicardsAndConcepts(true);
        setFetchAllGroups(true);

        if (response.data.Items) {
          const responseData = response.data.Items;

          console.log("responseData", responseData);

          let finalDataArray = [];

          for (let index = 0; index < responseData.length; index++) {
            responseData[index].id = index + 1;

            responseData[index]["action"] = (
              <>
                {console.log(pageLocation)}
                {pageLocation === "active-concepts" ? (
                  <>
                    <Button
                      size="sm"
                      className="btn btn-icon btn-rounded btn-info"
                      onClick={(e) => {
                        setEditConceptID(responseData[index].concept_id);
                        setIsOpenEditConcept(true);
                      }}
                    >
                      <i className="feather icon-edit" /> &nbsp; Edit
                    </Button>{" "}
                    &nbsp;
                    <Button
                      size="sm"
                      className="btn btn-icon btn-rounded btn-danger"
                      onClick={(e) =>
                        saveConceptIdDelete(
                          e,
                          responseData[index].concept_id,
                          "Archived"
                        )
                      }
                    >
                      <i className="feather icon-trash-2" /> &nbsp;Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      className="btn btn-icon btn-rounded btn-primary"
                      onClick={(e) =>
                        saveConceptIdDelete(
                          e,
                          responseData[index].concept_id,
                          "Active"
                        )
                      }
                    >
                      <i className="feather icon-plus" /> &nbsp;Restore
                    </Button>
                  </>
                )}
              </>
            );
            finalDataArray.push(responseData[index]);
          }

          console.log(finalDataArray);
          setConceptData(finalDataArray);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (error.response) {
          // Request made and server responded
          hideLoader();
          console.log(error.response.data);

          if (error.response.data === "Invalid Token") {
            sessionStorage.clear();
            localStorage.clear();

            history.push("/auth/signin-1");
            window.location.reload();
          } else {
            sweetAlertHandler({
              title: "Error",
              type: "error",
              text: error.response.data,
            });
            fetchAllConceptsData();
          }
        } else if (error.request) {
          // The request was made but no response was received
          hideLoader();
          console.log(error.request);
          fetchAllConceptsData();
        } else {
          // Something happened in setting up the request that triggered an Error
          hideLoader();
          console.log("Error", error.message);
          fetchAllConceptsData();
        }
      });
  };

  const handleAddConcepts = (e) => {
    console.log("No concepts, add concepts");
    e.preventDefault();
    setIsOpenAddConcept(true);
  };

  const deleteConcept = (concept_id, updateStatus) => {
    const values = {
      concept_id: concept_id,
      concept_status: updateStatus,
    };

    console.log(values);

    axios
      .post(
        dynamicUrl.toggleConceptStatus,
        {
          data: {
            concept_id: concept_id,
            concept_status: updateStatus,
          },
        },
        { headers: { Authorization: SessionStorage.getItem("user_jwt") } }
      )
      .then(async (response) => {
        if (response.Error) {
          hideLoader();

          if (response.Error.data === "Invalid Token") {
            sessionStorage.clear();
            localStorage.clear();

            history.push("/auth/signin-1");
            window.location.reload();
          } else {
            sweetAlertHandler({
              title: MESSAGES.TTTLES.Sorry,
              type: "error",
              text: MESSAGES.ERROR.DeletingUser,
            });
            fetchAllConceptsData();
          }
        } else {
          hideLoader();
          updateStatus === "Active"
            ? MySwal.fire("", MESSAGES.INFO.CONCEPT_RESTORED, "success")
            : MySwal.fire("", MESSAGES.INFO.CONCEPT_DELETED, "success");

          fetchAllConceptsData();
        }
      })
      .catch((error) => {
        if (error.response) {
          // Request made and server responded
          hideLoader();
          console.log(error.response.data);

          if (error.response.data === "Invalid Token") {
            sessionStorage.clear();
            localStorage.clear();

            history.push("/auth/signin-1");
            window.location.reload();
          } else {
            sweetAlertHandler({
              title: "Sorry",
              type: "warning",
              text: error.response.data,
            });
            fetchAllConceptsData();
          }
        } else if (error.request) {
          // The request was made but no response was received
          hideLoader();
          console.log(error.request);
          fetchAllConceptsData();
        } else {
          // Something happened in setting up the request that triggered an Error
          hideLoader();
          console.log("Error", error.message);
          fetchAllConceptsData();
        }
      });
  };

  return (
    <div>
      {isLoading ? (
        <BasicSpinner />
      ) : (
        <>
          {conceptData.length <= 0 ? (
            <>
              {pageLocation === "active-concepts" ? (
                <React.Fragment>
                  <div>
                    <h3 style={{ textAlign: "center" }}>
                      No{" "}
                      {pageLocation === "active-concepts"
                        ? "Active Concepts"
                        : "Archived Concepts"}{" "}
                      Found
                    </h3>
                    <div className="form-group fill text-center">
                      <br></br>

                      <Button
                        variant="success"
                        className="btn-sm btn-round has-ripple ml-2"
                        onClick={(e) => {
                          handleAddConcepts(e);
                        }}
                      >
                        <i className="feather icon-plus" /> Add Concepts
                      </Button>
                    </div>
                  </div>

                  <Modal
                    dialogClassName="my-modal"
                    show={isOpenAddConcept}
                    onHide={() => setIsOpenAddConcept(false)}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title as="h5">Add Concept</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                      <AddConcepts
                        _digicards={_digicards}
                        _relatedConcepts={_relatedConcepts}
                        setIsOpenAddConcept={setIsOpenAddConcept}
                        fetchAllConceptsData={fetchAllConceptsData}
                        setDigicardsAndConcepts={setDigicardsAndConcepts}
                        setFetchAllGroups={setFetchAllGroups}
                        _basicGroups={_basicGroups}
                        _intermediateGroups={_intermediateGroups}
                        _advancedGroups={_advancedGroups}
                        _workSheetQuestions={_workSheetQuestions}
                      />
                    </Modal.Body>
                  </Modal>
                </React.Fragment>
              ) : (
                <h3 style={{ textAlign: "center" }}>
                  No{" "}
                  {pageLocation === "active-concepts"
                    ? "Active Concepts"
                    : "Archived Concepts"}{" "}
                  Found
                </h3>
              )}
            </>
          ) : (
            <>
              <React.Fragment>
                <Row>
                  <Col sm={12}>
                    <Card>
                      <Card.Header>
                        <Card.Title as="h5" className='d-flex justify-content-between'>
                          <h5>Concept List</h5>
                          <h5>Total Entries :- {conceptData.length}</h5>
                        </Card.Title>
                      </Card.Header>
                      <Card.Body>
                        <Table columns={columns} data={conceptData} _workSheetQuestions={_workSheetQuestions} />
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </React.Fragment>

              <Modal
                dialogClassName="my-modal"
                show={isOpenAddConcept}
                onHide={() => setIsOpenAddConcept(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title as="h5">Add Concept</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                  <AddConcepts
                    _digicards={_digicards}
                    _relatedConcepts={_relatedConcepts}
                    setIsOpenAddConcept={setIsOpenAddConcept}
                    fetchAllConceptsData={fetchAllConceptsData}
                    setDigicardsAndConcepts={setDigicardsAndConcepts}
                    setFetchAllGroups={setFetchAllGroups}
                    _basicGroups={_basicGroups}
                    _intermediateGroups={_intermediateGroups}
                    _advancedGroups={_advancedGroups}
                    _workSheetQuestions={_workSheetQuestions}
                  />
                </Modal.Body>
              </Modal>

              <Modal
                dialogClassName="my-modal"
                show={isEditAddConcept}
                onHide={() => setIsOpenEditConcept(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title as="h5">Edit Concept</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                  <EditConcepts
                    _digicards={_digicards}
                    _relatedConcepts={_relatedConcepts}
                    editConceptID={editConceptID}
                    setIsOpenEditConcept={setIsOpenEditConcept}
                    fetchAllConceptsData={fetchAllConceptsData}
                    _basicGroups={_basicGroups}
                    _intermediateGroups={_intermediateGroups}
                    _advancedGroups={_advancedGroups}
                    _workSheetQuestions={_workSheetQuestions}
                  />
                </Modal.Body>
              </Modal>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ConceptTableView;
