import React, { Component,  PropTypes } from 'react'

import DropzoneElement from './DropzoneElement'

// const DropzoneOverlay = ({ hover, title }) => {
//   let className = "tile-dropzone-overlay"
//
//   if(hover){
//     className += " hover"
//   }
//   title = title || "Share"
//   return (
//     <div className={className}>
//       <div className="background" />
//       <div className="center">
//         <h6><span>{title}</span></h6>
//       </div>
//     </div>
//   )
// }

class DropzoneOverlay extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    const { hover, title } = this.props;

    // CODE FOR WHEN MULTIPLE DROPZONES

    // const data = [
    //   {
    //     title: 'share to slack',
    //     hover: true
    //   },
    //   {
    //     title: 'share to someone else',
    //     hover: true
    //   },
    //   {
    //     title: 'share to slack',
    //     hover: true
    //   },
    //   {
    //     title: 'share to someone else',
    //     hover: true
    //   },
    //   {
    //     title: 'share to slack',
    //     hover: true
    //   }
    // ]

    // const element = data.map( (info) => {
    //   return <DropzoneElement data={info} />
    // })

    return (
      <div className="swipes-dropzone">
        <DropzoneElement title={title} />
      </div>
    )
  }
}

export default DropzoneOverlay

DropzoneOverlay.propTypes = {
  title: PropTypes.string.isRequired,
  hover: PropTypes.bool
}
