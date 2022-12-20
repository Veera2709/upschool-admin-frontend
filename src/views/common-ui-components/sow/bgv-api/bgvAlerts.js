import MESSAGES from '../../../../helper/messages';

export  const bgvAlerts = {
  compInsertSuccess: {
    title: MESSAGES.TTTLES.Goodjob,
    type: 'success',
    text: 'Component ' + MESSAGES.SUCCESS.ComponentAdded
  },
  emailSentSuccessfully: {
    title: MESSAGES.TTTLES.Goodjob,
    type: 'success',
    text: 'Component ' + MESSAGES.SUCCESS.EmailSentSuccessfully
  },
  compUpdateSuccess: {
    title: MESSAGES.TTTLES.Goodjob,
    type: 'success',
    text: 'Component ' + MESSAGES.SUCCESS.ComponentEdited
  },
  compInsertError: {
    title: MESSAGES.TTTLES.Sorry,
    type: 'error',
    text: MESSAGES.ERROR.ComponentAdding
  },
  sendEmailError: {
    title: MESSAGES.TTTLES.Sorry,
    type: 'error',
    text: MESSAGES.ERROR.ErrorInSendingEmail
  },
  compUpdateError: {
    title: MESSAGES.TTTLES.Sorry,
    type: 'error',
    text: MESSAGES.ERROR.ComponentEditing
  },
  qcApprovedError: {
    title: MESSAGES.TTTLES.Sorry,
    type: 'error',
    text: MESSAGES.ERROR.QcApproveError
  },
  qcRejectedError: {
    title: MESSAGES.TTTLES.Sorry,
    type: 'error',
    text: MESSAGES.ERROR.QcRejectError
  },
  verificationSuccess: {
    title: MESSAGES.TTTLES.Goodjob,
    type: 'success',
    text: MESSAGES.SUCCESS.VerificationDone
  },
  verificationFailed: {
    title: MESSAGES.TTTLES.Sorry,
    type: 'error',
    text: MESSAGES.ERROR.VerificationFailed
  },
  qcApproveSuccess: {
    title: MESSAGES.TTTLES.Goodjob,
    type: 'success',
    text: MESSAGES.SUCCESS.QcApproved
  },
  qcRejectSuccess: {
    title: MESSAGES.TTTLES.Goodjob,
    type: 'success',
    text: MESSAGES.SUCCESS.QcRejected
  },
  reportGenerationError: {
    title: MESSAGES.TTTLES.Sorry,
    type: 'error',
    text: MESSAGES.ERROR.ReportGenerationError
  },
  reportGenerationSuccess: {
    title: MESSAGES.TTTLES.Goodjob,
    type: 'success',
    text: MESSAGES.SUCCESS.ReportGenerationSuccess
  },
  inappropriateAge: {
    title: MESSAGES.TTTLES.Warning,
    type: 'warning',
    text: MESSAGES.WARNINGS.InappropriateAge
  },
  joinDateReleivingDateMismatch: {
    title: MESSAGES.TTTLES.Warning,
    type: 'warning',
    text: MESSAGES.WARNINGS.JoinDateReleivingDateMismatch
  },
  invalidFilesPresent: {
    title: MESSAGES.TTTLES.InvalidFilesPresent,
    type: 'warning',
    text: MESSAGES.WARNINGS.InvalidFilesPresent
  },
  invalidFilesPresentBulkUpload: {
    title: MESSAGES.TTTLES.InvalidFilesPresent,
    type: 'warning',
    text: MESSAGES.WARNINGS.InvalidFilesPresentBulkUpload
  },
  uploadMandatoryFiles: {
    title: MESSAGES.TTTLES.UploadMandatoryFiles,
    type: 'warning',
    text: MESSAGES.WARNINGS.UploadMandatoryFiles
  },
  noFilesPresent: {
    title: MESSAGES.TTTLES.NoFilesPresent,
    type: 'warning',
    text: MESSAGES.WARNINGS.NoFilesPresent
  },
  requiredIdFiles: {
    title: MESSAGES.TTTLES.UploadMandatoryFiles,
    type: 'warning',
    text: MESSAGES.WARNINGS.NoFilesPresentIdentification
  },
  noFilesPresentBulkUpload: {
    title: MESSAGES.TTTLES.Warning,
    type: 'warning',
    text: MESSAGES.WARNINGS.NoFilesPresentBulkUpload
  },
  forgotPassword: {
    title: MESSAGES.SUCCESS.Success,
    type: 'success',
    text: MESSAGES.SUCCESS.PleaseCheckYourEmailForTheOTP
  },
  passwordChanged: {
    title: MESSAGES.TTTLES.Success,
    type: 'success',
    text: MESSAGES.SUCCESS.PasswordChanged
  },
  OtpValidated: {
    title: MESSAGES.TTTLES.Success,
    type: 'success',
    text: MESSAGES.SUCCESS.OtpValidated
  },
  SomethingWentWrong: {
    title: MESSAGES.TTTLES.Sorry,
    type: 'error',
    text: MESSAGES.ERROR.SomethingWentWrong
  },
  incorrectOTP: {
    title: MESSAGES.TTTLES.Sorry,
    type: 'error',
    text: MESSAGES.ERROR.IncorrectOtp
  }
};
