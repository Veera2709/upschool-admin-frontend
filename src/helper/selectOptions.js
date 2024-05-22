import { bgvStatus, bgvStatusValues } from '../views/common-ui-components/sow/bgv-api/dbMapping';

export const idTypes = [
  {
    value: 'aadhar',
    label: 'Aadhar Card'
  },
  {
    value: 'dl',
    label: 'Driving Licence'
  },
  {
    value: 'voterid',
    label: 'Voter Id'
  },
  {
    value: 'passport',
    label: 'Passport'
  },
  {
    value: 'pan',
    label: 'Pan Card'
  },
  {
    value: 'nationalid',
    label: 'National Id'
  }
];

export const componentsArray = [
  { value: '', label: 'Select a component' },
  { value: 'Identification', label: 'Identification' },
  { value: 'Address', label: 'Address' },
  { value: 'CibilCheck', label: 'Cibil Check' },
  { value: 'CompanyCheck', label: 'Company Check' },
  { value: 'CreditCheck', label: 'Credit Check' },
  { value: 'Criminal', label: 'Criminal' },
  { value: 'CvValidation', label: 'Cv Validation' },
  { value: 'DatabaseCheck', label: 'Database Check' },
  { value: 'DirectorshipCheck', label: 'Directorship Check' },
  { value: 'DrugTest', label: 'Drug Test' },
  { value: 'Education', label: 'Education' },
  { value: 'Employment', label: 'Employment' },
  { value: 'GapVerification', label: 'Gap Verification' },
  { value: 'PoliceVerification', label: 'Police Verification' },
  { value: 'Reference', label: 'Reference' },
  { value: 'SocialMedia', label: 'Social Media' }
];

export const addressTypeOptions = [
  { value: '', label: 'Select an option' },
  { value: 'Permanent', label: 'Permanent' },
  { value: 'Current', label: 'Current' }
  // { value: 'Intermediate1', label: 'Intermediate1' },
  // { value: 'Intermediate2', label: 'Intermediate2' }
];

export const addressTypeOptionsArray = ['Permanent', 'Current'];

export const dbEvidenceTypeOptions = [
  { value: '', label: 'Select an option' },
  { value: 'IndiaSpecific', label: 'India-specific Database Checks' },
  { value: 'Global', label: 'Global Database Checks' },
  { value: 'WebAndMedia', label: 'Web and Media Checks' }
];

export const dbEvidenceTypeOptionsArray = ['IndiaSpecific', 'Global', 'WebAndMedia'];

// Verification part -----------------------------------------------------

export const verificationOptions = [
  { value: '', label: 'Select an option' },
  { value: 'Verified to be correct', label: 'Verified to be correct' },
  { value: 'Verified to be incorrect', label: 'Verified to be incorrect' }
];

// this should match the verificationOptions.value
export const verificationOptionsArray = ['Verified to be correct', 'Verified to be incorrect'];

export const evidenceUploadStatusOptions = [
  { value: '', label: 'Select an option' },
  { value: bgvStatusValues.Awaiting, label: bgvStatus.Awaiting },
  { value: bgvStatusValues.Wip, label: bgvStatus.Wip },
  { value: bgvStatusValues.Completed, label: bgvStatus.Completed },
  { value: bgvStatusValues.UnableToVerify, label: bgvStatus.UnableToVerify },
  { value: bgvStatusValues.Insufficient, label: bgvStatus.Insufficient },
  { value: bgvStatusValues.Discrepancy, label: bgvStatus.Discrepancy },
  { value: bgvStatusValues.BgvStop, label: bgvStatus.BgvStop }
];

export const evidenceUploadStatusOptionsArray = [
  bgvStatusValues.Awaiting,
  bgvStatusValues.Wip,
  bgvStatusValues.Completed,
  bgvStatusValues.UnableToVerify,
  bgvStatusValues.Insufficient,
  bgvStatusValues.Discrepancy,
  bgvStatusValues.BgvStop
];

export const verificationStatusOptions = [
  { value: '', label: 'Select an option' },
  { value: bgvStatusValues.Completed, label: bgvStatus.Completed },
  { value: bgvStatusValues.UnableToVerify, label: bgvStatus.UnableToVerify },
  { value: bgvStatusValues.Insufficient, label: bgvStatus.Insufficient },
  { value: bgvStatusValues.Discrepancy, label: bgvStatus.Discrepancy }
];

export const verificationStatusOptionsArray = [
  bgvStatusValues.Completed,
  bgvStatusValues.UnableToVerify,
  bgvStatusValues.Insufficient,
  bgvStatusValues.Discrepancy
];

export const verificationTypeOptions = [
  { value: '', label: 'Select an option' },
  { value: 'Police', label: 'Police' }
];

export const verificationTypeOptionsArray = ['Police'];

export const verificationModeOptions = [
  { value: '', label: 'Select an option' },
  { value: 'Written', label: 'Written' }
];

export const verificationModeOptionsArray = ['Written'];

export const eligibleForRehireOptions = [
  { value: '', label: 'Select an option' },
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' }
];

// this should match the eligibleForRehireOptions.value
export const eligibleForRehireOptionsArray = ['Yes', 'No'];

export const YesNoOptions = [
  { value: '', label: 'Select an option' },
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' }
];

export const YesNoArray = ['Yes', 'No'];

export const modeOfVerificationOptions = [
  { value: '', label: 'Select an option' },
  { value: 'E-Communication', label: 'E-Communication' },
  { value: 'Online', label: 'Online' },
  { value: 'Liaison', label: 'Liaison' },
  { value: 'Personal Visit', label: 'Personal Visit' }
];

// this should match the modeOfVerificationOptions.value
export const modeOfVerificationOptionsArray = ['E-Communication', 'Online', 'Liaison', 'Personal Visit'];

export const foundNotFoundOptions = [
  { value: '', label: 'Select an option' },
  { value: 'Found', label: 'Found' },
  { value: 'Not Found', label: 'Not Found' }
];

// this should match the foundNotFoundOptions.value
export const foundNotFoundOptionsArray = ['Found', 'Not Found'];

export const contactRelationshipOptions = [
  { value: '', label: 'Select an option' },
  { value: 'Colleague', label: 'Colleague' },
  { value: 'Friend', label: 'Friend' },
  { value: 'Others', label: 'Others' }
];

// this should match the contactRelationshipOptions.value
export const contactRelationshipOptionsArray = ['Colleague', 'Friend', 'Others'];
