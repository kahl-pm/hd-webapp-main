import React, { Suspense } from 'react';
import { styled } from '@mui/material';


const RebrandNav = React.lazy(
  () => import('../RebrandNav'),
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
      <Suspense fallback={null}>
        <RebrandNav />
      </Suspense>
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
