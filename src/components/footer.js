import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import moment from 'moment'
class Footer extends Component {

	render() {
		return (
			<div>
			<footer className='footerTop'>
				<br/>
				<br/>
				<Container>
					<Row>
						<Col md={4} sm={12}>
							<h6 className='footerTitle'>EMPRESA</h6>
							<p>loren ipsum dolor cura cuorum jaquet di poter loren ipsum dolor cura cuorum jaquet di poter</p>
							<p></p>
						</Col>
						<Col md={4} sm={12}>
							<h6 className='footerTitle'>SOCIAL</h6>
							<p>loren ipsum dolor cura cuordolor a cuorum jaquet di poter</p>
							<p></p>
						</Col>
						<Col md={4} sm={12}>
							<h6 className='footerTitle'>CONTACTO</h6>
							<p>loren ipsum dolor cura cuorum</p>
						</Col>
					</Row>
				</Container>
				<br/>
				<br/>
			</footer>
			<footer className='footerBottom text-center'>
				<br/>
				<Container>
					<Row>
						<Col md={12}>
							<p><small>{moment().format('YYYY')} © INSUMAX, Inc. </small></p>
						</Col>
					</Row>
				</Container>
				<br/>
			</footer>
		</div>
		);
	}
}

export default Footer;
					// <Row>
						// <Col md={12}>
							// <p><small>Hecho con <i class="ease hoverRed fa fa-heart"></i> en <a target='blank' rel='noopener noreferrer' className='ease' href='https://www.google.com/maps/place/Chillar, AR'>Chillar</a></small></p>
						// </Col>
					// </Row>