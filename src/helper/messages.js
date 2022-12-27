const MESSAGES = {
  ERROR: {

    DigiCardNameExists: 'DigiCard Title exists already!',
    ChapterNameExists: 'Chapter Title exists already!',

    ComponentAdding: 'Error in adding the component! Please ensure that basic details component is completed.',
    ErrorInSendingEmail: 'Error in sending email!',
    ComponentEditing: 'Error in editing the component',
    ComponentFetching: 'Error in fetching the component',
    FilesUploading: 'Error in uploading the files',
    FilesDownloaded: 'Error in downloading the files',
    AddingClient: 'Error in adding Client',
    AddingUser: 'Error in adding User',
    UpdatingUser: 'Error in updating User',
    DeletingUser: 'Error in deleting User',
    DeletingConcept: 'Error in deleting Concept',
    DeletingSubject: 'Error in deleting Subject',
    UpdatingClient: 'Error in updating Client',
    AssignUsers: 'Error in assigning users',
    VerificationFailed: 'Verification Failed',
    ReportApproved: 'Report approve failed',
    ReportRejected: 'Report rejection failed',
    SomethingWentWrong: 'Something went wrong',
    IncorrectOtp: 'Incorrect OTP!',
    ClientNameExists: 'Client name exists already!',
    QcVerificationError: 'Error in verifying the component',
    QcApproveError: 'Error in approving the case!',
    QcRejectError: 'Error in rejecting the case!',
    ReportGenerationError: 'Report generation failed!'
  },
  SUCCESS: {
    RestoredSuccessfully: 'Restored Successfully!',

    AddingDigiCard: 'Added DigiCard Successfully',
    EditDigiCard: 'DigiCard Updated Successfully',

    AddingChapter: 'Added Chapter Successfully',
    EditChapter: 'Chapter Updated Successfully',

    PleaseCheckYourEmailForTheOTP: 'please check your mail for the otp!',
    RegisteredSuccessfully: 'registered successfully!',
    ComponentAdded: 'added successfully!',
    EmailSentSuccessfully: 'Email sent successfully!',
    ComponentEdited: 'edited successfully!',
    FilesUploaded: 'Files uploaded successfully',
    FilesDownloaded: 'Files downloaded successfully',
    AddingClient: 'Added Client Successfully',
    AddingUser: 'Added User Successfully',
    UpdatingUser: 'Updated User Successfully',
    UpdatingClient: 'Updated Client Successfully',
    AssignUsers: 'Users assigned successfully',
    VerificationDone: 'Verified successfully',
    ReportApproved: 'Report approved successfully',
    ReportRejected: 'Report rejected successfully',
    PasswordChanged: 'Password changed successfully',
    OtpValidated: 'OTP Validated successfully'
  },
  TTTLES: {
    Goodjob: 'Done',
    Sorry: 'Sorry',
    Success: 'Success',
    AreYouSure: 'Are you sure?',
    Warning: 'Warning!',
    InvalidFilesPresent: 'Invalid Files!',
    UploadMandatoryFiles: 'Upload Mandatory Files!',
    NoFilesPresent: 'No files available!'
  },
  INFO: {
    NO_CASES_MESSAGE: 'There are no cases!',
    NOT_ABLE_TO_RECOVER: 'Once deleted, you will not be able to recover this data!',
    ABLE_TO_RECOVER: 'You can anyway restore your data after deleting!',
    ABLE_TO_DELETE: 'You can anyway delete your data after restoring!',
    DATA_DELETED: 'Your data has been deleted!',
    USER_DELETED: 'The user has been deleted!',
    USER_RESTORED: 'The user details have been restored!',
    CLIENT_DELETED: 'The client has been deleted!',
    DATA_SAFE: 'Your data is safe!',
    FAILED_TO_RESTORE: 'Failed to restore!',
    APPROVE_DENY_REASON: 'Reason to ',
    CONCEPT_DELETED: 'The concept has been deleted!',
    CONCEPT_RESTORED: 'The concept has been restored!',
    SCHOOL_DELETED: 'School deleted successfully!',
    SUBJECT_RESTORED: 'The subject has been restored!',
    SUBJECT_DELETED: 'The subject has been deleted!',
  },
  VALIDATION: {
    MUST_BE_A_VALID_EMAIL_ADDRESS: 'Must be a valid email address',
    EMAIL_IS_REQUIRED: 'Email is required',
    PASSWORD_IS_REQUIRED: 'Password is required'
  },
  WARNINGS: {
    InappropriateAge: 'The employee is below 18',
    JoinDateReleivingDateMismatch: 'Releiving date should be ahead of joining date',
    InvalidFilesPresent: 'Uploaded files should be less than 1MB. Supported formats are .png, .jpg, .jpeg, .pdf',
    InvalidFilesPresentBulkUpload: 'Uploaded files should be less than 10MB. Supported formats are .xlsx',
    UploadMandatoryFiles: 'Please upload aadhar and pan card',
    NoFilesPresent: 'Please upload the mandatory evidences!',
    NoFilesPresentBulkUpload: 'Please upload file!',
    NoFilesPresentIdentification: 'Please upload the mandatory aadhar and pan evidence!',
    PleaseCheckYourEmailForErrorRecords: 'Wrong data inserted, please check your mail for more details!'
  }
};

export default MESSAGES;
