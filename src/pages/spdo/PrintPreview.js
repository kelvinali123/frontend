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

			listDataTable: [],
			// listDataTable2:[],
			listDataTable2:[],

			TextInputValue: '',
		
		}
		BACKEND ='http://10.0.111.121:4444'
	}

	setActiveTab = (tab) => {
		if(this.state.activeTab!==tab){
		this.setState({
			activeTab : tab
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
		var url=BACKEND +"/printApple?get=printAppleAll"
		Axios.get(url)
			.then(response=>{
				if(response.data.data){
					this.setState({
						listDataTable: response.data.data
					})
					console.log('Response: ' + JSON.stringify(response.data.data));
				}
			})
	}

	getTable2Data =() =>{
		var url=BACKEND +"/printApple?get=printAppleStorageAll"
		Axios.get(url)
			.then(response=>{
				if(response.data.data){
					this.setState({
						listDataTable2: response.data.data
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
				})

				
				}

				
			
				textInputOnChange = (event) => {
					const value = event.target.value;
					this.setState({
						TextInputValue: value
					})
				}

				SearchByNumber2 =() =>{

					var url;

					if (this.state.activeTab=='1') {
						url=BACKEND +"/printApple?get=getByIDTemp&ID="+this.state.TextInputValue
					}
					else {
						url=BACKEND +"/printApple?get=getByIDFinal&ID="+this.state.TextInputValue
					}

					console.log('URL: ' + url)
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

				
			
				  
			

	

	render() {

		return (
			<Page  title="Print Preview"
			breadcrumbs={[{ name: 'Print', active: true }]} >
				<Card>
					<CardHeader>PrintPreview
						</CardHeader>
						<CardBody>
							<Card body>

			<Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.activeTab2 === '1' })}
			onClick={() => {this.setActiveTab2('1'); }}
          >
           Search By Number
          </NavLink>
		</NavItem>

		<NavItem>
          <NavLink
            className={classnames({ active: this.state.activeTab2 === '2' })}
			onClick={() => {this.setActiveTab2('2'); }}
          >
            Search by Date
          </NavLink>
		</NavItem>
		</Nav>	

		<TabContent activeTab={this.state.activeTab2}>
			<TabPane tabId='1'>

				<Row form className='mt-3'>
				<Col md='4'>
						<Label className='font-weight-bold' style={{ 'font-size': '30px' }}>Search By Number</Label>
					</Col>
				</Row>

				<Row form className='mt-3'>
					
					<Col md='2'><Label>Search Berdasarkan</Label></Col>
					
						<Col md='2'>
						
						<Input type='select'>
							<option value='0'>--Pilih--</option>
							<option value='1'>PL</option>
							<option value='2'>DO</option>
							<option value='3'>SP</option>
							<option value='4'>Label</option>
							<option value='5'>Faktur</option>
						</Input>
						</Col>
					</Row>
						<Row form className='mt-3'>
						<Col md='2'>
							<Label>
								Input Nomor
							</Label>
						</Col>
							<Col md='3'>
							<Input type='number' value={this.setState.TextInputValue} onChange={(event) => this.textInputOnChange(event)}></Input>
							</Col>
							<Col md='3'>
								<Button onClick ={()=>this.SearchByNumber2()}>Search</Button>
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
						<Input type='date' value={this.state.dataDate1}></Input>
						
						</Col>
						<Col md='auto'>
						-
						
						</Col>
						<Col md='3'>
						<Input type='date' value={this.state.dataDate2}></Input>
						
						</Col>
					</Row>
					<Row className='mt-4'>
						<Col className='d-flex justify-content-center'>
						<Button className='mr-2'>Search</Button>
						<Button color='warning' onClick ={()=>this.resetInputData()}>Reset</Button>
						</Col>
					</Row>
					</TabPane>
					</TabContent>
						</Card>
						
						

						<Form>
					<Row>
						<Col>
						
						<Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.activeTab === '1' })}
			onClick={() => {this.setActiveTab('1'); }}
          >
            Print
          </NavLink>
		</NavItem>

		<NavItem>
          <NavLink
            className={classnames({ active: this.state.activeTab === '2' })}
			onClick={() => {this.setActiveTab('2'); }}
          >
            Re-Print
          </NavLink>
		</NavItem>
		</Nav>
		<TabContent activeTab={this.state.activeTab}>
			<TabPane tabId='1'>
			<Row >
					<Col>
					
						<Table hover>
							<thead>
								<tr>
									<th>No</th>
									<th>No PL</th>
									<th>No DO</th>
									<th>Tanggal</th>
									<th>Status Print</th>
								</tr>
							</thead>
							<tbody>
							{
                                    this.state.listDataTable.map((data, index)=>
								<tr onClick={() => this.showPrintFunction(index)} >
									<td>{index+1}</td>
									<td>{data.no_pl}</td>
									<td>{data.trans_fh}</td>
									<td>{data.thp_tgl_pl.substr(0, 10)}</td>
									<td></td>
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
					
						<Table hover>
							<thead>
								<tr>
									<th>No</th>
									<th>No PL</th>
									<th>No DO</th>
									<th>Tanggal</th>
									<th>Status Print</th>
								</tr>
							</thead>
							<tbody>
							{
                                    this.state.listDataTable2.map((data, index)=>
								<tr onClick={() => this.showrePrintFunction(index)} >
									<td>{index+1}</td>
									<td>{data.no_pl}</td>
									<td>{data.trans_fh}</td>
									<td >{data.thp_tgl_pl.substr(0, 10)}</td>
									<td></td>
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
									trigger={() => <Button><MdPrint/> Print</Button>}
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

					noDO={''}
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
					noDO={''}
					tglDO={''}
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