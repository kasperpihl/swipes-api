import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindAll, setupCachedCallback } from 'classes/utils';
import Button from 'Button';
import Loader from 'components/loaders/Loader';
import SWView from 'SWView';
import Section from 'components/section/Section';
import * as a from 'actions';
import * as Files from './files';
import './preview.scss';

class HOCPreviewModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    this.fetch();
    this.onClickButtonCached = setupCachedCallback(this.onClickButton, this);
    bindAll(this, ['onClose']);
  }
  componentWillUnmount() {
    this._unmounted = true;
  }
  onClickButton(i, e) {
    const { buttons } = this.props.preview;
    const { browser } = this.props;
    const button = buttons[i];
    if (button.url) {
      browser(button.url);
    }
    e.target.blur();
  }
  fetch() {
    const { loadPreview, request } = this.props;
    let endpoint = 'links.preview';
    let params = {
      short_url: loadPreview,
    };
    if (typeof loadPreview === 'object') {
      endpoint = 'find.preview';
      params = loadPreview;
    }
    request(endpoint, params).then((res) => {
      if (this._unmounted) {
        return;
      }
      if (res && res.ok) {
        // this.setState({ loading: false, preview: res.preview });
      } else {
        console.warn('Preview error', res);
      }
    });
  }
  renderError() {
    return (
      <div>Some error happened :(</div>
    );
  }
  renderLoader() {
    return (
      <div className="preview-modal__loader">
        <Loader center text="Loading" textStyle={{ color: '#333D59', marginTop: '9px' }} />
      </div>
    );
  }
  renderHeader() {

  }
  renderRow(row, i) {

  }
  renderSides(sides) {
    return sides.map(([side, obj]) => (
      <div key={side} className={`preview__${side}`}>
        {obj.sections.map((s, sI) => (
          <div key={sI} className="preview__section">
            <Section
              title={s.title}
              progress={s.progress}
            />
            {s.rows.map((r, rI) => (
              <div key={rI} className="preview__row">
                {this.renderRow(r, rI)}
              </div>
            ))}
          </div>
        ))}
      </div>
    ));
  }
  renderFile(file) {
    this._noPreview = false;

    let Comp = Object.entries(Files).find(([k, f]) => {
      if (typeof f.supportContentType !== 'function') {
        console.warn(`Preview file ${k} missing static supportContentType`);
        return null;
      }
      return !!f.supportContentType(file.content_type);
    });

    if (!Comp) {
      this._noPreview = true;
      console.warn(`Unsupported preview file type: ${file.content_type}`);
      return undefined;
    }
    Comp = Comp[1];

    return (
      <div className="preview__file">
        <Comp
          file={file}
          delegate={this}
        />
      </div>
    );
  }
  renderContent() {
    const { loading } = this.state;
    if (loading) {
      return this.renderLoader();
    }
    const { preview } = this.state;
    if (preview.file) {
      return this.renderFile(preview.file);
    }
    if (preview.main) {
      const sides = [['main', preview.main]];
      if (preview.side) {
        sides.push(['side', preview.side]);
      }
      return this.renderSides(sides);
    }
    return this.renderError();
  }

  renderFooter() {
    const { options } = this.props;
    const { preview } = this.state;
    let { buttons } = preview || {};
    const custButtons = (options && options.buttons) || [];

    if (!buttons) {
      buttons = [];
    }

    return (
      <div className="header__actions">
        {buttons.map((b, i) => (
          <Button
            key={i}
            className="header__btn"
            title={b.title}
            icon={b.icon}
            onClick={this.onClickButtonCached(i)}
          />
        ))}
        {custButtons.map((b, i) => (
          <Button
            key={`cust-${i}`}
            title={b.title}
            text={b.title}
            onClick={b.onClick}
            className="header__btn"
          />
        ))}

      </div>
    );
  }
  render() {
    return (
      <div className="preview">
        <SWView
          header={this.renderHeader()}
          footer={this.renderFooter()}
        >
          {this.renderContent()}
        </SWView>
      </div>
    );
  }
}

const { object, func } = PropTypes;

HOCPreviewModal.propTypes = {
  options: object,
  browser: func,
  preview: object,
  loadPreview: func,
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
  request: a.api.request,
  browser: a.main.browser,
})(HOCPreviewModal);
