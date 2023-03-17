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


export const fetchDigiCardAudioContent = async (digi_card_id) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                url.fetchDigiCardAudioContent,
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

export const fetchDigiCardsBasedonStatus = (status) => {
    return new Promise((resolve, reject) => {
        axios.post(url.fetchDigiCardsBasedonStatus, {
            data: {
                digicard_status: status
            }
        }, {
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

export const fetchTopicsBasedonStatus = (topicStatus) => {
    return new Promise((resolve, reject) => {
        axios.post(url.fetchTopicsBasedonStatus, {
            data: {
                topic_status: topicStatus
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

export const fetchUnitsBasedonStatus = (UnitStatus) => {
    return new Promise((resolve, reject) => {
        axios.post(url.fetchUnitsBasedonStatus, {
            data: {
                unit_status: UnitStatus
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

export const fetchCMSUsersBasedonRoleStatus1 = (payLoad) => {
    console.log("payload", payLoad);
    return new Promise((resolve, reject) => {
        axios.post(url.fetchCMSUsersBasedonRoleStatus, { data: payLoad }, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log("fetchCMSUsersBasedonRoleStatusr", response.data);
                resolve(response.data);
            })
            .catch((error) => {
                resolve({ Error: error });
            })
    });
}

export const fetchChaptersBasedonStatus = () => {
    return new Promise((resolve, reject) => {
        axios.post(url.fetchChaptersBasedonStatus, {
            data: {
                chapter_status: "Active"
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
                topic_status: "Active"
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
                topic_status: "Active"
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


export const fetchIndividualUser = (user_id) => {
    console.log("user_id", user_id);
    return new Promise((resolve, reject) => {
        axios.post(url.fetchIndividualCMSUser, {
            data: { user_id: user_id }
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

export const fetchClassesBasedonStatus = (class_status) => {
    console.log("class_status : ", class_status);

    return new Promise((resolve, reject) => {
        axios.post(url.fetchClassesBasedonStatus, {
            data: { class_status: class_status }
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
            data: { class_id: class_id }
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

export const fetchClassBasedOnSchool = (school_id) => {
    console.log("school_id : ", school_id);

    return new Promise((resolve, reject) => {
        axios.post(url.fetchClassBasedOnSchool, {
            data: { school_id: school_id }
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

export const fetchSchoolSection = (school_id) => {
    console.log("school_id : ", school_id);

    return new Promise((resolve, reject) => {
        axios.post(url.fetchSchoolSection, {
            data: { school_id: school_id }
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

export const fetchSectionById = (section_id) => {
    console.log("school_id : ", section_id);

    return new Promise((resolve, reject) => {
        axios.post(url.fetchSectionById, {
            data: { section_id: section_id }
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

export const fetchSectionByClientClassId = (client_class_id) => {
    console.log("client_class_id : ", client_class_id);

    return new Promise((resolve, reject) => {
        axios.post(url.fetchSectionByClientClassId, {
            data: { client_class_id: client_class_id }
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

export const fetchTeacherInfoDetails = (teacher_id) => {
    console.log("teacher_id : ", teacher_id);

    return new Promise((resolve, reject) => {
        axios.post(url.fetchTeacherInfoDetails, {
            data: { teacher_id: teacher_id }
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

export const toggleUserStatus = (payLoad) => {
    console.log("payLoad : ", payLoad);

    return new Promise((resolve, reject) => {
        axios.post(url.toggleCMSUserStatus, {
            data: payLoad
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

export const toggleMultiDigicardStatus = (payLoad) => {
    console.log("payLoad : ", payLoad);
    return new Promise((resolve, reject) => {
        axios.post(url.bulkToggleDigiCardStatuss, {
            data: payLoad
        }, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            })
            .catch((error) => {
                console.log("Error", error);
                resolve({ Error: error });
            })
    });
}




export const toggleMultipleTopicStatus = (payLoad) => {
    console.log("payLoad : ", payLoad);
    return new Promise((resolve, reject) => {
        axios.post(url.bulkToggleTopicStatus, {
            data: payLoad
        }, {
            headers: { Authorization: sessionStorage.getItem('user_jwt') }
        })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            })
            .catch((error) => {
                console.log("Error", error);
                resolve({ Error: error });
            })
    });
}

export const toggleMultiChapterStatus = (payLoad) => {
    console.log("payLoad : ", payLoad);
    return new Promise((resolve, reject) => {
        axios.post(url.bulkToggleChapterStatus,
            { data: payLoad },
            { headers: { Authorization: sessionStorage.getItem('user_jwt') } })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            })
            .catch((error) => {
                console.log("Error", error);
                resolve({ Error: error });
            })
    });
}
export const bulkToggleQuestionStatus = (payLoad) => {
    console.log("payLoad : ", payLoad);
    return new Promise((resolve, reject) => {
        axios.post(url.bulkToggleQuestionStatus,
            { data: payLoad },
            { headers: { Authorization: sessionStorage.getItem('user_jwt') } })
            .then((response) => {
                console.log(response);
                resolve(response.data);
            })
            .catch((error) => {
                console.log("Error", error);
                resolve({ Error: error });
            })
    });
}
