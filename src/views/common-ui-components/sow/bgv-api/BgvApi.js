import axios from 'axios';
import { SessionStorage } from '../../../../util/SessionStorage';
import { dbMapping } from './dbMapping';

export const bgvApi = async (url, data, component, case_id) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        url,
        {
          data: data,
          case_id: case_id,
          component_name: component
        },
        {
          headers: {
            Authorization: SessionStorage.getItem('user_jwt')
          }
        }
      )
      .then((response) => {
        console.log(response);
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        resolve({ Error: error });
      });
  });
};

export const fetchCaseCompDetails = async (url, case_id, component) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        url,
        {
          data: { case_id: case_id }
        },
        {
          headers: {
            Authorization: SessionStorage.getItem('user_jwt')
          }
        }
      )
      .then((response) => {
        console.log(response);
        let allCaseDetail = response.data.Items[0];
        let componentMap = dbMapping[component];
        console.log('componentMap', componentMap);
        let componentData = allCaseDetail[componentMap];
        resolve(componentData);
        // let extras = {};
        // switch (component) {
        //   case 'DirectorshipCheck':
        //     extras.empName = allCaseDetail[dbMapping.BasicDetails].firstName + allCaseDetail[dbMapping.BasicDetails].lastName;
        //     resolve({ componentData: componentData, extras: extras });
        //     console.log('--------- extras', componentData, extras);
        //     break;

        //   default:
        //     resolve(componentData);
        //     break;
        // }
      })
      .catch((error) => {
        console.log(error);
        resolve('Error', error);
      });
  });
};

export const fetchAllCaseDetails = async (url, case_id) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        url,
        {
          data: { case_id: case_id }
        },
        {
          headers: {
            Authorization: SessionStorage.getItem('user_jwt')
          }
        }
      )
      .then((response) => {
        console.log(response);
        resolve(response.data.Items[0]);
      })
      .catch((error) => {
        console.log(error);
        resolve('Error', error);
      });
  });
};

export const defaultPostApi2 = async (url, case_id) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        url,
        {
          data: { case_id: case_id }
        },
        {
          headers: {
            Authorization: SessionStorage.getItem('user_jwt')
          }
        }
      )
      .then((response) => {
        console.log(response);
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        resolve('Error', error);
      });
  });
};

export const verifyComponent = async () => {};

export const fetchVerifiers = async (url, payload) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, payload, {
        headers: {
          Authorization: SessionStorage.getItem('user_jwt')
        }
      })
      .then((response) => {
        console.log(response);
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        resolve({ Error: error });
      });
  });
};

export const defaultPostApi = async (url, payload) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, payload, {
        headers: {
          Authorization: SessionStorage.getItem('user_jwt')
        }
      })
      .then((response) => {
        console.log(response);
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        resolve({ Error: error });
      });
  });
};
