// const baseUrl = 'https://n4w2247vsi.execute-api.ap-south-1.amazonaws.com/dev/v1'; // Dev env URL
// const baseUrl = 'https://dssqy2gip2.execute-api.ap-south-1.amazonaws.com/testing/v1'; // testing env URL
const baseUrl = process.env.REACT_APP_LAMBDA_URL;


const dynamicUrl = {

    // Login
    login: baseUrl + '/login',
    loginWithOTP: baseUrl + '/loginWithOTP',
    validateOTP: baseUrl + '/validateOTP',
    logout: baseUrl + '/logout',

    // Digicard
    insertDigicard: baseUrl + '/addDigiCard',
    fetchAllDigiCards: baseUrl + '/fetchAllDigiCards',
    fetchIndividualDigiCard: baseUrl + '/fetchIndividualDigiCard',
    editDigiCard: baseUrl + '/editDigiCard',
    toggleDigiCardStatus: baseUrl + '/toggleDigiCardStatus',

    // School
    insertSchool: baseUrl + '/insertSchool',
    fetchAllSchool: baseUrl + '/fetchAllSchool',
    updateSchool: baseUrl + '/updateSchool',
    fetchIndividualSchool: baseUrl + '/fetchIndividualSchool',
    deleteSchool: baseUrl + '/deleteSchool',
    fetchUpschoolAndClientClasses: baseUrl + '/fetchUpschoolAndClientClasses',
    classSubscribe: baseUrl + '/classSubscribe',

    //chapters
    fetchAllChapters: baseUrl + '/fetchAllChapters',
    fetchAllTopics: baseUrl + '/fetchAllTopics',
    addChapter: baseUrl + '/addChapter',
    toggleChapterStatus: baseUrl + '/toggleChapterStatus',
    fetchIndividualChapter: baseUrl + '/fetchIndividualChapter',
    editChapter: baseUrl + '/editChapter',
    fetchPreLearningTopics: baseUrl + '/fetchPreLearningTopics',
    fetchPostLearningTopics: baseUrl + '/fetchPostLearningTopics',

    // Users
    fetchSchoolIdNames: baseUrl + '/fetchSchoolIdNames',
    fetchAllUsersData: baseUrl + '/fetchAllUsersData',
    fetchInactiveUsersData: baseUrl + '/fetchInactiveUsersData',
    getUserBulkuploadUrl: baseUrl + '/getUserBulkuploadUrl',
    bulkUsersUpload: baseUrl + '/bulkUsersUpload',
    fetchIndividualUser: baseUrl + '/fetchIndividualUser',
    fetchIndividualUserByRole: baseUrl + '/fetchIndividualUserByRole',
    updateUsersByRole: baseUrl + '/updateUsersByRole',
    toggleUserStatus: baseUrl + '/toggleUserStatus',
    fetchClassBasedOnSchool: baseUrl + '/fetchClassBasedOnSchool',
    fetchTeacherClassAndSection: baseUrl + '/fetchTeacherClassAndSection',
    fetchSubjectForClientClass: baseUrl + '/fetchSubjectForClientClass',
    mappingSubjectToTeacher: baseUrl + '/mappingSubjectToTeacher',
    fetchMappedSubjectForTeacher: baseUrl + '/fetchMappedSubjectForTeacher',

    //units
    fetchAllUnits: baseUrl + '/fetchAllUnits',
    addUnit: baseUrl + '/addUnit',
    fetchIndividualUnit: baseUrl + '/fetchIndividualUnit',
    editUnit: baseUrl + '/editUnit',
    toggleUnitStatus: baseUrl + '/toggleUnitStatus',

    // Concepts
    fetchAllConcepts: baseUrl + '/fetchAllConcepts',
    fetchDigicardAndConcept: baseUrl + '/fetchDigicardAndConcept',
    addConcepts: baseUrl + '/addConcepts',
    toggleConceptStatus: baseUrl + '/toggleConceptStatus',
    fetchIndividualConcept: baseUrl + '/fetchIndividualConcept',
    updateConcept: baseUrl + '/updateConcept',
    fetchAllTypesOfGroups: baseUrl + '/fetchAllTypesOfGroups',

    // Topics
    addTopic: baseUrl + '/addTopic',
    getTopics: baseUrl + '/fetchAllTopics',
    getIndividualTopic: baseUrl + '/fetchIndividualTopic',
    editTopic: baseUrl + '/editTopic',
    toggleTopicStatus: baseUrl + '/toggleTopicStatus',
    getConcepts: baseUrl + '/fetchAllConcepts',
    toggleSchoolStatus: baseUrl + '/toggleSchoolStatus',
    fetchInactiveSchool: baseUrl + '/fetchInactiveSchool',

    // Subjects
    fetchUnitAndSubject: baseUrl + '/fetchUnitAndSubject',
    fetchAllSubjects: baseUrl + '/fetchAllSubjects',
    toggleSubjectStatus: baseUrl + '/toggleSubjectStatus',
    addSubject: baseUrl + '/addSubject',
    fetchIndividualSubject: baseUrl + '/fetchIndividualSubject',
    updateSubject: baseUrl + '/updateSubject',

    // Classes
    addClass: baseUrl + '/addClass',
    fetchAllClass: baseUrl + '/fetchAllClass',
    fetchSubjectIdName: baseUrl + '/fetchSubjectIdName',
    fetchIndividualClass: baseUrl + '/fetchIndividualClass',
    toggleClassStatus: baseUrl + '/toggleClassStatus',
    editClass: baseUrl + '/editClass',

    // Questions
    fetchIndividualQuestionData: baseUrl + '/fetchIndividualQuestionData',
    toggleQuestionStatus: baseUrl + '/toggleQuestionStatus',
    editQuestion: baseUrl + '/editQuestion',
    fetchAllQuestionsData: baseUrl + '/fetchAllQuestionsData',
    addQuestions: baseUrl + '/addQuestions',

    // Sections
    addSection: baseUrl + '/addSection',
    fetchSchoolSection: baseUrl + '/fetchSchoolSection',
    fetchSectionById: baseUrl + '/fetchSectionById',
    editSection: baseUrl + '/editSection',
    fetchSectionByClientClassId: baseUrl + '/fetchSectionByClientClassId',
    fetchTeacherInfoDetails: baseUrl + '/fetchTeacherInfoDetails',
    teacherSectionAllocation: baseUrl + '/teacherSectionAllocation',

    // Groups
    fetchAllGroupsData: baseUrl + '/fetchAllGroupsData',
    addGroups: baseUrl + '/addGroups',
    fetchIndividualGroupData: baseUrl + '/fetchIndividualGroupData',
    toggleGroupStatus: baseUrl + '/toggleGroupStatus',
    editGroup: baseUrl + '/editGroup',
    fetchDigicardIdAndName: baseUrl + '/fetchDigicardIdAndName',

    //CMS users
    addCMSUser: baseUrl + '/addCMSUser',
    fetchCMSUsersBasedonRoleStatus  : baseUrl + '/fetchCMSUsersBasedonRoleStatus',
    fetchIndividualCMSUser: baseUrl + '/fetchIndividualCMSUser',
    toggleCMSUserStatus: baseUrl + '/toggleCMSUserStatus',
    editCMSUser: baseUrl + '/editCMSUser',
}

export default dynamicUrl;