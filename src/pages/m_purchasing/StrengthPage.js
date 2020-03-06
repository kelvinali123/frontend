import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
import React from 'react';
import {
    Button, ButtonGroup, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, UncontrolledButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle
    ,InputGroup,
    InputGroupAddon,
    InputGroupButtonDropdown,
    InputGroupDropdown,    
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle, MdHighlight, MdAdd, MdSearch, MdDelete } from 'react-icons/md';
import * as s_url from '../urlLink';

class StrengthPage extends React.Component {

    constructor(props) {
        super(props);
        
        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.state = {
            result: [],
            isLoading: false,
            inputtedName: '',
            searchType: "",
            keyword: "",
            selectedDropdown:"All",
            page: 1,
            size: 10,
            count: 0,
            str_code:0,
            str_nama:"",
        };
    }

    pagecount(){
        var  url = s_url.url_CetakStrength_Count;

        if( this.state.searchType === "Strength_Kode"){url = s_url.url_PencarianStrengthKode_Count;}
        if( this.state.searchType === "Strength_Nama"){url = s_url.url_PencarianStrengthNama_Count;}
        if(url === s_url.url_CetakStrength_Count){
            
            fetch(url, {
                method: 'GET'
                }
            )
            .then(response => {
                if (response.ok) {
    
                    response.json().then( data =>
                    {
    
                        this.setState({count: data.count},
                            () => this.pageRender()
                            );
    
                    });
    
                }
                else{this.popUpMessage("cannot reach the server",false);}
            
            },() => this.popUpMessage("cannot reach the server",false));
        }
        else{

            var formdata = {
                keyword:(this.state.keyword).trim()
            }

            fetch(url, {
                method: 'POST',
                body: JSON.stringify(formdata),
                headers:{
                'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
    
                    response.json().then( data =>
                    {
    
                        this.setState({count: data.count},
                            () => this.pageRender()
                            );
    
                    });
    
                }
                else{this.popUpMessage("cannot reach the server",false);}
            
            },() => this.popUpMessage("cannot reach the server",false));
        }
    }

    pageRender(){
        var page = this.state.page;
        var size = this.state.size;
        var count = this.state.count;
        var initial_index = size*(page-1);
        //alert(count);
        count = count <= 0 ? 1 : count;
        while (initial_index>=count){
            page--;
            initial_index = size*(page-1);
        }

        
        var  url = s_url.url_CetakStrength_Halaman;

        if( this.state.searchType === "Strength_Kode"){url = s_url.url_PencarianStrengthKode_Halaman;}
        if( this.state.searchType === "Strength_Nama"){url = s_url.url_PencarianStrengthNama_Halaman;}

        this.setState({ isLoading: true });
        var formdata = {
                    page: page,
                    size: size,
                    keyword:(this.state.keyword).trim()
                };
        
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(formdata),
            headers:{
              'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {

                response.json().then( data =>
                {

                    this.setState({ result: data ,
                                    page: page, 
                                    isLoading: false});

                });

            }
            else{this.popUpMessage("cannot reach the server",false);}
        
        },() => this.popUpMessage("cannot reach the server",false));
    }

    componentDidMount() {
        this.pagecount();
    }

    insertMasterStrength = param => () => {
        // var url = `http://pharmanet.apodoc.id/neogenesisInsertMasterUnit.php?unit_name=${param}&unit_userid=0`;
        var url = s_url.url_TambahStrength;
        var payload = {
            Strength_Name: param,
            Strength_UserID: "COVERT"
            
        }

        fetch(url, {
            method: "POST",
            body: JSON.stringify(payload),
            json: true,
            headers:{
                "Content-type":"application/json; charset=UTF-8"
            }
        })
        .then(response => {
            if (response.ok) {

                response.json().then( data =>
                {
                    this.popUpMessage("insert successful",true);
                });

            }
            else{this.popUpMessage("cannot reach the server",false);;}
       
        },() => this.popUpMessage("cannot reach the server",false));
        

    }

    state = {
        modal: false,
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_nested: false,
        modal_delete: false,
        modal_edit: false,
        modal_message: false,
        backdrop: true,
        dropdownOpen: false,
    };

    toggle = modalType => () => {
        if (!modalType) {
            return this.setState({
                modal: !this.state.modal,
            });
        }

        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        });
    };

    toggledelete(code,nama){
        this.setState({
            modal_delete:true,
            str_code:code,
            str_nama:nama
        })
    }

    deleteDataValue () {
        var url = s_url.url_HapusStrength;
        var payload = {
            strg_code: this.state.str_code,
            strg_userid: "COVERT"
            
        }

        fetch(url, {
            method: "POST",
            body: JSON.stringify(payload),
            json: true,
            headers:{
                "Content-type":"application/json; charset=UTF-8"
            }
        })
        .then(response => {
            if (response.ok) {

                    response.json().then( data =>
                    {   
                        
                        this.popUpMessage("delete successful",true);
                    });
                
            }
            else{this.popUpMessage("cannot reach the server",false);}

        },() => this.popUpMessage("cannot reach the server",false));
    }

    updateInputValue(evt) {
        this.setState({
            inputtedName: evt.target.value
        });
    }

    updateSearchValue(evt){
        //console.log(evt.target.value);
        this.setState({
            keyword: evt.target.value
        });
    }

    enterPressed(evt){
        var code = evt.keyCode || evt.which;
        if (code === 13){ //13 adalah kode untuk keyword
            this.searchPage()
        }
    }	

    updateSelectionValue(evt){
        this.setState({
            selectedDropdown: evt.target.value
        },() => {
            if(this.state.selectedDropdown === "All"){
                this.setState({ searchType:"Show_All",
                                page : 1},() => this.pagecount())

            }
        });

    }

    updateSizeValue(evt){
            this.setState({size : evt.target.value},
                () => 
                this.pagecount()
                );

    }

    updatePageValue(number){
        this.setState({page : number},
            () => 
            this.pagecount()
            );
    }

    searchPage(){
        var search = "";
        if(this.state.selectedDropdown==="Kode"){search = "Strength_Kode";}
        if(this.state.selectedDropdown==="Nama"){search = "Strength_Nama";}
        if(this.state.selectedDropdown==="All"){search = "Show_All";}

        this.setState({searchType:search,page : 1},() => this.pagecount())
    }

    toggleDropDown() {
        this.setState({
          dropdownOpen: !this.state.dropdownOpen
        });
    }

    popUpMessage(message,render){
        if(render){

            this.setState({
                message: message,
                modal_delete: false,
                modal_nested: false,
                modal_nested_parent: false,
                modal_message:true,
                searchType:"Show_All"

            },  () => this.pagecount())

        }else{

            this.setState({
                message: message,
                modal_delete: false,
                modal_nested: false,
                modal_nested_parent: false,
                modal_message:true,
                searchType:"Show_All"

            })

        }
    }

    render() {
        const { result, isLoading, page, count, size } = this.state;
        const maxpage = Math.ceil(count/size);
        var search, sizeDropDown, pageNav;
        var first,back,next,last;
        var s_disable = false;

        if(this.state.selectedDropdown == "All"){
            s_disable = true;
        }

        if(page <= 1 ){
            first = <Button disabled>«</Button>;
            back = <Button disabled>‹</Button>;
        }else{
            first = <Button onClick={() => this.updatePageValue(1)}>«</Button>;
            back = <Button onClick={() => this.updatePageValue(page-1)}>‹</Button>;
        }

        if(page >= maxpage){
            next = <Button disabled>›</Button>;
            last = <Button disabled>»</Button>;
        }else{
            next = <Button onClick={() => this.updatePageValue(page+1)}>›</Button>;
            last = <Button onClick={() => this.updatePageValue(maxpage)}>»</Button>;
        }

        
        search =    <InputGroup style={{marginRight:"5px"}}>
                        <InputGroupButtonDropdown style={{marginRight:"10px"}}  color="primary" isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
                            <DropdownToggle caret>{this.state.selectedDropdown}</DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem value="All"  onClick={evt => this.updateSelectionValue(evt)}>SHOW ALL</DropdownItem>
                                    <DropdownItem value="Kode" onClick={evt => this.updateSelectionValue(evt)}>KODE STRENGTH</DropdownItem>
                                    <DropdownItem value="Nama" onClick={evt => this.updateSelectionValue(evt)}>NAMA STRENGTH</DropdownItem>
                                </DropdownMenu>
                        </InputGroupButtonDropdown>
                        <Input disabled={s_disable}
                        placeholder="Search..."
                        onKeyPress={evt => this.enterPressed(evt)}  
                        onChange={evt => this.updateSearchValue(evt)}
                        />
                        <InputGroupAddon addonType="append"><Button disabled={s_disable} onClick={() => this.searchPage()}>
                            <MdSearch size="18"></MdSearch>
                            </Button></InputGroupAddon>
                    </InputGroup>
        ;

        sizeDropDown =  <UncontrolledButtonDropdown>
                            <DropdownToggle caret className="mr-3" name ="sizemenu" color="primary">{this.state.size}</DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem value="3" onClick={evt => this.updateSizeValue(evt)}>3</DropdownItem>
                                <DropdownItem value="5" onClick={evt => this.updateSizeValue(evt)}>5</DropdownItem>
                                <DropdownItem value="10" onClick={evt => this.updateSizeValue(evt)}>10</DropdownItem>
                                <DropdownItem value="25" onClick={evt => this.updateSizeValue(evt)}>25</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledButtonDropdown>
        ;

        pageNav =   <tr>
                        <td>{sizeDropDown}</td>
                        <td style={{textAlign:'center', width: '100%'}}>
                            <Col xs="auto" style={{textAlign:'center', width: '100%'}}>
                                <ButtonGroup style={{ alignSelf: 'center', alignItems: 'center'}}>
                                    {first}
                                    {back}
                                    <Button color="white" style={{fontSize: "10pt", width: "55px"}} disabled>   {page} / {maxpage}   </Button>
                                    {next}
                                    {last}
                                </ButtonGroup>
                            </Col>
                        </td>
                        <td></td>
                    </tr>
        ;

        return (
            <Page
                title="Strength"
                breadcrumbs={[{ name: 'Strength', active: true }]}
                className="StrengthPage">

                <Modal
                    isOpen={this.state.modal_message}
                    toggle={this.toggle('message')}>
                    
                    <ModalBody style={{ textAlign: 'center'}}><br/>{this.state.message}<br/><br/></ModalBody>
                    
                    <ModalFooter><Button onClick={() => this.setState({modal_message:false,})}>ok</Button></ModalFooter>
                </Modal>

                <Modal
                    isOpen={this.state.modal_nested_parent}
                    toggle={this.toggle('nested_parent')}
                    className={this.props.className}>
                        <ModalHeader toggle={this.toggle('nested_parent')}>
                            Tambah Strength
                        </ModalHeader>
                        <ModalBody>
                            <Label>Nama Strength</Label>
                            <Input type="namastrength" value={this.state.inputtedName} onChange={evt => this.updateInputValue(evt)} name="namastrength" placeholder="Nama Strength" />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.toggle('nested')}>
                                Simpan
                            </Button>
                                <Modal
                                    isOpen={this.state.modal_nested}
                                    toggle={this.toggle('nested')}>
                                    <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                    <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.insertMasterStrength(this.state.inputtedName)}>
                                            Ya
                                        </Button>{' '}
                                        <Button
                                        color="secondary"
                                        onClick={this.toggle('nested')}>
                                            Tidak
                                        </Button>
                                    </ModalFooter>
                                </Modal>
                                {' '}
                                <Button color="secondary" onClick={this.toggle('nested_parent')}>
                                    Batal
                                </Button>
                            </ModalFooter>
                </Modal>

                <Modal
                    isOpen={this.state.modal_delete}
                    toggle={this.toggle('delete')}>
                        <ModalHeader>Konfirmasi Delete</ModalHeader>
                        <ModalBody>
                            <br/>
                            <b>no. produk: {this.state.str_code}</b><br/>
                            <b>nama produk: {this.state.str_nama}</b><br/><br/>
                            Apakah anda ingin menghapus data ini?
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={() => this.deleteDataValue()}>
                                Ya
                            </Button>
                            <Button color="secondary" onClick={this.toggle('delete')}>Tidak</Button>
                        </ModalFooter>
                </Modal>       

                <Card>
                    <CardHeader className="d-flex justify-content-between">
                            {search}
                           
                    </CardHeader>
                    <CardBody className="mr-3">
                        <Table>
                            <thead width>
                                <tr width="100%">
                                    <th width="10%">Code</th>
                                    <th max-width="80%">Name Strength</th>
                                    <th style={{marginRight: "5px"}}> <Button size="sm" color="primary" onClick={this.toggle('nested_parent')} style={{display: "inline-flex", alignItems: "center"}}><MdAdd style={{marginRight: "5px"}}></MdAdd>ADD</Button></th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.map(strength =>
                                    <tr width="100%">
                                        <th width ="10%" scope="row">{strength.strg_Code}</th>
                                        <th max-width="80%">{strength.strg_Name}</th>
                                        <th width="10%" style={{textAlign: "center"}}>   <Button size ="sm" onClick={() => this.toggledelete(strength.strg_Code,strength.strg_Name)} color="danger" style={{display: "inline-flex", alignItems: "center"}}><MdDelete></MdDelete></Button></th>
                                    </tr>
                                )}
                                
                            </tbody>
                        </Table>
                        {pageNav}
                    </CardBody>
                </Card>
            </Page>
        );
    }


}
export default StrengthPage;
//style={{display:"inline-block", width:"10 0px"}}