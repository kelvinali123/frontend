import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import Barcode from 'react-barcode';
import QRCode from 'qrcode.react'
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

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

class PrintPackingList extends React.Component {

    render() {
        var classes = " " + this.props.className;

        var date;
        var time;
        var tglPL;

        try {
            const d = this.props.currentDate;
            date = `${d.getDate().toPrecision(2)}-${MONTHS[d.getMonth()]}-${d.getFullYear()}`;
    
            const minutes = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes();
            const seconds = d.getSeconds().toString().length == 1 ? '0' + d.getSeconds() : d.getSeconds();
            time = `${d.getHours()}:${minutes}:${seconds}`;
    
            const THP_TglPL = this.props.THP_TglPL ? this.props.THP_TglPL : '1900-01-01';
            const tglPLDate = THP_TglPL.substr(8, 2);
            const tglPLMonth = MONTHS[parseInt(THP_TglPL.substr(5, 2)) - 1];
            const tglPLYear = THP_TglPL.substr(0, 4);
            tglPL = `${tglPLDate}-${tglPLMonth}-${tglPLYear}`;
        } catch (error) {
            date = '1900-01-01';
            time = '00:00:00'
            tglPL = '1900-01-01'
        }

        return (
            <Card className={"m-1 p-4" + classes}>
                <CardHeader>
                    <Row className='d-flex justify-content-between'>
                        <Label>{date}</Label>
                        <Label>Page : 1</Label>
                    </Row>
                    <Row className='d-flex justify-content-between'>
                        <Label>{time}</Label>
                        <Label className='font-weight-bold'>ASLI</Label>
                    </Row>
                    <Row className='d-flex justify-content-center'>
                        <h2 className='font-weight-bold'>Laporan Packing List</h2>
                    </Row>
                </CardHeader>

                <CardBody>
                    <div className='mt-4 mb-5 mr-4 d-flex justify-content-between align-items-center' >
                        <Barcode format='CODE39' height={50} displayValue={false} value={this.props.THP_NoPL} />
                        <QRCode size={100} value={this.props.THP_NoPL != null ? this.props.THP_NoPL : ''} />
                    </div>
                    <Form>
                        <Row form className='d-flex justify-content-around'>
                            <Col xs={5} md={5}>
                                <FormGroup row>
                                    <Label className="mt-1 font-weight-bold">No. Packing List</Label>
                                    <Label className='w-100 text-wrap'>{this.props.THP_NoPL}</Label>
                                </FormGroup>
                            </Col>

                            <Col xs={5} md={5}>
                                <FormGroup row>
                                    <Label className="mt-1 font-weight-bold">Penerima</Label>
                                    <Label className='w-100 text-wrap'>{this.props.Out_Name}</Label>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row form className='d-flex justify-content-around'>
                            <Col xs={5} md={5}>
                                <FormGroup row>
                                    <Label className="mt-1 font-weight-bold">Tgl Packing List</Label>
                                    <Label className='w-100 text-wrap'>{tglPL}</Label>
                                </FormGroup>
                            </Col>

                            <Col xs={5} md={5}>
                                <FormGroup row>
                                    <Label className="mt-1 font-weight-bold">Tujuan</Label>
                                    <Label className='w-100 text-wrap'>{this.props.Out_Name}</Label>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row form className='d-flex justify-content-around'>
                            <Col xs={5} md={5}></Col>

                            <Col xs={5} md={5}>
                                <FormGroup row>
                                    <Label className="mt-1 font-weight-bold">No POD</Label>
                                    <Label className='w-100 text-wrap d-flex justify-content-between'>
                                        <span>{this.props.THP_NoPOD}</span>
                                        <span>{this.props.Out_Code} ==> {this.props.THP_DistName}</span>
                                    </Label>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>

                    <Table bordered className="mt-3">
                        <thead>
                            <tr>
                                <th className="text-center">No. DO</th>
                                <th>Nama Produk</th>
                                <th className="text-center">Batch</th>
                                <th className="text-center">Qty S1s</th>
                                <th className="text-center">Berat Resi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr align="center">
                                <td>{this.props.noDO}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>{parseFloat(this.props.totalBerat).toFixed(2)}</td>
                            </tr>
                            {
                                this.props.transFD &&
                                this.props.transFD.map(transFD => 
                                    <tr>
                                        <td></td>
                                        <td>{transFD.pro_name}</td>
                                        <td className="text-center">{transFD.trans_fd_batch_number}</td>
                                        <td className="text-center">{transFD.trans_fd_qty_scan}</td>
                                        <td></td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>

                    <Card className='mt-3'></Card>
                    <Row form className='mt-3 mb-2 d-flex justify-content-end'>
                        <Label><span className="mr-5 font-weight-bold">Total Berat Resi: </span>{parseFloat(this.props.totalBerat).toFixed(2)}</Label>
                    </Row>
                    <Card></Card>
                </CardBody>
            </Card>
        );
    }
}

export default PrintPackingList;