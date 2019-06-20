import React from 'react';
import Sound from 'react-sound';
 
class Alert extends React.Component {
  render() {
    return <Sound url={this.props.url} />; // Check props in next section
  }
}
export default Alert;