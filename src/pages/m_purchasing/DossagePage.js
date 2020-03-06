import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
import React from 'react';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, Nav, Form,
    Navbar,UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    ButtonGroup,InputGroup, InputGroupAddon
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle, MdHighlight, MdAdd, MdDelete, MdSearch  } from 'react-icons/md';

class DossagePage extends React.Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state  = {
            result          : [],
            isLoading       : false,
            inputtedName    : '',
            selectedDropdown: "Show All",
            currentPage: 1,
            todosPerPage: 5,
            flag:0,
            pageCount :0,
            displayStatus: "none"
        };
    }
    
    state = {
        modal              : false,
        modal_backdrop     : false,
        modal_nested_parent: false,
        modal_nested       : false,
        modal_delete       : false,
        backdrop           : true,
    };

    componentDidMount() {
        this.getListbyPaging(this.state.currentPage,this.state.todosPerPage);
    }

    getCountPage(){
        console.log(url);
        if(this.state.keyword!=null && this.state.keyword!=""){
            var payload = {
                input : this.state.keyword,
                limit : this.state.todosPerPage,
            }
        }else {
            var payload = {
                input : "",
                limit : this.state.todosPerPage,
            }
        }
        var url     = `https://api.docnet.id/masterDosis/JumlahHalaman`;

        fetch(url, {
            method : "POST",
            body   : JSON.stringify(payload),
            json   : true,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(response => {
                if(response.count == 0){
                    this.state.pageCount = 1
                }
                else{
                    this.state.pageCount = response.count    
                    console.log("count: "+response.count)
                    console.log("pagecount: "+this.state.pageCount) 
                }
        });
    }


    getListbyPaging(currPage,currLimit)
    {   
        this.getCountPage();
        if(this.state.keyword!=null && this.state.keyword!=""){
            console.log("search tidak null");
            // this.sendSearchParam(this.state.keyword, this.state.currentPage + flag, this.state.todosPerPage);
            if(this.state.keyword===""){
                this.componentDidMount();
            }
            else{
                console.log("enter : "+this.state.keyword )
                if(this.state.searchType==="Code"){
                    console.log(url);
                    var url     = `https://api.docnet.id/masterDosis/CariKodeDossageFormPage`;
                    var payload = {
                        dsgform_code: this.state.keyword,
                        page :currPage,
                        length : currLimit,
                    }
            
                    fetch(url, {
                        method : "POST",
                        body   : JSON.stringify(payload),
                        json   : true,
                        headers: {
                            "Content-type": "application/json; charset=UTF-8"
                        }
                    })
                        .then(response => response.json())
                        .then(data => this.setState({ result: data, isLoading: false }));
                }
                else{
                    var url     = `https://api.docnet.id/masterDosis/CariNamaDossageFormPage`;
                    var payload = {
                        dsgform_name: this.state.keyword,
                        page :currPage,
                        length : currLimit,
                    }
            
                    fetch(url, {
                        method : "POST",
                        body   : JSON.stringify(payload),
                        json   : true,
                        headers: {
                            "Content-type": "application/json; charset=UTF-8"
                        }
                    })
                        .then(response => response.json())
                        .then(data => this.setState({ result: data, isLoading: false }));
                    }
                }
                
        }
        else{
            // console.log("search null");
            // console.log("PUNYA KARIN");
            // console.log("haha 456")
            var payload = {
                page :currPage,
                length :currLimit,
            };
                const option = {
                    method: "POST",
                    json: true,
                    headers: {
                        "Content-Type": "application/json;charset=UTF-8"
                      },
                    body: JSON.stringify(payload)
                }
             
                fetch("https://api.docnet.id/masterDosis/TampilkanDossageFormPage",option)
                .then(response => response.json())
                .then(data =>
                    {                
                      if(this.state.currentPage > this.state.pageCount){  
                            this.setState({ currentPage: this.state.pageCount} ,()=> this.getListbyPaging(this.state.currentPage,this.state.todosPerPage));
                        } else{
                        this.setState({ result: data, isLoading: false})
                     }
                    });
        }
            
    }

    insertMasterUnit = param => () => {
        if(this.state.inputtedName.length > 15){
            alert("Nama dossage tidak boleh melebihi 15 huruf")
        }else{

        
        var url     = `https://api.docnet.id/masterDosis/TambahDossageForm`;
        var payload = {
            DsgForm_Name  : param,
            DsgForm_UserID: "CONVERT"
        }
        console.log(url);

        fetch(url, {
            method : "POST",
            body   : JSON.stringify(payload),
            json   : true,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log("RESPONSE STATUS : "+response.status)
                if (response.status === "true") {
                    console.log("jalan true : ")
                    this.state.modal_nested        = false;
                    this.state.modal_nested_parent = false;
                    this.state.inputtedName="";
                    this.state.currentPage = this.state.pageCount;
                    alert("Data berhasil ditambah")
                    this.componentDidMount();
                }
                else if (response.status === "false"){
                    console.log("jalan false : ")
                    this.state.modal_nested        = false;
                    this.state.modal_nested_parent = false; 
                    this.componentDidMount();
                    alert("Data sudah ada");
                }
            });
        }

    }

    deleteDossage = param => () => {
        var url = `https://api.docnet.id/masterDosis/DeleteDossageForm/${param}`;
        console.log(url);
        
        fetch(url, {
            method : 'PUT',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(response => response.json())
            .then(response => {
                if (response.status === "true") {
                    console.log("jalan true : ")
                    this.state.modal_delete      = false;
                    alert("Data berhasil dihapus")
                    this.componentDidMount();
                }
                else if (response.status === "false"){
                    console.log("jalan false : ")
                    this.state.modal_delete      = false;
                    this.componentDidMount();
                    alert("Data gagal dihapus")
                
                // if (response.ok) {
                //     this.state.modal_delete = false;
                //     this.componentDidMount();
                }
            });
    }

    
    //set Current Limit
    handleSelect(event) {
        this.setState({ [event.target.name]: event.target.value },() =>{
                this.state.currentPage = 1;
                this.getListbyPaging(this.state.currentPage,this.state.todosPerPage);
            
        });
      }

      //set Current Page
    handleWrite(event,flag) {
        console.log("karin : "+this.state.currentPage + flag)
        console.log("karin2 : "+Number(event.target.value))

        if((this.state.currentPage + flag) > 0){
            this.setState({
                currentPage: Number(event.target.value) + flag
            });
        }
        console.log("value event: "+ Number(event.target.value)+" "+(Number(event.target.value) + flag));
        
        if((this.state.currentPage + flag) > this.state.pageCount){
            this.setState({
                currentPage: this.state.pageCount
            });
            console.log("masuk sini1")
        }
        else{
            if(this.state.currentPage + flag != 0){
                this.getListbyPaging(this.state.currentPage+flag, this.state.todosPerPage)
                console.log("masuk sini")
            }   
            console.log("value event: "+ (this.state.currentPage+flag)+" "+this.state.todosPerPage);
        }

      }

      
    handleFirst(event) {
        this.setState({
            currentPage: 1
        });
        console.log("First " + this.state.currentPage);
        this.getListbyPaging(1, this.state.todosPerPage);
    }

    handleLast(event, page) {
        this.setState({
            currentPage: page
        });
        this.getListbyPaging(page, this.state.todosPerPage);
    }

    openModalWithItemID(code, name){
        this.setState({
            modal_delete: true,
            activeItemId: code,
            activeName : name
        })
    }

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

    
    updateInputValue(evt) {
        this.setState({
            inputtedName: evt.target.value
        });
    }

    updateSearchValue(evt){
        console.log(evt.target.value);
        
        this.setState({
            keyword: evt.target.value
        });
    }

    enterPressedSearch(event){

        console.log(this.state.currentPage)
        console.log(this.state.todosPerPage)
        var code = event.keyCode || event.which;
        if(code === 13){

            this.state.currentPage = 1;
            this.getListbyPaging(this.state.currentPage,this.state.todosPerPage);
           
        }
    }

    sendSearchParam = (keyword,currentPage,todosPerPage) => () =>{
        console.log("search : "+this.state.keyword);
        this.getListbyPaging(this.state.currentPage,this.state.todosPerPage);
        
    }

    updateSelectionValue(evt){
        this.setState({
            [evt.target.name]: evt.target.value,
            selectedDropdown : evt.target.value
        });

        if(evt.target.value==="Code")
        {
            this.setState({
                searchType:"Code",
                displayStatus: 'inline-flex'
            })   
        }

        else if(evt.target.value==="Name")
        {
            this.setState({
                searchType:"Name",
                displayStatus: 'inline-flex'
            }) 
        }

        else if(evt.target.value === "Show All"){
            document.getElementById('inputSearch').value = "";
        
            this.setState({
                currentPage: 1,
                keyword: "",
                displayStatus: 'none'
            },() => {
            this.componentDidMount();
            });
        }

    }

    render() {
        const { result } = this.state;
        console.log(result)

        return (
            <Page
                title       = "Dossage"
                breadcrumbs = {[{ name: 'dossage', active: true }]}
                className   = "DossagePage"
            >
                <Row>
                    <Col>
                        <Card       className = "mb-3">
                        <CardHeader className = "d-flex justify-content-between">
                                <UncontrolledButtonDropdown
                                style={{
                                    marginRight: "1.5vw"
                                }}
                                >
                                    {/* <Button style={{display: "inline-flex", width: "90px"}}>Sort By</Button> */}
                                    <DropdownToggle caret name = "filtermenu" color = "primary"> {this.state.selectedDropdown}</DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem value = "Show All" onClick       = {evt => this.updateSelectionValue(evt)}>Show All</DropdownItem>
                                        <DropdownItem value = "Name" onClick = {evt => this.updateSelectionValue(evt)}>Name</DropdownItem>
                                        <DropdownItem value = "Code" onClick = {evt => this.updateSelectionValue(evt)}>Code</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledButtonDropdown>

                                <Input
                                    id          = "inputSearch"     
                                    type        = "search"
                                    placeholder = "Search..."
                                    onChange   = {evt => this.updateSearchValue(evt)}
                                    onKeyPress = {evt => this.enterPressedSearch(evt)}
                                    style={{
                                        display: this.state.displayStatus
                                    }}
                                />
                                
                                <Button   
                                size = "sm" 
                                onClick = {this.sendSearchParam(this.state.keyword, this.state.currentPage, this.state.todosPerPage)}
                                style      = {{
                                    marginRight: "1.5vw",
                                    display: this.state.displayStatus
                                }}
                                >
                                    <MdSearch size = "18"></MdSearch>
                                </Button>

                                <Button 
                                size = "sm" 
                                color = "primary" 
                                onClick = {this.toggle('nested_parent')} 
                                style = {{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    float: "right",
                                    }}>
                                    <MdAdd 
                                    style ={{

                                        marginRight: "5px"
                                        }}
                                        >
                                        </MdAdd>ADD
                                        </Button>
                            
                                <Modal
                                                 isOpen    = {this.state.modal_nested_parent}
                                                 toggle    = {this.toggle('nested_parent')}
                                                 className = {this.props.className}>
                                    <ModalHeader toggle    = {this.toggle('nested_parent')}>
                                        Tambah Dossage
                                    </ModalHeader>
                                    <ModalBody>
                                        <Label>Nama Dossage</Label>
                                        <Input type = "namadossage" value = {this.state.inputtedName} onChange = {evt => this.updateInputValue(evt)} name = "namadossage" placeholder = "Nama Dossage" />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color = "primary" onClick = {this.toggle('nested')}>
                                            Simpan
                                    </Button>
                                        <Modal
                                            isOpen = {this.state.modal_nested}
                                            toggle = {this.toggle('nested')}>
                                            <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                            <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                                            <ModalFooter>
                                                <Button color = "primary" onClick = {
                                                    this.insertMasterUnit(this.state.inputtedName)}>
                                                    Ya
                                                </Button>{' '}
                                                <Button
                                                    color   = "secondary"
                                                    onClick = {this.toggle('nested')}>
                                                    Tidak
                                            </Button>
                                            </ModalFooter>
                                        </Modal>
                                        {' '}
                                        <Button color = "secondary" onClick = {this.toggle('nested_parent')}>
                                            Batal
                                         </Button>
                                    </ModalFooter>
                                </Modal>

                                <Modal
                                    isOpen = {this.state.modal_delete}
                                    toggle = {this.toggle('delete')}>
                                    <ModalHeader>Konfirmasi Penghapusan</ModalHeader>
                                    <ModalBody>Apakah Anda yakin ingin menghapus data {this.state.activeName} ini?</ModalBody>
                                    <ModalFooter>
                                        <Button color = "primary" onClick = {this.deleteDossage(this.state.activeItemId)}>
                                            Ya
                                        </Button>{' '}
                                        <Button
                                            color   = "secondary"
                                            onClick = {this.toggle('delete')}>
                                            Tidak
                                        </Button>
                                    </ModalFooter>
                               </Modal>
                               
                            </CardHeader>
                            <CardBody>

                                <Table
                                style={{
                                    marginTop: "15px"
                                }} 
                                responsive
                                >
                                    <thead>
                                        <tr width = "100%">
                                        <th width = "20%">Kode Dossage</th>
                                        <th width = "70%">Nama Dosage</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.map(dossage =>
                                            <tr>
                                                <th scope = "row">{dossage.dsgform_code}
                                                </th>
                                                <td>{dossage.dsgform_name}</td>
                                                {console.log(dossage.dsgform_activeYN)}
                                                
                                                <td>
                                                    <Button size = "sm" onClick = {()=>this.openModalWithItemID(dossage.dsgform_code, dossage.dsgform_name)} color = "danger" style = {{display: "inline-flex", alignItems: "center"}}><MdDelete style = {{marginRight: "7px"}}></MdDelete>Delete</Button>
                                                </td>
                                                
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </CardBody>

                            <InputGroup
                                style={{
                                    marginLeft:"1.5vw"
                                }}>
                                        <InputGroupAddon>Data per Page</InputGroupAddon>
                                        <select 
                                            name="todosPerPage"
                                            value={this.state.value}
                                            onChange={(e) => this.handleSelect(e)}>
                                                <option value="5">5</option>
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                            </select>
                                     </InputGroup>

                                     <br/>

                             <Form
                             inline
                             className="cr-search-form"
                             style={{
                                 textAlign:"center",
                                 justifyContent:"center",
                                 marginBottom: "20px"
                             }}
                             >
                             <Button  
                                    value = {this.state.currentPage}
                                    onClick={(e) => this.handleFirst(e)}>First</Button>
                                <Button 
                                    value = {this.state.currentPage}
                                    onClick={(e) => this.handleWrite(e,-1)}>Prev</Button>
                        

                                <Button
                                    disabled
                                    style={{width:'auto'}}
                                    color= "primary"
                                >{this.state.currentPage+" / "+this.state.pageCount} 
                            
                                </Button>

                                <Button
                                    value = {this.state.currentPage}
                                    onClick={(e) => this.handleWrite(e,1)}>Next</Button>

                                <Button 
                                    value = {this.state.currentPage} 
                                    onClick={(e) => this.handleLast(e,this.state.pageCount)}>Last</Button>
                             </Form>
                        </Card>
                    </Col>
                </Row>
            </Page>
        );
    }


}
export default DossagePage;
