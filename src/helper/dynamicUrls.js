const baseUrl = 'https://n4w2247vsi.execute-api.ap-south-1.amazonaws.com/dev/v1';

const dynamicUrl = {
    login: baseUrl + '/login',
    loginWithOTP: baseUrl + '/loginWithOTP',
    validateOTP: baseUrl + '/validateOTP',
    logout: baseUrl + '/logout',
}

export default dynamicUrl;