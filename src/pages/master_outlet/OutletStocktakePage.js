import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
import React from 'react';
import * as api from './api';
import ReactDOM from 'react-dom'
import Typography from 'components/Typography';
import { Redirect  } from 'react-router';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label,InputGroup,InputGroupAddon,Form,Spinner,Alert
} from 'reactstrap';
import { MdSearch, MdLoyalty, MdFormatAlignRight} from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import DropdownPage from '../template/DropdownPage';
import { ENGINE_METHOD_NONE } from 'constants';
import { Route, NavLink } from 'react-router-dom';
import OutletPage from './OutletPage';

class OutletStocktakePage extends React.Component {
    //special method
    constructor(props) 
    {
        super(props);
        this.state = {
            result: [],
            isLoading: false,
            inputtedName: "",
            inputtedName2: "",
            currentPage: 0,
            todosPerPage: 5,
            flag:0,
            totalPage :'',
            hidePagination: 'flex-row',
        
        };
    }


// ----------------------------------------------- PAGINATION SHOW ALL DATA --------------------------------------------------------- EDITED BY RICHARD & DANIEL & KRIS

//Memberikan semua list data pada page tersebut dimana diBack end mempunyai data Current limit maupun Current Page
    getListbyPaging()
    {
        var url = `http://10.0.111.31:8083/TampilDataStockTakeOutlet/${this.state.searchInputtedName}`
        this.isLoading = true;
        fetch(url)
        .then(response => {
            if (response.ok) {
               this.modal_update = true;
                this.isLoading = false;
                this.state.modal_nested        = false;
                this.state.modal_nested_parent = false;
                return response.json();
            }
        })
        .then(data => this.setState({ result: data, isLoading: false})
        
        );
        
        
        
    }
   
    

//fungsi untuk mengambil semua data dimana memanggil current page dan perpage
    componentDidMount() {
        // this.getListbyPaging(this.state.currentPage,this.state.todosPerPage);
       
    }


    handleSelect(event) {
        this.setState({ [event.target.name]: event.target.value },() =>{
       
            this.getListbyPaging(this.state.currentPage,this.state.todosPerPage);
        });
    }


    handleWrite(event,flag) {
            if(this.state.currentPage + flag < 0 || this.state.currentPage + flag > this.state.totalPage - 1)
            {
                return;
            }
            this.setState({
            currentPage: Number(event.target.value) + flag
                    },() =>{
                if(flag!==0)
                {
                    this.getListbyPaging(this.state.currentPage,this.state.todosPerPage);
                }
            });
        }

//fungsi yang mengarah kan ke arah first page 
    handleFirst(event) {
        this.setState({
            currentPage: 0
        });
        this.getListbyPaging(0, this.state.todosPerPage);
    }
     
//fungsi yang mengarah ke arah last page 
    handleLast(event) {
        this.setState({
            currentPage : this.state.totalPage -1
        });
        this.getListbyPaging(this.state.totalPage -1, this.state.todosPerPage);
    }

    handleClose= ()=>{
        this.setState({
            inputtedName2 :''
        });
    }
//state awal pada saat membuka suatu page tsb nanti dicari langsung di render() 
    state = {
        modal              : false,
        modal_backdrop     : false,
        modal_nested_parent: false,
        modal_nested       : false,
        modal_delete       : false,
        modal_update       : false,
        backdrop           : true,
        inputtedName2      : '',
        modal_outletNotFound:false,
        modal_stocktakeNotFound :false
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
            [`modal_${modalType}`]: !this.state [`modal_${modalType}`]
        });
    };


 
// --------------------------------------------------------- UPDATE --------------------------------------------------------- EDITED BY RICHARD & DANIEL & KRISS

//pada saat melakukan edit yang akan di lempar ke backend adalah first_param = nama yang telah di edit, second_param adalah yang didapatkan 
    setEditEkspedisi =  (
        param, 
        outcode,
        sttkdays,
        jnssttk,
        lamajalanpagi,
        lamajalansore
        ) => async  () => {
        this.setState({isLoading : true});
        var url = `http://10.0.111.143:8083/UbahEkspedisi/${param}`;
      
        var payload = {
            
            outsttk_outcode:outcode,
            outsttk_sttkdays:sttkdays,
            outsttk_jnssttk:jnssttk,
            outsttk_lamajalanpagi:lamajalanpagi,
            outsttk_lamajalansore:lamajalansore,
            outsttk_userid: "0",
        };
        console.log(payload)
        let data = await fetch(url,{
            method : 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            json: true,
            body: JSON.stringify(payload)
        })

        //2.Ketika sudah terespond oleh backend , maka kita akan melakukan hal ini
            .then(response =>{
                if(response.ok){
                    this.isLoading = false;
                    //state ini diawal dibuat false 
                    this.state.modal_update = false;
                    this.state.modal_nested = false;
                    this.state.backdrop     = false;
                    this.componentDidMount();
                    return response.json();
                }
            })
            if(data){
                this.showNotification("Data Berhasil di Ubah Menjadi ");
                this.isLoading = true;
            }
            else{
                alert("Data yang Diubah sama !");
            }
    }
    boolean = false;

//ketika melakukan update, input an yang masuk harus uppercase dan tidak boleh special character
updateInputValue= (evt) => {
    this.setState({
    });
}
// set awal pada saat membuka update 



// --------------------------------------------------------- UPDATE --------------------------------------------------------- EDITED BY RICHARD & DANIEL & KRISS

//pada saat melakukan edit yang akan di lempar ke backend adalah first_param = nama yang telah di edit, second_param adalah yang didapatkan 
setEditStocktake =  (first_param, second_param,third_param) => async  () => {
    
    var buttonOKd = document.getElementById("buttonOK");
    var buttonEditted = document.getElementById("buttonEdit");
    var jenisStocktaked = document.getElementById("jenisStocktake");
    var pagiTimed = document.getElementById("pagiTime");
    var soreTimed = document.getElementById("soreTime");
    var lamaFinalStocktaked = document.getElementById("lamaFinalStocktake");
    this.setState({isLoading : true});
    var url = `http://10.0.111.31:8083/UbahDataStockTakeOutlet/${first_param}`;
  
    var payload = {
        lama: "0",
        nmex_nama  : second_param,
        outsttk_outcode:third_param

    };

    let data = await fetch(url,{
        method : 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        json: true,
        body: JSON.stringify(payload)
    })

    //2.Ketika sudah terespond oleh backend , maka kita akan melakukan hal ini
        .then(response =>{
            if(response.ok){
                buttonOKd.style.display = "none";
                buttonEditted.style.display = "inline";
                jenisStocktaked.disabled = true;
                pagiTimed.disabled = true;
                soreTimed.disabled = true;
                lamaFinalStocktaked.disabled = true;
                this.isLoading = false;
                return response.json();
            }
        })
        if(data){
            this.showNotification("Data Berhasil di Ubah Menjadi "+second_param+"");
            this.isLoading = true;
        }
        else{
            alert("Data yang Diubah sama !");
        }
}

// --------------------------------------------------------- SEARCH --------------------------------------------------------- EDITED BY RICHARD & DANIEL & KRISS

//mengambil parameter yang telah diinput di searchInputtedName . lalu dilempar ke Backend
searchInputValue = (outcode)  =>{
    //mengambil data dari backend
    //apabila kosong dia tidak akan mencari 
    var buttonEditted = document.getElementById("buttonEdit");
    var jenisStocktaked = document.getElementById("jenisStocktake");
    var pagiTimed = document.getElementById("pagiTime");
    var soreTimed = document.getElementById("soreTime");
    var lamaFinalStocktaked = document.getElementById("lamaFinalStocktake");
    var viewinsertOutletIDed = document.getElementById("viewinsertOutletID");
    var insertOutletIDed = document.getElementById("insertOutletID");
    
    if(outcode.length > 0 ){
        var url = `http://10.0.111.143:8083/TampilDataStockTakeOutlet/${outcode}`
        fetch(url)
        
    .then(response   => response.json())
    .then(data =>{ 
        this.setState({ result: data, isLoading: false });
        //000
        if(data[0] && data[0].outlet_exists === false ){
            
            this.setState({
                modal_outletNotFound : true
            });
        }
        //001
        if(data[0] && data[0].sttk_exists === false ){
            viewinsertOutletIDed.style.display = 'none'
            insertOutletIDed.style.display = "inline"
            this.setState({
                modal_stocktakeNotFound : true
            });
        }
        //002
        if(data[0] && data[0].outsttk_outcode === true ){
            console.log("masuk gan")
        jenisStocktaked.disabled = true;
        pagiTimed.disabled = true;
        soreTimed.disabled = true;
        lamaFinalStocktaked.disabled = true;
            // this.setState({
                
            // });
        }
        
    })

        this.state.hidePagination = 'd-none';
        buttonEditted.style.display = "inline";
        this.setState({
            isLoading : true
        });
     
   
    }
    else {
        //apabila tidak melakukan search, pagination nya tidak dihilangkan 
        //flex-row itu class name 
        this.isLoading = false;
        this.state.hidePagination = 'flex-row';
        buttonEditted.style.display = "none";
        
    }
   
 
    
    if(buttonEditted.clicked === true){
        jenisStocktaked.disabled = false;
        pagiTimed.disabled = false;
        soreTimed.disabled = false;
    }

    

}


enableStocktakeWhenNotFound= () => {
    var inputSearched = document.getElementById("inputSearch");
    var onClickSearched = document.getElementById("onClickSearch");
    var onClickSearchLogoed = document.getElementById("onClickSearchLogo"); 
    var buttonOKd = document.getElementById("buttonOK");
    var buttonEditted = document.getElementById("buttonEdit");
    var jenisStocktaked = document.getElementById("jenisStocktake");
    var pagiTimed = document.getElementById("pagiTime");
    var soreTimed = document.getElementById("soreTime");
    var lamaFinalStocktaked = document.getElementById("lamaFinalStocktake");
    this.setState({
        modal_stocktakeNotFound : false
    });
        onClickSearchLogoed.style.display = "none";
        inputSearched.style.display = "none";
        onClickSearched.style.display = "none";
        buttonEditted.style.display = "none";
        buttonOKd.style.display = "inline";
        jenisStocktaked.disabled = false;
        pagiTimed.disabled = false;
        soreTimed.disabled = false;
        lamaFinalStocktaked.disabled = false;
       
        
          
        
}



enableClickEdit(){
    //tombol
    var buttonEditted = document.getElementById("buttonEdit");
    var buttonOKd = document.getElementById("buttonOK");
    
    //inputan
    var lamaFinalStocktaked = document.getElementById("lamaFinalStocktake");
    var jenisStocktaked = document.getElementById("jenisStocktake");
    var pagiTimed = document.getElementById("pagiTime");
    var soreTimed = document.getElementById("soreTime");
       
        buttonEditted.style.display = "none";
        buttonOKd.style.display = "inline";
        lamaFinalStocktaked.disabled = false;
        jenisStocktaked.disabled = false;
        pagiTimed.disabled = false;
        soreTimed.disabled = false;
    
}

//function untuk melakukan search pada saat menekan enter
enterPressed = (event,search) =>{
    var code = event.keyCode || event.which;
    if(code === 13) { //13 is the enter keycode
        //Do stuff in here
        event.preventDefault();
        if(search === true)
        {
            this.setState({currentPage: 0}
                ,() =>{this.searchInputValue(this.state.searchInputtedName);});
        }
      
    } 
}
setSearchInputState = (evt) => {
    this.setState({
        searchInputtedName: evt.target.value,
        
    })
}

//ketika melakukan search, state input-an yang masuk harus uppercase dan tidak boleh special character

//--------------------------------------------------------- DELETE --------------------------------------------------------- EDITED BY RICHARD & DANIEL & KRISS

// 1.Pelemparan parameter ke Backend dimana data apa saja yang akan di hapus
deleteEkspedisi = (param) => async ()=>{
    var url = `http://10.0.111.180:8083/HapusEkspedisi/${param}`;
    var payload = { 
        nmex_userid: "0"
    };
    let data = await fetch(url,{
        method : 'PUT',
        body   : JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
})

//2.Ketika sudah terespond oleh backend , maka frontend akan melakukan hal ini
        .then(response => {

            if (response.ok) {
                this.state.modal_delete = false;
                this.state.modal_nested = false;
                this.state.backdrop     = false;
                this.componentDidMount();
                return response.json();
            }
        });

        if(data){
          this.showNotification("Data Berhasil di Hapus");
        }
}

// set awal pada saat membuka delete
    openModalWithItemID(idEkspedisi){
        this.setState({
            modal_delete : true,
            activeItem_Id: idEkspedisi
        })
    }

   

//render biasa nya di-isi untuk desain HTML
    render() {
        const { result, isLoading } = this.state;
       
        return (
            
            
            <Page
                title       = "Stocktake"
                breadcrumbs = {[{ name: 'stocktake', active: true }]}
                className   = "StocktakePage"

            >
           


                    <Modal
                        isOpen      = {this.state.modal_outletNotFound}
                        toggle      = {this.toggle('outletNotFound')}
                        className   = {this.props.className}
                       >
                         
                        <Row>
                        <Col>
                          <Card>
                            <CardHeader >
                            <Alert color="success">
                                <Typography 
                                type="h4"
                                className="alert-heading">
                                Outlet Tidak Ditemukan !
                                </Typography>
                                
                              </Alert>
                            </CardHeader>

                            <CardBody>
                             <Label 
                             >
                             Ingin Membuat Outlet ?
                             </Label>
                              
                            </CardBody>
                           
                          </Card>
                          
                        </Col>
                      </Row>

                      <ModalFooter>
                      
                      <Button 
                      color = "primary" 
                      href = {'./Outlet'} 
                     
                      >
                     {!isLoading && <i className = "fa fa-refresh fa-spin"></i> }
                         Ya
                     </Button>{' '}

                                    <Button color = "secondary" onClick = {this.toggle('outletNotFound')} >
                                    Batal
                                </Button>
                      </ModalFooter>
                    </Modal>




                    <Modal
                        isOpen      = {this.state.modal_stocktakeNotFound}
                        toggle      = {this.toggle('stocktakeNotFound')}
                        className   = {this.props.className}
                        backdrop="static"
                        keyboard="false">
                          <ModalHeader>
                                    <Label>
                                        Outlet Tidak Mempunyai Stocktake !
                                     </Label>
                          </ModalHeader>
                                    <ModalBody> 
                                    <Label>
                                    Ingin Membuat Stocktake ?
                                     </Label>
                                    </ModalBody>
                                <ModalFooter>
                                <Button color = "secondary" onClick={this.enableStocktakeWhenNotFound }>
                                
                                                            Ya 
                                                        </Button>

                                <Button color = "secondary" onClick = {this.toggle('stocktakeNotFound')}>
                                                            Tidak 
                                                        </Button>
                                                  
                                </ModalFooter>
                    </Modal>

                <Card className = "mb-3">
                    <NotificationSystem
                        dismissible={false}
                        ref={notificationSystem =>
                                (this.notificationSystem = notificationSystem)
                            }
                        style={NOTIFICATION_SYSTEM_STYLE}
                    />
{/* ======================================INPUT SEARCH============================== */}
                    <CardHeader className = "d-flex justify-content-between">
                     
                            <Form 
                           
                            inline className="cr-search-form">
                                <MdSearch 
                                    size="20"
                                    className="cr-search-form__icon-search text-secondary"
                                />
                            <Card className = "d-flex">
                                <Input
                                    id= "inputSearch"
                                    style={{ display:"inline" }}
                                    disabled    ={isLoading}
                                    onChange    = {evt => this.setSearchInputState(evt)}
                                    value       = {this.state.searchInputtedName}
                                    onKeyPress  ={event =>this.enterPressed(event,true)}
                                    className   ="cr-search-form_input"
                                    placeholder ="Cari Outlet ID.."
                                />    
                                  {!isLoading && <i className = "fa fa-refresh fa-spin"></i> }
                            </Card>
{/* ======================================CLICK SEARCH============================== */}

                                <Card   
                                id="onClickSearchLogo"
                                className = "d-flex">
                                    <Button 
                                    id="onClickSearch"
                                    onSubmit={e => e.preventDefault()}  
                                    onClick = {() => this.searchInputValue(this.state.searchInputtedName)}
                                    
                                    >
                                    <MdSearch
                                  
                                    ></MdSearch> </Button>
                                </Card>   


                            </Form>
               
{/* ======================================KETIKA TAMBAH DATA============================== */}
<Row >


<Col  xs = {8} md = {4} >
                <Button  
                    onClick = {this.enableClickEdit}
                    id = "buttonEdit"
                    style = {{ display :'inline' }}
                    >Edit
                </Button>
               
                <Button  
                    onClick = {this.setEditEkspedisi(
                        this.state.outsttk_outcode,
                        this.state.result[0] && this.state.result[0].outsttk_sttkdays,
                        this.state.result[0] && this.state.result[0].outsttk_jnssttk,
                        this.state.result[0] && this.state.result[0].outsttk_lamajalanpagi,
                        this.state.result[0] && this.state.result[0].outsttk_lamajalansore
                    )}
                    id = "buttonOK"
                    color = "success" 
                    style = {{ display :'none' }}
                    >  {!isLoading && <i className = "fa fa-refresh fa-spin"></i> } 
                     OK
                </Button>
                <Button  
                    onClick = {this.enableClickEdit}
                    id = "buttonEdit"
                    style = {{ display :'none' }}
                    >Simpan
                </Button>
                
</Col>

</Row>
                    </CardHeader>
                  
                       
                    <CardBody
                     id= "selectedStocktake"
                    >   
                  
                                <Form 
                                >
                            
                         
          
           
            
 {/* ================================= outlet id =================================*/}
                                   
                                            <Row className = "mt-3">
                                                <Col   xs = {4} md = {2}>

                                                        {/* outlet id */}
                                                      <Input 
                                                      id= "viewinsertOutletID"
                                                           value = {this.state.result[0] && this.state.result[0].outsttk_outcode}
                                                            disabled
                                                            maxLength   = "4"
                                                                    >
                                                      </Input>
                                                
                                                      <Input 
                                                   
                                                      id= "insertOutletID"
                                                      style = {{ display :"none" }}
                                                      value = {this.state.result[0] && this.state.result[0].out_code}
                                                       disabled
                                                       maxLength   = "4"
                                                               >
                                                 </Input>
                                                </Col>   
                                                 {/* Perusahaan */}
                                                <Col xs = {10} md = {5}>
                                                      <Input 
                                                            value ={this.state.result[0] && this.state.result[0].out_name}
                                                            disabled
                                                            maxLength   = "4"
                                                                    >
                                                      </Input>
                                                
                                                </Col>                                                         
                                            </Row>
 {/* ================================= stocktake =================================*/}
                                            <Row className = "mt-3">
                                                <Col   xs = {2} md = {2}>
                                                            <Label>
                                                                Lama Final Stocktake
                                                            </Label>
                                                </Col>
                                              
                                                <Col   xs = {4} md = {1}>
                                                                <Input 
                                                                    value = {this.state.result[0] && this.state.result[0].outsttk_sttkdays}
                                                                    onChange = {evt => this.updateInputValue(evt)}
                                                                    id = 'lamaFinalStocktake'
                                                                    disabled
                                                                    >
                                                                </Input>
                                                </Col>
                                                
                                                    <Label>Hari</Label>
                                                
                                                </Row>
                                                
                                                <Row>
                                                <Col  xs = {4} md = {4} className = "mt-1 ml-4">
                                                                <Input 
                                                                    id = 'checkboxlamaFinalStocktake'
                                                                    type = "checkbox"
                                                                    onChange = {evt => this.updateInputValue(evt)}
                                                                    disabled
                                                                    maxLength   = "4"
                                                                    >
                                                                </Input>

                                                                <Label>
                                                                Jadwal Stock Take diumumkan
                                                                </Label>
                                                </Col>  
                                            </Row>
                                            <Row className = "mt-3">
                                                <Col   xs = {4} md = {2}>
                                                        <Label>
                                                                Jenis Stocktake 
                                                        </Label>
                                                
                                                </Col>   
                                                
                                                <Col   xs = {10} md = {8}>
                                                      <Input 
                                                         onChange = {evt => this.updateInputValue(evt)}
                                                             value = {this.state.result[0] && this.state.result[0].jenis_sttk}
                                                            id = 'jenisStocktake'
                                                            disabled
                                                            maxLength   = "4"
                                                                    >
                                                      </Input>
                                                
                                                </Col>   
                                                      
                                            </Row>
                                            {/* <Row className = "mt-3"> */}
                                                {/* <Col   xs = {2} md = {2}>
                                                            <Label>
                                                                Standar lama perjalanan 
                                                            </Label>
                                                </Col> */}
                                                {/* <Col   xs = {4} md = {2}>
                                                            <Label>
                                                                Pagi
                                                            </Label>
                                                                <Input 
                                                                    onChange = {evt => this.updateInputValue(evt)}
                                                                    value = {this.state.result[0] && this.state.result[0].outsttk_lamajalanpagi}
                                                                    id = "pagiTime"
                                                                    type ="time"
                                                                    disabled
                                                                    maxLength   = "4"
                                                                    >
                                                                </Input>
                                                
                                                </Col>      
                                                <Col   xs = {4} md = {2}>
                                                            <Label>
                                                                Sore
                                                            </Label>
                                                                <Input 
                                                                onChange = {evt => this.updateInputValue(evt)}
                                                                     value = {this.state.result[0] && this.state.result[0].outsttk_lamajalansore}
                                                                    id = "soreTime"
                                                                    type ="time"
                                                                    disabled
                                                                    maxLength   = "4"
                                                                    >
                                                                </Input>
                                                
                                                </Col>    */}
                                                
                                            {/* </Row> */}
                                    
                            </Form>
                           
                          
                    </CardBody>      
          
                
                  
                        
                </Card>                        
            </Page>
        );
    }
}
export default OutletStocktakePage; 