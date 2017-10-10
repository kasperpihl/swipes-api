import React, { PureComponent } from 'react';

const SwipesStyles = (EL, styles) => {
  const cN = EL + '-' + Math.random().toString(36).slice(2);
  const newStyles = document.createElement('style');
  const styleObj = `.${cN} ${JSON.stringify(styles).replace(/\"/g, "").replace(/\,/g, ";")}`;

  newStyles.type = 'text/css';
  newStyles.appendChild(document.createTextNode(styleObj))
  let refCounter = 0;

  class StyledElement extends PureComponent {
    componentWillMount() {
      if(refCounter === 0) {
        document.head.appendChild(newStyles);
      }
      refCounter++;
    }
    componentWillUnmount() {
      refCounter--;
      if(refCounter === 0) {
        console.log('removing styles');
        document.head.removeChild(newStyles);
      }
    }
    render() {
      const {
        className,
        ...rest,
      } = this.props;

      return <EL className={`${cN}`} {...rest}>{this.props.children}</EL>;
    }
  }

  return StyledElement;
}

// StyledElement.ref = cN;

export default SwipesStyles;
