import React, { Component, PropTypes } from 'react'
import Form, { Textarea, Scheduler } from '../../form'
import moment from 'moment'

const times = [
  moment('2016-10-30 09:30').toDate(),
  moment('2016-10-30 11:30').toDate(),
  moment('2016-10-31 09:00').toDate(),
  moment('2016-10-31 11:00').toDate()
]
const props = {
  fields: [
    { type: 'Textarea', header: { icon: 'ListIcon', title: 'Purpose of meeting', description: 'Why should we have this meeting? What is the expected outcomes' }, options: { placeholder: 'What should be the outcomes?', maxRows: 5, minRows: 1 } },
    { type: 'Scheduler', header: { icon: 'ClockIcon', title: 'Schedule Time', description: 'Select the times you are available for this meeting' }, options: { duration: 60, times } }
  ],
  submit: true,
  onSubmit: (vals) => {
    console.log(vals);
  }
}

class FormStep extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Form {...props}>
      </Form>
    )
  }
}
export default FormStep

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
FormStep.propTypes = {
}
