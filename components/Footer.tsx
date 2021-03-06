import styled from 'styled-components';
import dynamic from 'next/dynamic';

const Footer = () => {
  const FooterLogo = dynamic(() => import('../resources/images/logo_footer.svg'));
  const InstagramLogo = dynamic(() => import('../resources/images/ic_sns_instagram.svg'));
  const FacebookLogo = dynamic(() => import('../resources/images/ic_sns_facebook.svg'));
  const MediumLogo = dynamic(() => import('../resources/images/ic_sns_medium.svg'));
  return (
    <Container>
      <Content>
        <FooterLogo />
        <ButtonContainer>
          <MediaButton href="https://depromeet.medium.com/">
            <MediumLogo />
          </MediaButton>
          <MediaButton href="https://www.facebook.com/depromeet/">
            <FacebookLogo />
          </MediaButton>
          <MediaButton href="https://www.instagram.com/depromeet/">
            <InstagramLogo />
          </MediaButton>
        </ButtonContainer>
      </Content>
      <Copyright>
        <small>Depromeet. All rights reserved.</small>
      </Copyright>
    </Container>
  );
};
const MediaButton = ({ href, children }) => (
  <Button
    role="button"
    tabIndex={0}
    href={href}
    target="_blank"
  >
    {children}
  </Button>
);
const Container = styled.footer`
  background: #0C0C0C;
  border: 1px solid #000000;
  box-sizing: border-box;
  width: 100%;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 16rem;
  padding-left: 20vw;
  padding-right: 20vw;
`;

const ButtonContainer = styled.div`
  display: flex;
`;
const Button = styled.a`
  display: flex;
  background: #2b2b2b;
  border-radius: 50%;
  height: 4.8rem;
  width: 4.8rem;
  text-decoration: none;
  margin-left: 2.4rem;
  align-items: center;
  justify-content: center;
`;

const Copyright = styled.div`
  height: 4rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #141414;
  font-style: normal;
  font-weight: normal;
  font-size: 1.2rem;
  line-height: 1.5rem;
  font-family: Montserrat;
  color: #757575;
`;

export default Footer;
