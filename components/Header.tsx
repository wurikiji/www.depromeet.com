import { FC } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

const Logo = dynamic(() => import('../public/gnb_logo.svg'));

interface BackgroundTransparentProps {
  isTransparent?: boolean;
}
const applyFor9th = 'https://forms.gle/MVr4auDmerieZZR27?fbclid=IwAR3vamHZfGNvWtQ5bHKRE7swLKHFGsHeSy0wUde_bdoate-veAqlLJeM3kI';

export const openApplySite = () => window.open(applyFor9th);
const Header: FC<BackgroundTransparentProps> = ({ isTransparent = false }) => (
  <Container isTransparent={isTransparent}>
    <div style={{ cursor: 'pointer' }}>
      <Link href="/">
        <Logo />
      </Link>
    </div>
    <ButtonContainer>
      <RouterBtn routerName="about" path="/" />
      <RouterBtn routerName="project" path="/project" />
      <RouterBtn routerName="contact" path="/contact" />
      <Button
        role="button"
        tabIndex={0}
        onClick={openApplySite}
      >
        9기에서 만나기
      </Button>
    </ButtonContainer>
  </Container>
);

const RouterBtn = ({ routerName, path }) => {
  const router = useRouter();
  const pathname = useRouter().pathname;

  const handleRouting = () => router.push(path);

  return (
    <RouterButton
      role="button"
      onClick={handleRouting}
      onKeyPress={handleRouting}
      tabIndex={0}
      isSame={path === pathname}
    >
      {routerName.toUpperCase()}
      {path === pathname && <Underline />}
    </RouterButton>
  );
};

const Container = styled.div<BackgroundTransparentProps>`
  position: fixed;
  background-color: ${({ isTransparent }) => (isTransparent ? 'transparent' : 'black')};
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 8rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 10;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Button = styled.div`
  width: auto;
  font-size: 1.5rem;
  font-weight: 800;
  padding: 1.2rem 2.4rem;
  background-color: ${({ theme }) => theme.color.blue};
  border-radius: 2.7rem;
  margin-left: 0.7rem;
  :hover {
    background-color: #0013BA;
  }
`;

const RouterButton = styled.div<{isSame: boolean}>`
  position: relative;
  font-family: Montserrat;
  margin-right: 3.4rem;
  font-size: 1.4rem;
  font-weight: ${({ isSame }) => (isSame ? 800 : 500)};
  :hover {
    color: #c0c0c0;
  }
`;

const Underline = styled.div`
  cursor: default;
  position: absolute;
  width: 100%;
  height: 0.2rem;
  background-color: white;
  margin-top: 0.8rem;
`;

export default Header;
