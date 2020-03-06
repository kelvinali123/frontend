import Page from 'components/Page';
import React from 'react';
import Typography from 'components/Typography';
import { MdSearch, MdLoyalty, MdDelete, MdDateRange, MdEdit, MdAdd } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	Col,
	Collapse,
	Row,
	Table,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Input,
	Label,
	Form,
	FormGroup,
	Spinner
} from 'reactstrap';

const BACKEND_HOST_URL = 'http://10.0.111.143';
const BACKEND_HOST_PORT = '4444';
const BACKEND_HOST_PREFIX_DO = 'DO'

var editBatch_qtyMax = 0;

const dummyProduct = {
	transfD_ProCod: '191919',
	transfD_ProDes: 'THIS IS A BUCKET',
	transfD_QtySP: 10,
	transfD_Qty: 10,
	transfD_Qty_Scan: 0
};

class CorrectionDO extends React.Component {
	//special method
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			modal: false,

			//Koreksi
			listKoreksiVisible: true,
			listKoreksi: [],
			koreksiDO: {},

			//Product
			listProductVisible: false,
			listProduct: [dummyProduct],
			listBatchDetail: [],

			//Edit Qty
			modal_editQty: false,
			editQtyIndex: 0,
			editQtyTendangValue: 0,
			editQtyNewValue: 0,

			//Edit Batch
			modal_editBatch: false,
			editBatch_collapseEditIsOpen: false,
			editBatch_collapseAddIsOpen: false,
			editBatch_index: 0,
			editBatch_procod: '',
			editBatch_prodes: '',
			editBatch_ED: '',
			editBatch_noOrder: '',
			editBatch_categoryProduct: '',
			editBatch_batchLama: '',
			editBatch_batchBaru: '',
			editBatch_qtyLama: 0,
			editBatch_qtyBaru: 0,
			editBatch_qtySPNew: '',
			editBatch_qtyDONew: 0,
			validasi: [],

			//Confirm
			modal_confirm: false
		};
	}

	//fungsi notification
	showNotification = currMessage => {
		setTimeout(() => {
			if (!this.notificationSystem) {
				return;
			}
			this.notificationSystem.addNotification({
				title: <MdLoyalty />,
				message: currMessage,
				level: 'info',
			});
		}, 100);
	};

	//fungsi untuk membuka suatu toggle di page tsb
	toggle = modalType => () => {
		if (!modalType) {
			return this.setState({
				modal: !this.state.modal,
			});
		}

		//pembuatan setState disemua function, dimana hanya memanggil nama nya saja ex modal_delete , maka di render hanya panggil delete saja
		this.setState({
			[`modal_${modalType}`]: !this.state[`modal_${modalType}`],
		});
	};

	inputOnChangeNumber(event) {
		const regEx = /[^0-9]/gi;
		const name = event.target.name;
		const value = event.target.value.length > 0 ? parseInt(event.target.value.replace(regEx, "")) : 0;

		this.setState({
			[`${name}Value`]: value
		})
	}

	componentDidMount() { 
		this.getListKoreksi();
	}

	getListKoreksi() {
		this.setState({
			isLoading: true
		});

		var url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/GetDOPending`;
		// console.log(url);

		fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				else {
					// console.log('Response not OK');
					return [];
				}
			})
			.then(data => {
				console.log(JSON.stringify(data));
				this.setState({
					listKoreksi: data,

					isLoading: false
				});
			})
			.catch(error => {
				// console.log('Fetching Koreksi list error');
				this.getListKoreksi();
			})
	}

	getListProduct(index) {
		this.setState({
			isLoading: true,

			listProduct: []
		});

		var url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/GetListProcodPending`;
		console.log(url);

		const koreksiDO = this.state.listKoreksi[index];
		var payload = {
			noSP: koreksiDO['noSP'],
			group: koreksiDO['group'],
			outcode: koreksiDO['outcode'],
			noDO: koreksiDO['noDO'],
			SPID: koreksiDO['SPID']
		}

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			json: true,
			body: JSON.stringify(payload),
		})
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				else {
					console.log('Respose not OK');
					return [];
				}
			})
			.then(data => {
				console.log(JSON.stringify(data.data));
				var listBatchDetail = this.putListProductAsBatchDetail(data.data);
				this.setState({
					listProduct: data.data,
					listBatchDetail: listBatchDetail,
					validasi: data.validasi,

					isLoading: false
				});
			})
			.catch(error => {
				console.log('Fetching Product list error: ' + error.message);
				this.getListProduct(index);
			})
	}

	putListProductAsBatchDetail(listProduct) {
		var listBatchDetail = [];
		listProduct.map(product => {
			var batchDetail = {
				Procod: product['transfD_ProCod'],
				BatchNumber: product['transfD_BatchNumber'],
				Qty: product['transfD_Qty'],
				Qty_Scan: product['transfD_Qty_Scan']
			}
			listBatchDetail.push(batchDetail);
		})
		return listBatchDetail;
	}

	rowTableClickListKoreksi(index) {
		if(this.state.isLoading) {
			return;
		}
		
		const koreksiDO = this.state.listKoreksi[index];

		this.setState({
			listKoreksiVisible: false,
			listProductVisible: true,

			koreksiDO: koreksiDO
		})
		this.getListProduct(index);
	}

	btnClickBack() {
		this.setState({
			listKoreksiVisible: true,
			listProductVisible: false
		})
	}

	btnClickConfirm() {
		this.setState({
			modal_confirm: true
		})
	}

	btnClickConfirmYes() {
		this.confirmKoreksi();
		this.setState({
			modal_confirm: false
		})
	}

	async confirmSPQty() {
		var data = [];

		this.state.listBatchDetail.map(batchDetail => {
			var qty = parseInt(batchDetail['Qty'] + "") - parseInt(batchDetail['Qty_Scan'] + "");
			var product = {
				procod: batchDetail['Procod'],
				qty: qty,
				gudang: '981',
				depo: '787',
				group: 2
			}
			data.push(product);
		})

		var url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/UpdateScanBarcodePending`;
		console.log(`confirmSPQty: ${url}`);

		var koreksiDO = this.state.koreksiDO;
		var payload = {
			data: JSON.stringify(data),
			SPID: koreksiDO['SPID'],
			noSP: koreksiDO['noSP'],
			group: koreksiDO['group'],
			outcode: koreksiDO['outcode'],
			userID: koreksiDO['userID']
		}
		console.log(JSON.stringify(payload));

		fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			json: true,
			body: JSON.stringify(payload),
		})
			.then(response => {
				if (response.ok) {
					this.confirmKoreksi();
				}
			})
			.catch(() => {
				// setTimeout(this.confirmSPQty(), 5000);
			});
	}

	async confirmKoreksi() {
		// var data = [];
		var noDO = this.state.koreksiDO['noDO'];

		// this.state.listBatchDetail.map(batchDetail => {
		// 	var qty = parseInt(batchDetail['Qty'] + "") - parseInt(batchDetail['Qty_Scan'] + "");
		// 	var product = {
		// 		procod: batchDetail['Procod'],
		// 		qty: qty,
		// 		gudang: '981',
		// 		depo: '787',
		// 		group: 2
		// 	}
		// 	data.push(product);
		// })

		var payload = {
			noDO: noDO
		}

		console.log('ConfirmKoreksi: data: ' + JSON.stringify(payload));
		console.log('ConfirmKoreksi: NoDO: ' + noDO);

		var url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/ConfirmDOPending`;

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			json: true,
			body: JSON.stringify(payload),
		})
			.then(() => {
				this.showNotification('Berhasil di-confirm');
			})
	}

	//Edit Qty
	//------------------------------------------------------------
	editQtyModalOpen(index) {
		const product = this.state.listProduct[index];
		this.setState({
			modal_editQty: true,
			editQtyIndex: index,
			editQtyTendangValue: product['transfD_Qty'],
			editQtyNewValue: product['transfD_Qty_Scan']
		});
	}

	editQtySave() {
		const index = this.state.editQtyIndex;
		var listProduct = this.state.listProduct;
		var listBatchDetail = this.state.listBatchDetail;

		listProduct[index]['transfD_Qty_Scan'] = this.state.editQtyNewValue;
		listBatchDetail[index]['Qty_Scan'] = this.state.editQtyNewValue;
		this.setState({
			listProduct: listProduct,
			listBatchDetail: listBatchDetail,
			modal_editQty: false
		});
	}

	inputOnChangeEditQtyNew(event) {
		const regEx = /[^0-9]/gi;
		const index = this.state.editQtyIndex;
		const product = this.state.listProduct[index];
		var value = event.target.value.length > 0 ? parseInt(event.target.value.replace(regEx, "")) : 0;
		value = value > product['transfD_Qty'] ? product['transfD_Qty'] : value;

		this.setState({
			editQtyNewValue: value
		})
	}
	//------------------------------------------------------------

	//Batch
	//------------------------------------------------------------
	editBatchModalOpen(productIndex, procod, prodes, ED, noOrder, categoryProduct, batchLama, qtySP, qtyDO) {
		editBatch_qtyMax = 0;
		var leftoverQtyMax = 0;

		this.state.listProduct.map((product, index) => {
			if (productIndex != index && procod == product.transfD_ProCod) {
				leftoverQtyMax += product.transfD_Qty
			}
		});

		editBatch_qtyMax = this.state.validasi[procod] - leftoverQtyMax;
		console.log(editBatch_qtyMax);

		this.setState({
			editBatch_index: productIndex,
			editBatch_procod: procod,
			editBatch_prodes: prodes,
			editBatch_ED: ED,
			editBatch_noOrder: noOrder,
			editBatch_categoryProduct: categoryProduct,
			editBatch_batchLama: batchLama,
			editBatch_batchBaru: batchLama,
			editBatch_qtyLama: qtySP,
			editBatch_qtyBaru: qtySP,
			editBatch_qtySPNew: batchLama,
			editBatch_qtyDONew: qtyDO,

			modal_editBatch: true,
		});
	}

	editBatchModalClose() {
		this.setState({
			editBatch_collapseEditIsOpen: false,
			editBatch_collapseAddIsOpen: false,
			modal_editBatch: false
		})
	}

	editBatchAddToggle() {
		const editBatch_collapseAddIsOpen = this.state.editBatch_collapseAddIsOpen;
		this.setState({
			editBatch_batchBaru: this.state.editBatch_batchLama,
			editBatch_qtyBaru: this.state.editBatch_qtyLama,

			editBatch_collapseAddIsOpen: !editBatch_collapseAddIsOpen,
			editBatch_collapseEditIsOpen: false
		})
	}

	editBatchEditToggle() {
		const editBatch_collapseEditIsOpen = this.state.editBatch_collapseEditIsOpen;
		this.setState({
			editBatch_batchBaru: this.state.editBatch_batchLama,
			editBatch_qtyBaru: this.state.editBatch_qtyLama,

			editBatch_collapseEditIsOpen: !editBatch_collapseEditIsOpen,
			editBatch_collapseAddIsOpen: false
		})
	}

	handleInputBatchQtySP(event) {
		const regEx = /[^\w\s]/gi;
		const value = event.target.value.replace(regEx, "").toUpperCase();

		this.setState({
			editBatch_qtySPNew: value
		})
	}

	handleInputBatchQtyDO(event) {
		const regEx = /[^0-9]/gi;
		const value = event.target.value.replace(regEx, "");

		this.setState({
			editBatch_qtyDONew: value
		})
	}

	handleInputBatchNewOnChange(event) {
		const regEx = /[^\w\s]/gi;
		const value = event.target.value.replace(regEx, "").toUpperCase();

		this.setState({
			editBatch_batchBaru: value
		})
	}

	handleInputBatchQuantityOnChange(event) {
		const regEx = /[^0-9]/gi;
		const eventValue = event.target.value;
		var value = parseInt(eventValue.replace(regEx, ""));

		if (value > editBatch_qtyMax) {
			console.log('MAXED');
		}

		value = value > editBatch_qtyMax && this.state.editBatch_collapseEditIsOpen ? editBatch_qtyMax : value

		this.setState({
			editBatch_qtyBaru: value
		})
	}

	editBatchSaveButtonClick() {
		this.editBatchSave();
		this.setState({
			editBatch_collapseAddIsOpen: false,
			editBatch_collapseEditIsOpen: false,
			modal_editBatch: false,
		});
	}

	async editBatchSave() {

		this.setState({
			isLoading: true
		})

		var url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/UpdateBatch`
		console.log(url);

		var qtyIsBigger = 0;
		if (this.state.editBatch_qtyBaru > this.state.editBatch_qtyLama) {
			qtyIsBigger = 1;
		}
		else {
			qtyIsBigger = -1
		}

		var koreksiDO = this.state.koreksiDO;
		var payload = {
			noSP: koreksiDO['noSP'],
			procod: this.state.editBatch_procod,
			batchBaru: this.state.editBatch_batchBaru,
			batchLama: this.state.editBatch_batchLama,
			outcode: koreksiDO['outcode'],
			outcodeGudang: koreksiDO['outcodeDari'],
			group: koreksiDO['outcodeDari'],
			qtyBaru: this.state.editBatch_qtyBaru,
			qtyLama: this.state.editBatch_qtyLama,
			userID: koreksiDO['userID'],
			qtyIsBigger: qtyIsBigger
		}

		fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			json: true,
			body: JSON.stringify(payload),
		})
			.then(() => {
				this.showNotification('Batch berhasil di-edit');
				this.setState({
					isLoading: false
				});
			})
	}

	editBatchAddButtonClick() {
		this.editBatchAdd();
		this.setState({
			editBatch_collapseAddIsOpen: false,
			editBatch_collapseEditIsOpen: false,
			modal_editBatch: false,
		});
	}

	async editBatchAdd() {

		this.setState({
			isLoading: true
		})

		var url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/TambahBatchProcodPending`
		console.log(url);

		var koreksiDO = this.state.koreksiDO;
		// var payload = {
		// 	outcodeTransf: koreksiDO['outcodeDari'],
		// 	noTransf: koreksiDO['noDO'],
		// 	group: koreksiDO['group'],
		// 	outcodeSP: koreksiDO['outcode'],
		// 	noSP: koreksiDO['noSP'],
		// 	procod: this.state.editBatch_procod,
		// 	batchNumber: this.state.editBatch_qtySPNew,
		// 	ED: this.state.editBatch_ED,
		// 	Qty: this.state.editBatch_qtyDONew,
		// 	Qty_Scan: 0,
		// 	QtyStk: this.state.editBatch_qtyDONew,
		// 	outcodeOrder: koreksiDO['outcode'],
		// 	noOrder: this.state.editBatch_noOrder,
		// 	categoryProduct: this.state.editBatch_categoryProduct,
		// 	userID: koreksiDO['userID'],
		// 	SPID: koreksiDO['SPID'],
		// }
		var payload = {
			outcodeTransf: koreksiDO['outcodeDari'],
			noTransf: koreksiDO['noDO'],
			group: koreksiDO['group'],
			outcodeSP: koreksiDO['outcode'],
			noSP: koreksiDO['noSP'],
			procod: this.state.editBatch_procod,
			batchNumber: this.state.editBatch_batchBaru,
			ED: this.state.editBatch_ED,
			Qty: this.state.editBatch_qtyBaru,
			Qty_Scan: 0,
			QtyStk: this.state.editBatch_qtyBaru,
			outcodeOrder: koreksiDO['outcode'],
			noOrder: this.state.editBatch_noOrder,
			categoryProduct: this.state.editBatch_categoryProduct,
			userID: koreksiDO['userID'],
			SPID: koreksiDO['SPID'],
		}
		console.log(JSON.stringify(payload));

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			json: true,
			body: JSON.stringify(payload),
		})
			.then(() => {
				this.showNotification('Batch berhasil ditambah');
				this.setState({
					isLoading: false
				});
			})
	}
	//------------------------------------------------------------

	render() {
		
		return (
			<Page
				title="Layar Koreksi DO"
				breadcrumbs={[{ name: 'Delivery Order', active: false }, { name: 'Koreksi DO', active: true }]}
				className="Program DO">

				<NotificationSystem
					dismissible={false}
					ref={notificationSystem =>
						(this.notificationSystem = notificationSystem)
					}
					style={NOTIFICATION_SYSTEM_STYLE} />

				{
					(this.state.listKoreksiVisible) &&
					<Card>
						<CardBody>
							<Label className='font-weight-bold'>List DO</Label>
							{
								(this.state.listKoreksi.length > 0) &&
								<Form>
									<Label className='font-weight-bold'>Pilih salah satu</Label>
									<Table
										bordered
										responsive
										hover
										size='sm'>
										<thead >
											<tr align="center">
												<th>No DO</th>
												<th>Outlet</th>
												<th>Tanggal SP</th>
											</tr>
										</thead>
										<tbody>
											{this.state.listKoreksi.map((koreksiDO, index) => (
												<tr
													style={{ cursor: 'pointer' }}
													onClick={() => this.rowTableClickListKoreksi(index)}>
													<td align="center">{koreksiDO['noDO']}</td>
													<td align="center">{koreksiDO['outlet']}</td>
													<td align="center">{koreksiDO['tglSP']}</td>
												</tr>
											))}
										</tbody>
									</Table>
								</Form>
							}
							{
								(this.state.isLoading) &&
								<Row className='d-flex justify-content-center'>
									<Spinner
										style={{ width: '3rem', height: '3rem' }}
										color='primary' />
								</Row>
							}
						</CardBody>
					</Card>
				}
				
				{
					(this.state.listProductVisible) &&
					<Card>
						<CardHeader>
							<Row className='mx-2 mt-2 d-flex justify-content-between align-items-center'>
								<h5 className='font-weight-bold'>{this.state.koreksiDO['noDO']}</h5>
								<Label>{this.state.koreksiDO['tglSP']}</Label>
							</Row>
							<Row className='mx-2 mb-1'>
								<h2 className='font-weight-bold'>{this.state.koreksiDO['outlet']}</h2>
							</Row>
						</CardHeader>

						<CardBody>
							<Label className="font-weight-bold mb-3">LIST PRODUK SP</Label>
							{
								(this.state.listProduct.length > 0) &&
								<Form>
									<Table
										responsive
										bordered
										size='sm'>
										<thead>
											<tr align="center">
												<th>Procode</th>
												<th>Nama Produk</th>
												<th>Qty SP</th>
												<th>Qty DO</th>
												<th></th>
											</tr>
										</thead>
										<tbody>
											{this.state.listProduct.map((product, index) => (
												<tr
													key={index}
													className={
														(
															(product['transfD_Qty_Scan'] == product['transfD_QtySP']) &&
															'table-success'
														)
														||
														(
															(product['transfD_Qty_Scan'] == 0) &&
															'table-danger'
														)
														||
														(
															'table-warning'
														)
													}>
													<td align="center">{product['transfD_ProCod']}</td>
													<td align="center">{product['transfD_ProDes']}</td>
													<td align="center">{product['transfD_QtySP']}</td>
													<td align="center">{product['transfD_Qty_Scan']}</td>
													<td align="center">
														<Button
															size="sm"
															color='warning'
															className='mr-2'
															onClick={() => this.editQtyModalOpen(index)}>
															<MdEdit color='warning' />
														</Button>
														<Button
															size="sm"
															color='info'
															className='ml-2'
															onClick={() =>
																this.editBatchModalOpen(
																	index,
																	product['transfD_ProCod'],
																	product['transfD_ProDes'],
																	product['transfD_ED'],
																	product['transfD_OrderID'],
																	product['transfD_CtgProduct'],
																	product['transfD_BatchNumber'],
																	product['transfD_QtySP'],
																	product['transfD_Qty_Scan']
																)
															}>
															BATCH
														</Button>
													</td>
												</tr>
											))}
										</tbody>
									</Table>
								</Form>
							}
							{
								(this.state.isLoading) &&
								<Row className='d-flex justify-content-center'>
									<Spinner
										style={{ width: '3rem', height: '3rem' }}
										color='primary' />
								</Row>
							}
						</CardBody>

						<CardFooter className='px-5 d-flex justify-content-between'>
							<Button color='danger' onClick={() => this.btnClickBack()}>BACK</Button>
							<Button color='success' onClick={() => this.btnClickConfirm()}>CONFIRM</Button>
						</CardFooter>
					</Card>
				}
				
				<Modal
					isOpen={this.state.modal_editQty}
					className="modal-dialog-centered">
					<ModalHeader toggle={this.toggle('editQty')}>Edit Quantity</ModalHeader>
					<ModalBody>
						<Row className='p-3 d-flex justify-content-between'>
							<Col>
								<Label>Qty Tendang</Label>
								<Input
									readOnly
									className='w-50 text-right'
									value={this.state.editQtyTendangValue} />
							</Col>
							<Col>
								<Label>New Qty</Label>
								<Input
									className='w-50 text-right'
									value={this.state.editQtyNewValue}
									maxLength={6}
									onChange={event => this.inputOnChangeEditQtyNew(event)} />
							</Col>
						</Row>
					</ModalBody>
					<ModalFooter>
						<Button color='danger' onClick={this.toggle('editQty')}>Cancel</Button>
						<Button color='success' onClick={() => this.editQtySave()}>Save</Button>
					</ModalFooter>
				</Modal>

				<Modal
					//Modal batch
					isOpen={this.state.modal_editBatch}
					className="modal-dialog-scrollable modal-dialog-centered"
					size="lg"
					backdrop="static">
					<ModalHeader>Batch</ModalHeader>
					<ModalBody>
						<Row form className="mt-3">
							<Table>
								<thead>
									<tr align='center'>
										<th>PROCOD</th>
										<th>PRODES</th>
										<th>BATCH</th>
										<th>QTY</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr align='center'>
										<td>{this.state.editBatch_procod}</td>
										<td>{this.state.editBatch_prodes}</td>
										<td>{this.state.editBatch_batchLama}</td>
										<td>{this.state.editBatch_qtyLama}</td>
										<td>
											<Button size='sm' className='mr-2' onClick={() => this.editBatchAddToggle()}><MdAdd /> Tambah</Button>
											<Button color='warning' size='sm' className='ml-2' onClick={() => this.editBatchEditToggle()}><MdEdit /> Edit</Button>
										</td>
									</tr>
								</tbody>
							</Table>
						</Row>
					</ModalBody>
					<Collapse isOpen={this.state.editBatch_collapseAddIsOpen}>
						<ModalBody>
							<Form>
								<Row><h5 className='mb-4 w-100 text-center font-weight-bold'>Tambah Batch</h5></Row>
								<Row form className='d-flex justify-content-center'>
									<Col md={3} xs={3} className='mr-3'>
										<FormGroup>
											<Label className='w-100 text-center'>Batch Number:</Label>
											<Input className='text-center' value={this.state.editBatch_batchBaru} onChange={event => this.handleInputBatchNewOnChange(event)} />
										</FormGroup>
									</Col>
									<Col md={2} xs={2} className='ml-3'>
										<FormGroup>
											<Label className='w-100 text-center'>Qty:</Label>
											<Input type='number' className='text-center' value={this.state.editBatch_qtyBaru} onChange={event => this.handleInputBatchQuantityOnChange(event)} />
										</FormGroup>
									</Col>
								</Row>
							</Form>
						</ModalBody>
					</Collapse>
					<Collapse isOpen={this.state.editBatch_collapseEditIsOpen}>
						<ModalBody>
							<Form>
								<Row><h5 className='mb-4 w-100 text-center font-weight-bold'>Edit Batch</h5></Row>
								<Row form className='d-flex justify-content-center'>
									<Label>NEW BATCH:</Label>
								</Row>
								<Row form className='d-flex justify-content-center'>
									<Input className='w-50 text-center' value={this.state.editBatch_batchBaru} onChange={event => this.handleInputBatchNewOnChange(event)} />
								</Row>

								<Row form className='mt-4 d-flex justify-content-center'>
									<Label>QUANTITY:</Label>
								</Row>
								<Row form className='d-flex justify-content-center'>
									<Input type='number' className='w-50 text-center' value={this.state.editBatch_qtyBaru} onChange={event => this.handleInputBatchQuantityOnChange(event)} />
								</Row>
							</Form>
						</ModalBody>
					</Collapse>
					<ModalFooter className={'d-flex justify-content-end'}>
						<Button
							disabled={this.state.isLoading}
							color='danger'
							onClick={() => this.editBatchModalClose()}>
							Cancel
                		</Button>
						{
							this.state.editBatch_collapseAddIsOpen &&
							<Button
								disabled={this.state.isLoading}
								color='success'
								onClick={() => this.editBatchAddButtonClick()}>
								Add
							</Button>
						}
						{
							this.state.editBatch_collapseEditIsOpen &&
							<Button
								disabled={this.state.isLoading}
								color='success'
								onClick={() => this.editBatchSaveButtonClick()}>
								Save
							</Button>
						}
					</ModalFooter>
				</Modal>

				<Modal
					isOpen={this.state.modal_confirm}
					className="modal-dialog-centered">
					<ModalHeader toggle={this.toggle('confirm')}>Confirm</ModalHeader>
					<ModalBody>
						<p>Yakin ingin Confirm?</p>
					</ModalBody>
					<ModalFooter>
						<Button color='danger' onClick={this.toggle('confirm')}>Tidak</Button>
						<Button color='success' onClick={() => this.btnClickConfirmYes()}>Ya</Button>
					</ModalFooter>
				</Modal>

			</Page>
		);
	}
}
export default CorrectionDO;
