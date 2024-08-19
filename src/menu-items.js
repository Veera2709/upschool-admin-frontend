const menuItems = {
  items: [
    {
      id: 'content-panel',
      title: 'Content Panel',
      type: 'group',
      icon: 'icon-monitor',
      children: [
        {
          id: 'main-dashboard',
          title: 'Dashboard',
          icon: 'feather icon-home',
          type: 'item',
          url: '/admin-portal/admin-dashboard'
        },
        {
          id: 'digicard',
          title: 'DigiCard',
          type: 'collapse',
          icon: 'fab fa-react',

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
          id: 'questions',
          title: 'Questions',
          type: 'collapse',
          icon: 'feather icon-check-square',
          children: [
            {
              id: 'active-questions',
              title: 'Active Questions',
              type: 'item',
              url: '/admin-portal/active-questions'
            },
            {
              id: 'archived-questions',
              title: 'Archived Questions',
              type: 'item',
              url: '/admin-portal/archived-questions'
            }
          ]
        },
        {
          id: 'groups',
          title: 'Groups',
          type: 'collapse',
          icon: 'feather icon-folder',
          children: [
            {
              id: 'active-groups',
              title: 'Active Groups',
              type: 'item',
              url: '/admin-portal/active-groups'
            },
            {
              id: 'archived-groups',
              title: 'Archived Groups',
              type: 'item',
              url: '/admin-portal/archived-groups'
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
          type: 'collapse',
          icon: 'feather icon-package',
          url: '/admin-portal/Topics/topicsList',
          children: [
            {
              id: 'active-topics',
              title: 'Active Topics',
              type: 'item',
              url: '/admin-portal/Topics/active-topics'
            },
            {
              id: 'archived-topics',
              title: 'Archived Topics',
              type: 'item',
              url: '/admin-portal/Topics/archived-topics'
            },
          ]
        },
        {
          id: 'chapters',
          title: 'Chapters',
          type: 'collapse',
          icon: 'fas fa-passport',
          children: [

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
          id: 'units',
          title: 'Units',
          type: 'collapse',
          icon: 'fas fa-book',
          children: [
            {
              id: 'active-units',
              title: 'Active Units',
              type: 'item',
              url: '/admin-portal/units/active-units',
            },
            {
              id: 'archived-units',
              title: 'Archived Units',
              type: 'item',
              url: '/admin-portal/units/archived-units',
            },
          ]
        },
        {
          id: 'subjects',
          title: 'Subjects',
          type: 'collapse',
          icon: 'fas fa-book-open',
          children: [
            {
              id: 'active-subjects',
              title: 'Active Subjects',
              type: 'item',
              url: '/admin-portal/active-subjects'
            },
            {
              id: 'archived-subjects',
              title: 'Archived Subjects',
              type: 'item',
              url: '/admin-portal/archived-subjects'
            }
          ]
        },
        {
          id: 'Class',
          title: 'Class',
          type: 'collapse',
          // icon: 'feather icon-package',
          icon: 'fas fa-warehouse',
          children: [
            {
              id: 'active-classes',
              title: 'Active Classes',
              type: 'item',
              url: '/admin-portal/classes/active-classes'
            },
            {
              id: 'archived-classes',
              title: 'Archived Classes',
              type: 'item',
              url: '/admin-portal/classes/archived-classes'
            }
          ]
        },
      ]
    },
    {
      id: 'management-panel',
      title: 'Management Panel',
      type: 'group',
      icon: 'icon-monitor',
      children: [
        {
          id: 'sch-addSchool',
          title: 'School',
          icon: 'fas fa-building',
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
              url: '/admin-portal/archived-schools'
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
        {
          id: 'upSchoolUsers',
          title: 'CMS Users',
          type: 'collapse',
          icon: 'fas fa-users',
          children: [
            {
              id: 'active-upSchoolUsers',
              title: 'Active Users',
              type: 'item',
              url: '/admin-portal/active-upSchoolUsers'
            },
            {
              id: 'archived-upSchoolUsers',
              title: 'Archived Users',
              type: 'item',
              url: '/admin-portal/archived-upSchoolUsers'
            }
          ]
        },
        {
          id: 'blue_print',
          title: 'Blue Print',
          type: 'collapse',
          icon: 'fas fa-map',
          children: [
            {
              id: 'active-blueprint',
              title: 'Active Blue Print',
              type: 'item',
              url: '/admin-portal/active-blueprint'
            },
            {
              id: 'archived-blueprint',
              title: 'Archived Blue Print',
              type: 'item',
              url: '/admin-portal/archived-blueprint'
            },
          ]
        },
        {
          id: 'worksheet_blue_print',
          title: 'Worksheet Blue Print',
          type: 'collapse',
          icon: 'fas fa-map',
          children: [
            {
              id: 'worksheet-blueprint',
              title: 'Active Blue Print',
              type: 'item',
              url: '/admin-portal/worksheet-blueprint'
            },
            {
              id: 'worksheet_archived-blueprint',
              title: 'Archived Blue Print',
              type: 'item',
              url: '/admin-portal/archived-worksheet-blueprint'
            },
          ]
        },
        {
          id: 'settings',
          title: 'Settings',
          icon: 'feather icon-settings',
          type: 'collapse',
          children: [
            {
              id: 'questionCategory',
              title: 'Question Category',
              type: 'collapse',
              children: [
                {
                  id: 'activeQuestionCategory',
                  title: 'Active',
                  type: 'item',
                  url: '/admin-portal/admin-settings/active-questionCategory'
                },
                {
                  id: 'archivedQuestionCategory',
                  title: 'Archived',
                  type: 'item',
                  url: '/admin-portal/admin-settings/archived-questionCategory'
                },
              ]
            },
            {
              id: 'questionDisclaimer',
              title: 'Question Disclaimer',
              type: 'collapse',
              children: [
                {
                  id: 'activeQuestionDisclaimer',
                  title: 'Active',
                  type: 'item',
                  url: '/admin-portal/admin-settings/active-questionDisclaimer'
                },
                {
                  id: 'archivedQuestionDisclaimer',
                  title: 'Archived',
                  type: 'item',
                  url: '/admin-portal/admin-settings/archived-questionDisclaimer'
                },
              ]
            },
            {
              id: 'sourceOfQuestion',
              title: 'Source of Question',
              type: 'collapse',
              children: [
                {
                  id: 'activeSourceOfQuestion',
                  title: 'Active',
                  type: 'item',
                  url: '/admin-portal/admin-settings/active-sourceOfQuestion'
                },
                {
                  id: 'archivedSourceOfQuestion',
                  title: 'Archived',
                  type: 'item',
                  url: '/admin-portal/admin-settings/archived-sourceOfQuestion'
                },
              ]
            },
            {
              id: 'cognitiveSkills',
              title: 'Cognitive Skills',
              type: 'collapse',
              children: [
                {
                  id: 'activeCognitiveSkills',
                  title: 'Active',
                  type: 'item',
                  url: '/admin-portal/admin-settings/active-cognitiveSkills'
                },
                {
                  id: 'archivedCognitiveSkills',
                  title: 'Archived',
                  type: 'item',
                  url: '/admin-portal/admin-settings/archived-cognitiveSkills'
                },
              ]
            }
          ]
        }
      ]
    },
  ]
}

export default menuItems;