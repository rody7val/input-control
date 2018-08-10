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
    const { items, buttonLabel, filter, change, searchToList } = this.props;

    return (
      <div style={{display: 'inline'}}>
        <Button onClick={this.toggle} size='sm' style={{float: 'right'}}>{buttonLabel}</Button>
        <Modal size='lg' isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>
            <Input focus='true' placeholder="Filtrar por nombre" bsSize="lg" onChange={filter}/>
          </ModalHeader>
          <ModalBody>
            <List 
             items={items}
             change={change}
             filter={true}
             noItemLabel={'No hay coincidencia'}/>
          </ModalBody>
          <ModalFooter>
            <Button size='sm' color="secondary" onClick={this.toggle}>Ocultar</Button>
            <Button size='sm' color="primary" onClick={searchToList}>Añadir a la lista</Button>{' '}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Buscador;