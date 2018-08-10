import React from 'react';
import {
	Badge,
	Card,
	CardImg,
	CardBody,
	CardTitle,
	CardSubtitle,
	CardText,
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter } from 'reactstrap';

export default class ProductView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      nestedModal: false,
      closeAll: false
    };

    this.toggle = this.toggle.bind(this);
    this.toggleNested = this.toggleNested.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  toggleNested() {
    this.setState({
      nestedModal: !this.state.nestedModal,
      closeAll: false
    });
  }

  toggleAll() {
    this.setState({
      nestedModal: !this.state.nestedModal,
      closeAll: true
    });
  }

  render() {
  	const { name, img, desc, offer, categories } = this.props

    return (
    	<div>
    		<Card className='shadowHover' onClick={this.toggle}>
					<CardImg className='cover' top width="100%" src={img} alt="item-img" />
					<CardBody>
						<CardTitle>{name}</CardTitle>
						{
							offer ? <CardSubtitle><Badge pill color='warning'>OFF</Badge></CardSubtitle> : null
						}
						<CardText className='ellipsis'>{desc}</CardText>
					</CardBody>
				</Card>
				
				<Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>
          	<CardImg top width="100%" src={img} alt="item-img" />
          </ModalHeader>
          <ModalBody>
          	<CardTitle>{name}</CardTitle>
						{
							offer ? <CardSubtitle><Badge pill color='warning'>OFF</Badge></CardSubtitle> : null
						}
						<CardText className='ellipsis'>{desc}</CardText>
						{
							Object.keys(categories).length ? Object.keys(categories).map(category => {
								return <Badge color='dark'>{category}</Badge>
							}) : null
						}

            <Modal isOpen={this.state.nestedModal} toggle={this.toggleNested} onClosed={this.state.closeAll ? this.toggle : undefined}>
              <ModalHeader><i className="fa fa-shopping-cart" style={{
  						  color: '#17a2b8',
							    fontSize: '29px'
							}} ></i> Pedido</ModalHeader>
              <ModalBody>Seleccionar cantidad de unidades, asoiar al usuario y esas cosas</ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.toggleNested}>Agregar</Button>{' '}
                <Button color="secondary" onClick={this.toggleAll}>Cancelar todo</Button>
              </ModalFooter>
            </Modal>

          </ModalBody>
          <ModalFooter>
          	<Button size='sm' color='info' onClick={this.toggleNested}>Añadir al pedido</Button>
            <Button size='sm' color="secondary" onClick={this.toggle}>Cerrar</Button>
          </ModalFooter>
        </Modal>
				<br/>
			</div>
    );
  }
}