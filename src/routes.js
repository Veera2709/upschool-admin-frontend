import React, { Suspense, Fragment, lazy } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

// import GuestGuard from './components/Auth/GuestGuard';
// import AuthGuard from './components/Auth/AuthGuard';

import { BASE_URL } from './config/constant';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            render={(props) => (
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Component {...props} />}</Layout>
              </Guard>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
);

const routes = [
  {
    exact: true,
    // guard: GuestGuard,
    path: '/upschool',
    component: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: true,
    // guard: GuestGuard,
    path: '/auth/signin-1',
    component: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: true,
    // guard: GuestGuard,
    path: '/auth/loginWithOTP',
    component: lazy(() => import('./views/auth/signin/LoginWithOTP'))
  },
  {
    exact: true,
    // guard: GuestGuard,
    path: '/auth/createOrResetPassword',
    component: lazy(() => import('./views/auth/signin/CreateOrResetPassword'))
  },
  {
    exact: true,
    path: '/404',
    component: lazy(() => import('./views/errors/NotFound404'))
  },
  {
    exact: true,
    path: '/maintenance/coming-soon',
    component: lazy(() => import('./views/maintenance/ComingSoon'))
  },
  {
    exact: true,
    path: '/maintenance/error',
    component: lazy(() => import('./views/maintenance/Error'))
  },
  {
    exact: true,
    path: '/maintenance/offline-ui',
    component: lazy(() => import('./views/maintenance/OfflineUI'))
  },
  {
    exact: true,
    path: '/admin-portal/preview/:digi_card_id',
    component: lazy(() => import('./views/panels/admin-portal/digicard/Preview'))
  },
  // {
  //   exact: true,
  //   path: '/auth/signup-1',
  //   component: lazy(() => import('./views/auth/signup/SignUp1'))
  // },
  // {
  //   exact: true,
  //   path: '/auth/signup-2',
  //   component: lazy(() => import('./views/auth/signup/SignUp2'))
  // },
  // {
  //   exact: true,
  //   path: '/auth/signin-2',
  //   component: lazy(() => import('./views/auth/signin/SignIn2'))
  // },
  // {
  //   exact: true,
  //   path: '/auth/reset-password-1',
  //   component: lazy(() => import('./views/auth/reset-password/ResetPassword1'))
  // },
  // {
  //   exact: true,
  //   path: '/auth/reset-password-2',
  //   component: lazy(() => import('./views/auth/reset-password/ResetPassword2'))
  // },
  // {
  //   exact: true,
  //   path: '/auth/change-password',
  //   component: lazy(() => import('./views/auth/ChangePassword'))
  // },
  {
    exact: true,
    path: '/auth/profile-settings',
    component: lazy(() => import('./views/auth/ProfileSettings'))
  },
  {
    exact: true,
    path: '/auth/tabs-auth',
    component: lazy(() => import('./views/auth/TabsAuth'))
  },

  {
    path: '*',
    layout: AdminLayout,
    routes: [

      {
        exact: true,
        path: '/admin-portal/admin-dashboard',
        component: lazy(() => import('./views/panels/admin-portal/Dashboard'))
      },
      {
        exact: true,
        path: '/admin-portal/active-schools',
        component: lazy(() => import('./views/panels/admin-portal/school/FetchActiveSchools'))
      },
      {
        exact: true,
        path: '/admin-portal/archived-schools',
        component: lazy(() => import('./views/panels/admin-portal/school/FetchArchivedSchools'))
      },
      {
        exact: true,
        path: '/admin-portal/editSchool/:school_id',
        component: lazy(() => import('./views/panels/admin-portal/school/EditTabs'))
      },
      {
        exact: true,
        path: '/admin-portal/active-users',
        component: lazy(() =>
          import('./views/panels/admin-portal/users/ListUsers')

        )
      },
      {
        exact: true,
        path: '/admin-portal/edit-users/:user_id/:user_role/:schoolId',
        component: lazy(() => import('./views/panels/admin-portal/users/EditUserOptions'))
      },
      {
        exact: true,
        path: '/admin-portal/archived-users',
        component: lazy(() => import('./views/panels/admin-portal/users/ListUsers')

        )
      },
      {
        exact: true,
        path: '/admin-portal/add-users',
        component: lazy(() => import('./views/panels/admin-portal/users/UsersBulkUpload'))
      },
      {
        exact: true,
        path: '/admin-portal/add-questions',
        component: lazy(() => import('./views/panels/admin-portal/questions/AddQuestions'))
      },
      {
        exact: true,
        path: '/admin-portal/add-groups',
        component: lazy(() => import('./views/panels/admin-portal/groups/AddGroups'))
      },
      {
        exact: true,
        path: '/admin-portal/add-concepts',
        component: lazy(() => import('./views/panels/admin-portal/concepts/AddConcepts'))
      },

      {
        exact: true,
        path: '/admin-portal/active-concepts',
        component: lazy(() => import('./views/panels/admin-portal/concepts/ListConcepts'))
      },
      {
        exact: true,
        path: '/admin-portal/archived-concepts',
        component: lazy(() => import('./views/panels/admin-portal/concepts/ListConcepts'))
      },

      {
        exact: true,
        path: '/admin-portal/active-subjects',
        component: lazy(() => import('./views/panels/admin-portal/subjects/ListSubjects'))
      },
      {
        exact: true,
        path: '/admin-portal/archived-subjects',
        component: lazy(() => import('./views/panels/admin-portal/subjects/ListSubjects'))
      },
      //TOPICS
      //Get Topics
      {
        exact: true,
        path: '/admin-portal/Topics/active-topics',
        component: lazy(() => import('./views/panels/admin-portal/Topics/ActiveTopics'))
      },
      {
        exact: true,
        path: '/admin-portal/Topics/archived-topics',
        component: lazy(() => import('./views/panels/admin-portal/Topics/ActiveTopics'))
      },
      // Add Topics
      // {
      //   exact: true,
      //   path: '/admin-portal/Topics/addTopics',
      //   component: lazy(() => import('./views/panels/admin-portal/Topics/AddTopics'))
      // },
      // Edit Topics
      // {
      //   exact: true,
      //   path: '/admin-portal/Topics/editTopic/:topic_id',
      //   component: lazy(() => import('./views/panels/admin-portal/Topics/EditTopics'))
      // },

      // Questions

      {
        exact: true,
        path: '/admin-portal/active-questions',
        component: lazy(() => import('./views/panels/admin-portal/questions/ListQuestions'))
      },
      {
        exact: true,
        path: '/admin-portal/archived-questions',
        component: lazy(() => import('./views/panels/admin-portal/questions/ListQuestions'))
      },
      {
        exact: true,
        path: '/admin-portal/edit-questions/:question_id',
        component: lazy(() => import('./views/panels/admin-portal/questions/EditQuestions'))
      },
      {
        exact: true,
        path: '/admin-portal/active-groups',
        component: lazy(() => import('./views/panels/admin-portal/groups/ListGroups'))
      },
      {
        exact: true,
        path: '/admin-portal/edit-groups/:group_id',
        component: lazy(() => import('./views/panels/admin-portal/groups/EditGroups'))
      },
      {
        exact: true,
        path: '/admin-portal/archived-groups',
        component: lazy(() => import('./views/panels/admin-portal/groups/ListGroups'))
      },
      // digi card
      {
        exact: true,
        path: '/admin-portal/active-digiCard',
        component: lazy(() => import('./views/panels/admin-portal/digicard/DigiCard'))
      },
      {
        exact: true,
        path: '/admin-portal/digicard-Archived',
        component: lazy(() => import('./views/panels/admin-portal/digicard/DigiCard'))
      },
      {
        exact: true,
        path: '/admin-portal/add-digicard',
        component: lazy(() => import('./views/panels/admin-portal/digicard/AddDigiCard'))
      },

      //edit didgicard
      {
        exact: true,
        path: '/admin-portal/editDigiCard/:digi_card_id',
        component: lazy(() => import('./views/panels/admin-portal/digicard/EditDigiCard'))
      },
      //chapters
      {
        exact: true,
        path: '/admin-portal/chapters/active-chapter',
        component: lazy(() => import('./views/panels/admin-portal/chapters/ChaptersList'))
      },
      {
        exact: true,
        path: '/admin-portal/chapters/archived-chapter',
        component: lazy(() => import('./views/panels/admin-portal/chapters/ChaptersList'))
      },
      //add chapter
      // {
      //   exact: true,
      //   path: '/admin-portal/addChapters',
      //   component: lazy(() => import('./views/panels/admin-portal/chapters/AddChapters'))
      // },
      //edit chapter
      // {
      //   exact: true,
      //   path: '/admin-portal/editChapter/:chapter_id',
      //   component: lazy(() => import('./views/panels/admin-portal/chapters/EditChapter'))
      // },
      //units
      {
        exact: true,
        path: '/admin-portal/units/active-units',
        component: lazy(() => import('./views/panels/admin-portal/units/UnitList'))
      },
      {
        exact: true,
        path: '/admin-portal/units/archived-units',
        component: lazy(() => import('./views/panels/admin-portal/units/UnitList'))
      },
      //addUnits
      // {
      //   exact: true,
      //   path: '/admin-portal/addUnits',
      //   component: lazy(() => import('./views/panels/admin-portal/units/AddUnit'))
      // },
      //editUnit
      // {
      //   exact: true,
      //   path: '/admin-portal/editunit/:unit_id',
      //   component: lazy(() => import('./views/panels/admin-portal/units/EditUnit'))
      // },
      {
        exact: true,
        path: '/admin-portal/classes/active-classes',
        component: lazy(() => import('./views/panels/admin-portal/class/ClassesList'))

      },
      {
        exact: true,
        path: '/admin-portal/classes/archived-classes',
        component: lazy(() => import('./views/panels/admin-portal/class/ClassesList'))
      },

      //UpSchool_useers
      {
        exact: true,
        path: '/admin-portal/active-upSchoolUsers',
        component: lazy(() => import('./views/panels/admin-portal/CMS users/userTable'))
      },
      {
        exact: true,
        path: '/admin-portal/archived-upSchoolUsers',
        component: lazy(() => import('./views/panels/admin-portal/CMS users/userTable'))
      },
      {
        exact: true,
        path: '/admin-portal/admin-settings/active-questionCategory',
        component: lazy(() => import('./views/panels/admin-portal/settings/QuestionsCategory/QuestionsCategoryTableView'))
      },
      {
        exact: true,
        path: '/admin-portal/admin-settings/archived-questionCategory',
        component: lazy(() => import('./views/panels/admin-portal/settings/QuestionsCategory/QuestionsCategoryTableView'))
      },
      {
        exact: true,
        path: '/admin-portal/admin-settings/active-questionDisclaimer',
        component: lazy(() => import('./views/panels/admin-portal/settings/QuestionsDisclaimer/QuestionsDisclaimerTableView'))
      },
      {
        exact: true,
        path: '/admin-portal/admin-settings/archived-questionDisclaimer',
        component: lazy(() => import('./views/panels/admin-portal/settings/QuestionsDisclaimer/QuestionsDisclaimerTableView'))
      },
      {
        exact: true,
        path: '/admin-portal/admin-settings/active-sourceOfQuestion',
        component: lazy(() => import('./views/panels/admin-portal/settings/SourceOfQuestion/SourceOfQuestionTableView'))
      },
      {
        exact: true,
        path: '/admin-portal/admin-settings/archived-sourceOfQuestion',
        component: lazy(() => import('./views/panels/admin-portal/settings/SourceOfQuestion/SourceOfQuestionTableView'))
      },
      {
        exact: true,
        path: '/admin-portal/admin-settings/active-cognitiveSkills',
        component: lazy(() => import('./views/panels/admin-portal/settings/CognitiveSkills/CognitiveSkillsTableView'))
      },
      {
        exact: true,
        path: '/admin-portal/admin-settings/archived-cognitiveSkills',
        component: lazy(() => import('./views/panels/admin-portal/settings/CognitiveSkills/CognitiveSkillsTableView'))
      },

      {
        exact: true,
        path: '/admin-portal/editCMSUser/:id',
        component: lazy(() => import('./views/panels/admin-portal/CMS users/editUsers'))
      },
      {
        exact: true,
        path: '/admin-portal/add_UpSchoolusers',
        component: lazy(() => import('./views/panels/admin-portal/CMS users/addUsers'))
      },
      //Blue Prints
      {
        exact: true,
        path: '/admin-portal/active-blueprint',
        component: lazy(() => import('./views/panels/admin-portal/bluePrint/BluePrintList'))
      },

      {
        exact: true,
        path: '/admin-portal/archived-blueprint',
        component: lazy(() => import('./views/panels/admin-portal/bluePrint/BluePrintList'))
      },

      //add Blue print
      {
        exact: true,
        path: '/admin-portal/add-bluePrint',
        component: lazy(() => import('./views/panels/admin-portal/bluePrint/AddBluePrint'))
      },
      {
        exact: true,
        path: '/admin-portal/view-bluePrint/:blueprint_id',
        component: lazy(() => import('./views/panels/admin-portal/bluePrint/ViewBluePrint'))
      },

      // Add Standards
      // {
      //   exact: true,
      //   path: '/admin-portal/Classes/addClass',
      //   component: lazy(() => import('./views/panels/admin-portal/class/AddClass'))
      // },
      // Edit classes
      // {
      //   exact: true,
      //   path: '/admin-portal/Classes/editClass/:class_id',
      //   component: lazy(() => import('./views/panels/admin-portal/class/EditClass'))
      // },
      {
        exact: true,
        path: '/app/dashboard/analytics',
        component: lazy(() => import('./views/dashboard/DashAnalytics'))
      },
      {
        exact: true,
        path: '/app/dashboard/sales',
        component: lazy(() => import('./views/dashboard/DashSales'))
      },
      {
        exact: true,
        path: '/app/widgets/widget-statistic',
        component: lazy(() => import('./views/widgets/WidgetStatistic'))
      },
      {
        exact: true,
        path: '/app/widgets/widget-data',
        component: lazy(() => import('./views/widgets/WidgetData'))
      },
      {
        exact: true,
        path: '/app/widgets/widget-chart',
        component: lazy(() => import('./views/widgets/WidgetChart'))
      },
      {
        exact: true,
        path: '/layout/vertical/static',
        component: lazy(() => import('./views/page-layouts/vertical/Static'))
      },
      {
        exact: true,
        path: '/layout/vertical/fixed',
        component: lazy(() => import('./views/page-layouts/vertical/Fixed'))
      },
      {
        exact: true,
        path: '/layout/vertical/nav-fixed',
        component: lazy(() => import('./views/page-layouts/vertical/NavFixed'))
      },
      {
        exact: true,
        path: '/layout/vertical/collapse-menu',
        component: lazy(() => import('./views/page-layouts/vertical/CollapseMenu'))
      },
      {
        exact: true,
        path: '/layout/vertical/v-rtl',
        component: lazy(() => import('./views/page-layouts/vertical/RTLLayout'))
      },
      {
        exact: true,
        path: '/layout/horizontal',
        component: lazy(() => import('./views/page-layouts/horizontal/Static'))
      },
      {
        exact: true,
        path: '/layout/horizontal-v2',
        component: lazy(() => import('./views/page-layouts/horizontal/Static-v2'))
      },
      {
        exact: true,
        path: '/layout/horizontal-rtl',
        component: lazy(() => import('./views/page-layouts/horizontal/RTLLayout'))
      },
      {
        exact: true,
        path: '/layout/box',
        component: lazy(() => import('./views/page-layouts/extra-layouts/Box'))
      },
      {
        exact: true,
        path: '/layout/light',
        component: lazy(() => import('./views/page-layouts/extra-layouts/Light'))
      },
      {
        exact: true,
        path: '/layout/dark',
        component: lazy(() => import('./views/page-layouts/extra-layouts/Dark'))
      },
      {
        exact: true,
        path: '/users/user-profile',
        component: lazy(() => import('./views/users/UserProfile'))
      },
      {
        exact: true,
        path: '/users/user-cards',
        component: lazy(() => import('./views/users/UserCard'))
      },
      {
        exact: true,
        path: '/users/user-list',
        component: lazy(() => import('./views/users/UserList'))
      },
      {
        exact: true,
        path: '/basic/alert',
        component: lazy(() => import('./views/ui-elements/basic/BasicAlert'))
      },
      {
        exact: true,
        path: '/basic/button',
        component: lazy(() => import('./views/ui-elements/basic/BasicButton'))
      },
      {
        exact: true,
        path: '/basic/badges',
        component: lazy(() => import('./views/ui-elements/basic/BasicBadges'))
      },
      {
        exact: true,
        path: '/basic/breadcrumb-pagination',
        component: lazy(() => import('./views/ui-elements/basic/BasicBreadcrumbPagination'))
      },
      {
        exact: true,
        path: '/basic/cards',
        component: lazy(() => import('./views/ui-elements/basic/BasicCards'))
      },
      {
        exact: true,
        path: '/basic/collapse',
        component: lazy(() => import('./views/ui-elements/basic/BasicCollapse'))
      },
      {
        exact: true,
        path: '/basic/carousel',
        component: lazy(() => import('./views/ui-elements/basic/BasicCarousels'))
      },
      {
        exact: true,
        path: '/basic/grid-system',
        component: lazy(() => import('./views/ui-elements/basic/BasicGridSystem'))
      },
      {
        exact: true,
        path: '/basic/progress',
        component: lazy(() => import('./views/ui-elements/basic/BasicProgress'))
      },
      {
        exact: true,
        path: '/basic/modal',
        component: lazy(() => import('./views/ui-elements/basic/BasicModals'))
      },
      {
        exact: true,
        path: '/basic/spinner',
        component: lazy(() => import('./views/ui-elements/basic/BasicSpinner'))
      },
      {
        exact: true,
        path: '/basic/tabs-pills',
        component: lazy(() => import('./views/ui-elements/basic/BasicTabsPills'))
      },
      {
        exact: true,
        path: '/basic/typography',
        component: lazy(() => import('./views/ui-elements/basic/BasicTypography'))
      },
      {
        exact: true,
        path: '/basic/tooltip-popovers',
        component: lazy(() => import('./views/ui-elements/basic/BasicTooltipsPopovers'))
      },
      {
        exact: true,
        path: '/basic/other',
        component: lazy(() => import('./views/ui-elements/basic/BasicOther'))
      },
      {
        exact: true,
        path: '/hospital/hosp-dashboard',
        component: lazy(() => import('./views/panels/hospital/Dashboard'))
      },
      {
        exact: true,
        path: '/hospital/hosp-department',
        component: lazy(() => import('./views/panels/hospital/Department'))
      },
      {
        exact: true,
        path: '/hospital/hosp-doctor',
        component: lazy(() => import('./views/panels/hospital/Doctor'))
      },
      {
        exact: true,
        path: '/hospital/hosp-patient',
        component: lazy(() => import('./views/panels/hospital/Patient'))
      },
      {
        exact: true,
        path: '/hospital/hosp-nurse',
        component: lazy(() => import('./views/panels/hospital/Nurse'))
      },
      {
        exact: true,
        path: '/hospital/hosp-pharmacist',
        component: lazy(() => import('./views/panels/hospital/Pharmacist'))
      },
      {
        exact: true,
        path: '/hospital/hosp-laboratory',
        component: lazy(() => import('./views/panels/hospital/Laboratory'))
      },
      {
        exact: true,
        path: '/helpdesk/hd-dashboard',
        component: lazy(() => import('./views/panels/helpdesk/Dashboard'))
      },
      {
        exact: true,
        path: '/helpdesk/hd-ticket',
        component: lazy(() => import('./views/panels/helpdesk/CreateTicket'))
      },
      {
        exact: true,
        path: '/helpdesk/hd-ticket-list',
        component: lazy(() => import('./views/panels/helpdesk/TicketList'))
      },
      {
        exact: true,
        path: '/helpdesk/hd-ticket-details',
        component: lazy(() => import('./views/panels/helpdesk/TicketDetails'))
      },
      {
        exact: true,
        path: '/helpdesk/hd-customer-list',
        component: lazy(() => import('./views/panels/helpdesk/Customer'))
      },
      {
        exact: true,
        path: '/project-crm/pc-dashboard',
        component: lazy(() => import('./views/panels/project-crm/Dashboard'))
      },
      {
        exact: true,
        path: '/project-crm/pc-customers',
        component: lazy(() => import('./views/panels/project-crm/Customers'))
      },
      {
        exact: true,
        path: '/project-crm/pc-project',
        component: lazy(() => import('./views/panels/project-crm/Project'))
      },
      {
        exact: true,
        path: '/project-crm/pc-task',
        component: lazy(() => import('./views/panels/project-crm/Task'))
      },
      {
        exact: true,
        path: '/membership/mshp-dashboard',
        component: lazy(() => import('./views/panels/membership/Dashboard'))
      },
      {
        exact: true,
        path: '/membership/mshp-email',
        component: lazy(() => import('./views/panels/membership/Email'))
      },
      {
        exact: true,
        path: '/membership/mshp-country',
        component: lazy(() => import('./views/panels/membership/Country'))
      },
      {
        exact: true,
        path: '/membership/mshp-coupons',
        component: lazy(() => import('./views/panels/membership/Coupons'))
      },
      {
        exact: true,
        path: '/membership/mshp-newsletter',
        component: lazy(() => import('./views/panels/membership/Newsletter'))
      },
      {
        exact: true,
        path: '/membership/mshp-user',
        component: lazy(() => import('./views/panels/membership/User'))
      },
      {
        exact: true,
        path: '/membership/mshp-membership',
        component: lazy(() => import('./views/panels/membership/Membership'))
      },
      {
        exact: true,
        path: '/sis/sis-dashboard',
        component: lazy(() => import('./views/panels/sis/Dashboard'))
      },
      {
        exact: true,
        path: '/sis/sis-leave',
        component: lazy(() => import('./views/panels/sis/Leave'))
      },
      {
        exact: true,
        path: '/sis/sis-evaluation',
        component: lazy(() => import('./views/panels/sis/Evaluation'))
      },
      {
        exact: true,
        path: '/sis/sis-event',
        component: lazy(() => import('./views/panels/sis/Event'))
      },
      {
        exact: true,
        path: '/sis/sis-circular',
        component: lazy(() => import('./views/panels/sis/Circular'))
      },
      {
        exact: true,
        path: '/sis/sis-course',
        component: lazy(() => import('./views/panels/sis/Course'))
      },
      {
        exact: true,
        path: '/crypto/cp-dashboard',
        component: lazy(() => import('./views/panels/crypto/Dashboard'))
      },
      {
        exact: true,
        path: '/crypto/cp-exchange',
        component: lazy(() => import('./views/panels/crypto/Exchange'))
      },
      {
        exact: true,
        path: '/crypto/cp-wallet',
        component: lazy(() => import('./views/panels/crypto/Wallet'))
      },
      {
        exact: true,
        path: '/crypto/cp-transactions',
        component: lazy(() => import('./views/panels/crypto/Transaction'))
      },
      {
        exact: true,
        path: '/crypto/cp-history',
        component: lazy(() => import('./views/panels/crypto/History'))
      },
      {
        exact: true,
        path: '/crypto/cp-trading',
        component: lazy(() => import('./views/panels/crypto/Trading'))
      },
      {
        exact: true,
        path: '/crypto/cp-coin',
        component: lazy(() => import('./views/panels/crypto/InitialCoin'))
      },
      {
        exact: true,
        path: '/crypto/cp-ico',
        component: lazy(() => import('./views/panels/crypto/IcoListing'))
      },
      {
        exact: true,
        path: '/ecommerce/ecomm-product',
        component: lazy(() => import('./views/panels/ecommerce/Product'))
      },
      {
        exact: true,
        path: '/ecommerce/ecomm-product-details',
        component: lazy(() => import('./views/panels/ecommerce/ProductDetails'))
      },
      {
        exact: true,
        path: '/ecommerce/ecomm-order',
        component: lazy(() => import('./views/panels/ecommerce/Order'))
      },
      {
        exact: true,
        path: '/ecommerce/ecomm-checkout',
        component: lazy(() => import('./views/panels/ecommerce/Checkout'))
      },
      {
        exact: true,
        path: '/ecommerce/ecomm-cart',
        component: lazy(() => import('./views/panels/ecommerce/Cart'))
      },
      {
        exact: true,
        path: '/ecommerce/ecomm-customer',
        component: lazy(() => import('./views/panels/ecommerce/Customers'))
      },
      {
        exact: true,
        path: '/ecommerce/ecomm-seller',
        component: lazy(() => import('./views/panels/ecommerce/Sellers'))
      },
      {
        exact: true,
        path: '/advance/sweet-alert',
        component: lazy(() => import('./views/ui-elements/advance/AdvanceAlert'))
      },
      {
        exact: true,
        path: '/advance/datepicker',
        component: lazy(() => import('./views/ui-elements/advance/AdvanceDatepicker'))
      },
      {
        exact: true,
        path: '/advance/task-board',
        component: lazy(() => import('./views/ui-elements/advance/AdvanceTaskBoard'))
      },
      {
        exact: true,
        path: '/advance/light-box',
        component: lazy(() => import('./views/ui-elements/advance/AdvanceLightBox'))
      },
      {
        exact: true,
        path: '/advance/adv-modal',
        component: lazy(() => import('./views/ui-elements/advance/AdvanceModal'))
      },
      {
        exact: true,
        path: '/advance/notification',
        component: lazy(() => import('./views/ui-elements/advance/AdvanceNotification'))
      },
      {
        exact: true,
        path: '/advance/nestable',
        component: lazy(() => import('./views/ui-elements/advance/AdvanceNestable'))
      },
      {
        exact: true,
        path: '/advance/p-notify',
        component: lazy(() => import('./views/ui-elements/advance/AdvancePNotify'))
      },
      {
        exact: true,
        path: '/advance/rating',
        component: lazy(() => import('./views/ui-elements/advance/AdvanceRating'))
      },
      {
        exact: true,
        path: '/advance/range-slider',
        component: lazy(() => import('./views/ui-elements/advance/AdvanceRangeSlider'))
      },
      {
        exact: true,
        path: '/advance/slider',
        component: lazy(() => import('./views/ui-elements/advance/AdvanceSlider'))
      },
      {
        exact: true,
        path: '/advance/syntax-highlighter',
        component: lazy(() => import('./views/ui-elements/advance/AdvanceSyntaxHighlighter'))
      },
      {
        exact: true,
        path: '/advance/tour',
        component: lazy(() => import('./views/ui-elements/advance/AdvanceTour'))
      },
      {
        exact: true,
        path: '/advance/tree-view',
        component: lazy(() => import('./views/ui-elements/advance/AdvanceTree'))
      },
      {
        exact: true,
        path: '/forms/form-basic',
        component: lazy(() => import('./views/forms/FormsElements'))
      },
      {
        exact: true,
        path: '/forms/form-advance',
        component: lazy(() => import('./views/forms/FormsAdvance'))
      },
      {
        exact: true,
        path: '/forms/form-validation',
        component: lazy(() => import('./views/forms/FormsValidation'))
      },
      {
        exact: true,
        path: '/forms/form-masking',
        component: lazy(() => import('./views/forms/FormsMasking'))
      },
      {
        exact: true,
        path: '/forms/form-wizard',
        component: lazy(() => import('./views/forms/FormsWizard'))
      },
      {
        exact: true,
        path: '/forms/form-picker',
        component: lazy(() => import('./views/forms/FormsPicker'))
      },
      {
        exact: true,
        path: '/forms/form-select',
        component: lazy(() => import('./views/forms/FormsSelect'))
      },
      {
        exact: true,
        path: '/tables/bootstrap',
        component: lazy(() => import('./views/tables/BootstrapTable'))
      },
      {
        exact: true,
        path: '/table/datatable/tbl-basic',
        component: lazy(() => import('./views/tables/react-table/Basic'))
      },
      {
        exact: true,
        path: '/table/datatable/tbl-footer',
        component: lazy(() => import('./views/tables/react-table/Footers'))
      },
      {
        exact: true,
        path: '/table/datatable/tbl-sorting',
        component: lazy(() => import('./views/tables/react-table/Sorting'))
      },
      {
        exact: true,
        path: '/table/datatable/tbl-filtering',
        component: lazy(() => import('./views/tables/react-table/Filtering'))
      },
      {
        exact: true,
        path: '/table/datatable/tbl-grouping',
        component: lazy(() => import('./views/tables/react-table/Grouping'))
      },
      {
        exact: true,
        path: '/table/datatable/tbl-pagination',
        component: lazy(() => import('./views/tables/react-table/Pagination'))
      },
      {
        exact: true,
        path: '/charts/apex-chart',
        component: lazy(() => import('./views/charts/apex-chart'))
      },
      {
        exact: true,
        path: '/charts/chart-js',
        component: lazy(() => import('./views/charts/chart-js'))
      },
      {
        exact: true,
        path: '/charts/highchart',
        component: lazy(() => import('./views/charts/highchart'))
      },
      {
        exact: true,
        path: '/charts/rechart',
        component: lazy(() => import('./views/charts/re-chart'))
      },
      {
        exact: true,
        path: '/maps/google-map',
        component: lazy(() => import('./views/maps/GoogleMaps'))
      },
      {
        exact: true,
        path: '/maps/vector-map',
        component: lazy(() => import('./views/maps/VectorMaps'))
      },
      {
        exact: true,
        path: '/todo/todo-basic',
        component: lazy(() => import('./views/applications/to-do/ToDo'))
      },
      {
        exact: true,
        path: '/task/task-list',
        component: lazy(() => import('./views/applications/task/TaskList'))
      },
      {
        exact: true,
        path: '/task/task-board',
        component: lazy(() => import('./views/applications/task/TaskBoard'))
      },
      {
        exact: true,
        path: '/task/task-detail',
        component: lazy(() => import('./views/applications/task/TaskDetails'))
      },
      {
        exact: true,
        path: '/gallery/gallery-grid',
        component: lazy(() => import('./views/applications/gallery/GalleryGrid'))
      },
      {
        exact: true,
        path: '/gallery/photo-grid',
        component: lazy(() => import('./views/applications/gallery/PhotoGrid'))
      },
      {
        exact: true,
        path: '/gallery/gallery-masonry',
        component: lazy(() => import('./views/applications/gallery/MasonryGallery'))
      },
      {
        exact: true,
        path: '/editor/ck-editor/ck-classic',
        component: lazy(() => import('./views/extensions/editors/ck-editor/EditorCkClassic'))
      },
      {
        exact: true,
        path: '/editor/ck-editor/ck-balloon',
        component: lazy(() => import('./views/extensions/editors/ck-editor/EditorCkBalloon'))
      },
      {
        exact: true,
        path: '/editor/ck-editor/ck-inline',
        component: lazy(() => import('./views/extensions/editors/ck-editor/EditorCkInline'))
      },
      {
        exact: true,
        path: '/editor/ck-editor/ck-document',
        component: lazy(() => import('./views/extensions/editors/ck-editor/EditorCkDocument'))
      },
      {
        exact: true,
        path: '/editor/rich-editor',
        component: lazy(() => import('./views/extensions/editors/EditorRichNib'))
      },
      {
        exact: true,
        path: '/editor/jodit-wysiwyg',
        component: lazy(() => import('./views/extensions/editors/EditorJoditWYSIWYG'))
      },
      {
        exact: true,
        path: '/image-cropper',
        component: lazy(() => import('./views/extensions/ImageCropper'))
      },
      {
        exact: true,
        path: '/file-upload',
        component: lazy(() => import('./views/extensions/FileUpload'))
      },
      {
        exact: true,
        path: '/full-calendar',
        component: lazy(() => import('./views/extensions/FullEventCalendar'))
      },
      {
        exact: true,
        path: '/invoice/invoice-basic',
        component: lazy(() => import('./views/extensions/invoice/InvoiceBasic'))
      },
      {
        exact: true,
        path: '/invoice/invoice-summary',
        component: lazy(() => import('./views/extensions/invoice/InvoiceSummary'))
      },
      {
        exact: true,
        path: '/invoice/invoice-list',
        component: lazy(() => import('./views/extensions/invoice/InvoiceList'))
      },
      {
        exact: true,
        path: '/sample-page',
        component: lazy(() => import('./views/extra/SamplePage'))
      },
      {
        path: '*',
        exact: true,
        component: () => <Redirect to={BASE_URL} />
      }
    ]
  }
];

export default routes;
