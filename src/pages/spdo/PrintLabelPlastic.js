import React from 'react';
import Barcode from 'react-barcode';
import {
	Card,
	CardBody,
	CardHeader,
	Col,
	Form,
	Input,
	Label,
	Row,
	Table,
	FormGroup,
} from 'reactstrap';

class PrintLabelPlastic extends React.Component {

	render() {
		return (
			<Card className="m-1 p-4">
				<CardHeader>
					<Row>
						<Col>
							<Label className='mr-3 font-weight-bold'><span className='mr-3'>KODE APOTEK AMS</span>:</Label>
							<Label>{this.props.KodeOutAMS}</Label>
						</Col>
					</Row>
				</CardHeader>
				<CardBody>
					<Row className='mb-2 d-flex justify-content-center'>
						<Barcode format='CODE39' height={50} displayValue={false} value={this.props.KodeOutAMS} />
					</Row>
					<Row className='mb-4 d-flex justify-content-center'>
						<Label className='font-weight-bold'>{this.props.NamaOut}</Label>
					</Row>
					<Row>
						<Col>
							<Label className="w-25 font-weight-bold">CABANG AMS</Label>
							<Label><span className='mr-3 font-weight-bold'> : </span>{this.props.NamaCabsAMS}</Label>
						</Col>
					</Row>

					<Row>
						<Col>
							<Label className="w-25 font-weight-bold">ALAMAT AMS</Label>
							<Label><span className='mr-3 font-weight-bold'> : </span>{this.props.AlamatCabAMS}</Label>
						</Col>
					</Row>
				</CardBody>

				<CardBody>
					<Row>
						<Col>
							<Label className="w-25 font-weight-bold">NOMOR PL</Label>
							<Label><span className='mr-3 font-weight-bold'> : </span>{this.props.NOPL}</Label>
						</Col>
					</Row>
					{
						false &&
						<Row>
							<Col>
								<Label className="w-25 font-weight-bold">CONTAINER</Label>
								<Label><span className='mr-3 font-weight-bold'> : </span>1/10</Label>
							</Col>
						</Row>
					}
				</CardBody>
			</Card>
		);
	}
}

export default PrintLabelPlastic;
