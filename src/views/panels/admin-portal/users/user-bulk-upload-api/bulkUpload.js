import axios from 'axios';
import { SessionStorage } from '../../../../../util/SessionStorage';

export const bulkUpload = async (url, data, component) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        url,
        {
          data: data
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
        resolve({Error: error});
      });
  });
};
