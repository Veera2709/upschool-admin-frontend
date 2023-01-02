import axios from "axios";
import { SessionStorage } from '../../util/SessionStorage';
import url from '../../helper/dynamicUrls'



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
                resolve({ Error: error });

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
            .catch((error) => {
                console.log(error)
                resolve({ Error: error });

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

export const fetchAllTopics = () => {
    return new Promise((resolve, reject) => {
        axios.post(url.fetchAllTopics, {}, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            })
            .catch((error) => {
                resolve({ Error: error });
            })
    });
}

export const fetchIndividualChapter = (chapter_id) => {
    return new Promise((resolve, reject) => {
        axios.post(url.fetchIndividualChapter, {
            data: { chapter_id: chapter_id }
        }, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            })
            .catch((error) => {
                resolve({ Error: error });
            })
    });
}

export const fetchAllUnits = () => {
    return new Promise((resolve, reject) => {
        axios.post(url.fetchAllUnits, {}, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            })
            .catch((error) => {
                resolve({ Error: error });
            })
    });
}

export const fetchAllChapters = () => {
    return new Promise((resolve, reject) => {
        axios.post(url.fetchAllChapters, {}, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            })
            .catch((error) => {
                resolve({ Error: error });
            })
    });
}

export const fetchAllConcepts = () => {
    return new Promise((resolve, reject) => {
        axios.post(url.fetchAllConcepts, {
            data: {

                concept_status: "Active"

            }
        }, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            })
            .catch((error) => {
                resolve({ Error: error });
            })
    });
}


export const fetchPostLearningTopics = () => {
    return new Promise((resolve, reject) => {
        axios.post(url.fetchPostLearningTopics, {
            data: {

                concept_status: "Active"

            }
        }, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            })
            .catch((error) => {
                resolve({ Error: error });
            })
    });
}

export const fetchPreLearningTopics = () => {
    return new Promise((resolve, reject) => {
        axios.post(url.fetchPreLearningTopics, {
            data: {

                concept_status: "Active"

            }
        }, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            })
            .catch((error) => {
                resolve({ Error: error });
            })
    });
}

export const fetchIndividualUnit = (unit_id) => {
    return new Promise((resolve, reject) => {
        axios.post(url.fetchIndividualUnit, {
            data: { unit_id: unit_id }
        }, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            })
            .catch((error) => {
                resolve({ Error: error });
            })
    });
}

export const getIndividualTopic = (topic_id) => {
    return new Promise((resolve, reject) => {
        axios.post(url.getIndividualTopic, {
            data: { topic_id: topic_id }
        }, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            })
            .catch((error) => {
                resolve({ Error: error });
            })
    });
}

export const addClass = (formData) => { 
    console.log("formData : ", formData);
  
    return new Promise((resolve, reject) => {
        axios.post(url.addClass, {
          data: formData
        }, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            })
            .catch((error) => {
                resolve({ Error: error });
            })
    });
  }
  export const editClass = (formData) => { 
    console.log("formData : ", formData);
  
    return new Promise((resolve, reject) => {
        axios.post(url.editClass, {
          data: formData
        }, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            })
            .catch((error) => {
                resolve({ Error: error });
            })
    });
  }
  export const toggleClassStatus = (data) => { 
    console.log("data : ", data);
  
    return new Promise((resolve, reject) => {
        axios.post(url.toggleClassStatus, {
          data: data
        }, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            })
            .catch((error) => {
                resolve({ Error: error });
            })
    });
  }
  export const fetchAllClass = (class_status) => { 
    console.log("class_status : ", class_status);
  
    return new Promise((resolve, reject) => {
        axios.post(url.fetchAllClass, {
          data:{class_status: class_status}
        }, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            })
            .catch((error) => {
                resolve({ Error: error });
            })
    });
  }
  export const fetchSubjectIdName = () => { 
    
    return new Promise((resolve, reject) => {
        axios.post(url.fetchSubjectIdName, {}, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            })
            .catch((error) => {
                resolve({ Error: error });
            })
    });
  }
  export const fetchIndividualClass = (class_id) => { 
    console.log("class_id : ", class_id);
    
    return new Promise((resolve, reject) => {
        axios.post(url.fetchIndividualClass, {
          data:{class_id: class_id}
        }, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            })
            .catch((error) => {
                resolve({ Error: error });
            })
    });
  }
  

