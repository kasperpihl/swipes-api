import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import { SwissProvider } from 'swiss-react';
import SWView from 'SWView';
import PropTypes from 'prop-types';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import SW from './Onboarding.swiss';

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
        <SW.Progress>
          <SW.ProgressBar
            icon="Circle"
            strokeDasharray={CIRCLE_LENGTH}
            strokeDashoffset={svgDashOffset}
          />
          <SW.ProgressNumber>{completedPercentage}%</SW.ProgressNumber>
          <SW.Splash>
            <SW.ProgressNumber>{completedPercentage}%</SW.ProgressNumber>
          </SW.Splash>
        </SW.Progress>
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
        <SW.Item className='item' key={`onboarding-${i}`} onClick={this.onClickCached(i, item)}>
          <SW.Indicator completed={item.get('completed') ? true : undefined}>
            <SW.Checkmark icon="Checkmark" completed={item.get('completed') ? true : undefined} />
          </SW.Indicator>
          <SW.Content>
            <SW.Title>{item.get('title')}</SW.Title>
            <SW.Subtitle >{item.get('subtitle')}</SW.Subtitle>
          </SW.Content>
          <SW.Button>
            <SW.ArrowRight icon="ArrowRightLine"/>
          </SW.Button>
        </SW.Item>
      );
    });

    return (
      <SW.Wrapper>
        {itemsHTML}
        <SW.TutorialSection>
          <div>
            <SW.Title>Watch a full tutorial</SW.Title>
            <SW.Subtitle>Take a deep dive into the Workspace</SW.Subtitle>
            <SW.TutorialImage width='350' src="https://s3.amazonaws.com/cdn.swipesapp.com/swipes_content/onboarding-long-tutorial-video.png" onClick={this.onClickTutorialCached()} />
          </div>
          <div>
            <SW.Title>Go to our blog</SW.Title>
            <SW.Subtitle>Read more about the intent behind our work</SW.Subtitle>
            <SW.TutorialImage width='350' src="https://s3.amazonaws.com/cdn.swipesapp.com/swipes_content/onboarding_go_to_blog.jpg" onClick={this.onClickBlogCached()} />
          </div>
        </SW.TutorialSection>
      </SW.Wrapper>
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
