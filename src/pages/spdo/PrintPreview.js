import Page from 'components/Page';
import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import ReactToPrint from 'react-to-print';
import Axios from 'axios'
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
	FormFeedback,
	TabContent, 
	TabPane,
	Nav, 
	NavItem, 
	NavLink,
	Alert,
	Pagination,
	PaginationItem, 
	PaginationLink,
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
	MdThumbDown,

	
} from 'react-icons/md';

import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';

import PrintDO from 'pages/spdo/PrintDO';
import PrintPackingList from 'pages/spdo/PrintPackingList';
import PrintSP from 'pages/spdo/PrintSP';
import PrintLabelPlastic from 'pages/spdo/PrintLabelPlastic';
import PrintFaktur from 'pages/spdo/PrintFaktur';
import { func } from 'prop-types';
import classnames from 'classnames';
import "react-toggle/style.css";

var BACKEND;

class PrintPreview extends React.Component {

	

	constructor(props) {
		super(props);

		this.state = {
			showPrint: false,
			alamatCabAMS:'',
			apoOutApoteker:'',
			apoOutSIA:'',
			kepada:'',
			kodeOutAMS:'',
			nOPL:'',
			namaCabsAMS:'',
			namaGudang:'',
			namaOut:'',
			ordLclNoPO:'',
			ordLclTglPO:'',
			outAddress:'',
			outCode:'',
			outName:'',
			tHPDistName:'',
			tHPNoPL:'',
			tHPNoPOD:'',
			tHPTglPL:'',
			apj:'',
			apjTujuan:'',
			consup:'',
			finsuptop: 0,
			ijinDari:'',
			ijinTujuan:'',
			namaOutlet:'',
			npwpDari:'',
			npwpTujuan:'',
			outaddressDari:'',
			outaddressTujuan:'',
			outnameDari:'',
			outnameTujuan:'',
			pembuat:'',
			printCount: 0,
			printed:'',
			sika:'',
			sikaTujuan:'',
			supaddress:'',
			telpDari:'',
			telpTujuan:'',
			tglTransf:'',
			totalBerat: 0,
			totalQTY: 0,
			transFD:[],
			transFH:'',
			alamatPajak:'',
			extraDiskon:'',
			namaPajak:'',
			npwpPajak:'',
			paymentMethod:'',
			ppnPajak: 0,
			totalDiskon: 0,
			totalHarga: 0,
			totalPPN: 0,
			activeTab: false,
			activePage : 1,

			listDataTable: [],
			// listDataTable2:[],
			listDataTable2:[],
			activeTab : '1',
			activeTab2 : '1',
			currentPage : 1,
			totalPage : 1,
			flag : 0,


			TextInputValue: '',
		
		}
		BACKEND ='http://10.0.111.129:2442'
	}

	setActiveTab = (tab) => {
		if(this.state.activeTab!==tab){
		this.setState({
			activeTab : tab,
			currentPage : 1,
		})
	}
	}

	setActiveTab2 = (tab) => {
		if(this.state.activeTab2!==tab){
		this.setState({
			activeTab2 : tab
		})
	}
	}


	showrePrintFunction =(index)=>{
		this.getrePrintData(index);
		this.setState({
			showPrint : true
		})
	}

	showPrintFunction = (index) => {
		this.getPrintData(index);
		this.setState({
			showPrint : true
		})
	}

	componentDidMount(){
		 this.getTableData()
		 this.getTable2Data()
	}

	getTableData =() =>{
		var url=BACKEND +"/printApple?get=printPage&page=" + this.state.currentPage + "&length=10"
		Axios.get(url)
			.then(response=>{
				if(response.data.data.content){
					this.setState({
						listDataTable: response.data.data.content,
						totalPage : response.data.data.totalPages
					})
					console.log('Response: ' + JSON.stringify(response.data.data.content));
				}
			})
	}

	getTable2Data =() =>{
		var url=BACKEND +"/printApple?get=reprintPage&page=" + this.state.currentPage + "&length=10"
		Axios.get(url)
			.then(response=>{
				if(response.data.data.content){
					this.setState({
						listDataTable2: response.data.data.content,
						totalPage : response.data.data.totalPages
					})
				}
			})
	}

	getrePrintData = async (index) =>{
		var data = this.state.listDataTable2[index]
		console.log('data2: '+ JSON.stringify(data))
		this.setState({
			alamatCabAMS: data.alamat_cab_ams,
			apoOutApoteker: data.apo_out_apoteker,
			apoOutSIA: data.apo_out_sia,
			kepada: data.kepada,
			kodeOutAMS: data.kode_out_ams,
			nOPL: data.no_pl,
			namaCabsAMS: data.nama_cabs_ams,
			namaGudang: data.nama_gudang,
			namaOut: data.nama_out,
			ordLclNoPO: data.ord_lcl_no_po,
			ordLclTglPO: data.ord_lcl_tgl_po,
			outAddress: data.out_address,
			outCode: data.out_code,
			outName: data.out_name,
			tHPDistName: data.thp_dist_name,
			tHPNoPL: data.thp_no_pl,
			tHPNoPOD: data.thp_no_pod,
			tHPTglPL: data.thp_tgl_pl,
			apj: data.apj,
			apjTujuan: data.apj_tujuan,
			consup: data.consup,
			finsuptop: data.finsup_top,
			ijinDari: data.ijin_dari,
			ijinTujuan: data.ijin_tujuan,
			namaOutlet: data.nama_outlet,
			npwpDari: data.npwp_dari,
			npwpTujuan: data.npwp_tujuan,
			outaddressDari: data.out_address_dari,
			outaddressTujuan: data.out_address_tujuan,
			outnameDari: data.out_name_dari,
			outnameTujuan: data.out_name_tujuan,
			pembuat: data.pembuat,
			printCount: data.print_count,
			printed: data.printed,
			sika: data.sika,
			sikaTujuan: data.sika_tujuan,
			supaddress: data.sup_address,
			telpDari: data.telp_dari,
			telpTujuan: data.telp_tujuan,
			tglTransf: data.tgl_transf,
			totalBerat: data.total_berat,
			totalQTY: data.total_qty,
			transFD: data.trans_fd,
			transFH: data.trans_fh,
			alamatPajak: data.alamat_pajak,
			extraDiskon: data.extra_diskon,
			namaPajak: data.nama_pajak,
			npwpPajak: data.npwp_pajak,
			paymentMethod: data.payment_method,
			ppnPajak: data.ppn_pajak,
			totalDiskon: data.total_diskon,
			totalHarga: data.total_harga,
			totalPPN: data.total_ppn,
		})
}

	getPrintData = async (index) =>{
					var data = this.state.listDataTable[index]
					console.log('data: '+ JSON.stringify(data))
					this.setState({
						alamatCabAMS: data.alamat_cab_ams,
						apoOutApoteker: data.apo_out_apoteker,
						apoOutSIA: data.apo_out_sia,
						kepada: data.kepada,
						kodeOutAMS: data.kode_out_ams,
						nOPL: data.no_pl,
						namaCabsAMS: data.nama_cabs_ams,
						namaGudang: data.nama_gudang,
						namaOut: data.nama_out,
						ordLclNoPO: data.ord_lcl_no_po,
						ordLclTglPO: data.ord_lcl_tgl_po,
						outAddress: data.out_address,
						outCode: data.out_code,
						outName: data.out_name,
						tHPDistName: data.thp_dist_name,
						tHPNoPL: data.thp_no_pl,
						tHPNoPOD: data.thp_no_pod,
						tHPTglPL: data.thp_tgl_pl,
						apj: data.apj,
						apjTujuan: data.apj_tujuan,
						consup: data.consup,
						finsuptop: data.finsup_top,
						ijinDari: data.ijin_dari,
						ijinTujuan: data.ijin_tujuan,
						namaOutlet: data.nama_outlet,
						npwpDari: data.npwp_dari,
						npwpTujuan: data.npwp_tujuan,
						outaddressDari: data.out_address_dari,
						outaddressTujuan: data.out_address_tujuan,
						outnameDari: data.out_name_dari,
						outnameTujuan: data.out_name_tujuan,
						pembuat: data.pembuat,
						printCount: data.print_count,
						printed: data.printed,
						sika: data.sika,
						sikaTujuan: data.sika_tujuan,
						supaddress: data.sup_address,
						telpDari: data.telp_dari,
						telpTujuan: data.telp_tujuan,
						tglTransf: data.tgl_transf,
						totalBerat: data.total_berat,
						totalQTY: data.total_qty,
						transFD: data.trans_fd,
						transFH: data.trans_fh,
						alamatPajak: data.alamat_pajak,
						extraDiskon: data.extra_diskon,
						namaPajak: data.nama_pajak,
						npwpPajak: data.npwp_pajak,
						paymentMethod: data.payment_method,
						ppnPajak: data.ppn_pajak,
						totalDiskon: data.total_diskon,
						totalHarga: data.total_harga,
						totalPPN: data.total_ppn,
					})
			}
			

			openPrintData = (index) =>{
				var user = this.state.users[index];
				this.setState({
					
				})
		
			}

			resetInputData = ()=>{
				this.setState({
					dataDate1 : '',
					dataDate2 : '',
					dataSelect : '0',
					TextInputValue : '',

				})

				
				}

				

				
			
				textInputOnChange = (event) => {
					const value = event.target.value;
					this.setState({
						TextInputValue: value
					})
				}

				dataDateOnChange = (type, event) =>{
					const value = event.target.value;
					this.setState({
						['data' + type] : value
					})
				}

				SearchByDate =()=>{
					var url;

					var date1 = new Date(this.state.dataDate1);
					var date2 = new Date(this.state.dataDate2);

					if (this.state.activeTab=='1') {
						url=BACKEND +"/printApple?get=printByTgl&Start="+this.state.dataDate1+"&End="+this.state.dataDate2
					}
					else {
						url=BACKEND +"/printApple?get=reprintByTgl&Start="+this.state.dataDate1+"&End="+this.state.dataDate2
					}
					console.log(url)

					if(date2.getTime() <= date1.getTime()){
					alert('Tanggal kedua lebih besar dari yang pertama')
					}
					else{
						Axios.get(url)
						.then(response=>{
							var hasData;
	
							if (response.data.data) {
								hasData = true;
							}
							else {
								hasData = false;
							}
	
							if (hasData && this.state.activeTab=='1'){
								this.setState({
									listDataTable : response.data.data
								})
							}
							else if (!hasData && this.state.activeTab=='1') {
								this.setState({
									listDataTable: []
								})
							}
							else if (hasData && this.state.activeTab=='2'){
								this.setState({
									listDataTable2: response.data.data
								})
							}
							else if (!hasData && this.state.activeTab=='2') {
								this.setState({
									listDataTable2: []
								})
							}
					

					})
				}
				}

				SearchByNumber2 =() =>{

					var url;

					if (this.state.activeTab=='1') {
						url=BACKEND +"/printApple?get=printByID&codeID="+this.state.TextInputValue
					}
					else {
						url=BACKEND +"/printApple?get=reprintByID&codeID="+this.state.TextInputValue
					}

					
					Axios.get(url)
					.then(response=>{
						var hasData;

						if (response.data.data) {
							hasData = true;
						}
						else {
							hasData = false;
						}

						if (hasData && this.state.activeTab=='1'){
							this.setState({
								listDataTable : response.data.data
							})
						}
						else if (!hasData && this.state.activeTab=='1') {
							this.setState({
								listDataTable: []
							})
						}
						else if (hasData && this.state.activeTab=='2'){
							this.setState({
								listDataTable2: response.data.data
							})
						}
						else if (!hasData && this.state.activeTab=='2') {
							this.setState({
								listDataTable2: []
							})
						}
					})
			}

			
			
			 PaginationFirst(event) {
				event.preventDefault();
				this.setState({
					currentPage: 1
				}, () => this.getTableData());
			}

			PaginationLast(event) {
				event.preventDefault();
				this.setState({
					currentPage : this.state.totalPage
				}, () => this.getTableData());
			}

			PaginationPrev(event) {
				event.preventDefault();
				var currentPage = this.state.currentPage;
				this.setState({
					currentPage: currentPage - 1 < 1 ? 1 : currentPage - 1
				}, () => this.getTableData());
			}

			PaginationNext(event) {
				event.preventDefault();
				var currentPage = this.state.currentPage;
				var totalPage = this.state.totalPage;
				this.setState({
					currentPage: currentPage + 1 > totalPage ? totalPage : currentPage + 1
				}, () => this.getTableData());
			}

			Pagination2First(event) {
				event.preventDefault();
				this.setState({
					currentPage: 1
				}, () => this.getTable2Data());
			}

			Pagination2Last(event) {
				event.preventDefault();
				this.setState({
					currentPage : this.state.totalPage
				}, () => this.getTable2Data());
			}

			Pagination2Prev(event) {
				event.preventDefault();
				var currentPage = this.state.currentPage;
				this.setState({
					currentPage: currentPage - 1 < 1 ? 1 : currentPage - 1
				}, () => this.getTable2Data());
			}

			Pagination2Next(event) {
				event.preventDefault();
				var currentPage = this.state.currentPage;
				var totalPage = this.state.totalPage;
				this.setState({
					currentPage: currentPage + 1 > totalPage ? totalPage : currentPage + 1
				}, () => this.getTable2Data());
			}

			ResetOnClick(){
				this.resetInputData()
				if(this.state.activeTab==1){
				this.getTableData()
				
			}
			else{
				this.getTable2Data()
				
			}
		}

		ResetOnClick2(){
			this.resetInputData()
			if(this.state.activeTab==1){
				this.getTableData()
				
			}
			else{
				this.getTable2Data()
				
			}
		}
	

	render() {

		return (
			<Page  title="Print Preview"
			breadcrumbs={[{ name: 'Print', active: true }]} >
				<Card>
					<CardHeader>PrintPreview
						</CardHeader>
						<CardBody>
							<Card body>

			<Input type='select' value={this.state.activeTab2} onChange={(event)=>this.setActiveTab2(event.target.value)}>
				<option value='1'>
					Search by Number
				</option>
				<option value='2'>
					Search by Date
				</option>
			</Input>
		<TabContent activeTab={this.state.activeTab2}>
			<TabPane tabId='1'>

				<Row form className='mt-3'>
				<Col md='4'>
						<Label className='font-weight-bold' style={{ 'font-size': '30px' }}>Search By Number</Label>
					</Col>
				</Row>

						<Row form className='mt-3'>
						<Col md='2'>
							<Label>
								Input Nomor PL
							</Label>
						</Col>
							<Col md='3'>
							<Input type='number' value={this.state.TextInputValue} onChange={(event) => this.textInputOnChange(event)}></Input>
							</Col>
							<Col md='3'>
								<Button color='info' onClick ={()=>this.SearchByNumber2()}>Search</Button>
								<Button color='danger' onClick ={()=>this.ResetOnClick2()}>Reset</Button> 
							</Col>
						</Row>
						</TabPane>

						<TabPane tabId='2'>
						<Row form className='mt-3'>
							<Col md='2'>
							<Label className='font-weight-bold' style={{ 'font-size': '30px' }}>Search By Date</Label>
							</Col>
						</Row>
					
					<Row form className='mt-3'>
						<Col md='2'>
						<Label>Tanggal</Label>
						</Col>
						<Col md='3'>
						<Input type='date' value={this.state.dataDate1} onChange={(event) => this.dataDateOnChange('Date1', event)}></Input>
						
						</Col>
						<Col md='auto'>
						-
						
						</Col>
						<Col md='3'>
						<Input type='date' value={this.state.dataDate2} onChange={(event) => this.dataDateOnChange('Date2', event)}></Input>
						
						</Col>
					</Row>
					<Row className='mt-4'>
						<Col className='d-flex justify-content-center'>
						<Button color='info' className='mr-2' onClick ={()=>this.SearchByDate()}>Search</Button>
						<Button color='danger' className='mr-2' onClick ={()=>this.ResetOnClick()}>Reset</Button>

						</Col>
					</Row>
					</TabPane>
					</TabContent>
						</Card>
						
						

						<Form>
					<Row>
						<Col>
						
				<Input type='select' value={this.state.activeTab} onChange={(event)=>this.setActiveTab(event.target.value)} className='mt-4'>
				<option value='1'>
					Print
				</option>
				<option value='2' >
					Re-Print
				</option>
			</Input>
		<TabContent activeTab={this.state.activeTab}>
			<TabPane tabId='1'>
			<Row >
					<Col>
					<Pagination className = 'mt-4'>
						<PaginationItem>
							<PaginationLink first onClick={(event) => this.PaginationFirst(event)}>&lt;&lt;</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink previous onClick={(event) => this.PaginationPrev(event)}>&lt;</PaginationLink>
						</PaginationItem>
						<PaginationItem active>
							<PaginationLink disabled>{this.state.currentPage}</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink next onClick={(event) => this.PaginationNext(event)}>&gt;</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink last onClick={(event) => this.PaginationLast(event)}>&gt;&gt;</PaginationLink>
						</PaginationItem>
					</Pagination>
						<Table hover bordered>
							<thead>
								<tr>
									<th>No</th>
									<th>No PL</th>
									<th>No DO</th>
									<th>Tanggal</th>
									<th>Alamat</th>
								</tr>
							</thead>
							<tbody>
							{
                                    this.state.listDataTable.map((data, index)=>
								<tr onClick={() => this.showPrintFunction(index)} >
									<td>{index+1}</td>
									<td>{data.no_pl}</td>
									<td>{data.trans_fh}</td>
									<td>{data.tgl_transf.substr(0, 10)}</td>
									<td>{data.alamat_cab_ams}</td>
								</tr>
									)
								}
	
							</tbody>
						</Table>
					</Col>
				</Row>
        
			</TabPane>
		

		
        
		
		
			<TabPane tabId='2'>
			<Row >
					<Col>
					<Pagination className = 'mt-4'>
						<PaginationItem>
							<PaginationLink first onClick={(event) => this.Pagination2First(event)}>&lt;&lt;</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink previous onClick={(event) => this.Pagination2Prev(event)}>&lt;</PaginationLink>
						</PaginationItem>
						<PaginationItem active>
							<PaginationLink disabled>{this.state.currentPage}</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink next onClick={(event) => this.Pagination2Next(event)}>&gt;</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink last onClick={(event) => this.Pagination2Last(event)}>&gt;&gt;</PaginationLink>
						</PaginationItem>
					</Pagination>
					
						<Table hover bordered>
							<thead>
								<tr>
									<th>No</th>
									<th>No PL</th>
									<th>No DO</th>
									<th>Tanggal</th>
									<th>Alamat</th>
								</tr>
							</thead>
							<tbody>
							{
                                    this.state.listDataTable2.map((data, index)=>
								<tr onClick={() => this.showrePrintFunction(index)} >
									<td>{index+1}</td>
									<td>{data.no_pl}</td>
									<td>{data.trans_fh}</td>
									<td >{data.tgl_transf.substr(0, 10)}</td>
									<td>{data.alamat_cab_ams}</td>
								</tr>
									)
								}
	
							</tbody>
						</Table>
					</Col>
				</Row>
        
			</TabPane>
		</TabContent>
				
						</Col>
					</Row>
						
				{
					(this.state.showPrint) &&
					<div>

<Row>
								<Col className='d-flex justify-content-center'>
								<ReactToPrint
									trigger={() => <Button color='primary'><MdPrint/>Print PL</Button>}
									content={() => this.printPL} />
								</Col>
								<Col className='d-flex justify-content-center'>
								<ReactToPrint
									trigger={() => <Button color='primary'><MdPrint/>Print SP</Button>}
									content={() => this.printSP} />
								</Col>
								<Col className='d-flex justify-content-center'>
								<ReactToPrint
									trigger={() => <Button color='primary'><MdPrint/>Print DO</Button>}
									content={() => this.printDO} />
								</Col>

								<Col className='d-flex justify-content-center'>
								<ReactToPrint
									trigger={() => <Button color='primary'><MdPrint/>Print Label</Button>}
									content={() => this.printLabel} />
								</Col>
								<Col className='d-flex justify-content-center'>
								<ReactToPrint
									trigger={() => <Button color='primary'><MdPrint/>Print Faktur</Button>}
									content={() => this.printFaktur} />
								</Col>
								</Row>

								<Row>
							<Col className='d-flex justify-content-center , mt-4'>
								<ReactToPrint
									trigger={() => <Button color='success'><MdPrint/>Print All</Button>}
									content={() => this.printRef} />
									
								</Col>
								</Row>
						
						

								
						
						<Row>
							<Col>
								<Print 
									ref={(el) => (this.printRef = el)}
							
									alamatCabAMS={this.state.alamatCabAMS}
									apoOutApoteker={this.state.apoOutApoteker}
									apoOutSIA={this.state.apoOutSIA}
									kepada={this.state.kepada}
									kodeOutAMS={this.state.kodeOutAMS}
									nOPL={this.state.nOPL}
									namaCabsAMS={this.state.namaCabsAMS}
									namaGudang={this.state.namaGudang}
									namaOut={this.state.namaOut}
									ordLclNoPO={this.state.ordLclNoPO}
									ordLclTglPO={this.state.ordLclTglPO}
									outAddress={this.state.outAddress}
									outCode={this.state.outCode}
									outName={this.state.outName}
									tHPDistName={this.state.tHPDistName}
									tHPNoPL={this.state.tHPNoPL}
									tHPNoPOD={this.state.tHPNoPOD}
									tHPTglPL={this.state.tHPTglPL}
									apj={this.state.apj}
									apjTujuan={this.state.apjTujuan}
									consup={this.state.consup}
									finsuptop={this.state.finsuptop}
									ijinDari={this.state.ijinDari}
									ijinTujuan={this.state.ijinTujuan}
									namaOutlet={this.state.namaOutlet}
									npwpDari={this.state.npwpDari}
									npwpTujuan={this.state.npwpTujuan}
									outaddressDari={this.state.outaddressDari}
									outaddressTujuan={this.state.outaddressTujuan}
									outnameDari={this.state.outnameDari}
									outnameTujuan={this.state.outnameTujuan}
									pembuat={this.state.pembuat}
									printCount={this.state.printCount}
									printed={this.state.printed}
									sika={this.state.sika}
									sikaTujuan={this.state.sikaTujuan}
									supaddress={this.state.supaddress}
									telpDari={this.state.telpDari}
									telpTujuan={this.state.telpTujuan}
									tglTransf={this.state.tglTransf}
									totalBerat={this.state.totalBerat}
									totalQTY={this.state.totalQTY}
									transFD={this.state.transFD}
									transFH={this.state.transFH}
									alamatPajak={this.state.alamatPajak}
									extraDiskon={this.state.extraDiskon}
									namaPajak={this.state.namaPajak}
									npwpPajak={this.state.npwpPajak}
									paymentMethod={this.state.paymentMethod}
									ppnPajak={this.state.ppnPajak}
									totalDiskon={this.state.totalDiskon}
									totalHarga={this.state.totalHarga}
									totalPPN={this.state.totalPPN}

									/>
									<PrintPackingList
									className='d-none'
									ref={(el) => (this.printPL = el)}
									currentDate={new Date()}

									noDO={this.state.transFH}
									transFD={this.state.transFD}
									totalBerat={this.state.totalBerat}

									THP_NoPL={this.state.tHPNoPL}
									THP_TglPL={this.state.tHPTglPL}
									THP_NoPOD={this.state.tHPNoPOD}
									Out_Code={this.state.outCode}
									Out_Name={this.state.outName}
									THP_DistName={this.state.tHPDistName} />

									<PrintSP
									className='d-none'
									ref={(el) => (this.printSP = el)}
									OrdLcl_NoPO={this.state.ordLclNoPO}
									OrdLcl_TglPO={this.state.ordLclTglPO}
								
									Kepada={this.state.kepada}
									sup_address={this.state.supaddress}
									consup={this.state.consup}
									finsup_top={this.state.finsuptop}
								
									NamaGudang={this.state.namaGudang}
									OutAddress={this.state.outAddress}
								
									transFD={this.state.transFD}
									
									ApoOut_Apoteker={this.state.apoOutApoteker}
									ApoOut_SIA={this.state.apoOutSIA} />



									<PrintDO
									className='d-none'
									ref={(el) => (this.printDO = el)}
									noDO={this.state.transFH}
									tglDO={this.state.tglTransf}
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
									namaOutlet={this.state.namaOutlet}
									outaddressTujuan={this.state.outaddressTujuan}
									telpTujuan={this.state.telpTujuan}
									ijinTujuan={this.state.ijinTujuan}
									apjTujuan={this.state.apjTujuan}
									sikaTujuan={this.state.sikaTujuan}
									npwpTujuan={this.state.npwpTujuan}
									totalQTY={this.state.totalQTY}
									pembuat={this.state.pembuat} />

									<PrintLabelPlastic
									className='d-none'
									ref={(el) => (this.printLabel = el)}
									KodeOutAMS={this.state.kodeOutAMS}
									NamaOut={this.state.namaOut}
									NamaCabsAMS={this.state.namaCabsAMS}
									AlamatCabAMS={this.state.alamatCabAMS}
									NOPL={this.state.nOPL} />

									<PrintFaktur 
									className='d-none'
									ref={(el) => (this.printFaktur = el)}
									/>

							</Col>
						</Row>

						
					</div>
					
				}
				</Form>

						</CardBody>
						
						</Card>
				
			</Page>
		)
	}
}

class Print extends React.Component {

	render() {

		const alamatCabAMS = this.props.alamatCabAMS
		const apoOutApoteker = this.props.apoOutApoteker
		const apoOutSIA = this.props.apoOutSIA
		const kepada = this.props.kepada
		const kodeOutAMS = this.props.kodeOutAMS
		const nOPL = this.props.nOPL
		const namaCabsAMS = this.props.namaCabsAMS
		const namaGudang = this.props.namaGudang
		const namaOut = this.props.namaOut
		const ordLclNoPO = this.props.ordLclNoPO
		const ordLclTglPO = this.props.ordLclTglPO
		const outAddress = this.props.outAddress
		const outCode = this.props.outCode
		const outName = this.props.outName
		const tHPDistName = this.props.tHPDistName
		const tHPNoPL = this.props.tHPNoPL
		const tHPNoPOD = this.props.tHPNoPOD
		const tHPTglPL = this.props.tHPTglPL
		const apj = this.props.apj
		const apjTujuan = this.props.apjTujuan
		const consup = this.props.consup
		const finsuptop = this.props.finsuptop
		const ijinDari = this.props.ijinDari
		const ijinTujuan = this.props.ijinTujuan
		const namaOutlet = this.props.namaOutlet
		const npwpDari = this.props.npwpDari
		const npwpTujuan = this.props.npwpTujuan
		const outaddressDari = this.props.outaddressDari
		const outaddressTujuan = this.props.outaddressTujuan
		const outnameDari = this.props.outnameDari
		const outnameTujuan = this.props.outnameTujuan
		const pembuat = this.props.pembuat
		const printCount = this.props.printCount
		const printed = this.props.printed
		const sika = this.props.sika
		const sikaTujuan = this.props.sikaTujuan
		const supaddress = this.props.supaddress
		const telpDari = this.props.telpDari
		const telpTujuan = this.props.telpTujuan
		const tglTransf = this.props.tglTransf
		const totalBerat = this.props.totalBerat
		const totalQTY = this.props.totalQTY
		const transFD = this.props.transFD
		const transFH = this.props.transFH

		return (
			<div className='m-4'>

				<PrintPackingList
					currentDate={new Date()}

					noDO={transFH}
					transFD={transFD}
					totalBerat={totalBerat}

					THP_NoPL={tHPNoPL}
					THP_TglPL={tHPTglPL}
					THP_NoPOD={tHPNoPOD}
					Out_Code={outCode}
					Out_Name={outName}
					THP_DistName={tHPDistName} />

				<div className='mb-4' />

				<PrintDO
					noDO={transFH}
					tglDO={tglTransf}
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
					OrdLcl_NoPO={ordLclNoPO}
					OrdLcl_TglPO={ordLclTglPO}

					Kepada={kepada}
					sup_address={supaddress}
					consup={consup}
					finsup_top={finsuptop}

					NamaGudang={namaGudang}
					OutAddress={outAddress}

					transFD={transFD}
					
					ApoOut_Apoteker={apoOutApoteker}
					ApoOut_SIA={apoOutSIA} />

				<div className='mb-4' />

				<PrintLabelPlastic
					KodeOutAMS={kodeOutAMS}
					NamaOut={namaOut}
					NamaCabsAMS={namaCabsAMS}
					AlamatCabAMS={alamatCabAMS}
					NOPL={nOPL} />

				<div className='mb-4' />

				<PrintFaktur />
				
			</div>
		)
	}
}

export default PrintPreview;