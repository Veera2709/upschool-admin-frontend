// const baseUrl = process.env.REACT_APP_LAMBDA_URL ? process.env.REACT_APP_LAMBDA_URL  : 'https://w72a5si42a.execute-api.ap-south-1.amazonaws.com/dev/v1'; // Dev env URL
// const baseUrl = 'https://dssqy2gip2.execute-api.ap-south-1.amazonaws.com/testing/v1'; // testing env URL
// const baseUrl = process.env.REACT_APP_LAMBDA_URL;
const baseUrl = 'http://localhost:3001/v1'


const dynamicUrl = {

    // Login
    login: baseUrl + '/login',
    loginWithOTP: baseUrl + '/loginWithOTP',
    validateOTP: baseUrl + '/validateOTP',
    logout: baseUrl + '/logout',
    resetOrCreatePassword: baseUrl + '/resetOrCreatePassword',

    // Digicard
    insertDigicard: baseUrl + '/addDigiCard',
    fetchDigiCardsBasedonStatus: baseUrl + '/fetchDigiCardsBasedonStatus',
    fetchIndividualDigiCard: baseUrl + '/fetchIndividualDigiCard',
    editDigiCard: baseUrl + '/editDigiCard',
    toggleDigiCardStatus: baseUrl + '/toggleDigiCardStatus',
    bulkToggleDigiCardStatuss: baseUrl + '/bulkToggleDigiCardStatus',
    fetchDigiCardAudioContent: baseUrl + '/fetchDigiCardAudioContent',

    // School
    insertSchool: baseUrl + '/insertSchool',
    fetchArchivedSchool: baseUrl + '/fetchArchivedSchool',
    updateSchool: baseUrl + '/updateSchool',
    fetchIndividualSchool: baseUrl + '/fetchIndividualSchool',
    deleteSchool: baseUrl + '/deleteSchool',
    fetchUpschoolAndClientClasses: baseUrl + '/fetchUpschoolAndClientClasses',
    classSubscribe: baseUrl + '/classSubscribe',
    setQuizConfiguration: baseUrl + '/setQuizConfiguration',
    schoolubscriptionFeatures: baseUrl + '/schoolubscriptionFeatures',

    // chapters
    fetchChaptersBasedonStatus: baseUrl + '/fetchChaptersBasedonStatus',
    fetchTopicsBasedonStatus: baseUrl + '/fetchTopicsBasedonStatus',
    addChapter: baseUrl + '/addChapter',
    toggleChapterStatus: baseUrl + '/toggleChapterStatus',
    fetchIndividualChapter: baseUrl + '/fetchIndividualChapter',
    editChapter: baseUrl + '/editChapter',
    fetchPreLearningTopics: baseUrl + '/fetchPreLearningTopics',
    fetchPostLearningTopics: baseUrl + '/fetchPostLearningTopics',
    bulkToggleChapterStatus: baseUrl + '/bulkToggleChapterStatus',

    // Users
    fetchSchoolIdNames: baseUrl + '/fetchSchoolIdNames',
    fetchAllUsersData: baseUrl + '/fetchAllUsersData',
    fetchInactiveUsersData: baseUrl + '/fetchInactiveUsersData',
    fetchActiveSchool: baseUrl + '/fetchActiveSchool',
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
    bulkToggleUsersStatus: baseUrl + "/bulkToggleUsersStatus",
    bulkToggleCMSUserStatus: baseUrl + "/bulkToggleCMSUserStatus",
    usersPagination: baseUrl + "/usersPagination",

    // units
    fetchUnitsBasedonStatus: baseUrl + '/fetchUnitsBasedonStatus',
    addUnit: baseUrl + '/addUnit',
    fetchIndividualUnit: baseUrl + '/fetchIndividualUnit',
    editUnit: baseUrl + '/editUnit',
    toggleUnitStatus: baseUrl + '/toggleUnitStatus',
    bulkToggleUnitStatus: baseUrl + '/bulkToggleUnitStatus',

    // Concepts
    fetchAllConcepts: baseUrl + '/fetchAllConcepts',
    fetchDigicardAndConcept: baseUrl + '/fetchDigicardAndConcept',
    addConcepts: baseUrl + '/addConcepts',
    toggleConceptStatus: baseUrl + '/toggleConceptStatus',
    fetchIndividualConcept: baseUrl + '/fetchIndividualConcept',
    updateConcept: baseUrl + '/updateConcept',
    fetchAllTypesOfGroups: baseUrl + '/fetchAllTypesOfGroups',
    bulkToggleConceptStatus: baseUrl + '/bulkToggleConceptStatus',

    // Topics
    addTopic: baseUrl + '/addTopic',
    getIndividualTopic: baseUrl + '/fetchIndividualTopic',
    editTopic: baseUrl + '/editTopic',
    toggleTopicStatus: baseUrl + '/toggleTopicStatus',
    getConcepts: baseUrl + '/fetchAllConcepts',
    toggleSchoolStatus: baseUrl + '/toggleSchoolStatus',
    bulkToggleTopicStatus: baseUrl + '/bulkToggleTopicStatus',

    // Subjects
    fetchUnitAndSubject: baseUrl + '/fetchUnitAndSubject',
    fetchAllSubjects: baseUrl + '/fetchAllSubjects',
    toggleSubjectStatus: baseUrl + '/toggleSubjectStatus',
    addSubject: baseUrl + '/addSubject',
    fetchIndividualSubject: baseUrl + '/fetchIndividualSubject',
    updateSubject: baseUrl + '/updateSubject',
    bulkToggleSubjectStatus: baseUrl + '/bulkToggleSubjectStatus',

    // Classes
    addClass: baseUrl + '/addClass',
    fetchClassesBasedonStatus: baseUrl + '/fetchClassesBasedonStatus',
    fetchSubjectIdName: baseUrl + '/fetchSubjectIdName',
    fetchIndividualClass: baseUrl + '/fetchIndividualClass',
    toggleClassStatus: baseUrl + '/toggleClassStatus',
    editClass: baseUrl + '/editClass',
    bulkToggleClassStatus: baseUrl + '/bulkToggleClassStatus',

    // Questions
    fetchIndividualQuestionData: baseUrl + '/fetchIndividualQuestionData',
    toggleQuestionStatus: baseUrl + '/toggleQuestionStatus',
    editQuestion: baseUrl + '/editQuestion',
    fetchAllQuestionsData: baseUrl + '/fetchAllQuestionsData',
    addQuestions: baseUrl + '/addQuestions',
    fetchDisclaimersandCategories: baseUrl + '/fetchDisclaimersandCategories',
    fetchQuestionMasters: baseUrl + '/fetchQuestionMasters',
    bulkToggleQuestionStatus: baseUrl + '/bulkToggleQuestionStatus',

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
    bulkToggleGroupsStatus: baseUrl + '/bulkToggleGroupsStatus',

    // CMS users
    addCMSUser: baseUrl + '/addCMSUser',
    fetchCMSUsersBasedonRoleStatus: baseUrl + '/fetchCMSUsersBasedonRoleStatus',
    fetchIndividualCMSUser: baseUrl + '/fetchIndividualCMSUser',
    toggleCMSUserStatus: baseUrl + '/toggleCMSUserStatus',
    editCMSUser: baseUrl + '/editCMSUser',

    // settings - Question Category
    bulkToggleQuestionCategoryStatus: baseUrl + '/bulkToggleQuestionCategoryStatus',
    fetchAllQuestionCategories: baseUrl + '/fetchAllQuestionCategories',
    toggleQuestionCategoryStatus: baseUrl + '/toggleQuestionCategoryStatus',
    addQuestionCategory: baseUrl + '/addQuestionCategory',
    fetchIndividualCategory: baseUrl + '/fetchIndividualCategory',
    updateQuestionCategory: baseUrl + '/updateQuestionCategory',

    // settings - Question Disclaimer
    bulkToggleQuestionDisclaimerStatus: baseUrl + '/bulkToggleQuestionDisclaimerStatus',
    toggleQuestionDisclaimerStatus: baseUrl + '/toggleQuestionDisclaimerStatus',
    fetchAllQuestionDisclaimers: baseUrl + '/fetchAllQuestionDisclaimers',
    addQuestionDisclaimer: baseUrl + '/addQuestionDisclaimer',
    fetchIndividualDisclaimer: baseUrl + '/fetchIndividualDisclaimer',
    updateQuestionDisclaimer: baseUrl + '/updateQuestionDisclaimer',


    //settings - Source of Question
    fetchSourcesBasedonStatus: baseUrl + '/fetchSourcesBasedonStatus',
    addQuestionSource: baseUrl + '/addQuestionSource',
    fetchIndividualSource: baseUrl + '/fetchIndividualSource',
    toggleQuestionSourceStatus: baseUrl + '/toggleQuestionSourceStatus',
    bulkToggleQuestionSourceStatus: baseUrl + '/bulkToggleQuestionSourceStatus',
    updateQuestionSource: baseUrl + '/updateQuestionSource',

    //settings - cognitive Skills
    fetchSkillsBasedonStatus: baseUrl + '/fetchSkillsBasedonStatus',
    toggleCognitiveSkillStatus: baseUrl + '/toggleCognitiveSkillStatus',
    bulkToggleCognitiveSkillStatus: baseUrl + '/bulkToggleCognitiveSkillStatus',
    addCognitiveSkill: baseUrl + '/addCognitiveSkill',
    updateCognitiveSkill: baseUrl + '/updateCognitiveSkill',
    fetchIndividualCognitiveSkill: baseUrl + '/fetchIndividualCognitiveSkill',

    //Blue print
    addBluePrint: baseUrl + '/addBluePrint',
    fetchBluePrintsBasedonStatus: baseUrl + '/fetchBluePrintsBasedonStatus',
    toggleBluePrintStatus: baseUrl + '/toggleBluePrintStatus',
    fetchIndividualBluePrint: baseUrl + '/fetchIndividualBluePrint'
}

export default dynamicUrl;