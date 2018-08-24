import React from 'react';
import List from '../utils/list'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';

class Buscador extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    const { Search, FilteredItems, searchToList } = this.props;

    return (
      <div></div>
    );
  }
}

export default Buscador;
            // <List 
            //  items={items}
            //  change={change}
            //  filter={true}
            //  noItemLabel={'No hay coincidencia'}/>