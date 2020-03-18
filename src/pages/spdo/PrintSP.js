import React from 'react';
import Barcode from 'react-barcode'
import {
	Card,
	CardBody,
	CardHeader,
	Col,
	Form,
	Label,
	Row,
	Table,
	FormGroup,
} from 'reactstrap';

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

class PrintSP extends React.Component {

	
	render() {
		var tglPO;

		try {
			const tglPOProps = this.props.OrdLcl_TglPO;

			const tglPODate = tglPOProps.substr(8, 2);
			const tglPOMonth = MONTHS[parseInt(tglPOProps.substr(5, 2)) - 1];
			const tglPOYear = tglPOProps.substr(0, 4);

			tglPO = `${tglPODate}-${tglPOMonth}-${tglPOYear}`
		} catch (error) {
			tglPO = '1900-01-01';
		}

		return (
			<Card className="m-1 p-4">
				<CardHeader>
					<Row>
						<h5 className='w-25'>
							- A S L I -
                		</h5>

						<h5 className='font-weight-bold'>
							SURAT PESANAN (SP)
                		</h5>
					</Row>

					<Row className='d-flex justify-content-around align-items-center' >
						<FormGroup row>
							<h3 className='mr-5 font-weight-bold'>NO:</h3>
							<h3 className='font-weight-bold'>{this.props.OrdLcl_NoPO}</h3>
						</FormGroup>
						<FormGroup row>
							<Label className='mr-4 font-weight-bold'>TGL :</Label>
							<Label>{tglPO}</Label>
						</FormGroup>
						<Barcode format='CODE39' height={50} displayValue={false} value={this.props.OrdLcl_NoPO} />
					</Row>
				</CardHeader>

				<CardBody>
					<Row form>
						<Col></Col>
						<Col className='d-flex justify-content-between align-items-center'>
							<Label className='ml-4 font-weight-bold'>Pengiriman Barang Ke:</Label>
							{/* <h1 className='font-weight-bold'>ordlcl_tipe</h1> */}
						</Col>
					</Row>
					<Row form className='d-flex justify-content-between' style={{'height':'225x'}}>
						<Col>
							<Card body outline color='secondary' className='p-3 h-100'>
								<Row form>
									<Col xs={5} md={5}>
										<Label className='w-25 font-weight-bold'>UP</Label>
										<Label><span className='w-25 mr-3 font-weight-bold'>: </span>Kontak</Label>
									</Col>
								</Row>

								<Row form>
									<Col>
										<Label className="font-weight-bold">KEPADA YTH :</Label>
									</Col>
								</Row>

								<Row form>
									<Col>
										<Label className='text-wrap'>{this.props.Kepada}</Label>
									</Col>
								</Row>

								<Row form>
									<Col>
										<Label className='text-wrap'>{this.props.sup_address}</Label>
									</Col>
								</Row>

								<Row form className='d-flex justify-content-between'>
									<Col xs={5} md={5}>
										<Label className="w-25 font-weight-bold">TELP</Label>
										<Label><span className='w-25 mr-3 font-weight-bold'>: </span>{this.props.consup}</Label>
										<Label></Label>
									</Col>
									<Col xs={4} md={4}>
										<Label className="w-25 font-weight-bold">TOP</Label>
										<Label><span className='w-25 mr-3 font-weight-bold'>: </span>{this.props.finsup_top}</Label>
									</Col>
								</Row>

								<Row form>
									<Col xs={5} md={5}>
										<Label className="w-25 font-weight-bold">FAX</Label>
										<Label><span className='w-25 mr-3 font-weight-bold'>: </span></Label>
									</Col>
								</Row>
							</Card>
						</Col>
						<Col>
							<Card body outline color='secondary' className='p-3 h-100'>
								<Label className='text-wrap'>{this.props.NamaGudang}</Label>
								<Label className='text-wrap h-100'>{this.props.OutAddress}</Label>
							</Card>
						</Col>
					</Row>
					<div className='my-5'></div>
					<Table bordered className="mt-3">
						<thead>
							<tr>
								<th className="text-center">NO</th>
								<th>KETERANGAN PRODUK</th>
								<th className="text-center">KUANTITI</th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							{
								this.props.transFD &&
								this.props.transFD.map((transFD, index) =>
									<tr>
										<td className="text-center">{index + 1}</td>
										<td>{transFD.Pro_Name}</td>
										<td className="text-center">{parseFloat(transFD.TransfD_Qty_Scan).toFixed(2)}</td>
										<td className="text-center">{transFD.pack_name}</td>
									</tr>
								)
							}
						</tbody>
					</Table>

					<Card className='my-3'></Card>

					<Row className='d-flex justify-content-around mt-5'>
						<Col>
							<Label className='w-100 text-center font-weight-bold'>Mengetahui</Label>
							<div className='my-5' />
							<Label className='mt-5 w-100 text-center'>(<span style={{'textDecorationLine':'underline'}}> ......................................................................................................... </span>)</Label>
						</Col>

						<Col>
							<Label className='w-100 text-center font-weight-bold'>Pembuat Order</Label>
							<div className='my-5' />
							<Label className='mt-5 w-100 text-center'>(<span style={{ 'textDecorationLine': 'underline' }}> {this.props.ApoOut_Apoteker} </span>)</Label>
							<Label className='w-100 text-center'>Apoteker</Label>
							<Label className='w-100 text-center'><span className='font-weight-bold'>No SIA: </span>{this.props.ApoOut_SIA}</Label>
						</Col>
					</Row>
				</CardBody>
			</Card>
		);
	}
}

export default PrintSP;

