import axios from "axios";
import { SessionStorage } from '../../util/SessionStorage';



export const fetchIndividualDigiCard = async (url, digi_card_id) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                url,
                {
                    data: { digi_card_id: digi_card_id }
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



export const fetchAllDigiCards = (url) => {
    return new Promise((resolve, reject) => {
        axios.post(url, {}, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            })
            .catch((err) => {
                console.log(err)
            })
    });
}


export const changeStatusID = (url, payload) => {
    return new Promise((resolve, reject) => {
        axios.post(url, payload, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            })
            .catch((error) => {
                console.log(error)
                resolve({ Error: error });
            })
    });
}