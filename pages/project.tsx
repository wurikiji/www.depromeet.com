/* eslint-disable react/no-array-index-key */
import styled from 'styled-components';
import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Header, Footer } from '../components';
import ScheduleBox from '../components/ScheduleBox';
import { steps } from '../resources/data/schedule';
import Projects from '../components/Projects';
import projectsData from '../resources/data/projects';

const Project = () => {
  const BackgroundImage = dynamic(() => import('../resources/images/project_background_image.svg'));
  return (
    <div className="no-scroll-bar" style={{ overflow: 'scroll' }}>
      <TransparentableHeader />
      <TopBackground>
        <div style={{ width: '192rem' }}>
          <BackgroundImage />
        </div>
      </TopBackground>
      <CenterAlignedContainer>
        <Catchphrase>
          서비스 런칭부터 개선까지 <br />
          <span className="catchphrase__bold"> 경험에 성장을 더합니다. </span>
        </Catchphrase>
        <AllProjects />
        <AllSchedule />
      </CenterAlignedContainer>
      <Footer />
    </div>
  );
};

const TransparentableHeader = () => {
  const [isTransparent, setTransparent] = useState(true);
  const handleScroll = useCallback(() => {
    const yOffset = window?.pageYOffset;
    if (yOffset === 0) {
      setTransparent(true);
    } else if (isTransparent) {
      setTransparent(false);
    }
  }, [isTransparent, setTransparent]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
  return (
    <Header
      isTransparent={isTransparent}
    />
  );
};

const AllProjects = () => {
  const [expanded, setExpanded] = useState(false);

  const onClickExpandButton = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  const ArrowDownGreen = dynamic(() => import('../resources/images/arrow_down_green.svg'));

  return (
    <ProjectSection>
      <Title>
        모든 작업물<sup>{projectsData.length}</sup>
      </Title>
      <Boxes>
        <Projects expanded={expanded} />
      </Boxes>
      <div
        className="button button__green"
        role="button"
        onClick={onClickExpandButton}
        onKeyDown={() => {}}
        tabIndex={0}
      >
        {expanded ? '접기' : '더보기'}
        <div className={`button--img ${expanded ? 'button--img__usd' : ''}`}>
          <ArrowDownGreen />
        </div>
      </div>
    </ProjectSection>
  );
};

const AllSchedule = () => (
  <ScheduleSection>
    <Title>
      15주간 여정
      <span className="title--desc">Depromeet 9기는 매주 토요일 15주간 진행됩니다.</span>
    </Title>
    <Schedules>
      {steps.map((v, idx) => (
        <ScheduleBox detail={v} key={`steps-${idx}`} index={idx} />
      ))}
    </Schedules>
  </ScheduleSection>
);

const TopBackground = styled.div`
  z-index:-10;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  height: 43.4rem;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const CenterAlignedContainer = styled.div`
  /* position: relative; */
  background-color: transparent;
  width: 114rem;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

const Catchphrase = styled.div`
  font-family: Apple SD Gothic Neo;
  font-style: normal;
  font-weight: normal;
  font-size: 3.6rem;
  line-height: 5.6rem;
  letter-spacing: -0.03em;
  color: #FFFFFF;
  margin-top: 30rem;
  margin-bottom: 7.8rem;
  .catchphrase__bold {
    font-weight: bold;
  }
`;

const Title = styled.h1`
  font-family: Apple SD Gothic Neo;
  font-style: normal;
  font-weight: 800;
  font-size: 2.2rem;
  line-height: 2.6rem;
  letter-spacing: -0.03em;
  color: #FFFFFF;
  margin-bottom: 4rem;
  sup { 
    font-family: Montserrat;
    font-style: normal;
    font-weight: 500;
    font-size: 1.2rem;
    line-height: 1.2rem;
    margin-left: 1rem;
    vertical-align: super;
  }
  .title--desc {
    font-family: Apple SD Gothic Neo;
    font-style: normal;
    font-weight: normal;
    font-size: 1.4rem;
    line-height: 2rem;
    text-transform: uppercase;
    color: #FFFFFF;
    margin-left: 2.4rem;
    vertical-align: center;
  }
`;

const Boxes = styled.div`
  margin-bottom: 5.6rem;
`;

const ProjectSection = styled.div`
  display: flex;
  flex-direction:column;
  margin-bottom: 11.8rem;
  .button{
    border-radius: 2.7rem;
    font-size: 1.4rem;
    line-height: 1.7rem;
    padding: 1.2rem 3rem;
    width: fit-content;
    position: relative;
    display: ${projectsData.length > 12 ? 'flex' : 'none'};
    align-self: center;
    :hover {
      background-color: #001401;
    }
    &__green {
      border: ${({ theme }) => `0.1rem solid ${theme.color.green}`};
      color: ${({ theme }) => theme.color.green};
    }
    &--img{ 
      width: 1.4rem;
      height: 1.4rem;
      margin-left: 0.8rem;
      position: relative;
      display:inline-block;

      &__usd {
        transform: rotate(180deg);
      }
    }
  }
`;

const ScheduleSection = styled.div`
  margin-bottom: 16rem;
`;

const Schedules = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3.2rem 0;
`;

export default Project;
