export const AddUserForm = {
  UserNameRegex: /^([a-zA-Z]+\s)*[a-zA-Z]+$/,
  UserNameValidation: 'User name should contain only alphabets!',
  // 1) test[space]ing - Should be allowed
  // 2) testing - Should be allowed
  // 3) [space]testing - Should not be allowed
  // 4) testing[space] - Should be allowed but have to trim it
  // 5) testing[space][space] - should be allowed but have to trim it
  // 6) Numbers are not allowed
  UserNameIsRequired: 'User name is required!',
  UserNameIsTooShort: 'User name is too short!',
  UserNameIsTooLong: 'User name is too long!',
  EmailRequired: 'Email Id is required!',
  ValiedEmail: 'Must be a Valid Email Id!',
  PasswordRequired: 'Password is required!',
  PasswordMustHaveMinimum8Characters: 'Password must have Minimum 8 Characters!',
  PasswordRegExp: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
  PasswordValidation: 'Password must have Atleast One Uppercase, Lowercase, Number, Special Character!',
  PhonNumberRequired: 'Phone number is required!',
  PhoneNumberRegExp: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
  // the phone number regex accepts (123) 456-7890, (123)456-7890, 123-456-7890, 123.456.7890, 1234567890, +31636363634, 075-63546725 formats
  ValidPhoneNumber: 'Enter Valid Phone Number!'
};

export const AddDigiCard = {
  DigiCardNameRegex: /^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/,
  DigiCardNameRequired: 'Digicard name is required!',
  DigiCardNameTooShort: 'Digicard name is too short!',
  DigiCardNameTooLong: 'Digicard name is too long!',
  DigiCardNameValidation: 'Digicard name should contain only alphabets and numbers!',

  DigiCardtitleRegex: /^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/,
  DigiCardtitleRequired: 'Digicard title is required!',
  DigiCardtitleTooShort: 'Digicard title is too short!',
  DigiCardtitleTooLong: 'Digicard title is too long!',
  DigiCardtitleValidation: 'Digicard title should contain only alphabets and numbers!',


  ChaptertitleRequired: 'Chapter title is required!',
  ChaptertitleTooShort: 'chapter title is too short!',
  ChaptertitleTooLong: "chapter title is too long!",



  DigiCardImageNotNull: 'Digicard Image should not be null!',
  DigiCardImageRequired: 'Digicard Image is required!',

  DigiCardFileNotNull: 'Digicard File should not be null!',
  DigiCardfileRequired: 'Digicard File is required!',

  DigiCardKeyRequired: 'Digicard Key Words are required!',

  UserNameValidation: 'User name should contain only alphabets!',
  ValidContact: 'Must be a valid contact number!',
  EntityNameRequired: 'Entity name is required!',
  EntityNameTooShort: 'Entity name is too short!',
  EntityNameTooLong: 'Entity name is too long!',
  EntityNameValidation: 'Entity name should contain only alphabets!',
  SubCategoryRequired: 'Sub category is required!',
  SubCategoryTooShort: 'Sub category is too short!',
  SubCategoryTooLong: 'Sub category is too long!',
  PrimaryContactRequired: 'Primary contact is required!',
  PrimaryContactRegExp: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
  PrimaryContactTooShort: 'Primary contact is too short!',
  PrimaryContactTooLong: 'Primary contact is too long!',
  SecondaryContactRequired: 'Secondary contact is required!',
  SecondaryContactRegExp: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
  SecondaryContactTooShort: 'Secondary contact is too short!',
  SecondaryContactTooLong: 'Secondary contact is too long!',
  ClientAddressRequired: 'Client address is required!',
  ClientAddressTooShort: 'Client address is too short!',
  ClientAddressTooLong: 'Client address is too long!',
  BillingAddressRequired: 'Billing address is required!',
  BillingAddressTooShort: 'Billing address is too short!',
  BillingAddressTooLong: 'Billing address is too long!',
  PricingRequired: 'Pricing is required!',
  PricingRegex: /^\d+$/,
  PricingOnlyNumber: 'Pricing should contain only numbers!'
};
export const AddUnit = {
  
  UnittitleRequired: 'Unit title is required!',
  UnittitleTooShort: 'Unit title is too short!',
  UnittitleTooLong: "Unit title is too long!",
  DescriptionRequired: "Unit Description is required!",
};

export const AddClasses = {
  ClasstitleTooShort: 'Class Title is too short',
  ClasstitleTooLong: 'Class Title is too Long',
  ClasstitleRequired: 'Class Title is required!',
};
export const AddTopic = {
  
  TopictitleRequired: 'Topic title is required!',
  QuizMinutesRequired: 'Quiz Minutes are required!',
  TopictitleTooShort: 'Topic title is too short!',
  TopictitleTooLong: "Topic title is too long!",
  DescriptionRequired:" Topic Description is required!"
};

export const AddSection = {
  
  SectionTitleRequired: 'Section name is required!',
  QuizMinutesRequired: 'Quiz Minutes are required!',
  TopictitleTooShort: 'Topic title is too short!',
  TopictitleTooLong: "Topic title is too long!",
  DescriptionRequired:" Topic Description is required!"
};

export const AddressForm = {
  curAddressRequired: 'Address is required!',
  curAddressTooShort: 'Address is too short!',
  curAddressTooLong: 'Address is too long!',
  curLandMarkRequired: 'Land mark is required!',
  curLandMarkTooShort: 'Land mark is too short!',
  curLandMarkTooLong: 'Land mark is too long!',
  curLandMarkAlphabets: 'Land mark must contain only alphabets!',
  curCityRequired: 'City is required!',
  curCityTooShort: 'City is too short!',
  curCityTooLong: 'City is too long!',
  validCity: 'City must contain only alphabets!',
  curStateRequired: 'State is required',
  curStateTooShort: 'State is too short!',
  curStateTooLong: 'State is long!',
  validState: 'State must contain only alphabets!',
  curStayPeriodRequired: 'Stay period is required!',
  curStayPeriodTooShort: 'Stay period is too short!',
  curStayPeriodTooLong: 'Stay period is too long!',
  curCountryRequired: 'Country is required!',
  curCountryTooShort: 'Country is too short!',
  curCountryTooLong: 'Country is too long!',
  validContry: 'Contry must contain only alphabets!',
  curPostalCodeRequired: 'Postal code is required!',
  curPostalCodeTooShort: 'Postal code is too short!',
  curPostalCodeTooLong: 'Postal code is too long!',
  postalCodeRegex: `^[1-9][0-9]{5}$`,
  valiedPostalCode: 'Must be valid postal code!',
  curProofTypeRequired: 'Proof type is required!',
  curProofTypeTooShort: 'Proof type is too short',
  curProofTypeTooLong: 'Proof type is too long',
  valiedProofType: 'Must be valid proof type!',
  curPhoneNoRequired: 'Contact number is required!',
  curPhoneRegex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
  curPhoneNoValied: 'Enter the valid phone number!',

  permAddressRequired: 'Permanent address is required!',
  permAddressTooShort: 'Permanent address is too short!',
  permAddressTooLong: 'Permanent Address is too long!',
  permLandMarkRequired: 'Permanent Land mark is required!',
  permLandMarkTooShort: 'Permanent Land mark is too short!',
  permLandMarkTooLong: 'Permanent Land mark is too long!',
  permCityRequired: 'Permanent City is required!',
  permCityTooShort: 'Permanent City is too short!',
  permCityTooLong: 'Permanent City is too long!',
  permStateRequired: 'Permanent State is required!',
  permStateTooShort: 'Permanent State is too short!',
  permStateTooLong: 'Permanent State is long!',
  permStayPeriodRequired: 'Permanent Stay period is required!',
  permStayPeriodTooShort: 'Permanent Stay period is too short!',
  permStayPeriodTooLong: 'Permanent Stay period is too long!',
  permCountryRequired: 'Permanent Country is required!',
  permCountryTooShort: 'Permanent Country is too short!',
  permCountryTooLong: 'Permanent Country is too long!',
  permPostalCodeRequired: 'Permanent Postal code is required!',
  permPostalCodeTooShort: 'Permanent Postal code is too short!',
  permPostalCodeTooLong: 'Permanent Postal code is too long!',
  permProofTypeRequired: 'Permanent Proof type is required!',
  permProofTypeTooShort: 'Permanent Proof type is too short!',
  permProofTypeTooLong: 'Permanent Proof type is too long!',
  permPhoneRequired: 'Contact number is required!',
  validPermPhone: 'Must be valid contact number!',
  permPhoneRegex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
  permPhoneNoValied: 'Enter the valid contact number!',

  prevAddressRequired: 'Previous address is required!',
  prevAddressTooShort: 'Previous address is too short!',
  prevAddressTooLong: 'Previous Address is too long!',
  prevLandMarkRequired: 'Previous Land mark is required!',
  prevLandMarkTooShort: 'Previous Land mark is too short!',
  prevLandMarkTooLong: 'Previous Land mark is too long!',
  prevCityRequired: 'Previous City is required!',
  prevCityTooShort: 'Previous City is too short!',
  prevCityTooLong: 'Previous City is too long!',
  prevStateRequired: 'Previous State is required!',
  prevStateTooShort: 'Previous State is too short!',
  prevStateTooLong: 'Previous State is long!',
  prevStayPeriodRequired: 'Previous Stay period is required!',
  prevStayPeriodTooShort: 'Previous Stay period is too short!',
  prevStayPeriodTooLong: 'Previous Stay period is too long!',
  prevCountryRequired: 'Previous Country is required!',
  prevCountryTooShort: 'Previous Country is too short!',
  prevCountryTooLong: 'Previous Country is too long!',
  prevPostalCodeRequired: 'Previous Postal code is required!',
  prevPostalCodeTooShort: 'Previous Postal code is too short!',
  prevPostalCodeTooLong: 'Previous Postal code is too long!',
  prevProofTypeRequired: 'Previous Proof type is required!',
  prevProofTypeTooShort: 'Previous Proof type is too short!',
  prevProofTypeTooLong: 'Previous Proof type is too long!',
  prevPhoneRequired: 'Contact number is required!',
  prevPhoneRegex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
  prevPhoneNoValied: 'Enter the valid contact number!',

  validProofType: 'Proof type must contain only alphabets'
};

export const BasicDetailsForm = {
  firstNameRequired: 'First name is required!',
  firstNameTooShort: 'First name is too short',
  firstNameTooLong: 'First name is too long',
  validFirstName: 'First name should contain only alphabets!',
  lastNameRequired: 'Last name is required!',
  lastNameTooShort: 'Last name is too short!',
  validLastName: 'Last name should contain only alphabets!',
  lastNameTooLong: 'Last name is too long!',
  empGenderRequired: '',
  empPhoneRequired: 'Phone number is required!',
  phonRegex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
  valiedPhoneNumber: 'Must be valid phone number!',
  empEmailRequired: 'Email is required!',
  ValidEmail: 'Must be a valid email',
  empDobRequired: 'Date of birth is required!',
  empFatherNameRequired: 'Father name is required!',
  empFatherNameTooShort: 'Father name is too short!',
  empFatherNameTooLong: 'Father name is too long!',
  validFatherName: 'Father name should contain only alphabets!',
  empAadharNoRequired: 'Aadhar number is required!',
  aadhaarCardRegex: /^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$/,
  validAadhar: 'Must be valid aadhar card number!',
  empPanNoRequired: 'Pan number is required!',
  panRegex: /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
  validPanNumber: 'Pan number must be in BNZAA2318J format!',
  empLandmarkRequired: 'Land mark is required!',
  landmarkTooShort: 'Land mark is too short!',
  landmarkTooLong: 'Land mark is too long!',
  empCityRequired: 'City is required!',
  cityTooShort: 'City is too short!',
  cityTooLong: 'City is too long!',
  validCity: 'City must contain only alphabets!',
  empStateRequired: 'State is required!',
  stateTooShort: 'State is too short!',
  stateTooLong: 'State is too long!',
  validState: 'State must contain only alphabets!',
  empBirthCountryRequired: 'Country of birth is required!',
  empCitizenshipRequired: 'Citizenship is required!',
  empJoiningDateRequired: 'Date of joining is required!',
  consentCheckboxRequired: 'You need to accept the terms and conditions!'
};

export const EducationForm = {
  collegeNameRequired: 'College name is required!',
  validCollegeName: 'Must contain only alphabets!',
  collegeNameTooShort: 'College name is too short!',
  collegeNameTooLong: 'College name is too long!',
  univNameRequired: 'University name is required!',
  univNameTooShort: 'University name is too short!',
  univNameTooLong: 'University name is too long!',
  validEmail: 'Must be valid email!',
  requiredEmail: 'Institution email is required!',
  validUniName: 'Must contain only alphabets!',
  cityRequired: 'City is required!',
  cityTooShort: 'City is too short!',
  cityTooLong: 'City is too long!',
  validCity: 'Must contain only alphabets!',
  postalCodeRequired: 'Postal code is required!',
  postalCodeRegex: `^[1-9][0-9]{5}$`,
  valiedPostalCode: 'Must be valid postal code!',
  telNoRequired: 'Telephone number is required!',
  validTelNo: 'Must be valid Telephone number!',
  qualificationRequired: 'Qualification is required!',
  qualificationTooShort: 'Qualification is too short!',
  qualificationTooLong: 'Qualification is too long!',
  validQualification: 'Qualification is not valid!',
  studyPeriodRequired: 'Study period is required!',
  studyPeriodTooLong: 'Study period is too long!',
  studyPeriodRegex: '[A-Za-z0-9_]',
  validStudyPeriod: 'Must be the valied study period!',
  rollNoRequired: 'Roll number / Student Id is required!',
  validrollNo: 'Must be valid Roll number / Student Id!',
  percentageRequired: 'Class / Division / Percentage is required!',
  validPercentage: 'Must be valid Class / Division / Percentage!'
};

export const Employment = {
  YesNo: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' }
  ],
  invalidOption: 'Invalid option!',
  basicRequired: 'Required!',
  currEmpNameRequired: 'Employee name is required!',
  currEmpNameAlphabets: 'Employee name must contain only alphabets!',
  currHrAlphabets: 'HR name must contain only alphabets!',
  currHrNameTooShort: 'HR name is too short!',
  currHrNameTooLong: 'HR name is too long!',
  currLocationRequired: 'Location is required!',
  currLocationSpecial: 'Special characters are not allowed!',
  currCityRequired: 'City is required!',
  currCityAlphabets: 'City must contain only alphabets!',
  currTelNoRequired: ' Telephone number is required!',
  validTelNo: 'Must be valid Telephone number!',
  currJobtitleRequired: 'Job title is required!',
  currJobtitleAlphabets: 'Job title must contain only alphabets!',
  currEmpCodeRequired: 'Employee code is required!',
  currEmpCodeSpecial: 'Special characters are not allowed!',
  currEmpCtcRequired: 'Employee CTC is required!',
  currEmpCtcTooShort: 'Salary must contain atleast 3 characters!',
  currEmpCtcTooLong: 'Salary must contain maximum 10 characters!',
  noSepcial: 'Special characters are not allowed!',
  currJoinDateRequired: 'Join date is required!',
  currRelievingRequired: 'Relieving date is required!',
  currEmpPeriodRequired: 'Period of employee is required!',
  currEmpLeavingReasonTooLong: 'Reason for leaving is too long!',
  currEmpLeavingReasonSpecial: 'Special characters are not allowed!',
  currEmpLeavingReasonRequired: 'Leaving reason is required!',
  currManagerDetailsRequired: 'Manager detail is required!',
  currHrNameRequired: 'HR Name is required!',
  currManagerPhoneRequired: 'Manager phone number is required!',
  currManagerEmailRequired: 'Manager email is required!',
  currHrEmailRequired: 'HR email is required!',
  numbersNotAllowed: 'Numbers are not allowed!',
  onlyAlphabets: 'Must contain only alphabets!',
  validEmail: 'Must be valid email!',
  EmailsRequired: 'Email is required!',
  NameIsTooShort: 'Name is too short!',
  NameIsTooLong: 'Name is too long!',
  LocationTooShort: 'Location is too short!',
  LocationTooLong: 'Location is too long!',
  CityIsTooShort: 'City is too short!',
  CityIsTooLong: 'City is too long!',
  JobTitleIsTooShort: 'Job title is too short!',
  JobTitleIsTooLong: 'Job title is too long!',
  reasonTooShort: 'reason is too short!',
  reasonTooLong: 'reason is too long!',
  managerDetailsTooShort: 'Manager details is too short!',
  managerDetailsTooLong: 'Manager details is too long!',
  hrNameTooShort: 'HR Name is too short!',
  hrNameTooLong: 'HR Name is too long!'
};

export const IdentificationForm = {
  AadharFileRequired: 'Aadhar file is required!',
  AadharNameRequired: 'Aadhar name is required!',
  AadharNameTooLong: 'Aadhar name is too long!',
  AadharNameTooShort: 'Aadhar name is too short!',
  AadharDobRequired: 'Aadhar dob is required!',
  AadharNoIsRequired: 'Aadhar number is required!',
  ValidAadhar: 'Must be valid aadhar number!',
  PanNameRequired: 'Pan name is required!',
  PanNameTooLong: 'Pan name is too long!',
  PanNameTooShort: 'Pan name is too short!',
  PanDobRequired: 'Pan dob is required!',
  PanNumberIsRequired: 'Pan number is required!',
  ValidPan: 'Pan number must be in BNZAA2318J format!',
  PassportNoIsRequired: 'Passport number is required!',
  PassportNameRequired: 'Passport name is required!',
  PassportNameTooLong: 'Passport name is too long!',
  PassportNameTooShort: 'Passport name is too short!',
  PassportDobRequired: 'Passport dob is required!',
  ValidPassport: 'Passport number must be in A2096457 format!',
  DrivingLicenseNoIsRequired: 'Driving License number is required!',
  DlNameRequired: 'Driving license name is required!',
  DlNameTooLong: 'Driving license name is too long!',
  DlNameTooShort: 'Driving license name is too short!',
  DlDobRequired: 'Driving license dob is required!',
  ValidDL: 'Driving license must be in HR-0619850034761 format!',
  VoterIdNoIsRequired: 'Voter Id number is required!',
  VoterIdNameRequired: 'Voter Id name is required!',
  VoterIdNameTooLong: 'Voter Id name is too long!',
  VoterIdNameTooShort: 'Voter Id name is too short!',
  VoterIdDobRequired: 'Voter Id dob is required!',
  ValidVoterId: 'Voter id number must be in ABE1234566 format!',
  RCBookNameRequired: 'RC Book name is required!',
  RCBookNameTooLong: 'RC Book name is too long!',
  RCBookNameTooShort: 'RC Book name is too short!',
  RCBookDobRequired: 'RC Book dob is required!',
  RCBookNoIsRequired: 'RC Book number is required!',
  ValidRcBook: 'RC book number must be in TN 02 AA 8909 format!'
};

export const PoliceVerificationForm = {
  AadharNoIsRequired: 'Aadhar number is required!',
  ValidAadhar: 'Must be valid aadhar number!',
  AddressTypeInvalid: 'Address type is invalid!',
  AddressTypeRequired: 'Address type is required!',
  AddressRequired: 'Address is required!',
  AddressTooShort: 'Address is too short!',
  AddressTooLong: 'Address is too long!',
  PeriofOfStayRequired: 'Period of stay is required!',
  PeriofOfStayTooShort: 'Period of stay is too short!',
  PeriofOfStayTooLong: 'Period of stay is too long!'
};

export const Reference = {
  RespondentNameRequired: 'Respondent Name is required!',
  RespondentNameAlphabets: 'Respondent Name must contain only alphabets!',
  RespondentNameTooShort: 'Respondent Name is too short!',
  RespondentNameTooLong: 'Respondent Name is too long!',
  RespondantEmailRequired: 'Respondant email is required!',
  RespondantEmailValid: 'Must be a valid email',
  DesignationRequired: 'Designation is required!',
  DesignationAlphabets: 'Designation must contain only alphabets!',
  DesignationTooShort: 'Designation is too short!',
  DesignationTooLong: 'Designation is too long!',
  OrganizationNameRequired: 'Organization Name is required!',
  OrganizationNameTooShort: 'Organization Name is too short!',
  OrganizationNameTooLong: 'Organization Name is too Long!',
  OrganizationNamemustAlphabets: 'Organization Name must contain only alphabets!',
  ContactDetailsRequired: 'Contact details is required!',
  ContactDetailsTooShort: 'Contact details is too short!',
  ContactDetailsTooLong: 'Contact details is too long!',
  ContactDetailsInvalid: 'Contact details is invalid!',
  ContactRelationshipRequired: 'Contact relationship is required!',
  ContactRelationshipInvalid: 'Invalid contact relationship!',
  ContactRelationshipTooShort: 'Contact relationship is too short!',
  ContactRelationshipTooLong: 'Contact relationship is too long!'
};

export const ReferenceVerification = {
  associationPeriodRequired: 'Association Period is required!',
  professionalCompetenceRequired: 'Professional Competence is required!',
  strengthRequired: 'Strength is required!',
  areasToImproveRequired: 'Areas to improve is required!',
  jobRecommendationRequired: 'Job recommendation is required!',
  additionalCommentsRequired: 'Additional comments is required!'
};

export const GapVerificationForm = {
  GapType: [
    { label: 'Employment', value: 'Employment' },
    { label: 'Education', value: 'Education' }
  ],
  GapTypeRequired: 'Type os gap is required!',
  GapTypeTooShort: 'Type os gap is too short!',
  GapTypeTooLong: 'Type os gap is too long!',
  GapTypeAlphabets: 'Type os gap must contain only alphabets!',
  GapPeriodRequired: 'Period of gap is required!',
  GapPeriodTooShort: 'Period of gap is too short!',
  GapPeriodTooLong: 'Period of gap is too long!',
  GapPeriodAlphabets: 'Period of gap must cuntain only alphabets!',
  GapReasonRequired: 'Reason for gap is required!',
  GapReasonTooShort: 'Reason for gap is too short!',
  GapReasonTooLong: 'Reason for gap is too long!',
  GapReasonAlphabets: 'Reason for gap must cuntain only alphabets!'
};

export const VerificationCommon = {
  InvalidDefault: 'Invalid!',
  RequiredDefault: 'Required!',
  StatusDescriptionRequired: 'Status description is required!',
  StatusDescriptionInvalid: 'Status description is invalid!',
  StatusDescriptionTooShort: 'Status description is too short!',
  StatusDescriptionTooLong: 'Status description is too long!',
  AdditionalCommentRequired: 'Additional comment is required!',
  AdditionalCommentTooShort: 'Additional comment is too short!',
  AdditionalCommentTooLong: 'Additional comment is too long!',
  AuthenticatedByRequired: 'Authenticated by is required!',
  AuthenticatedByTooShort: 'Authenticated by is too short!',
  AuthenticatedByTooLong: 'Authenticated by is too long!',
  AuthenticatedByInvalid: 'Authenticated by is Invalid!',
  ContactDetailsRequired: 'Contact detail is required!',
  ContactDetailsTooShort: 'Contact detail is too short!',
  ContactDetailsTooLong: 'Contact detail is too long!',
  ContactDetailsInvalid: 'Contact detail is too long!',
  VerificationStatusInvalid: 'Verification status is invalid!',
  PleaseAssignToACSTMember: 'Please assign to a CST member!',
  VerificationStatusRequired: 'Verification status is required!',
  VerificationTypeInvalid: 'Verification type is invalid!',
  VerificationTypeRequired: 'Verification type is required!',
  EvidenceTypeInvalid: 'Evidence type is invalid!',
  EvidenceTypeRequired: 'Evidence type is required!',
  VerificationModeInvalid: 'Verification mode is invalid!',
  VerificationModeRequired: 'Verification mode is required!',
  EligibleForRehireInvalid: 'Eligibility is invalid!',
  EligibleForRehireRequired: 'Eligibility is required!',
  ModeOfVerificationInvalid: 'Mode of verification is invalid!',
  ModeOfVerificationRequired: 'Mode of verification is required!',
  VerifiedDateRequired: 'Verification date is required',
  ChangeStatusRequired: 'Change status is required!',
  RemarkTooShort: 'Remark is too short!',
  RemarkTooLong: 'Remark is too long!',
  RemarkRequired: 'Remark is required!',
  RespondentNameTooShort: 'Respondent name is too short!',
  RespondentNameTooLong: 'Respondent name is too long!',
  RespondentNameRequired: 'Respondent name is required!',
  RespondentNameInvalid: 'Respondent name is invalid!',
  CompletedDateRequired: 'Completed date is required',
  CommonTooLong: 'Too long!',
  CommonTooShort: 'Too short!',
  CommonInvalidOptionInvalid: 'Invalid option!',
  CommonInvalidOptionRequired: 'Required!'
};

export const criminal = {
  authorizedPersonNameRequired: 'Authorized Person Name is required!',
  authorizedPersonNameShort: 'Authorized Person Name is too short',
  authorizedPersonNameLong: 'Authorized Person Name is too long'
};

export const creditCheckForm = {
  nameRequired: 'Name is required!',
  nameAlphabets: 'Name should contain only alphabets!',
  nameTooShort: 'Name is too short!',
  nameTooLong: 'Name is too long!'
};

export const cibilCheckForm = {
  nameRequired: 'Name is required!',
  nameAlphabets: 'Name should contain only alphabets!',
  nameTooShort: 'Name is too short!',
  nameTooLong: 'Name is too long!'
};

export const SocialMedia = {
  faceBookRequired: 'Enter the facebook account name or link!',
  twitterRequired: 'Enter the twitter account name or link!',
  instagramRequired: 'Enter the instagram account name or link!',
  linkedInRequired: 'Enter the linkedIn account name or link!'
};

export const DatabaseCheckForm = {
  nameRequired: 'Name is required!',
  dateRequired: 'Dob is required!',
  validName: 'Please enter the valid name!',
  nameTooShort: 'Name is too short!',
  nameTooLong: 'Name is too long!'
};

export const DirectorShipCheckForm = {
  nameRequired: 'Name is required!',
  dateRequired: 'Dob is required!',
  validName: 'Please enter the valid name!',
  nameTooShort: 'Name is too short!',
  nameTooLong: 'Name is too long!',
  designationRequired: 'Designation required!',
  designationTooShort: 'Designation is too short!',
  designationTooLong: 'Designation is too long!',
  validDesignation: 'Please enter the valid Designation!',
  companyNameRequired: 'Company name required!',
  validCompanyName: 'Please enter the valid company name',
  companyNameTooShort: 'Company name is too short!',
  companyNameTooLong: 'Company name is too long!',
  addressRequired: 'Address required!',
  addressTooShort: 'Address is Too Short!'
};

export const CompanyCheckForm = {
  companyNameRequired: 'Company name required!',
  validCompanyName: 'Please enter the valid company name',
  companyNameTooShort: 'Company name is too short!',
  companyNameTooLong: 'Company name is too long!',
  companyWebsiteRequired: 'Company name required!',
  validCompanyWebsite: 'Please enter the valid company website',
  companyWebsiteTooShort: 'Company name is too short!',
  companyWebsiteTooLong: 'Company name is too long!'

};

export const Common = {
  GSTRegex: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  max200Char: 'comment should contain maximum 200 characters!',
  forgotPassword: 'Forgot Password?',
  alphabetsRegex: `^(?=.*[a-zA-Z])[a-zA-Z]+$`,
  // UserNameRegex: /^([a-zA-Z]+\s)*[a-zA-Z]+$/, //accepts numbers
  UserNameRegex: /^[a-zA-Z ]+$/, //accepts numbers
  AlphaNumaricRegex: '[A-Za-z0-9_]',
  PassportRegex: `^[A-PR-WYa-pr-wy][1-9]\\d\\s?\\d{4}[1-9]$`,
  PanRegex: '[A-Z]{5}[0-9]{4}[A-Z]{1}',
  DLregex: /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/,
  AadhaarCardRegex: /^[2-9]{1}[0-9]{3}\s{1}[0-9]{4}\s{1}[0-9]{4}$/,
  VoterIdRegex: '^([a-zA-Z]){3}([0-9]){7}?$',
  TelephoneNumberRegex: '^s*(?:+?(d{1,3}))?[-. (]*(d{3})[-. )]*(d{3})[-. ]*(d{4})(?: *x(d+))?s*$',
  RcBookRegex: '^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$',
  // RcBookRegex: '[A-Z]{2}?[0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$',
  // _RcBookRegex: '^[A-Z]{2}[-][0-9]{1,2}[-][A-Z]{1,2}[-][0-9]{3,4}$',
  _RcBookRegex: '^[A-Z]{2}(-| |)[0-9]{1,2}(-| |)[A-Z]{1,2}(-| |)[0-9]{3,4}$',
  WebsiteRegex: '^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$',
  // accepts: 18005551234, 1 800 555 1234, +1 800 555-1234, +86 800 555 1234, 1-800-555-1234, 1 (800) 555-1234, (800)555-1234, (800) 555-1234, (800)5551234, 800-555-1234, 800.555.1234, 800 555 1234x5678, 8005551234 x5678, 1    800    555-1234, 1----800----555-1234
  // ^\s*                #Line start, match any whitespaces at the beginning if any.
  // (?:\+?(\d{1,3}))?   #GROUP 1: The country code. Optional.
  // [-. (]*             #Allow certain non numeric characters that may appear between the Country Code and the Area Code.
  // (\d{3})             #GROUP 2: The Area Code. Required.
  // [-. )]*             #Allow certain non numeric characters that may appear between the Area Code and the Exchange number.
  // (\d{3})             #GROUP 3: The Exchange number. Required.
  // [-. ]*              #Allow certain non numeric characters that may appear between the Exchange number and the Subscriber number.
  // (\d{4})             #Group 4: The Subscriber Number. Required.
  // (?: *x(\d+))?       #Group 5: The Extension number. Optional.
  // \s*$                #Match any ending whitespaces if any and the end of string.

  UndefinedObject: undefined,
  Undefined: 'undefined',
  myModal: 'my-modal',
  ActiveProjects: 'Active Projects',
  InvalidOtp: 'Invalid Otp',
  HiIm: "Hi, I'm",
  AboutMe: 'About me',
  IAmCEOFounderOf: 'I am Founder of',
  TheProblemImTryingToSolve: "The Problem I'm trying to solve",
  MyBusinessIsLocatedIn: 'My business is located in',
  YouCanFindUsAt: 'You can find us at',
  MyCurrentProjects: 'My current projects',
  ImLivingIn: `I'm living in`,
  MyProfessionalProfile: 'My Professional Profile',
  MySkills: 'My Skills',
  WhatWeDo: 'What we do',
  TheServicesWeOffer: 'The services we offer',
  WhereWeAreLocated: 'Where we’re located',
  CurrentOffers: 'Current Offers',
  Confirm: 'Confirm',
  Project: 'Project',
  Filter: 'Filter',
  Projects: 'Projects',
  Startups: 'Startups',
  BETAs: 'BETAs',
  Offers: 'Offers',
  InvestYourPassionNow: 'Invest your passion now!',
  JoinBetaToday: 'Join BETA100 today!',
  JoinMeeting: 'Join Meeting',
  ApplicationsSent: 'Applications Sent',
  EmailSent: 'Email Sent Successfully',
  ReviewApplication: 'Review Application',
  RetractApplication: 'Retract Application',
  SignIn: 'Sign In',
  SignOut: 'Sign Out',
  AlreadyHaveAnAccount: 'Already have an account?',
  CreateAnAccount: 'Create an account',
  Table: [
    { name: 'Cash', value: 'cash' },
    { name: 'Equity', value: 'equity' },
    { name: 'Hybrid', value: 'cash and equity' }
  ],
  EquityOfferedWillBe: [
    { name: 'Shares', value: 'shares', tooltip: 'This is when someone owns a specified percentage of your company straight away.' },
    {
      name: 'Stock Options',
      value: 'stock options',
      tooltip:
        'This is when you give someone the opportunity to own shares in your company in the future based on pre-established conditions.'
    }
  ],
  ProjectName: 'Project name',
  TheProblemWeAreSolving: 'The problem we are solving',
  whereYouWillHaveImpact: 'where you’ll have impact',
  thisIsForYouIf: 'this is For You If',
  SkillsWeAreLookingFor: 'Skills we’re looking for',
  levelOfExperienceNeeded: 'level of experience needed',
  duration: 'DURATION',
  commitment: 'COMMITMENT',
  TotalProjectValue: 'Total Project Value',
  BetaProjects: 'BETA Projects',
  BetaHub: 'BETA Hub',
  AboutTheProject: 'About the project',
  AbourOffer: 'About Offer',
  CouponCode: 'Coupon Code',
  AboutStartUp: 'About Start Up',
  ViewProject: 'View Project',
  ViewOffer: 'View Offer',
  ViewProfile: 'View Profile',
  ViewStartUp: 'View Start Up',
  Save: 'Save',
  Delete: 'Delete',
  YesDelete: 'Yes, Delete',
  Publish: 'Publish',
  Close: 'Close',
  Cancel: 'Cancel',
  GotIt: 'Got it!',
  OK: 'OK',
  Yes: 'Y',
  No: 'N',
  _Yes: 'Yes',
  _No: 'No',
  loading: 'loading...',
  ManageProject: 'Manage Project',
  ArchiveProject: 'Archive Project',
  CompleteProject: 'Complete Project',
  TheProblemWeArereSolving: "The problem we're solving",
  WhereYouWillHaveImpact: 'Where you’ll have impact',
  ThisIsForYouIf: 'This is for you if',
  LevelOfExperienceNeeded: 'Level of Experience Needed',
  Duration: 'Duration',
  TheCommitmentRequired: 'The commitment required',
  AboutTheStartup: 'About the Startup',
  BIO: 'BIO',
  ShareThisProject: 'Share This Project',
  PasswordUpdatedSuccessfully: 'password updated successfully!',

  PasswordRegExp: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
  PhoneNumberRegExp: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
  // the phone number regex accepts (123) 456-7890, (123)456-7890, 123-456-7890, 123.456.7890, 1234567890, +31636363634, 075-63546725 formats
  UrlRegex:
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
  CommaSeperatedValueRegex: `^(?:0|[1-9]\d*)(?:\.(?!.*000)\d+)?$`,
  Decline: 'Decline',
  Accept: 'Accept',
  LetsTalk: "Let's Talk",
  Send: 'Send',
  Hashtag: '',
  CopyLink: 'Copy link',
  Copied: 'Copied!',
  DateFormat_dd_MM_yyyy: 'dd/MM/yyyy',
  DateFormat_DD_MM_YYYY: 'DD/MM/YYYY',
  DateFormat_YYYY_MM_DD: 'YYYY/MM/DD',
  DateFormat_dd_MM_yyyy_hh_mm_a: 'dd/MM/yyyy hh:mm a',
  DateFormat_DD_MM_YYYY_hh_mm_a: 'DD/MM/YYYY hh:mm a',
  TZ_Formate: 'YYYY-MM-DDTHH:mm:ss[Z]',
  TimeFormat_hh_mm_A: 'HH:mm A',
  TimeFormat_hh_mm: 'HH:mm',
  TimeFormat_LT: 'LT',
  QualityOfTheVideoCall: 'Quality of the Video Call',
  ChemistryBetweenYouTwo: 'Chemistry between you two',
  Submit: 'Submit',
  ProjectDecription: 'Project Decription',
  KeyOutcomes: 'Key Outcomes',
  ActivityLog: 'Activity Log',
  BankHours: 'Bank Hours',
  goodFitButtonDisabled: 'good-fit-button-disabled',
  goodFitButtonGreen: 'good-fit-button-green',
  goodFitButton: 'good-fit-button',
  verifyButton: 'verify-button',
  verifyButtonDisabled: 'verify-button-disabled',
  verifyButtonBlue: 'verify-button-blue',
  Disabled: 'disabled',
  InterestedInApplying: 'Interested in Applying?',
  JoinBETA100: 'Join BETA100',
  AlreadyAMember: 'Already a member?',
  ProjectCompletion: 'Project Completion',
  ValueOfBetaBankHours: 'Value of BETA Banked Hours',
  YouCantEditProjectAsBetaAlreadyInvolvedInProject: "You can't edit project as BETA already involved in project",

  IsentItHardToGetTheRightPeopleAroundTheTable: (
    <p className="slide-font-style-1" style={{ textAlign: 'right' }}>
      ISN'T IT HARD TO GET <br />
      THE RIGHT PEOPLE <br />
      AROUND THE TABLE?
    </p>
  ),
  FindPeopleWhoBelieveInTheProblemYouAreSolving: (
    <p className="slide-font-style-2">
      Find people who believe in <br />
      the problem you are solving.
    </p>
  ),
  JoinAsFounder: `JOIN AS FOUNDER`,

  IsWorkNotThaatExcitingAnyMore: (
    <p className="slide-font-style-1">
      IS WORK NOT THAAT <br />
      EXCITING ANY MORE?
    </p>
  ),
  JoinAsInvestor: `JOIN AS BETA`,
  InvestTimeSkillsAndNetworkIntoProjects: (
    <p className="slide-font-style-2" style={{ textAlign: 'left' }}>
      <span className="slide-font-style-3">Invest time, skills and network into projects</span> <br /> tackling problems close to your heart
      and <br /> build your own <span className="slide-font-style-3">portfolio of startups.</span>
    </p>
  ),

  AccessToTheStartupEcosystemIsMinutesAway: (
    <p className="slide-font-style-1" style={{ textAlign: 'right' }}>
      ACCESS TO THE <br /> STARTUP ECOSYSTEM <br /> IS MINUTES AWAY
    </p>
  ),
  BecomeAPartner: <p className="slide-font-style-1">BECOME A PARTNER</p>,
  AndBoostYourSalesByProvidingYourServicesToStartups: (
    <p className="slide-font-style-2" style={{ textAlign: 'left' }}>
      and boost your sales by <br /> providing your services <br /> to startups
    </p>
  ),

  JoinAsAnArray: `JOIN AS AN ARRAY`,
  ManageYourFoundersAndProjectsProtfolioWithBETA100: `Manage your founders and projects portfolio with BETA100`,

  // ReactScriptTag: `(function(h,o,t,j,a,r){ h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)}; h._hjSettings={hjid:3093060,hjsv:6}; a=o.getElementsByTagName('head')[0]; r=o.createElement('script');r.async=1; r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv; a.appendChild(r); })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=')`,
  ReactScriptTag: `(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:3156893,hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
  NotificationTimerMs: 60000, // 1 min

  LogOutMessage: `Do you really want to logout?`,
  AreYouSureYouWantToDeleteThisPersona: `Are you sure you want to delete this persona?`,
  FounderProfileDeleteMessage: `Do you really want to delete Founder profile?`,
  BetaProfileDeleteMessage: `Do you really want to delete BETA profile?`,
  PartnerProfileDeleteMessage: `Do you really want to delete Partner profile?`,
  ScheduleDeleteConfirmationHeading: `Are you sure you wish to delete this meeting? If so, the message below will be sent to the BETA.`,
  ShareYourMeetingExperience: 'Share your meeting experience!',
  BETAProjects: 'BETA Projects',
  FounderProjects: 'Founder Projects',
  YourMeetingHasBeenScheduled: 'Your meeting has been scheduled!',
  OfferDeleteConfirmationHeading: `Are you sure you wish to delete this offer ?`,
  SocialLoginHeading: `We need you to provide email id same as what you have used for social login. Also this has to be validated once with the otp. This email will be used for email correspondence.`,
  ChatWelcomeMessage: 'Welcome to BETA 100',

  PleaseEnterTheCouponCode: 'Please enter the coupon code!',
  ViewExistingFile: 'View existing file',
  InvalidPanel: 'Select a valid panel',

  bgvStatusValues: [
    { label: 'Unable To Verify', value: 'UnableToVerify' },
    { label: 'Discrepancy', value: 'Discrepancy' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Insufficient', value: 'Insufficient' }
  ],

  foundNotFound: [
    { label: 'Found', value: 'found' },
    { label: 'Not Found', value: 'notFound' }
  ]
};

export const QcNaming = {
  AdditionalComment: 'Additional Comment',
  EligibleForRehire: 'Eligible For Rehire',
  VerificationStatus: 'Verification Status',
  GoogleVerificationStatus: 'Google Verification Status',
  McaVerificationStatus: 'MCA Verification Status',
  NasscomVerificationStatus: 'NASSCOM Verification Status',
  NseVerificationStatus: 'NSE Verification Status',
  BseVerificationStatus: 'BSE Verification Status',
  AuthenticatedBy: 'Authenticated By',
  ContactDetails: 'Contact Details',
  ModeOfVerification: 'Mode Of Verification',
  TypeOfVerification: 'Type Of Verification',
  DateVerified: 'Date Verified'
};

export const componentsListArray = [
  'Education',
  'Address',
  'CompanyCheck',
  'Criminal',
  'CreditCheck',
  'CibilCheck',
  'CvValidation',
  'DatabaseCheck',
  'DirectorshipCheck',
  'DrugTest',
  'Employment',
  'GapVerification',
  'Identification',
  'PoliceVerification',
  'Reference',
  'SocialMedia'
];

export const EmailInitiation = {
  EmailsRequired: 'Recipients are required!'
};
