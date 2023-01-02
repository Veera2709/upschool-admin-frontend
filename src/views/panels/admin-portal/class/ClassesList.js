import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Card, Pagination, Button, Modal } from "react-bootstrap";
import BTable from "react-bootstrap/Table";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { GlobalFilter } from "./GlobalFilter";
import BasicSpinner from '../../../../helper/BasicSpinner';


import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";

import dynamicUrl from "../../../../helper/dynamicUrls";

import { isEmptyArray } from "../../../../util/utils";

import { Link, useHistory } from "react-router-dom";
import { SessionStorage } from "../../../../util/SessionStorage";
import MESSAGES from "../../../../helper/messages";
import useFullPageLoader from "../../../../helper/useFullPageLoader";
import { useLocation } from "react-router-dom";
import {
  fetchAllClass,
  toggleClassStatus,
} from "../../../api/CommonApi";

function Table({ columns, data, modalOpen }) {
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
    usePagination
  );

  const [isOpen, setIsOpen] = useState(false);
  let history = useHistory();

  const toAddClass = () => {
    history.push("/admin-portal/Classes/addClass");
    setIsOpen(true);
  };

  return (
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
          <Button
            variant="success"
            className="btn-sm btn-round has-ripple ml-2"
            onClick={() => {
              toAddClass();
            }}
          >
            <i className="feather icon-plus" /> Add Class
          </Button>
        </Col>
      </Row>

      <BTable striped bordered hover responsive {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {/* Add a sort direction indicator */}
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
              type="number"
              className="form-control ml-2"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
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
    </>
  );
}

const StandardList = (props) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        accessor: "index_no",
      },
      {
        Header: " Class Title",
        accessor: "class_name",
      },
      {
        Header: "Options",
        accessor: "actions",
      },
    ],
    []
  );

  // const data = React.useMemo(() => makeData(80), []);
  const [classData, setClassData] = useState([]);
  const [reloadAllData, setReloadAllData] = useState("Fetched");
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [isLoading, setIsLoading] = useState(false);

  const [pageLocation, setPageLocation] = useState(
    useLocation().pathname.split("/")[3]
  );

  let history = useHistory();

  const MySwal = withReactContent(Swal);

  const sweetAlertHandler = (alert) => {
    MySwal.fire({
      title: alert.title,
      text: alert.text,
      icon: alert.type,
    });
  };

  //   function deleteClass(class_id, class_name) {
  const toggleCall = async (data) => {
    const toggleClassStatusRes = await toggleClassStatus(data);
    if (toggleClassStatusRes.Error) {

      if (toggleClassStatusRes.Error.response.data === 'Invalid Token') {
        sessionStorage.clear();
        localStorage.clear();
        history.push('/auth/signin-1');
        window.location.reload();
      } else {
        sweetAlertHandler({ title: 'Sorry', type: 'warning', text: toggleClassStatusRes.Error.response.data });
      }

    } else {
      setReloadAllData(data.activity == "Delete" ? 'Deleted' : "Restored");
      return MySwal.fire(
        "",
        "The " + data.class_name + " is " + (data.activity == "Delete" ? 'Deleted' : "Restored"),
        "success"
      );
    }
  }
  const toggleStatus = (class_id, class_name, class_status, activity) => {
    var data = {
      class_id: class_id,
      class_status: class_status,
      class_name: class_name,
      activity: activity
    };

    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "Are you sure?",
      text: "Confirm " + (activity == 'Delete' ? 'Deleting' : 'Restoring') + " " + class_name + " Class",
      type: "warning",
      showCloseButton: true,
      showCancelButton: true,
    }).then((willDelete) => {
      if (willDelete.value) {
        toggleCall(data);
      } else {
      }
    });
  };

  const allClassesList = async (ClassStatus) => {
    setIsLoading(true)
    var class_status;
    ClassStatus == "Active"
      ? (class_status = "Active")
      : (class_status = "Archived");
    const allClassesData = await fetchAllClass(class_status);

    if (allClassesData.ERROR || allClassesData.Items === undefined) {
      console.log("allClassesData.ERROR", allClassesData.ERROR);
      if (allClassesData.Error.response.data == 'Invalid Token') {
        console.log("---------------------");
        sessionStorage.clear();
        localStorage.clear();
        history.push('/auth/signin-1');
      }
    } else {
      let dataResponse = allClassesData.Items;
      console.log("dataResponse", dataResponse);
      let finalDataArray = [];
      if (ClassStatus === "Active") {
        let ActiveresultData =
          dataResponse &&
          dataResponse.filter((e) => e.class_status === "Active");
        console.log("ActiveresultData", ActiveresultData);

        for (let index = 0; index < ActiveresultData.length; index++) {
          ActiveresultData[index].index_no = index + 1;
          ActiveresultData[index]["actions"] = (
            <>
              <>
                <Button
                  size="sm"
                  className="btn btn-icon btn-rounded btn-primary"
                  onClick={(e) =>
                    history.push(
                      `/admin-portal/Classes/editClass/${ActiveresultData[index].class_id}`
                    )
                  }
                >
                  <i className="feather icon-edit" /> &nbsp; Edit
                </Button>
                &nbsp;
                {/* if(resultData[index].chapter_status=='Active') */}
                <Button
                  size="sm"
                  className="btn btn-icon btn-rounded btn-danger"
                  onClick={(e) =>
                    toggleStatus(
                      ActiveresultData[index].class_id,
                      ActiveresultData[index].class_name,
                      "Archived",
                      "Delete"
                    )
                  }
                >
                  <i className="feather icon-trash-2 " /> &nbsp; Delete
                </Button>
                &nbsp;
              </>
            </>
          );
          finalDataArray.push(ActiveresultData[index]);
          console.log("finalDataArray: ", finalDataArray);
        }
      } else {
        let resultData =
          dataResponse &&
          dataResponse.filter((e) => e.class_status === "Archived");
        for (let index = 0; index < resultData.length; index++) {
          resultData[index].index_no = index + 1;
          resultData[index]["actions"] = (
            <>
              <>
                <Button
                  size="sm"
                  className="btn btn-icon btn-rounded btn-primary"
                  onClick={(e) =>
                    toggleStatus(
                      resultData[index].class_id,
                      resultData[index].class_name,
                      "Active",
                      "Restore"
                    )
                  }
                >
                  <i className="feather icon-plus" /> &nbsp; Restore
                </Button>
                &nbsp;
              </>
            </>
          );
          finalDataArray.push(resultData[index]);
          console.log("finalDataArray: ", finalDataArray);
        }
      }
      setClassData(finalDataArray);
      console.log("resultData: ", finalDataArray);
      setIsLoading(false)
    }
  };

  useEffect(() => {
    if (pageLocation) {
      console.log("--", pageLocation);
      const url = pageLocation === "active-classes" ? "Active" : "Archived";
      allClassesList(url);
    }
  }, [reloadAllData]);

  return (
    <div>
      {
        isLoading ? (
          <BasicSpinner />
        ) : (
          <>
            {
              classData.length <= 0 ? (
                <>
                  < React.Fragment >
                    <div>
                      <h3 style={{ textAlign: 'center' }}>No Class Found</h3>
                      <div className="form-group fill text-center">
                        <br></br>

                        <Link to={'/admin-portal/Classes/addClass'}>
                          <Button variant="success" className="btn-sm btn-round has-ripple ml-2">
                            <i className="feather icon-plus" /> Add Class
                          </Button>
                        </Link>
                      </div>

                    </div>
                  </React.Fragment>
                </>
              ) : (
                <>
                  <React.Fragment>
                    <Row>
                      <Col sm={12}>
                        <Card>
                          <Card.Header>
                            <Card.Title as="h5">Class List</Card.Title>
                          </Card.Header>
                          <Card.Body>
                            <Table columns={columns} data={classData} />
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </React.Fragment>
                </>
              )
            }
          </>
        )
      }
    </div >
  );
};
export default StandardList;
