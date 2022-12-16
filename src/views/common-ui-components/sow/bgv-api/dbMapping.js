export const dbMapping = {
  BasicDetails: 'case_employee_data',
  Address: 'case_address_bgv',
  CreditCheck: 'case_creditCheck_bgv',
  CibilCheck: 'case_cibilCheck_bgv',
  Criminal: 'case_criminal_bgv',
  DatabaseCheck: 'case_globalDB_bgv',
  DrugTest: 'case_drugTest_bgv',
  Education: 'case_education_bgv',
  Employment: 'case_employment_bgv',
  Identification: 'case_id_bgv',
  GapVerification: 'case_gap_bgv',
  Reference: 'case_reference_bgv',
  CompanyCheck: 'case_company_bgv',
  CvValidation: 'case_cv_bgv',
  DirectorshipCheck: 'case_directorship_bgv',
  PoliceVerification: 'case_police_bgv',
  SocialMedia: 'case_socialmedia_bgv'
};

// Label
export const bgvStatus = {
  Awaiting: 'Awaiting',
  Wip: 'Work in progress',
  UnableToVerify: 'Unable to verify',
  Discrepancy: 'Discrepancy',
  Completed: 'Completed',
  Insufficient: 'Insufficiency',
  BgvStop: 'BGV stop'
};

// Label v2
export const bgvStatusV2 = {
  Awaiting: 'Awaiting',
  Wip: 'WIP',
  UnableToVerify: 'UnableToVerify',
  Discrepancy: 'Discrepancy',
  Completed: 'Completed',
  Insufficient: 'InSufficient',
  BgvStop: 'BgvStop'
};

// Values
export const bgvStatusValues = {
  Awaiting: 'Awaiting',
  Wip: 'WIP',
  UnableToVerify: 'UnableToVerify',
  Discrepancy: 'Discrepancy',
  Completed: 'Completed',
  Insufficient: 'InSufficient',
  BgvStop: 'BgvStop'
};

// Label
export const reportStatusOptions = {
  Awaiting: 'Awaiting',
  interimQcReview: 'Interim QC Review',
  interimQcApproved: 'Interim QC Approved',
  interimQcRejected: 'Interim QC Rejected',
  finalQcReview: 'Final QC Review',
  finalQcApproved: 'Final QC Approved',
  finalQcRejected: 'Final QC Rejected'
};

// Values
export const reportStatusOptionsValues = {
  totalInterimReports: 'Awaiting',
  totalFinalReports: 'WIP',
  approvedInterimReports: 'Unable to verify',
  approvedFinalReports: 'Discrepancy',
  rejectedInterimReports: 'Completed',
  rejectedFinalReports: 'InSufficient'
};
