import React from 'react';
import { styled } from '@mui/material';
import universal from 'react-universal-component';
import { getLoadingConfig } from '../Routing/utils';


const RebrandNav = universal(
  () => import(/* webpackChunkName: "other" */ '../RebrandNav'),
  getLoadingConfig('other'),
);

interface PageContentProps {
  children: React.ReactNode;
}

const PageContentContainer = styled('div')(({ theme }) => {
  return ({
    position: 'relative',
    // this is needed to prevent page with overflow from scrolling past boundary
    // #main container is the direct child and controls scroll with overflow:auto
    'overflow-y': 'hidden',
    width: `calc(100vw - ${theme.navigationDrawer.drawerWidth})`,
    marginLeft: `${theme.navigationDrawer.drawerWidth}`,
    [theme.breakpoints.down('desktop')]: {
      width: '100%',
      marginLeft: 0,
    },
  });
});

const PageContentWithNav:React.FC<PageContentProps> = ({ children }) => {
  return (
    <>
      <RebrandNav />
      {
        /* Since the new nav is vertical,
        we have to account for the vertical space(width) it takes
        and move the main app content location accordingly.
        This wrapper adjusts the main content accordingly.
        */
      }
      <PageContentContainer>
        {children}
      </PageContentContainer>
    </>
  );
};

export default PageContentWithNav;
