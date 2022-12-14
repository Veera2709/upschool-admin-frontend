// const baseUrl = 'https://n4w2247vsi.execute-api.ap-south-1.amazonaws.com/dev/v1';

const baseUrl = process.env.REACT_APP_LAMBDA_URL;

const dynamicUrl = {
    login: baseUrl + '/login',
    loginWithOTP: baseUrl + '/loginWithOTP',
    validateOTP: baseUrl + '/validateOTP',
    logout: baseUrl + '/logout',

    insertDigicard: baseUrl + '/addDigiCard',
    fetchAllDigiCards: baseUrl + '/fetchAllDigiCards',
    fetchIndividualDigiCard: baseUrl + '/fetchIndividualDigiCard',
    editDigiCard: baseUrl + '/editDigiCard',
    deleteDigiCard: baseUrl + '/deleteDigiCard',
    //
    insertSchool: baseUrl + '/insertSchool',
    fetchAllSchool: baseUrl + '/fetchAllSchool',
    updateSchool: baseUrl + '/updateSchool',
    fetchIndividualSchool: baseUrl + '/fetchIndividualSchool',
    deleteSchool: baseUrl + '/deleteSchool',

    fetchSchoolIdNames: baseUrl + '/fetchSchoolIdNames',
    fetchAllUsersData: baseUrl + '/fetchAllUsersData',
    getUserBulkuploadUrl: baseUrl + '/getUserBulkuploadUrl',
    bulkUsersUpload: baseUrl + '/bulkUsersUpload'

}

export default dynamicUrl;
