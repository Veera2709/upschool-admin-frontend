const baseUrl = 'https://n4w2247vsi.execute-api.ap-south-1.amazonaws.com/dev/v1';

// const baseUrl = process.env.REACT_APP_LAMBDA_URL;

const dynamicUrl = {
    login: baseUrl + '/login',
    loginWithOTP: baseUrl + '/loginWithOTP',
    validateOTP: baseUrl + '/validateOTP',
    logout: baseUrl + '/logout',

    insertDigicard: baseUrl + '/addDigiCard',
    fetchAllDigiCards: baseUrl + '/fetchAllDigiCards',
    fetchIndividualDigiCard: baseUrl + '/fetchIndividualDigiCard',
    editDigiCard: baseUrl + '/editDigiCard',
    toggleDigiCardStatus: baseUrl + '/toggleDigiCardStatus',
    //
    insertSchool: baseUrl + '/insertSchool',
    fetchAllSchool: baseUrl + '/fetchAllSchool',
    updateSchool: baseUrl + '/updateSchool',
    fetchIndividualSchool: baseUrl + '/fetchIndividualSchool',
    deleteSchool: baseUrl + '/deleteSchool',
    fetchUpschoolAndClientClasses: baseUrl + '/fetchUpschoolAndClientClasses',
    classSubscribe: baseUrl + '/classSubscribe',
    

    fetchSchoolIdNames: baseUrl + '/fetchSchoolIdNames',
    fetchAllUsersData: baseUrl + '/fetchAllUsersData',
    fetchInactiveUsersData: baseUrl + '/fetchInactiveUsersData',
    getUserBulkuploadUrl: baseUrl + '/getUserBulkuploadUrl',
    bulkUsersUpload: baseUrl + '/bulkUsersUpload',
    fetchIndividualUser: baseUrl + '/fetchIndividualUser',
    updateUser: baseUrl + '/updateUser',
    deleteUser: baseUrl + '/deleteUser',

    //chapters
    fetchAllChapters: baseUrl + '/fetchAllChapters',
    fetchAllTopics: baseUrl + '/fetchAllTopics',
    addChapter: baseUrl + '/addChapter',
    toggleChapterStatus: baseUrl + '/toggleChapterStatus',
    fetchIndividualChapter: baseUrl + '/fetchIndividualChapter',
    editChapter: baseUrl + '/editChapter',

    fetchIndividualUserByRole: baseUrl + '/fetchIndividualUserByRole',
    updateUsersByRole: baseUrl + '/updateUsersByRole',
    toggleUserStatus: baseUrl + '/toggleUserStatus',
    fetchClassBasedOnSchool: baseUrl + '/fetchClassBasedOnSchool',

    fetchAllConcepts: baseUrl + '/fetchAllConcepts',
    fetchDigicardAndConcept: baseUrl + '/fetchDigicardAndConcept',
    addConcepts: baseUrl + '/addConcepts',
    toggleConceptStatus: baseUrl + '/toggleConceptStatus',
    fetchIndividualConcept: baseUrl + '/fetchIndividualConcept',
    updateConcept: baseUrl + '/updateConcept'

}

export default dynamicUrl;
