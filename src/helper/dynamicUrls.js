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
    fetchPreLearningTopics: baseUrl + '/fetchPreLearningTopics',
    fetchPostLearningTopics: baseUrl + '/fetchPostLearningTopics',

    fetchIndividualUserByRole: baseUrl + '/fetchIndividualUserByRole',
    updateUsersByRole: baseUrl + '/updateUsersByRole',
    toggleUserStatus: baseUrl + '/toggleUserStatus',
    fetchClassBasedOnSchool: baseUrl + '/fetchClassBasedOnSchool',

    //units
    fetchAllUnits: baseUrl + '/fetchAllUnits',
    addUnit: baseUrl + '/addUnit',
    fetchIndividualUnit: baseUrl + '/fetchIndividualUnit',
    editUnit: baseUrl + '/editUnit',
    toggleUnitStatus: baseUrl + '/toggleUnitStatus',

    fetchAllConcepts: baseUrl + '/fetchAllConcepts',
    fetchDigicardAndConcept: baseUrl + '/fetchDigicardAndConcept',
    addConcepts: baseUrl + '/addConcepts',
    toggleConceptStatus: baseUrl + '/toggleConceptStatus',
    fetchIndividualConcept: baseUrl + '/fetchIndividualConcept',
    updateConcept: baseUrl + '/updateConcept',

    // Topics
    addTopic: baseUrl + '/addTopic',
    getTopics: baseUrl + '/fetchAllTopics',
    getIndividualTopic: baseUrl + '/fetchIndividualTopic',
    editTopic: baseUrl + '/editTopic',
    toggleTopicStatus: baseUrl + '/toggleTopicStatus',
    getConcepts: baseUrl + '/fetchAllConcepts',
    toggleSchoolStatus: baseUrl + '/toggleSchoolStatus',
    fetchInactiveSchool: baseUrl + '/fetchInactiveSchool',

    fetchUnitAndSubject: baseUrl + '/fetchUnitAndSubject',
    fetchAllSubjects: baseUrl + '/fetchAllSubjects',
    toggleSubjectStatus: baseUrl + '/toggleSubjectStatus',
    addSubject: baseUrl + '/addSubject',
    fetchIndividualSubject: baseUrl + '/fetchIndividualSubject',
    updateSubject: baseUrl + '/updateSubject'
}

export default dynamicUrl;
