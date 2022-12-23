const menuItems = {
  items: [
    // {
    //   // id: 'navigation',
    //   // title: 'Navigation',
    //   // type: 'group',
    //   // icon: 'icon-navigation',
    //   children: [
    //     {
    //       id: 'dashboard',
    //       title: 'Dashboard',
    //       type: 'collapse',
    //       icon: 'feather icon-home',
    //       children: [
    //         {
    //           id: 'analytics',
    //           title: 'Analytics',
    //           type: 'item',
    //           url: '/app/dashboard/analytics',
    //           breadcrumbs: false
    //         },

    //         {
    //           id: 'sales',
    //           title: 'Sales',
    //           type: 'item',
    //           url: '/app/dashboard/sales',
    //           badge: {
    //             title: 'NEW',
    //             type: 'badge-danger'
    //           }
    //         }
    //       ]
    //     },
    //     {
    //       id: 'layout',
    //       title: 'Page Layouts',
    //       type: 'collapse',
    //       icon: 'feather icon-layout',
    //       children: [
    //         {
    //           id: 'vertical',
    //           title: 'Vertical',
    //           type: 'collapse',
    //           children: [
    //             {
    //               id: 'static',
    //               title: 'Static',
    //               type: 'item',
    //               url: '/layout/vertical/static',
    //               target: true
    //             },
    //             {
    //               id: 'fixed',
    //               title: 'Fixed',
    //               type: 'item',
    //               url: '/layout/vertical/fixed',
    //               target: true
    //             },
    //             {
    //               id: 'nav-fixed',
    //               title: 'Navbar Fixed',
    //               type: 'item',
    //               url: '/layout/vertical/nav-fixed',
    //               target: true
    //             },
    //             {
    //               id: 'collapse-menu',
    //               title: 'Collapse Menu',
    //               type: 'item',
    //               url: '/layout/vertical/collapse-menu',
    //               target: true
    //             },
    //             {
    //               id: 'v-rtl',
    //               title: 'Vertical RTL',
    //               type: 'item',
    //               url: '/layout/vertical/v-rtl',
    //               target: true
    //             }
    //           ]
    //         },
    //         {
    //           id: 'horizontal',
    //           title: 'Horizontal',
    //           type: 'item',
    //           url: '/layout/horizontal',
    //           target: true
    //         },
    //         {
    //           id: 'horizontal-v2',
    //           title: 'Horizontal v2',
    //           type: 'item',
    //           url: '/layout/horizontal-v2',
    //           target: true
    //         },
    //         {
    //           id: 'horizontal-rtl',
    //           title: 'Horizontal RTL',
    //           type: 'item',
    //           url: '/layout/horizontal-rtl',
    //           target: true
    //         },
    //         {
    //           id: 'box',
    //           title: 'Box Layout',
    //           type: 'item',
    //           url: '/layout/box',
    //           target: true
    //         },
    //         {
    //           id: 'light',
    //           title: 'Light Layout',
    //           type: 'item',
    //           url: '/layout/light',
    //           target: true
    //         },
    //         {
    //           id: 'dark',
    //           title: 'Dark Layout',
    //           type: 'item',
    //           url: '/layout/dark',
    //           target: true,
    //           badge: {
    //             title: 'Hot',
    //             type: 'badge-danger'
    //           }
    //         }
    //       ]
    //     },
    //     {
    //       id: 'widgets',
    //       title: 'Widget',
    //       type: 'collapse',
    //       icon: 'feather icon-layers',
    //       badge: {
    //         title: '100+',
    //         type: 'badge-info'
    //       },
    //       children: [
    //         {
    //           id: 'widget-statistic',
    //           title: 'Statistic',
    //           type: 'item',
    //           url: '/app/widgets/widget-statistic'
    //         },
    //         {
    //           id: 'widget-data',
    //           title: 'Data',
    //           type: 'item',
    //           url: '/app/widgets/widget-data'
    //         },
    //         {
    //           id: 'widget-chart',
    //           title: 'Chart',
    //           type: 'item',
    //           url: '/app/widgets/widget-chart'
    //         }
    //       ]
    //     },
    //     {
    //       id: 'users',
    //       title: 'Users',
    //       type: 'collapse',
    //       icon: 'feather icon-users',
    //       badge: {
    //         title: 'New',
    //         type: 'badge-warning'
    //       },
    //       children: [
    //         {
    //           id: 'user-profile',
    //           title: 'Profile',
    //           type: 'item',
    //           url: '/users/user-profile',
    //           breadcrumbs: false
    //         },
    //         {
    //           id: 'user-cards',
    //           title: 'User Card',
    //           type: 'item',
    //           url: '/users/user-cards'
    //         },
    //         {
    //           id: 'user-list',
    //           title: 'User List',
    //           type: 'item',
    //           url: '/users/user-list'
    //         }
    //       ]
    //     }
    //   ]
    // },
    {
      id: 'admin-panel',
      title: 'Admin Panel',
      type: 'group',
      icon: 'icon-monitor',
      children: [
        // {
        //   id: 'hospital',
        //   title: 'Hospital',
        //   type: 'collapse',
        //   icon: 'feather icon-activity',
        //   children: [
        //     {
        //       id: 'hosp-dashboard',
        //       title: 'Dashboard',
        //       type: 'item',
        //       url: '/hospital/hosp-dashboard'
        //     },
        //     {
        //       id: 'hosp-department',
        //       title: 'Department',
        //       type: 'item',
        //       url: '/hospital/hosp-department'
        //     },
        //     {
        //       id: 'hosp-doctor',
        //       title: 'Doctor',
        //       type: 'item',
        //       url: '/hospital/hosp-doctor'
        //     },
        //     {
        //       id: 'hosp-patient',
        //       title: 'Patient',
        //       type: 'item',
        //       url: '/hospital/hosp-patient'
        //     },
        //     {
        //       id: 'hosp-nurse',
        //       title: 'Nurse',
        //       type: 'item',
        //       url: '/hospital/hosp-nurse'
        //     },
        //     {
        //       id: 'hosp-pharmacist',
        //       title: 'Pharmacist',
        //       type: 'item',
        //       url: '/hospital/hosp-pharmacist'
        //     },
        //     {
        //       id: 'hosp-laboratory',
        //       title: 'Laboratory',
        //       type: 'item',
        //       url: '/hospital/hosp-laboratory'
        //     }
        //   ]
        // },
        // {
        //   id: 'helpdesk',
        //   title: 'Helpdesk',
        //   type: 'collapse',
        //   icon: 'feather icon-help-circle',
        //   children: [
        //     {
        //       id: 'hd-dashboard',
        //       title: 'Dashboard',
        //       type: 'item',
        //       url: '/helpdesk/hd-dashboard'
        //     },
        //     {
        //       id: 'hd-ticket',
        //       title: 'Create Ticket',
        //       type: 'item',
        //       url: '/helpdesk/hd-ticket'
        //     },
        //     {
        //       id: 'hd-ticket-list',
        //       title: 'Ticket List',
        //       type: 'item',
        //       url: '/helpdesk/hd-ticket-list'
        //     },
        //     {
        //       id: 'hd-ticket-details',
        //       title: 'Ticket Detail',
        //       type: 'item',
        //       url: '/helpdesk/hd-ticket-details'
        //     },
        //     {
        //       id: 'hd-customer-list',
        //       title: 'Customer',
        //       type: 'item',
        //       url: '/helpdesk/hd-customer-list'
        //     }
        //   ]
        // },
        // {
        //   id: 'project-crm',
        //   title: 'Project & CRM',
        //   type: 'collapse',
        //   icon: 'feather icon-package',
        //   children: [
        //     {
        //       id: 'pc-dashboard',
        //       title: 'Dashboard',
        //       type: 'item',
        //       url: '/project-crm/pc-dashboard'
        //     },
        //     {
        //       id: 'pc-customers',
        //       title: 'Customers',
        //       type: 'item',
        //       url: '/project-crm/pc-customers'
        //     },
        //     {
        //       id: 'pc-project',
        //       title: 'Project',
        //       type: 'item',
        //       url: '/project-crm/pc-project'
        //     },
        //     {
        //       id: 'pc-task',
        //       title: 'Task',
        //       type: 'item',
        //       url: '/project-crm/pc-task'
        //     }
        //   ]
        // },
        {
          id: 'main-dashboard',
          title: 'Dashboard',
          icon: 'feather icon-home',
          type: 'item',
          url: '/admin-portal/admin-dashboard'
        },
        {
          id: 'sch-addSchool',
          title: 'School',
          icon: 'feather icon-book',
          type: 'collapse',
          children: [
            {
              id: 'active-schools',
              title: 'Active Schools',
              type: 'item',
              url: '/admin-portal/active-schools'
            },
            {
              id: 'archived-schools',
              title: 'Archived Schools',
              type: 'item',
              url: '/admin-porttal/archived-schools'
            }
          ]
        },

        {
          id: 'users',
          title: 'Users',
          type: 'collapse',
          icon: 'feather icon-users',
          children: [
            {
              id: 'active-users',
              title: 'Active Users',
              type: 'item',
              url: '/admin-portal/active-users'
            },
            {
              id: 'archived-users',
              title: 'Archived Users',
              type: 'item',
              url: '/admin-portal/archived-users'
            }
          ]
        },

        // {
        //   id: 'digicard',
        //   title: 'DigiCard',
        //   type: 'item',
        //   icon: 'feather icon-layout',
        //   url: '/admin-portal/digicard'
        // },
        {
          id: 'digicard',
          title: 'DigiCard',
          type: 'collapse',
          icon: 'feather icon-layout',

          children: [
            {
              id: 'active-digiCard',
              title: 'Active Digicards',
              type: 'item',
              url: '/admin-portal/active-digiCard',
            },
            {
              id: 'archived-digiCard',
              title: 'Archived Digicards',
              type: 'item',
              url: '/admin-portal/digicard-Archived',
            }
          ]
        },
        {
          id: 'concepts',
          title: 'Concepts',
          type: 'collapse',
          icon: 'feather icon-book',
          children: [
            {
              id: 'active-concepts',
              title: 'Active Concepts',
              type: 'item',
              url: '/admin-portal/active-concepts'
            },
            {
              id: 'archived-concepts',
              title: 'Archived Concepts',
              type: 'item',
              url: '/admin-portal/archived-concepts'
            }
          ]
        },
        {
          id: 'topics',
          title: 'Topics',
          type: 'item',
          icon: 'feather icon-package',
          url: '/admin-portal/Topics/topicsList',
          children: [
            {
              id: 'add-topics',
              title: 'Add Topics',
              type: 'item',
              url: '/admin-portal/Topics/active-topics'
            },
            {
              id: 'edit-topics',
              title: 'Edit Topic',
              type: 'item',
              url: '/admin-portal/Topics/archived-topics'
            }
          ]
        },
        // {
        //   id: 'chapters',
        //   title: 'Chapters',
        //   type: 'item',
        //   icon: 'fas fa-book',
        //   url: '/admin-portal/chapters/CaptersList',
        // },
        {
          id: 'chapters',
          title: 'Chapters',
          type: 'collapse',
          icon: 'fas fa-book',
          children:[
            
            {
              id: 'active-chapter',
              title: 'Active Chapters',
              type: 'item',
              url: '/admin-portal/chapters/active-chapter',
            },
            {
              id: 'archived-chapter',
              title: 'Archived Chapters',
              type: 'item',
              url: '/admin-portal/chapters/archived-chapter',
            }
          ]
        },
        {
          id: 'sis',
          title: 'SIS',
          type: 'collapse',
          icon: 'feather icon-book',
          children: [
            {
              id: 'sis-dashboard',
              title: 'Dashboard',
              type: 'item',
              url: '/sis/sis-dashboard'
            },
            {
              id: 'sis-leave',
              title: 'Leave',
              type: 'item',
              url: '/sis/sis-leave'
            },
            {
              id: 'sis-evaluation',
              title: 'Evaluation',
              type: 'item',
              url: '/sis/sis-evaluation'
            },
            {
              id: 'sis-event',
              title: 'Event',
              type: 'item',
              url: '/sis/sis-event'
            },
            {
              id: 'sis-circular',
              title: 'Circular',
              type: 'item',
              url: '/sis/sis-circular'
            },
            {
              id: 'sis-course',
              title: 'Course',
              type: 'item',
              url: '/sis/sis-course'
            }
          ]
        },
        {
          id: 'crypto',
          title: 'Crypto',
          type: 'collapse',
          icon: 'feather icon-target',
          children: [
            {
              id: 'cp-dashboard',
              title: 'Dashboard',
              type: 'item',
              url: '/crypto/cp-dashboard'
            },
            {
              id: 'cp-exchange',
              title: 'Exchange',
              type: 'item',
              url: '/crypto/cp-exchange'
            },
            {
              id: 'cp-wallet',
              title: 'Wallet',
              type: 'item',
              url: '/crypto/cp-wallet'
            },
            {
              id: 'cp-transactions',
              title: 'Transactions',
              type: 'item',
              url: '/crypto/cp-transactions'
            },
            {
              id: 'cp-history',
              title: 'History',
              type: 'item',
              url: '/crypto/cp-history'
            },
            {
              id: 'cp-trading',
              title: 'Trading',
              type: 'item',
              url: '/crypto/cp-trading'
            },
            {
              id: 'cp-coin',
              title: 'Initial Coin',
              type: 'item',
              url: '/crypto/cp-coin'
            },
            {
              id: 'cp-ico',
              title: 'Ico Listing',
              type: 'item',
              url: '/crypto/cp-ico'
            }
          ]
        },
        {
          id: 'ecommerce',
          title: 'Ecommerce',
          type: 'collapse',
          icon: 'feather icon-shopping-cart',
          children: [
            {
              id: 'ecomm-product',
              title: 'Product',
              type: 'item',
              url: '/ecommerce/ecomm-product'
            },
            {
              id: 'ecomm-product-details',
              title: 'Product Details',
              type: 'item',
              url: '/ecommerce/ecomm-product-details'
            },
            {
              id: 'ecomm-order',
              title: 'Order',
              type: 'item',
              url: '/ecommerce/ecomm-order'
            },
            {
              id: 'ecomm-checkout',
              title: 'Checkout',
              type: 'item',
              url: '/ecommerce/ecomm-checkout'
            },
            {
              id: 'ecomm-cart',
              title: 'Shopping Cart',
              type: 'item',
              url: '/ecommerce/ecomm-cart'
            },
            {
              id: 'ecomm-customer',
              title: 'Customers',
              type: 'item',
              url: '/ecommerce/ecomm-customer'
            },
            {
              id: 'ecomm-seller',
              title: 'Sellers',
              type: 'item',
              url: '/ecommerce/ecomm-seller'
            }
          ]
        }
      ]
    },
    {
      id: 'ui-element',
      title: 'UI ELEMENT',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'basic',
          title: 'Basic',
          type: 'collapse',
          icon: 'feather icon-box',
          children: [
            {
              id: 'alert',
              title: 'Alert',
              type: 'item',
              url: '/basic/alert'
            },
            {
              id: 'button',
              title: 'Button',
              type: 'item',
              url: '/basic/button'
            },
            {
              id: 'badges',
              title: 'Badges',
              type: 'item',
              url: '/basic/badges'
            },
            {
              id: 'breadcrumb-pagination',
              title: 'Breadcrumb & Pagination',
              type: 'item',
              url: '/basic/breadcrumb-pagination'
            },
            {
              id: 'cards',
              title: 'Cards',
              type: 'item',
              url: '/basic/cards'
            },
            {
              id: 'collapse',
              title: 'Collapse',
              type: 'item',
              url: '/basic/collapse'
            },
            {
              id: 'carousel',
              title: 'Carousel',
              type: 'item',
              url: '/basic/carousel'
            },
            {
              id: 'grid-system',
              title: 'Grid System',
              type: 'item',
              url: '/basic/grid-system'
            },
            {
              id: 'progress',
              title: 'Progress',
              type: 'item',
              url: '/basic/progress'
            },
            {
              id: 'modal',
              title: 'Modal',
              type: 'item',
              url: '/basic/modal'
            },
            {
              id: 'spinner',
              title: 'Spinner',
              type: 'item',
              url: '/basic/spinner',
              badge: {
                title: 'New',
                type: 'badge-danger'
              }
            },
            {
              id: 'tabs-pills',
              title: 'Tabs & Pills',
              type: 'item',
              url: '/basic/tabs-pills'
            },
            {
              id: 'typography',
              title: 'Typography',
              type: 'item',
              url: '/basic/typography'
            },
            {
              id: 'tooltip-popovers',
              title: 'Tooltip & Popovers',
              type: 'item',
              url: '/basic/tooltip-popovers'
            },
            {
              id: 'other',
              title: 'Other',
              type: 'item',
              url: '/basic/other'
            }
          ]
        },
        {
          id: 'advance',
          title: 'Advance',
          type: 'collapse',
          icon: 'feather icon-gitlab',
          children: [
            {
              id: 'sweet-alert',
              title: 'Sweet Alert',
              type: 'item',
              url: '/advance/sweet-alert'
            },
            {
              id: 'datepicker',
              title: 'Datepicker',
              type: 'item',
              url: '/advance/datepicker'
            },
            {
              id: 'task-board',
              title: 'Task Board',
              type: 'item',
              url: '/advance/task-board'
            },
            {
              id: 'light-box',
              title: 'Light Box',
              type: 'item',
              url: '/advance/light-box'
            },
            {
              id: 'adv-modal',
              title: 'Modal',
              type: 'item',
              url: '/advance/adv-modal'
            },
            {
              id: 'notification',
              title: 'Notification',
              type: 'item',
              url: '/advance/notification'
            },
            {
              id: 'nestable',
              title: 'Nestable',
              type: 'item',
              url: '/advance/nestable'
            },
            {
              id: 'p-notify',
              title: 'P-Notify',
              type: 'item',
              url: '/advance/p-notify'
            },
            {
              id: 'rating',
              title: 'Rating',
              type: 'item',
              url: '/advance/rating'
            },
            {
              id: 'range-slider',
              title: 'Range Slider',
              type: 'item',
              url: '/advance/range-slider'
            },
            {
              id: 'slider',
              title: 'Slider',
              type: 'item',
              url: '/advance/slider'
            },
            {
              id: 'syntax-highlighter',
              title: 'Syntax Highlighter',
              type: 'item',
              url: '/advance/syntax-highlighter'
            },
            {
              id: 'tour',
              title: 'Tour',
              type: 'item',
              url: '/advance/tour'
            },
            {
              id: 'tree-view',
              title: 'Tree View',
              type: 'item',
              url: '/advance/tree-view'
            }
          ]
        }
      ]
    },
    {
      id: 'ui-forms',
      title: 'Forms',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'forms',
          title: 'Forms',
          type: 'collapse',
          icon: 'feather icon-file-text',
          children: [
            {
              id: 'form-basic',
              title: 'Form Elements',
              type: 'item',
              url: '/forms/form-basic'
            },
            {
              id: 'form-advance',
              title: 'Form Advance',
              type: 'item',
              url: '/forms/form-advance'
            },
            {
              id: 'form-validation',
              title: 'Form Validation',
              type: 'item',
              url: '/forms/form-validation'
            },
            {
              id: 'form-masking',
              title: 'Form Masking',
              type: 'item',
              url: '/forms/form-masking'
            },
            {
              id: 'form-wizard',
              title: 'Form Wizard',
              type: 'item',
              url: '/forms/form-wizard'
            },
            {
              id: 'form-picker',
              title: 'Form Picker',
              type: 'item',
              url: '/forms/form-picker'
            },
            {
              id: 'form-select',
              title: 'Form Select',
              type: 'item',
              url: '/forms/form-select'
            }
          ]
        }
      ]
    },
    {
      id: 'table',
      title: 'Table',
      type: 'group',
      icon: 'icon-table',
      children: [
        {
          id: 'tables',
          title: 'Table',
          type: 'collapse',
          icon: 'feather icon-server',
          children: [
            {
              id: 'bootstrap',
              title: 'Bootstrap Table',
              type: 'item',
              url: '/tables/bootstrap'
            },
            {
              id: 'datatable',
              title: 'React Tables',
              type: 'collapse',
              children: [
                {
                  id: 'tbl-basic',
                  title: 'Basic',
                  type: 'item',
                  url: '/table/datatable/tbl-basic'
                },
                {
                  id: 'tbl-footer',
                  title: 'Table Footer',
                  type: 'item',
                  url: '/table/datatable/tbl-footer'
                },
                {
                  id: 'tbl-sorting',
                  title: 'Sorting',
                  type: 'item',
                  url: '/table/datatable/tbl-sorting'
                },
                {
                  id: 'tbl-filtering',
                  title: 'Filtering',
                  type: 'item',
                  url: '/table/datatable/tbl-filtering'
                },
                {
                  id: 'tbl-grouping',
                  title: 'Grouping',
                  type: 'item',
                  url: '/table/datatable/tbl-grouping'
                },
                {
                  id: 'tbl-pagination',
                  title: 'Pagination',
                  type: 'item',
                  url: '/table/datatable/tbl-pagination'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'chart-maps',
      title: 'Chart & Maps',
      type: 'group',
      icon: 'icon-charts',
      children: [
        {
          id: 'charts',
          title: 'Charts',
          type: 'collapse',
          icon: 'feather icon-pie-chart',
          children: [
            {
              id: 'apex-chart',
              title: 'Apex Chart',
              type: 'item',
              url: '/charts/apex-chart'
            },
            {
              id: 'chart-js',
              title: 'Chart JS',
              type: 'item',
              url: '/charts/chart-js'
            },
            {
              id: 'highchart',
              title: 'Highchart',
              type: 'item',
              url: '/charts/highchart'
            },
            {
              id: 'rechart',
              title: 'Rechart',
              type: 'item',
              url: '/charts/rechart'
            }
          ]
        },
        {
          id: 'maps',
          title: 'Maps',
          type: 'collapse',
          icon: 'feather icon-map',
          children: [
            {
              id: 'google-map',
              title: 'Google',
              type: 'item',
              url: '/maps/google-map'
            },
            {
              id: 'vector-map',
              title: 'Vector',
              type: 'item',
              url: '/maps/vector-map'
            }
          ]
        }
      ]
    },
    {
      id: 'pages',
      title: 'Pages',
      type: 'group',
      icon: 'icon-pages',
      children: [
        {
          id: 'auth',
          title: 'Authentication',
          type: 'collapse',
          icon: 'feather icon-lock',
          children: [
            {
              id: 'signup-1',
              title: 'Sign up',
              type: 'item',
              url: '/auth/signup-1',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'signup-2',
              title: 'Sign up v2',
              type: 'item',
              url: '/auth/signup-2',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'signin-1',
              title: 'Sign in',
              type: 'item',
              url: '/auth/signin-1',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'signin-2',
              title: 'Sign in v2',
              type: 'item',
              url: '/auth/signin-2',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'reset-password-1',
              title: 'Reset Password',
              type: 'item',
              url: '/auth/reset-password-1',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'reset-password-2',
              title: 'Reset Password v2',
              type: 'item',
              url: '/auth/reset-password-2',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'change-password',
              title: 'Change Password',
              type: 'item',
              url: '/auth/change-password',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'profile-settings',
              title: 'Profile Settings',
              type: 'item',
              url: '/auth/profile-settings',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'tabs-auth',
              title: 'Tabs Authentication',
              type: 'item',
              url: '/auth/tabs-auth',
              target: true,
              breadcrumbs: false
            }
          ]
        },
        {
          id: 'maintenance',
          title: 'Maintenance',
          type: 'collapse',
          icon: 'feather icon-sliders',
          children: [
            {
              id: 'error',
              title: 'Error',
              type: 'item',
              url: '/maintenance/error',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'coming-soon',
              title: 'Coming Soon',
              type: 'item',
              url: '/maintenance/coming-soon',
              target: true,
              breadcrumbs: false
            },
            {
              id: 'offline-ui',
              title: 'Offline UI',
              type: 'item',
              url: '/maintenance/offline-ui',
              target: true,
              breadcrumbs: false
            }
          ]
        }
      ]
    },
    {
      id: 'app',
      title: 'App',
      type: 'group',
      icon: 'icon-app',
      children: [
        {
          id: 'task',
          title: 'Task',
          type: 'collapse',
          icon: 'feather icon-clipboard',
          children: [
            {
              id: 'task-list',
              title: 'Task List',
              type: 'item',
              url: '/task/task-list'
            },
            {
              id: 'task-board',
              title: 'Task Board',
              type: 'item',
              url: '/task/task-board'
            },
            {
              id: 'task-detail',
              title: 'Task Detail',
              type: 'item',
              url: '/task/task-detail'
            }
          ]
        },
        {
          id: 'to-dos',
          title: 'Todo',
          type: 'collapse',
          icon: 'feather icon-check-square',
          children: [
            {
              id: 'todo',
              title: 'Todo',
              type: 'item',
              url: '/todo/todo-basic'
            }
          ]
        },
        {
          id: 'gallery',
          title: 'Gallery',
          type: 'collapse',
          icon: 'feather icon-image',
          children: [
            {
              id: 'grid',
              title: 'Grid',
              type: 'item',
              url: '/gallery/gallery-grid'
            },
            {
              id: 'photo-grid',
              title: 'Photo Gallery',
              type: 'item',
              url: '/gallery/photo-grid'
            },
            {
              id: 'masonry',
              title: 'Masonry',
              type: 'item',
              url: '/gallery/gallery-masonry'
            }
          ]
        }
      ]
    },
    {
      id: 'extension',
      title: 'Extension',
      type: 'group',
      icon: 'icon-extension',
      children: [
        {
          id: 'editor',
          title: 'Editor',
          type: 'collapse',
          icon: 'feather icon-file-plus',
          children: [
            {
              id: 'ck-editor',
              title: 'CK-Editor',
              type: 'collapse',
              children: [
                {
                  id: 'ck-classic',
                  title: 'Classic Editor',
                  type: 'item',
                  url: '/editor/ck-editor/ck-classic',
                  target: true
                },
                {
                  id: 'ck-balloon',
                  title: 'Balloon Editor',
                  type: 'item',
                  url: '/editor/ck-editor/ck-balloon',
                  target: true
                },
                {
                  id: 'ck-inline',
                  title: 'Inline Editor',
                  type: 'item',
                  url: '/editor/ck-editor/ck-inline',
                  target: true
                },
                {
                  id: 'ck-document',
                  title: 'Document Editor',
                  type: 'item',
                  url: '/editor/ck-editor/ck-document',
                  target: true
                }
              ]
            },
            {
              id: 'rich-editor',
              title: 'Rich Editor',
              type: 'item',
              url: '/editor/rich-editor'
            },
            {
              id: 'jodit-wysiwyg',
              title: 'Jodit WYSIWYG',
              type: 'item',
              url: '/editor/jodit-wysiwyg'
            }
          ]
        },
        {
          id: 'invoice',
          title: 'Invoice',
          type: 'collapse',
          icon: 'feather icon-file-minus',
          children: [
            {
              id: 'invoice-basic',
              title: 'Invoice Basic',
              type: 'item',
              url: '/invoice/invoice-basic'
            },
            {
              id: 'invoice-summary',
              title: 'Invoice Summary',
              type: 'item',
              url: '/invoice/invoice-summary'
            },
            {
              id: 'invoice-list',
              title: 'Invoice List',
              type: 'item',
              url: '/invoice/invoice-list'
            }
          ]
        },
        {
          id: 'full-calendar',
          title: 'Full Calendar',
          type: 'item',
          url: '/full-calendar',
          classes: 'nav-item',
          icon: 'feather icon-calendar'
        },
        {
          id: 'file-upload',
          title: 'File Upload',
          type: 'item',
          url: '/file-upload',
          classes: 'nav-item',
          icon: 'feather icon-upload-cloud'
        },
        {
          id: 'image-cropper',
          title: 'Image Cropper',
          type: 'item',
          url: '/image-cropper',
          classes: 'nav-item',
          icon: 'feather icon-image'
        }
      ]
    },
    {
      id: 'support',
      title: 'Support',
      type: 'group',
      icon: 'icon-support',
      children: [
        {
          id: 'menu-level',
          title: 'Menu Levels',
          type: 'collapse',
          icon: 'feather icon-menu',
          children: [
            {
              id: 'menu-level-1.1',
              title: 'Menu Level 1.1',
              type: 'item',
              url: '#!'
            },
            {
              id: 'menu-level-1.2',
              title: 'Menu Level 2.2',
              type: 'collapse',
              children: [
                {
                  id: 'menu-level-2.1',
                  title: 'Menu Level 2.1',
                  type: 'item',
                  url: '#'
                },
                {
                  id: 'menu-level-2.2',
                  title: 'Menu Level 2.2',
                  type: 'collapse',
                  children: [
                    {
                      id: 'menu-level-3.1',
                      title: 'Menu Level 3.1',
                      type: 'item',
                      url: '#'
                    },
                    {
                      id: 'menu-level-3.2',
                      title: 'Menu Level 3.2',
                      type: 'item',
                      url: '#'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'disabled-menu',
          title: 'Disabled Menu',
          type: 'item',
          url: '#',
          classes: 'nav-item disabled',
          icon: 'feather icon-power'
        },
        {
          id: 'sample-page',
          title: 'Sample Page',
          type: 'item',
          url: '/sample-page',
          classes: 'nav-item',
          icon: 'feather icon-sidebar'
        }
      ]
    }
  ]
};

export default menuItems;
