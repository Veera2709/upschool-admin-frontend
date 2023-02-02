const menuItems = {
  items: [
    {
      id: 'admin-panel',
      title: 'Admin Panel',
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
          icon: 'fas fa-book',
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
          children:[
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
          icon: 'feather icon-box',
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
          icon: 'feather icon-package',
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
      ]
    }

  ]
};

export default menuItems;
