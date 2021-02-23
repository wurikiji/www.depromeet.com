/* eslint-disable react/no-array-index-key */
import {
  FC, useEffect, useMemo, useState,
  useCallback, useRef, MutableRefObject,
  forwardRef, CSSProperties, useLayoutEffect,
} from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import {
  FixedSizeList, ListChildComponentProps,
} from 'react-window';
import AutoSize from 'react-virtualized-auto-sizer';
import { ProjectData } from '../resources/data/interface';
import {
  iconAppleStore, iconConstruction, iconGoogleStore, iconWebLink, rightBorderImg,
} from '../resources/images';
import projectsData from '../resources/data/projects';

interface ProjectDialogVisibleArg {
    visible: boolean;
    index: number;
}
interface ProjectDialogProps {
  visible: ProjectDialogVisibleArg,
  // eslint-disable-next-line no-unused-vars
  setVisible: (arg: ProjectDialogVisibleArg) => void;
}
const ProjectDialog: FC<ProjectDialogProps> = (props) => {
  const [isClientSide, setClientSide] = useState(false);
  const { visible } = props;

  useEffect(() => {
    if (document !== undefined) {
      setClientSide(true);
    }
  }, [setClientSide]);

  return (
    <>
      {isClientSide && visible.visible && <ProjectDialogList {...props} />}
    </>
  );
};

const useCloseOnEsc = (onEscKeyDown) => {
  useEffect(() => {
    if (window !== undefined) {
      window.addEventListener('keydown', onEscKeyDown);
      return () => {
        window.removeEventListener('keydown', onEscKeyDown);
      };
    }
    return () => {};
  }, [onEscKeyDown]);
};

const ProjectDialogList:FC<ProjectDialogProps> = ({ visible, setVisible }) => {
  const modalElement = useMemo(() => document.createElement('div'), []);
  const closeDialog = useCallback(() => setVisible({ visible: false, index: 0 }), [setVisible]);
  const scrollRef = useRef<FixedSizeList>();
  const onEscKeyDown = useCallback((e) => {
    if (e.keyCode === 27) {
      closeDialog();
    }
  }, [closeDialog]);

  usePortalSetup(modalElement);
  useCloseOnEsc(onEscKeyDown);

  return ReactDOM.createPortal(
    (
      <Container>
        <Backdrop onClick={closeDialog} />
        <AutoSize>
          {({ width, height }) => (
            <>
              <ProjectsListWrapper height={height} width={width} onClick={closeDialog}>
                <ProjectsDialogContents width={width} index={visible.index} scrollRef={scrollRef} />
              </ProjectsListWrapper>
            </>
          )}
        </AutoSize>
      </Container>
    ),
    modalElement,
  );
};

interface ProjectContentsProps {
  width: number;
  index: number;
  scrollRef: MutableRefObject<FixedSizeList>;
}
const ProjectsDialogContents:FC<ProjectContentsProps> = ({ width, index, scrollRef }) => {
  useScrollToIndex(scrollRef, index, width);
  return (
    <>
      <FixedSizeList
        className="no-scroll-bar"
        itemCount={projectsData.length}
        layout="horizontal"
        height={`${contentHeight}rem`}
        width={width}
        itemSize={contentWidth * 10}
        ref={scrollRef}
        itemData={projectsData}
        style={{
          overflow: 'hidden',
        }}
        innerElementType={innerWrapper}
      >
        {ProjectItem}
      </FixedSizeList>
      <ScrollController
        current={index}
        scrollRef={scrollRef}
        width={width}
      />
    </>
  );
};

const innerWrapper = forwardRef<HTMLDivElement, {style: CSSProperties}>(({ style, ...rest }, ref) => (
  <div
    className="no-scroll-bar"
    ref={ref}
    style={{
      ...style,
      width: `${parseFloat(style.width.toString()) + contentPadding * 10 * 2 + contentGap * 10 * (projectsData.length - 1)}px`,
    }}
    {...rest}
  />
));

const useScrollToIndex = (scrollRef: MutableRefObject<FixedSizeList>, index: number, width: number) => {
  const left = (width - contentWidth * 10) / 2 - contentGap * 10;
  useLayoutEffect(() => {
    if (scrollRef.current) { scrollRef.current.scrollTo(contentPadding * 10 + index * 800 + contentGap * 10 * index - left); }
  }, [scrollRef, index, left]);
};

const usePortalSetup = (portal: HTMLElement, rootId = 'modal-root') => useEffect(
  () => {
    const modalRoot = document.getElementById(rootId);
    modalRoot.appendChild(portal);
    return () => {
      modalRoot.removeChild(portal);
    };
  }, [portal, rootId],
);

const RightBorder = rightBorderImg();
interface ProjectDataProps extends ListChildComponentProps{
  data: ProjectData[];
}
const Image = ({ data }) => {
  if (typeof data.icon === 'string') {
    return (
      <img
        src={data.image}
        loading="lazy"
        alt={`${data.title}`}
        style={{
          objectFit: 'contain',
          height: '37rem',
        }}
      />
    );
  }
  return <MemoizedImage data={data} />;
};
const MemoizedImage = ({ data }) => {
  const ProjectImage = useMemo(() => data.image(), [data]);
  return <ProjectImage />;
};
const ProjectItem:FC<ProjectDataProps> = ({ data, index, style }) => {
  const projectData = data[index];

  return (
    <ProjectDetail
      key={`project-detail-${index}`}
      style={{
        ...style,
        left: `${parseFloat(style.left.toString()) + contentPadding * 10 + contentGap * 10 * (index)}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="image">
        <Image data={projectData} />
        <div className="image-shadow" />
      </div>
      <div className="detail">
        <div className="detail--desktop-left">
          <div className="title">
            {projectData.title}
          </div>
          <div className="catchphrase">
            {projectData.catchphrase}
          </div>
          <div className="buttons">
            <AppLinkButtons data={projectData} />
          </div>
        </div>
        <div className="detail--desktop-right">
          <div className="detail--subject">
            프로젝트 소개
            <span className="detail--right-border">
              <RightBorder />
            </span>
          </div>
          <div className="detail--description">
            {projectData.description}
          </div>
          <div className="detail--subject">
            {projectData.generation}기 {projectData.team || ''}
            <span className="detail--right-border">
              <RightBorder />
            </span>
          </div>
          <TeamMember job="designer" member={projectData.desingers?.join(' ∙ ')} />
          <TeamMember job="backend" member={projectData.backends?.join(' ∙ ')} />
          <TeamMember job="frontend" member={projectData.frontends?.join(' ∙ ')} />
        </div>
      </div>
    </ProjectDetail>
  );
};

const TeamMember:FC<{job: string, member?: string}> = ({ job, member }) => (
  member === undefined || member === null ? <></> : (
    <div className="detail--team">
      <span className="detail--team-job">{job}</span>
      <span className="detail--team-member">{member}</span>
    </div>
  )
);

const AppLinkButtons: FC<{data: ProjectData}> = ({ data }) => {
  const ConstructionIcon = useMemo(() => iconConstruction(), []);
  if (data.ios === undefined && data.android === undefined && data.web === undefined) {
    return (
      <LinkButton className="button button__construction" link="#">
        <div className="button--icon">
          <ConstructionIcon />
        </div>
        준비중
      </LinkButton>
    );
  }
  return (
    <>
      <AppstoreButton link={data.ios} />
      <PlaystoreButton link={data.android} />
      <WeblinkButton link={data.web} />
    </>
  );
};

const WeblinkButton : FC<{link?: string}> = ({ link }) => {
  const WeblinkIcon = useMemo(() => iconWebLink(), []);
  return (
    <LinkButton className="button button__link" link={link}>
      <div className="button--icon">
        <WeblinkIcon />
      </div>
      바로 가기
    </LinkButton>
  );
};
const PlaystoreButton : FC<{link?: string}> = ({ link }) => {
  const PlayStoreIcon = useMemo(() => iconGoogleStore(), []);
  return (
    <LinkButton className="button button__link" link={link}>
      <div className="button--icon">
        <PlayStoreIcon />
      </div>
      Google Play
    </LinkButton>
  );
};
const AppstoreButton: FC<{link?: string}> = ({ link }) => {
  const AppleIcon = useMemo(() => iconAppleStore(), []);
  return (
    <LinkButton className="button button__link" link={link}>
      <div className="button--icon">
        <AppleIcon />
      </div>
      App Store
    </LinkButton>
  );
};

const LinkButton: FC<{link?: string, className: string}> = ({ link, className, children }) => {
  if (link !== undefined) {
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <div
        className={className}
        role="button"
        tabIndex={0}
        onClick={() => (link !== '#' ? window.open(link) : null)}
      >
        {children}
      </div>
    );
  }
  return <> </>;
};

interface ScrollControllerProps {
  scrollRef: MutableRefObject<FixedSizeList>;
  current: number,
  width: number,
}

const ScrollController: FC<ScrollControllerProps> = ({
  scrollRef, current, width,
}) => {
  const [index, setIndex] = useState(current);

  useScrollToIndex(scrollRef, index, width);

  const scrollToNext = useCallback((e) => {
    e.stopPropagation();
    setIndex((prev) => (prev < projectsData.length - 1 ? prev + 1 : prev));
  }, []);

  const scrollToPrev = useCallback((e) => {
    e.stopPropagation();
    setIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  return (
    <ForegroundIndicator
      onClick={(e) => e.stopPropagation()}
    >
      <ScrollIndicator
        role="button"
        tabIndex={0}
        onClick={scrollToPrev}
        disabled={index === 0}
      >
        <img
          src={`/ic_left_${index === 0 ? 'dis' : 'default'}.svg`}
          alt="go to prev project"
        />
      </ScrollIndicator>
      <span className="separator" />
      <ScrollIndicator
        role="button"
        tabIndex={0}
        onClick={scrollToNext}
        disabled={index === projectsData.length - 1}
      >
        <img
          src={`/ic_right_${index === projectsData.length - 1 ? 'dis' : 'default'}.svg`}
          alt="go to next project"
        />
      </ScrollIndicator>
    </ForegroundIndicator>
  );
};
// rem
const contentWidth = 80;
const contentHeight = 84;
const contentGap = 5.6;
const contentPadding = 52;
const Container = styled.div`
  position: fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
`;
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: black;
  opacity: 0.8;
  z-index: -1;
`;

const ProjectsListWrapper = styled.div<{height: string, width:string}>`
  display: flex;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  align-content: center;
  align-items: center;
`;
const ProjectDetail = styled.div`
  position: relative;
  width: ${contentWidth}rem;
  height: ${contentHeight}rem;
  background-color: #212121;
  border-radius: 3.6rem;
  opacity: 1;
  margin-left: ${contentGap}rem;
  left: 52rem;
  z-index: 1;
  /* :first-of-type {
    margin-left: 0;
  } */
  .image {
    height: 42rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    position: relative;
    .image-shadow {
      position: absolute;
      height: 19rem;
      width: 100%;
      bottom: 0;
      z-index: -1;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 12.63%, rgba(0, 0, 0, 0.9) 100%);
    }
  }

  .detail {
    height: 42rem;
    width: 100%;
    font-family: Apple SD Gothic Neo;
    color: white;
    word-break: keep-all;
    padding:4.8rem 5.6rem 0;
    box-sizing: border-box;
    display: grid;
    grid-template: 1fr / 17.2rem 46.8rem;
    gap: 0 5.7rem;

    .title {
      margin-bottom: 1.6rem;
      font-weight: 800;
      font-size: 3rem;
      line-height: 3.5rem;
    }
    .catchphrase {
      margin-bottom: 3.2rem;
      font-weight: bold;
      font-size: 2rem;
      line-height: 3.2rem;
    }
    .buttons {
      display: grid;
      grid-template: repeat(3, minmax(4.8rem, 4.8rem)) / 1fr;
      gap: 1.6rem 0;

      .button {
        font-weight: 500;
        font-size: 1.6rem;
        line-height: 2rem;
        border-radius: 1.2rem;
        background-color: black;
        width: 17.2rem;
        height: 4.8rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &--icon {
          margin-right: 1rem;
          width: 2rem;
          height: 2rem;
        }

        &__link {
        }
        &__construction {
          background-color: #363636;
        }
      }
    }

    &--subject {
      margin-right: 1rem;
      font-weight: 800;
      font-size: 1.4rem;
      line-height: 1.6rem;
      margin-bottom: 2rem;
    }
    &--right-border {
      margin-left: 1rem;
    }

    &--description {
      font-size: 1.6rem;
      line-height: 2.8rem;
      max-height: 11rem;
      overflow: hidden;
      margin-bottom: 4rem;
    }

    &--team {
      display: grid;
      grid-template: repeat(auto-fill, 1fr) / 7rem 1fr;
      grid-auto-flow: column;
      justify-content: start;
      gap: 1.4rem 0.8rem;
      &-job {
        font-style: italic;
        font-weight: 500;
        font-size: 1.4rem;
        line-height: 2.8rem;
        text-transform: lowercase;
        width: 7rem;
      }
      &-member {
          font-size: 1.6rem;
          line-height: 2.8rem;
      }
    }
  }
`;

const ForegroundIndicator = styled.div`
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  height: 0;
  width: 100%;
  /* inset: 0; */
  
  .separator {
    width: ${80 - 5.2}rem;
    height: 0;
  }
`;

const ScrollIndicator = styled.image<{disabled: boolean}>`
  width: 5.2rem;
  height: 5.2rem;
  background-color: transparent;
  border-radius: 50%;
  :hover {
    background-color: ${({ disabled }) => (disabled ? 'transparent' : '#222222')};
  }
`;

export default ProjectDialog;