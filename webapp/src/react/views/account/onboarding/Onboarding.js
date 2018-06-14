import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import { styleElement, SwissProvider } from 'swiss-react';
import SWView from 'SWView';
import Icon from 'Icon';
import PropTypes from 'prop-types';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import styles from './Onboarding.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const Item = styleElement('div', styles.Item);
const TutorialSection = styleElement('div', styles.TutorialSection);
const Content = styleElement('div', styles.Content);
const Title = styleElement('div', styles.Title);
const Subtitle = styleElement('div', styles.Subtitle);
const TutorialImage = styleElement('img', styles.TutorialImage);
const Indicator = styleElement('div', styles.Indicator);
const Button = styleElement('div', styles.Button);
const Progress = styleElement('div', styles.Progress);
const ProgressNumber = styleElement('div', styles.ProgressNumber);
const Splash = styleElement('div', styles.Splash);
const Checkmark = styleElement(Icon, styles.Checkmark);
const ArrowRight = styleElement(Icon, styles.ArrowRight);
const ProgressBar = styleElement(Icon, styles.ProgressBar);

const CIRCLE_LENGTH = 190;

class Onboarding extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onClick', 'onClickTutorial', 'onClickBlog');
  }
  renderProgressBar() {
    const { items, completedPercentage } = this.props;

    const svgDashOffset = CIRCLE_LENGTH - ((CIRCLE_LENGTH * completedPercentage) / 100);
    return (
      <SwissProvider completed={completedPercentage === 100 ? true : undefined}>
        <Progress>
          <ProgressBar
            icon="Circle"
            strokeDasharray={CIRCLE_LENGTH}
            strokeDashoffset={svgDashOffset}
          />
          <ProgressNumber>{completedPercentage}%</ProgressNumber>
          <Splash>
            <ProgressNumber>{completedPercentage}%</ProgressNumber>
          </Splash>
        </Progress>
      </SwissProvider>
    );
  }

  renderHeader() {
    const title = `Let's get started, ${msgGen.users.getName('me', { disableYou: true })}`;
    return (
      <HOCHeaderTitle
        title={title}
        subtitle="We have added a few easy steps that will set you up for success."
      >
        {this.renderProgressBar()}
      </HOCHeaderTitle>
    );
  }

  renderItems() {
    const { items } = this.props;
    const itemsHTML = items.map((item, i) => {
      return (
        <Item className='item' key={`onboarding-${i}`} onClick={this.onClickCached(i, item)}>
          <Indicator completed={item.get('completed') ? true : undefined}>
            <Checkmark icon="Checkmark" completed={item.get('completed') ? true : undefined} />
          </Indicator>
          <Content>
            <Title>{item.get('title')}</Title>
            <Subtitle >{item.get('subtitle')}</Subtitle>
          </Content>
          <Button>
            <ArrowRight icon="ArrowRightLine"/>
          </Button>
        </Item>
      );
    });

    return (
      <Wrapper>
        {itemsHTML}
        <TutorialSection>
          <div>
            <Title>Watch a full tutorial</Title>
            <Subtitle>Take a deep dive into the Workspace</Subtitle>
            <TutorialImage width='350' src="https://s3.amazonaws.com/cdn.swipesapp.com/swipes_content/onboarding-long-tutorial-video.png" onClick={this.onClickTutorialCached()} />
          </div>
          <div>
            <Title>Go to our blog</Title>
            <Subtitle>Read more about the intent behind our work</Subtitle>
            <TutorialImage width='350' src="https://s3.amazonaws.com/cdn.swipesapp.com/swipes_content/onboarding_go_to_blog.jpg" onClick={this.onClickBlogCached()} />
          </div>
        </TutorialSection>
      </Wrapper>
    );
  }
  render() {
    return (
      <SWView header={this.renderHeader()}>
        {this.renderItems()}
      </SWView>
    );
  }
}

export default Onboarding;

Onboarding.propTypes = {
  completed: PropTypes.bool,
};
