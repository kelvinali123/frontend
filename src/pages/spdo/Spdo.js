import Page from 'components/Page';
import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import QRCode from 'qrcode.react';
import Barcode from 'react-barcode'
import ReactToPrint from 'react-to-print';
import Stomp from 'stompjs';
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	CardDeck,
	CardTitle,
	CardText,
	Col,
	Collapse,
	Form,
	FormGroup,
	Input,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	Label,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Row,
	Spinner,
	Table,
	UncontrolledCollapse,
	FormFeedback
} from 'reactstrap';
import {
	MdAdd,
	MdArrowBack,
	MdBorderHorizontal,
	MdClose,
	MdDone,
	MdEdit,
	MdHome,
	MdLocalHospital,
	MdLoyalty,
	MdPrint,
	MdSearch,
	MdStoreMallDirectory,
	MdThumbDown
} from 'react-icons/md';

import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';

import PrintDO from 'pages/spdo/PrintDO';
import PrintPackingList from 'pages/spdo/PrintPackingList';
import PrintSP from 'pages/spdo/PrintSP';
import PrintLabelPlastic from 'pages/spdo/PrintLabelPlastic';
import PrintSHI from 'pages/spdo/PrintSHI';

const BACKEND_HOST_URL = 'http://10.0.111.143';
const BACKEND_HOST_PORT = '4444';
const BACKEND_HOST_PREFIX_DO = 'DO'
var stompClient = null;

const spdoTypes = ['FLOOR', 'APOTIK']

var tableListSPOnPage = false;
var detailSPOnPage = false;

var listProcodToSend = [];
var listProcod = [];
var listBarcode = [];
var editBatch_qtyMax = 0;
var allQtyIsMultiple = [];

var resultDetailDOHasLeftover = false;
var resultDetailDOHasRedLeftover = false;

class Spdo extends React.Component {
	//special method
	constructor(props) {
		super(props);
		this.state = {
			spdoType: 0, // 0 untuk FLOOR, 1 untuk Apotik
			listSP: [],
			listDetailDO: [],
			listBatchDetail: [],

			isLoading: false,
			currentDate: new Date(),

			disabledInputScan: true,

			spdoTypeVisible: true,
			tableListSPVisible: false,
			detailSPVisible: false,

			//Search outlet
			modal_outletSearch: false,
			searchOutletList: [],
			searchOutletByCategories: [],
			searchOutletByCategoryInputValue: 'DANIEL',

			outcodeDari: '',
			outcode: '',
			noSP: '',
			group: '',
			userID: '',
			outlet: '',
			lapakYN: '',
			
			//Detail SP
			SPID: '',
			noDO: '',
			tglDO: '',

			//Edit Product
			modal_editProduct: false,
			editProd_index: 0,
			editProd_procod: '',
			editProd_prodes: '',
			editProd_batch: '',
			editProd_qtyBatch: 0,
			editProd_qtyScan: 0,
			editProd_qtySP: 0,
			editProd_medunit: 0,
			editProd_qtyInputValue: 0,

			//Edit Batch
			modal_editBatch: false,
			validasi: [],
			editBatch_collapseAddIsOpen: false,
			editBatch_collapseEditIsOpen: false,
			editBatch_index: 0,
			editBatch_noDO: '',
			editBatch_outcodeTransf: '',
			editBatch_procod: '',
			editBatch_prodes: '',
			editBatch_ED: '',
			editBatch_noOrder: '',
			editBatch_categoryProduct: '',
			editBatch_batchBaru: '0',
			editBatch_batchLama: '0',
			editBatch_qtyLama: 0,
			editBatch_qtyBaru: 0,
			editBatch_qtySPNew: 0,
			editBatch_qtyDONew: 0,
			editBatch_medunit: 1,
			editBatch_isMedunitMultiplication: true,

			//Scan
			scanInputValue: '',
			scanInputDisabled: true,
			qrVisible: false,
			qrLink: 'default',

			//Confirm Detail SP
			modal_confirmDetailSP: false,

			//Print Preview
			printPreviewVisible: false,
			transFH: {},
			transFD: [],
			outnameDari: '',
			outaddressDari: '',
			telpDari: '',
			izinDari: '',
			apj: '',
			sika: '',
			npwpDari: '',
			outnameTujuan: '',
			namaOutlet: '',
			outaddressTujuan: '',
			sia: '',
			outsipaapa: '',
			apa: '',
			totalQTY:'',

			OrdLcl_TglPO: ''
		};
		this.searchOutletByCategoryInputInnerRef = React.createRef();
		this.editProd_qtyInputRef = React.createRef();
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

	componentDidMount() {
		this.connectWebSocket(this);
		this.getSearchOutletByCategories();
		// this.getProductListToSend();

		// this.getPrintDO();
	}

	handleOnChange(event) {
		const name = event.target.name;
		const value = event.target.value;

		this.setState({
			[name + 'Value']: value
		})
	}

	handleOnChangeInputNoSpecial(event) {
		const name = event.target.name;
		const value = event.target.value;

		this.setState({
			[name + 'Value']: value.replace(/[^\w\s]/gi, '').toUpperCase()
		})
	}

	//Web Socket
	//---------------------------------------------------------
	async connectWebSocket(context) {
		var socket = new WebSocket(`ws://10.0.111.143:4444/scanBarcodeMessage`);
		stompClient = Stomp.over(socket);
		stompClient.connect({},
			function (frame) { // Callback function
				stompClient.subscribe('/deliveryOrder/update', (message) => context.updateDetailSPOnMessage(message));
				stompClient.subscribe('/deliveryOrder/spUpdate', (message) => context.updateSPListOnMessage(message));
				stompClient.subscribe('/deliveryOrder/container', (message) => console.log(message));
			},
			function (error) { // Error function
				setTimeout(() => context.connectWebSocket(context), 5000);
			});
	}

	// Dipanggil ketika ada scan dari apps Android
	async updateDetailSPOnMessage(message) {
		if (message.body) {
			var msg = message.body;
			var splitMsg = msg.split('@');

			var outcode = splitMsg[0];
			var noSP = splitMsg[1];
			var group = splitMsg[2];
			var userID = splitMsg[3];
			var lapakYN = this.state.lapakYN;
			this.getDetailSPRefresh(outcode, noSP, group, userID, lapakYN);
		}
	}               

	// Dipanggil ketika ada colek SP
	async updateSPListOnMessage(message) {
		if (message.body) {
			var outcode = this.state.outcode;
			var userID = this.state.userID;
			this.getSPList(outcode, userID);
		}
	}
	//---------------------------------------------------------

	async getProductListToSend(outcode, noSP, group, userID) {
		var url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/`
		console.log(url);

		var payload = {
			noSP: noSP,
			group: group,
			outcode: outcode,
			userID: userID
		}

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			json: true,
			body: JSON.stringify(payload),
		})
			.then(response => response.json())
			.then(data => {
				listProcodToSend = data;
				this.getProductList();
			})
	}

	async getProductList() {
		var url = `https://10.0.111.212:1998/CHCMasterProduk/Product/Custom?find=barcode&by=procodes`;
		console.log(url);

		var payload = {
			procodes: listProcodToSend
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
				} else {
					console.log('RESPONSE NOT FOUND');
				}
			})
			.then(data => {
				this.putProductList(data.data);
			})
			.catch(error => {
				// setTimeout(() => this.getProductList(), 5000);
			})
	}

	async putProductList(products) {
		listProcod = [];
		listBarcode = [];

		try {
			products.map(product => {
				listProcod.push(product['bar_prodcode'].trim());
				listBarcode.push(product['bar_barcode'].trim());
			});
		} catch (error) {
			listProcod = [];
			listBarcode = [];
		}
	}

	buttonHomeClick() {
		tableListSPOnPage = false;
		detailSPOnPage = false;
		this.setState({
			spdoTypeVisible: true,
			tableListSPVisible: false,
			detailSPVisible: false,

			searchOutletList: []
		})
	}

	//Fungsi di layar pilih SPDO type
	//---------------------------------------------------------
	buttonSpdoTypeClick(event) {
		this.setState({
			spdoType: event.target.value,
			spdoTypeVisible: false
		})
	}
	//---------------------------------------------------------

	//Fungsi di layar search Outlet
	//---------------------------------------------------------
	async getSearchOutletByCategories() {
		this.setState({
			isLoading: true
		});
		var url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/TampilOption`;
		console.log(url);

		fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					console.log('RESPONSE NOT FOUND');
				}
			})
			.then(data => {
				this.setState({
					searchOutletByCategories: data.data,
					searchOutletByCategoryDropdownValue: data.data[0]['CategorySearch'],

					isLoading: false
				});
			})
			.catch(error => {
				setTimeout(() => this.getSearchOutletByCategories(), 5000);
			})
	}

	handleOpenSearchOutletOnClick() {
		const isOpen = this.state.modal_outletSearch;
		this.setState(
			{
				modal_outletSearch: true,
				searchOutletByCategoryInputValue: 'DANIEL',
			}, () => this.searchOutletByCategoryInputInnerRef.current.focus()
		);
	}

	searchOutletByCategory = async () => {
		if (this.state.searchOutletByCategoryInputValue !== null) {
			this.setState({ isLoading: true });
			var url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/TampilHeader/${this.state.spdoType}`;
			var payload = {
				category: this.state.searchOutletByCategoryDropdownValue,
				search: this.state.searchOutletByCategoryInputValue
			};

			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8',
				},
				json: true,
				body: JSON.stringify(payload),
			})
				.then(response => response.json())
				.then(data => {
					this.setState({
						searchOutletList: data,

						isLoading: false
					}, () => console.log(this.state.searchOutletList));
				})
				.catch(error => {
					this.setState({
						isLoading: false
					})
				});
		}
	};

	searchOutletByCategoryInputOnEnter = (event) => {
		var code = event.keyCode || event.which;
		if (code === 13) {
			console.log('MASUK ENTER PRESSED');
			this.searchOutletByCategory();
			this.setState({
				currentPage: 0,
			});
		}
	};

	searchSP(outcode, userID) {
		tableListSPOnPage = true;
		this.setState({
			outcode: outcode,
			userID: userID,
		}, () => this.getSPList(outcode, userID));
	}

	async getSPList(outcode, userID) {
		if (tableListSPOnPage) {
			detailSPOnPage = false;

			this.setState({
				isLoading: true
			});

			const url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/TampilSP/${this.state.spdoType}/page?page=0&size=10`;
			const payload = {
				outcode: outcode,
				userid: userID
			}

			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8',
				},
				json: true,
				body: JSON.stringify(payload),
			})
				.then(response => response.json())
				.then(data => {
					this.setState({
						listSP: data.content,

						tableListSPVisible: true,
						detailSPVisible: false,
						printPreviewVisible: false,
						qrVisible: false,

						modal_outletSearch: false,

						isLoading: false,
					});
					console.log('ListSP: ' + JSON.stringify(data.content));
				});
		}
	};
	//---------------------------------------------------------

	//Fungsi di layar table SP
	//---------------------------------------------------------
	clickRowSPList(SPID, outcodeDari, outcode, noSP, group, userID, outlet, lapakYN) {
		console.log('Lapak: ' + lapakYN)
		this.setState({
			SPID: SPID,
			outcodeDari: outcodeDari,
			outcode: outcode,
			noSP: noSP,
			group: group,
			userID: userID,
			outlet: outlet,
			lapakYN: lapakYN
		});
		// this.getProductListToSend(outcode, noSP, group, userID);
		this.getDetailSPFirst(SPID, outcode, noSP, group, userID, lapakYN)
	}

	async getDetailSPFirst(SPID, outcode, noSP, group, userID, lapakYN) {
		tableListSPOnPage = false;

		this.setState({
			isLoading: true
		});

		var url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/TampilDetailSP`;
		console.log(url);

		var payload = {
			SPID: SPID,
			noSP: noSP,
			group: group,
			outcode: outcode,
			userID: userID,
			lapakYN: lapakYN
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
			.then(response => response.json())
			.then(data => {
				var listBatchDetail = this.putDetailSPAsBatchDetail(data.data);
				this.validateAllQtyIsMultiple(data.data, lapakYN);
				this.setState({
					listDetailDO: data.data,
					listBatchDetail: listBatchDetail,
					validasi: data.validasi,

					tableListSPVisible: false,
					detailSPVisible: true,
					printPreviewVisible: false,

					noDO: '',
					tglDO: '',

					isLoading: false
				}, () => this.detailSPLeftoverCheck());
				detailSPOnPage = true;
				console.log('ListDetailDO: ' + JSON.stringify(data.data));
				console.log('ListDetailDO: ' + JSON.stringify(data.validasi));
			})
			.catch(error => {
				this.showNotification('Terjadi error dengan pesan: ' + error.message);
				this.setState({
					tableListSPVisible: true,
					detailSPVisible: false,
					printPreviewVisible: false,

					isLoading: false
				});

				tableListSPOnPage = true;
				detailSPOnPage = false;
			});
	}

	async getDetailSPRefresh(outcode, noSP, group, userID, lapakYN) {
		if (detailSPOnPage) {
			tableListSPOnPage = false;

			this.setState({
				isLoading: true
			});

			var url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/TampilDetailSPRefresh`;
			console.log(url);

			var payload = {
				SPID: this.state.SPID,
				noSP: noSP,
				group: group,
				outcode: outcode,
				userID: userID,
				lapakYN: lapakYN
			}

			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8',
				},
				json: true,
				body: JSON.stringify(payload),
			})
				.then(response => response.json())
				.then(data => {
					var listBatchDetail = this.putDetailSPAsBatchDetail(data.data);
					this.validateAllQtyIsMultiple(data.data, lapakYN);
					this.setState({
						listDetailDO: data.data,
						listBatchDetail: listBatchDetail,

						tableListSPVisible: false,
						detailSPVisible: true,
						printPreviewVisible: false,

						isLoading: false
					}, () => this.detailSPLeftoverCheck());
					console.log('ListDetailDO: ' + JSON.stringify(this.state.listDetailDO));
				})
				.catch(error => {
					this.showNotification('Terjadi error dengan pesan: ' + error.message);
					this.setState({
						tableListSPVisible: true,
						detailSPVisible: false,
						printPreviewVisible: false,

						isLoading: false
					});

					tableListSPOnPage = true;
					detailSPOnPage = false;
				});
		}
	}

	putDetailSPAsBatchDetail(resultDetail) {
		var listBatchDetail = [];

		resultDetail.map(detail => {
			var batchDetail = {
				procod: detail['transfD_ProCod'],
				batchNumber: detail['transfD_BatchNumber'],
				qty: detail['transfD_Qty'],
				qty_Scan: detail['transfD_Qty_Scan']
			}
			listBatchDetail.push(batchDetail);
		})
		return listBatchDetail;
	}
	//---------------------------------------------------------

	//Fungsi di layar detail SP
	//---------------------------------------------------------
	async detailSPLeftoverCheck() {
		this.state.listDetailDO.map(detailDO => {
			resultDetailDOHasLeftover = false;
			resultDetailDOHasRedLeftover = false;
			var qtySP = detailDO.transfD_QtySP + "";
			qtySP = qtySP.includes("(") ? qtySP.replace(" ", "").substr(0, qtySP.indexOf("(")) : qtySP;
			qtySP = parseInt(qtySP);

			if (detailDO.transfD_Qty_Scan == 0 || detailDO.transfD_Qty_Scan == null) {
				resultDetailDOHasLeftover = true;
				resultDetailDOHasRedLeftover = true;
			}
			else if (detailDO.transfD_Qty_Scan < qtySP) {
				resultDetailDOHasLeftover = true;
			}
		})
	}

	buttonBackDetailSPClick() {
		tableListSPOnPage = true;
		detailSPOnPage = false;
		this.setState({
			tableListSPVisible: true,
			detailSPVisible: false
		})
	}

	buttonConfirmDetailSPClick() {
		//Munculkan alert jika masih ada yang belum di-scan
		this.setState({
			modal_confirmDetailSP: true
		})
	}

	confirmDetailSP() {
		this.showNotification('DO sudah dikirim untuk di-confirm');
		this.confirmSPQty();
		this.setState({
			modal_confirmDetailSP: false,

			detailSPVisible: false
		});
	}

	async confirmSPQty() {
		detailSPOnPage = false;

		var url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/UpdateScanBarcode`;
		console.log(`confirmSPQty: ${url}`);

		var payload = {
			data: JSON.stringify(this.state.listBatchDetail),
			SPID: this.state.SPID,
			noSP: this.state.noSP,
			group: this.state.group,
			outcode: this.state.outcode,
			userID: this.state.userID
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
				if(response.ok) {
					this.confirmCreateDO();
				}
				else {
					// setTimeout(this.confirmSPQty(), 5000);
					detailSPOnPage = true;
				}
			})
			.catch(() => {
				// setTimeout(this.confirmSPQty(), 5000);
				detailSPOnPage = true;
			});
	}

	async confirmCreateDO() {

		const isLapak = this.state.lapakYN == 'Y' ? 1 : 0;

		var url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/BuatDO/${isLapak}`;
		console.log(`BuatDO: ${url}`);

		var payload = {
			SPID: this.state.SPID,
			noSP: this.state.noSP,
			group: this.state.group,
			outcode: this.state.outcode,
			userID: this.state.userID
		};
		console.log(`BuatDO: ${JSON.stringify(payload)}`);

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
					this.showNotification('DO berhasil di-confirm');
					this.onConfirmCreateDOSuccess();
				}
				else {
					// setTimeout(this.confirmCreateDO(), 5000);
				}
			})
			.catch(() => {
				// setTimeout(this.confirmCreateDO(), 5000);
			});
	}

	async onConfirmCreateDOSuccess() {
		if (this.state.lapakYN == 'Y') {
			this.getSPList(this.state.outcode, this.state.userID);
		}
		else {
			this.getPrintDO();
		}
	}

	async getPrintDO() {

		detailSPOnPage = false;
		this.setState({
			isLoading: true,
			printPreviewVisible: true
		});
		
		var url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/PrintDO`;
		console.log(`PrintDO: ${url}`);

		var payload = {
			SPID: this.state.SPID,
			noSP: this.state.noSP,
			group: this.state.group,
			outcodeDari: this.state.outcodeDari,
			outcodeTujuan: this.state.outcode

			// SPID: '202098178721M000001',
			// noSP: '000001',
			// group: '2',
			// outcodeDari: '981',
			// outcodeTujuan: '787'
		};
		console.log(`PrintDO: ${JSON.stringify(payload)}`);

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			json: true,
			body: JSON.stringify(payload),
		})
			.then(response => response.json())
			.then(data => {
				this.setState({
					currentDate: new Date(),

					noDO: data['transFH'],
					tglDO: data['tglTransf'],
					transFH: data['transFH'],
					transFD: data['transFD'],
					totalBerat: data['totalBerat'],

					outnameDari: data['outnameDari'],
					outaddressDari: data['outaddressDari'],
					telpDari: data['telpDari'],
					ijinDari: data['ijinDari'],
					apj: data['apj'],
					sika: data['sika'],
					npwpDari: data['npwpDari'],

					outnameTujuan: data['outnameTujuan'],
					namaOutlet: data['namaOutlet'],
					outaddressTujuan: data['outaddressTujuan'],
					telpTujuan: data['telpTujuan'],
					ijinTujuan: data['ijinTujuan'],
					apjTujuan: data['apjTujuan'],
					sikaTujuan: data['sikaTujuan'],
					npwpTujuan: data['npwpTujuan'],

					totalQTY: data['totalQTY'],

					pembuat: data['pembuat'],

					THP_NoPL: data['THP_NoPL'],
					THP_TglPL: data['THP_TglPL'],
					THP_NoPOD: data['THP_NoPOD'],
					Out_Code: data['Out_Code'],
					Out_Name: data['Out_Name'],
					THP_DistName: data['THP_DistName'],

					OrdLcl_NoPO: data['OrdLcl_NoPO'],
					OrdLcl_TglPO: data['OrdLcl_TglPO'],
					Kepada: data['Kepada'],
					sup_address: data['sup_address'],
					consup: data['consup'],
					finsup_top: data['finsup_top'],
					NamaGudang: data['NamaGudang'],
					OutAddress: data['OutAddress'],

					ApoOut_Apoteker: data['ApoOut_Apoteker'],
					ApoOut_SIA: data['ApoOut_SIA'],

					KodeOutAMS: data['KodeOutAMS'],
					NamaOut: data['NamaOut'],
					NamaCabsAMS: data['NamaCabsAMS'],
					AlamatCabAMS: data['AlamatCabAMS'],
					NOPL: data['NOPL'],

					detailSPVisible: false,
					printPreviewVisible: true,

					modal_confirmDetailSP: false,
					isLoading: false
				}, () => console.log('PrintDO Result: ' + JSON.stringify(data)));
			})
			.catch(error => {
				// setTimeout(this.getPrintDO(), 5000);
				console.log('PrintDO Error: ' + error.message);
			})
	}

	//Edit QTY
	//---------------------------------------------------------
	openEditProductModal(index, procod, prodes, batch, qtyBatch, qtyScan, qtySP) {
		this.setState({
			editProd_index: index,
			editProd_procod: procod,
			editProd_prodes: prodes,
			editProd_batch: batch,
			editProd_qtyBatch: parseInt(qtyBatch),
			editProd_qtyScan: parseInt(qtyScan),
			editProd_qtySP: qtySP,

			editProd_qtyInputValue: parseInt(qtyScan),

			modal_editProduct: true
		}, () => this.editProd_qtyInputRef.current.focus());
	}

	handleEditProductQtyInputOnChange(event) {
		const regEx = /[^0-9]/gi;
		const maxValue = this.state.editProd_qtyBatch;
		const eventValue = event.target.value;
		var value = parseInt(eventValue.replace(regEx, ""));

		value = value > maxValue ? maxValue : value;

		this.setState({
			editProd_qtyInputValue: value
		});
	}

	// Save edit product di Frontend
	saveEditProduct() {
		const index = this.state.editProd_index;
		const value = this.state.editProd_qtyInputValue;
		var listDetailDO = this.state.listDetailDO;
		var listBatchDetail = this.state.listBatchDetail;

		var detailDO = listDetailDO[index];
		detailDO['transfD_Qty_Scan'] = value;
		listDetailDO[index] = detailDO;
		var lapakYN = this.state.lapakYN;
		this.validateAllQtyIsMultiple(listDetailDO, lapakYN);

		var batchDetail = listBatchDetail[index];
		batchDetail['qty_Scan'] = value;
		listBatchDetail[index] = batchDetail;

		this.setState({
			listDetailDO: listDetailDO,
			listBatchDetail: listBatchDetail,

			modal_editProduct: false
		}, () => this.detailSPLeftoverCheck());
	}

	// Save edit product dengan memanggil API Backend
	saveEditProductOld() {
		this.setState({
			isLoading: true
		})

		var url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/UpdateScanLayar`;
		var payload = {
			noSP: this.state.noSP,
			group: this.state.group,
			outcode: this.state.outcode,
			procod: this.state.editProd_procod,
			batch: this.state.editProd_batch,
			userID: this.state.userID,
			qtyScan: this.state.editProd_qtyInputValue
		};

		console.log('Payload: ' + JSON.stringify(payload))

		fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			json: true,
			body: JSON.stringify(payload),
		})
			.then(() => this.setState({
				modal_editProduct: false,
				isLoading: false
			}));
	}
	//---------------------------------------------------------

	clickScan() {
		this.setState({
			disabledInputScan: false
		})
	}

	handleScanOnClick() {
		const scanInputDisabled = this.state.scanInputDisabled;
		const qrVisible = this.state.qrVisible;

		const noSP = this.state.noSP;
		const group = this.state.group;
		const outcode = this.state.outcode;
		const spid = this.state.SPID;

		this.setState({
			scanInputDisabled: !scanInputDisabled,
			qrVisible: !qrVisible,
			qrLink: `https://barcodescanner/scan?noSP=${noSP}&group=${group}&outcode=${outcode}@SPID=${spid}`
		})
	}

	handleScanInputEnter = (event) => {
		var code = event.keyCode || event.which;
		if (code === 13) {
			event.preventDefault();
			this.scanInputValidate();
		}
	}

	scanInputValidate() {
		if (listBarcode.length === 0 || listProcod.length === 0) {
			return;
		}

		const scanInputValue = this.state.scanInputValue;
		if (listBarcode.includes(scanInputValue)) {
			// Munculkan layar konfirmasi "Apakah kode yang di-scan merupakan Barcode (Y/N)"
			// Y => scanInputBarcodeValidate()
			// N => findSatuanProduct()
			this.scanInputBarcodeValidate();
		}
		else {
			this.findSatuanProduct(scanInputValue);
		}
	}

	scanInputBarcodeValidate() {
		const scanInputValue = this.state.scanInputValue;
		const leftInputValue = scanInputValue.substr(0, 2);
		const leftInputValid = leftInputValue == '00' || leftInputValue == '99';

		// Foxpro
		if (scanInputValue.length === 6 || (scanInputValue.length === 8 && leftInputValid)) {
			this.findSatuanProduct(scanInputValue);
		}
		// Apakah input adalah procod di list SP
		else if (scanInputValue.length === 7 || (scanInputValue.length === 9 && leftInputValid)) {
			this.findSatuanProduct(scanInputValue);
		}
		// Apakah input ada dalam list SP
		else {
			// Cari input == Barcode
			// Jk tdk ketemu, cari ulang di list prodBarcode
			// 		Jk ketemu, munculkan pesan "Procod tdk terdpt pada SP"
			// 		Jk tdk ketemu, munculkan pesan "Kode inputan tdk ada dalam Master Barcode, ulangi Scan!"

			const index = listBarcode.indexOf(scanInputValue);
			if (index >= 0) {
				if (!this.findSatuanProduct(listProcod[index])) {
					alert('Procod tdk terdpt pada SP');
				}
			}
			else {
				alert('Kode inputan tdk ada dalam Master Barcode, ulangi Scan!');
			}
		}
	}

	findSatuanProduct(value) {
		var boolResult = false;
		var editProd_index = 0;
		var editProd_qtyInputValue = 0;

		var editProd_procod = '';
		var editProd_batch = '';

		var qtyScan = 0;
		var qtySP = 0;

		boolResult = this.state.listDetailDO.some((detailDO, index) => {
			editProd_index = index;
			editProd_qtyInputValue = detailDO.transfD_Qty_Scan;

			editProd_procod = detailDO.transfD_ProCod;
			editProd_batch = detailDO.transfD_BatchNumber;

			qtyScan = detailDO.transfD_Qty_Scan;
			qtySP = detailDO.transfD_QtySP;

			return detailDO.transfD_ProCod === value && qtyScan != qtySP;
		})

		if (!boolResult) {
			return false;
		}

		this.setState({
			editProd_index: editProd_index,
			editProd_qtyInputValue: editProd_qtyInputValue,

			editProd_procod: editProd_procod,
			editProd_batch: editProd_batch
		}, () => {
			this.addSatuanProduct();
		})

		return boolResult;
	}

	// Tambah product di Frontend
	addSatuanProduct() {
		this.setState({
			editProd_qtyInputValue: parseInt(this.state.editProd_qtyInputValue + "") + 1,
		});
		this.saveEditProduct();
	}

	// Tambah product dengan memanggil API Backend
	addSatuanProductOld() {
		this.setState({
			isLoading: true
		})

		var url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/UpdateScan`;
		var payload = {
			noSP: this.state.noSP,
			group: this.state.group,
			outcode: this.state.outcode,
			procod: this.state.editProd_procod,
			batch: this.state.editProd_batch,
			userID: this.state.userID
		};

		console.log('Payload: ' + JSON.stringify(payload))

		fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			json: true,
			body: JSON.stringify(payload),
		})
			.then(() => this.setState({
				isLoading: false
			}));
	}
	//---------------------------------------------------------

	// Edit Batch
	//---------------------------------------------------------
	openEditBatchModal(productIndex, noDO, outcodeTransf, procod, prodes, batchLama, qtySP, ED, noOrder, categoryProduct, medunit) {
		editBatch_qtyMax = 0;
		var leftoverQtyMax = 0;

		this.state.listDetailDO.map((detailDO, index) => {
			if (productIndex != index && procod == detailDO.transfD_ProCod) {
				leftoverQtyMax += detailDO.transfD_Qty
			}
		});

		editBatch_qtyMax = this.state.validasi[procod] - leftoverQtyMax;
		editBatch_qtyMax = editBatch_qtyMax != 0 ? editBatch_qtyMax - 1 : editBatch_qtyMax;
		console.log('qtyMax' + editBatch_qtyMax);
		console.log('MedUnit: ' + medunit);

		this.setState({
			editBatch_index: productIndex,
			editBatch_noDO: noDO,
			editBatch_outcodeTransf: outcodeTransf,
			editBatch_procod: procod,
			editBatch_prodes: prodes,
			editBatch_batchLama: batchLama,
			editBatch_batchBaru: batchLama,
			editBatch_qtyLama: qtySP,
			editBatch_qtyBaru: 0,
			editBatch_ED: ED,
			editBatch_noOrder: noOrder,
			editBatch_categoryProduct: categoryProduct,
			editBatch_medunit: medunit,
			editBatch_isMedunitMultiplication: true,

			modal_editBatch: true,
		});
	}

	closeEditBatchModal() {
		this.setState({
			editBatch_collapseAddIsOpen: false,
			editBatch_collapseEditIsOpen: false,
			modal_editBatch: false
		})
	}

	editBatchAddToggle() {
		const editBatch_collapseAddIsOpen = this.state.editBatch_collapseAddIsOpen;
		this.setState({
			editBatch_batchBaru: this.state.editBatch_batchLama,
			editBatch_qtyBaru: 0,

			editBatch_collapseAddIsOpen: !editBatch_collapseAddIsOpen,
			editBatch_collapseEditIsOpen: false
		})
	}

	editBatchEditToggle() {
		const editBatch_collapseEditIsOpen = this.state.editBatch_collapseEditIsOpen;
		this.setState({
			editBatch_batchBaru: this.state.editBatch_batchLama,
			editBatch_qtyBaru: 0,

			editBatch_collapseEditIsOpen: !editBatch_collapseEditIsOpen,
			editBatch_collapseAddIsOpen: false
		})
	}

	handleInputBatchQtySP(event) {
		const regEx = /[^0-9]/gi;
		const value = event.target.value.replace(regEx, "");

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
		var medunit = this.state.editBatch_medunit;
		var isMedunitMultiplication = true;

		if (value > editBatch_qtyMax) {
			console.log('MAXED');
		}

		value = value > editBatch_qtyMax ? editBatch_qtyMax : value
		isMedunitMultiplication = value % medunit == 0 && this.state.lapakYN == 'N';
		console.log('Multiplication: ' + isMedunitMultiplication);

		this.setState({
			editBatch_qtyBaru: value,
			editBatch_isMedunitMultiplication: isMedunitMultiplication
		})
	}

	editBatchSaveButtonClick() {
		this.editBatchSave();
		this.setState({
			modal_editBatch: false
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

		var payload = {
			noSP: this.state.noSP,
			procod: this.state.editBatch_procod,
			batchBaru: this.state.editBatch_batchBaru,
			batchLama: this.state.editBatch_batchLama,
			outcode: this.state.outcode,
			outcodeGudang: this.state.outcodeDari,
			group: this.state.group,
			qtyBaru: this.state.editBatch_qtyBaru,
			qtyLama: this.state.editBatch_qtyLama,
			userID: this.state.userID,
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

		var url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/TambahBatchProcod`
		console.log(url);

		var qtyLama = this.state.editBatch_qtyLama.includes('(') ? this.state.editBatch_qtyLama.substr(0, this.state.editBatch_qtyLama.indexOf('(')).replace(' ', '') : this.state.editBatch_qtyLama;
		var payload = {
			noTransf: this.state.editBatch_noDO,
			outcodeTransf: this.state.editBatch_outcodeTransf,
			group: this.state.group,
			outcodeSP: this.state.outcode,
			noSP: this.state.noSP,
			procod: this.state.editBatch_procod,
			batchNumber: this.state.editBatch_batchBaru,
			ED: this.state.editBatch_ED,
			Qty: this.state.editBatch_qtyBaru,
			Qty_Scan: 0,
			QtyStk: this.state.editBatch_qtyBaru,
			outcodeOrder: this.state.outcode,
			noOrder: this.state.editBatch_noOrder,
			categoryProduct: this.state.editBatch_categoryProduct,
			userID: this.state.userID,
			SPID: this.state.SPID,

			batchLama: this.state.editBatch_batchLama,
			qtyLama: qtyLama,
			qtyTerbaru: parseInt(this.state.editBatch_qtyLama) - parseInt(this.state.editBatch_qtyBaru)
		}
		console.log('EditBatchAdd: ' + JSON.stringify(payload));

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
	//---------------------------------------------------------

	async validateAllQtyIsMultiple(resultDetail, lapakYN) {
		if(lapakYN == 'N') {
			allQtyIsMultiple = [];

			resultDetail.map(detail => {
				var qtyIsMultiple = detail['transfD_Qty_Scan'] % detail['transfD_MedUnit'] == 0;
				allQtyIsMultiple.push(qtyIsMultiple);
			})
		}
	}

	render() {
		return (
			<Page
				title="SP DO"
				breadcrumbs={[{ name: 'SP DO', active: true }]}>
				<Card className="mb-3">
					<NotificationSystem
						dismissible={false}
						ref={notificationSystem =>
							(this.notificationSystem = notificationSystem)
						}
						style={NOTIFICATION_SYSTEM_STYLE} />
					<CardHeader className="d-flex justify-content-between align-items-center">
						<Button disabled={this.state.isLoading || this.state.spdoTypeVisible} onClick={() => this.handleOpenSearchOutletOnClick()}>
							<MdSearch /> Search
						</Button>

						<h4 className='font-weight-bold'>SP DO {!this.state.spdoTypeVisible && spdoTypes[this.state.spdoType]}</h4>
						
						<Button disabled={this.state.isLoading} onClick={() => this.buttonHomeClick()}>
							<MdHome /> MAIN MENU
						</Button>
					</CardHeader>

					<CardBody> 
						{
							//Tampilan Pilih SP DO
							(this.state.spdoTypeVisible) &&
							<div className='d-flex justify-content-center'>
								<CardDeck className='w-50'>
									<Card body outline color="primary" className='text-center'>
										<CardTitle><MdLocalHospital style={{ 'width': '3rem', 'height': '3rem' }} /></CardTitle>
										<CardText>SP DO APOTIK</CardText>
										<Button value='1' onClick={event => this.buttonSpdoTypeClick(event)}>PILIH</Button>
									</Card>
									<Card body outline color="primary" className='text-center'>
										<CardTitle><MdStoreMallDirectory style={{ 'width': '3rem', 'height': '3rem' }} /></CardTitle>
										<CardText>SP DO FLOOR</CardText>
										<Button value='0' onClick={event => this.buttonSpdoTypeClick(event)}>PILIH</Button>
									</Card>
								</CardDeck>
							</div>
						}
						{
							//Hint Search
							(!this.state.spdoTypeVisible) && (!this.state.tableListSPVisible) && (!this.state.detailSPVisible) && (!this.state.printPreviewVisible) &&
							<div className='d-flex justify-content-center'>
								<h2>Silahkan lakukan Search terlebih dahulu</h2>
							</div>
						}
						{
							//Tampilan List SP
							(this.state.tableListSPVisible) &&
							<Form>
								<Table
									// Tabel list SP
									responsive
									hover
									className='mt-3'>
									<thead>
										<tr align="center">
											<th className="th-sm">NO SP</th>
											<th className="th-sm">TUJUAN </th>
											<th className="th-sm">TANGGAL</th>
											<th className="th-sm">PIC</th>
											<th className="th-sm">FLAG</th>
											<th className="th-sm">FLAG HO</th>
										</tr>
									</thead>
									<tbody>
										{
											(!this.state.isLoading) &&
											this.state.listSP.map((spdo, index) => (
												<tr
													key={index}
													style={{ cursor: 'pointer' }}
													tag="button"
													onClick={() =>
														this.clickRowSPList(
															spdo.SPID,
															spdo.outcodeDari,
															spdo.transfH_OutCodeDest,
															spdo.transfH_NoSP,
															spdo.transfH_Group,
															spdo.transfH_UserID,
															spdo.outlet,
															spdo.lapakYN
														)
													}>
													<td align="center">{spdo.transfH_NoSP}</td>
													<td align="center">{spdo.outlet}</td>
													<td align="center">{spdo.tglSP}</td>
													<td align="center">{spdo.pic}</td>
													<td align="center">{spdo.transfH_Flag}</td>
													<td align="center">{spdo.transfH_FlagTrf}</td>
												</tr>
											))
										}
									</tbody>
								</Table>
								{
									(!this.state.isLoading && this.state.listSP.length == 0) &&
									<Row className='d-flex justify-content-center'>
										<Label>Tidak ada data</Label>
									</Row>
								}
								{
									(this.state.isLoading) &&
									<Row className='d-flex justify-content-center'>
										<Spinner
											style={{ width: '3rem', height: '3rem' }}
											color='primary' />
									</Row>
								}

								{
									false &&
									<Row className=' d-flex justify-content-between'>
										<Col md={3}>
											<InputGroup>
												<InputGroupAddon addonType="prepend">
													Data per Halaman
                  							</InputGroupAddon>
												<Input
													type='select'
													name="todosPerPage"
													value={this.state.value}
													onChange={e => this.handleSelect(e)}>
													<option value="5">5</option>
													<option value="10">10</option>
													<option value="20">20</option>
												</Input>
											</InputGroup>
										</Col>

										<Col md={3}>
											<InputGroup>
												<InputGroupAddon addonType='prepend'>
													<Button
														value={this.state.currentPage}
														onClick={e => this.handleFirst(e, -1)}>
														&lt;&lt;
                    							</Button>
												</InputGroupAddon>

												<InputGroupAddon addonType='prepend append'>
													<Button
														value={this.state.currentPage}
														onClick={e => this.handleWrite(e, -1)}>
														&lt;
                    							</Button>
												</InputGroupAddon>

												<Input
													disabled
													className="text-center p-2"
													value={this.state.currentPage + 1} />

												<InputGroupAddon addonType='append prepend'>
													<Button
														value={this.state.currentPage}
														onClick={e => this.handleWrite(e, 1)}>
														&gt;
                    							</Button>
												</InputGroupAddon>

												<InputGroupAddon addonType='append'>
													<Button
														value={this.state.currentPage}
														onClick={e => this.handleLast(e)}>
														&gt;&gt;
                    							</Button>
												</InputGroupAddon>
											</InputGroup>
										</Col>
									</Row>
								}

							</Form>
						}
						{
							//Tampilan Detail SP
							(this.state.detailSPVisible) &&
							<Form>
								<Card
									outline color="primary">
									<Row form className='d-flex justify-content-center mt-4 mb-3'>
										<Col md={4} xs={4}>
											<InputGroup>
												<InputGroupAddon addonType='prepend'>
													<Button id='scanToggler' color='info' onClick={() => this.handleScanOnClick()}><MdBorderHorizontal /> SCAN</Button>
												</InputGroupAddon>
												<Input
													disabled={this.state.isLoading || this.state.scanInputDisabled}
													name='scanInput'
													value={this.state.scanInputValue}
													onKeyPress={event => this.handleScanInputEnter(event)}
													onChange={event => this.handleOnChangeInputNoSpecial(event)} />
											</InputGroup>
										</Col>
									</Row>
									<UncontrolledCollapse toggler='#scanToggler'>
										<Row form className={'justify-content-center mb-3'}>
											<a style={{ display: "table-cell" }} href={this.state.qrLink} target="_blank">
												<QRCode size={200} value={this.state.qrLink} />
											</a>
										</Row>
									</UncontrolledCollapse>
									<Row form className="mt-4 mb-1 d-flex justify-content-center">
										<Col xs={3} md={3}>
											<Label className='font-weight-bold'>NO DO</Label>
											<Input value={this.state.noDO} readOnly />
										</Col>

										<Col xs={3} md={3}>
											<Label className='font-weight-bold'>NO SP</Label>
											<Input value={this.state.noSP} readOnly />
										</Col>

										<Col xs={3} md={3}>
											<Label className='font-weight-bold'>PRINT</Label>
											<Input value={this.state.Flag} readOnly />
										</Col>
									</Row>
									<Row form className="mt-1 mb-3 d-flex justify-content-center">
										<Col xs={3} md={3}>
											<Label className='font-weight-bold'>TGL DO</Label>
											<Input value={this.state.tglDO} readOnly />
										</Col>

										<Col xs={3} md={3}>
											<Label className='font-weight-bold'>OUTLET</Label>
											<Input value={this.state.outlet} readOnly />
										</Col>

										<Col xs={3} md={3}>
											<Label className='font-weight-bold'>KOTA</Label>
											<Input value={this.state.out_name} readOnly />
										</Col>
									</Row>
									<Row className='d-flex justify-content-center mt-4 mb-3'>
										<Button className="mx-3" disabled={this.state.isLoading} color='warning' onClick={() => this.buttonBackDetailSPClick()}><MdArrowBack /> Back</Button>
										<Button className="mx-3" disabled={this.state.isLoading}><MdAdd /> ADD DO</Button>
										{
											(false) &&
											<Button className="mx-3" disabled={this.state.isLoading} color="danger"><MdThumbDown /> TOLAK</Button>
										}
										<Button className="mx-3" disabled={this.state.isLoading || allQtyIsMultiple.includes(false)} color='success' onClick={() => this.buttonConfirmDetailSPClick()}><MdDone /> CONFIRM</Button>
									</Row>
									{
										allQtyIsMultiple.includes(false) &&
										<Row><Label className='mb-3 w-100 text-center text-danger font-weight-bold'>Qty Scan harus kelipatan MEDUNIT</Label></Row>
									}
								</Card>

								<Table //Tabel detail SP
									className='mt-3 table-sm'
									responsive
									id="selectedColumn">
									<thead>
										<tr align="center">
											<th class="th-sm">PROCOD</th>
											<th class="th-sm">PRODES </th>
											<th class="th-sm">BATCH</th>
											<th class="th-sm">QTY BATCH</th>
											<th class="th-sm">QTY SCAN</th>
											<th class="th-sm">SELLPACK</th>
											<th class="th-sm">QTY SP</th>
											<th class="th-sm">EDIT</th>
											<th class="th-sm">QTY +</th>
											<th class="th-sm">Action</th>
										</tr>
									</thead>

									<tbody>
										{this.state.listDetailDO.map((detailDO, index) => (
											<tr
												hover
												className={
													(
														detailDO.transfD_Qty_Scan == parseInt(
															(detailDO.transfD_QtySP + "").includes("(") ?
																(detailDO.transfD_QtySP + "").replace(" ", "").substr(0, (detailDO.transfD_QtySP + "").indexOf("(")) :
																(detailDO.transfD_QtySP + "")) &&
														'table-success'
													)
													||
													(
														(detailDO.transfD_Qty_Scan == 0) &&
														'table-danger'
													)
													||
													(
														'table-warning'
													)
												}
												tag="button">
												<td>
													<Label
														className="d-flex justify-content-center font-weight-bold"
														style={{ color: this.state.colorDetailProcode }}>
														{detailDO.transfD_ProCod}
													</Label>
												</td>
												<td align="center">{detailDO.transfD_ProDes}</td>
												<td align="center">{detailDO.transfD_BatchNumber}</td>
												<td align="center">{detailDO.transfD_Qty}</td>
												<td align="center">{detailDO.transfD_Qty_Scan}</td>
												<td align="center">{detailDO.transfD_SellPack}</td>
												<td align="center">{detailDO.transfD_QtySP}</td>
												<td align="center">{detailDO.transfD_Edit}</td>
												<td align="center">{detailDO.transfD_qtyplus}</td>
												<td align="center">
													{
														(
															(detailDO.transfD_WritingYN == "Y") &&
															<Button
																className=' mx-2'
																disabled={this.state.isLoading}
																size="sm"
																color='warning'
																onClick={() =>
																	this.openEditProductModal(
																		index,
																		detailDO.transfD_ProCod,
																		detailDO.transfD_ProDes,
																		detailDO.transfD_BatchNumber,
																		detailDO.transfD_Qty,
																		detailDO.transfD_Qty_Scan,
																		detailDO.transfD_QtySP,
																	)
																}>
																<MdEdit />
															</Button>
														)
														||
														(
															<Button
																className='mx-2'
																disabled
																color="danger"
																size="sm">
																<MdClose color='#000000' />
															</Button>
														)
													}

													<Button
														disabled={this.state.isLoading}
														color='info'
														size="sm"
														onClick={() =>
															this.openEditBatchModal(
																index,
																detailDO.noDO,
																detailDO.outcodeTransf,
																detailDO.transfD_ProCod,
																detailDO.transfD_ProDes,
																detailDO.transfD_BatchNumber,
																detailDO.transfD_QtySP,
																detailDO.transfD_ED,
																detailDO.transfD_NoOrder,
																detailDO.transfD_CategoryProduct,
																detailDO.transfD_MedUnit
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
							//Print Preview
							(this.state.printPreviewVisible) &&
							<Form>
								<Row className='d-flex justify-content-center'>
									<h2>Data sudah dikirim untuk proses print</h2>
								</Row>
								{
									// false &&
									<div>
										<Row className='d-flex justify-content-center'>
											<ReactToPrint
												trigger={() => <Button disabled={this.state.isLoading}><MdPrint /> PRINT</Button>}
												content={() => this.printPreviewRef}
												onBeforeGetContent={() => this.setState({ isLoading: true })}
												onAfterPrint={() => this.setState({ isLoading: false })} />
										</Row>
										<PrintPreview
											className='m-5'

											ref={el => this.printPreviewRef = el}

											currentDate={this.state.currentDate}

											noDO={this.state.noDO}
											tglDO={this.state.tglDO}
											transFH={this.state.transFH}
											transFD={this.state.transFD}
											totalBerat={this.state.totalBerat}

											outnameDari={this.state.outnameDari}
											outaddressDari={this.state.outaddressDari}
											telpDari={this.state.telpDari}
											ijinDari={this.state.ijinDari}
											apj={this.state.apj}
											sika={this.state.sika}
											npwpDari={this.state.npwpDari}

											outnameTujuan={this.state.outnameTujuan}
											namaOutlet={this.state.namaOutlet}
											outaddressTujuan={this.state.outaddressTujuan}
											telpTujuan={this.state.telpTujuan}
											ijinTujuan={this.state.ijinTujuan}
											apjTujuan={this.state.apjTujuan}
											sikaTujuan={this.state.sikaTujuan}
											npwpTujuan={this.state.npwpTujuan}

											totalQTY={this.state.totalQTY}

											pembuat={this.state.pembuat}

											THP_NoPL={this.state.THP_NoPL}
											THP_TglPL={this.state.THP_TglPL}
											THP_NoPOD={this.state.THP_NoPOD}
											Out_Code={this.state.Out_Code}
											Out_Name={this.state.Out_Name}
											THP_DistName={this.state.THP_DistName}

											OrdLcl_NoPO={this.state.OrdLcl_NoPO}
											OrdLcl_TglPO={this.state.OrdLcl_TglPO}
											Kepada={this.state.Kepada}
											sup_address={this.state.sup_address}
											consup={this.state.consup}
											finsup_top={this.state.finsup_top}
											NamaGudang={this.state.NamaGudang}
											OutAddress={this.state.OutAddress}

											ApoOut_Apoteker={this.state.ApoOut_Apoteker}
											ApoOut_SIA={this.state.ApoOut_SIA}
																			
											KodeOutAMS={this.state.KodeOutAMS}
											NamaOut={this.state.NamaOut}
											NamaCabsAMS={this.state.NamaCabsAMS}
											AlamatCabAMS={this.state.AlamatCabAMS}
											NOPL={this.state.NOPL} />
									</div>
								}
							</Form>
						}
					</CardBody>
				</Card>

				<Modal
					// Modal search outlet
					centered
					isOpen={this.state.modal_outletSearch}
					toggle={this.toggle('outletSearch')}
					className="modal-dialog-scrollable"
					size="lg"
					backdrop="static">
					<ModalHeader>
						Search Outlet
					</ModalHeader>
					<ModalBody>
						<Row form>
							<Label md={3}>Search berdasarkan </Label>
							<Col md={3}>
								<Input
									type='select'
									disabled={this.state.isLoading}
									name='searchOutletByCategoryDropdown'
									value={this.state.searchOutletByCategoryDropdownValue}
									onChange={event => this.handleOnChange(event)}>
									{this.state.searchOutletByCategories.map((category, index) => (
										<option
											key={index}
											name={category.CategoryName}
											value={category.CategorySearch}>
											{category.CategoryName}
										</option>
									))}
								</Input>
							</Col>
						</Row>
						<Row form className='mt-4'>
							<InputGroup >
								<Input
									type="search"
									disabled={this.state.isLoading}
									innerRef={this.searchOutletByCategoryInputInnerRef}
									name="searchOutletByCategoryInput"
									value={this.state.searchOutletByCategoryInputValue}
									placeholder="Ketik keyword yang ingin dicari"
									onKeyPress={event => this.searchOutletByCategoryInputOnEnter(event)}
									onChange={event => this.handleOnChangeInputNoSpecial(event)} />
								<InputGroupAddon addonType="append">
									<Button disabled={this.state.isLoading} onClick={() => this.searchOutletByCategory()}>
										<MdSearch />
									</Button>
								</InputGroupAddon>
							</InputGroup>
						</Row>

						<p className={(this.state.searchOutletList.length > 0 ? '' : 'd-none') + ' text-center font-weight-bold mt-3'}>
							Pilih Salah Satu !
                		</p>

						<Table
							hover
							className={this.state.searchOutletList.length > 0 ? '' : 'd-none'}>
							<thead>
								<tr align="center">
									<th>CODE</th>
									<th>PIC</th>
									<th>OUTLET</th>
								</tr>
							</thead>
							<tbody>
								{this.state.searchOutletList.map((outlist, index) => (
									<tr
										key={index}
										className={(this.state.isLoading ? ' d-none ' : '')}
										style={{ cursor: 'pointer' }}
										tag="button"
										name={outlist.outlet}
										value={outlist.OutcodeDest}
										onClick={() => {
											if (!this.state.isLoading) this.searchSP(outlist.code, outlist.userid)
										}}>
										<td>{outlist.code}</td>
										<td align="center">{outlist.pic}</td>
										<td align="center">{outlist.outlet}</td>
									</tr>
								))}
							</tbody>
						</Table>
						<Row className='d-flex justify-content-center mt-3'>
							<Spinner
								style={{ width: '3rem', height: '3rem' }}
								color='primary'
								className={(this.state.isLoading ? ' ' : ' d-none ')} />
						</Row>
					</ModalBody>
					<ModalFooter>
						<Button
							disabled={this.state.isLoading}
							color='danger'
							onClick={this.toggle('outletSearch')}>
							Cancel
                		</Button>
					</ModalFooter>
				</Modal>

				<Modal
					//Modal edit product
					isOpen={this.state.modal_editProduct}
					// isOpen={true}
					className="modal-dialog-scrollable modal-dialog-centered"
					size='lg'
					backdrop="static">
					<ModalHeader><span className='font-weight-bold'>Edit Product</span></ModalHeader>
					<ModalBody>
						<Form>
							<FormGroup row>
								<Label md={2}>Product</Label>
								<Col>
									<InputGroup>
										<InputGroupAddon addonType='prepend'>
											<InputGroupText>{this.state.editProd_procod}</InputGroupText>
										</InputGroupAddon>
										<Input readOnly value={this.state.editProd_prodes} />
									</InputGroup>
								</Col>
							</FormGroup>
							<FormGroup row>
								<Label md={2}>QTY SP</Label>
								<Col md={3}>
									<Input readOnly value={this.state.editProd_qtySP} />
								</Col>
								<Label className='ml-auto' md={2}>QTY SCAN</Label>
								<Col md={2}>
									<Input
										type='number'
										innerRef={this.editProd_qtyInputRef}
										value={this.state.editProd_qtyInputValue}
										onChange={event => this.handleEditProductQtyInputOnChange(event)} />
								</Col>
							</FormGroup>
						</Form>
					</ModalBody>
					<ModalFooter className='d-flex justify-content-'>
						<Button disabled={this.state.isLoading} color='success' className='mr-4' onClick={() => this.saveEditProduct()}><MdDone /> OK</Button>
						<Button disabled={this.state.isLoading} color='danger' onClick={this.toggle('editProduct')}><MdClose /> Cancel</Button>
					</ModalFooter>
				</Modal>

				<Modal
					//Modal edit batch
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
								{/* <Row form className='d-flex justify-content-center'>
									<Col md={2} xs={2} className='mr-3'>
										<FormGroup>
											<Label className='w-100 text-center'>Qty SP:</Label>
											<Input type='number' className='text-center' value={this.state.editBatch_qtySPNew} onChange={event => this.handleInputBatchQtySP(event)} />
										</FormGroup>
									</Col>
									<Col md={2} xs={2} className='ml-3'>
										<FormGroup>
											<Label className='w-100 text-center'>Qty DO:</Label>
											<Input type='number' className='text-center' value={this.state.editBatch_qtyDONew} onChange={event => this.handleInputBatchQtyDO(event)} />
										</FormGroup>
									</Col>
								</Row> */}
								<Row form className='d-flex justify-content-center'>
									<Label>Batch Number:</Label>
								</Row>
								<Row form className='d-flex justify-content-center'>
									<Input className='w-50 text-center' value={this.state.editBatch_batchBaru} onChange={event => this.handleInputBatchNewOnChange(event)} />
								</Row>

								<Row form className='mt-4 d-flex justify-content-center'>
									<Label>Qty:</Label>
								</Row>
								<Row form className='d-flex justify-content-center'>
									<Input type='number' className='w-50 text-center' value={this.state.editBatch_qtyBaru} onChange={event => this.handleInputBatchQuantityOnChange(event)} />
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
							onClick={this.toggle('editBatch')}>
							Cancel
                		</Button>
						{
							this.state.editBatch_collapseAddIsOpen &&
							<Button
								disabled={this.state.isLoading || this.state.editBatch_qtyBaru == 0 || !this.state.editBatch_isMedunitMultiplication}
								color='success'
								onClick={() => this.editBatchAddButtonClick()}>
								Add
							</Button>
						}
						{
							this.state.editBatch_collapseEditIsOpen &&
							<Button
								disabled={this.state.isLoading || this.state.editBatch_qtyBaru == 0 || !this.state.editBatch_isMedunitMultiplication}
								color='success'
								onClick={() => this.editBatchSaveButtonClick()}>
								Save
							</Button>
						}
					</ModalFooter>
				</Modal>

				<Modal
					//Modal confirmation detail SP confirm
					isOpen={this.state.modal_confirmDetailSP}
					className="modal-dialog-scrollable modal-dialog-centered"
					size='lg'
					backdrop="static">
					<ModalHeader><span className='font-weight-bold'>Confirm</span></ModalHeader>
					<ModalBody>
						{
							(
								((resultDetailDOHasLeftover || resultDetailDOHasRedLeftover) && this.state.lapakYN == 'Y') &&
								<p>DO ini DO K8 hanya bisa di print 1 kali barang yang tidak terlayani tidak bisa dibuat SPLIT DO dan Otomatis Tercancel</p>
							)
							||
							(
								(resultDetailDOHasLeftover) &&
								<p>Ada QTY DO yang tidak sesuai dengan QTY SP</p>
							)
						}
						<p>Anda yakin mau print DO?</p>
						{
							(resultDetailDOHasLeftover) &&
							<Table //Tabel detail SP
								className='mt-3 table-sm'
								responsive
								id="selectedColumn">
								<thead>
									<tr align="center">
										<th class="th-sm">PROCOD</th>
										<th class="th-sm">PRODES </th>
										<th class="th-sm">BATCH</th>
										<th class="th-sm">QTY SCAN</th>
										<th class="th-sm">QTY SP</th>
									</tr>
								</thead>

								<tbody>
									{this.state.listDetailDO.map(detailDO => (
										(detailDO.transfD_Qty_Scan < detailDO.transfD_QtySP) &&
										<tr
											hover
											className={detailDO.transfD_Qty_Scan == 0 ? 'table-danger' : 'table-warning'}
											tag="button">
											<td align="center">
												<Label
													className="font-weight-bold"
													style={{ color: this.state.colorDetailProcode }}>
													{detailDO.transfD_ProCod}
												</Label>
											</td>
											<td align="center">{detailDO.transfD_ProDes}</td>
											<td align="center">{detailDO.transfD_BatchNumber}</td>
											<td align="center">{detailDO.transfD_Qty_Scan}</td>
											<td align="center">{detailDO.transfD_QtySP}</td>
										</tr>
									))}
								</tbody>
							</Table>
						}
					</ModalBody>
					<ModalFooter>
						<Button color='success' disabled={this.state.isLoading || (resultDetailDOHasRedLeftover && this.state.outcode != '787')} onClick={() => this.confirmDetailSP()} ><MdDone /> Ya</Button>
						<Button color='danger' disabled={this.state.isLoading} onClick={this.toggle('confirmDetailSP')}><MdClose /> Tidak</Button>
					</ModalFooter>
				</Modal>

			</Page>
		);
	}
}

class PrintPreview extends React.Component {

	render() {
		const currentDate = this.props.currentDate

		const noDO =  this.props.noDO 
		const tglDO =  this.props.tglDO 
		const transFH =  this.props.transFH 
		const transFD =  this.props.transFD 
		const totalBerat = this.props.totalBerat

		const outnameDari =  this.props.outnameDari 
		const outaddressDari =  this.props.outaddressDari 
		const telpDari =  this.props.telpDari 
		const ijinDari = this.props.ijinDari 
		const apj =  this.props.apj 
		const sika =  this.props.sika 
		const npwpDari =  this.props.npwpDari 

		const outnameTujuan =  this.props.outnameTujuan 
		const namaOutlet = this.props.namaOutlet
		const outaddressTujuan =  this.props.outaddressTujuan 
		const telpTujuan = this.props.telpTujuan 
		const ijinTujuan = this.props.ijinTujuan 
		const apjTujuan = this.props.apjTujuan 
		const sikaTujuan = this.props.sikaTujuan
		const npwpTujuan = this.props.npwpTujuan

		const totalQTY =  this.props.totalQTY

		const pembuat = this.props.pembuat

		const THP_NoPL =  this.props.THP_NoPL 
		const THP_TglPL = this.props.THP_TglPL
		const THP_NoPOD = this.props.THP_NoPOD
		const Out_Code = this.props.Out_Code
		const Out_Name = this.props.Out_Name
		const THP_DistName = this.props.THP_DistName


		const OrdLcl_NoPO = this.props.OrdLcl_NoPO
		const OrdLcl_TglPO = this.props.OrdLcl_TglPO
		const Kepada = this.props.Kepada
		const sup_address = this.props.sup_address
		const consup = this.props.consup
		const finsup_top = this.props.finsup_top
		const NamaGudang = this.props.NamaGudang
		const OutAddress = this.props.OutAddress

		const ApoOut_Apoteker = this.props.ApoOut_Apoteker
		const ApoOut_SIA = this.props.ApoOut_SIA

		const KodeOutAMS = this.props.KodeOutAMS
		const NamaOut = this.props.NamaOut
		const NamaCabsAMS = this.props.NamaCabsAMS
		const AlamatCabAMS = this.props.AlamatCabAMS
		const NOPL = this.props.NOPL

		return (
			<div className='m-4'>
				<PrintPackingList
					currentDate={currentDate}

					noDO={noDO}
					transFD={transFD}
					totalBerat={totalBerat}

					THP_NoPL={THP_NoPL}
					THP_TglPL={THP_TglPL}
					THP_NoPOD={THP_NoPOD}
					Out_Code={Out_Code}
					Out_Name={Out_Name}
					THP_DistName={THP_DistName} />

				<div className='mb-4' />

				<PrintDO
					noDO={noDO}
					tglDO={tglDO}
					transFH={transFH}
					transFD={transFD}
					totalBerat={totalBerat}

					outnameDari={outnameDari}
					outaddressDari={outaddressDari}
					telpDari={telpDari}
					ijinDari={ijinDari}
					apj={apj}
					sika={sika}
					npwpDari={npwpDari}

					namaOutlet={namaOutlet}
					outaddressTujuan={outaddressTujuan}
					telpTujuan={telpTujuan}
					ijinTujuan={ijinTujuan}
					apjTujuan={apjTujuan}
					sikaTujuan={sikaTujuan}
					npwpTujuan={npwpTujuan}
		
					totalQTY={totalQTY}
					
					pembuat={pembuat} />

				<div className='mb-4' />

				<PrintSP
					OrdLcl_NoPO={OrdLcl_NoPO}
					OrdLcl_TglPO={OrdLcl_TglPO}

					Kepada={Kepada}
					sup_address={sup_address}
					consup={consup}
					finsup_top={finsup_top}

					NamaGudang={NamaGudang}
					OutAddress={OutAddress}

					transFD={transFD}
					
					ApoOut_Apoteker={ApoOut_Apoteker}
					ApoOut_SIA={ApoOut_SIA} />

				<div className='mb-4' />

				<PrintLabelPlastic
					KodeOutAMS={KodeOutAMS}
					NamaOut={NamaOut}
					NamaCabsAMS={NamaCabsAMS}
					AlamatCabAMS={AlamatCabAMS}
					NOPL={NOPL} />
				{
					//Ditambahkan nanti setelah ada permintaan dari Gudang
					// <PrintSHI />
				}
			</div>
		)
	}
}

export default Spdo;