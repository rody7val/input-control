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
  	const { name, img, desc, offer } = this.props

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
          	<CardImg className='cover' top width="100%" src={img} alt="item-img" />
          </ModalHeader>
          <ModalBody>
          	<CardTitle>{name}</CardTitle>
						{
							offer ? <CardSubtitle><Badge pill color='warning'>OFF</Badge></CardSubtitle> : null
						}
						<CardText className='ellipsis'>{desc}</CardText>

          </ModalBody>
          <ModalFooter>
          	<Button size='sm' color='info'>Añadir al pedido</Button>
            <Button size='sm' color="secondary" onClick={this.toggle}>Cerrar</Button>
          </ModalFooter>
        </Modal>
				<br/>
			</div>
    );
  }
}