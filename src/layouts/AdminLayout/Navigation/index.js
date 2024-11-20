import React, { useContext } from 'react';

import { ConfigContext } from '../../../contexts/ConfigContext';
import useWindowSize from '../../../hooks/useWindowSize';

import NavContent from './NavContent';
import navigation from '../../../menu-items';
import navigation2 from '../../../menu-items2';

const Navigation = () => {
  const configContext = useContext(ConfigContext);
  const { layout, layoutType, navFixedLayout, collapseMenu, rtlLayout, boxLayout, subLayout, headerFixedLayout } = configContext.state;
  const windowSize = useWindowSize();
  const user_access_role =  JSON.parse(sessionStorage.getItem('user_access_role'));

  if (Array.isArray(user_access_role)) {
    const entity = user_access_role.map(val => val.entity);
    console.log("entity - ", entity);
  
    const doesItemExist = (array, id) => array.some(item => item.id === id);
  
    if (entity.includes('DigiCard')) {
      if (!doesItemExist(navigation2.items[0].children, 'digicard')) {
        navigation2.items[0].children.push({
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
            },
          ],
        });
      }
    }
  
    if (entity.includes('Assessments')) {
      if (!doesItemExist(navigation2.items[0].children, 'questions')) {
        navigation2.items[0].children.push({
          id: 'questions',
          title: 'Questions',
          type: 'collapse',
          icon: 'feather icon-check-square',
          children: [
            {
              id: 'active-questions',
              title: 'Active Questions',
              type: 'item',
              url: '/admin-portal/active-questions',
            },
            {
              id: 'archived-questions',
              title: 'Archived Questions',
              type: 'item',
              url: '/admin-portal/archived-questions',
            },
          ],
        });
      }
      // if (!doesItemExist(navigation2.items, 'management-panel')) {
      //   navigation2.items.push({
      //     id: 'management-panel',
      //     title: 'Management Panel',
      //     type: 'group',
      //     icon: 'icon-monitor',
      //     children: [
      //       {
      //         id: 'blue_print',
      //         title: 'Blue Print',
      //         type: 'collapse',
      //         icon: 'fas fa-map',
      //         children: [
      //           {
      //             id: 'active-blueprint',
      //             title: 'Active Blue Print',
      //             type: 'item',
      //             url: '/admin-portal/active-blueprint',
      //           },
      //           {
      //             id: 'archived-blueprint',
      //             title: 'Archived Blue Print',
      //             type: 'item',
      //             url: '/admin-portal/archived-blueprint',
      //           },
      //         ],
      //       },
      //     ],
      //   });
      // }
    }
  
    if (entity.includes('Groups')) {
      if (!doesItemExist(navigation2.items[0].children, 'groups')) {
        navigation2.items[0].children.push({
          id: 'groups',
          title: 'Groups',
          type: 'collapse',
          icon: 'feather icon-folder',
          children: [
            {
              id: 'active-groups',
              title: 'Active Groups',
              type: 'item',
              url: '/admin-portal/active-groups',
            },
            {
              id: 'archived-groups',
              title: 'Archived Groups',
              type: 'item',
              url: '/admin-portal/archived-groups',
            },
          ],
        });
      }
    }
  
    if (entity.includes('Worksheet')) {
      if (navigation2.items[1]) {
        if (!doesItemExist(navigation2.items[0].children, 'worksheet_blue_print')) {
          navigation2.items[0].children.push({
            id: 'worksheet_blue_print',
            title: 'Worksheet Blue Print',
            type: 'collapse',
            icon: 'fas fa-map',
            children: [
              {
                id: 'worksheet-blueprint',
                title: 'Active Blue Print',
                type: 'item',
                url: '/admin-portal/worksheet-blueprint',
              },
              {
                id: 'worksheet_archived-blueprint',
                title: 'Archived Blue Print',
                type: 'item',
                url: '/admin-portal/archived-worksheet-blueprint',
              },
            ],
          });
        }
      } else {
        if (!doesItemExist(navigation2.items, 'management-panel')) {
          navigation2.items.push({
            id: 'management-panel',
            title: 'Management Panel',
            type: 'group',
            icon: 'icon-monitor',
            children: [
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
                    url: '/admin-portal/worksheet-blueprint',
                  },
                  {
                    id: 'worksheet_archived-blueprint',
                    title: 'Archived Blue Print',
                    type: 'item',
                    url: '/admin-portal/archived-worksheet-blueprint',
                  },
                ],
              },
            ],
          });
        }
      }
    }
  }
  

  const scroll = () => {
    if (navFixedLayout && headerFixedLayout === false) {
      const main = document.querySelector('.pcoded-navbar');
      const el = document.querySelector('.pcoded-navbar.menupos-fixed');
      const scrollPosition = window.pageYOffset;
      if (scrollPosition > 60) {
        el.style.position = 'fixed';
        el.style.transition = 'none';
        el.style.marginTop = '0';
      } else {
        main.style.position = 'absolute';
        main.style.marginTop = '56px';
      }
    } else {
      document.querySelector('.pcoded-navbar').removeAttribute('style');
    }
  };

  let navClass = ['pcoded-navbar', layoutType];

  if (layout === 'horizontal') {
    navClass = [...navClass, 'theme-horizontal'];
  } else {
    if (navFixedLayout) {
      navClass = [...navClass, 'menupos-fixed'];
    }

    if (navFixedLayout && !headerFixedLayout) {
      window.addEventListener('scroll', scroll, true);
      window.scrollTo(0, 0);
    } else {
      window.removeEventListener('scroll', scroll, false);
    }
  }

  if (windowSize.width < 992 && collapseMenu) {
    navClass = [...navClass, 'mob-open'];
  } else if (collapseMenu) {
    navClass = [...navClass, 'navbar-collapsed'];
  }

  if (layoutType === 'dark') {
    document.body.classList.add('gradient-able-dark');
  } else {
    document.body.classList.remove('gradient-able-dark');
  }

  if (rtlLayout) {
    document.body.classList.add('gradient-able-rtl');
  } else {
    document.body.classList.remove('gradient-able-rtl');
  }

  if (boxLayout) {
    document.body.classList.add('container');
    document.body.classList.add('box-layout');
  } else {
    document.body.classList.remove('container');
    document.body.classList.remove('box-layout');
  }

  let navBarClass = ['navbar-wrapper'];
  if (layout === 'horizontal' && subLayout === 'horizontal-2') {
    navBarClass = [...navBarClass, 'container'];
  }
  let navContent = (
    <div className={navBarClass.join(' ')}>
      <NavContent navigation={user_access_role === 'admin' ? navigation.items : navigation2.items} />
    </div>
  );
  if (windowSize.width < 992) {
    navContent = (
      <div className="navbar-wrapper">
        <NavContent navigation={user_access_role === 'admin' ? navigation.items : navigation2.items} />
      </div>
    );
  }
  return (
    <React.Fragment>
      <nav className={navClass.join(' ')}>{navContent}</nav>
    </React.Fragment>
  );
};

export default Navigation;
