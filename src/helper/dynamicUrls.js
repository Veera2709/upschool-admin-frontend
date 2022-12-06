const baseUrl = 'https://n4w2247vsi.execute-api.ap-south-1.amazonaws.com/dev/v1';

// const baseUrl = process.env.REACT_APP_LAMBDA_URL;

const dynamicUrl = {
    login: baseUrl + '/login',
    loginWithOTP: baseUrl + '/loginWithOTP',
    validateOTP: baseUrl + '/validateOTP',
    logout: baseUrl + '/logout',
    insertSchool: baseUrl + '/insertSchool',
    fetchAllSchool: baseUrl + '/fetchAllSchool'
}

export default dynamicUrl;