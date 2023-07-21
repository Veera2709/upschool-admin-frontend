import * as Yup from 'yup';
import * as Constants from '../../../../config/constant';


export const commonValidationPost = Yup.object().shape({
    passPercentageL1Pre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    passPercentageL2Pre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    minStudentsPre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    noOfAttemptsPre: Yup.string()
        .matches(Constants.Common.numOfAttemptsRegex, 'Invalid Number!')
        .required('Field is required/Invalid Number!'),
    noOfWorksheets: Yup.string()
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    noOfTestPapers: Yup.string()
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    classPercentageRep: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_basic: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_intermediate: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_advanced: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    passPercentageL3Post: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
})

export const commonValidationPre = Yup.object().shape({
    passPercentageL1Pre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    passPercentageL2Pre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    minStudentsPre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    noOfAttemptsPre: Yup.string()
        .matches(Constants.Common.numOfAttemptsRegex, 'Invalid Number!')
        .required('Field is required/Invalid Number!'),
    noOfWorksheets: Yup.string()
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    noOfTestPapers: Yup.string()
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    classPercentageRep: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_basic: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_intermediate: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_advanced: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
})

export const focusAreasAutomate = Yup.object().shape({
    passPercentageL1Pre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    passPercentageL2Pre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    minStudentsPre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    noOfAttemptsPre: Yup.string()
        .matches(Constants.Common.numOfAttemptsRegex, 'Invalid Number!')
        .required('Field is required/Invalid Number!'),
    noOfWorksheets: Yup.string()
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    noOfTestPapers: Yup.string()
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    classPercentageRep: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_basic: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_intermediate: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_advanced: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    percentageOfStudentsPre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    minNoQustionAutomate: Yup.number()
        .min(1, 'Invalid Input!')
        .required('Field is required/Invalid Percentage!'),
})

export const focusAreasManual = Yup.object().shape({
    passPercentageL1Pre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    passPercentageL2Pre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    minStudentsPre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    noOfAttemptsPre: Yup.string()
        .matches(Constants.Common.numOfAttemptsRegex, 'Invalid Number!')
        .required('Field is required/Invalid Number!'),
    noOfWorksheets: Yup.string()
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    noOfTestPapers: Yup.string()
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    classPercentageRep: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_basic: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_intermediate: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_advanced: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    percentageOfStudentsPre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    minNoQustionManual_express: Yup.number()
        .min(1, 'Invalid Input!')
        .required('Field is required/Invalid Percentage!'),

})

export const focusAreasAutomateExpress = Yup.object().shape({
    passPercentageL1Pre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    passPercentageL2Pre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    minStudentsPre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    noOfAttemptsPre: Yup.string()
        .matches(Constants.Common.numOfAttemptsRegex, 'Invalid Number!')
        .required('Field is required/Invalid Number!'),
    noOfWorksheets: Yup.string()
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    noOfTestPapers: Yup.string()
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    classPercentageRep: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_basic: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_intermediate: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_advanced: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    percentageOfStudentsPre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    minNoQustionAutomate: Yup.number()
        .min(1, 'Invalid Input!')
        .required('Field is required/Invalid Percentage!'),
    minNoQustionManual_express: Yup.number()
        .min(1, 'Invalid Input!')
        .required('Field is required/Invalid Percentage!'),
})

export const AutomateValidation = Yup.object().shape({
    passPercentageL1Pre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    passPercentageL2Pre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    minStudentsPre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    noOfAttemptsPre: Yup.string()
        .matches(Constants.Common.numOfAttemptsRegex, 'Invalid Number!')
        .required('Field is required/Invalid Number!'),
    noOfWorksheets: Yup.string()
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    noOfTestPapers: Yup.string()
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    classPercentageRep: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_basic: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_intermediate: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_advanced: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    minNoQustionAutomate: Yup.number()
        .min(1, 'Invalid Input!')
        .required('Field is required/Invalid Percentage!'),
})

export const AutomateExpress = Yup.object().shape({
    passPercentageL1Pre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    passPercentageL2Pre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    minStudentsPre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    noOfAttemptsPre: Yup.string()
        .matches(Constants.Common.numOfAttemptsRegex, 'Invalid Number!')
        .required('Field is required/Invalid Number!'),
    noOfWorksheets: Yup.string()
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    noOfTestPapers: Yup.string()
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    classPercentageRep: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_basic: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_intermediate: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_advanced: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    minNoQustionAutomate: Yup.number()
        .min(1, 'Invalid Input!')
        .required('Field is required/Invalid Percentage!'),
    minNoQustionManual_express: Yup.number()
        .min(1, 'Invalid Input!')
        .required('Field is required/Invalid Percentage!'),
})

export const ManulExpress = Yup.object().shape({
    passPercentageL1Pre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    passPercentageL2Pre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    minStudentsPre: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    noOfAttemptsPre: Yup.string()
        .matches(Constants.Common.numOfAttemptsRegex, 'Invalid Number!')
        .required('Field is required/Invalid Number!'),
    noOfWorksheets: Yup.string()
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    noOfTestPapers: Yup.string()
        .required('Field is required/Invalid Percentage!')
        .min(1, 'Field is required!'),
    classPercentageRep: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_basic: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_intermediate: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    martix_advanced: Yup.string()
        .matches(Constants.Common.passPercentageRegex, 'Invalid Percentage!')
        .required('Field is required/Invalid Percentage!'),
    minNoQustionManual_express: Yup.number()
        .min(1, 'Invalid Input!')
        .required('Field is required/Invalid Percentage!'),
})




