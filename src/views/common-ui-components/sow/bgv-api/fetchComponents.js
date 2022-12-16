import axios from 'axios';
import { SessionStorage } from '../../../../util/SessionStorage';
import jwt_decode from 'jwt-decode';
var token = SessionStorage.getItem('user_jwt');
var decoded = jwt_decode(token);

export const fetchComponents = async (url, user_client_id) => {
  return new Promise((resolve, reject) => {
    let payload = {
      data: {
        user_client_id: ''
      }
    };
    switch (sessionStorage.getItem('user_category')) {
      case 'Client':
        payload.data.user_client_id = decoded.user_client_id;
        break;

      default:
        payload.data.user_client_id = user_client_id;
        break;
    }
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
