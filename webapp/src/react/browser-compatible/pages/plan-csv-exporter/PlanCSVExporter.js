import React, { PureComponent } from 'react';
import CompatibleCard from 'compatible/components/card/CompatibleCard';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';

class PlanCSVExporter extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const apiUrl = `${getState().globals.get('apiUrl')}/v1/`;
    const token = getState().auth.get('token');

    fetch(`${apiUrl}csvexporter.plans`, {
      method: 'post',
      body: JSON.stringify({ token }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(res => {
        if (res.ok) {
          return res.blob();
        }
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plans.csv';
        a.click();
      })
      .catch(err => {
        console.log('ERROR', err);
      });
  }
  render() {
    return (
      <CompatibleCard>
        <div className="download-page">
          <CompatibleHeader
            title="Plan exporter"
            subtitle="Exporting your plan data in csv. Please wait..."
          />
        </div>
      </CompatibleCard>
    );
  }
}

export default PlanCSVExporter;
