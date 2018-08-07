import React from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];

export default class CreatableMulti extends React.Component {
  render() {
    return (
      <CreatableSelect
      	value={this.props.value}
        isMulti
        onChange={this.props.handleChange}
        options={options}
      />
    );
  }
}