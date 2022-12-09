export const BASENAME = '/upschool'; // don't add '/' at end off BASENAME for breadcrumbs
export const BASE_URL = '/auth/signin-1';
export const BASE_TITLE = ' | UpSchool';

export const CONFIG = {
  layout: 'vertical', // vertical, horizontal
  subLayout: '', // horizontal-2
  collapseMenu: false, // mini-menu
  layoutType: 'menu-light', // menu-dark, menu-light, dark
  headerBackColor: 'header-blue', // header-blue, header-red, header-purple, header-info, header-green header-dark
  rtlLayout: false,
  navFixedLayout: true,
  headerFixedLayout: true,
  boxLayout: false,
  jwt: {
    secret: 'SECRET-KEY',
    timeout: '1 days'
  },
  firebase: {
    apiKey: 'AIzaSyC9m6rMXs8PKHkJaT761AupFQdmcjQDwSY',
    authDomain: 'gradient-able-react-hook.firebaseapp.com',
    projectId: 'gradient-able-react-hook',
    storageBucket: 'gradient-able-react-hook.appspot.com',
    messagingSenderId: '787384589233',
    appId: '1:787384589233:web:2b57c391ac41d2d1967b90',
    measurementId: 'G-1D6ER7YWLL'
  },
  auth0: {
    client_id: 'CkaKvwheIhIQkybjTEQwN7ikcdHObsPh',
    domain: 'dev-w0-vxep3.us.auth0.com'
  }
};


export const Common = {
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

  validProofType: 'Proof type must contain only alphabets',


  YesNo: [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' }
  ],
};

// export default constant